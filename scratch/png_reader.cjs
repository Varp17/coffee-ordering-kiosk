const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function getPngCenterColor(filePath) {
  const buffer = fs.readFileSync(filePath);
  let offset = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0;
  let idatBuffers = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buffer.readUInt32BE(offset + 8);
      height = buffer.readUInt32BE(offset + 12);
      bitDepth = buffer[offset + 16];
      colorType = buffer[offset + 17];
    } else if (type === 'IDAT') {
      idatBuffers.push(buffer.subarray(offset + 8, offset + 8 + length));
    }
    offset += 12 + length;
  }

  if (width === 0 || height === 0 || idatBuffers.length === 0) {
    return 'Invalid PNG';
  }

  // Decompress IDAT chunks
  const idatBuffer = Buffer.concat(idatBuffers);
  let decompressed;
  try {
    decompressed = zlib.inflateSync(idatBuffer);
  } catch (e) {
    return 'Decompression failed: ' + e.message;
  }

  // PNG scanline parser (simplistic, assuming colorType 6 (RGBA) or 2 (RGB) and bitDepth 8)
  const bytesPerPixel = colorType === 6 ? 4 : (colorType === 2 ? 3 : 1);
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    return `Unsupported PNG format (colorType=${colorType}, bitDepth=${bitDepth})`;
  }

  const scanlineLength = width * bytesPerPixel + 1; // +1 for filter type byte
  
  // Let's get the center pixel color
  const centerY = Math.floor(height / 2);
  const centerX = Math.floor(width / 2);
  
  const centerScanlineStart = centerY * scanlineLength;
  const pixelOffset = centerScanlineStart + 1 + centerX * bytesPerPixel;
  
  if (pixelOffset + 3 < decompressed.length) {
    const r = decompressed[pixelOffset];
    const g = decompressed[pixelOffset + 1];
    const b = decompressed[pixelOffset + 2];
    const a = colorType === 6 ? decompressed[pixelOffset + 3] : 255;
    return `Center RGB: (${r}, ${g}, ${b}), Alpha: ${a}`;
  }
  
  return 'Pixel out of range';
}

const dir = path.join(__dirname, '../public/images');
const files = ['image1_366_1172.png', 'image3_366_1172.png', 'image4_366_1172.png', 'image7_366_1172.png', 'image8_366_1172.png', 'image9_366_1172.png', 'image10_366_1172.png'];

files.forEach(f => {
  const filePath = path.join(dir, f);
  if (fs.existsSync(filePath)) {
    console.log(`${f}: ${getPngCenterColor(filePath)}`);
  }
});
