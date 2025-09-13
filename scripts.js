// =======================================
// scripts.js - The "brain" of the Todo App
// =======================================
// This file makes the app interactive.
// It takes care of:
//  - Adding new tasks
//  - Marking tasks as completed
//  - Showing only "All", "Active", or "Completed" tasks
//  - Saving tasks in localStorage (so they don’t disappear when refreshing the page)

// 1. Grab important elements from the HTML (so we can control them with JS)
const taskInput = document.getElementById("task-input"); // The text box where the user types a task
const addTaskBtn = document.getElementById("add-task");  // The "+" button to add the task
const todosList = document.getElementById("todos-list"); // The <ul> where all tasks appear
const itemsLeft = document.getElementById("items-left"); // The text at the bottom saying "X items left"
const clearCompletedBtn = document.getElementById("clear-completed"); // Button to remove finished tasks
const emptyState = document.querySelector(".empty-state"); // Message "No tasks here yet"
const dateElement = document.getElementById("date"); // Where we show today’s date
const filters = document.querySelectorAll(".filter"); // The buttons: All | Active | Completed

// 2. Where we keep our data (an array of objects)
let todos = [];              // Example: [{ id: 1, text: "Buy milk", completed: false }]
let currentFilter = "all";   // By default, show ALL tasks

// 3. Event listeners = "when something happens, do something"
// When the user clicks the "+" button → add a task
addTaskBtn.addEventListener("click", () => {
  addTodo(taskInput.value);
});

// When the user presses ENTER inside the text box → also add a task
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(taskInput.value);
});

// When the user clicks "Clear completed" → remove ALL finished tasks at once
clearCompletedBtn.addEventListener("click", clearCompleted);

// 4. Functions = blocks of code that do specific jobs

// Add a new task
function addTodo(text) {
  if (text.trim() === "") return; // Ignore if the input is empty

  // Create a new task as an object
  const todo = {
    id: Date.now(),   // Unique ID (so each task is different, even with same text)
    text,             // The text the user typed
    completed: false, // New tasks always start as not completed
  };

  // Add the task to our list
  todos.push(todo);

  // Save tasks and show them on the screen
  saveTodos();
  renderTodos();

  // Clear the input box (ready for the next task)
  taskInput.value = "";
}

// Save tasks to localStorage (so they stay even after refreshing)
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos)); // Store array as text
  updateItemsCount();   // Update "X items left"
  checkEmptyState();    // Show/hide "No tasks here yet"
}

// Count how many tasks are not completed
function updateItemsCount() {
  const uncompletedTodos = todos.filter((todo) => !todo.completed);
  // Example: If 2 tasks are not completed → "2 items left"
  itemsLeft.textContent = `${uncompletedTodos.length} item${
    uncompletedTodos.length !== 1 ? "s" : ""
  } left`;
}

// Check if the list is empty and show the "No tasks here yet" message
function checkEmptyState() {
  const filteredTodos = filterTodos(currentFilter);
  if (filteredTodos.length === 0) emptyState.classList.remove("hidden");
  else emptyState.classList.add("hidden");
}

// Decide which tasks to show depending on the filter
function filterTodos(filter) {
  switch (filter) {
    case "active":     // Show only unfinished tasks
      return todos.filter((todo) => !todo.completed);
    case "completed":  // Show only finished tasks
      return todos.filter((todo) => todo.completed);
    default:           // Show all tasks
      return todos;
  }
}

// Show tasks on the screen
function renderTodos() {
  todosList.innerHTML = ""; // Clear the list first

  const filteredTodos = filterTodos(currentFilter); // Apply current filter

  // For each task in the list...
  filteredTodos.forEach((todo) => {
    // Create a list item <li>
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) todoItem.classList.add("completed"); // Add strike-through style if done

    // Create the checkbox
    const checkboxContainer = document.createElement("label");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed; // Checked if already completed
    checkbox.addEventListener("change", () => toggleTodo(todo.id)); // Toggle on click

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    // Create the text
    const todoText = document.createElement("span");
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    // Create the delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    // Put everything together inside the <li>
    todoItem.appendChild(checkboxContainer);
    todoItem.appendChild(todoText);
    todoItem.appendChild(deleteBtn);

    // Add <li> into the <ul>
    todosList.appendChild(todoItem);
  });
}

// Remove all finished tasks
function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

// Switch task status: from active → completed, or the opposite
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed }; // Flip the completed value
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

// Delete a single task
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

// Load tasks from localStorage when the page starts
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) todos = JSON.parse(storedTodos);
  renderTodos();
}

// Make filter buttons work
filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    setActiveFilter(filter.getAttribute("data-filter"));
  });
});

// Highlight the active filter
function setActiveFilter(filter) {
  currentFilter = filter;

  filters.forEach((item) => {
    if (item.getAttribute("data-filter") === filter) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  renderTodos();
}

// Show today’s date in the header (e.g. "Saturday, Sep 13")
function setDate() {
  const options = { weekday: "long", month: "short", day: "numeric" };
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("en-US", options);
}

// Start the app when the page is ready
window.addEventListener("DOMContentLoaded", () => {
  loadTodos();        // Bring back saved tasks
  updateItemsCount(); // Show how many are left
  setDate();          // Show today’s date
});
