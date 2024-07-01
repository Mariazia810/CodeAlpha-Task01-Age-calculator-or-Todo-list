document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const prioritySelect = document.getElementById('priority');
    const categorySelect = document.getElementById('category');

    // Load tasks from localStorage
    loadTasks();

    // Add task
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
        const category = categorySelect.value;
        if (taskText !== '') {
            addTask(taskText, priority, category);
            taskInput.value = '';
            prioritySelect.value = 'low';
            categorySelect.value = 'personal';
        }
    });

    // Add task on Enter key press
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });

    // Add a new task to the list
    function addTask(taskText, priority, category) {
        const li = document.createElement('li');
        li.classList.add(`priority-${priority}`);
        li.innerHTML = `
            <span>${taskText} (${category})</span>
            <button class="delete-task">X</button>
        `;

        li.querySelector('span').addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        li.querySelector('.delete-task').addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        taskList.appendChild(li);
        saveTasks();
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed'),
                priority: li.className.match(/priority-\w+/)[0].split('-')[1],
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text.replace(/\s\(\w+\)$/, ''), task.priority, task.text.match(/\((\w+)\)$/)[1]);
            if (task.completed) {
                taskList.lastChild.classList.add('completed');
            }
        });
    }
});
