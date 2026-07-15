const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, '../css/styles.css');
const componentsPath = path.join(__dirname, '../css/components.css');

const styles = fs.readFileSync(stylesPath, 'utf8') + '\n' + fs.readFileSync(componentsPath, 'utf8');

// Define root variables for both dark and light themes from styles.css
const themes = {
  dark: {
    '--color-bg': '#080e1a',
    '--color-bg-alt': '#0f172a',
    '--color-surface-1': '#162032',
    '--color-surface-2': '#1e293b',
    '--color-surface-3': '#334155',
    '--color-primary': '#93c5fd',
    '--color-primary-dark': '#60a5fa',
    '--color-accent': '#fde047',
    '--color-accent-dark': '#fbbf24',
    '--color-success': '#6ee7b7',
    '--color-warning': '#fde047',
    '--color-error': '#fca5a5',
    '--color-info': '#93c5fd',
    '--color-text': '#f8fafc',
    '--color-text-2': '#f8fafc',
    '--color-text-3': '#f1f5f9',
    '--color-text-muted': '#f1f5f9',
    '--color-glass': '#131d2f',
    '--color-badge-bg': '#21334c',
    '--color-badge-text': '#bfdbfe',
    '--color-badge-success-bg': '#16382c',
    '--color-badge-success-text': '#86efac',
    '--color-warning-bg': '#3b2d13',
    '--color-warning-text': '#fef08a',
    '--chart-point-stroke': '#080e1a',
  },
  light: {
    '--color-bg': '#f8fafc',
    '--color-bg-alt': '#f1f5f9',
    '--color-surface-1': '#ffffff',
    '--color-surface-2': '#f1f5f9',
    '--color-surface-3': '#e2e8f0',
    '--color-primary': '#143694',
    '--color-primary-dark': '#0c2363',
    '--color-accent': '#783300',
    '--color-accent-dark': '#522300',
    '--color-success': '#035337',
    '--color-warning': '#783300',
    '--color-error': '#8c0d0d',
    '--color-info': '#143694',
    '--color-text': '#0f172a',
    '--color-text-2': '#0f172a',
    '--color-text-3': '#1e293b',
    '--color-text-muted': '#1e293b',
    '--color-glass': '#fbfcfd',
    '--color-badge-bg': '#dce5f5',
    '--color-badge-text': '#0c2363',
    '--color-badge-success-bg': '#dcf2e8',
    '--color-badge-success-text': '#024a30',
    '--color-warning-bg': '#faeecd',
    '--color-warning-text': '#5c2500',
    '--chart-point-stroke': '#ffffff',
  }
};

function resolveColor(val, themeVars) {
  if (!val) return null;
  val = val.trim();
  if (val.startsWith('var(')) {
    const varNameMatch = val.match(/var\((--[^,)]+)\)/);
    if (varNameMatch && themeVars[varNameMatch[1]]) {
      return themeVars[varNameMatch[1]];
    }
  }
  return val;
}

function parseRgb(str, themeVars) {
  if (!str) return null;
  str = resolveColor(str, themeVars) || str;
  if (str.startsWith('#')) {
    let hex = str.slice(1);
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1
      };
    }
  }
  const rgbaMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10),
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1
    };
  }
  return null;
}

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

function blend(fg, bg) {
  if (!fg || !bg) return fg || bg;
  const a = fg.a;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    a: 1
  };
}

// Let's check block by block
const blocks = styles.split('}');
for (const block of blocks) {
  const parts = block.split('{');
  if (parts.length < 2) continue;
  const selector = parts[0].trim();
  const body = parts[1];
  const colorMatch = body.match(/[^a-z-]color:\s*([^;]+);/);
  const bgMatch = body.match(/background(?:-color)?:\s*([^;]+);/);
  const opacityMatch = body.match(/opacity:\s*([0-9.]+);/);
  
  for (const [themeName, vars] of Object.entries(themes)) {
    let c = colorMatch ? parseRgb(colorMatch[1].trim(), vars) : null;
    let b = bgMatch ? parseRgb(bgMatch[1].trim(), vars) : null;
    let op = opacityMatch ? parseFloat(opacityMatch[1]) : 1;
    if (c && b) {
      if (op < 1) c = blend({ ...c, a: op }, b);
      const ratio = getContrast(c, b);
      if (ratio && ratio < 3.0) {
        console.log(`[${themeName}] ${selector} -> Contrast ratio: ${ratio.toFixed(2)}:1 (color: ${colorMatch[1].trim()}, bg: ${bgMatch[1].trim()})`);
      }
    }
  }
}
