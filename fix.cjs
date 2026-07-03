const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage/HomePage.jsx', 'utf8');

// The start of the block is <div className="bento-video-card">
const startIndex = content.indexOf('<div className="bento-video-card">');

// The end of the block is after the second BENTO_SOCIAL_SLOTS.map
const endMarker = '          {/* ── INFINITE TRENDING MIXES CAROUSEL ── */}';
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.slice(0, startIndex) + '<TestimonialsBento />\n\n' + content.slice(endIndex);
  fs.writeFileSync('src/pages/HomePage/HomePage.jsx', content);
  console.log('Success');
} else {
  console.log('Failed to find indices');
}
