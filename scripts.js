// =======================================
// scripts.js - O "cérebro" da Todo App
// scripts.js - The "brain" of the Todo App
// =======================================
//
// PT: Este ficheiro torna a aplicação interativa.
// EN: This file makes the app interactive.
//
// PT: Responsável por:
// EN: Responsible for:
//  - Adicionar novas tarefas / Adding new tasks
//  - Marcar tarefas como concluídas / Marking tasks as completed
//  - Filtrar tarefas (Todas, Ativas, Concluídas) / Filtering tasks
//  - Guardar tarefas no localStorage / Saving tasks in localStorage
//

// =======================================
// 1. Selecionar elementos importantes do HTML
// 1. Grab important HTML elements
// =======================================

const taskInput = document.getElementById("task-input");      // PT: Caixa de texto | EN: Input field
const addTaskBtn = document.getElementById("add-task");       // PT: Botão "+" | EN: "+" button
const todosList = document.getElementById("todos-list");      // PT: Lista UL | EN: UL list
const itemsLeft = document.getElementById("items-left");      // PT: Contador | EN: Items counter
const clearCompletedBtn = document.getElementById("clear-completed"); // PT: Limpar concluídas | EN: Clear completed
const emptyState = document.querySelector(".empty-state");    // PT: Mensagem "vazio" | EN: Empty state message
const dateElement = document.getElementById("date");          // PT: Data atual | EN: Today's date
const filters = document.querySelectorAll(".filter");         // PT: Filtros | EN: Filter buttons

// =======================================
// 2. Estrutura de dados
// 2. Data structure
// =======================================

let todos = [];              // PT: Lista de tarefas | EN: Array of tasks
let currentFilter = "all";   // PT: Filtro atual | EN: Current filter

// =======================================
// 3. Event Listeners (ações do utilizador)
// 3. Event Listeners (user actions)
// =======================================

// PT: Clicar no botão "+" → adicionar tarefa
// EN: Clicking "+" button → add task
addTaskBtn.addEventListener("click", () => {
  addTodo(taskInput.value);
});

// PT: Premir ENTER → adicionar tarefa
// EN: Pressing ENTER → add task
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(taskInput.value);
});

// PT: Limpar todas as concluídas
// EN: Clear all completed tasks
clearCompletedBtn.addEventListener("click", clearCompleted);

// =======================================
// 4. Funções principais
// 4. Main functions
// =======================================

// PT: Adicionar nova tarefa
// EN: Add a new task
function addTodo(text) {
  if (text.trim() === "") return; // PT: Ignorar vazio | EN: Ignore empty input

  const todo = {
    id: Date.now(),     // PT: ID único | EN: Unique ID
    text,               // PT: Texto da tarefa | EN: Task text
    completed: false,   // PT: Começa por não concluída | EN: Starts incomplete
  };

  todos.push(todo);
  saveTodos();
  renderTodos();
  taskInput.value = ""; // PT: Limpar input | EN: Clear input
}

// PT: Guardar no localStorage
// EN: Save to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  updateItemsCount();
  checkEmptyState();
}

// PT: Contar tarefas por concluir
// EN: Count uncompleted tasks
function updateItemsCount() {
  const uncompleted = todos.filter((todo) => !todo.completed);
  itemsLeft.textContent = `${uncompleted.length} item${
    uncompleted.length !== 1 ? "s" : ""
  } left`;
}

// PT: Mostrar/ocultar estado vazio
// EN: Show/hide empty state
function checkEmptyState() {
  const filtered = filterTodos(currentFilter);
  filtered.length === 0
    ? emptyState.classList.remove("hidden")
    : emptyState.classList.add("hidden");
}

// PT: Filtrar tarefas
// EN: Filter tasks
function filterTodos(filter) {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
}

// PT: Renderizar tarefas no ecrã
// EN: Render tasks on screen
function renderTodos() {
  todosList.innerHTML = ""; // PT: Limpar lista | EN: Clear list

  const filtered = filterTodos(currentFilter);

  filtered.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) todoItem.classList.add("completed");

    // === Checkbox ===
    const checkboxContainer = document.createElement("label");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    // === Texto ===
    const todoText = document.createElement("span");
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    // === Botão apagar ===
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    // PT: Montar o item
    // EN: Assemble the item
    todoItem.appendChild(checkboxContainer);
    todoItem.appendChild(todoText);
    todoItem.appendChild(deleteBtn);

    todosList.appendChild(todoItem);
  });
}

// PT: Remover todas as concluídas
// EN: Remove all completed tasks
function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

// PT: Alternar estado (ativo ↔ concluído)
// EN: Toggle task status (active ↔ completed)
function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

// PT: Apagar uma tarefa
// EN: Delete a single task
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

// PT: Carregar tarefas guardadas
// EN: Load saved tasks
function loadTodos() {
  const stored = localStorage.getItem("todos");
  if (stored) todos = JSON.parse(stored);
  renderTodos();
}

// PT: Ativar filtros
// EN: Enable filters
filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    setActiveFilter(filter.getAttribute("data-filter"));
  });
});

// PT: Destacar filtro ativo
// EN: Highlight active filter
function setActiveFilter(filter) {
  currentFilter = filter;

  filters.forEach((item) => {
    item.classList.toggle(
      "active",
      item.getAttribute("data-filter") === filter
    );
  });

  renderTodos();
}

// PT: Mostrar data atual
// EN: Display today's date
function setDate() {
  const options = { weekday: "long", month: "short", day: "numeric" };
  dateElement.textContent = new Date().toLocaleDateString("en-US", options);
}

// PT: Iniciar aplicação
// EN: Initialize app
window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  updateItemsCount();
  setDate();
});
