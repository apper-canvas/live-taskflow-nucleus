import categoryData from '../mockData/categories.json';
import { taskService } from '../index';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let categories = [...categoryData];

const categoryService = {
  async getAll() {
    await delay(250);
    const tasks = await taskService.getAll();
    
    // Update task counts
    const categoriesWithCounts = categories.map(category => ({
      ...category,
      taskCount: tasks.filter(task => task.category === category.Id).length
    }));
    
    return [...categoriesWithCounts];
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(c => c.Id === parseInt(id, 10));
    if (!category) return null;
    
    const tasks = await taskService.getAll();
    const taskCount = tasks.filter(task => task.category === category.Id).length;
    
    return { ...category, taskCount };
  },

  async create(categoryData) {
    await delay(350);
    const maxId = Math.max(...categories.map(c => c.Id), 0);
    const newCategory = {
      ...categoryData,
      Id: maxId + 1,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(300);
    const index = categories.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Category not found');
    
    const updatedCategory = { ...categories[index], ...categoryData };
    // Prevent Id modification
    delete updatedCategory.Id;
    updatedCategory.Id = categories[index].Id;
    
    categories[index] = updatedCategory;
    return { ...updatedCategory };
  },

  async delete(id) {
    await delay(300);
    const index = categories.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Category not found');
    
    const deleted = categories.splice(index, 1);
    return { ...deleted[0] };
  }
};

export default categoryService;