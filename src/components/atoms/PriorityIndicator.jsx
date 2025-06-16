import { motion } from 'framer-motion';

const PriorityIndicator = ({ priority, className = '', showPulse = false }) => {
  const getPriorityConfig = (level) => {
    switch (level) {
      case 3:
        return { 
          color: 'bg-error', 
          label: 'High', 
          textColor: 'text-error',
          borderColor: 'border-error' 
        };
      case 2:
        return { 
          color: 'bg-warning', 
          label: 'Medium', 
          textColor: 'text-warning',
          borderColor: 'border-warning' 
        };
      case 1:
      default:
        return { 
          color: 'bg-success', 
          label: 'Low', 
          textColor: 'text-success',
          borderColor: 'border-success' 
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <div className={`flex items-center ${className}`}>
      <motion.div
        animate={showPulse ? { scale: [1, 1.2, 1] } : {}}
        transition={showPulse ? { duration: 2, repeat: Infinity } : {}}
        className={`w-2 h-2 rounded-full ${config.color} mr-2`}
      />
      <span className={`text-xs font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
};

export default PriorityIndicator;