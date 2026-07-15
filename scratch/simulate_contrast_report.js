const fs = require('fs');
const path = require('path');

// Let's inspect index.html and all injected JS DOM nodes to find the exact 4 span elements
// that have contrast 1.00 (small), 1.03 (large), 1.05 (small), 1.05 (large).

const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const wcagSuiteContent = fs.readFileSync(path.join(__dirname, '../js/wcag-suite.js'), 'utf8');
const mainContent = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8') + '\n' +
               fs.readFileSync(path.join(__dirname, '../css/components.css'), 'utf8');

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

function blendRgb(fg, bg, alpha) {
  return {
    r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(fg.b * alpha + bg.b * (1 - alpha))
  };
}

// Let's list every span on index.html (and shared across all 5 pages):
// We will check what text color and what background color applies to each span.

const spans = [
  { desc: "mockup-dot", selector: ".mockup-dot", text: "", isLarge: false, parentBg: "surface-2", bg: "primary", color: "text-2" },
  { desc: "banner mockup lang=en", selector: ".mockup-banner span[lang=en]", text: "Mockup", isLarge: false, parentBg: "surface-2", color: "text-2" },
  { desc: "nav brand-icon", selector: ".nav-brand .brand-icon", text: "📊", isLarge: true, parentBg: "glass", bg: "gradient-primary-accent", color: "chart-point-stroke" },
  { desc: "nav brand text", selector: ".nav-brand span[data-i18n='nav.brand']", text: "Open Data ไทย", isLarge: true, parentBg: "glass", color: "text" },
  { desc: "nav brand inner lang=en", selector: ".nav-brand span[lang=en]", text: "Open Data", isLarge: true, parentBg: "glass", color: "text" },
  { desc: "hero search-icon", selector: ".search-icon", text: "🔍", isLarge: false, parentBg: "surface-1", color: "text-3" },
  { desc: "hero title inner lang=en", selector: "h1#hero-title span[lang=en]", text: "Open Data", isLarge: true, parentBg: "bg", color: "primary-dark (light) / primary (dark)" },
  { desc: "footer brand-icon", selector: ".footer-brand .brand-icon", text: "📊", isLarge: true, parentBg: "surface-1 (or bg)", bg: "gradient", color: "chart-point-stroke" },
  { desc: "footer brand inner lang=en", selector: ".footer-brand span[lang=en]", text: "Open Data", isLarge: true, parentBg: "surface-1 (or bg)", color: "text" },
  { desc: "footer heading quick icon", selector: "#footer-menu-title span[aria-hidden=true]", text: "⚡", isLarge: true, parentBg: "bg", color: "text" },
  { desc: "footer heading quick text", selector: "#footer-menu-title span[data-i18n]", text: "เมนูด่วน", isLarge: true, parentBg: "bg", color: "text" },
  { desc: "footer heading a11y icon", selector: "#footer-a11y-title span[aria-hidden=true]", text: "♿", isLarge: true, parentBg: "bg", color: "text" },
  { desc: "footer heading a11y text", selector: "#footer-a11y-title span[data-i18n]", text: "การเข้าถึง (WCAG)", isLarge: true, parentBg: "bg", color: "text" },
  { desc: "footer heading status icon", selector: "#footer-status-title span[aria-hidden=true]", text: "🛡️", isLarge: true, parentBg: "bg", color: "text" },
  { desc: "footer heading status text", selector: "#footer-status-title span[data-i18n]", text: "มาตรฐานระบบ", isLarge: true, parentBg: "bg", color: "text" },
  { desc: "footer feature icon kb", selector: ".footer-feature-icon", text: "⌨️", isLarge: false, parentBg: "bg", color: "primary" },
  { desc: "footer kb inner lang=en", selector: "span[data-i18n='footer.a11y.kb'] span[lang=en]", text: "Full Keyboard Nav", isLarge: false, parentBg: "bg", color: "text-2" },
  { desc: "footer feature icon sr", selector: ".footer-feature-icon", text: "🗣️", isLarge: false, parentBg: "bg", color: "primary" },
  { desc: "footer sr inner lang=en", selector: "span[data-i18n='footer.a11y.sr'] span[lang=en]", text: "Screen Reader Friendly", isLarge: false, parentBg: "bg", color: "text-2" },
  { desc: "footer feature icon mode", selector: ".footer-feature-icon", text: "🌓", isLarge: false, parentBg: "bg", color: "primary" },
  { desc: "footer mode inner lang=en", selector: "span[data-i18n='footer.a11y.mode'] span[lang=en]", text: "Light & Dark Modes", isLarge: false, parentBg: "bg", color: "text-2" },
  { desc: "footer std label", selector: "span[data-i18n='footer.std.label']", text: "มาตรฐาน:", isLarge: false, parentBg: "bg", color: "text-2" },
  { desc: "footer std val inner lang=en", selector: ".footer-status-row strong span[lang=en]", text: "WCAG 2.2 AA / AAA", isLarge: false, parentBg: "bg", color: "text" },
  { desc: "footer env label", selector: "span[data-i18n='footer.env.label']", text: "สภาพแวดล้อม:", isLarge: false, parentBg: "bg", color: "text-2" },
  { desc: "footer env badge", selector: "span.footer-badge.success", text: "🟢 Mockup Ready", isLarge: false, parentBg: "bg", bg: "badge-success-bg", color: "badge-success-text" },
  { desc: "footer env badge inner lang=en", selector: "span.footer-badge.success span[lang=en]", text: "Mockup Ready", isLarge: false, parentBg: "badge-success-bg", color: "badge-success-text" },
  { desc: "footer ver label", selector: "span[data-i18n='footer.ver.label']", text: "เวอร์ชันระบบ:", isLarge: false, parentBg: "bg", color: "text-2" },
  { desc: "footer ver val inner lang=en", selector: ".footer-status-row strong span[lang=en]", text: "v1.0.0", isLarge: false, parentBg: "bg", color: "text" },
  { desc: "footer copy inner lang=en", selector: "div[data-i18n='footer.copy'] span[lang=en]", text: "Open Data", isLarge: false, parentBg: "bg", color: "text-3" },
  { desc: "footer disclaimer", selector: "span[data-i18n='footer.disclaimer']", text: "ข้อมูลจำลอง...", isLarge: false, parentBg: "bg", color: "text-3" },
  { desc: "footer disclaimer inner lang=en", selector: "span[data-i18n='footer.disclaimer'] span[lang=en]", text: "Mockup Data", isLarge: false, parentBg: "bg", color: "text-3" },
  // JS injected:
  { desc: "quick-contrast icon", selector: "#quick-contrast-btn span", text: "💡", isLarge: false, parentBg: "surface-1", color: "text-2" },
  { desc: "quick-cursor icon", selector: "#quick-cursor-btn span", text: "👆", isLarge: false, parentBg: "surface-1", color: "text-2" },
  { desc: "quick-mask icon", selector: "#quick-mask-btn span", text: "📏", isLarge: false, parentBg: "surface-1", color: "text-2" },
  { desc: "theme-toggle icon", selector: "#theme-toggle span", text: "☀️", isLarge: false, parentBg: "surface-1", color: "text" },
  { desc: "floating trigger icon", selector: "#wcag-floating-trigger .floating-icon", text: "♿", isLarge: true, parentBg: "gradient", color: "chart-point-stroke" },
  { desc: "floating trigger pill", selector: "#wcag-floating-trigger .floating-label-pill", text: "เครื่องมือเข้าถึง", isLarge: false, parentBg: "gradient", color: "chart-point-stroke" },
  { desc: "floating panel header icon", selector: "#wcag-floating-panel .floating-panel-header span", text: "♿", isLarge: true, parentBg: "surface-1", color: "text" },
  { desc: "floating label typography", selector: "#wcag-floating-panel .floating-label", text: "🔤 ขนาดตัวอักษร:", isLarge: false, parentBg: "surface-1", color: "text-2" },
  { desc: "wcag drawer h2 icon", selector: "#wcag-drawer h2 span", text: "♿", isLarge: true, parentBg: "surface-1", color: "text" },
  { desc: "theme-swatch light", selector: ".theme-swatch.light-swatch", text: "", isLarge: false, parentBg: "surface-1", bg: "#ffffff/#f1f5f9", color: "text-2" },
  { desc: "theme-swatch dark", selector: ".theme-swatch.dark-swatch", text: "", isLarge: false, parentBg: "surface-1", bg: "#0f172a/#1e293b", color: "text-2" },
  { desc: "theme-swatch hc-yellow", selector: ".theme-swatch.hc-yellow-swatch", text: "", isLarge: false, parentBg: "surface-1", bg: "#000000/#ffff00", color: "text-2" },
  { desc: "theme-swatch hc-white", selector: ".theme-swatch.hc-white-swatch", text: "", isLarge: false, parentBg: "surface-1", bg: "#ffffff/#000000", color: "text-2" },
  { desc: "theme-swatch mono", selector: ".theme-swatch.mono-swatch", text: "", isLarge: false, parentBg: "surface-1", bg: "#475569/#e2e8f0", color: "text-2" },
  { desc: "sim-role badge", selector: "#sim-role-badge", text: "H1", isLarge: false, parentBg: "surface-1", color: "primary" },
];

console.log(`Total checked spans: ${spans.length}`);
