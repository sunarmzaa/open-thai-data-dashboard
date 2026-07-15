const fs = require('fs');
const path = require('path');

// Let's check contrast ratio of every exact element combination across light and dark theme
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
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  };
}

function blendRgb(fg, bg, alpha) {
  return {
    r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(fg.b * alpha + bg.b * (1 - alpha))
  };
}

// Let's test specific pairs we suspect:
console.log("--- Suspect 1: opacity on buttons/spans ---");
// What if a span has opacity or color almost same as bg?
// Let's check:
// 1. .mockup-dot
// 2. .theme-swatch
// 3. .audit-info span vs strong
// 4. .page-info span
// 5. floating-label
// 6. text-gradient

// Let's check all color variables vs backgrounds
const darkColors = {
  bg: hexToRgb('#080e1a'),
  bgAlt: hexToRgb('#0f172a'),
  surface1: hexToRgb('#162032'),
  surface2: hexToRgb('#1e293b'),
  surface3: hexToRgb('#334155'),
  primary: hexToRgb('#93c5fd'),
  primaryDark: hexToRgb('#60a5fa'),
  text: hexToRgb('#f8fafc'),
  text2: hexToRgb('#f8fafc'),
  text3: hexToRgb('#f1f5f9'),
  textMuted: hexToRgb('#f1f5f9'),
  border: blendRgb(hexToRgb('#94a3b8'), hexToRgb('#080e1a'), 0.18),
  borderHover: blendRgb(hexToRgb('#94a3b8'), hexToRgb('#080e1a'), 0.38),
};

const lightColors = {
  bg: hexToRgb('#f8fafc'),
  bgAlt: hexToRgb('#f1f5f9'),
  surface1: hexToRgb('#ffffff'),
  surface2: hexToRgb('#f1f5f9'),
  surface3: hexToRgb('#e2e8f0'),
  primary: hexToRgb('#143694'),
  primaryDark: hexToRgb('#0c2363'),
  text: hexToRgb('#0f172a'),
  text2: hexToRgb('#0f172a'),
  text3: hexToRgb('#1e293b'),
  textMuted: hexToRgb('#1e293b'),
  border: blendRgb(hexToRgb('#94a3b8'), hexToRgb('#ffffff'), 0.35),
  borderHover: blendRgb(hexToRgb('#64748b'), hexToRgb('#ffffff'), 0.60),
};

// Check what contrast ratios match 1.00, 1.03, 1.05
function checkTargetRatios(fg, bg, label) {
  const c = getContrast(fg, bg);
  if (Math.abs(c - 1.00) < 0.01) console.log(`[1.00] ${label}: ${c.toFixed(4)}`);
  if (Math.abs(c - 1.03) < 0.01) console.log(`[1.03] ${label}: ${c.toFixed(4)}`);
  if (Math.abs(c - 1.05) < 0.01) console.log(`[1.05] ${label}: ${c.toFixed(4)}`);
}

for (const [name, colors] of Object.entries({ dark: darkColors, light: lightColors })) {
  for (const [fgName, fg] of Object.entries(colors)) {
    for (const [bgName, bg] of Object.entries(colors)) {
      if (fgName !== bgName) {
        checkTargetRatios(fg, bg, `${name} ${fgName} on ${bgName}`);
      }
    }
  }
}
