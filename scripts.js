// First, I grab all the important elements from the HTML so I can use them in my code
const taskInput = document.getElementById("task-input");       // The text box where I type the task
const addTaskBtn = document.getElementById("add-task");        // The button with the plus sign
const todosList = document.getElementById("todos-list");       // The list where tasks will be shown
const itemsLeft = document.getElementById("items-left");       // The counter at the bottom
const clearCompletedBtn = document.getElementById("clear-completed"); // Button to remove all completed tasks
const emptyState = document.querySelector(".empty-state");     // The "No tasks here yet" message
const dateElement = document.getElementById("date");           // Where today’s date shows
const filters = document.querySelectorAll(".filter");          // The filter buttons (All, Active, Completed)

// Here I keep all the tasks (as objects) in an array
let todos = [];
let currentFilter = "all"; // By default, show all tasks

// When I click the plus button, it adds a new task
addTaskBtn.addEventListener("click", () => {
  addTodo(taskInput.value);
});

// If I press "Enter" inside the text box, it also adds the task
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(taskInput.value);
});

// When I click "Clear completed", it removes all the tasks that are marked as done
clearCompletedBtn.addEventListener("click", clearCompleted);

// Function to add a new task
function addTodo(text) {
  if (text.trim() === "") return; // If the text is empty, do nothing

  // I create a new task object
  const todo = {
    id: Date.now(),       // Unique ID (based on the current time)
    text,                 // The text of the task
    completed: false,     // New tasks start as not completed
  };

  // Add this new task to the list
  todos.push(todo);

  // Save and re-render the tasks
  saveTodos();
  renderTodos();

  // Clear the input box
  taskInput.value = "";
}

// Save all tasks to localStorage (so they stay even if I refresh the page)
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  updateItemsCount();
  checkEmptyState();
}

// Update the counter of how many tasks are left
function updateItemsCount() {
  const uncompletedTodos = todos.filter((todo) => !todo.completed);
  itemsLeft.textContent = `${uncompletedTodos?.length} item${
    uncompletedTodos?.length !== 1 ? "s" : ""
  } left`;
}

// Check if the list is empty and show/hide the "No tasks" message
function checkEmptyState() {
  const filteredTodos = filterTodos(currentFilter);
  if (filteredTodos?.length === 0) emptyState.classList.remove("hidden");
  else emptyState.classList.add("hidden");
}

// Function that decides what tasks to show based on the filter
function filterTodos(filter) {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed); // only not completed
    case "completed":
      return todos.filter((todo) => todo.completed);  // only completed
    default:
      return todos; // all tasks
  }
}

// Show all the tasks on the screen
function renderTodos() {
  // Clear the list first
  todosList.innerHTML = "";

  // Get tasks depending on the current filter
  const filteredTodos = filterTodos(currentFilter);

  // For each task, create the HTML elements
  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) todoItem.classList.add("completed"); // Add strike-through if completed

    // Checkbox part
    const checkboxContainer = document.createElement("label");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed; // If it’s done, keep it checked
    checkbox.addEventListener("change", () => toggleTodo(todo.id)); // Change status when clicked

    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    // Task text
    const todoText = document.createElement("span");
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    // Put everything together inside the list item
    todoItem.appendChild(checkboxContainer);
    todoItem.appendChild(todoText);
    todoItem.appendChild(deleteBtn);

    // Add the item into the full list
    todosList.appendChild(todoItem);
  });
}

// Remove all completed tasks
function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

// Toggle (switch) a task between completed and not completed
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

// Delete a single task by its id
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

// Add event listeners to the filter buttons
filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    setActiveFilter(filter.getAttribute("data-filter"));
  });
});

// Function to switch the filter (All, Active, Completed)
function setActiveFilter(filter) {
  currentFilter = filter;

  filters.forEach((item) => {
    if (item.getAttribute("data-filter") === filter) {
      item.classList.add("active"); // Highlight the chosen filter
    } else {
      item.classList.remove("active");
    }
  });

  renderTodos();
}

// Put today’s date in the header
function setDate() {
  const options = { weekday: "long", month: "short", day: "numeric" };
  const today = new Date();
  dateElement.textContent = today.toLocaleDateString("en-US", options);
}

// When the page is ready, load everything
window.addEventListener("DOMContentLoaded", () => {
  loadTodos();          // Load from localStorage
  updateItemsCount();   // Show how many tasks left
  setDate();            // Show today’s date
});