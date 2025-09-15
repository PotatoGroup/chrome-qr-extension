import QRCode from 'qrcode';
import { QRCodeOptions } from '@/types';
import { convertToLocalNetworkUrl, isLocalhostUrl } from './network';

export const generateQRCode = async (
  text: string, 
  options: Partial<QRCodeOptions> = {}
): Promise<string> => {
  const defaultOptions: QRCodeOptions = {
    size: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    // 如果是localhost URL，尝试转换为局域网IP
    let urlToEncode = text;
    if (isLocalhostUrl(text)) {
      try {
        urlToEncode = await convertToLocalNetworkUrl(text);
        console.log(`Converted localhost URL to local network URL: ${urlToEncode}`);
      } catch (error) {
        console.warn('Could not convert localhost URL, using original:', error);
        // 继续使用原始URL
      }
    }

    const qrCodeDataURL = await QRCode.toDataURL(urlToEncode, {
      width: finalOptions.size,
      margin: finalOptions.margin,
      color: finalOptions.color
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const getCurrentTabInfo = (): Promise<chrome.tabs.Tab> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      
      if (tabs.length === 0) {
        reject(new Error('No active tab found'));
        return;
      }
      
      resolve(tabs[0]);
    });
  });
};

/**
 * 获取用于生成二维码的实际URL（可能经过localhost转换）
 */
export const getQRCodeUrl = async (originalUrl: string): Promise<string> => {
  if (isLocalhostUrl(originalUrl)) {
    try {
      return await convertToLocalNetworkUrl(originalUrl);
    } catch (error) {
      console.warn('Could not convert localhost URL, using original:', error);
      return originalUrl;
    }
  }
  return originalUrl;
};