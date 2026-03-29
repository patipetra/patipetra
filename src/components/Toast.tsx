'use client';
import { useState, useEffect, useCallback, createContext, useContext } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠️',
  info:    'ℹ️',
};

const COLORS: Record<ToastType, string> = {
  success: 'border-l-[#1D9E75] bg-[#F0FBF7]',
  error:   'border-l-red-500 bg-red-50',
  warning: 'border-l-[#C9832E] bg-[rgba(201,131,46,.06)]',
  info:    'border-l-blue-500 bg-blue-50',
};

const ICON_COLORS: Record<ToastType, string> = {
  success: 'bg-[#1D9E75] text-white',
  error:   'bg-red-500 text-white',
  warning: 'bg-[#C9832E] text-white',
  info:    'bg-blue-500 text-white',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((message: string, type: ToastType = 'info', duration = 3500) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { id, message, type, duration }]);
    setTimeout(() => remove(id), duration);
  }, [remove]);

  const ctx: ToastContextType = {
    toast:   add,
    success: (m) => add(m, 'success'),
    error:   (m) => add(m, 'error'),
    warning: (m) => add(m, 'warning'),
    info:    (m) => add(m, 'info'),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-[9999] flex flex-col gap-2 max-w-[320px] w-full pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-[14px] border border-transparent border-l-4 shadow-lg pointer-events-auto
              ${COLORS[t.type]}
              animate-in slide-in-from-right-4 duration-300`}
            style={{animation:'slideIn .3s ease'}}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ICON_COLORS[t.type]}`}>
              {ICONS[t.type]}
            </div>
            <span className="text-sm text-[#2F2622] font-medium flex-1 leading-snug">{t.message}</span>
            <button onClick={()=>remove(t.id)} className="text-[#9A9188] hover:text-[#2F2622] text-lg leading-none flex-shrink-0">×</button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
