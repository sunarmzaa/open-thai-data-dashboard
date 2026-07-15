/* ==========================================================
   Open Data ไทย — Accessible Canvas Chart Library
   Supports: Line, Bar, Pie charts
   WCAG features: patterns, tooltips, aria-live, table toggle
   Automatic Theme & Resize Adaptation
   ========================================================== */

const ChartLib = (() => {
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#14b8a6', '#ec4899'];
  const registry = new Map();

  // Listen for theme change and window resize to automatically redraw all charts
  if (typeof window !== 'undefined') {
    window.addEventListener('themechange', () => redrawAll());
    window.addEventListener('resize', debounce(() => redrawAll(), 150));
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function getThemeStyles() {
    const root = getComputedStyle(document.documentElement);
    const gridColor = root.getPropertyValue('--chart-grid').trim() || 'rgba(148, 163, 184, 0.15)';
    const textColor = root.getPropertyValue('--chart-text').trim() || '#94a3b8';
    const pointStroke = root.getPropertyValue('--chart-point-stroke').trim() || '#0b1120';
    const mainText = root.getPropertyValue('--color-text').trim() || '#f1f5f9';
    return { gridColor, textColor, pointStroke, mainText };
  }

  // --- Patterns for color-blind accessibility ---
  const PATTERNS = [
    (ctx, color) => { /* solid */ ctx.fillStyle = color; },
    (ctx, color) => { /* diagonal lines */ createLinePattern(ctx, color, 'diagonal'); },
    (ctx, color) => { /* dots */ createDotPattern(ctx, color); },
    (ctx, color) => { /* cross-hatch */ createLinePattern(ctx, color, 'crosshatch'); },
    (ctx, color) => { /* horizontal lines */ createLinePattern(ctx, color, 'horizontal'); },
    (ctx, color) => { /* vertical lines */ createLinePattern(ctx, color, 'vertical'); },
  ];

  function createLinePattern(ctx, color, type) {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 10;
    pCanvas.height = 10;
    const pCtx = pCanvas.getContext('2d');
    pCtx.fillStyle = color;
    pCtx.globalAlpha = 0.3;
    pCtx.fillRect(0, 0, 10, 10);
    pCtx.globalAlpha = 1;
    pCtx.strokeStyle = color;
    pCtx.lineWidth = 2;
    if (type === 'diagonal') {
      pCtx.beginPath(); pCtx.moveTo(0, 10); pCtx.lineTo(10, 0); pCtx.stroke();
    } else if (type === 'crosshatch') {
      pCtx.beginPath(); pCtx.moveTo(0, 10); pCtx.lineTo(10, 0); pCtx.moveTo(0, 0); pCtx.lineTo(10, 10); pCtx.stroke();
    } else if (type === 'horizontal') {
      pCtx.beginPath(); pCtx.moveTo(0, 5); pCtx.lineTo(10, 5); pCtx.stroke();
    } else if (type === 'vertical') {
      pCtx.beginPath(); pCtx.moveTo(5, 0); pCtx.lineTo(5, 10); pCtx.stroke();
    }
    ctx.fillStyle = ctx.createPattern(pCanvas, 'repeat');
  }

  function createDotPattern(ctx, color) {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 8;
    pCanvas.height = 8;
    const pCtx = pCanvas.getContext('2d');
    pCtx.fillStyle = color;
    pCtx.globalAlpha = 0.3;
    pCtx.fillRect(0, 0, 8, 8);
    pCtx.globalAlpha = 1;
    pCtx.beginPath();
    pCtx.arc(4, 4, 2, 0, Math.PI * 2);
    pCtx.fill();
    ctx.fillStyle = ctx.createPattern(pCanvas, 'repeat');
  }

  function redrawAll() {
    registry.forEach((entry, canvasId) => {
      const canvas = document.getElementById(canvasId);
      // Only redraw if canvas still exists and is visible (or parent not hidden)
      if (canvas && canvas.offsetParent !== null) {
        if (entry.type === 'line') drawLineChart(canvasId, entry.config, false);
        else if (entry.type === 'bar') drawBarChart(canvasId, entry.config, false);
        else if (entry.type === 'pie') drawPieChart(canvasId, entry.config, false);
      }
    });
  }

  // --- LINE CHART ---
  function drawLineChart(canvasId, config, saveRegistry = true) {
    if (saveRegistry) registry.set(canvasId, { type: 'line', config });
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const { gridColor, textColor, pointStroke } = getThemeStyles();
    const w = rect.width;
    const h = rect.height;
    const pad = { top: 20, right: 24, bottom: 50, left: 65 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const { series, labels, title } = config;

    // Find max value
    let maxVal = 0;
    series.forEach(s => { s.data.forEach(v => { if (v > maxVal) maxVal = v; }); });
    maxVal = Math.ceil(maxVal / 100) * 100 || 100;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = pad.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();

      // Y labels
      const val = maxVal - (maxVal / gridLines) * i;
      ctx.fillStyle = textColor;
      ctx.font = '600 11px Inter, Noto Sans Thai, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatNumber(val), pad.left - 10, y + 4);
    }

    // X labels
    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    const stepX = labels.length > 1 ? chartW / (labels.length - 1) : chartW / 2;
    labels.forEach((label, i) => {
      const x = pad.left + stepX * i;
      ctx.fillText(label, x, h - pad.bottom + 22);
    });

    // Lines
    const pointPositions = [];
    series.forEach((s, si) => {
      const color = COLORS[si % COLORS.length];
      const points = [];

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.setLineDash(si === 0 ? [] : [6, 4]); // Dashed for second series

      ctx.beginPath();
      s.data.forEach((val, i) => {
        const x = pad.left + stepX * i;
        const y = pad.top + chartH - (val / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        points.push({ x, y, val, label: labels[i], seriesName: s.name });
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Points
      s.data.forEach((val, i) => {
        const x = pad.left + stepX * i;
        const y = pad.top + chartH - (val / maxVal) * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = pointStroke;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      pointPositions.push(...points.map(p => ({ ...p, color })));
    });

    // Tooltip handling
    setupTooltip(canvas, pointPositions, canvasId);

    // Set accessible label
    canvas.setAttribute('role', 'img');
    const altText = `กราฟเส้น: ${title}. ` + series.map(s =>
      `${s.name}: ${s.data.map((v, i) => `${labels[i]} ${formatNumber(v)}`).join(', ')}`
    ).join('. ');
    canvas.setAttribute('aria-label', altText);

    return pointPositions;
  }

  // --- BAR CHART ---
  function drawBarChart(canvasId, config, saveRegistry = true) {
    if (saveRegistry) registry.set(canvasId, { type: 'bar', config });
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const { gridColor, textColor } = getThemeStyles();
    const w = rect.width;
    const h = rect.height;
    const pad = { top: 25, right: 20, bottom: 60, left: 70 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const { data, labels, title } = config;

    const maxVal = Math.ceil(Math.max(...data.map(d => d.value)) / 1000) * 1000 || 1000;
    const barCount = data.length;
    const barWidth = Math.min(64, chartW / barCount * 0.62);
    const gap = (chartW - barWidth * barCount) / (barCount + 1);

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = pad.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      const val = maxVal - (maxVal / gridLines) * i;
      ctx.fillStyle = textColor;
      ctx.font = '600 11px Inter, Noto Sans Thai, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(formatNumber(val), pad.left - 10, y + 4);
    }

    const pointPositions = [];

    // Bars
    data.forEach((d, i) => {
      const color = COLORS[i % COLORS.length];
      const x = pad.left + gap + (barWidth + gap) * i;
      const barH = (d.value / maxVal) * chartH;
      const y = pad.top + chartH - barH;

      // Apply pattern
      ctx.save();
      PATTERNS[i % PATTERNS.length](ctx, color);
      ctx.fillRect(x, y, barWidth, barH);
      ctx.restore();

      // Border
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, barWidth, barH);

      // Label
      ctx.fillStyle = textColor;
      ctx.font = '600 11px Inter, Noto Sans Thai, sans-serif';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(x + barWidth / 2, h - pad.bottom + 18);
      if (barCount > 5) {
        ctx.rotate(-0.35);
        ctx.textAlign = 'right';
      }
      ctx.fillText(d.label || labels[i], 0, 0);
      ctx.restore();

      // Value on top
      ctx.fillStyle = textColor;
      ctx.font = '700 12px Inter, Noto Sans Thai, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(formatNumber(d.value), x + barWidth / 2, y - 8);

      pointPositions.push({
        x: x + barWidth / 2,
        y: y,
        val: d.value,
        label: d.label || labels[i],
        seriesName: title,
        color,
        isBar: true,
        barX: x,
        barW: barWidth,
        barY: y,
        barH: barH
      });
    });

    setupTooltip(canvas, pointPositions, canvasId);

    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label',
      `กราฟแท่ง: ${title}. ` + data.map(d => `${d.label}: ${formatNumber(d.value)} ราย`).join(', ')
    );

    return pointPositions;
  }

  // --- PIE CHART ---
  function drawPieChart(canvasId, config, saveRegistry = true) {
    if (saveRegistry) registry.set(canvasId, { type: 'pie', config });
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const { pointStroke, mainText, textColor } = getThemeStyles();
    const w = rect.width;
    const h = rect.height;
    const { data, title } = config;

    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 40;
    const innerRadius = radius * 0.55; // Donut

    ctx.clearRect(0, 0, w, h);

    let startAngle = -Math.PI / 2;
    const slicePositions = [];

    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;
      const color = COLORS[i % COLORS.length];

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(startAngle) * innerRadius, cy + Math.sin(startAngle) * innerRadius);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.lineTo(cx + Math.cos(endAngle) * innerRadius, cy + Math.sin(endAngle) * innerRadius);
      ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.save();
      PATTERNS[i % PATTERNS.length](ctx, color);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = pointStroke;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label with high-contrast pill badge for AAA compliance across all themes
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = cx + Math.cos(midAngle) * (radius - (radius - innerRadius) / 2);
      const labelY = cy + Math.sin(midAngle) * (radius - (radius - innerRadius) / 2);

      const pct = ((d.value / total) * 100).toFixed(1);
      const pctText = `${pct}%`;
      ctx.font = 'bold 12px Inter, Noto Sans Thai, sans-serif';
      
      if (sliceAngle > 0.25) { // Only label if big enough
        const textW = ctx.measureText(pctText).width;
        const pillW = textW + 14;
        const pillH = 22;
        const pillX = labelX - pillW / 2;
        const pillY = labelY - pillH / 2;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'; // High-contrast dark slate pill
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(pillX, pillY, pillW, pillH, 6);
        } else {
          ctx.rect(pillX, pillY, pillW, pillH);
        }
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pctText, labelX, labelY);
      }

      slicePositions.push({
        x: cx + Math.cos(midAngle) * ((radius + innerRadius) / 2),
        y: cy + Math.sin(midAngle) * ((radius + innerRadius) / 2),
        val: d.value,
        label: d.label,
        seriesName: title,
        color,
        percent: pct,
        startAngle,
        endAngle,
        isPie: true
      });

      startAngle = endAngle;
    });

    // Center text
    ctx.fillStyle = mainText;
    ctx.font = 'bold 20px Inter, Noto Sans Thai, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatNumber(total), cx, cy - 8);
    ctx.font = '600 12px Inter, Noto Sans Thai, sans-serif';
    ctx.fillStyle = textColor;
    ctx.fillText('ราย', cx, cy + 14);

    setupTooltip(canvas, slicePositions, canvasId);

    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label',
      `กราฟวงกลม: ${title}. ` + data.map(d => `${d.label}: ${formatNumber(d.value)} ราย (${((d.value / total) * 100).toFixed(1)}%)`).join(', ')
    );

    return slicePositions;
  }

  // --- Tooltip System ---
  function setupTooltip(canvas, positions, canvasId) {
    const wrapper = canvas.parentElement;
    if (!wrapper) return;
    let tooltip = wrapper.querySelector('.chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      tooltip.setAttribute('role', 'status');
      tooltip.setAttribute('aria-live', 'polite');
      wrapper.appendChild(tooltip);
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let closest = null;
      let minDist = 30;

      positions.forEach(p => {
        if (p.isBar) {
          if (mx >= p.barX && mx <= p.barX + p.barW && my >= p.barY && my <= p.barY + p.barH) {
            closest = p;
          }
        } else if (p.isPie) {
          const dx = mx - canvas.width / (2 * (window.devicePixelRatio || 1));
          const dy = my - canvas.height / (2 * (window.devicePixelRatio || 1));
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          const normAngle = angle < -Math.PI / 2 ? angle + Math.PI * 2 : angle;
          if (normAngle >= p.startAngle && normAngle < p.endAngle) {
            closest = p;
          }
        } else {
          const dist = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
          if (dist < minDist) {
            minDist = dist;
            closest = p;
          }
        }
      });

      if (closest) {
        const text = closest.isPie
          ? `${closest.label}: ${formatNumber(closest.val)} ราย (${closest.percent}%)`
          : closest.label
            ? `${closest.label}: ${formatNumber(closest.val)}`
            : formatNumber(closest.val);

        tooltip.textContent = text;
        tooltip.classList.add('visible');

        // Position
        let tx = closest.x;
        let ty = closest.isPie ? closest.y - 20 : closest.y - 10;
        tooltip.style.left = tx + 'px';
        tooltip.style.top = ty + 'px';
      } else {
        tooltip.classList.remove('visible');
      }
    });

    canvas.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  }

  // --- Table Toggle ---
  function createTableToggle(containerId, tableData, headers, chartTitle) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cleanId = containerId.replace(/-toggle$/, '');
    const btnId = `toggle-${cleanId}`;
    const tableId = `table-${cleanId}`;

    // If toggle already exists, do not recreate
    if (document.getElementById(btnId)) return;

    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = btnId;
    btn.className = 'btn btn-secondary btn-sm chart-view-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', tableId);
    btn.innerHTML = `<span aria-hidden="true">📋</span> ${isEn ? `View ${chartTitle} as Table` : `ดูข้อมูล${chartTitle}เป็นตาราง`}`;
    btn.dataset.chartTitle = chartTitle;
    btn.addEventListener('click', () => {
      const tableEl = document.getElementById(tableId);
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      tableEl.hidden = isExpanded;
      const curEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      btn.innerHTML = isExpanded 
        ? `<span aria-hidden="true">📋</span> ${curEn ? `View ${chartTitle} as Table` : `ดูข้อมูล${chartTitle}เป็นตาราง`}` 
        : `<span aria-hidden="true">📊</span> ${curEn ? `View ${chartTitle} as Chart` : `ดู${chartTitle}เป็นกราฟ`}`;

      // Toggle canvas visibility
      const canvas = container.querySelector('canvas');
      if (canvas) canvas.style.display = isExpanded ? 'block' : 'none';

      announce(isExpanded ? (curEn ? 'Switched to chart view' : 'แสดงกราฟแล้ว') : (curEn ? 'Switched to table view' : 'แสดงตารางข้อมูลแล้ว'));
    });

    container.appendChild(btn);

    // Create table
    const tableWrapper = document.createElement('div');
    tableWrapper.id = tableId;
    tableWrapper.hidden = true;
    tableWrapper.className = 'table-wrapper';
    tableWrapper.style.marginTop = 'var(--space-md)';

    const table = document.createElement('table');
    table.className = 'data-table';
    table.setAttribute('aria-label', `${isEn ? 'Data Table: ' : 'ตารางข้อมูล: '}${chartTitle}`);

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(h => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tableData.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach((cell, ci) => {
        if (ci === 0) {
          const th = document.createElement('th');
          th.scope = 'row';
          th.textContent = cell;
          tr.appendChild(th);
        } else {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        }
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);
  }

  // --- Legend Builder ---
  function createLegend(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous legend if redrawn
    const existingLegend = container.querySelector('.chart-legend');
    if (existingLegend) existingLegend.remove();

    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    legend.setAttribute('aria-label', isEn ? 'Chart Legend' : 'คำอธิบายสัญลักษณ์');

    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'chart-legend-item';
      const swatch = document.createElement('span');
      swatch.className = 'legend-color';
      swatch.style.backgroundColor = item.color || COLORS[i % COLORS.length];
      swatch.setAttribute('aria-hidden', 'true');
      el.appendChild(swatch);
      const label = document.createElement('span');
      label.textContent = item.label;
      el.appendChild(label);
      legend.appendChild(el);
    });

    container.appendChild(legend);
  }

  function updateChartTogglesI18n() {
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    document.querySelectorAll('.chart-view-toggle').forEach(btn => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const title = btn.dataset.chartTitle || '';
      btn.innerHTML = isExpanded 
        ? `<span aria-hidden="true">📊</span> ${isEn ? `View ${title} as Chart` : `ดู${title}เป็นกราฟ`}`
        : `<span aria-hidden="true">📋</span> ${isEn ? `View ${title} as Table` : `ดูข้อมูล${title}เป็นตาราง`}`;
    });
    document.querySelectorAll('.chart-legend').forEach(leg => {
      leg.setAttribute('aria-label', isEn ? 'Chart Legend' : 'คำอธิบายสัญลักษณ์');
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('languagechange', updateChartTogglesI18n);
  }

  function formatNumber(num) {
    if (typeof num !== 'number') return num;
    return new Intl.NumberFormat('th-TH').format(num);
  }

  return {
    drawLineChart,
    drawBarChart,
    drawPieChart,
    createTableToggle,
    createLegend,
    redrawAll,
    COLORS,
  };
})();
