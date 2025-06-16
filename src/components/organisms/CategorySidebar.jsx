import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CategoryBadge from '@/components/molecules/CategoryBadge';
import { categoryService } from '@/services';

const CategorySidebar = ({ onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await categoryService.getAll();
      setCategories(result);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = () => {
    if (onNavigate) onNavigate();
  };

  const mainNavItems = [
    { id: 'today', label: 'Today', path: '/today', icon: 'Calendar', color: '#5B4CFF' },
    { id: 'all', label: 'All Tasks', path: '/all', icon: 'List', color: '#64748b' }
  ];

  return (
    <nav className="p-4 h-full flex flex-col">
      {/* Main Navigation */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Overview
        </h2>
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <ApperIcon 
                    name={item.icon} 
                    size={18} 
                    className="mr-3" 
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Categories
        </h2>
        
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-error mb-2">{error}</p>
            <button
              onClick={loadCategories}
              className="text-xs text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map((category) => (
              <NavLink
                key={category.Id}
                to={`/category/${category.Id}`}
                onClick={handleNavClick}
                className={({ isActive }) => `
                  flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-gray-100 shadow-sm' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
<span className="text-gray-700 truncate">{category.Name || category.name}</span>
                </div>
{(category.task_count || category.taskCount) > 0 && (
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full ml-2">
                    {category.task_count || category.taskCount}
                  </span>
                )}
              </NavLink>
            ))}
            
            {categories.length === 0 && (
              <div className="text-center py-4">
                <ApperIcon name="Tag" size={24} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No categories yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default CategorySidebar;