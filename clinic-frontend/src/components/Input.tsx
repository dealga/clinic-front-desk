// src/components/Input.tsx
import React from 'react';

interface InputProps {
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  className = '',
  label 
}) => {
  const inputClasses = `w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputClasses}
      />
    </div>
  );
};

export default Input;

