/* ==========================================================
   Open Data ไทย — Explore Page Logic
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initExplore();
});

function initExplore() {
  const state = {
    search: '',
    categories: [],
    organizations: [],
    formats: [],
    years: [],
    tags: [],
    sortField: 'date',
    sortDir: 'desc',
    page: 1,
    perPage: 10,
  };

  // Load query params
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    state.search = params.get('q');
    document.getElementById('filter-search').value = state.search;
  }
  if (params.get('category')) {
    state.categories = [params.get('category')];
  }

  // Render filter options
  renderFilterCheckboxes('filter-categories', CATEGORIES.map(c => c.name), state.categories, (vals) => {
    state.categories = vals;
    state.page = 1;
    renderResults();
  });

  renderFilterCheckboxes('filter-orgs', ORGANIZATIONS, state.organizations, (vals) => {
    state.organizations = vals;
    state.page = 1;
    renderResults();
  });

  renderFilterCheckboxes('filter-formats', FORMATS, state.formats, (vals) => {
    state.formats = vals;
    state.page = 1;
    renderResults();
  });

  const years = [...new Set(ALL_DATASETS.map(d => d.year))].sort((a, b) => b - a);
  renderFilterCheckboxes('filter-years', years.map(String), state.years.map(String), (vals) => {
    state.years = vals.map(Number);
    state.page = 1;
    renderResults();
  });

  renderFilterCheckboxes('filter-tags', TAGS_LIST, state.tags, (vals) => {
    state.tags = vals;
    state.page = 1;
    renderResults();
  });

  // Search
  const searchInput = document.getElementById('filter-search');
  searchInput.addEventListener('input', debounce((e) => {
    state.search = e.target.value.trim().toLowerCase();
    state.page = 1;
    renderResults();
  }, 300));

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', (e) => {
    const [field, dir] = e.target.value.split('-');
    state.sortField = field;
    state.sortDir = dir;
    state.page = 1;
    renderResults();
  });

  // Column header sort
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (state.sortField === field) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = field;
        state.sortDir = 'asc';
      }
      state.page = 1;
      updateSortUI();
      renderResults();
    });

    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        th.click();
      }
    });
    th.setAttribute('tabindex', '0');
    th.setAttribute('role', 'columnheader');
  });

  // Clear filters
  document.getElementById('clear-filters').addEventListener('click', () => {
    state.search = '';
    state.categories = [];
    state.organizations = [];
    state.formats = [];
    state.years = [];
    state.tags = [];
    state.page = 1;
    searchInput.value = '';

    // Uncheck all
    document.querySelectorAll('.sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    renderResults();
    announce('ล้างตัวกรองทั้งหมดแล้ว');
  });

  function updateSortUI() {
    document.querySelectorAll('th[data-sort]').forEach(th => {
      const field = th.dataset.sort;
      if (field === state.sortField) {
        th.setAttribute('aria-sort', state.sortDir === 'asc' ? 'ascending' : 'descending');
      } else {
        th.setAttribute('aria-sort', 'none');
      }
    });

    // Update select to match
    const selectVal = `${state.sortField}-${state.sortDir}`;
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect.querySelector(`option[value="${selectVal}"]`)) {
      sortSelect.value = selectVal;
    }
  }

  function getFilteredData() {
    let data = [...ALL_DATASETS];

    if (state.search) {
      data = data.filter(d =>
        d.title.toLowerCase().includes(state.search) ||
        d.description.toLowerCase().includes(state.search) ||
        d.organization.toLowerCase().includes(state.search)
      );
    }

    if (state.categories.length > 0) {
      data = data.filter(d => state.categories.includes(d.category));
    }

    if (state.organizations.length > 0) {
      data = data.filter(d => state.organizations.includes(d.organization));
    }

    if (state.formats.length > 0) {
      data = data.filter(d => d.formats.some(f => state.formats.includes(f)));
    }

    if (state.years.length > 0) {
      data = data.filter(d => state.years.includes(d.year));
    }

    if (state.tags.length > 0) {
      data = data.filter(d => d.tags.some(t => state.tags.includes(t)));
    }

    // Sort
    data.sort((a, b) => {
      let va, vb;
      switch (state.sortField) {
        case 'name':
          va = a.title; vb = b.title;
          return state.sortDir === 'asc' ? va.localeCompare(vb, 'th') : vb.localeCompare(va, 'th');
        case 'date':
          // Simple sort by id as proxy for date ordering
          va = a.id; vb = b.id;
          return state.sortDir === 'asc' ? va - vb : vb - va;
        case 'downloads':
          va = a.downloads; vb = b.downloads;
          return state.sortDir === 'asc' ? va - vb : vb - va;
        default:
          return 0;
      }
    });

    return data;
  }

  function renderResults() {
    const filtered = getFilteredData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.perPage;
    const pageData = filtered.slice(start, start + state.perPage);

    // Results count
    const countEl = document.getElementById('results-count');
    countEl.textContent = `แสดง ${start + 1}-${Math.min(start + state.perPage, filtered.length)} จาก ${formatNumber(filtered.length)} ชุดข้อมูล`;

    // Table body
    const tbody = document.getElementById('datasets-tbody');
    if (pageData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <div class="empty-icon" aria-hidden="true">🔍</div>
              <p>ไม่พบชุดข้อมูลที่ตรงกับเงื่อนไข</p>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = pageData.map(d => {
        const formatBadges = d.formats.map(f => {
          const cls = f === 'CSV' ? 'badge-csv' : f === 'JSON' ? 'badge-json' : f === 'Excel' ? 'badge-excel' : 'badge-api';
          return `<span class="badge ${cls}">${f}</span>`;
        }).join(' ');

        return `
          <tr>
            <td data-label="ชื่อ">
              <div class="ds-title">${d.title}</div>
            </td>
            <td data-label="คำอธิบาย" class="no-mobile">
              <span style="font-size: var(--text-sm); color: var(--color-text-3);">${d.description.substring(0, 60)}…</span>
            </td>
            <td data-label="หน่วยงาน" class="no-mobile">${d.organization}</td>
            <td data-label="อัปเดต">${d.lastUpdated}</td>
            <td data-label="ความถี่" class="no-mobile">${d.frequency}</td>
            <td data-label="รูปแบบ">${formatBadges}</td>
            <td data-label="ดาวน์โหลด">${formatNumber(d.downloads)}</td>
          </tr>
        `;
      }).join('');
    }

    // Pagination
    createPagination(document.getElementById('pagination-container'), state.page, totalPages, (page) => {
      state.page = page;
      renderResults();
      // Scroll to top of table
      document.getElementById('datasets-table').scrollIntoView({ behavior: 'smooth', block: 'start' });
      announce(`แสดงหน้า ${page} จาก ${totalPages}`);
    });

    updateSortUI();
  }

  // Initial render
  renderResults();
  updateSortUI();
}

function renderFilterCheckboxes(containerId, options, selected, onChange) {
  const container = document.getElementById(containerId);
  container.innerHTML = options.map((opt, i) => {
    const id = `${containerId}-${i}`;
    const checked = selected.includes(opt) ? 'checked' : '';
    return `
      <label class="form-checkbox" for="${id}">
        <input type="checkbox" id="${id}" value="${opt}" ${checked}>
        ${opt}
      </label>
    `;
  }).join('');

  container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = Array.from(container.querySelectorAll('input:checked')).map(c => c.value);
      onChange(checked);
    });
  });
}
