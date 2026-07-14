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
    const searchInput = document.getElementById('filter-search');
    if (searchInput) searchInput.value = state.search;
  }
  if (params.get('category')) {
    state.categories = [params.get('category')];
  }

  function renderAllFilters() {
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';

    // Categories
    renderFilterCheckboxes('filter-categories', CATEGORIES.map(c => c.name), CATEGORIES.map(c => isEn ? c.nameEn : c.name), state.categories, (vals) => {
      state.categories = vals;
      state.page = 1;
      renderResults();
    });

    // Organizations
    renderFilterCheckboxes('filter-orgs', ORGANIZATIONS, isEn ? ORGANIZATIONS_EN : ORGANIZATIONS, state.organizations, (vals) => {
      state.organizations = vals;
      state.page = 1;
      renderResults();
    });

    // Formats
    renderFilterCheckboxes('filter-formats', FORMATS, FORMATS, state.formats, (vals) => {
      state.formats = vals;
      state.page = 1;
      renderResults();
    });

    // Years (TH 2568 -> EN 2025)
    const years = [...new Set(ALL_DATASETS.map(d => d.year))].sort((a, b) => b - a);
    renderFilterCheckboxes('filter-years', years.map(String), years.map(y => isEn ? String(y - 543) : String(y)), state.years.map(String), (vals) => {
      state.years = vals.map(Number);
      state.page = 1;
      renderResults();
    });

    // Tags
    renderFilterCheckboxes('filter-tags', TAGS_LIST, isEn ? TAGS_LIST_EN : TAGS_LIST, state.tags, (vals) => {
      state.tags = vals;
      state.page = 1;
      renderResults();
    });
  }

  renderAllFilters();

  // Search
  const searchInput = document.getElementById('filter-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      state.search = e.target.value.trim().toLowerCase();
      state.page = 1;
      renderResults();
    }, 300));
  }

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const [field, dir] = e.target.value.split('-');
      state.sortField = field;
      state.sortDir = dir;
      state.page = 1;
      renderResults();
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      const optText = sortSelect.options[sortSelect.selectedIndex] ? sortSelect.options[sortSelect.selectedIndex].text : '';
      announce(isEn ? `Sorted by ${optText}` : `เรียงลำดับตาม ${optText}`);
    });
  }

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
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      const dirText = state.sortDir === 'asc' ? (isEn ? 'ascending' : 'จากน้อยไปมาก') : (isEn ? 'descending' : 'จากมากไปน้อย');
      announce(isEn ? `Sorted by ${th.textContent.trim()} ${dirText}` : `เรียงตาม ${th.textContent.trim()} ${dirText}`);
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
  const clearBtn = document.getElementById('clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.search = '';
      state.categories = [];
      state.organizations = [];
      state.formats = [];
      state.years = [];
      state.tags = [];
      state.page = 1;
      if (searchInput) searchInput.value = '';

      // Uncheck all
      document.querySelectorAll('.sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
      renderResults();
      const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
      announce(isEn ? 'All filters cleared' : 'ล้างตัวกรองทั้งหมดแล้ว');
    });
  }

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
    if (sortSelect && sortSelect.querySelector(`option[value="${selectVal}"]`)) {
      sortSelect.value = selectVal;
    }
  }

  function getFilteredData() {
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    let data = [...ALL_DATASETS];

    if (state.search) {
      data = data.filter(d => {
        const title = (isEn && d.titleEn) ? d.titleEn : d.title;
        const desc = (isEn && d.descriptionEn) ? d.descriptionEn : d.description;
        const org = (isEn && d.organizationEn) ? d.organizationEn : d.organization;
        return title.toLowerCase().includes(state.search) ||
          desc.toLowerCase().includes(state.search) ||
          org.toLowerCase().includes(state.search);
      });
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
          va = (isEn && a.titleEn) ? a.titleEn : a.title;
          vb = (isEn && b.titleEn) ? b.titleEn : b.title;
          return state.sortDir === 'asc' ? va.localeCompare(vb, isEn ? 'en' : 'th') : vb.localeCompare(va, isEn ? 'en' : 'th');
        case 'date':
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
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';
    const filtered = getFilteredData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.perPage;
    const pageData = filtered.slice(start, start + state.perPage);

    // Results count
    const countEl = document.getElementById('results-count');
    if (countEl) {
      countEl.textContent = isEn
        ? `Showing ${start + 1}-${Math.min(start + state.perPage, filtered.length)} of ${formatNumber(filtered.length)} datasets`
        : `แสดง ${start + 1}-${Math.min(start + state.perPage, filtered.length)} จาก ${formatNumber(filtered.length)} ชุดข้อมูล`;
    }

    // Table body
    const tbody = document.getElementById('datasets-tbody');
    if (tbody) {
      if (pageData.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7">
              <div class="empty-state">
                <div class="empty-icon" aria-hidden="true">🔍</div>
                <p>${isEn ? 'No datasets found matching your criteria' : 'ไม่พบชุดข้อมูลที่ตรงกับเงื่อนไข'}</p>
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

          const title = (isEn && d.titleEn) ? d.titleEn : d.title;
          const desc = (isEn && d.descriptionEn) ? d.descriptionEn : d.description;
          const org = (isEn && d.organizationEn) ? d.organizationEn : d.organization;
          const updated = (isEn && d.lastUpdatedEn) ? d.lastUpdatedEn : d.lastUpdated;
          const freq = (isEn && d.frequencyEn) ? d.frequencyEn : d.frequency;

          return `
            <tr>
              <td data-label="${isEn ? 'Dataset Name' : 'ชื่อชุดข้อมูล'}">
                <div class="ds-title">${title}</div>
              </td>
              <td data-label="${isEn ? 'Description' : 'คำอธิบาย'}" class="no-mobile">
                <span style="font-size: var(--text-sm); color: var(--color-text-3);">${desc.substring(0, 60)}…</span>
              </td>
              <td data-label="${isEn ? 'Organization' : 'หน่วยงาน'}" class="no-mobile">${org}</td>
              <td data-label="${isEn ? 'Updated Date' : 'วันอัปเดต'}">${updated}</td>
              <td data-label="${isEn ? 'Frequency' : 'ความถี่'}" class="no-mobile">${freq}</td>
              <td data-label="${isEn ? 'Format' : 'รูปแบบ'}">${formatBadges}</td>
              <td data-label="${isEn ? 'Downloads' : 'ดาวน์โหลด'}">${formatNumber(d.downloads)}</td>
            </tr>
          `;
        }).join('');
      }
    }

    // Pagination
    const pagContainer = document.getElementById('pagination-container');
    if (pagContainer) {
      createPagination(pagContainer, state.page, totalPages, (page) => {
        state.page = page;
        renderResults();
        const tableEl = document.getElementById('datasets-table');
        if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        announce(isEn ? `Showing page ${page} of ${totalPages}` : `แสดงหน้า ${page} จาก ${totalPages}`);
      });
    }

    updateSortUI();
  }

  // Listen for language switch
  window.addEventListener('languagechange', () => {
    renderAllFilters();
    renderResults();
  });

  // Initial render
  renderResults();
  updateSortUI();
}

function renderFilterCheckboxes(containerId, options, displayLabels, selected, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = options.map((opt, i) => {
    const id = `${containerId}-${i}`;
    const checked = selected.includes(opt) ? 'checked' : '';
    const label = displayLabels[i] || opt;
    return `
      <label class="form-checkbox" for="${id}">
        <input type="checkbox" id="${id}" value="${opt}" ${checked}>
        ${label}
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
