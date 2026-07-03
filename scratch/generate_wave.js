const fs = require('fs');

// We want a function y(x) for x from 0 to 1512.
// Endpoints:
// y(0) = 2069.6
// y(1512) = 2237.6
//
// We want:
// - A trough around x = 378 (y around 2210 - 2220)
// - A crest around x = 1100 (y around 2110 - 2129)
//
// Let's model y(x) = y_base(x) + A * sin(2 * pi * x / 1512) + B * sin(4 * pi * x / 1512) + C * cos(...)
// Or simply a cubic spline or polynomial, or a sum of sines.
// Let's try:
// y(x) = y_start + (y_end - y_start) * (x / 1512) + A * sin(2 * pi * x / 1512) + B * sin(4 * pi * x / 1512)
//
// Let's optimize A and B to get the desired trough and crest heights.
// Target trough: x = 378, y = 2215
// Target crest: x = 1134, y = 2125
//
// Let's write a loop to search for A and B.

const y_start = 2069.6;
const y_end = 2237.6;
const width = 1512;

let bestA = 0;
let bestB = 0;
let minError = Infinity;

for (let A = 40; A <= 100; A += 0.5) {
  for (let B = -20; B <= 20; B += 0.5) {
    // calculate values at x = 378 and x = 1134
    const y_linear = (x) => y_start + (y_end - y_start) * (x / width);
    const y = (x) => y_linear(x) + A * Math.sin((2 * Math.PI * x) / width) - B * Math.sin((4 * Math.PI * x) / width);
    
    const y_378 = y(378);
    const y_1134 = y(1134);
    
    const error = Math.abs(y_378 - 2215) + Math.abs(y_1134 - 2125);
    if (error < minError) {
      minError = error;
      bestA = A;
      bestB = B;
    }
  }
}

console.log(`Best A: ${bestA}, B: ${bestB}, Error: ${minError}`);

// Let's generate a path with 150 points for maximum smoothness.
const y_linear = (x) => y_start + (y_end - y_start) * (x / width);
const y = (x) => y_linear(x) + bestA * Math.sin((2 * Math.PI * x) / width) - bestB * Math.sin((4 * Math.PI * x) / width);

let points = [];
const steps = 150;
for (let i = 0; i <= steps; i++) {
  const x = (i * width) / steps;
  points.push(`${x.toFixed(2)} ${y(x).toFixed(2)}`);
}

// Since the original path went from 1512 back to 0, or 0 to 1512:
// Original: 'M1512 2237.6 ... C ... 0 2069.6 V2372 H1512 V2237.6 Z'
// Let's build the path starting at 1512 and going to 0:
let pathPoints = [];
for (let i = steps; i >= 0; i--) {
  const x = (i * width) / steps;
  pathPoints.push(`${i === steps ? 'M' : 'L'}${x.toFixed(2)} ${y(x).toFixed(2)}`);
}

const pathD = pathPoints.join('') + `V2372H${width}V${y_end}Z`;
console.log('Path length:', pathD.length);
console.log(pathD.substring(0, 200) + '...');
fs.writeFileSync('wave_path.txt', pathD);
