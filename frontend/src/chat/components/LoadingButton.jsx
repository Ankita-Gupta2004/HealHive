import React from 'react';
import { Loader } from 'lucide-react';

const LoadingButton = ({
  onClick,
  isLoading = false,
  disabled = false,
  children,
  loadingText = 'Processing...',
  className = '',
  type = 'button',
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3 
        bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 
        text-white font-semibold rounded-xl 
        shadow-md hover:shadow-lg transition-all duration-200
        ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader className="h-5 w-5 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;