/* ==========================================================
   Open Data ไทย — Home Page Logic
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderUsageChart();
  renderCategories();
  renderLatestDatasets();
  setupSearch();
});

function renderStats() {
  const grid = document.getElementById('stats-grid');
  const items = [
    { icon: '📦', value: STATS.totalDatasets, label: 'ชุดข้อมูลทั้งหมด' },
    { icon: '🏛️', value: STATS.totalOrganizations, label: 'หน่วยงานที่ร่วมเปิดข้อมูล' },
    { icon: '📥', value: STATS.monthlyDownloads, label: 'ยอดดาวน์โหลดเดือนนี้' },
    { icon: '🔄', value: STATS.weeklyUpdates, label: 'ชุดข้อมูลอัปเดตสัปดาห์นี้' },
  ];

  grid.innerHTML = items.map((item, i) => `
    <div class="stat-card animate-fade-in-up stagger-${i + 1}" role="group" aria-label="${item.label}">
      <div class="stat-icon" aria-hidden="true">${item.icon}</div>
      <div class="stat-value" id="stat-${i}">${formatNumber(item.value)}</div>
      <div class="stat-label">${item.label}</div>
    </div>
  `).join('');

  // Animate count up
  items.forEach((item, i) => {
    animateCount(document.getElementById(`stat-${i}`), item.value);
  });
}

function animateCount(el, target) {
  let current = 0;
  const duration = 1500;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = formatNumber(Math.floor(current));
  }, 16);
}

function renderUsageChart() {
  const labels = USAGE_TREND.map(d => d.month);
  const data = USAGE_TREND.map(d => d.value);

  ChartLib.drawLineChart('usage-chart', {
    title: 'แนวโน้มการเข้าใช้งานย้อนหลัง 12 เดือน',
    labels,
    series: [{ name: 'การเข้าใช้งาน', data }],
  });

  ChartLib.createLegend('trend-legend', [
    { label: 'จำนวนการเข้าใช้งาน (ครั้ง)', color: ChartLib.COLORS[0] },
  ]);

  // Summary
  const first = USAGE_TREND[0].value;
  const last = USAGE_TREND[USAGE_TREND.length - 1].value;
  const growth = (((last - first) / first) * 100).toFixed(1);
  document.getElementById('trend-summary').innerHTML = `
    <strong>สรุป:</strong> การเข้าใช้งานแพลตฟอร์มมีแนวโน้มเพิ่มขึ้นอย่างต่อเนื่อง 
    จากเดือน ${USAGE_TREND[0].month} (${formatNumber(first)} ครั้ง) ถึง ${USAGE_TREND[USAGE_TREND.length - 1].month} (${formatNumber(last)} ครั้ง) 
    เติบโตรวม ${growth}% โดยมีจุดสูงสุดในเดือน ${USAGE_TREND[USAGE_TREND.length - 1].month}
  `;

  // Table toggle
  const tableData = USAGE_TREND.map(d => [d.month, formatNumber(d.value)]);
  ChartLib.createTableToggle('trend-table-toggle', tableData,
    ['เดือน', 'จำนวนการเข้าใช้งาน (ครั้ง)'],
    'แนวโน้มการเข้าใช้งาน'
  );

  // Redraw on resize
  window.addEventListener('resize', debounce(() => {
    ChartLib.drawLineChart('usage-chart', {
      title: 'แนวโน้มการเข้าใช้งานย้อนหลัง 12 เดือน',
      labels,
      series: [{ name: 'การเข้าใช้งาน', data }],
    });
  }, 250));
}

function renderCategories() {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = CATEGORIES.map((cat, i) => `
    <a href="explore.html?category=${encodeURIComponent(cat.name)}" 
       class="category-card animate-fade-in-up stagger-${i + 1}"
       aria-label="${cat.name} ${formatNumber(cat.count)} ชุดข้อมูล">
      <div class="cat-icon" style="background: ${cat.color}20;" aria-hidden="true">
        ${cat.icon}
      </div>
      <div class="cat-info">
        <div class="cat-name">${cat.name}</div>
        <div class="cat-count">${formatNumber(cat.count)} ชุดข้อมูล</div>
      </div>
    </a>
  `).join('');
}

function renderLatestDatasets() {
  const list = document.getElementById('latest-list');
  list.innerHTML = LATEST_DATASETS.map((ds, i) => `
    <div class="dataset-item" role="listitem">
      <div class="ds-number" aria-hidden="true">${i + 1}</div>
      <div class="ds-info">
        <div class="ds-title">${ds.title}</div>
        <div class="ds-meta">
          <span>${ds.org}</span> · <span>${ds.date}</span> · 
          <span class="badge badge-csv">${ds.category}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function setupSearch() {
  const input = document.getElementById('search-home');
  const results = document.getElementById('search-results');

  input.addEventListener('input', debounce((e) => {
    const q = e.target.value.trim().toLowerCase();
    if (q.length > 0) {
      const matches = ALL_DATASETS.filter(d =>
        d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
      );
      results.textContent = `พบ ${matches.length} ชุดข้อมูลที่ตรงกับ "${e.target.value.trim()}"`;
    } else {
      results.textContent = '';
    }
  }, 300));

  // Enter → navigate to explore page
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) {
        window.location.href = `explore.html?q=${encodeURIComponent(q)}`;
      }
    }
  });
}
