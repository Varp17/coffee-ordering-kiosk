const fs = require('fs');

// Cubic Spline Interpolation
// Ref: https://en.wikipedia.org/wiki/Spline_interpolation
function createSpline(xs, ys) {
  const n = xs.length;
  const a = [...ys];
  const b = new Array(n - 1);
  const d = new Array(n - 1);
  const h = new Array(n - 1);

  for (let i = 0; i < n - 1; i++) {
    h[i] = xs[i + 1] - xs[i];
  }

  const alpha = new Array(n - 1);
  for (let i = 1; i < n - 1; i++) {
    alpha[i] = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1]);
  }

  const l = new Array(n);
  const mu = new Array(n);
  const z = new Array(n);
  const c = new Array(n);

  l[0] = 1;
  mu[0] = 0;
  z[0] = 0;

  for (let i = 1; i < n - 1; i++) {
    l[i] = 2 * (xs[i + 1] - xs[i - 1]) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }

  l[n - 1] = 1;
  z[n - 1] = 0;
  c[n - 1] = 0;

  for (let j = n - 2; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
    b[j] = (a[j + 1] - a[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }

  return {
    eval(x) {
      if (x <= xs[0]) return ys[0];
      if (x >= xs[n - 1]) return ys[n - 1];
      
      // Find interval
      let i = 0;
      while (i < n - 1 && x > xs[i + 1]) {
        i++;
      }
      
      const dx = x - xs[i];
      return a[i] + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx;
    }
  };
}

// Key points for a gorgeous smooth wave:
// Start high: 0, 2069.6
// Trough (minimum in SVG is maximum y): ~500, 2240.0
// Crest (maximum in SVG is minimum y): ~1130, 2125.0
// End: 1512, 2237.6
const xs = [0, 250, 500, 800, 1130, 1350, 1512];
const ys = [2069.6, 2170.0, 2242.0, 2195.0, 2125.0, 2175.0, 2237.6];

const spline = createSpline(xs, ys);

const steps = 300;
let pathPoints = [];
const width = 1512;

for (let i = steps; i >= 0; i--) {
  const x = (i * width) / steps;
  const y = spline.eval(x);
  pathPoints.push(`${i === steps ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`);
}

const pathD = pathPoints.join('') + `V2372H${width}V2237.60Z`;
console.log('Spline path length:', pathD.length);
fs.writeFileSync('wave_path_spline.txt', pathD);
console.log('Path saved to wave_path_spline.txt');
