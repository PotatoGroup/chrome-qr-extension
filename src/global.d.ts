interface ToastOptions {
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  iconUrl?: string;
}

interface GlobalToast {
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => Promise<string>;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => Promise<string>;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => Promise<string>;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => Promise<string>;
  show: (message: string, options?: ToastOptions) => Promise<string>;
  remove: (id: string) => void;
  clear: () => void;
  checkPermission: () => Promise<boolean>;
  getActive: () => any[];
}

declare global {
  interface Window {
    toast: GlobalToast;
  }
  
  const toast: GlobalToast;
}