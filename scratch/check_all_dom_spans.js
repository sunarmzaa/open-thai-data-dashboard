const fs = require('fs');
const path = require('path');

// Let's test every span across index.html and wcag-suite.js against all CSS rules

function getLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(c1, c2) {
  if (!c1 || !c2) return null;
  const l1 = getLuminance(c1);
  const l2 = getLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex) {
  if (!hex) return null;
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16)
    };
  }
  return null;
}

// Let's check what exact hex codes in styles.css and components.css produce:
// 1.00:1, 1.03:1, 1.05:1 when paired together!

const allColors = [
  { name: '#080e1a (dark bg)', rgb: hexToRgb('#080e1a') },
  { name: '#0f172a (dark bg-alt / light text)', rgb: hexToRgb('#0f172a') },
  { name: '#162032 (dark surface-1)', rgb: hexToRgb('#162032') },
  { name: '#1e293b (dark surface-2 / light text-3)', rgb: hexToRgb('#1e293b') },
  { name: '#334155 (dark surface-3 / light chart-text)', rgb: hexToRgb('#334155') },
  { name: '#93c5fd (dark primary)', rgb: hexToRgb('#93c5fd') },
  { name: '#60a5fa (dark primary-dark)', rgb: hexToRgb('#60a5fa') },
  { name: '#fde047 (dark accent)', rgb: hexToRgb('#fde047') },
  { name: '#fbbf24 (dark accent-dark)', rgb: hexToRgb('#fbbf24') },
  { name: '#6ee7b7 (dark success)', rgb: hexToRgb('#6ee7b7') },
  { name: '#fca5a5 (dark error)', rgb: hexToRgb('#fca5a5') },
  { name: '#f8fafc (dark text / light bg)', rgb: hexToRgb('#f8fafc') },
  { name: '#f1f5f9 (dark text-3 / light bg-alt / surface-2)', rgb: hexToRgb('#f1f5f9') },
  { name: '#131d2f (dark glass)', rgb: hexToRgb('#131d2f') },
  { name: '#21334c (dark badge-bg)', rgb: hexToRgb('#21334c') },
  { name: '#bfdbfe (dark badge-text)', rgb: hexToRgb('#bfdbfe') },
  { name: '#16382c (dark badge-success-bg)', rgb: hexToRgb('#16382c') },
  { name: '#86efac (dark badge-success-text)', rgb: hexToRgb('#86efac') },
  { name: '#3b2d13 (dark warning-bg)', rgb: hexToRgb('#3b2d13') },
  { name: '#fef08a (dark warning-text)', rgb: hexToRgb('#fef08a') },
  { name: '#ffffff (light surface-1)', rgb: hexToRgb('#ffffff') },
  { name: '#e2e8f0 (light surface-3)', rgb: hexToRgb('#e2e8f0') },
  { name: '#143694 (light primary)', rgb: hexToRgb('#143694') },
  { name: '#0c2363 (light primary-dark)', rgb: hexToRgb('#0c2363') },
  { name: '#783300 (light accent)', rgb: hexToRgb('#783300') },
  { name: '#522300 (light accent-dark)', rgb: hexToRgb('#522300') },
  { name: '#035337 (light success)', rgb: hexToRgb('#035337') },
  { name: '#8c0d0d (light error)', rgb: hexToRgb('#8c0d0d') },
  { name: '#fbfcfd (light glass)', rgb: hexToRgb('#fbfcfd') },
  { name: '#dce5f5 (light badge-bg)', rgb: hexToRgb('#dce5f5') },
  { name: '#dcf2e8 (light badge-success-bg)', rgb: hexToRgb('#dcf2e8') },
  { name: '#024a30 (light badge-success-text)', rgb: hexToRgb('#024a30') },
  { name: '#faeecd (light warning-bg)', rgb: hexToRgb('#faeecd') },
  { name: '#5c2500 (light warning-text)', rgb: hexToRgb('#5c2500') },
];

console.log("Searching for pairs matching exactly 1.00, 1.03, 1.05...");
for (let i = 0; i < allColors.length; i++) {
  for (let j = 0; j < allColors.length; j++) {
    const c = getContrast(allColors[i].rgb, allColors[j].rgb);
    if (Math.abs(c - 1.00) < 0.005 && i !== j) console.log(`[1.00] ${allColors[i].name} vs ${allColors[j].name}: ${c.toFixed(4)}`);
    if (Math.abs(c - 1.03) < 0.005) console.log(`[1.03] ${allColors[i].name} vs ${allColors[j].name}: ${c.toFixed(4)}`);
    if (Math.abs(c - 1.05) < 0.005) console.log(`[1.05] ${allColors[i].name} vs ${allColors[j].name}: ${c.toFixed(4)}`);
  }
}
