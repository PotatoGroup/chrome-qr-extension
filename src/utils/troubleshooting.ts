export interface TroubleshootingStep {
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TroubleshootingGuide {
  problem: string;
  symptoms: string[];
  steps: TroubleshootingStep[];
}

/**
 * 网络访问问题排查指南
 */
export const networkTroubleshootingGuides: TroubleshootingGuide[] = [
  {
    problem: 'Localhost URL cannot be accessed from mobile',
    symptoms: [
      'QR code shows localhost URL (127.0.0.1 or localhost)',
      'Mobile device cannot connect to the page',
      'Connection timeout or refused errors'
    ],
    steps: [
      {
        title: 'Use Local IP Address',
        description: 'The extension automatically converts localhost to your local IP address. Use the converted URL shown in the QR code.',
        priority: 'high'
      },
      {
        title: 'Check WiFi Connection',
        description: 'Ensure both your computer and mobile device are connected to the same WiFi network.',
        priority: 'high'
      },
      {
        title: 'Configure Development Server',
        description: 'Start your development server with --host 0.0.0.0 to listen on all network interfaces.',
        action: 'npm run dev -- --host 0.0.0.0',
        priority: 'high'
      },
      {
        title: 'Check Firewall Settings',
        description: 'Disable firewall or add an exception for your development server port.',
        priority: 'medium'
      }
    ]
  },
  {
    problem: 'HTTPS/SSL Certificate Issues',
    symptoms: [
      'Browser shows SSL certificate warnings',
      'Mobile browser refuses to load HTTPS pages',
      'Mixed content warnings'
    ],
    steps: [
      {
        title: 'Use HTTP for Development',
        description: 'Switch to HTTP for local development if HTTPS is not required.',
        priority: 'high'
      },
      {
        title: 'Accept Self-signed Certificate',
        description: 'On mobile browser, manually accept the self-signed certificate warning.',
        priority: 'high'
      },
      {
        title: 'Configure Development HTTPS',
        description: 'Set up proper HTTPS certificates for local development using tools like mkcert.',
        priority: 'medium'
      }
    ]
  },
  {
    problem: 'Port Access Issues',
    symptoms: [
      'Connection refused errors',
      'Port not accessible from mobile',
      'Development server not responding'
    ],
    steps: [
      {
        title: 'Check Port Availability',
        description: 'Ensure the development server port is not blocked or in use by another application.',
        priority: 'high'
      },
      {
        title: 'Use Common Ports',
        description: 'Try using common development ports like 3000, 8000, 8080 that are less likely to be blocked.',
        priority: 'medium'
      },
      {
        title: 'Configure Router/Network',
        description: 'Check if your router or network has restrictions on certain ports.',
        priority: 'low'
      }
    ]
  }
];

/**
 * 根据网络信息获取相关的故障排除建议
 */
export const getTroubleshootingSteps = (
  isLocalhost: boolean,
  networkStatus: string,
  url: string
): TroubleshootingStep[] => {
  const steps: TroubleshootingStep[] = [];

  if (networkStatus === 'disconnected') {
    steps.push({
      title: 'Check Network Connection',
      description: 'Your device appears to be offline. Check your internet connection.',
      priority: 'high'
    });
    return steps;
  }

  if (isLocalhost) {
    const localhostGuide = networkTroubleshootingGuides.find(
      guide => guide.problem === 'Localhost URL cannot be accessed from mobile'
    );
    if (localhostGuide) {
      steps.push(...localhostGuide.steps.filter(step => step.priority === 'high'));
    }
  }

  if (url.startsWith('https:')) {
    const httpsGuide = networkTroubleshootingGuides.find(
      guide => guide.problem === 'HTTPS/SSL Certificate Issues'
    );
    if (httpsGuide) {
      steps.push(...httpsGuide.steps.slice(0, 2)); // Add first 2 steps
    }
  }

  // Add general port access suggestions
  const portGuide = networkTroubleshootingGuides.find(
    guide => guide.problem === 'Port Access Issues'
  );
  if (portGuide && isLocalhost) {
    steps.push(portGuide.steps[0]); // Add port availability check
  }

  return steps;
};

/**
 * 生成快速修复命令建议
 */
export const getQuickFixCommands = (url: string): string[] => {
  const commands: string[] = [];
  
  try {
    const urlObj = new URL(url);
    const port = urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80');
    
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      // Common development server commands with host binding
      commands.push(
        `# For Vite projects:
npm run dev -- --host 0.0.0.0`,
        `# For Create React App:
HOST=0.0.0.0 npm start`,
        `# For Next.js:
npm run dev -- -H 0.0.0.0`,
        `# For general Node.js servers:
node server.js --host 0.0.0.0 --port ${port}`
      );
    }
  } catch (error) {
    console.warn('Could not parse URL for quick fix commands:', error);
  }
  
  return commands;
};

/**
 * 检查常见的开发服务器配置问题
 */
export const checkDevelopmentServerConfig = (url: string): string[] => {
  const issues: string[] = [];
  
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      issues.push('Development server is only listening on localhost');
      issues.push('Mobile devices cannot access localhost directly');
      issues.push('Consider configuring server to listen on 0.0.0.0');
    }
    
    const port = parseInt(urlObj.port || '0');
    if (port > 0 && port < 1024) {
      issues.push('Using privileged port (< 1024) may require admin rights');
    }
    
    if (urlObj.protocol === 'https:' && urlObj.hostname !== 'localhost') {
      issues.push('HTTPS with local IP may cause certificate warnings');
    }
  } catch (error) {
    issues.push('Invalid URL format detected');
  }
  
  return issues;
};
