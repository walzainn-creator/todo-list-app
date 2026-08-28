class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoTasks';
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clearAll').addEventListener('click', () => this.clearAll());
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const taskText = input.value.trim();

        if (!taskText) {
            alert('يرجى إدخال مهمة');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toLocaleString('ar-SA')
        };

        this.tasks.push(newTask);
        this.saveTasks();
        input.value = '';
        this.render();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const active = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('activeTasks').textContent = active;
    }

    clearCompleted() {
        if (confirm('هل أنت متأكد من حذف جميع المهام المكتملة؟')) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.render();
        }
    }

    clearAll() {
        if (confirm('هل أنت متأكد من حذف جميع المهام؟')) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    }

    saveTasks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem(this.storageKey);
        this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    }

    render() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            emptyState.classList.add('show');
        } else {
            emptyState.classList.remove('show');
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onchange="app.toggleTask(${task.id})"
                    >
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <span class="task-date">${task.createdAt}</span>
                    <button class="delete-btn" onclick="app.deleteTask(${task.id})">حذف</button>
                `;
                
                taskList.appendChild(li);
            });
        }

        this.updateStats();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// تهيئة التطبيق
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});
