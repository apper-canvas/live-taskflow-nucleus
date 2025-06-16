import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';

const TaskStats = () => {
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    todayCompleted: 0,
    todayTotal: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [allTasks, todayTasks] = await Promise.all([
        taskService.getAll(),
        taskService.getTodayTasks()
      ]);

      const completedTasks = allTasks.filter(task => task.completed);
      const todayCompletedTasks = allTasks.filter(task => {
        const today = new Date().toISOString().split('T')[0];
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        return task.completed && taskDate === today;
      });

      setStats({
        completed: completedTasks.length,
        total: allTasks.length,
        todayCompleted: todayCompletedTasks.length,
        todayTotal: todayTasks.length + todayCompletedTasks.length
      });
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const todayCompletionRate = stats.todayTotal > 0 ? (stats.todayCompleted / stats.todayTotal) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-6">
      {/* Today's Progress */}
      <div className="flex items-center space-x-2">
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <motion.path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#5B4CFF"
              strokeWidth="3"
              strokeDasharray={`${todayCompletionRate}, 100`}
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${todayCompletionRate}, 100` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ApperIcon name="Calendar" size={12} className="text-primary" />
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {stats.todayCompleted}/{stats.todayTotal}
          </div>
          <div className="text-gray-500 text-xs">Today</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="flex items-center space-x-2">
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <motion.path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4ECDC4"
              strokeWidth="3"
              strokeDasharray={`${completionRate}, 100`}
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${completionRate}, 100` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ApperIcon name="CheckCircle" size={12} className="text-accent" />
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {stats.completed}/{stats.total}
          </div>
          <div className="text-gray-500 text-xs">Total</div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;