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

  const generateQR = async () => {
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
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateQR();
  }, []);

  if (error) {
    return (
      <div className="app app--error">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={generateQR} className="retry-button">
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