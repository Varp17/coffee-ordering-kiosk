const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images');
const files = fs.readdirSync(dir);

console.log('File Name | Real Type | Width | Height');
console.log('---|---|---|---');

files.forEach(f => {
  if (f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg')) {
    const filePath = path.join(dir, f);
    const buffer = fs.readFileSync(filePath);
    
    // PNG
    if (buffer.length >= 8 && buffer.readUInt32BE(0) === 0x89504E47) {
      if (buffer.toString('ascii', 12, 16) === 'IHDR') {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        console.log(`${f} | PNG | ${width} | ${height}`);
      }
    }
    // WebP
    else if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      // Simple WebP size parsing
      const vp8 = buffer.toString('ascii', 12, 16);
      if (vp8 === 'VP8 ') {
        const width = buffer.readUInt16LE(26) & 0x3fff;
        const height = buffer.readUInt16LE(28) & 0x3fff;
        console.log(`${f} | WebP (VP8) | ${width} | ${height}`);
      } else if (vp8 === 'VP8L') {
        const val = buffer.readUInt32LE(21);
        const width = (val & 0x3FFF) + 1;
        const height = ((val >> 14) & 0x3FFF) + 1;
        console.log(`${f} | WebP (VP8L) | ${width} | ${height}`);
      } else if (vp8 === 'VP8X') {
        const width = (buffer.readUInt32LE(24) & 0xFFFFFF) + 1;
        const height = (buffer.readUInt32LE(27) & 0xFFFFFF) + 1;
        console.log(`${f} | WebP (VP8X) | ${width} | ${height}`);
      } else {
        console.log(`${f} | WebP (Unknown) | - | -`);
      }
    }
    // JPEG
    else if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let offset = 2;
      let width = -1, height = -1;
      while (offset < buffer.length) {
        const marker = buffer.readUInt16BE(offset);
        const length = buffer.readUInt16BE(offset + 2);
        if (marker >= 0xFFC0 && marker <= 0xFFC3) {
          height = buffer.readUInt16BE(offset + 5);
          width = buffer.readUInt16BE(offset + 7);
          break;
        }
        offset += 2 + length;
      }
      console.log(`${f} | JPEG | ${width} | ${height}`);
    }
    else {
      console.log(`${f} | Unknown | - | -`);
    }
  }
});
