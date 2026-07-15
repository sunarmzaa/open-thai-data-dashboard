const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const exploreHtml = fs.readFileSync(path.join(__dirname, '../explore.html'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8') + '\n' +
               fs.readFileSync(path.join(__dirname, '../css/components.css'), 'utf8');

// Let's count divs and spans in index.html vs explore.html
const indexDivs = (indexHtml.match(/<div/g) || []).length;
const indexSpans = (indexHtml.match(/<span/g) || []).length;
console.log(`index.html: ${indexDivs} divs, ${indexSpans} spans`);

const exploreDivs = (exploreHtml.match(/<div/g) || []).length;
const exploreSpans = (exploreHtml.match(/<span/g) || []).length;
console.log(`explore.html: ${exploreDivs} divs, ${exploreSpans} spans`);

// Where on explore.html (and visualization, data-table, compare) is:
// 1 span with Contrast 1 (small)
// 1 span with Contrast 1.03 (large)?

// Let's check what spans exist on explore.html right now:
const spanRegex = /<span[^>]*>(.*?)<\/span>/gs;
let match;
console.log("\n--- Spans in explore.html ---");
while ((match = spanRegex.exec(exploreHtml)) !== null) {
  console.log(match[0].slice(0, 100));
}

console.log("\n--- Spans unique to index.html or divs in index.html ---");
// Let's check stat-cards, category-card, latest-card in index.html
