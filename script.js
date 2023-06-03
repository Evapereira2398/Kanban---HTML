const $modal = document.getElementById('modal');
const $descriptionInput = document.getElementById('description');
const $priorityInput = document.getElementById('priority');
const $contactInput = document.getElementById('contact');
const $datelineInput = document.getElementById('dateline');
const $idInput = document.getElementById('idInput');

const $modeEdition = document.getElementById('modeEdition');
const $modeCreation = document.getElementById('modeCreation');

const $modeEditionBtn = document.getElementById('modeEditionBtn');
const $modeCreationBtn = document.getElementById('modeCreationBtn');

var todoList = [];

//Função para recarregar a pagina quando for clicado na logo
function reload(){
    window.location.reload(); 
}

// Função para adicionar abrir a caixa da nova tarefa
function openModal(id, columnId) {
  $modal.style.display = 'flex';

  // Condição para identificar se a caixa está recebendo um ID...
  // Se estiver, significa que o usuário irá editar a tarefa
  // Senão estiver recebendo o ID é porque está sendo criada uma nova tarefa
  if (id) {
    $modeCreation.style.display = 'none';
    $modeCreationBtn.style.display = 'none';

    $modeEdition.style.display = 'block';
    $modeEditionBtn.style.display = 'block';

    const index = todoList.findIndex(function (task) {
      return task.id == id;
    });

    const task = todoList[index];

    $idInput.value = task.id;
    $descriptionInput.value = task.description;
    $priorityInput.value = task.priority;
    $contactInput.value = task.contact;
    $datelineInput.value = task.dateline;

  } else {

    $modeCreation.style.display = 'block';
    $modeCreationBtn.style.display = 'block';

    $modeEdition.style.display = 'none';
    $modeEditionBtn.style.display = 'none';
  }

  // Armazena o ID da coluna no elemento modal
  $modal.dataset.columnId = columnId;
}

// Função para fechar a caixa da nova tarefa
function closeModal() {
  $modal.style.display = 'none';

  // Limpando os inputs quando o modal for fechado
  $idInput.value = '';
  $descriptionInput.value = '';
  $priorityInput.value = '';
  $contactInput.value = '';
  $datelineInput.value = '';
}

// Função para adicionar novos cards com os valores do Array
function generateCards() {
  const columns = document.querySelectorAll('.column');
  columns.forEach(function (column) {
    const columnId = column.id.replace('column-', ''); // Obtém o ID da coluna atual

    const columnBody = column.querySelector('.column-body');
    if (!columnBody) return; // Verifica se o corpo da coluna existe antes de prosseguir

    const todoListHtml = todoList
      .filter(function (task) {
        return task.columnId == columnId; // Filtra as tarefas pelo ID da coluna
      })
      .map(function (task) {
        const formatarData = moment(task.dateline).format('DD/MM/YYYY');

        const card = document.createElement('div');
        card.classList.add('card');
        card.draggable = true; // Torna o card arrastável
        card.dataset.taskId = task.id; // Define o ID da tarefa no card

        // Define os eventos de arrastar e soltar
        card.addEventListener('dragstart', function (event) {
          event.dataTransfer.setData('text/plain', card.id);
        });

        card.addEventListener('dragend', function (event) {
          // Limpe qualquer estilo de destaque quando o card é arrastado e solto
          const columns = document.querySelectorAll('.column');
          columns.forEach(function (column) {
            column.classList.remove('dragover');
          });
        });

        card.innerHTML = `
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
        `;

        return card.outerHTML;
      });

    columnBody.innerHTML = todoListHtml.join('');
  });
}


// Função para armazenar os objetos do array
function createTask() {
    const columnId = $modal.dataset.columnId; // Obtém o ID da coluna atualmente selecionada no modal
  
    const newTask = {
      id: Math.floor(Math.random() * 9999999),
      columnId: parseInt(columnId),
      description: $descriptionInput.value,
      priority: $priorityInput.value,
      contact: $contactInput.value,
      dateline: $datelineInput.value,
    };
  
    todoList.push(newTask);
    closeModal();
    generateCards(); // Atualiza os cards exibidos em todas as colunas
  }

// Função para editar os cards adicionados  
function updateTask() {
    const columnId = $modal.dataset.columnId; // Obtém o ID da coluna atualmente selecionada no modal
  
    const task = {
      id: $idInput.value,
      columnId: parseInt(columnId),
      description: $descriptionInput.value,
      priority: $priorityInput.value,
      contact: $contactInput.value,
      dateline: $datelineInput.value,
    };
  
    const index = todoList.findIndex(function (task) {
      return task.id == $idInput.value;
    });
  
    todoList[index] = task;
    closeModal();
    generateCards(); // Atualiza os cards exibidos em todas as colunas
}

