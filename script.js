// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCF7O5Q4ioDSzHS-Y0PC7hrGJ9xaCfols0",
    authDomain: "casanova-d5ea9.firebaseapp.com",
    projectId: "casanova-d5ea9",
    storageBucket: "casanova-d5ea9.appspot.com",
    messagingSenderId: "206624085905",
    appId: "1:206624085905:web:b527919d05a84369c32c30",
    measurementId: "G-JH48KJED1E"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variáveis Globais
let selectedGiftId = null;

// Carregar presentes disponíveis
async function loadGifts() {
    const giftGrid = document.getElementById('giftGrid');
    giftGrid.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, "presentes"));
        querySnapshot.forEach((doc) => {
            const gift = doc.data();
            const giftItem = document.createElement('div');
            giftItem.className = 'gift-item';

            giftItem.innerHTML = `
                <img src="${gift.imagem}" alt="${gift.nome}">
                <p>${gift.nome}</p>
                <button onclick="selectGift('${doc.id}', '${gift.nome}')">Selecionar</button>
            `;

            if (!gift.reservado) {
                giftGrid.appendChild(giftItem);
            }
        });
    } catch (error) {
        console.error("Erro ao carregar presentes:", error);
    }
}

// Selecionar um presente
function selectGift(giftId, giftName) {
    selectedGiftId = giftId;
    alert(`Você selecionou: ${giftName}`);
}

// Reservar presente
async function reserveGift() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();

    if (name === '') {
        alert('Por favor, insira seu nome!');
        return;
    }

    if (!selectedGiftId) {
        alert('Por favor, selecione um presente!');
        return;
    }

    try {
        // Atualizar o presente como reservado
        const giftDoc = doc(db, "presentes", selectedGiftId);
        await updateDoc(giftDoc, { reservado: true });

        // Adicionar pessoa à coleção "nomes"
        await addDoc(collection(db, "nomes"), { nome: name, presenteId: selectedGiftId });

        alert(`Obrigado, ${name}! Seu presente foi reservado.`);
        nameInput.value = '';
        selectedGiftId = null;

        loadGifts(); // Atualizar lista de presentes
    } catch (error) {
        console.error("Erro ao reservar presente:", error);
    }
}

// Adicionar novo presente
async function addGift() {
    const giftNameInput = document.getElementById('giftNameInput');
    const giftImageInput = document.getElementById('giftImageInput');

    const giftName = giftNameInput.value.trim();
    const giftImage = giftImageInput.value.trim();

    if (giftName === '' || giftImage === '') {
        alert('Por favor, preencha o nome e a URL da imagem!');
        return;
    }

    try {
        await addDoc(collection(db, "presentes"), { nome: giftName, imagem: giftImage, reservado: false });

        alert(`Presente "${giftName}" adicionado com sucesso!`);
        giftNameInput.value = '';
        giftImageInput.value = '';

        loadGifts(); // Atualizar lista de presentes
    } catch (error) {
        console.error("Erro ao adicionar presente:", error);
    }
}

// Eventos e carregamento inicial
window.selectGift = selectGift;
document.getElementById('reserveGiftButton').addEventListener('click', reserveGift);
document.getElementById('addGiftButton').addEventListener('click', addGift);
window.onload = loadGifts;
