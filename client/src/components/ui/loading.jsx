import React from 'react';
import { Loader2 } from 'lucide-react'; // Lucide icon для загрузки

const LoadingSpinner = () => {
  return (
    <div role="status" aria-label="loading" className="flex flex-col items-center justify-center py-10">
      {/* Иконка Lucide с анимацией */}
      <Loader2 
        className="w-35 h-35 animate-spin text-[color:var(--secondary-foreground]" 
      />

      {/* Текст для скринридеров */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;