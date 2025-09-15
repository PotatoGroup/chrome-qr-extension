# H5 Mobile Preview QR Generator

一个基于React + TypeScript的Chrome浏览器插件，用于在开发H5移动端组件库时生成当前页面的二维码，方便在移动设备上扫码预览页面内容，查看实时UI效果。

## 功能特性

- 🔄 **一键生成QR码**: 快速生成当前页面的二维码
- 📱 **移动端预览**: 使用手机扫码即可预览当前页面
- 📋 **URL复制**: 一键复制当前页面URL
- 🎨 **精美界面**: 现代化的用户界面设计
- ⚡ **快速响应**: 基于React的高性能组件

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Webpack 5
- **QR码生成**: qrcode.js
- **样式**: CSS3 + Flexbox
- **开发环境**: Chrome Extension Manifest V3

## 项目结构

```
chrome-qr-extension/
├── public/
│   ├── manifest.json        # Chrome扩展配置文件
│   ├── popup.html          # 弹窗HTML模板
│   └── icons/              # 扩展图标
├── src/
│   ├── components/         # React组件
│   │   ├── App.tsx         # 主应用组件
│   │   └── QRDisplay.tsx   # QR码显示组件
│   ├── utils/              # 工具函数
│   │   └── qrcode.ts       # QR码生成相关工具
│   ├── types/              # TypeScript类型定义
│   │   └── index.ts
│   ├── styles/             # 样式文件
│   │   └── popup.css
│   └── popup.tsx           # 弹窗入口文件
├── dist/                   # 构建输出目录
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript配置
├── webpack.config.js       # Webpack配置
└── README.md
```

## 安装和使用

### 1. 安装依赖

```bash
cd chrome-qr-extension
npm install
```

### 2. 构建项目

开发模式（监听文件变化）：
```bash
npm run dev
```

生产模式构建：
```bash
npm run build
```

### 3. 加载Chrome扩展

1. 打开Chrome浏览器，访问 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `chrome-qr-extension` 文件夹
5. 扩展加载成功后会在浏览器工具栏显示图标

### 4. 使用扩展

1. 在需要预览的H5页面上点击扩展图标
2. 扩展会自动生成当前页面的QR码
3. 使用手机扫描QR码即可在移动端预览页面
4. 可以点击"刷新QR码"按钮重新生成
5. 可以点击复制按钮复制页面URL

## 开发说明

### 主要组件

- **App.tsx**: 主应用组件，负责状态管理和QR码生成逻辑
- **QRDisplay.tsx**: QR码显示组件，包含QR码图片、页面信息、操作按钮等
- **qrcode.ts**: QR码生成工具函数和Chrome API封装

### Chrome Extension权限

- `activeTab`: 访问当前活动标签页信息
- `tabs`: 获取标签页URL和标题

### 开发注意事项

1. 使用Chrome Extension Manifest V3规范
2. 遵循Content Security Policy限制
3. 使用TypeScript进行类型检查
4. 组件化开发，便于维护和扩展

## 适用场景

- H5移动端组件库开发
- 响应式网页开发测试
- 移动端UI效果预览
- 跨设备页面调试
- 移动端兼容性测试

## 浏览器兼容性

- Chrome 88+
- Edge 88+
- 其他基于Chromium的浏览器

## 许可证

MIT License

## 贡献指南

欢迎提交Issue和Pull Request来帮助改进这个项目！

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 基础QR码生成功能
- React + TypeScript技术栈
- 现代化UI设计