import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskStats from '@/components/organisms/TaskStats';
import AddTaskButton from '@/components/atoms/AddTaskButton';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="CheckSquare" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-heading font-bold text-gray-900">TaskFlow</h1>
            </div>
          </div>
          
          {/* Desktop Stats */}
          <div className="hidden md:block">
            <TaskStats />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 overflow-y-auto z-40">
          <CategorySidebar />
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading font-semibold text-gray-900">Menu</h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                </div>
                <CategorySidebar onNavigate={() => setIsMobileMenuOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Floating Add Button */}
      <AddTaskButton />
    </div>
  );
};

export default Layout;