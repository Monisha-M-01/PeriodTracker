import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // 4 seconds
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col space-y-2 pointer-events-none w-full max-w-sm px-4 md:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-md shadow-lg pointer-events-auto transform transition-all translate-y-0 opacity-100",
              t.type === 'error' ? "bg-destructive text-destructive-foreground" :
              t.type === 'success' ? "bg-primary text-primary-foreground" :
              "bg-card text-foreground border border-muted"
            )}
          >
            <p className="text-sm font-medium">{t.message}</p>
            <button 
              onClick={() => removeToast(t.id)} 
              className="ml-4 opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
