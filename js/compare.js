/* ==========================================================
   Open Data ไทย — Compare Page Logic
   Province comparison with SVG map, combobox, table
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCompare();
});

function initCompare() {
  const state = {
    selected: [],       // province names
    indicator: 'cases', // cases | rate | trend
    year: '2568',
    maxSelect: 5,
  };

  // Load from URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('provinces')) {
    state.selected = params.get('provinces').split(',').filter(p => PROVINCES.find(pr => pr.name === p));
  }
  if (params.get('indicator')) state.indicator = params.get('indicator');
  if (params.get('year')) state.year = params.get('year');

  // --- Indicator radios ---
  const radioContainer = document.getElementById('indicator-radios');
  COMPARE_INDICATORS.forEach((ind, i) => {
    const id = `indicator-${ind.id}`;
    const label = document.createElement('label');
    label.className = 'form-radio';
    label.setAttribute('for', id);

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'indicator';
    input.id = id;
    input.value = ind.id;
    input.checked = ind.id === state.indicator;
    input.addEventListener('change', () => {
      state.indicator = ind.id;
      updateResults();
    });

    label.appendChild(input);
    label.appendChild(document.createTextNode(ind.label));
    radioContainer.appendChild(label);
  });

  // --- Year select ---
  const yearSelect = document.getElementById('year-select');
  yearSelect.value = state.year;
  yearSelect.addEventListener('change', (e) => {
    state.year = e.target.value;
    updateResults();
  });

  // --- Province combobox ---
  initCombobox(state);

  // --- Share & Print ---
  document.getElementById('btn-share').addEventListener('click', () => {
    shareURL({
      provinces: state.selected.join(','),
      indicator: state.indicator,
      year: state.year,
    });
  });

  document.getElementById('btn-print').addEventListener('click', () => printReport());

  // --- Initial render ---
  if (state.selected.length >= 2) {
    updateResults();
  }

  // --- Render SVG map ---
  renderMap();

  function getData() {
    return state.year === '2568' ? PROVINCE_DATA_2568 : PROVINCE_DATA_2567;
  }

  function updateResults() {
    const resultsArea = document.getElementById('results-area');
    const actionBtns = document.getElementById('action-buttons');

    if (state.selected.length < 2) {
      resultsArea.style.display = 'none';
      actionBtns.hidden = true;
      return;
    }

    resultsArea.style.display = '';
    actionBtns.hidden = false;

    const data = getData();

    // Update map
    updateMapColors(data, state);

    // Update comparison table
    renderCompareTable(data, state);

    announce(`แสดงผลเปรียบเทียบ ${state.selected.length} จังหวัด`);
  }

  function initCombobox(state) {
    const input = document.getElementById('province-search');
    const listbox = document.getElementById('province-listbox');
    const wrapper = input.closest('.combobox-wrapper');
    const selectedContainer = document.getElementById('selected-provinces');
    const statusEl = document.getElementById('province-status');
    let activeIndex = -1;

    function populateListbox(filter = '') {
      const available = PROVINCES.filter(p =>
        !state.selected.includes(p.name) &&
        p.name.includes(filter)
      );

      listbox.innerHTML = available.map(p => `
        <div class="combobox-option" role="option" aria-selected="false" data-value="${p.name}">
          ${p.name} <span style="color: var(--color-text-muted); font-size: var(--text-xs);">(${p.region})</span>
        </div>
      `).join('');

      activeIndex = -1;
    }

    function openListbox() {
      listbox.setAttribute('data-open', 'true');
      wrapper.setAttribute('aria-expanded', 'true');
      populateListbox(input.value.trim());
    }

    function closeListbox() {
      listbox.setAttribute('data-open', 'false');
      wrapper.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
    }

    function selectProvince(name) {
      if (state.selected.length >= state.maxSelect) {
        statusEl.textContent = `เลือกได้สูงสุด ${state.maxSelect} จังหวัด`;
        return;
      }
      if (!state.selected.includes(name)) {
        state.selected.push(name);
        renderSelectedTags();
        statusEl.textContent = `เลือก ${name} แล้ว (${state.selected.length}/${state.maxSelect})`;
        input.value = '';
        populateListbox('');
        updateResults();
      }
    }

    function removeProvince(name) {
      state.selected = state.selected.filter(p => p !== name);
      renderSelectedTags();
      statusEl.textContent = `ลบ ${name} แล้ว (${state.selected.length}/${state.maxSelect})`;
      updateResults();
    }

    function renderSelectedTags() {
      selectedContainer.innerHTML = state.selected.map(name => `
        <span class="tag">
          ${name}
          <button class="tag-remove" aria-label="ลบ ${name}" data-province="${name}">&times;</button>
        </span>
      `).join('');

      selectedContainer.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => removeProvince(btn.dataset.province));
      });
    }

    // Events
    input.addEventListener('focus', openListbox);
    input.addEventListener('input', () => {
      populateListbox(input.value.trim());
      openListbox();
    });

    input.addEventListener('keydown', (e) => {
      const options = listbox.querySelectorAll('.combobox-option');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, options.length - 1);
        updateActive(options);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        updateActive(options);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          selectProvince(options[activeIndex].dataset.value);
        }
      } else if (e.key === 'Escape') {
        closeListbox();
        input.blur();
      }
    });

    listbox.addEventListener('click', (e) => {
      const option = e.target.closest('.combobox-option');
      if (option) selectProvince(option.dataset.value);
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) closeListbox();
    });

    function updateActive(options) {
      options.forEach((opt, i) => {
        opt.setAttribute('data-active', i === activeIndex ? 'true' : 'false');
      });
      if (activeIndex >= 0 && options[activeIndex]) {
        options[activeIndex].scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', options[activeIndex].dataset.value);
      }
    }

    // Render initial selected tags if loaded from URL
    renderSelectedTags();
  }

  function renderCompareTable(allData, state) {
    const thead = document.getElementById('compare-thead');
    const tbody = document.getElementById('compare-tbody');

    const indicatorLabel = COMPARE_INDICATORS.find(i => i.id === state.indicator).label;
    const selectedData = state.selected.map(name => allData.find(p => p.name === name)).filter(Boolean);

    // Headers
    thead.innerHTML = `
      <tr>
        <th scope="col">รายการ</th>
        ${selectedData.map(p => `<th scope="col">${p.name}</th>`).join('')}
      </tr>
    `;

    // Rows
    let rows = '';

    if (state.indicator === 'cases') {
      // Monthly breakdown
      MONTHS.forEach((m, mi) => {
        rows += `<tr>
          <th scope="row">${MONTHS_FULL[mi]}</th>
          ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.monthly[mi])}</td>`).join('')}
        </tr>`;
      });
      rows += `<tr style="font-weight: 700; background: var(--color-surface-2);">
        <th scope="row">รวมทั้งปี</th>
        ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.total)}</td>`).join('')}
      </tr>`;
    } else if (state.indicator === 'rate') {
      rows += `<tr>
        <th scope="row">จำนวนประชากร</th>
        ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.pop)}</td>`).join('')}
      </tr>`;
      rows += `<tr>
        <th scope="row">จำนวนผู้ป่วยทั้งปี</th>
        ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.total)}</td>`).join('')}
      </tr>`;
      rows += `<tr style="font-weight: 700; background: var(--color-surface-2);">
        <th scope="row">อัตราต่อแสนประชากร</th>
        ${selectedData.map(p => `<td style="text-align: right;">${p.rate}</td>`).join('')}
      </tr>`;
    } else {
      // Trend comparison between years
      const otherYearData = state.year === '2568' ? PROVINCE_DATA_2567 : PROVINCE_DATA_2568;
      rows += `<tr>
        <th scope="row">ผู้ป่วยปี ${state.year}</th>
        ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.total)}</td>`).join('')}
      </tr>`;
      const otherYear = state.year === '2568' ? '2567' : '2568';
      rows += `<tr>
        <th scope="row">ผู้ป่วยปี ${otherYear}</th>
        ${selectedData.map(p => {
          const other = otherYearData.find(o => o.name === p.name);
          return `<td style="text-align: right;">${formatNumber(other ? other.total : 0)}</td>`;
        }).join('')}
      </tr>`;
      rows += `<tr style="font-weight: 700; background: var(--color-surface-2);">
        <th scope="row">เปลี่ยนแปลง (%)</th>
        ${selectedData.map(p => {
          const other = otherYearData.find(o => o.name === p.name);
          if (!other || other.total === 0) return '<td>-</td>';
          const change = ((p.total - other.total) / other.total * 100).toFixed(1);
          const color = change > 0 ? 'var(--color-error)' : 'var(--color-success)';
          const sign = change > 0 ? '+' : '';
          return `<td style="text-align: right; color: ${color};">${sign}${change}%</td>`;
        }).join('')}
      </tr>`;
    }

    tbody.innerHTML = rows;
  }

  function renderMap() {
    // Simplified Thailand SVG map by region
    const svgContainer = document.getElementById('map-svg-container');
    svgContainer.innerHTML = `
      <svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="แผนที่ประเทศไทยแบ่งตามภูมิภาค แสดงเฉดสีตามค่าข้อมูล">
        <!-- Northern -->
        <path id="region-north" d="M140,50 L200,30 L260,50 L270,100 L250,150 L200,170 L150,150 L130,100 Z"
              data-region="ภาคเหนือ" class="map-region" tabindex="0" role="button">
          <title>ภาคเหนือ</title>
        </path>
        <!-- Northeastern -->
        <path id="region-northeast" d="M250,150 L320,120 L380,160 L370,230 L340,280 L280,290 L250,250 L250,200 Z"
              data-region="ภาคตะวันออกเฉียงเหนือ" class="map-region" tabindex="0" role="button">
          <title>ภาคตะวันออกเฉียงเหนือ</title>
        </path>
        <!-- Central -->
        <path id="region-central" d="M150,150 L200,170 L250,150 L250,250 L280,290 L250,340 L200,350 L160,320 L140,260 L130,200 Z"
              data-region="ภาคกลาง" class="map-region" tabindex="0" role="button">
          <title>ภาคกลาง</title>
        </path>
        <!-- Eastern -->
        <path id="region-east" d="M280,290 L340,280 L360,330 L330,370 L290,360 L250,340 Z"
              data-region="ภาคตะวันออก" class="map-region" tabindex="0" role="button">
          <title>ภาคตะวันออก</title>
        </path>
        <!-- Western -->
        <path id="region-west" d="M100,170 L150,150 L130,200 L140,260 L160,320 L140,370 L100,350 L80,280 L90,220 Z"
              data-region="ภาคตะวันตก" class="map-region" tabindex="0" role="button">
          <title>ภาคตะวันตก</title>
        </path>
        <!-- Southern -->
        <path id="region-south" d="M140,370 L200,350 L250,340 L230,400 L210,440 L200,500 L190,550 L170,580 L150,550 L140,480 L130,420 Z"
              data-region="ภาคใต้" class="map-region" tabindex="0" role="button">
          <title>ภาคใต้</title>
        </path>
        <!-- Region labels -->
        <text x="195" y="110" text-anchor="middle" fill="#f1f5f9" font-size="11" font-family="Inter, Noto Sans Thai, sans-serif" pointer-events="none">เหนือ</text>
        <text x="310" y="210" text-anchor="middle" fill="#f1f5f9" font-size="10" font-family="Inter, Noto Sans Thai, sans-serif" pointer-events="none">อีสาน</text>
        <text x="200" y="250" text-anchor="middle" fill="#f1f5f9" font-size="11" font-family="Inter, Noto Sans Thai, sans-serif" pointer-events="none">กลาง</text>
        <text x="310" y="330" text-anchor="middle" fill="#f1f5f9" font-size="10" font-family="Inter, Noto Sans Thai, sans-serif" pointer-events="none">ตะวันออก</text>
        <text x="110" y="270" text-anchor="middle" fill="#f1f5f9" font-size="10" font-family="Inter, Noto Sans Thai, sans-serif" pointer-events="none">ตะวันตก</text>
        <text x="180" y="460" text-anchor="middle" fill="#f1f5f9" font-size="11" font-family="Inter, Noto Sans Thai, sans-serif" pointer-events="none">ใต้</text>
      </svg>
    `;

    // Style map regions
    const style = document.createElement('style');
    style.textContent = `
      .map-region {
        fill: var(--color-surface-2);
        stroke: var(--color-border);
        stroke-width: 2;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .map-region:hover, .map-region:focus {
        stroke: var(--color-primary);
        stroke-width: 3;
        filter: brightness(1.2);
      }
      .map-region:focus {
        outline: none;
      }
    `;
    document.head.appendChild(style);

    // Map region tooltip
    document.querySelectorAll('.map-region').forEach(region => {
      region.addEventListener('focus', function() {
        const title = this.querySelector('title');
        if (title) announce(title.textContent);
      });
    });
  }

  function updateMapColors(allData, state) {
    // Compute regional averages based on indicator
    const regionValues = {};
    REGIONS.forEach(r => {
      const provinces = allData.filter(p => p.region === r);
      let value;
      if (state.indicator === 'cases') {
        value = provinces.reduce((sum, p) => sum + p.total, 0);
      } else if (state.indicator === 'rate') {
        const totalPop = provinces.reduce((sum, p) => sum + p.pop, 0);
        const totalCases = provinces.reduce((sum, p) => sum + p.total, 0);
        value = totalPop > 0 ? (totalCases / totalPop * 100000) : 0;
      } else {
        const otherData = state.year === '2568' ? PROVINCE_DATA_2567 : PROVINCE_DATA_2568;
        const currentTotal = provinces.reduce((sum, p) => sum + p.total, 0);
        const otherTotal = PROVINCES.filter(p => p.region === r)
          .map(p => otherData.find(o => o.name === p.name))
          .filter(Boolean)
          .reduce((sum, p) => sum + p.total, 0);
        value = otherTotal > 0 ? ((currentTotal - otherTotal) / otherTotal * 100) : 0;
      }
      regionValues[r] = value;
    });

    // Color scale
    const values = Object.values(regionValues);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    // Color gradient: light blue → dark blue → red
    const colorScale = [
      '#1e3a5f', // low
      '#2563eb', // mid-low
      '#60a5fa', // mid
      '#fbbf24', // mid-high
      '#f87171', // high
    ];

    const regionMap = {
      'ภาคเหนือ': 'region-north',
      'ภาคตะวันออกเฉียงเหนือ': 'region-northeast',
      'ภาคกลาง': 'region-central',
      'ภาคตะวันออก': 'region-east',
      'ภาคตะวันตก': 'region-west',
      'ภาคใต้': 'region-south',
    };

    REGIONS.forEach(r => {
      const el = document.getElementById(regionMap[r]);
      if (!el) return;

      const normalized = (regionValues[r] - minVal) / range;
      const colorIdx = Math.min(Math.floor(normalized * (colorScale.length - 1)), colorScale.length - 1);
      el.style.fill = colorScale[colorIdx];

      // Update title for accessibility
      const title = el.querySelector('title');
      const indicatorLabel = COMPARE_INDICATORS.find(i => i.id === state.indicator).label;
      if (title) {
        if (state.indicator === 'rate') {
          title.textContent = `${r}: ${regionValues[r].toFixed(1)} ต่อแสนประชากร`;
        } else if (state.indicator === 'trend') {
          title.textContent = `${r}: ${regionValues[r] > 0 ? '+' : ''}${regionValues[r].toFixed(1)}%`;
        } else {
          title.textContent = `${r}: ${formatNumber(Math.round(regionValues[r]))} ราย`;
        }
      }

      // Highlight selected provinces' regions
      const hasSelected = state.selected.some(name => {
        const prov = PROVINCES.find(p => p.name === name);
        return prov && prov.region === r;
      });
      el.style.strokeWidth = hasSelected ? '4' : '2';
      el.style.stroke = hasSelected ? '#fbbf24' : '';
    });

    // Update legend
    const legendContainer = document.getElementById('map-legend-container');
    const steps = 5;
    legendContainer.innerHTML = '<strong style="font-size: var(--text-sm); display: block; margin-bottom: var(--space-sm);">คำอธิบายเฉดสี</strong>';
    for (let i = 0; i < steps; i++) {
      const val = minVal + (range / (steps - 1)) * i;
      let label;
      if (state.indicator === 'rate') {
        label = val.toFixed(1) + ' ต่อแสน';
      } else if (state.indicator === 'trend') {
        label = (val > 0 ? '+' : '') + val.toFixed(1) + '%';
      } else {
        label = formatNumber(Math.round(val)) + ' ราย';
      }
      legendContainer.innerHTML += `
        <div class="map-legend-item">
          <span class="legend-swatch" style="background: ${colorScale[i]};" aria-hidden="true"></span>
          <span>${label}</span>
        </div>
      `;
    }
  }
}
