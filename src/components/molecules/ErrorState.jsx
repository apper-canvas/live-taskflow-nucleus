import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  message = 'Something went wrong',
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 px-4 ${className}`}
    >
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-error" />
      </div>
      
      <h3 className="text-lg font-heading font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" icon="RotateCcw">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;