const fs = require('fs');

const y_start = 2069.6;
const y_end = 2237.6;
const width = 1512;

let bestA = 0;
let bestB = 0;
let minError = Infinity;

for (let A = 40; A <= 120; A += 0.5) {
  for (let B = -30; B <= 30; B += 0.5) {
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

const y_linear = (x) => y_start + (y_end - y_start) * (x / width);
const y = (x) => y_linear(x) + bestA * Math.sin((2 * Math.PI * x) / width) - bestB * Math.sin((4 * Math.PI * x) / width);

let points = [];
const steps = 150;
for (let i = 0; i <= steps; i++) {
  const x = (i * width) / steps;
  points.push(`${x.toFixed(2)} ${y(x).toFixed(2)}`);
}

let pathPoints = [];
for (let i = steps; i >= 0; i--) {
  const x = (i * width) / steps;
  pathPoints.push(`${i === steps ? 'M' : 'L'}${x.toFixed(2)} ${y(x).toFixed(2)}`);
}

const pathD = pathPoints.join('') + `V2372H${width}V${y_end}Z`;
console.log('Path length:', pathD.length);
console.log(pathD.substring(0, 200) + '...');
fs.writeFileSync('wave_path.txt', pathD);
