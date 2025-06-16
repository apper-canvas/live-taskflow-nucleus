import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  type = 'text', 
  value = '', 
  onChange,
  placeholder,
  icon,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  const hasValue = internalValue && internalValue.length > 0;
  const shouldFloat = isFocused || hasValue;

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} size={18} />
          </div>
        )}
        
        <input
          type={type}
          value={internalValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full px-3 py-3 border rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-error focus:ring-error focus:border-error' 
              : 'border-gray-300 focus:ring-primary focus:border-primary'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            placeholder-transparent
          `}
          placeholder={placeholder}
          {...props}
        />
        
        {label && (
          <motion.label
            initial={false}
            animate={{
              top: shouldFloat ? '0.5rem' : '50%',
              fontSize: shouldFloat ? '0.75rem' : '1rem',
              transform: shouldFloat ? 'translateY(0)' : 'translateY(-50%)',
            }}
            transition={{ duration: 0.15 }}
            className={`
              absolute left-3 pointer-events-none
              ${icon ? 'left-10' : ''}
              ${shouldFloat 
                ? (error ? 'text-error' : 'text-primary') 
                : 'text-gray-500'
              }
              ${shouldFloat ? 'bg-white px-1' : ''}
            `}
          >
            {label}{required && <span className="text-error ml-1">*</span>}
          </motion.label>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;