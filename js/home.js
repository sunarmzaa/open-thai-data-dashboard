/* ==========================================================
   Open Data ไทย — Home Page Logic
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderHomeAll();
  window.addEventListener('languagechange', renderHomeAll);
});

function renderHomeAll() {
  renderStats();
  renderUsageChart();
  renderCategories();
  renderLatestDatasets();
  setupSearch();
}

function renderStats() {
  const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
  const grid = document.getElementById('stats-grid');
  if (!grid) return;
  const items = [
    { icon: '📦', value: STATS.totalDatasets, label: isEn ? 'Total Datasets' : 'ชุดข้อมูลทั้งหมด' },
    { icon: '🏛️', value: STATS.totalOrganizations, label: isEn ? 'Participating Organizations' : 'หน่วยงานที่ร่วมเปิดข้อมูล' },
    { icon: '📥', value: STATS.monthlyDownloads, label: isEn ? 'Monthly Downloads' : 'ยอดดาวน์โหลดเดือนนี้' },
    { icon: '🔄', value: STATS.weeklyUpdates, label: isEn ? 'Updated This Week' : 'ชุดข้อมูลอัปเดตสัปดาห์นี้' },
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
  if (!el) return;
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
  const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
  const labels = USAGE_TREND.map(d => (isEn && d.monthEn) ? d.monthEn : d.month);
  const data = USAGE_TREND.map(d => d.value);

  ChartLib.drawLineChart('usage-chart', {
    title: isEn ? '12-Month Platform Usage Trend' : 'แนวโน้มการเข้าใช้งานย้อนหลัง 12 เดือน',
    labels,
    series: [{ name: isEn ? 'Usage Visits' : 'การเข้าใช้งาน', data }],
  });

  ChartLib.createLegend('trend-legend', [
    { label: isEn ? 'Number of Visits (Times)' : 'จำนวนการเข้าใช้งาน (ครั้ง)', color: ChartLib.COLORS[0] },
  ]);

  // Summary
  const first = USAGE_TREND[0].value;
  const last = USAGE_TREND[USAGE_TREND.length - 1].value;
  const growth = (((last - first) / first) * 100).toFixed(1);
  const firstMonth = (isEn && USAGE_TREND[0].monthEn) ? USAGE_TREND[0].monthEn : USAGE_TREND[0].month;
  const lastMonth = (isEn && USAGE_TREND[USAGE_TREND.length - 1].monthEn) ? USAGE_TREND[USAGE_TREND.length - 1].monthEn : USAGE_TREND[USAGE_TREND.length - 1].month;
  const summaryEl = document.getElementById('trend-summary');
  if (summaryEl) {
    summaryEl.innerHTML = isEn ? `
      <strong>Summary:</strong> Platform usage has grown steadily from ${firstMonth} (${formatNumber(first)} visits) to ${lastMonth} (${formatNumber(last)} visits), totaling ${growth}% growth, peaking in ${lastMonth}.
    ` : `
      <strong>สรุป:</strong> การเข้าใช้งานแพลตฟอร์มมีแนวโน้มเพิ่มขึ้นอย่างต่อเนื่อง จากเดือน ${firstMonth} (${formatNumber(first)} ครั้ง) ถึง ${lastMonth} (${formatNumber(last)} ครั้ง) เติบโตรวม ${growth}% โดยมีจุดสูงสุดในเดือน ${lastMonth}
    `;
  }

  // Table toggle
  const tableData = USAGE_TREND.map(d => [(isEn && d.monthEn) ? d.monthEn : d.month, formatNumber(d.value)]);
  ChartLib.createTableToggle('trend-table-toggle', tableData,
    isEn ? ['Month', 'Visits (Times)'] : ['เดือน', 'จำนวนการเข้าใช้งาน (ครั้ง)'],
    isEn ? 'Platform Usage Trend Table' : 'แนวโน้มการเข้าใช้งาน'
  );

  // Redraw on resize
  if (!window._homeResizeBound) {
    window.addEventListener('resize', debounce(() => {
      const isEnNow = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      const labelsNow = USAGE_TREND.map(d => (isEnNow && d.monthEn) ? d.monthEn : d.month);
      ChartLib.drawLineChart('usage-chart', {
        title: isEnNow ? '12-Month Platform Usage Trend' : 'แนวโน้มการเข้าใช้งานย้อนหลัง 12 เดือน',
        labels: labelsNow,
        series: [{ name: isEnNow ? 'Usage Visits' : 'การเข้าใช้งาน', data }],
      });
    }, 250));
    window._homeResizeBound = true;
  }
}

function renderCategories() {
  const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map((cat, i) => {
    const name = (isEn && cat.nameEn) ? cat.nameEn : cat.name;
    const countStr = isEn ? `${formatNumber(cat.count)} datasets` : `${formatNumber(cat.count)} ชุดข้อมูล`;
    return `
      <a href="explore.html?category=${encodeURIComponent(cat.name)}" 
         class="category-card animate-fade-in-up stagger-${i + 1}"
         aria-label="${name} ${countStr}">
        <div class="cat-icon" style="background: var(--color-surface-2); border: 1px solid var(--color-border);" aria-hidden="true">
          ${cat.icon}
        </div>
        <div class="cat-info">
          <div class="cat-name">${name}</div>
          <div class="cat-count">${countStr}</div>
        </div>
      </a>
    `;
  }).join('');
}

function renderLatestDatasets() {
  const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
  const list = document.getElementById('latest-list');
  if (!list) return;
  list.innerHTML = LATEST_DATASETS.map((ds, i) => {
    const title = (isEn && ds.titleEn) ? ds.titleEn : ds.title;
    const org = (isEn && ds.orgEn) ? ds.orgEn : ds.org;
    const date = (isEn && ds.dateEn) ? ds.dateEn : ds.date;
    const category = (isEn && ds.categoryEn) ? ds.categoryEn : ds.category;
    return `
      <div class="dataset-item" role="listitem">
        <div class="ds-number" aria-hidden="true">${i + 1}</div>
        <div class="ds-info">
          <div class="ds-title">${title}</div>
          <div class="ds-meta">
            <span>${org}</span> · <span>${date}</span> · 
            <span class="badge badge-csv">${category}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupSearch() {
  const input = document.getElementById('search-home');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  if (!input._searchBound) {
    input.addEventListener('input', debounce((e) => {
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      const q = e.target.value.trim().toLowerCase();
      if (q.length > 0) {
        const matches = ALL_DATASETS.filter(d => {
          const title = (isEn && d.titleEn) ? d.titleEn : d.title;
          const desc = (isEn && d.descEn) ? d.descEn : d.description;
          return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
        });
        results.textContent = isEn ? `Found ${matches.length} datasets matching "${e.target.value.trim()}"` : `พบ ${matches.length} ชุดข้อมูลที่ตรงกับ "${e.target.value.trim()}"`;
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
    input._searchBound = true;
  }
}