// Função para adicionar uma nova coluna
function addNewColumn() {
  const container = document.querySelector('.container');
  const rows = document.querySelectorAll('.row');
  let currentRow = rows[rows.length - 1]; // Última linha atual

  if (!currentRow || currentRow.childElementCount === 4) {
    // Se não houver nenhuma linha atual ou se a linha atual já tiver 4 colunas
    const newRow = document.createElement('div');
    newRow.classList.add('row');
    container.appendChild(newRow);
    currentRow = newRow; // Atualiza a referência para a nova linha
  }

  const newColumnId = Date.now(); // Gerar ID único para a nova coluna

  const newColumn = document.createElement('div');
  newColumn.classList.add('column');
  newColumn.id = `column-${newColumnId}`; // Definir o ID da coluna
  newColumn.innerHTML = `
    <div class="column-header">
      <span>Nova Coluna</span>
      <div class="btn-header-column">
        <button>
          <ion-icon id="edit-column-title" name="create-outline"></ion-icon>
        </button>
        <button onclick="openModal(null, ${newColumnId})">
          <ion-icon id="add-tarefa" name="add-outline"></ion-icon>
        </button>
        <button>
          <ion-icon id="delete-column" name="trash-outline"></ion-icon>
        </button>
      </div>
    </div>

    <!-- Corpo das colunas -->
    <div class="column-body"></div>
  `;

  currentRow.appendChild(newColumn); // Insere a nova coluna no final da linha

  addColumnEvents(newColumn); // Adiciona os eventos à nova coluna
  addColumnDragDropEvents(newColumn); // Adiciona os eventos de arrastar e soltar à nova coluna
  generateCards(newColumnId); // Atualiza os cards exibidos

  const content = document.querySelector('.content');
  const columns = document.querySelectorAll('.column');

  // Após adicionar a coluna, verifica se a classe "content" está vazia para remover a imagem e o texto
  if (columns.length === 1 && content.innerHTML.trim() !== '') {
    // Se houver apenas uma coluna e a classe "content" não estiver vazia, remove a imagem e o texto
    content.innerHTML = '';
  }
}


// Função para editar o nome das colunas
function addEditColumnNameEvent(column) {
  const editIcon = column.querySelector('#edit-column-title');
  const columnName = column.querySelector('.column-header span');

  editIcon.addEventListener('click', function () {
    const input = document.createElement('input');
    input.value = columnName.textContent;
    input.classList.add('edit-input');
    input.style.background = 'rgb(255, 255, 255, 0.6)';
    input.style.border = 'none';
    input.style.boxshadow = 'inset 2px 5px 10px rgba(0,0,0,0.3)';
    input.style.fontSize = '16px';
    input.style.borderRadius = '8px';

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        columnName.textContent = input.value;
        column.querySelector('.column-header').removeChild(input);
        columnName.style.display = ''; // Restaura a exibição do nome da coluna
      }
    });

    columnName.style.display = 'none'; // Esconde o nome original da coluna
    column.querySelector('.column-header').insertBefore(input, columnName); // Insere o input antes do elemento columnName
    input.focus();
  });
}

// Função para exclusão às colunas
function addDeleteColumnEvent(column) {
  const deleteIcon = column.querySelector('#delete-column');
  deleteIcon.addEventListener('click', function () {
    const shouldDelete = confirm('Tem certeza que deseja remover a coluna?');
    if (shouldDelete) {
      column.remove();
    }
  });
}



function addColumnDragDropEvents(column) {
  column.addEventListener('dragover', function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    column.classList.add('dragover'); // Adiciona uma classe para destacar a coluna quando um card é arrastado sobre ela
  });

  column.addEventListener('dragleave', function (event) {
    column.classList.remove('dragover'); // Remove a classe quando o card deixa de estar sobre a coluna
  });

  column.addEventListener('drop', function (event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);
    const newColumnId = column.id.replace('column-', '');
    const cardData = todoList.find(function (task) {
      return task.id == card.dataset.taskId;
    });

    cardData.columnId = parseInt(newColumnId);
    generateCards();
    column.classList.remove('dragover'); // Remove a classe de destaque da coluna após soltar o card
  });
}


// Função para adicionar os eventos à nova coluna
function addColumnEvents(column) {
  addDeleteColumnEvent(column);
  addEditColumnNameEvent(column);
}

// Evento de carregamento do DOM para adicionar manipulador de eventos de exclusão às colunas existentes
document.addEventListener('DOMContentLoaded', function () {
  const columns = document.querySelectorAll('.column');
  columns.forEach(function (column) {
    addColumnEvents(column);
  });
});
