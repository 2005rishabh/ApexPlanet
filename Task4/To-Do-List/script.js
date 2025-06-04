// Select elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add a new task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        addTask(taskText);
        saveTask(taskText);
        taskInput.value = '';
    }
});

// Add task to DOM
function addTask(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (completed) li.classList.add('completed');

    li.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn">&times;</button>
    `;

    // Toggle completed
    li.querySelector('span').addEventListener('click', () => {
        li.classList.toggle('completed');
        updateTasks();
    });

    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        updateTasks();
    });

    taskList.appendChild(li);
}

// Save task to localStorage
function saveTask(text) {
    const tasks = getTasks();
    tasks.push({ text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Load tasks on page load
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => addTask(task.text, task.completed));
}

// Update localStorage when tasks change
function updateTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('clear-tasks').addEventListener('click', () => {
  if (confirm("Clear all tasks?")) {
    localStorage.removeItem('tasks');
    taskList.innerHTML = '';
  }
});

document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Persist theme
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
  loadTasks();
});
