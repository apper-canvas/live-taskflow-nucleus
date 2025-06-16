import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import TaskList from '@/components/organisms/TaskList';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import CategoryBadge from '@/components/molecules/CategoryBadge';
import { taskService, categoryService } from '@/services';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, selectedCategory, selectedPriority, showCompleted]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === parseInt(selectedCategory, 10));
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === parseInt(selectedPriority, 10));
    }

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(task => !task.completed);
    }

    // Sort by priority (high to low) then by due date
    filtered.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
return new Date(a.due_date || a.dueDate) - new Date(b.due_date || b.dueDate);
    });

    setFilteredTasks(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTaskUpdate = () => {
    loadData();
  };

  const handleTaskDelete = () => {
    loadData();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriority('all');
    setShowCompleted(true);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || !showCompleted;

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
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
      <div className="p-6 max-w-6xl mx-auto">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  const hasNoTasks = tasks.length === 0;
  const hasNoResults = filteredTasks.length === 0 && !hasNoTasks;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            All Tasks
          </h1>
          <p className="text-gray-600">
            {hasNoTasks 
              ? "No tasks yet. Create your first task to get started!"
              : `${filteredTasks.length} of ${tasks.length} task${tasks.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Filters and Search */}
        {!hasNoTasks && (
          <div className="space-y-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search all tasks..."
              className="max-w-md"
            />

            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
<option key={category.Id} value={category.Id}>
                      {category.Name || category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Priority:</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Priorities</option>
                  <option value="3">High</option>
                  <option value="2">Medium</option>
                  <option value="1">Low</option>
                </select>
              </div>

              {/* Show Completed Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Show completed</span>
              </label>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center"
                >
                  <ApperIcon name="X" size={14} className="mr-1" />
                  Clear filters
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
Category: {categories.find(c => c.Id === parseInt(selectedCategory, 10))?.Name || categories.find(c => c.Id === parseInt(selectedCategory, 10))?.name}
                  </span>
                )}
                {selectedPriority !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    Priority: {selectedPriority === '3' ? 'High' : selectedPriority === '2' ? 'Medium' : 'Low'}
                  </span>
                )}
                {!showCompleted && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    Incomplete only
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Content */}
      {hasNoTasks ? (
        <EmptyState
          icon="List"
          title="No tasks yet"
          description="Create your first task to start organizing your work and staying productive."
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
          description={
            hasActiveFilters 
              ? "No tasks match your current filters. Try adjusting your search criteria."
              : `No tasks match "${searchQuery}". Try a different search term.`
          }
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            enableDragAndDrop={!hasActiveFilters}
          />
        </motion.div>
      )}

      {/* Task Summary */}
      {!hasNoTasks && filteredTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-gray-50 rounded-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredTasks.filter(t => !t.completed).length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {filteredTasks.filter(t => t.completed).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-error">
                {filteredTasks.filter(t => t.priority === 3 && !t.completed).length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {Math.round((filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AllTasks;