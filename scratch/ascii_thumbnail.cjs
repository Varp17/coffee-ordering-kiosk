const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function getAsciiArt(filePath) {
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

  const idatBuffer = Buffer.concat(idatBuffers);
  let decompressed;
  try {
    decompressed = zlib.inflateSync(idatBuffer);
  } catch (e) {
    return 'Decompression failed: ' + e.message;
  }

  const bytesPerPixel = colorType === 6 ? 4 : (colorType === 2 ? 3 : 1);
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    return `Unsupported PNG format (colorType=${colorType}, bitDepth=${bitDepth})`;
  }

  const stride = width * bytesPerPixel;
  const scanlineLength = stride + 1;
  const pixels = Buffer.alloc(width * height * bytesPerPixel);

  // PNG Unfiltering
  let prevRow = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const rowStart = y * scanlineLength;
    const filterType = decompressed[rowStart];
    const rowData = decompressed.subarray(rowStart + 1, rowStart + 1 + stride);
    const currentRow = Buffer.alloc(stride);

    for (let x = 0; x < stride; x++) {
      const raw = rowData[x];
      const left = x >= bytesPerPixel ? currentRow[x - bytesPerPixel] : 0;
      const up = prevRow[x];
      const upLeft = x >= bytesPerPixel ? prevRow[x - bytesPerPixel] : 0;

      let val = 0;
      if (filterType === 0) { // None
        val = raw;
      } else if (filterType === 1) { // Sub
        val = (raw + left) & 0xFF;
      } else if (filterType === 2) { // Up
        val = (raw + up) & 0xFF;
      } else if (filterType === 3) { // Average
        val = (raw + Math.floor((left + up) / 2)) & 0xFF;
      } else if (filterType === 4) { // Paeth
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        let paeth = 0;
        if (pa <= pb && pa <= pc) paeth = left;
        else if (pb <= pc) paeth = up;
        else paeth = upLeft;
        val = (raw + paeth) & 0xFF;
      }
      currentRow[x] = val;
      pixels[y * stride + x] = val;
    }
    prevRow = currentRow;
  }

  // Render to ASCII (20x20)
  const targetW = 30;
  const targetH = 20;
  let art = '';
  
  // ASCII chars representing density/brightness
  const chars = ' .:-=+*#%@';

  for (let ty = 0; ty < targetH; ty++) {
    for (let tx = 0; tx < targetW; tx++) {
      const srcX = Math.floor(tx * width / targetW);
      const srcY = Math.floor(ty * height / targetH);
      const pixelOffset = (srcY * width + srcX) * bytesPerPixel;
      
      const r = pixels[pixelOffset];
      const g = pixels[pixelOffset + 1];
      const b = pixels[pixelOffset + 2];
      const a = bytesPerPixel === 4 ? pixels[pixelOffset + 3] : 255;
      
      if (a < 50) {
        art += ' '; // Transparent
      } else {
        const brightness = (r + g + b) / 3;
        const charIdx = Math.floor(brightness / 256 * chars.length);
        art += chars[charIdx];
      }
    }
    art += '\n';
  }
  return art;
}

const dir = path.join(__dirname, '../public/images');
const testFiles = ['image1_366_1172.png', 'image3_366_1172.png', 'image4_366_1172.png', 'image7_366_1172.png', 'image8_366_1172.png', 'image9_366_1172.png', 'image10_366_1172.png'];

testFiles.forEach(f => {
  const filePath = path.join(dir, f);
  if (fs.existsSync(filePath)) {
    console.log(`=== ${f} ===`);
    console.log(getAsciiArt(filePath));
  }
});
