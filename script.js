// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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

// Função para carregar tarefas
async function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        querySnapshot.forEach((doc) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${doc.data().task} 
                <button onclick="deleteTask('${doc.id}')">Excluir</button>
            `;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
    }
}

// Função para adicionar uma tarefa
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Por favor, insira uma tarefa!');
        return;
    }

    try {
        await addDoc(collection(db, "tasks"), { task: taskText });
        taskInput.value = '';
        loadTasks();
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
    }
}

// Função para excluir uma tarefa
async function deleteTask(id) {
    try {
        await deleteDoc(doc(db, "tasks", id));
        loadTasks();
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
    }
}

// Adicionar evento ao botão de adicionar tarefa
document.getElementById('addTaskButton').addEventListener('click', addTask);

// Carregar as tarefas ao abrir a página
window.onload = loadTasks;
