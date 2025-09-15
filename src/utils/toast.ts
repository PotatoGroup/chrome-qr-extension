interface ToastOptions {
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  iconUrl?: string;
}

interface ToastConfig {
  id: string;
  type: string;
  iconUrl: string;
  title: string;
  message: string;
  timestamp: number;
  duration: number;
}

class ChromeToastManager {
  private activeToasts: Map<string, ToastConfig> = new Map();
  private defaultIconUrl = '/icons/icon.png';
  
  constructor() {
    this.setupNotificationHandlers();
  }

  private setupNotificationHandlers() {
    // 监听通知点击事件
    if (chrome.notifications?.onClicked) {
      chrome.notifications.onClicked.addListener((notificationId) => {
        this.handleNotificationClick(notificationId);
      });
    }

    // 监听通知关闭事件
    if (chrome.notifications?.onClosed) {
      chrome.notifications.onClosed.addListener((notificationId, byUser) => {
        this.handleNotificationClosed(notificationId, byUser);
      });
    }
  }

  private handleNotificationClick(notificationId: string) {
    // 点击通知时的处理逻辑
    console.log(`Notification clicked: ${notificationId}`);
    this.remove(notificationId);
  }

  private handleNotificationClosed(notificationId: string, byUser: boolean) {
    // 通知关闭时清理记录
    this.activeToasts.delete(notificationId);
  }

  private generateId(): string {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getIconForType(type: string): string {
    // 根据类型返回不同的图标
    switch (type) {
      case 'success':
        return '/icons/icon.png'; // 可以为不同类型配置不同图标
      case 'error':
        return '/icons/icon.png';
      case 'warning':
        return '/icons/icon.png';
      case 'info':
        return '/icons/icon.png';
      default:
        return this.defaultIconUrl;
    }
  }

  private getTitleForType(type: string, customTitle?: string): string {
    if (customTitle) return customTitle;
    
    switch (type) {
      case 'success':
        return '✅ 成功';
      case 'error':
        return '❌ 错误';
      case 'warning':
        return '⚠️ 警告';
      case 'info':
        return 'ℹ️ 提示';
      default:
        return '📢 通知';
    }
  }

  public async show(message: string, options: ToastOptions = {}): Promise<string> {
    const {
      duration = 3000,
      type = 'info',
      title,
      iconUrl
    } = options;

    const toastId = this.generateId();
    const toastTitle = this.getTitleForType(type, title);
    const toastIcon = iconUrl || this.getIconForType(type);

    const toastConfig: ToastConfig = {
      id: toastId,
      type,
      iconUrl: toastIcon,
      title: toastTitle,
      message,
      timestamp: Date.now(),
      duration
    };

    this.activeToasts.set(toastId, toastConfig);

    try {
      // 创建Chrome通知
      if (chrome.notifications?.create) {
        await chrome.notifications.create(toastId, {
          type: 'basic',
          iconUrl: toastIcon,
          title: toastTitle,
          message: message,
          silent: false,
          requireInteraction: duration === 0 // 如果duration为0，则需要用户交互才能关闭
        });

        // 自动移除通知（如果设置了duration）
        if (duration > 0) {
          setTimeout(() => {
            this.remove(toastId);
          }, duration);
        }
      } else {
        console.warn('Chrome notifications API not available');
        // 降级方案：使用console.log
        console.log(`${toastTitle}: ${message}`);
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
      // 降级方案
      console.log(`${toastTitle}: ${message}`);
    }

    return toastId;
  }

  public remove(id: string): void {
    if (this.activeToasts.has(id)) {
      try {
        if (chrome.notifications?.clear) {
          chrome.notifications.clear(id);
        }
      } catch (error) {
        console.error('Failed to clear notification:', error);
      } finally {
        this.activeToasts.delete(id);
      }
    }
  }

  public clear(): void {
    const toastIds = Array.from(this.activeToasts.keys());
    toastIds.forEach(id => this.remove(id));
  }

  public getActiveToasts(): ToastConfig[] {
    return Array.from(this.activeToasts.values());
  }

  // 检查通知权限
  public async checkPermission(): Promise<boolean> {
    try {
      if (chrome.notifications) {
        // Chrome扩展通常已经有通知权限
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to check notification permission:', error);
      return false;
    }
  }
}

// 创建全局实例
const chromeToastManager = new ChromeToastManager();

// 创建全局toast方法
const globalToast = {
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => 
    chromeToastManager.show(message, { ...options, type: 'success' }),
    
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => 
    chromeToastManager.show(message, { ...options, type: 'error' }),
    
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => 
    chromeToastManager.show(message, { ...options, type: 'warning' }),
    
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => 
    chromeToastManager.show(message, { ...options, type: 'info' }),
    
  show: (message: string, options?: ToastOptions) => 
    chromeToastManager.show(message, options),
    
  remove: (id: string) => chromeToastManager.remove(id),
  
  clear: () => chromeToastManager.clear(),
  
  checkPermission: () => chromeToastManager.checkPermission(),
  
  getActive: () => chromeToastManager.getActiveToasts()
};

// 将toast挂载到全局对象
if (typeof globalThis !== 'undefined') {
  (globalThis as any).toast = globalToast;
}

if (typeof window !== 'undefined') {
  (window as any).toast = globalToast;
}

// 同时也导出，以便模块化使用
export const toast = globalToast;
