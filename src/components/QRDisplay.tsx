import React, { useState } from 'react';
import { NetworkInfo } from '@/utils/network';

interface QRDisplayProps {
  qrCodeDataURL: string;
  url: string;
  qrCodeUrl?: string; // 实际用于二维码的URL
  title: string;
  onRegenerate: () => void;
  isLoading: boolean;
  networkInfo?: NetworkInfo | null;
  networkSuggestions?: string[];
}

const QRDisplay: React.FC<QRDisplayProps> = ({
  qrCodeDataURL,
  url,
  qrCodeUrl,
  title,
  onRegenerate,
  isLoading,
  networkInfo,
  networkSuggestions = []
}) => {
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
  const copyToClipboard = async (urlToCopy?: string) => {
    try {
      const targetUrl = urlToCopy || qrCodeUrl || url;
      await navigator.clipboard.writeText(targetUrl);
      // 使用全局toast方法显示成功消息
      (window as any).toast.success(`${targetUrl}已复制到剪贴板`, { 
        duration: 2000,
        title: '复制成功'
      });
    } catch (error) {
      // 显示错误消息
      (window as any).toast.error(`复制失败: ${error instanceof Error ? error.message : '未知错误'}`, {
        duration: 3000,
        title: '复制失败'
      });
    }
  };

  // 获取网络状态图标
  const getNetworkStatusIcon = () => {
    if (!networkInfo) return '🔍';

    switch (networkInfo.networkStatus) {
      case 'connected':
        return networkInfo.isLocalhost ? '⚠️' : '✅';
      case 'disconnected':
        return '❌';
      default:
        return '❓';
    }
  };

  // 获取网络状态文本
  const getNetworkStatusText = () => {
    if (!networkInfo) return 'Checking network...';

    if (networkInfo.networkStatus === 'disconnected') {
      return 'Network disconnected';
    }

    if (networkInfo.isLocalhost) {
      return `Localhost detected (Local IP: ${networkInfo.localIP})`;
    }

    return 'Network ready';
  };

  return (
    <div className="qr-display">
      <div className="qr-display__header">
        <h2 className="qr-display__title">Mobile Preview QR Code</h2>
      </div>

      <div className="qr-display__content">
        {isLoading ? (
          <div className="qr-display__loading">
            <div className="loading-spinner"></div>
            <p>Generating QR code...</p>
          </div>
        ) : (
          <>
            <div className="qr-display__qr-container">
              <img
                src={qrCodeDataURL}
                alt="QR Code"
                className="qr-display__qr-image"
              />
            </div>

            <div className="qr-display__info">
              <h3 className="qr-display__page-title">{title}</h3>

              {/* 网络状态指示器 */}
              <div className="qr-display__network-status">
                <span className="network-status-icon">{getNetworkStatusIcon()}</span>
                <span className="network-status-text">{getNetworkStatusText()}</span>
                {networkSuggestions.length > 0 && (
                  <button
                    onClick={() => setShowNetworkInfo(!showNetworkInfo)}
                    className="qr-display__network-toggle"
                    title="Show network suggestions"
                  >
                    {showNetworkInfo ? '▲' : '▼'}
                  </button>
                )}
              </div>

              {/* 原始URL */}
              <div className="qr-display__url-container">
                <label className="qr-display__url-label">Original URL:</label>
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="qr-display__url-input"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={() => copyToClipboard(url)}
                  className="qr-display__copy-button"
                  title="Copy Original URL"
                >
                  📋
                </button>
              </div>

              {/* 二维码URL（如果不同于原始URL） */}
              {qrCodeUrl && qrCodeUrl !== url && (
                <div className="qr-display__url-container qr-display__qr-url-container">
                  <label className="qr-display__url-label">QR Code URL (Mobile Access):</label>
                  <input
                    type="text"
                    value={qrCodeUrl}
                    readOnly
                    className="qr-display__url-input qr-display__qr-url-input"
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <button
                    onClick={() => copyToClipboard(qrCodeUrl)}
                    className="qr-display__copy-button"
                    title="Copy QR Code URL"
                  >
                    📋
                  </button>
                </div>
              )}
            </div>

            <div className="qr-display__actions">
              <button
                onClick={onRegenerate}
                className="qr-display__refresh-button"
              >
                Refresh QR Code
              </button>
            </div>

            {/* 网络建议 */}
            {showNetworkInfo && networkSuggestions.length > 0 && (
              <div className="qr-display__network-suggestions">
                <h4 className="network-suggestions-title">📋 Network Access Tips:</h4>
                <ul className="network-suggestions-list">
                  {networkSuggestions.map((suggestion, index) => (
                    <li key={index} className="network-suggestion-item">
                      {suggestion}
                    </li>
                  ))}
                </ul>
                {networkInfo?.alternativeUrls && networkInfo.alternativeUrls.length > 1 && (
                  <div className="alternative-urls">
                    <h5>Alternative URLs to try:</h5>
                    <ul>
                      {networkInfo.alternativeUrls.slice(1).map((altUrl, index) => (
                        <li key={index} className="alternative-url">
                          <code>{altUrl}</code>
                          <button
                            onClick={() => copyToClipboard(altUrl)}
                            className="qr-display__copy-button-small"
                            title="Copy Alternative URL"
                          >
                            📋
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="qr-display__instructions">
              <p>📱 Scan this QR code with your mobile device to preview the current page</p>
              {networkInfo?.isLocalhost && (
                <p className="localhost-warning">
                  ⚠️ <strong>Note:</strong> Localhost URL detected. The QR code has been automatically converted to use your local IP address for mobile access.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QRDisplay;