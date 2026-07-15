const fs = require('fs');
const path = require('path');

const styles = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8') + '\n' +
               fs.readFileSync(path.join(__dirname, '../css/components.css'), 'utf8');

// Let's find every single CSS rule that applies to 'span' or `.mockup-dot` or `.brand-icon` or `.floating-label` or `.tree-badge` or `.role-badge` or `.footer-badge` or `.text-gradient` or `.page-info` or `.tree-tag-badge`

const selectorsToCheck = [
  'span',
  '.mockup-dot',
  '.brand-icon',
  '.floating-icon',
  '.floating-label-pill',
  '.floating-label',
  '.theme-swatch',
  '.sim-role',
  '.tree-icon',
  '.tree-text',
  '.tree-badge',
  '.tree-tag-badge',
  '.role-badge',
  '.footer-badge',
  '.footer-feature-icon',
  '.page-info',
  '.text-gradient',
  '.nav-brand',
  '.footer-brand',
  '.mockup-banner',
  '.wcag-floating-trigger',
  '.wcag-floating-panel',
  '.floating-panel-header',
  '.wcag-quick-tools',
  '.wcag-tool-btn',
  '.theme-toggle',
  '.sr-only'
];

const lines = styles.split('\n');
let currentBlock = "";
let currentSelector = "";

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.includes('{')) {
    currentSelector = line.split('{')[0].trim();
    currentBlock = line + "\n";
  } else if (line.includes('}')) {
    currentBlock += line + "\n";
    for (const sel of selectorsToCheck) {
      if (currentSelector.includes(sel)) {
        // check if block has color, background, opacity
        if (currentBlock.includes('color:') || currentBlock.includes('background') || currentBlock.includes('opacity:')) {
          console.log(`=== Rule for ${currentSelector} ===\n${currentBlock}`);
          break;
        }
      }
    }
  } else {
    currentBlock += line + "\n";
  }
}
