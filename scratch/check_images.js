const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images');
const files = fs.readdirSync(dir);

console.log('File Name | Size (Bytes)');
console.log('---|---');
files.forEach(f => {
  if (f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.jpg')) {
    const stats = fs.statSync(path.join(dir, f));
    console.log(`${f} | ${stats.size}`);
  }
});
