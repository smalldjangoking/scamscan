import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div role="status" aria-label="loading" className="flex flex-col items-center justify-center py-10">
      <Loader2 
        className="max-w-[35px] max-h-[35px]  w-full h-full animate-spin text-[color:var(--secondary-foreground]" 
      />

      <span className="sr-only">Loading proccess animation</span>
    </div>
  );
};

export default LoadingSpinner;