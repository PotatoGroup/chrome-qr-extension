# Chrome扩展安装说明

## 快速开始

### 1. 项目构建
```bash
# 安装依赖
npm install

# 构建项目
npm run build
```

### 2. 准备图标文件
由于Chrome扩展需要PNG格式的图标文件，而我们提供了SVG格式的图标，您需要将SVG转换为PNG格式。

#### 方法一：在线转换
1. 打开 `icon.svg` 文件
2. 使用在线SVG转PNG工具，如：
   - https://convertio.co/svg-png/
   - https://cloudconvert.com/svg-to-png
   - https://www.aconvert.com/image/svg-to-png/

3. 将SVG转换为以下尺寸的PNG文件：
   - `icon16.png` (16x16)
   - `icon32.png` (32x32) 
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)

4. 将生成的PNG文件放入 `dist/icons/` 目录

#### 方法二：使用命令行工具（需要安装imagemagick）
```bash
# 安装 imagemagick (macOS)
brew install imagemagick

# 创建图标文件夹
mkdir -p dist/icons

# 转换图标
convert icon.svg -resize 16x16 dist/icons/icon16.png
convert icon.svg -resize 32x32 dist/icons/icon32.png
convert icon.svg -resize 48x48 dist/icons/icon48.png
convert icon.svg -resize 128x128 dist/icons/icon128.png
```

### 3. 在Chrome中加载扩展

1. 打开Chrome浏览器
2. 在地址栏输入: `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 文件夹
6. 扩展将出现在Chrome工具栏中

### 4. 使用扩展

1. 访问任何网页
2. 点击Chrome工具栏中的扩展图标
3. 扩展会自动生成当前页面的二维码
4. 使用手机扫描二维码即可在移动设备上预览页面

## 开发模式

开发时可以使用监听模式：
```bash
npm run dev
```

这会监听文件变化并自动重新构建。在Chrome扩展页面点击"重新加载"按钮即可看到更新。

## 故障排除

### 扩展无法加载
- 确保 `dist/` 目录包含 `manifest.json`
- 检查 `dist/icons/` 目录是否有所需的图标文件

### 二维码无法生成
- 检查是否在https://页面上（某些http://页面可能有限制）
- 确保页面URL可以正常访问

### 权限问题
- 扩展需要"活动标签页"权限才能读取当前页面信息
- 某些特殊页面（如chrome://页面）可能无法访问

## 技术支持

如果遇到问题，请检查：
1. Chrome开发者工具中的控制台错误信息
2. Chrome扩展页面中的错误提示
3. 确保所有依赖都已正确安装