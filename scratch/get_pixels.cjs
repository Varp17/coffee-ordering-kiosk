const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images');
const files = ['image1_366_1172.png', 'image3_366_1172.png', 'image4_366_1172.png', 'image7_366_1172.png', 'image8_366_1172.png', 'image9_366_1172.png', 'image10_366_1172.png'];

files.forEach(f => {
  const filePath = path.join(dir, f);
  if (!fs.existsSync(filePath)) return;
  const buffer = fs.readFileSync(filePath);
  
  // Find IHDR
  if (buffer.readUInt32BE(0) === 0x89504E47) {
    let offset = 8;
    let width = 0, height = 0, bitDepth = 0, colorType = 0;
    while (offset < buffer.length) {
      const length = buffer.readUInt32BE(offset);
      const type = buffer.toString('ascii', offset + 4, offset + 8);
      if (type === 'IHDR') {
        width = buffer.readUInt32BE(offset + 8);
        height = buffer.readUInt32BE(offset + 12);
        bitDepth = buffer[offset + 16];
        colorType = buffer[offset + 17];
        break;
      }
      offset += 12 + length;
    }
    
    console.log(`${f}: ${width}x${height}, type=${colorType}, depth=${bitDepth}`);
  }
});
