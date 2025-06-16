import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { taskService, categoryService } from '@/services';

const AddTaskModal = ({ isOpen, onClose, task = null }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 2,
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategories();
if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          category: task.category || '',
          priority: task.priority || 2,
          dueDate: task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
        });
      }
    }
  }, [isOpen, task]);

  const loadCategories = async () => {
    try {
      const result = await categoryService.getAll();
      setCategories(result);
      if (result.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: result[0].Id }));
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
const taskData = {
        title: formData.title,
        description: formData.description,
        category: parseInt(formData.category, 10),
        priority: parseInt(formData.priority, 10),
        due_date: new Date(formData.dueDate).toISOString(),
        Name: formData.title
      };

      if (task) {
        await taskService.update(task.Id, taskData);
        toast.success('Task updated successfully!');
      } else {
        await taskService.create(taskData);
        toast.success('Task created successfully!');
      }
      
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: categories.length > 0 ? categories[0].Id : '',
        priority: 2,
        dueDate: format(new Date(), 'yyyy-MM-dd')
      });
    } catch (error) {
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 1, label: 'Low', color: 'text-success' },
    { value: 2, label: 'Medium', color: 'text-warning' },
    { value: 3, label: 'High', color: 'text-error' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-gray-900">
                {task ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Task Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
                required
                placeholder="Enter task title"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                  placeholder="Add a description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-error">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200
                    ${errors.category ? 'border-error' : 'border-gray-300'}
                  `}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
<option key={category.Id} value={category.Id}>
                      {category.Name || category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-error">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priorityOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('priority', option.value)}
                      className={`
                        p-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${formData.priority === option.value
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                error={errors.dueDate}
                required
                min={format(new Date(), 'yyyy-MM-dd')}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  {task ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTaskModal;