import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    return task ? { ...task } : null;
  },

  async getByCategory(categoryId) {
    await delay(250);
    return tasks.filter(t => t.category === categoryId).map(t => ({ ...t }));
  },

  async getTodayTasks() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => {
      const taskDate = new Date(t.dueDate).toISOString().split('T')[0];
      return taskDate <= today && !t.completed;
    }).map(t => ({ ...t }));
  },

  async getOverdueTasks() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => {
      const taskDate = new Date(t.dueDate).toISOString().split('T')[0];
      return taskDate < today && !t.completed;
    }).map(t => ({ ...t }));
  },

  async create(taskData) {
    await delay(400);
    const maxId = Math.max(...tasks.map(t => t.Id), 0);
    const newTask = {
      ...taskData,
      Id: maxId + 1,
      completed: false,
      createdAt: new Date().toISOString(),
      order: tasks.length
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(350);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = { ...tasks[index], ...taskData };
    // Prevent Id modification
    delete updatedTask.Id;
    updatedTask.Id = tasks[index].Id;
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Task not found');
    
    const deleted = tasks.splice(index, 1);
    return { ...deleted[0] };
  },

  async reorder(taskIds) {
    await delay(250);
    taskIds.forEach((taskId, index) => {
      const task = tasks.find(t => t.Id === parseInt(taskId, 10));
      if (task) {
        task.order = index;
      }
    });
    return [...tasks];
  },

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(t => 
      t.title.toLowerCase().includes(lowercaseQuery) ||
      t.description.toLowerCase().includes(lowercaseQuery)
    ).map(t => ({ ...t }));
  }
};

export default taskService;