
import React, { useRef, useEffect } from 'react';

const ThreeDBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Fallback animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-300 dark:bg-orange-600 rounded-full animate-bounce opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-green-300 dark:border-green-600 rounded-full opacity-20 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-blue-300 dark:border-blue-600 transform rotate-45 opacity-20 animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
        
        {/* Wave animation */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-200/30 to-transparent dark:from-blue-800/30 animate-pulse" />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[0.5px]" />
    </div>
  );
};

export default ThreeDBackground;
