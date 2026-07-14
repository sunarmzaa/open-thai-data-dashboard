/* ==========================================================
   Open Data ไทย — Visualization Page Logic
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderLineChart();
  renderBarChart();
  renderPieChart();
  setupDownloadButtons();

  // Redraw on resize
  window.addEventListener('resize', debounce(() => {
    renderLineChart();
    renderBarChart();
    renderPieChart();
  }, 250));
});

function renderLineChart() {
  ChartLib.drawLineChart('chart-line', {
    title: 'จำนวนผู้ป่วยไข้เลือดออกรายเดือน เปรียบเทียบปี 2567 กับ 2568',
    labels: MONTHS,
    series: [
      { name: 'ปี 2567', data: DENGUE_MONTHLY_2567 },
      { name: 'ปี 2568', data: DENGUE_MONTHLY_2568 },
    ],
  });

  // Legend (only create once)
  const legendContainer = document.getElementById('chart1-legend');
  if (legendContainer && legendContainer.children.length === 0) {
    ChartLib.createLegend('chart1-legend', [
      { label: 'ปี 2567 (เส้นทึบ)', color: ChartLib.COLORS[0] },
      { label: 'ปี 2568 (เส้นประ)', color: ChartLib.COLORS[1] },
    ]);
  }

  // Table toggle (only create once)
  const toggleContainer = document.getElementById('chart1-toggle');
  if (toggleContainer && toggleContainer.children.length === 0) {
    const tableData = MONTHS.map((m, i) => [
      m,
      formatNumber(DENGUE_MONTHLY_2567[i]),
      formatNumber(DENGUE_MONTHLY_2568[i]),
      ((DENGUE_MONTHLY_2568[i] - DENGUE_MONTHLY_2567[i]) / DENGUE_MONTHLY_2567[i] * 100).toFixed(1) + '%'
    ]);
    ChartLib.createTableToggle('chart1-toggle', tableData,
      ['เดือน', 'ปี 2567 (ราย)', 'ปี 2568 (ราย)', 'เปลี่ยนแปลง (%)'],
      'เปรียบเทียบผู้ป่วยไข้เลือดออกรายเดือน'
    );
  }
}

function renderBarChart() {
  ChartLib.drawBarChart('chart-bar', {
    title: 'จำนวนผู้ป่วยไข้เลือดออกสะสม แยกตามภูมิภาค',
    data: DENGUE_BY_REGION.map(d => ({ label: d.region, value: d.cases })),
    labels: DENGUE_BY_REGION.map(d => d.region),
  });

  const legendContainer = document.getElementById('chart2-legend');
  if (legendContainer && legendContainer.children.length === 0) {
    ChartLib.createLegend('chart2-legend',
      DENGUE_BY_REGION.map((d, i) => ({ label: d.region, color: ChartLib.COLORS[i] }))
    );
  }

  const toggleContainer = document.getElementById('chart2-toggle');
  if (toggleContainer && toggleContainer.children.length === 0) {
    const total = DENGUE_BY_REGION.reduce((s, d) => s + d.cases, 0);
    const tableData = DENGUE_BY_REGION.map(d => [
      d.region,
      formatNumber(d.cases),
      ((d.cases / total) * 100).toFixed(1) + '%'
    ]);
    ChartLib.createTableToggle('chart2-toggle', tableData,
      ['ภูมิภาค', 'จำนวนผู้ป่วย (ราย)', 'สัดส่วน (%)'],
      'ผู้ป่วยไข้เลือดออกแยกตามภูมิภาค'
    );
  }
}

function renderPieChart() {
  ChartLib.drawPieChart('chart-pie', {
    title: 'สัดส่วนผู้ป่วยไข้เลือดออกตามช่วงอายุ',
    data: DENGUE_BY_AGE.map(d => ({ label: d.range, value: d.cases })),
  });

  const legendContainer = document.getElementById('chart3-legend');
  if (legendContainer && legendContainer.children.length === 0) {
    ChartLib.createLegend('chart3-legend',
      DENGUE_BY_AGE.map((d, i) => ({
        label: `${d.range} — ${formatNumber(d.cases)} ราย (${d.percent}%)`,
        color: ChartLib.COLORS[i]
      }))
    );
  }

  const toggleContainer = document.getElementById('chart3-toggle');
  if (toggleContainer && toggleContainer.children.length === 0) {
    const tableData = DENGUE_BY_AGE.map(d => [
      d.range,
      formatNumber(d.cases),
      d.percent + '%'
    ]);
    ChartLib.createTableToggle('chart3-toggle', tableData,
      ['ช่วงอายุ', 'จำนวนผู้ป่วย (ราย)', 'สัดส่วน (%)'],
      'ผู้ป่วยไข้เลือดออกตามช่วงอายุ'
    );
  }
}

function setupDownloadButtons() {
  // Chart 1
  document.getElementById('dl-chart1-img').addEventListener('click', () => {
    downloadCanvasAsPNG('chart-line', 'dengue-monthly-comparison.png');
    showToast('กำลังดาวน์โหลดกราฟ...');
  });
  document.getElementById('dl-chart1-csv').addEventListener('click', () => {
    const headers = ['เดือน', 'ปี 2567', 'ปี 2568'];
    const data = MONTHS.map((m, i) => [m, DENGUE_MONTHLY_2567[i], DENGUE_MONTHLY_2568[i]]);
    downloadCSV(data, headers, 'dengue-monthly-comparison.csv');
    showToast('กำลังดาวน์โหลดข้อมูล CSV...');
  });

  // Chart 2
  document.getElementById('dl-chart2-img').addEventListener('click', () => {
    downloadCanvasAsPNG('chart-bar', 'dengue-by-region.png');
    showToast('กำลังดาวน์โหลดกราฟ...');
  });
  document.getElementById('dl-chart2-csv').addEventListener('click', () => {
    const headers = ['ภูมิภาค', 'จำนวนผู้ป่วย'];
    const data = DENGUE_BY_REGION.map(d => [d.region, d.cases]);
    downloadCSV(data, headers, 'dengue-by-region.csv');
    showToast('กำลังดาวน์โหลดข้อมูล CSV...');
  });

  // Chart 3
  document.getElementById('dl-chart3-img').addEventListener('click', () => {
    downloadCanvasAsPNG('chart-pie', 'dengue-by-age.png');
    showToast('กำลังดาวน์โหลดกราฟ...');
  });
  document.getElementById('dl-chart3-csv').addEventListener('click', () => {
    const headers = ['ช่วงอายุ', 'จำนวนผู้ป่วย', 'สัดส่วน (%)'];
    const data = DENGUE_BY_AGE.map(d => [d.range, d.cases, d.percent]);
    downloadCSV(data, headers, 'dengue-by-age.csv');
    showToast('กำลังดาวน์โหลดข้อมูล CSV...');
  });
}
