
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-32 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 right-10 w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-green-50/30 to-blue-50/30 dark:from-gray-900/30 dark:via-gray-800/30 dark:to-gray-900/30"></div>
    </div>
  );
};

export default AnimatedBackground;
