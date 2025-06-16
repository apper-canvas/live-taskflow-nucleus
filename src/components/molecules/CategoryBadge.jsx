import { motion } from 'framer-motion';

const CategoryBadge = ({ category, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center rounded-full font-medium text-white
        ${sizes[size]} ${className}
      `}
      style={{ backgroundColor: category.color }}
    >
{category.Name || category.name}
    </motion.span>
  );
};

export default CategoryBadge;