import React, { useState, useEffect } from 'react';
import '../styles/skeleton.css'; // Let's put progress bar css here too, or inline

const ProgressBar = ({ progress, height = 4, color = 'var(--accent-primary)', isLoading = true }) => {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (progress !== undefined) {
      setInternalProgress(progress);
    } else if (isLoading) {
      // Simulate progress if none provided
      const interval = setInterval(() => {
        setInternalProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setInternalProgress(100);
    }
  }, [progress, isLoading]);

  return (
    <div style={{ width: '100%', height: `${height}px`, backgroundColor: 'var(--border-glass)', borderRadius: '2px', overflow: 'hidden' }}>
      <div 
        style={{ 
          height: '100%', 
          width: `${internalProgress}%`, 
          backgroundColor: color, 
          transition: 'width 0.3s ease-out',
          boxShadow: `0 0 10px ${color}`
        }} 
      />
    </div>
  );
};

export default ProgressBar;
