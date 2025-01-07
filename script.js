import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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

// Variáveis
const presentList = document.getElementById("present-list");
const nameInputContainer = document.getElementById("name-input-container");
const personNameInput = document.getElementById("person-name");
const reserveButton = document.getElementById("reserve-button");
let selectedPresent = null;
const selectedPresentContainer = document.getElementById("selected-present-container");
const selectedPresentCard = document.getElementById("selected-present-card");
const mainElement = document.querySelector("main");
const errorMessage = document.getElementById('error-message');

// Carregar presentes ao abrir a página
showPresents();

// Função para exibir os presentes
async function showPresents() {
    const presentList = document.getElementById("present-list");
  
    // Limpa a lista antes de atualizar
    presentList.innerHTML = "";
  
    // Obter os presentes da coleção, ordenando pelo campo "reservado"
    const presentsQuery = query(
      collection(db, "presentes"),
      orderBy("nome")       // Ordena depois pelo nome de forma alfabética
    );
  
    // Obter os presentes da coleção
    const querySnapshot = await getDocs(presentsQuery);
  
    // Armazenar os presentes em uma lista para ordenação adicional
    const presents = [];
  
    querySnapshot.forEach((doc) => {
      const present = doc.data();
      presents.push({ id: doc.id, ...present });
    });
  
    // Ordenar os presentes manualmente, separando os não reservados e reservados
    const sortedPresents = [
      ...presents.filter((present) => !present.reservado),  // Não reservados
      ...presents.filter((present) => present.reservado)   // Reservados
    ];
  
    // Criar os cards de presentes
    sortedPresents.forEach((present) => {
      const presentCard = document.createElement("li");
      presentCard.classList.add("present-card");
      presentCard.dataset.id = present.id;
      presentCard.dataset.nome_imagem = present.nome_imagem;

  
      // Gerar o caminho da imagem
      const imagePath = `Imagens/${present.nome_imagem}.jpg`;
  
      // Criar a imagem
      const img = document.createElement("img");
      img.src = imagePath;
      img.alt = present.nome;
      img.classList.add("present-image");
  
      // Criar o nome do presente
      const name = document.createElement("p");
      name.textContent = present.nome;
  
      // Se o presente estiver reservado, adicionar a classe 'reserved'
      if (present.reservado) {
        presentCard.classList.add('reserved');
      }
  
      // Adicionar a imagem e o nome ao card
      presentCard.appendChild(img);
      presentCard.appendChild(name);
  
      // Adicionar o card à lista de presentes
      presentList.appendChild(presentCard);
    });
  }

  // Seleciona um presente
