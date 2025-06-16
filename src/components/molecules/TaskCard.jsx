import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import PriorityIndicator from '@/components/atoms/PriorityIndicator';
import CategoryBadge from '@/components/molecules/CategoryBadge';
import { taskService } from '@/services';

const TaskCard = ({ task, categories = [], onUpdate, onDelete, isDragging = false }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const category = categories.find(c => c.Id === task.category);
  const taskDate = new Date(task.dueDate);
  const isOverdue = isPast(taskDate) && !task.completed && !isToday(taskDate);

  const handleToggleComplete = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    
    try {
      const updatedTask = await taskService.update(task.Id, { 
        completed: !task.completed 
      });
      
      if (!task.completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 500);
        toast.success('Task completed! 🎉');
      } else {
        toast.info('Task marked as incomplete');
      }
      
      if (onUpdate) onUpdate(updatedTask);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.Id);
        toast.success('Task deleted successfully');
        if (onDelete) onDelete(task.Id);
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const formatDueDate = (date) => {
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300 }}
      whileHover={{ scale: isDragging ? 1 : 1.02, y: isDragging ? 0 : -2 }}
      className={`
        bg-white rounded-xl p-4 shadow-sm border border-gray-100 
        hover:shadow-md transition-all duration-200 cursor-pointer relative
        ${task.completed ? 'opacity-60' : ''}
        ${isDragging ? 'shadow-lg scale-105 rotate-2' : ''}
      `}
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0, 
                  x: '50%', 
                  y: '50%',
                  rotate: Math.random() * 360 
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1.5, 
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  rotate: Math.random() * 720 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`absolute w-2 h-2 rounded-full ${
                  ['bg-primary', 'bg-accent', 'bg-secondary', 'bg-warning'][i % 4]
                }`}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center min-w-0 flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleComplete}
            disabled={isCompleting}
            className={`
              flex-shrink-0 w-5 h-5 rounded border-2 mr-3 flex items-center justify-center
              transition-all duration-200
              ${task.completed 
                ? 'bg-accent border-accent' 
                : 'border-gray-300 hover:border-accent'
              }
              ${isCompleting ? 'animate-pulse' : ''}
            `}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.3 }}
              >
                <ApperIcon name="Check" size={12} className="text-white" />
              </motion.div>
            )}
          </motion.button>
          
          <div className="min-w-0 flex-1">
            <h3 className={`
              font-medium text-gray-900 break-words
              ${task.completed ? 'line-through text-gray-500' : ''}
            `}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1 break-words line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-error transition-colors rounded ml-2"
        >
          <ApperIcon name="Trash2" size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          {category && <CategoryBadge category={category} size="sm" />}
          
          <PriorityIndicator 
            priority={task.priority} 
            showPulse={isOverdue}
          />
        </div>

        <div className={`
          flex items-center
          ${isOverdue ? 'text-error' : isToday(taskDate) ? 'text-warning' : 'text-gray-500'}
        `}>
          <ApperIcon 
            name={isOverdue ? "AlertCircle" : "Calendar"} 
            size={12} 
            className="mr-1" 
          />
          <span className="font-medium">
            {formatDueDate(taskDate)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;