import React, { useState, useEffect } from 'react';
import QRDisplay from './QRDisplay';
import { generateQRCode, getCurrentTabInfo, getQRCodeUrl } from '@/utils/qrcode';
import { getNetworkInfo, getNetworkAccessSuggestions, NetworkInfo } from '@/utils/network';

const App: React.FC = () => {
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [qrCodeUrl, setQRCodeUrl] = useState<string>(''); // 实际用于二维码的URL
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [networkSuggestions, setNetworkSuggestions] = useState<string[]>([]);

  const generateQR = async (toast: boolean = true) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Get current tab information
      const tab = await getCurrentTabInfo();
      
      if (!tab.url) {
        throw new Error('Cannot access current tab URL');
      }
      
      setCurrentUrl(tab.url);
      setCurrentTitle(tab.title || 'Unknown Page');
      
      // Get network information
      const netInfo = await getNetworkInfo(tab.url);
      setNetworkInfo(netInfo);
      
      // Get network access suggestions
      const suggestions = getNetworkAccessSuggestions(netInfo);
      setNetworkSuggestions(suggestions);
      
      // Get the actual URL for QR code (may be converted from localhost)
      const actualQRUrl = await getQRCodeUrl(tab.url);
      setQRCodeUrl(actualQRUrl);
      
      // Generate QR code
      const qrCode = await generateQRCode(tab.url, {
        size: 200,
        margin: 1
      });
      
      setQRCodeDataURL(qrCode);
      
      // 使用全局toast方法显示成功消息
      if (toast) {
        (window as any).toast.success('二维码生成成功！', {
          duration: 2000,
          title: '生成成功'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // 使用全局toast方法显示错误消息
      (window as any).toast.error(`二维码生成失败: ${errorMessage}`, {
        duration: 4000,
        title: '生成失败'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化时生成二维码
  useEffect(() => {
    generateQR();
  }, []);

  // 监听来自background script的消息
  useEffect(() => {
    const messageListener = (message: any, sender: any, sendResponse: any) => {
      // 检查是否是来自扩展的消息
      if (message && (message.type === 'TAB_CHANGED' || message.type === 'TAB_UPDATED')) {
        console.log('Received tab change/update message:', message);
        // 延迟一点执行，确保标签页切换完成
        setTimeout(() => {
          generateQR(message.toast);
        }, 100);
      }
    };

    // 添加消息监听器
    chrome.runtime.onMessage.addListener(messageListener);

    // 清理监听器
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  if (error) {
    return (
      <div className="app app--error">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => generateQR()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <QRDisplay
        qrCodeDataURL={qrCodeDataURL}
        url={currentUrl}
        qrCodeUrl={qrCodeUrl}
        title={currentTitle}
        onRegenerate={generateQR}
        isLoading={isLoading}
        networkInfo={networkInfo}
        networkSuggestions={networkSuggestions}
      />
    </div>
  );
};

export default App;