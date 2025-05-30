import React from "react";

const LoadingButton = ({
  isLoading,
  children,
  loadingText = "Loading...",
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`${className} ${
        isLoading ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
