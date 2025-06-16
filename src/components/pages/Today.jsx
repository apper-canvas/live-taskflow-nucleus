import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import TaskList from '@/components/organisms/TaskList';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { taskService, categoryService } from '@/services';

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filteredOverdue, setFilteredOverdue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, overdueTasks, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayTasks, overdueData, categoriesData] = await Promise.all([
        taskService.getTodayTasks(),
        taskService.getOverdueTasks(),
        categoryService.getAll()
      ]);
      
      setTasks(todayTasks);
      setOverdueTasks(overdueData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load today\'s tasks');
      toast.error('Failed to load today\'s tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (!searchQuery) {
      setFilteredTasks(tasks);
      setFilteredOverdue(overdueTasks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filterByQuery = (task) => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query);

    setFilteredTasks(tasks.filter(filterByQuery));
    setFilteredOverdue(overdueTasks.filter(filterByQuery));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTaskUpdate = () => {
    loadData(); // Reload to get fresh stats
  };

  const handleTaskDelete = () => {
    loadData(); // Reload to get fresh stats
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  const hasNoTasks = tasks.length === 0 && overdueTasks.length === 0;
  const hasNoResults = filteredTasks.length === 0 && filteredOverdue.length === 0 && searchQuery;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
              Today's Tasks
            </h1>
            <p className="text-gray-600">
              {hasNoTasks 
                ? "No tasks for today. Time to plan your day!"
                : `${filteredTasks.length + filteredOverdue.length} task${filteredTasks.length + filteredOverdue.length !== 1 ? 's' : ''} to complete`
              }
            </p>
          </div>
          <div className="hidden md:flex items-center text-sm text-gray-500">
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Search Bar */}
        {!hasNoTasks && (
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search today's tasks..."
            className="max-w-md"
          />
        )}
      </motion.div>

      {/* Content */}
      {hasNoTasks ? (
        <EmptyState
          icon="Calendar"
          title="No tasks for today"
          description="You're all caught up! Add some tasks to stay productive."
          actionLabel="Add Task"
          onAction={() => {
            // The floating add button will handle this
            document.querySelector('[data-testid="add-task-button"]')?.click();
          }}
        />
      ) : hasNoResults ? (
        <EmptyState
          icon="Search"
          title="No tasks found"
          description={`No tasks match "${searchQuery}". Try a different search term.`}
        />
      ) : (
        <div className="space-y-8">
          {/* Overdue Tasks */}
          {filteredOverdue.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <ApperIcon name="AlertCircle" size={20} className="text-error mr-2" />
                <h2 className="text-lg font-heading font-semibold text-error">
                  Overdue ({filteredOverdue.length})
                </h2>
              </div>
              <TaskList
                tasks={filteredOverdue}
                categories={categories}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                enableDragAndDrop={false}
              />
            </motion.section>
          )}

          {/* Today's Tasks */}
          {filteredTasks.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filteredOverdue.length > 0 ? 0.2 : 0.1 }}
            >
              <div className="flex items-center mb-4">
                <ApperIcon name="Clock" size={20} className="text-primary mr-2" />
                <h2 className="text-lg font-heading font-semibold text-gray-900">
                  Due Today ({filteredTasks.length})
                </h2>
              </div>
              <TaskList
                tasks={filteredTasks}
                categories={categories}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                enableDragAndDrop={true}
              />
            </motion.section>
          )}
        </div>
      )}
    </div>
  );
};

export default Today;