presentList.addEventListener("click", (event) => {
  const target = event.target.closest('li');
  if (!target) return;

  // Verifica se o card clicado já está selecionado
  if (target.classList.contains('selected')) {
    target.classList.remove('selected');
    hideNameInputContainer();
    selectedPresent = null;

    // Ocultar o card do presente selecionado
    selectedPresentContainer.style.display = "none";
  } else {
    // Remove a seleção do card de todos os outros
    const allCards = presentList.querySelectorAll('li');
    allCards.forEach(card => card.classList.remove('selected'));

    // Adiciona a seleção ao card clicado
    target.classList.add('selected');
    
    // Exibe o campo de nome e o botão com animação
    showNameInputContainer();
    selectedPresent = target; 

    // Exibir o card de "Presente selecionado"
    selectedPresentContainer.style.display = "block";

    // Criar o card do presente selecionado
    const selectedPresentName = target.querySelector("p").textContent;
    const selectedPresentImagePath = `Imagens/${selectedPresent.dataset.nome_imagem}.jpg`;

    // Limpa o conteúdo atual do card de presente selecionado
    selectedPresentCard.innerHTML = "";

    // Criar a imagem
    const selectedImg = document.createElement("img");
    selectedImg.src = selectedPresentImagePath;
    selectedImg.alt = selectedPresentName;
    selectedImg.classList.add("selected-present-image");

    // Criar o nome do presente
    const selectedName = document.createElement("p");
    selectedName.textContent = selectedPresentName;
    selectedName.classList.add("selected-present-name");

    // Adicionar imagem e nome ao card
    selectedPresentCard.appendChild(selectedImg);
    selectedPresentCard.appendChild(selectedName);

    // Rola até o final da página
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
});

 // Função para exibir o campo de nome
function showNameInputContainer() {
    let startOpacity = 0;
    let startTransform = -20; // Inicia acima da tela
  
    nameInputContainer.style.display = "block"; // Torna o campo visível
    
    // Função de animação
    function animate() {
      startOpacity += 0.05;
      startTransform += 1;  // Move para baixo conforme a animação
  
      nameInputContainer.style.opacity = startOpacity;
      nameInputContainer.style.transform = `translateY(${startTransform}px)`;
  
      if (startOpacity < 1) {
        requestAnimationFrame(animate);
      } else {
        nameInputContainer.style.pointerEvents = "auto"; // Permite interação após a animação
      }
    }
  
    requestAnimationFrame(animate);
  }
  
  // Função para ocultar o campo de nome 
  function hideNameInputContainer() {
    let startOpacity = 1;
    let startTransform = 0; // Inicia na posição final
  
    // Função de animação
    function animate() {
      startOpacity -= 0.05;
      startTransform -= 1;  // Move para cima conforme a animação
  
      nameInputContainer.style.opacity = startOpacity;
      nameInputContainer.style.transform = `translateY(${startTransform}px)`;
  
      if (startOpacity > 0) {
        requestAnimationFrame(animate);
      } else {
        nameInputContainer.style.pointerEvents = "none"; // Impede a interação após a animação
        nameInputContainer.style.display = "none"; // Torna o campo invisível
      }
    }
  
    requestAnimationFrame(animate);
  }
  
// Reserva o presente selecionado
reserveButton.addEventListener("click", async () => {

    const personName = personNameInput.value.trim();
    
    if (!personName) {
        showToast("Por favor, preencha o seu nome!");
        return;
    }

    // Obter os dados do presente selecionado
    const selectedPresentName = selectedPresent.querySelector("p").textContent;
    const selectedPresentId = selectedPresent.dataset.id;  // Supondo que o ID seja armazenado no data-id do li
    
    if (!selectedPresentId) {
        alert("Erro: Não foi possível obter o ID do presente.");
        return;
    }
    
    // Adicionar o nome e o presente na coleção "nomes"
    try {
        // Adiciona o nome e o presente à coleção "nomes"
        await addDoc(collection(db, "nomes"), {
            nome: personName,
            presente: selectedPresentName,
            presenteId: selectedPresentId,  // Salva o ID do presente
            dataReserva: new Date()
        });

        // Atualizar o status do presente para "reservado"
        await updatePresentStatus(selectedPresentId); // Agora passando o ID do presente
        // Marcar o presente como reservado na interface
        selectedPresent.classList.add('reserved');
       // Exibir notificação de sucesso
       showToast(`Obrigado por reservar um ${selectedPresentName}, ${personName}!`);

        // Remonta os presentes
        await showPresents();

        // Opcional: Limpar o nome e desmarcar o item
        personNameInput.value = '';
        selectedPresent.classList.remove('selected');
        nameInputContainer.style.display = "none";
        selectedPresent = null;
    } catch (error) {
        console.error("Erro ao salvar reserva:", error);
        alert("Ocorreu um erro ao reservar o presente. Tente novamente.");
    }
});

// Função para atualizar o status de reserva do presente
async function updatePresentStatus(presentId) {
    try {
        // Obter a referência ao documento do presente com o ID correto
        const presentRef = doc(db, "presentes", presentId); // Usando o ID do presente
        await updateDoc(presentRef, {
            reservado: true,  // Atualiza o status do presente
        });
        console.log(`Status do presente ${presentId} atualizado para 'reservado'`);
    } catch (error) {
        console.error("Erro ao atualizar o status do presente:", error);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    // Remover a notificação após 5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}
