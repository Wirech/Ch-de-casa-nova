import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, getDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Configuração do Firebase (substitua pelos dados do seu projeto)
const firebaseConfig = {
  apiKey: "AIzaSyCF7O5Q4ioDSzHS-Y0PC7hrGJ9xaCfols0",
  authDomain: "casanova-d5ea9.firebaseapp.com",
  projectId: "casanova-d5ea9",
  storageBucket: "casanova-d5ea9.firebasestorage.app",
  messagingSenderId: "206624085905",
  appId: "1:206624085905:web:b527919d05a84369c32c30",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Associar eventos de clique aos botões
document.getElementById("delete-presents-btn").addEventListener("click", deleteSelectedPresents);
document.getElementById("delete-names-btn").addEventListener("click", deleteSelectedNames);
// Captura do formulário de cadastro de presentes
document.getElementById("present-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evitar o recarregamento da página

  // Obter os valores dos campos
  const nome = document.getElementById("nome").value;
  const nomeImagem = document.getElementById("nome_imagem").value;

  // Validar os campos
  if (!nome || !nomeImagem) {
    //alert("Por favor, preencha todos os campos!");
    return;
  }

  try {
    // Adicionar ao Firestore e gerar um ID único
    const docRef = await addDoc(collection(db, "presentes"), {
      nome: nome,
      nome_imagem: nomeImagem,
      reservado: false,
    });

    //alert(`Presente cadastrado com sucesso! ID: ${docRef.id}`);
    document.getElementById("present-form").reset(); // Limpar o formulário
    showPresents(); // Recarregar a lista de presentes
  } catch (error) {
    console.error("Erro ao cadastrar presente:", error);
    //alert("Erro ao cadastrar presente. Tente novamente.");
  }
});
// Exibir os presentes e nomes cadastrados ao carregar a página
showPresents();
showNames();



// Adicionar evento de clique aos cards
function enableCardSelection(containerId) {
  const container = document.getElementById(containerId);
  container.addEventListener("click", (event) => {
    // Verifica se o clique foi em um card
    const card = event.target.closest(".card");
    if (card) {
      // Alterna a classe "selected"
      card.classList.toggle("selected");
    }
  });
}

// Função para exibir os presentes cadastrados
async function showPresents() {
  const presentList = document.getElementById("present-grid");
  presentList.innerHTML = ""; // Limpar lista antes de preencher

  const querySnapshot = await getDocs(collection(db, "presentes"));
  querySnapshot.forEach((docSnap) => {
    const present = docSnap.data();
    const card = document.createElement("div");
    card.classList.add("card");

    // Conteúdo do card, incluindo o ID
    card.innerHTML = `
      <h3>${present.nome}</h3>
      <p>ID:${docSnap.id}</p> <!-- Mostrar o ID gerado -->
    `;

    // Adicionar o card ao grid
    presentList.appendChild(card);
  });

  // Ativar seleção de cards no container de presentes
  enableCardSelection("present-grid");
}

// Função para exibir os nomes
async function showNames() {
  const nameList = document.getElementById("name-grid");
  nameList.innerHTML = ""; // Limpar lista antes de preencher

  const querySnapshot = await getDocs(collection(db, "nomes"));
  querySnapshot.forEach((docSnap) => {
    const name = docSnap.data();
    const card = document.createElement("div");
    card.classList.add("card");

    // Adicionar o ID do documento como data-id no card
    card.dataset.id = docSnap.id;

    // Conteúdo do card
    card.innerHTML = `
      <h3>${name.nome}</h3>
    `;

    // Adicionar o card ao grid
    nameList.appendChild(card);
  });

  // Ativar seleção de cards no container de nomes
  enableCardSelection("name-grid");
}


// Função para excluir presentes selecionados do banco de dados
async function deleteSelectedPresents() {
  const selectedCards = document.querySelectorAll("#present-grid .card.selected");
  
  if (selectedCards.length === 0) {
    //alert("Selecione pelo menos um presente para excluir.");
    return;
  }

  if (confirm("Tem certeza de que deseja excluir os presentes selecionados?")) {
    for (const card of selectedCards) {
      const presentName = card.querySelector("h3").textContent;

      // Obter referência aos documentos no Firestore
      const querySnapshot = await getDocs(collection(db, "presentes"));
      for (const docSnap of querySnapshot.docs) {
        if (docSnap.data().nome === presentName) {
          // Excluir o documento correspondente no Firestore
          await deleteDoc(doc(db, "presentes", docSnap.id));
        }
      }

      // Remover o card selecionado da interface
      card.remove();
    }
    //alert("Presentes excluídos com sucesso!");
  }
}

// Função para excluir nomes selecionados do banco de dados
async function deleteSelectedNames() {
  const selectedCards = document.querySelectorAll("#name-grid .card.selected");

  if (selectedCards.length === 0) {
    alert("Selecione pelo menos um nome para excluir.");
    return;
  }

  if (confirm("Tem certeza de que deseja excluir os nomes selecionados?")) {
    for (const card of selectedCards) {
      const nameId = card.dataset.id; // ID do nome selecionado

      // Obter o documento do nome específico
      const docSnap = await getDoc(doc(db, "nomes", nameId));
      
      if (docSnap.exists()) {
        const nameData = docSnap.data();
        const presentId = nameData.presenteId; // ID do presente reservado

        if (presentId) {
          const presentDocRef = doc(db, "presentes", presentId);

          // Atualizar o campo "reservado" do presente para false, apenas para esse presente específico
          await updateDoc(presentDocRef, {
            reservado: false,
          });
        }

        // Excluir o documento do nome específico no Firestore
        await deleteDoc(doc(db, "nomes", nameId));
      }

      // Remover o card selecionado da interface
      card.remove();
    }
    alert("Nomes excluídos com sucesso!");
  }
}

