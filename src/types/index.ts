export interface TabInfo {
  id: number;
  url: string;
  title: string;
}

export interface QRCodeOptions {
  size: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
}

export interface ExtensionMessage {
  type: string;
  payload?: any;
}