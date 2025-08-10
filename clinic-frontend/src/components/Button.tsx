// // src/components/Button.tsx
// import React from 'react';

// interface ButtonProps {
//   children: React.ReactNode;
//   onClick?: () => void;
//   type?: 'button' | 'submit';
//   variant?: 'primary' | 'secondary' | 'danger';
//   size?: 'sm' | 'md' | 'lg';
//   disabled?: boolean;
//   className?: string;
// }

// const Button: React.FC<ButtonProps> = ({ 
//   children, 
//   onClick, 
//   type = 'button', 
//   variant = 'primary', 
//   size = 'md',
//   disabled = false,
//   className = ''
// }) => {
//   const baseClasses = 'font-medium rounded focus:outline-none transition-colors';
  
//   const variantClasses = {
//     primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400',
//     secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
//     danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400'
//   };

//   const sizeClasses = {
//     sm: 'px-3 py-1 text-sm',
//     md: 'px-4 py-2',
//     lg: 'px-6 py-3 text-lg'
//   };

//   const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled}
//       className={classes}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;


// src/components/Button.tsx - Enhanced version of your existing Button
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const baseClasses = 'font-medium rounded focus:outline-none transition-colors inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;