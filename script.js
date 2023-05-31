const $modal = document.getElementById('modal');
const $descriptionInput = document.getElementById('description');
const $priorityInput = document.getElementById('priority');
const $contactInput = document.getElementById('contact');
const $datelineInput = document.getElementById('dateline');
const $idInput = document.getElementById('idInput');

const $todoColumnBody = document.querySelector('#todoColumn .column-body');

const $modeEdition = document.getElementById('modeEdition');
const $modeCreation = document.getElementById('modeCreation');

const $modeEditionBtn = document.getElementById('modeEditionBtn');
const $modeCreationBtn = document.getElementById('modeCreationBtn');


var todoList = [];

// Função para adicionar abrir a caixa da nova tarefa
function openModal (id) {
    $modal.style.display = "flex";
    
    // Condição para identificar se a caixa está recendo um ID...
    // Se estiver significa que o usuario irá editar a task
    // Senão estiver recendo o ID é porque está sendo criada uma nova Task

    if(id) {

        $modeCreation.style.display = "none";
        $modeCreationBtn.style.display = "none";

        $modeEdition.style.display = 'block';
        $modeEditionBtn.style.display = 'block';


        const index = todoList.findIndex(function (task) {
            return task.id == id; 
        });

        const task = todoList[index];

        $idInput.value = task.id;
        $descriptionInput.value = task.description;
        $priorityInput.value = task.priority;
        $contactInpu.value = task.contact;
        $datelineInput.value = task.dateline;

    } else {
        $modeCreation.style.display = "block";
        $modeCreationBtn.style.display = "block";

        $modeEdition.style.display = 'none';
        $modeEditionBtn.style.display = 'none';
    }

}

// Função para fechar a caixa da nova tarefa
function closeModal () {
    $modal.style.display = "none";

    //Limpando os input quando o modal for fechado
    $idInput.value = "";
    $descriptionInput.value = "";
    $priorityInput.value = "";
    $contactInput.value = "";
    $datelineInput.value = "";
}


// Função para adicionar novos cards com os valores do Array
function generateCards() {
    const todoListHtml = todoList.map(function(task) {
    const formatarData = moment(task.dateline).format('DD/MM/YYYY');
        return `
            <div class="card" ondblclick="openModal(${task.id})">
                <div class="info">
                    <b>Descrição:</b>
                    <span>${task.description}</span>
                </div>

                <div class="info">
                    <b>Prioridade:</b>
                    <span>${task.priority}</span>
                </div>

                <div class="info">
                    <b>Contato:</b>
                    <span>${task.contact}</span>
                </div>

                <div class="info">
                    <b>Prazo:</b>
                    <span>${formatarData}</span>
                </div>
            </div>
        `;
    });

    $todoColumnBody.innerHTML = todoListHtml.join(''); 
}

// Função para armazenar os objetos do array
function createTask() { 

    const newTask = {
        id: Math.floor(Math,radom() * 9999999), // Id aleatorio para cada task gerada
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        contact: $contactInput.value,
        dateline: $datelineInput.value,
    }

        todoList.push(newTask)
  
        closeModal();
        generateCards();
}


function updateTask() { 
    const task = {
        id: $idInput.value,
        description: $descriptionInput.value,
        priority: $priorityInput.value,
        contact: $contactInput.value,
        dateline: $datelineInput.value,
    }

    const index = todoList.findIndex(function (task) {
        return task.id == $idInput.value;
    });

    todoList[index] = task;

    closeModal();
    generateCards();
}