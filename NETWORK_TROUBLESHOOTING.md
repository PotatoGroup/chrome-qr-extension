# 网络访问问题解决方案

## 问题描述

在使用Chrome扩展生成二维码预览H5组件时，手机扫描二维码可能遇到网络访问问题，主要表现为：
- 手机无法访问localhost地址
- 连接超时或拒绝连接
- 防火墙阻止局域网访问

## 解决方案

### 1. 自动localhost转换 ✨

扩展程序现在会自动检测localhost URL并转换为局域网IP地址：
- **原始URL**: `http://localhost:3000/component`
- **转换后URL**: `http://192.168.1.100:3000/component`

### 2. 网络状态检测

扩展程序会显示当前网络状态：
- ✅ 网络正常，非localhost URL
- ⚠️ 检测到localhost，已自动转换
- ❌ 网络断开连接
- ❓ 网络状态未知

### 3. 智能建议系统

根据检测到的网络情况，扩展程序会提供相应的解决建议：

#### Localhost访问问题
- 确保电脑和手机连接到同一WiFi网络
- 检查防火墙设置，允许局域网访问
- 使用转换后的局域网IP地址

#### 开发服务器配置
配置开发服务器监听所有网络接口：

```bash
# Vite项目
npm run dev -- --host 0.0.0.0

# Create React App
HOST=0.0.0.0 npm start

# Next.js
npm run dev -- -H 0.0.0.0

# 通用Node.js服务器
node server.js --host 0.0.0.0 --port 3000
```

#### 防火墙设置
- **Windows**: 控制面板 → 系统和安全 → Windows Defender防火墙 → 允许应用通过防火墙
- **macOS**: 系统偏好设置 → 安全性与隐私 → 防火墙 → 防火墙选项
- **Linux**: `sudo ufw allow 3000` (以端口3000为例)

### 4. HTTPS证书问题

对于HTTPS开发环境：
- 在手机浏览器中手动接受自签名证书警告
- 考虑使用HTTP进行本地开发
- 使用mkcert等工具生成本地HTTPS证书

## 使用指南

### 1. 安装和使用
1. 构建扩展程序：`npm run build`
2. 在Chrome中加载`dist`文件夹作为扩展程序
3. 访问需要预览的页面
4. 点击扩展程序图标生成二维码

### 2. 查看网络信息
- 扩展程序会自动显示网络状态
- 点击状态栏的下拉箭头查看详细建议
- 复制转换后的URL或替代URL

### 3. 故障排除
如果仍然无法访问：
1. 检查网络连接状态
2. 确认开发服务器正在运行
3. 验证防火墙设置
4. 尝试使用替代URL

## 技术实现

### 核心功能
- **IP地址检测**: 使用WebRTC获取本地IP地址
- **URL转换**: 自动将localhost转换为局域网IP
- **网络状态检测**: 实时监控网络连接状态
- **智能建议**: 根据网络环境提供相应解决方案

### 文件结构
```
src/
├── utils/
│   ├── network.ts          # 网络检测工具
│   ├── qrcode.ts          # 二维码生成（已增强）
│   └── troubleshooting.ts # 故障排除指南
├── components/
│   ├── App.tsx            # 主应用（已增强）
│   └── QRDisplay.tsx      # 二维码显示（已增强）
└── styles/
    └── popup.css          # 样式（已增强）
```

## 常见问题

### Q: 为什么手机仍然无法访问？
A: 请检查：
1. 电脑和手机是否在同一WiFi网络
2. 开发服务器是否配置为监听0.0.0.0
3. 防火墙是否允许相应端口访问

### Q: 如何知道转换是否成功？
A: 扩展程序界面会显示：
- 原始URL和转换后的URL（如果不同）
- 网络状态指示器
- localhost检测警告

### Q: 支持哪些开发服务器？
A: 支持所有标准的HTTP/HTTPS服务器，包括：
- Vite、Webpack Dev Server
- Create React App、Next.js
- Express、Koa等Node.js服务器
- Python、PHP等其他语言的开发服务器

## 更新日志

### v1.1.0 (当前版本)
- ✨ 新增自动localhost转换功能
- ✨ 新增网络状态检测
- ✨ 新增智能建议系统
- ✨ 新增故障排除指南
- 🎨 优化UI界面，显示更多网络信息
- 🐛 修复手机无法访问localhost的问题

### v1.0.0
- 🎉 基础二维码生成功能
- 📱 Chrome扩展程序框架
- 🎨 基础UI界面
