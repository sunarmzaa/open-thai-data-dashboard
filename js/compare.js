/* ==========================================================
   Open Data ไทย — Compare Page Logic
   Province comparison with SVG map, combobox, table
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCompare();
});

function initCompare() {
  const state = {
    selected: [],       // province names (Thai keys)
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
  function renderRadios() {
    const radioContainer = document.getElementById('indicator-radios');
    if (!radioContainer) return;
    radioContainer.innerHTML = '';
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
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
      label.appendChild(document.createTextNode(isEn && ind.labelEn ? ind.labelEn : ind.label));
      radioContainer.appendChild(label);
    });
  }

  renderRadios();

  // --- Year select ---
  const yearSelect = document.getElementById('year-select');
  if (yearSelect) {
    yearSelect.value = state.year;
    yearSelect.addEventListener('change', (e) => {
      state.year = e.target.value;
      updateResults();
    });
  }

  // --- Province combobox ---
  const comboboxHandlers = initCombobox(state);

  // --- Share & Print ---
  const btnShare = document.getElementById('btn-share');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      shareURL({
        provinces: state.selected.join(','),
        indicator: state.indicator,
        year: state.year,
      });
    });
  }

  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => printReport());
  }

  // --- Render SVG map ---
  renderMap();

  // --- Initial render ---
  if (state.selected.length >= 2) {
    updateResults();
  } else {
    updateMapColors(getData(), state);
  }

  // Listen for language switch
  window.addEventListener('languagechange', () => {
    renderRadios();
    updateResults();
    if (comboboxHandlers && comboboxHandlers.reRender) {
      comboboxHandlers.reRender();
    }
  });

  function getData() {
    return state.year === '2568' ? PROVINCE_DATA_2568 : PROVINCE_DATA_2567;
  }

  function updateResults() {
    const resultsArea = document.getElementById('results-area');
    const actionBtns = document.getElementById('action-buttons');
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';

    if (state.selected.length < 2) {
      if (resultsArea) resultsArea.style.display = 'none';
      if (actionBtns) actionBtns.hidden = true;
      updateMapColors(getData(), state);
      return;
    }

    if (resultsArea) resultsArea.style.display = '';
    if (actionBtns) actionBtns.hidden = false;

    const data = getData();

    // Update map
    updateMapColors(data, state);

    // Update comparison table
    renderCompareTable(data, state);

    announce(isEn ? `Showing comparison for ${state.selected.length} provinces` : `แสดงผลเปรียบเทียบ ${state.selected.length} จังหวัด`);
  }

  function initCombobox(state) {
    const input = document.getElementById('province-search');
    const listbox = document.getElementById('province-listbox');
    if (!input || !listbox) return {};
    const wrapper = input.closest('.combobox-wrapper');
    const selectedContainer = document.getElementById('selected-provinces');
    const statusEl = document.getElementById('province-status');
    let activeIndex = -1;

    function populateListbox(filter = '') {
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      const available = PROVINCES.filter(p => {
        if (state.selected.includes(p.name)) return false;
        const provName = (isEn && p.nameEn) ? p.nameEn : p.name;
        return provName.toLowerCase().includes(filter.toLowerCase()) || p.name.includes(filter);
      });

      listbox.innerHTML = available.map(p => {
        const provName = (isEn && p.nameEn) ? p.nameEn : p.name;
        const regName = (isEn && p.regionEn) ? p.regionEn : p.region;
        return `
          <div class="combobox-option" role="option" aria-selected="false" data-value="${p.name}">
            ${provName} <span style="color: var(--color-text-muted); font-size: var(--text-xs);">(${regName})</span>
          </div>
        `;
      }).join('');

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
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      if (state.selected.length >= state.maxSelect) {
        if (statusEl) statusEl.textContent = isEn ? `Maximum ${state.maxSelect} provinces allowed` : `เลือกได้สูงสุด ${state.maxSelect} จังหวัด`;
        return;
      }
      if (!state.selected.includes(name)) {
        state.selected.push(name);
        renderSelectedTags();
        const prov = PROVINCES.find(p => p.name === name);
        const provName = (isEn && prov && prov.nameEn) ? prov.nameEn : name;
        if (statusEl) statusEl.textContent = isEn ? `Selected ${provName} (${state.selected.length}/${state.maxSelect})` : `เลือก ${name} แล้ว (${state.selected.length}/${state.maxSelect})`;
        input.value = '';
        populateListbox('');
        updateResults();
      }
    }

    function removeProvince(name) {
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      state.selected = state.selected.filter(p => p !== name);
      renderSelectedTags();
      const prov = PROVINCES.find(p => p.name === name);
      const provName = (isEn && prov && prov.nameEn) ? prov.nameEn : name;
      if (statusEl) statusEl.textContent = isEn ? `Removed ${provName} (${state.selected.length}/${state.maxSelect})` : `ลบ ${name} แล้ว (${state.selected.length}/${state.maxSelect})`;
      updateResults();
    }

    function renderSelectedTags() {
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      if (!selectedContainer) return;
      selectedContainer.innerHTML = state.selected.map(name => {
        const prov = PROVINCES.find(p => p.name === name);
        const provName = (isEn && prov && prov.nameEn) ? prov.nameEn : name;
        return `
          <span class="tag">
            ${provName}
            <button class="tag-remove" aria-label="${isEn ? `Remove ${provName}` : `ลบ ${provName}`}" data-province="${name}">&times;</button>
          </span>
        `;
      }).join('');

      selectedContainer.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', () => removeProvince(btn.dataset.province));
      });
    }

    // Events
    input.addEventListener('focus', openListbox);
    input.addEventListener('input', () => {
      populateListbox(input.value.trim());
      listbox.setAttribute('data-open', 'true');
      wrapper.setAttribute('aria-expanded', 'true');
    });

    // Combobox keyboard navigation & clicks
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        closeListbox();
      }
    });

    listbox.addEventListener('click', (e) => {
      const opt = e.target.closest('.combobox-option');
      if (opt) {
        selectProvince(opt.dataset.value);
      }
    });

    input.addEventListener('keydown', (e) => {
      const options = listbox.querySelectorAll('.combobox-option');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % options.length;
        updateActiveOption(options);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + options.length) % options.length;
        updateActiveOption(options);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          selectProvince(options[activeIndex].dataset.value);
        } else if (options.length === 1) {
          selectProvince(options[0].dataset.value);
        }
      } else if (e.key === 'Escape') {
        closeListbox();
      }
    });

    function updateActiveOption(options) {
      options.forEach((o, i) => {
        o.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
        if (i === activeIndex) {
          o.scrollIntoView({ block: 'nearest' });
        }
      });
    }

    renderSelectedTags();

    return {
      reRender: () => {
        renderSelectedTags();
        if (listbox.getAttribute('data-open') === 'true') {
          populateListbox(input.value.trim());
        }
      }
    };
  }

  function renderCompareTable(allData, state) {
    const thead = document.getElementById('compare-thead');
    const tbody = document.getElementById('compare-tbody');
    if (!thead || !tbody) return;
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';

    const selectedData = state.selected.map(name => allData.find(p => p.name === name)).filter(Boolean);

    // Headers
    thead.innerHTML = `
      <tr>
        <th scope="col">${isEn ? 'Item' : 'รายการ'}</th>
        ${selectedData.map(p => `<th scope="col">${(isEn && p.nameEn) ? p.nameEn : p.name}</th>`).join('')}
      </tr>
    `;

    // Rows
    let rows = '';
    const monthsList = isEn ? MONTHS_FULL_EN : MONTHS_FULL;

    if (state.indicator === 'cases') {
      // Monthly breakdown
      MONTHS.forEach((m, mi) => {
        rows += `<tr>
          <th scope="row">${monthsList[mi]}</th>
          ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.monthly[mi])}</td>`).join('')}
        </tr>`;
      });
      rows += `<tr style="font-weight: 700; background: var(--color-surface-2);">
        <th scope="row">${isEn ? 'Total for Year' : 'รวมทั้งปี'}</th>
        ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.total)}</td>`).join('')}
      </tr>`;
    } else if (state.indicator === 'rate') {
      rows += `<tr>
        <th scope="row">${isEn ? 'Population' : 'จำนวนประชากร'}</th>
        ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.pop)}</td>`).join('')}
      </tr>`;
      rows += `<tr>
        <th scope="row">${isEn ? 'Total Cases' : 'จำนวนผู้ป่วยทั้งปี'}</th>
        ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.total)}</td>`).join('')}
      </tr>`;
      rows += `<tr style="font-weight: 700; background: var(--color-surface-2);">
        <th scope="row">${isEn ? 'Rate per 100k pop' : 'อัตราต่อแสนประชากร'}</th>
        ${selectedData.map(p => `<td style="text-align: right;">${p.rate}</td>`).join('')}
      </tr>`;
    } else {
      // Trend comparison between years
      const otherYearData = state.year === '2568' ? PROVINCE_DATA_2567 : PROVINCE_DATA_2568;
      const currYearStr = isEn ? (state.year === '2568' ? '2025' : '2024') : state.year;
      const otherYearStr = isEn ? (state.year === '2568' ? '2024' : '2025') : (state.year === '2568' ? '2567' : '2568');

      rows += `<tr>
        <th scope="row">${isEn ? `Cases in ${currYearStr}` : `ผู้ป่วยปี ${state.year}`}</th>
        ${selectedData.map(p => `<td style="text-align: right;">${formatNumber(p.total)}</td>`).join('')}
      </tr>`;
      rows += `<tr>
        <th scope="row">${isEn ? `Cases in ${otherYearStr}` : `ผู้ป่วยปี ${otherYearStr}`}</th>
        ${selectedData.map(p => {
          const other = otherYearData.find(o => o.name === p.name);
          return `<td style="text-align: right;">${formatNumber(other ? other.total : 0)}</td>`;
        }).join('')}
      </tr>`;
      rows += `<tr style="font-weight: 700; background: var(--color-surface-2);">
        <th scope="row">${isEn ? 'Change (%)' : 'เปลี่ยนแปลง (%)'}</th>
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
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    const svgContainer = document.getElementById('map-svg-container');
    if (!svgContainer) return;
    svgContainer.innerHTML = `
      <svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${isEn ? 'Thailand map categorized by region displaying color intensity by data values' : 'แผนที่ประเทศไทยแบ่งตามภูมิภาค แสดงเฉดสีตามค่าข้อมูล'}">
        <!-- Northern -->
        <path id="region-north" d="M140,50 L200,30 L260,50 L270,100 L250,150 L200,170 L150,150 L130,100 Z"
              data-region="ภาคเหนือ" class="map-region" tabindex="0" role="button">
          <title>${isEn ? 'Northern Region' : 'ภาคเหนือ'}</title>
        </path>
        <!-- Northeastern -->
        <path id="region-northeast" d="M260,50 L350,60 L380,140 L370,220 L300,240 L250,200 L270,100 Z"
              data-region="ภาคตะวันออกเฉียงเหนือ" class="map-region" tabindex="0" role="button">
          <title>${isEn ? 'Northeastern Region' : 'ภาคตะวันออกเฉียงเหนือ'}</title>
        </path>
        <!-- Central -->
        <path id="region-central" d="M150,150 L200,170 L250,200 L250,280 L200,320 L160,280 L140,220 Z"
              data-region="ภาคกลาง" class="map-region" tabindex="0" role="button">
          <title>${isEn ? 'Central Region' : 'ภาคกลาง'}</title>
        </path>
        <!-- Eastern -->
        <path id="region-east" d="M250,240 L300,240 L340,290 L310,340 L250,310 L250,280 Z"
              data-region="ภาคตะวันออก" class="map-region" tabindex="0" role="button">
          <title>${isEn ? 'Eastern Region' : 'ภาคตะวันออก'}</title>
        </path>
        <!-- Western -->
        <path id="region-west" d="M130,100 L150,150 L140,220 L160,280 L140,360 L100,320 L110,200 Z"
              data-region="ภาคตะวันตก" class="map-region" tabindex="0" role="button">
          <title>${isEn ? 'Western Region' : 'ภาคตะวันตก'}</title>
        </path>
        <!-- Southern -->
        <path id="region-south" d="M140,360 L170,360 L180,450 L210,520 L200,580 L160,570 L150,480 L130,420 Z"
              data-region="ภาคใต้" class="map-region" tabindex="0" role="button">
          <title>${isEn ? 'Southern Region' : 'ภาคใต้'}</title>
        </path>
      </svg>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .map-region {
        stroke: var(--color-surface);
        stroke-width: 2;
        transition: all 0.2s ease;
        cursor: pointer;
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

    // Map region tooltip (re-read title after language change)
    document.querySelectorAll('.map-region').forEach(region => {
      region.addEventListener('focus', function() {
        const title = this.querySelector('title');
        if (title) announce(title.textContent);
      });
    });
  }

  function updateMapColors(allData, state) {
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
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

    // Color gradient
    const colorScale = ['#1e3a5f', '#2563eb', '#60a5fa', '#fbbf24', '#f87171'];

    const regionMap = {
      'ภาคเหนือ': 'region-north',
      'ภาคตะวันออกเฉียงเหนือ': 'region-northeast',
      'ภาคกลาง': 'region-central',
      'ภาคตะวันออก': 'region-east',
      'ภาคตะวันตก': 'region-west',
      'ภาคใต้': 'region-south',
    };

    REGIONS.forEach((r, i) => {
      const el = document.getElementById(regionMap[r]);
      if (!el) return;

      const normalized = (regionValues[r] - minVal) / range;
      const colorIdx = Math.min(Math.floor(normalized * (colorScale.length - 1)), colorScale.length - 1);
      el.style.fill = colorScale[colorIdx];

      // Update title for accessibility
      const title = el.querySelector('title');
      const regName = isEn ? REGIONS_EN[i] : r;
      if (title) {
        if (state.indicator === 'rate') {
          title.textContent = `${regName}: ${regionValues[r].toFixed(1)} ${isEn ? 'per 100k pop' : 'ต่อแสนประชากร'}`;
        } else if (state.indicator === 'trend') {
          title.textContent = `${regName}: ${regionValues[r] > 0 ? '+' : ''}${regionValues[r].toFixed(1)}%`;
        } else {
          title.textContent = `${regName}: ${formatNumber(Math.round(regionValues[r]))} ${isEn ? 'cases' : 'ราย'}`;
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
    if (!legendContainer) return;
    const steps = 5;
    legendContainer.innerHTML = `<strong style="font-size: var(--text-sm); display: block; margin-bottom: var(--space-sm);">${isEn ? 'Color Legend' : 'คำอธิบายเฉดสี'}</strong>`;
    for (let i = 0; i < steps; i++) {
      const val = minVal + (range / (steps - 1)) * i;
      let label;
      if (state.indicator === 'rate') {
        label = val.toFixed(1) + (isEn ? ' per 100k' : ' ต่อแสน');
      } else if (state.indicator === 'trend') {
        label = (val > 0 ? '+' : '') + val.toFixed(1) + '%';
      } else {
        label = formatNumber(Math.round(val)) + (isEn ? ' cases' : ' ราย');
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
