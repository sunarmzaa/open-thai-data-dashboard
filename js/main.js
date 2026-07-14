/* ==========================================================
   Open Data ไทย — Main JS (Global Navigation & Utilities)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCurrentPage();
});

/* --- Navigation --- */
function initNavigation() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.getAttribute('data-open') === 'true';
      links.setAttribute('data-open', !isOpen);
      toggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.getAttribute('data-open') === 'true') {
        links.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* --- Mark current page in nav --- */
function initCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* --- Utility: Announce to screen reader --- */
function announce(message, priority = 'polite') {
  let region = document.getElementById('live-announcer');
  if (!region) {
    region = document.createElement('div');
    region.id = 'live-announcer';
    region.className = 'live-region';
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
    document.body.appendChild(region);
  }
  region.setAttribute('aria-live', priority);
  region.textContent = '';
  // Use setTimeout to ensure the change is detected
  setTimeout(() => {
    region.textContent = message;
  }, 100);
}

/* --- Utility: Debounce --- */
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* --- Utility: Download CSV --- */
function downloadCSV(data, headers, filename) {
  const BOM = '\uFEFF';
  const csvRows = [headers.join(',')];
  data.forEach(row => {
    csvRows.push(row.map(cell => {
      const str = String(cell);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(','));
  });
  const blob = new Blob([BOM + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

/* --- Utility: Download Excel (simplified XLSX as CSV with .xlsx for demo) --- */
function downloadExcel(data, headers, filename) {
  // Use a simple tab-separated format for Excel compatibility
  const BOM = '\uFEFF';
  const rows = [headers.join('\t')];
  data.forEach(row => {
    rows.push(row.map(String).join('\t'));
  });
  const blob = new Blob([BOM + rows.join('\n')], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* --- Utility: Download canvas as PNG --- */
function downloadCanvasAsPNG(canvasId, filename) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  canvas.toBlob(blob => {
    triggerDownload(blob, filename);
  }, 'image/png');
}

/* --- Utility: Share URL --- */
function shareURL(params) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  navigator.clipboard.writeText(url.toString()).then(() => {
    showToast('คัดลอกลิงก์แล้ว');
  }).catch(() => {
    // Fallback
    prompt('คัดลอกลิงก์:', url.toString());
  });
}

/* --- Utility: Toast --- */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* --- Utility: Print --- */
function printReport() {
  window.print();
}

/* --- Utility: Create pagination --- */
function createPagination(container, currentPage, totalPages, onPageChange) {
  container.innerHTML = '';

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'การแบ่งหน้า');
  nav.className = 'pagination';

  // Prev
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.textContent = '‹ ก่อนหน้า';
  prevBtn.disabled = currentPage === 1;
  prevBtn.setAttribute('aria-label', 'ไปหน้าก่อนหน้า');
  prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));
  nav.appendChild(prevBtn);

  // Page numbers
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  if (start > 1) {
    nav.appendChild(createPageBtn(1, currentPage, onPageChange));
    if (start > 2) {
      const dots = document.createElement('span');
      dots.className = 'page-info';
      dots.textContent = '…';
      dots.setAttribute('aria-hidden', 'true');
      nav.appendChild(dots);
    }
  }

  for (let i = start; i <= end; i++) {
    nav.appendChild(createPageBtn(i, currentPage, onPageChange));
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      const dots = document.createElement('span');
      dots.className = 'page-info';
      dots.textContent = '…';
      dots.setAttribute('aria-hidden', 'true');
      nav.appendChild(dots);
    }
    nav.appendChild(createPageBtn(totalPages, currentPage, onPageChange));
  }

  // Next
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.textContent = 'ถัดไป ›';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.setAttribute('aria-label', 'ไปหน้าถัดไป');
  nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));
  nav.appendChild(nextBtn);

  // Info
  const info = document.createElement('span');
  info.className = 'page-info';
  info.textContent = `หน้า ${currentPage} จาก ${totalPages}`;
  info.setAttribute('aria-live', 'polite');
  nav.appendChild(info);

  container.appendChild(nav);
}

function createPageBtn(page, currentPage, onPageChange) {
  const btn = document.createElement('button');
  btn.className = 'page-btn';
  btn.textContent = page;
  btn.setAttribute('aria-label', `ไปหน้า ${page}`);
  if (page === currentPage) {
    btn.setAttribute('aria-current', 'page');
  }
  btn.addEventListener('click', () => onPageChange(page));
  return btn;
}

/* --- Navigation HTML (shared across pages) --- */
function getNavHTML(activePage) {
  return `
    <a href="#main-content" class="skip-link">ข้ามไปยังเนื้อหาหลัก</a>
    <header class="site-nav" role="banner">
      <div class="nav-inner">
        <a href="index.html" class="nav-brand" aria-label="Open Data ไทย หน้าหลัก">
          <span class="brand-icon" aria-hidden="true">📊</span>
          <span lang="en">Open Data</span> ไทย
        </a>
        <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="เปิดเมนูนำทาง">
          ☰
        </button>
        <nav id="nav-links" class="nav-links" data-open="false" aria-label="เมนูหลัก">
          <a href="index.html" class="nav-link">หน้าหลัก</a>
          <a href="explore.html" class="nav-link">สำรวจข้อมูล</a>
          <a href="visualization.html" class="nav-link">แสดงผลด้วยภาพ</a>
          <a href="data-table.html" class="nav-link">ตารางข้อมูล</a>
          <a href="compare.html" class="nav-link">เปรียบเทียบ</a>
        </nav>
      </div>
    </header>
  `;
}

function getFooterHTML() {
  return `
    <footer class="site-footer" role="contentinfo">
      <div class="footer-inner">
        <p><span lang="en">Open Data</span> ไทย — แพลตฟอร์มข้อมูลเปิดภาครัฐ</p>
        <p>พัฒนาตามมาตรฐาน <span lang="en">WCAG 2.2</span> ระดับ <span lang="en">AA</span></p>
      </div>
    </footer>
  `;
}
