export interface NetworkInfo {
  localIP: string;
  isLocalhost: boolean;
  alternativeUrls: string[];
  networkStatus: 'connected' | 'disconnected' | 'unknown';
}

/**
 * 获取本地IP地址（通过WebRTC）
 */
export const getLocalIP = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 创建RTCPeerConnection来获取本地IP
    const rtc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    let localIP = '';

    // 监听ICE候选事件
    rtc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate.candidate;
        const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
        
        if (ipMatch && ipMatch[1] !== '127.0.0.1') {
          localIP = ipMatch[1];
          rtc.close();
          resolve(localIP);
        }
      }
    };

    // 创建数据通道触发ICE收集
    rtc.createDataChannel('test');
    rtc.createOffer()
      .then(offer => rtc.setLocalDescription(offer))
      .catch(reject);

    // 超时处理
    setTimeout(() => {
      rtc.close();
      if (!localIP) {
        reject(new Error('Could not determine local IP address'));
      }
    }, 3000);
  });
};

/**
 * 检测URL是否为localhost
 */
export const isLocalhostUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname === '::1' ||
           hostname.endsWith('.localhost');
  } catch {
    return false;
  }
};

/**
 * 将localhost URL转换为局域网IP URL
 */
export const convertToLocalNetworkUrl = async (url: string): Promise<string> => {
  if (!isLocalhostUrl(url)) {
    return url;
  }

  try {
    const localIP = await getLocalIP();
    const urlObj = new URL(url);
    urlObj.hostname = localIP;
    return urlObj.toString();
  } catch (error) {
    console.warn('Could not convert to local network URL:', error);
    return url;
  }
};

/**
 * 生成可能的替代访问URL
 */
export const generateAlternativeUrls = async (originalUrl: string): Promise<string[]> => {
  const alternatives: string[] = [originalUrl];

  if (isLocalhostUrl(originalUrl)) {
    try {
      const localIP = await getLocalIP();
      const urlObj = new URL(originalUrl);
      
      // 添加局域网IP版本
      urlObj.hostname = localIP;
      alternatives.push(urlObj.toString());
      
      // 如果是HTTP，也添加HTTPS版本
      if (urlObj.protocol === 'http:') {
        urlObj.protocol = 'https:';
        alternatives.push(urlObj.toString());
      }
    } catch (error) {
      console.warn('Could not generate alternative URLs:', error);
    }
  }

  return [...new Set(alternatives)]; // 去重
};

/**
 * 检测网络连接状态
 */
export const checkNetworkStatus = (): 'connected' | 'disconnected' | 'unknown' => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine ? 'connected' : 'disconnected';
  }
  return 'unknown';
};

/**
 * 测试URL是否可访问
 */
export const testUrlAccessibility = async (url: string): Promise<boolean> => {
  try {
    // 由于CORS限制，我们不能直接fetch测试
    // 这里返回基本的网络状态检查
    return checkNetworkStatus() === 'connected';
  } catch {
    return false;
  }
};

/**
 * 获取完整的网络信息
 */
export const getNetworkInfo = async (url: string): Promise<NetworkInfo> => {
  const isLocalhost = isLocalhostUrl(url);
  const networkStatus = checkNetworkStatus();
  const alternativeUrls = await generateAlternativeUrls(url);
  
  let localIP = '';
  try {
    localIP = await getLocalIP();
  } catch {
    localIP = 'Unknown';
  }

  return {
    localIP,
    isLocalhost,
    alternativeUrls,
    networkStatus
  };
};

/**
 * 获取网络访问建议
 */
export const getNetworkAccessSuggestions = (networkInfo: NetworkInfo): string[] => {
  const suggestions: string[] = [];

  if (networkInfo.networkStatus === 'disconnected') {
    suggestions.push('请检查网络连接');
  }

  if (networkInfo.isLocalhost) {
    suggestions.push('检测到localhost地址，手机可能无法直接访问');
    
    if (networkInfo.alternativeUrls.length > 1) {
      suggestions.push(`尝试使用局域网IP访问：${networkInfo.localIP}`);
    }
    
    suggestions.push('确保电脑和手机连接到同一WiFi网络');
    suggestions.push('检查防火墙设置，允许局域网访问');
  }

  if (networkInfo.alternativeUrls.some(url => url.startsWith('https:'))) {
    suggestions.push('某些功能可能需要HTTPS访问');
  }

  return suggestions;
};
