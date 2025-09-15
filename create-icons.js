// 简单的图标生成脚本 - 创建基础的PNG数据
const fs = require('fs');
const path = require('path');

// 创建一个简单的16x16 PNG图标 (QR图案)
function createSimpleIcon(size, filename) {
  // PNG 文件头
  const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR 数据 (图像头)
  const width = size;
  const height = size;
  const bitDepth = 8;
  const colorType = 2; // RGB
  const compression = 0;
  const filter = 0;
  const interlace = 0;
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = bitDepth;
  ihdrData[9] = colorType;
  ihdrData[10] = compression;
  ihdrData[11] = filter;
  ihdrData[12] = interlace;
  
  // 创建简单的QR码图案
  const pixels = [];
  for (let y = 0; y < height; y++) {
    pixels.push(0); // 滤波字节
    for (let x = 0; x < width; x++) {
      // 创建简单的QR码样式图案
      const isCorner = (x < 3 && y < 3) || (x >= width-3 && y < 3) || (x < 3 && y >= height-3);
      const isPattern = (x + y) % 3 === 0 || isCorner;
      
      if (isPattern) {
        pixels.push(102, 126, 234); // RGB: #667eea
      } else {
        pixels.push(255, 255, 255); // RGB: white
      }
    }
  }
  
  const pixelData = Buffer.from(pixels);
  
  // 计算CRC
  function crc32(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
      crc = crc ^ data[i];
      for (let j = 0; j < 8; j++) {
        if (crc & 1) {
          crc = (crc >>> 1) ^ 0xEDB88320;
        } else {
          crc = crc >>> 1;
        }
      }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }
  
  // 创建chunks
  function createChunk(type, data) {
    const typeBuffer = Buffer.from(type);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcData), 0);
    
    return Buffer.concat([length, typeBuffer, data, crc]);
  }
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // 使用zlib压缩像素数据 (简化版本，不实际压缩)
  const idatData = pixelData;
  const idatChunk = createChunk('IDAT', idatData);
  
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  const pngData = Buffer.concat([PNG_SIGNATURE, ihdrChunk, idatChunk, iendChunk]);
  
  fs.writeFileSync(path.join(__dirname, 'dist', 'icons', filename), pngData);
  console.log(`Created ${filename} (${size}x${size})`);
}

// 由于PNG格式复杂，这里我们创建一个更简单的解决方案
// 创建SVG作为临时图标
function createSVGIcon(size, filename) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${Math.floor(size/6)}" fill="url(#gradient)"/>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#667eea"/>
        <stop offset="100%" style="stop-color:#764ba2"/>
      </linearGradient>
    </defs>
    <g transform="translate(${Math.floor(size*0.15)}, ${Math.floor(size*0.15)})">
      ${Array.from({length: Math.floor(size/4)}, (_, i) => 
        Array.from({length: Math.floor(size/4)}, (_, j) => {
          const shouldFill = (i + j) % 2 === 0 || (i < 2 && j < 2) || (i >= Math.floor(size/4)-2 && j < 2) || (i < 2 && j >= Math.floor(size/4)-2);
          return shouldFill ? `<rect x="${j*4}" y="${i*4}" width="3" height="3" fill="white" opacity="0.9"/>` : '';
        }).join('')
      ).join('')}
    </g>
    <circle cx="${size-size*0.2}" cy="${size-size*0.2}" r="${size*0.08}" fill="white" opacity="0.8"/>
  </svg>`;
  
  fs.writeFileSync(path.join(__dirname, 'dist', 'icons', filename.replace('.png', '.svg')), svg);
  console.log(`Created ${filename.replace('.png', '.svg')} (${size}x${size})`);
}

// 确保图标目录存在
const iconsDir = path.join(__dirname, 'dist', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Creating icon files...');

// 创建SVG图标文件 (作为临时解决方案)
createSVGIcon(16, 'icon16.png');
createSVGIcon(32, 'icon32.png');
createSVGIcon(48, 'icon48.png');
createSVGIcon(128, 'icon128.png');

console.log('\nIcon files created successfully!');
console.log('Note: SVG files were created instead of PNG. For production use, please convert these to PNG format.');
console.log('You can use online tools or imagemagick to convert SVG to PNG format.');