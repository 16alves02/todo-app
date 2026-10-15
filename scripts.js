const STORAGE_KEY = "todos";

const taskForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const todosList = document.getElementById("todos-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.getElementById("empty-state");
const emptyStateMessage = document.getElementById("empty-state-message");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");

let todos = [];
let currentFilter = "all";

// Use the form submit event so the button and Enter key work the same way.
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(taskInput.value);
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    setActiveFilter(filterButton.dataset.filter);
  });
});

function addTodo(value) {
  const text = value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  todos.push({
    id: Date.now(),
    text,
    completed: false,
  });

  saveTodos();
  renderTodos();

  taskInput.value = "";
  taskInput.focus();
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    // The app remains usable for this session if browser storage is unavailable.
    console.warn("Tasks could not be saved in this browser.", error);
  }
}

function loadTodos() {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);

    if (!storedTodos) {
      todos = [];
      return;
    }

    const parsedTodos = JSON.parse(storedTodos);

    if (!Array.isArray(parsedTodos)) {
      throw new Error("Saved tasks must be a list.");
    }

    // Ignore invalid entries so a damaged storage value does not break the app.
    todos = parsedTodos.filter(
      (todo) =>
        todo &&
        (typeof todo.id === "number" || typeof todo.id === "string") &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean"
    );
  } catch (error) {
    console.warn("Saved tasks could not be loaded. Starting with an empty list.", error);
    todos = [];
  }
}

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

function renderTodos() {
  todosList.replaceChildren();

  const visibleTodos = filterTodos(currentFilter);

  visibleTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");

    if (todo.completed) {
      todoItem.classList.add("completed");
    }

    const checkboxContainer = document.createElement("label");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.setAttribute(
      "aria-label",
      todo.completed
        ? `Mark "${todo.text}" as active`
        : `Mark "${todo.text}" as completed`
    );
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");
    checkmark.setAttribute("aria-hidden", "true");

    checkboxContainer.append(checkbox, checkmark);

    const todoText = document.createElement("span");
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");
    deleteButton.setAttribute("aria-label", `Delete "${todo.text}"`);
    deleteButton.title = `Delete "${todo.text}"`;

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-times";
    deleteIcon.setAttribute("aria-hidden", "true");
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    todoItem.append(checkboxContainer, todoText, deleteButton);
    todosList.appendChild(todoItem);
  });

  updateItemsCount();
  updateEmptyState(visibleTodos.length);
}

function updateItemsCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  const itemLabel = remaining === 1 ? "item" : "items";

  itemsLeft.textContent = `${remaining} ${itemLabel} left`;
}

function updateEmptyState(visibleCount) {
  emptyState.classList.toggle("hidden", visibleCount > 0);

  const messages = {
    all: "No tasks here yet.",
    active: "No active tasks.",
    completed: "No completed tasks.",
  };

  emptyStateMessage.textContent = messages[currentFilter] || messages.all;
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function setActiveFilter(filter) {
  currentFilter = filter;

  filters.forEach((filterButton) => {
    const isActive = filterButton.dataset.filter === filter;

    filterButton.classList.toggle("active", isActive);
    filterButton.setAttribute("aria-pressed", String(isActive));
  });

  renderTodos();
}

function setDate() {
  const options = {
    weekday: "long",
    month: "short",
    day: "numeric",
  };

  dateElement.textContent = new Date().toLocaleDateString("en-GB", options);
}

window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  setDate();
  renderTodos();
});
