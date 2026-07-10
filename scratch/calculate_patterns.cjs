// Bounding box calculator for SVG paths in WhyChilldCup
const paths = {
  one: {
    viewBox: [113, 2517, 238, 340],
    body: 'M190.482 2853.73L134.217 2612.59C133.811 2610.85 134.993 2609.14 136.763 2608.91L335.802 2582.43C337.594 2582.19 339.193 2583.57 339.224 2585.38L343.558 2833.42C343.584 2834.96 342.455 2836.27 340.933 2836.47L193.826 2856.04C192.282 2856.24 190.836 2855.24 190.482 2853.73Z',
    imgW: 1024,
    imgH: 683,
  },
  two: {
    viewBox: [488, 2782, 238, 321],
    body: 'M517.738 3094.83L502.495 2847.69C502.385 2845.91 503.836 2844.42 505.62 2844.48L706.286 2851.59C708.092 2851.65 709.44 2853.28 709.169 2855.06L672.055 3100.35C671.826 3101.87 670.494 3102.98 668.958 3102.92L520.649 3097.67C519.093 3097.61 517.833 3096.39 517.738 3094.83Z',
    imgW: 1024,
    imgH: 683,
  },
  three: {
    viewBox: [798, 2582, 238, 329],
    body: 'M853.299 2908.25L816.079 2663.45C815.811 2661.68 817.123 2660.07 818.906 2659.97L1019.41 2649.16C1021.21 2649.06 1022.7 2650.56 1022.59 2652.36L1007.49 2899.98C1007.4 2901.52 1006.17 2902.74 1004.64 2902.82L856.451 2910.81C854.897 2910.9 853.533 2909.79 853.299 2908.25Z',
    imgW: 736,
    imgH: 1078, // image7_366_1172.png (hourglass)
  },
  four: {
    viewBox: [1136, 2830, 243, 333],
    body: 'M1136.81 3135.28L1153.27 2888.21C1153.39 2886.43 1155.02 2885.14 1156.78 2885.43L1354.89 2918.12C1356.67 2918.41 1357.8 2920.19 1357.31 2921.93L1289.16 3160.47C1288.74 3162.62 1287.28 3163.46 1285.76 3163.21L1139.34 3139.05C1137.8 3138.8 1136.71 3137.42 1136.81 3135.87Z',
    imgW: 378,
    imgH: 526, // image4_366_1172.png (iced coffee)
  }
};

function parsePathPoints(d) {
  const matches = d.match(/[MLC](\d+\.?\d*)\s+(\d+\.?\d*)/g) || [];
  let xs = [], ys = [];
  matches.forEach(m => {
    const parts = m.slice(1).trim().split(/\s+/);
    xs.push(parseFloat(parts[0]));
    ys.push(parseFloat(parts[1]));
  });
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

Object.keys(paths).forEach(k => {
  const p = paths[k];
  const box = parsePathPoints(p.body);
  console.log(`=== Cup ${k} ===`);
  console.log(`ViewBox: ${p.viewBox.join(' ')}`);
  console.log(`Path Bounding Box: X [${box.minX.toFixed(2)}, ${box.maxX.toFixed(2)}] (width ${(box.maxX - box.minX).toFixed(2)})`);
  console.log(`Path Bounding Box: Y [${box.minY.toFixed(2)}, ${box.maxY.toFixed(2)}] (height ${(box.maxY - box.minY).toFixed(2)})`);
});
