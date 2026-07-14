/* ==========================================================
   Open Data ไทย — Data Table Page Logic
   77 จังหวัด × 12 เดือน, 2-level headers, sticky column,
   search, filter, sort, pagination, anomaly warnings, export
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDataTable();
});

function initDataTable() {
  const state = {
    search: '',
    region: '',
    sortCol: null,    // null = no sort, 0 = province, 1-12 = months, 13 = total, 14 = rate
    sortDir: 'asc',
    page: 1,
    perPage: 20,
  };

  // Populate region filter
  function renderRegionFilter() {
    const regionSelect = document.getElementById('filter-region');
    if (!regionSelect) return;
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    const currentVal = regionSelect.value;
    regionSelect.innerHTML = `<option value="">${isEn ? 'All Regions' : 'ทุกภูมิภาค'}</option>`;
    REGIONS.forEach((r, i) => {
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = isEn ? REGIONS_EN[i] : r;
      regionSelect.appendChild(opt);
    });
    regionSelect.value = currentVal;
  }

  renderRegionFilter();

  // Build table headers (2 levels)
  buildHeaders();

  // Events
  const searchInput = document.getElementById('search-province');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      state.search = e.target.value.trim().toLowerCase();
      state.page = 1;
      renderTable();
    }, 300));
  }

  const regionSelect = document.getElementById('filter-region');
  if (regionSelect) {
    regionSelect.addEventListener('change', (e) => {
      state.region = e.target.value;
      state.page = 1;
      renderTable();
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      announce(state.region ? (isEn ? `Filtered by ${regionSelect.options[regionSelect.selectedIndex].text}` : `กรองเฉพาะ${state.region}`) : (isEn ? 'Showing all regions' : 'แสดงทุกภูมิภาค'));
    });
  }

  // Export
  const exportCsvBtn = document.getElementById('export-csv');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      exportData('csv');
      showToast(isEn ? 'Exporting CSV file...' : 'กำลังส่งออกไฟล์ CSV...');
    });
  }

  const exportExcelBtn = document.getElementById('export-excel');
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', () => {
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      exportData('excel');
      showToast(isEn ? 'Exporting Excel file...' : 'กำลังส่งออกไฟล์ Excel...');
    });
  }

  function buildHeaders() {
    const thead = document.getElementById('province-thead');
    if (!thead) return;
    thead.innerHTML = '';
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';

    // Row 1: Province + Year group
    const row1 = document.createElement('tr');
    const thProvince = document.createElement('th');
    thProvince.textContent = isEn ? 'Province' : 'จังหวัด';
    thProvince.setAttribute('rowspan', '2');
    thProvince.setAttribute('scope', 'col');
    thProvince.setAttribute('aria-sort', 'none');
    thProvince.dataset.col = '0';
    thProvince.style.minWidth = '140px';
    thProvince.tabIndex = 0;
    thProvince.setAttribute('role', 'columnheader');
    row1.appendChild(thProvince);

    const thRegion = document.createElement('th');
    thRegion.textContent = isEn ? 'Region' : 'ภูมิภาค';
    thRegion.setAttribute('rowspan', '2');
    thRegion.setAttribute('scope', 'col');
    thRegion.style.minWidth = '100px';
    row1.appendChild(thRegion);

    const thYear = document.createElement('th');
    thYear.textContent = isEn ? 'Year 2025 (Monthly Cases)' : 'ปี 2568 (จำนวนผู้ป่วยรายเดือน)';
    thYear.setAttribute('colspan', '12');
    thYear.setAttribute('scope', 'colgroup');
    thYear.className = 'col-group';
    thYear.style.textAlign = 'center';
    row1.appendChild(thYear);

    const thTotal = document.createElement('th');
    thTotal.textContent = isEn ? 'Total' : 'รวม';
    thTotal.setAttribute('rowspan', '2');
    thTotal.setAttribute('scope', 'col');
    thTotal.setAttribute('aria-sort', 'none');
    thTotal.dataset.col = '13';
    thTotal.tabIndex = 0;
    thTotal.setAttribute('role', 'columnheader');
    row1.appendChild(thTotal);

    const thRate = document.createElement('th');
    thRate.textContent = isEn ? 'Rate per 100k' : 'อัตราต่อแสน';
    thRate.setAttribute('rowspan', '2');
    thRate.setAttribute('scope', 'col');
    thRate.setAttribute('aria-sort', 'none');
    thRate.dataset.col = '14';
    thRate.tabIndex = 0;
    thRate.setAttribute('role', 'columnheader');
    row1.appendChild(thRate);

    thead.appendChild(row1);

    // Row 2: Months
    const row2 = document.createElement('tr');
    const monthsList = isEn ? MONTHS_EN : MONTHS;
    monthsList.forEach((m, i) => {
      const th = document.createElement('th');
      th.textContent = m;
      th.setAttribute('scope', 'col');
      th.setAttribute('aria-sort', 'none');
      th.dataset.col = String(i + 1);
      th.tabIndex = 0;
      th.setAttribute('role', 'columnheader');
      th.style.minWidth = '60px';
      th.style.textAlign = 'right';
      row2.appendChild(th);
    });
    thead.appendChild(row2);

    // Sort handlers for all sortable headers
    thead.querySelectorAll('th[data-col]').forEach(th => {
      th.addEventListener('click', () => handleSort(th));
      th.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSort(th);
        }
      });
    });

    updateSortIndicators();
  }

  function handleSort(th) {
    const col = parseInt(th.dataset.col);
    if (state.sortCol === col) {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortCol = col;
      state.sortDir = 'asc';
    }
    state.page = 1;
    updateSortIndicators();
    renderTable();

    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    const colName = col === 0 ? (isEn ? 'Province' : 'จังหวัด') : col <= 12 ? (isEn ? MONTHS_FULL_EN[col - 1] : MONTHS_FULL[col - 1]) : col === 13 ? (isEn ? 'Total' : 'รวม') : (isEn ? 'Rate per 100k' : 'อัตราต่อแสน');
    const dirText = state.sortDir === 'asc' ? (isEn ? 'ascending' : 'น้อยไปมาก') : (isEn ? 'descending' : 'มากไปน้อย');
    announce(isEn ? `Sorted by ${colName} ${dirText}` : `เรียงตาม${colName} ${dirText}`);
  }

  function updateSortIndicators() {
    document.querySelectorAll('#province-thead th[data-col]').forEach(th => {
      const col = parseInt(th.dataset.col);
      if (col === state.sortCol) {
        th.setAttribute('aria-sort', state.sortDir === 'asc' ? 'ascending' : 'descending');
      } else {
        th.setAttribute('aria-sort', 'none');
      }
    });
  }

  function getFilteredData() {
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    let data = [...PROVINCE_DATA_2568];

    if (state.search) {
      data = data.filter(p => {
        const name = (isEn && p.nameEn) ? p.nameEn : p.name;
        return name.toLowerCase().includes(state.search) || p.name.includes(state.search);
      });
    }

    if (state.region) {
      data = data.filter(p => p.region === state.region);
    }

    // Sort
    if (state.sortCol !== null) {
      data.sort((a, b) => {
        let va, vb;
        if (state.sortCol === 0) {
          va = (isEn && a.nameEn) ? a.nameEn : a.name;
          vb = (isEn && b.nameEn) ? b.nameEn : b.name;
          return state.sortDir === 'asc' ? va.localeCompare(vb, isEn ? 'en' : 'th') : vb.localeCompare(va, isEn ? 'en' : 'th');
        } else if (state.sortCol <= 12) {
          va = a.monthly[state.sortCol - 1]; vb = b.monthly[state.sortCol - 1];
        } else if (state.sortCol === 13) {
          va = a.total; vb = b.total;
        } else {
          va = a.rate; vb = b.rate;
        }
        return state.sortDir === 'asc' ? va - vb : vb - va;
      });
    }

    return data;
  }

  function renderTable() {
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    const filtered = getFilteredData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.perPage;
    const pageData = filtered.slice(start, start + state.perPage);

    // Results count
    const resEl = document.getElementById('table-results');
    if (resEl) {
      resEl.textContent = isEn
        ? `Showing ${start + 1}-${Math.min(start + state.perPage, filtered.length)} of ${filtered.length} provinces`
        : `แสดง ${start + 1}-${Math.min(start + state.perPage, filtered.length)} จาก ${filtered.length} จังหวัด`;
    }

    // Render body
    const tbody = document.getElementById('province-tbody');
    if (tbody) {
      if (pageData.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="16">
              <div class="empty-state">
                <div class="empty-icon" aria-hidden="true">🔍</div>
                <p>${isEn ? 'No provinces found matching criteria' : 'ไม่พบจังหวัดที่ตรงกับเงื่อนไข'}</p>
              </div>
            </td>
          </tr>
        `;
      } else {
        const monthsLabelList = isEn ? MONTHS_EN : MONTHS;
        const fullMonthsList = isEn ? MONTHS_FULL_EN : MONTHS_FULL;

        tbody.innerHTML = pageData.map(p => {
          const isAnomaly = p.monthly.some(v => v > ANOMALY_THRESHOLD);
          const rowClass = isAnomaly ? 'row-warning' : '';
          const provName = (isEn && p.nameEn) ? p.nameEn : p.name;
          const regName = (isEn && p.regionEn) ? p.regionEn : p.region;

          const monthCells = p.monthly.map((v, mi) => {
            const cellWarning = v > ANOMALY_THRESHOLD
              ? ` <span class="warning-icon" aria-label="${isEn ? `High anomaly: ${formatNumber(v)} cases in ${fullMonthsList[mi]}` : `ค่าสูงผิดปกติ: ${formatNumber(v)} ราย ในเดือน${MONTHS_FULL[mi]}`}" title="${isEn ? 'Anomaly' : 'ค่าสูงผิดปกติ'}">⚠</span>`
              : '';
            return `<td data-label="${monthsLabelList[mi]}" style="text-align: right;">${formatNumber(v)}${cellWarning}</td>`;
          }).join('');

          return `
            <tr class="${rowClass}">
              <th scope="row" data-label="${isEn ? 'Province' : 'จังหวัด'}" style="font-weight: 600; white-space: nowrap;">
                ${provName}
                ${isAnomaly ? `<span class="sr-only"> (${isEn ? 'High anomaly' : 'มีค่าสูงผิดปกติ'})</span>` : ''}
              </th>
              <td data-label="${isEn ? 'Region' : 'ภูมิภาค'}" style="font-size: var(--text-xs); color: var(--color-text-3);">${regName}</td>
              ${monthCells}
              <td data-label="${isEn ? 'Total' : 'รวม'}" style="text-align: right; font-weight: 600;">${formatNumber(p.total)}</td>
              <td data-label="${isEn ? 'Rate per 100k' : 'อัตราต่อแสน'}" style="text-align: right;">${p.rate}</td>
            </tr>
          `;
        }).join('');
      }
    }

    // Pagination
    const pagEl = document.getElementById('pagination-container');
    if (pagEl) {
      createPagination(pagEl, state.page, totalPages, (page) => {
        state.page = page;
        renderTable();
        const tableContainer = document.getElementById('province-table');
        if (tableContainer) tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        announce(isEn ? `Showing page ${page} of ${totalPages}` : `แสดงหน้า ${page} จาก ${totalPages}`);
      });
    }
  }

  function exportData(format) {
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    const data = getFilteredData();
    const headers = isEn
      ? ['Province', 'Region', ...MONTHS_FULL_EN, 'Total', 'Rate per 100k']
      : ['จังหวัด', 'ภูมิภาค', ...MONTHS_FULL, 'รวม', 'อัตราต่อแสน'];
    const rows = data.map(p => [
      isEn && p.nameEn ? p.nameEn : p.name,
      isEn && p.regionEn ? p.regionEn : p.region,
      ...p.monthly,
      p.total,
      p.rate,
    ]);

    if (format === 'csv') {
      downloadCSV(rows, headers, 'dengue-provinces-2568.csv');
    } else {
      downloadExcel(rows, headers, 'dengue-provinces-2568.xls');
    }
  }

  // Listen for language change
  window.addEventListener('languagechange', () => {
    renderRegionFilter();
    buildHeaders();
    renderTable();
  });

  // Initial render
  renderTable();
}
