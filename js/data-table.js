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
  const regionSelect = document.getElementById('filter-region');
  REGIONS.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r;
    opt.textContent = r;
    regionSelect.appendChild(opt);
  });

  // Build table headers (2 levels)
  buildHeaders();

  // Events
  document.getElementById('search-province').addEventListener('input', debounce((e) => {
    state.search = e.target.value.trim().toLowerCase();
    state.page = 1;
    renderTable();
  }, 300));

  regionSelect.addEventListener('change', (e) => {
    state.region = e.target.value;
    state.page = 1;
    renderTable();
    announce(state.region ? `กรองเฉพาะ${state.region}` : 'แสดงทุกภูมิภาค');
  });

  // Export
  document.getElementById('export-csv').addEventListener('click', () => {
    exportData('csv');
    showToast('กำลังส่งออกไฟล์ CSV...');
  });

  document.getElementById('export-excel').addEventListener('click', () => {
    exportData('excel');
    showToast('กำลังส่งออกไฟล์ Excel...');
  });

  function buildHeaders() {
    const thead = document.getElementById('province-thead');

    // Row 1: Province + Year group
    const row1 = document.createElement('tr');
    const thProvince = document.createElement('th');
    thProvince.textContent = 'จังหวัด';
    thProvince.setAttribute('rowspan', '2');
    thProvince.setAttribute('scope', 'col');
    thProvince.setAttribute('aria-sort', 'none');
    thProvince.dataset.col = '0';
    thProvince.style.minWidth = '140px';
    thProvince.tabIndex = 0;
    thProvince.setAttribute('role', 'columnheader');
    row1.appendChild(thProvince);

    const thRegion = document.createElement('th');
    thRegion.textContent = 'ภูมิภาค';
    thRegion.setAttribute('rowspan', '2');
    thRegion.setAttribute('scope', 'col');
    thRegion.style.minWidth = '100px';
    row1.appendChild(thRegion);

    const thYear = document.createElement('th');
    thYear.textContent = 'ปี 2568 (จำนวนผู้ป่วยรายเดือน)';
    thYear.setAttribute('colspan', '12');
    thYear.setAttribute('scope', 'colgroup');
    thYear.className = 'col-group';
    thYear.style.textAlign = 'center';
    row1.appendChild(thYear);

    const thTotal = document.createElement('th');
    thTotal.textContent = 'รวม';
    thTotal.setAttribute('rowspan', '2');
    thTotal.setAttribute('scope', 'col');
    thTotal.setAttribute('aria-sort', 'none');
    thTotal.dataset.col = '13';
    thTotal.tabIndex = 0;
    thTotal.setAttribute('role', 'columnheader');
    row1.appendChild(thTotal);

    const thRate = document.createElement('th');
    thRate.textContent = 'อัตราต่อแสน';
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
    MONTHS.forEach((m, i) => {
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

    const colName = col === 0 ? 'จังหวัด' : col <= 12 ? MONTHS_FULL[col - 1] : col === 13 ? 'รวม' : 'อัตราต่อแสน';
    const dirText = state.sortDir === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย';
    announce(`เรียงตาม${colName} ${dirText}`);
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
    let data = [...PROVINCE_DATA_2568];

    if (state.search) {
      data = data.filter(p => p.name.includes(state.search));
    }

    if (state.region) {
      data = data.filter(p => p.region === state.region);
    }

    // Sort
    if (state.sortCol !== null) {
      data.sort((a, b) => {
        let va, vb;
        if (state.sortCol === 0) {
          va = a.name; vb = b.name;
          return state.sortDir === 'asc' ? va.localeCompare(vb, 'th') : vb.localeCompare(va, 'th');
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
    const filtered = getFilteredData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.perPage;
    const pageData = filtered.slice(start, start + state.perPage);

    // Results count
    document.getElementById('table-results').textContent =
      `แสดง ${start + 1}-${Math.min(start + state.perPage, filtered.length)} จาก ${filtered.length} จังหวัด`;

    // Render body
    const tbody = document.getElementById('province-tbody');

    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="16">
            <div class="empty-state">
              <div class="empty-icon" aria-hidden="true">🔍</div>
              <p>ไม่พบจังหวัดที่ตรงกับเงื่อนไข</p>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = pageData.map(p => {
        const isAnomaly = p.monthly.some(v => v > ANOMALY_THRESHOLD);
        const rowClass = isAnomaly ? 'row-warning' : '';

        const monthCells = p.monthly.map((v, mi) => {
          const cellWarning = v > ANOMALY_THRESHOLD
            ? ` <span class="warning-icon" aria-label="ค่าสูงผิดปกติ: ${formatNumber(v)} ราย ในเดือน${MONTHS_FULL[mi]}" title="ค่าสูงผิดปกติ">⚠</span>`
            : '';
          return `<td data-label="${MONTHS[mi]}" style="text-align: right;">${formatNumber(v)}${cellWarning}</td>`;
        }).join('');

        return `
          <tr class="${rowClass}">
            <th scope="row" data-label="จังหวัด" style="font-weight: 600; white-space: nowrap;">
              ${p.name}
              ${isAnomaly ? '<span class="sr-only"> (มีค่าสูงผิดปกติ)</span>' : ''}
            </th>
            <td data-label="ภูมิภาค" style="font-size: var(--text-xs); color: var(--color-text-3);">${p.region}</td>
            ${monthCells}
            <td data-label="รวม" style="text-align: right; font-weight: 600;">${formatNumber(p.total)}</td>
            <td data-label="อัตราต่อแสน" style="text-align: right;">${p.rate}</td>
          </tr>
        `;
      }).join('');
    }

    // Pagination
    createPagination(document.getElementById('pagination-container'), state.page, totalPages, (page) => {
      state.page = page;
      renderTable();
      document.getElementById('province-table').scrollIntoView({ behavior: 'smooth', block: 'start' });
      announce(`แสดงหน้า ${page} จาก ${totalPages}`);
    });
  }

  function exportData(format) {
    const data = getFilteredData();
    const headers = ['จังหวัด', 'ภูมิภาค', ...MONTHS_FULL, 'รวม', 'อัตราต่อแสน'];
    const rows = data.map(p => [
      p.name,
      p.region,
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

  // Initial render
  renderTable();
}
