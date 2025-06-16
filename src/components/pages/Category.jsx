import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import TaskList from "@/components/organisms/TaskList";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import ErrorState from "@/components/molecules/ErrorState";
import EmptyState from "@/components/molecules/EmptyState";
import CategoryBadge from "@/components/molecules/CategoryBadge";
import { categoryService, taskService } from "@/services";

const Category = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoryData, tasksData, categoriesData] = await Promise.all([
        categoryService.getById(parseInt(categoryId, 10)),
        taskService.getByCategory(parseInt(categoryId, 10)),
        categoryService.getAll()
      ]);

      if (!categoryData) {
        setError('Category not found');
        return;
      }
      
      setCategory(categoryData);
      setTasks(tasksData);
      setAllCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load category');
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoriesData = await categoryService.getAll();
      setAllCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    if (!searchQuery) {
      setFilteredTasks(tasks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
    setFilteredTasks(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTaskUpdate = () => {
    loadData(); // Reload to get fresh data
  };

  const handleTaskDelete = () => {
    loadData(); // Reload to get fresh data
  };

  const handleCategorySelect = (selectedCategoryId) => {
    navigate(`/category/${selectedCategoryId}`);
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
        <ErrorState message={error} onRetry={categoryId ? loadData : loadCategories} />
      </div>
    );
  }

  // Show category selection if no specific category is selected
  if (!categoryId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Categories
          </h1>
          <p className="text-gray-600">
            Select a category to view its tasks
          </p>
        </motion.div>

        {allCategories.length === 0 ? (
          <EmptyState
            icon="Tag"
            title="No categories yet"
            description="Categories help organize your tasks. Create some tasks first and they'll be automatically categorized."
            actionLabel="Add Task"
            onAction={() => {
              document.querySelector('[data-testid="add-task-button"]')?.click();
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {allCategories.map((cat, index) => (
              <motion.button
                key={cat.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategorySelect(cat.Id)}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-2xl font-bold text-gray-900">
                    {cat.taskCount}
                  </span>
                </div>
                <h3 className="text-lg font-heading font-semibold text-gray-900 mb-1">
{cat.Name || cat.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {cat.taskCount} task{cat.taskCount !== 1 ? 's' : ''}
                </p>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    );
  }

  const hasNoTasks = tasks.length === 0;
  const hasNoResults = filteredTasks.length === 0 && searchQuery;

  return (
    <div className="p-6 max-w-4xl mx-auto">
    {/* Header */}
    <motion.div
        initial={{
            opacity: 0,
            y: -20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        className="mb-8">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <button
                    onClick={() => navigate("/category")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3">
                    <ApperIcon name="ArrowLeft" size={20} />
                </button>
                <div>
                    <div className="flex items-center mb-2">
                        {category && <CategoryBadge category={category} className="mr-3" />}
                        <h1 className="text-3xl font-heading font-bold text-gray-900">
                            {category?.Name || category?.name || "Category"}
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        {hasNoTasks ? "No tasks in this category yet" : `${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""} in this category`}
                    </p>
                </div>
            </div>
        </div>
        {/* Search Bar */}
        {!hasNoTasks && <SearchBar
            onSearch={handleSearch}
            placeholder="Search category tasks..."
            className="max-w-md" />}
    </motion.div>
    {/* Content */}
    {hasNoTasks ? <EmptyState
        icon="Tag"
        title="No tasks in this category"
        description="This category is empty. Add some tasks to get started organizing your work."
        actionLabel="Add Task"
        onAction={() => {
            document.querySelector("[data-testid=\"add-task-button\"]")?.click();
        }} /> : hasNoResults ? <EmptyState
        icon="Search"
        title="No tasks found"
        description={`No tasks in ${category?.Name || category?.name} match "${searchQuery}". Try a different search term.`} /> : <motion.div
        initial={{
            opacity: 0,
            y: 20
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        transition={{
            delay: 0.1
        }}>
        <TaskList
            tasks={filteredTasks}
            categories={allCategories}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            enableDragAndDrop={true} />
    </motion.div>}
    {/* Category Stats */}
    {!hasNoTasks && filteredTasks.length > 0 && <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        transition={{
            delay: 0.3
        }}
        className="mt-8 p-4 bg-white rounded-lg border border-gray-100">
        <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">Category Overview
                      </h3>
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
                <div
                    className="text-2xl font-bold"
                    style={{
                        color: category?.color
                    }}>
                    {Math.round(filteredTasks.filter(t => t.completed).length / filteredTasks.length * 100) || 0}%
                                  </div>
                <div className="text-sm text-gray-600">Complete</div>
            </div>
        </div>
    </motion.div>}
</div>
  );
};

export default Category;