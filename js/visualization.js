/* ==========================================================
   Open Data ไทย — Visualization Page Logic
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderAllCharts();
  setupDownloadButtons();

  window.addEventListener('languagechange', renderAllCharts);

  // Redraw on resize
  window.addEventListener('resize', debounce(() => {
    renderAllCharts();
  }, 250));
});

function renderAllCharts() {
  renderLineChart();
  renderBarChart();
  renderPieChart();
}

function renderLineChart() {
  const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
  const labels = isEn ? MONTHS_EN : MONTHS;

  ChartLib.drawLineChart('chart-line', {
    title: isEn ? 'Monthly Dengue Fever Cases (2024 vs 2025)' : 'จำนวนผู้ป่วยไข้เลือดออกรายเดือน เปรียบเทียบปี 2567 กับ 2568',
    labels,
    series: [
      { name: isEn ? 'Year 2024' : 'ปี 2567', data: DENGUE_MONTHLY_2567 },
      { name: isEn ? 'Year 2025' : 'ปี 2568', data: DENGUE_MONTHLY_2568 },
    ],
  });

  const legendContainer = document.getElementById('chart1-legend');
  if (legendContainer) {
    legendContainer.innerHTML = '';
    ChartLib.createLegend('chart1-legend', [
      { label: isEn ? '2024 (Solid line)' : 'ปี 2567 (เส้นทึบ)', color: ChartLib.COLORS[0] },
      { label: isEn ? '2025 (Dashed line)' : 'ปี 2568 (เส้นประ)', color: ChartLib.COLORS[1] },
    ]);
  }

  const toggleContainer = document.getElementById('chart1-toggle');
  if (toggleContainer) {
    toggleContainer.innerHTML = '';
    const tableData = labels.map((m, i) => [
      m,
      formatNumber(DENGUE_MONTHLY_2567[i]),
      formatNumber(DENGUE_MONTHLY_2568[i]),
      ((DENGUE_MONTHLY_2568[i] - DENGUE_MONTHLY_2567[i]) / DENGUE_MONTHLY_2567[i] * 100).toFixed(1) + '%'
    ]);
    ChartLib.createTableToggle('chart1-toggle', tableData,
      isEn ? ['Month', '2024 (Cases)', '2025 (Cases)', 'Change (%)'] : ['เดือน', 'ปี 2567 (ราย)', 'ปี 2568 (ราย)', 'เปลี่ยนแปลง (%)'],
      isEn ? 'Monthly Dengue Comparison Table' : 'เปรียบเทียบผู้ป่วยไข้เลือดออกรายเดือน'
    );
  }
}

function renderBarChart() {
  const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
  const labels = DENGUE_BY_REGION.map(d => isEn ? d.regionEn : d.region);

  ChartLib.drawBarChart('chart-bar', {
    title: isEn ? 'Cumulative Dengue Cases by Region' : 'จำนวนผู้ป่วยไข้เลือดออกสะสม แยกตามภูมิภาค',
    data: DENGUE_BY_REGION.map((d, i) => ({ label: labels[i], value: d.cases })),
    labels,
  });

  const legendContainer = document.getElementById('chart2-legend');
  if (legendContainer) {
    legendContainer.innerHTML = '';
    ChartLib.createLegend('chart2-legend',
      DENGUE_BY_REGION.map((d, i) => ({ label: labels[i], color: ChartLib.COLORS[i] }))
    );
  }

  const toggleContainer = document.getElementById('chart2-toggle');
  if (toggleContainer) {
    toggleContainer.innerHTML = '';
    const total = DENGUE_BY_REGION.reduce((s, d) => s + d.cases, 0);
    const tableData = DENGUE_BY_REGION.map((d, i) => [
      labels[i],
      formatNumber(d.cases),
      ((d.cases / total) * 100).toFixed(1) + '%'
    ]);
    ChartLib.createTableToggle('chart2-toggle', tableData,
      isEn ? ['Region', 'Cases', 'Proportion (%)'] : ['ภูมิภาค', 'จำนวนผู้ป่วย (ราย)', 'สัดส่วน (%)'],
      isEn ? 'Dengue Cases by Region Table' : 'ผู้ป่วยไข้เลือดออกแยกตามภูมิภาค'
    );
  }
}

function renderPieChart() {
  const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
  const labels = DENGUE_BY_AGE.map(d => isEn ? d.rangeEn : d.range);

  ChartLib.drawPieChart('chart-pie', {
    title: isEn ? 'Proportion of Dengue Cases by Age Group' : 'สัดส่วนผู้ป่วยไข้เลือดออกตามช่วงอายุ',
    data: DENGUE_BY_AGE.map((d, i) => ({ label: labels[i], value: d.cases })),
  });

  const legendContainer = document.getElementById('chart3-legend');
  if (legendContainer) {
    legendContainer.innerHTML = '';
    ChartLib.createLegend('chart3-legend',
      DENGUE_BY_AGE.map((d, i) => ({
        label: `${labels[i]} — ${formatNumber(d.cases)} ${isEn ? 'cases' : 'ราย'} (${d.percent}%)`,
        color: ChartLib.COLORS[i]
      }))
    );
  }

  const toggleContainer = document.getElementById('chart3-toggle');
  if (toggleContainer) {
    toggleContainer.innerHTML = '';
    const tableData = DENGUE_BY_AGE.map((d, i) => [
      labels[i],
      formatNumber(d.cases),
      d.percent + '%'
    ]);
    ChartLib.createTableToggle('chart3-toggle', tableData,
      isEn ? ['Age Group', 'Cases', 'Proportion (%)'] : ['ช่วงอายุ', 'จำนวนผู้ป่วย (ราย)', 'สัดส่วน (%)'],
      isEn ? 'Dengue Cases by Age Group Table' : 'ผู้ป่วยไข้เลือดออกตามช่วงอายุ'
    );
  }
}

function setupDownloadButtons() {
  const isEn = () => typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';

  // Chart 1
  const dlC1Img = document.getElementById('dl-chart1-img');
  if (dlC1Img) {
    dlC1Img.addEventListener('click', () => {
      downloadCanvasAsPNG('chart-line', 'dengue-monthly-comparison.png');
      showToast(isEn() ? 'Downloading chart image...' : 'กำลังดาวน์โหลดกราฟ...');
    });
  }
  const dlC1Csv = document.getElementById('dl-chart1-csv');
  if (dlC1Csv) {
    dlC1Csv.addEventListener('click', () => {
      const headers = isEn() ? ['Month', '2024', '2025'] : ['เดือน', 'ปี 2567', 'ปี 2568'];
      const months = isEn() ? MONTHS_EN : MONTHS;
      const data = months.map((m, i) => [m, DENGUE_MONTHLY_2567[i], DENGUE_MONTHLY_2568[i]]);
      downloadCSV(data, headers, 'dengue-monthly-comparison.csv');
      showToast(isEn() ? 'Downloading CSV data...' : 'กำลังดาวน์โหลดข้อมูล CSV...');
    });
  }

  // Chart 2
  const dlC2Img = document.getElementById('dl-chart2-img');
  if (dlC2Img) {
    dlC2Img.addEventListener('click', () => {
      downloadCanvasAsPNG('chart-bar', 'dengue-by-region.png');
      showToast(isEn() ? 'Downloading chart image...' : 'กำลังดาวน์โหลดกราฟ...');
    });
  }
  const dlC2Csv = document.getElementById('dl-chart2-csv');
  if (dlC2Csv) {
    dlC2Csv.addEventListener('click', () => {
      const headers = isEn() ? ['Region', 'Cases'] : ['ภูมิภาค', 'จำนวนผู้ป่วย'];
      const data = DENGUE_BY_REGION.map(d => [isEn() ? d.regionEn : d.region, d.cases]);
      downloadCSV(data, headers, 'dengue-by-region.csv');
      showToast(isEn() ? 'Downloading CSV data...' : 'กำลังดาวน์โหลดข้อมูล CSV...');
    });
  }

  // Chart 3
  const dlC3Img = document.getElementById('dl-chart3-img');
  if (dlC3Img) {
    dlC3Img.addEventListener('click', () => {
      downloadCanvasAsPNG('chart-pie', 'dengue-by-age.png');
      showToast(isEn() ? 'Downloading chart image...' : 'กำลังดาวน์โหลดกราฟ...');
    });
  }
  const dlC3Csv = document.getElementById('dl-chart3-csv');
  if (dlC3Csv) {
    dlC3Csv.addEventListener('click', () => {
      const headers = isEn() ? ['Age Group', 'Cases', 'Proportion (%)'] : ['ช่วงอายุ', 'จำนวนผู้ป่วย', 'สัดส่วน (%)'];
      const data = DENGUE_BY_AGE.map(d => [isEn() ? d.rangeEn : d.range, d.cases, d.percent]);
      downloadCSV(data, headers, 'dengue-by-age.csv');
      showToast(isEn() ? 'Downloading CSV data...' : 'กำลังดาวน์โหลดข้อมูล CSV...');
    });
  }
}
