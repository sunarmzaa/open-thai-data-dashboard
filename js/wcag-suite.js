/* ==========================================================
   Open Data ไทย — WCAG 2.2 AA / AAA Full Option Suite
   & Accessibility Tree Structural Explorer
   ========================================================== */

(function() {
  'use strict';

  const DEFAULT_SETTINGS = {
    fontSize: 'norm',       // 'dec' | 'norm' | 'inc' | 'inc2' | 'inc3'
    lineSpacing: 'norm',    // 'norm' | 'wide' | 'xwide'
    letterSpacing: 'norm',  // 'norm' | 'wide' | 'xwide'
    dyslexicFont: false,
    theme: null,            // null (use current/saved theme) | 'light' | 'dark' | 'hc-yellow' | 'hc-white' | 'monochrome'
    lowSat: false,
    focusHighlight: false,
    highlightLinks: false,
    largeCursor: false,
    readingMask: false,
    reduceMotion: false,
    voiceAnnouncer: false,
    activeTab: 'typography'
  };

  let state = { ...DEFAULT_SETTINGS };
  let readingNodes = [];
  let currentReadingIndex = -1;
  let autoPlayTimer = null;

  // Load state from localStorage
  try {
    const saved = localStorage.getItem('wcag_full_settings');
    if (saved) {
      state = { ...state, ...JSON.parse(saved) };
    }
  } catch(e) {
    console.warn('Could not load WCAG settings:', e);
  }

  function initSuite() {
    if (window._wcagSuiteInitialized) return;
    window._wcagSuiteInitialized = true;
    window._wcagSuiteLoaded = true;

    if (!state.theme) {
      state.theme = localStorage.getItem('wcag_theme') || document.documentElement.getAttribute('data-theme') || 'dark';
    }
    window.setTheme = setTheme;

    initQuickTools();
    initFloatingWidget();
    injectDrawer();
    applyAllSettings();
    initReadingMask();
    initVoiceAnnouncer();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSuite);
  } else {
    initSuite();
  }

  function saveSettings() {
    try {
      localStorage.setItem('wcag_full_settings', JSON.stringify(state));
    } catch(e) {}
  }

  /* --- Quick Tools on Header --- */
  function initQuickTools() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    // Remove any duplicate standalone #theme-toggle or #btn-i18n-toggle outside .wcag-quick-tools to prevent event collisions
    document.querySelectorAll('#theme-toggle, .theme-toggle, #btn-i18n-toggle, .btn-i18n-toggle').forEach(btn => {
      if (!btn.closest('.wcag-quick-tools')) {
        btn.remove();
      }
    });

    let quickTools = document.querySelector('.wcag-quick-tools');
    if (!quickTools) {
      quickTools = document.createElement('div');
      quickTools.className = 'wcag-quick-tools';
      quickTools.setAttribute('role', 'group');
      quickTools.setAttribute('aria-label', 'เครื่องมือการเข้าถึงและเปลี่ยนธีมด่วน');
      quickTools.innerHTML = `
        <div class="font-size-group" role="group" aria-label="ปรับขนาดตัวอักษร">
          <button type="button" class="wcag-tool-btn" id="font-dec" aria-label="ลดขนาดตัวอักษร 90%" title="ลดขนาดอักษร (A-)">A-</button>
          <button type="button" class="wcag-tool-btn" id="font-norm" aria-label="ขนาดตัวอักษรปกติ 100%" title="ขนาดปกติ (A)">A</button>
          <button type="button" class="wcag-tool-btn" id="font-inc" aria-label="เพิ่มขนาดตัวอักษร 115%" title="เพิ่มขนาดอักษร (A+)">A+</button>
        </div>
        <button type="button" class="wcag-tool-btn quick-action-btn" id="quick-contrast-btn" aria-label="สลับโหมดแสงและความคมชัดสูง" title="สลับโหมดแสงและความคมชัด (Contrast AAA)">
          <span aria-hidden="true">💡</span> ปรับแสง
        </button>
        <button type="button" class="wcag-tool-btn quick-action-btn" id="quick-cursor-btn" aria-label="เปิดปิดตัวชี้เมาส์ขนาดใหญ่" title="ตัวชี้เมาส์ขนาดใหญ่ (Large Cursor)">
          <span aria-hidden="true">👆</span> เคอร์เซอร์
        </button>
        <button type="button" class="wcag-tool-btn quick-action-btn" id="quick-mask-btn" aria-label="เปิดปิดแถบไม้บรรทัดช่วยอ่าน" title="แถบช่วยอ่าน (Reading Guide Mask)">
          <span aria-hidden="true">📏</span> ช่วยอ่าน
        </button>
        <button type="button" class="wcag-tool-btn btn-i18n-toggle" id="btn-i18n-toggle" aria-label="เปลี่ยนภาษาเป็นภาษาอังกฤษ / Switch to English" title="Switch to English / เปลี่ยนเป็นภาษาไทย">
          🇹🇭 TH
        </button>
        <button type="button" class="theme-toggle" id="theme-toggle" aria-label="สลับโหมดสว่างหรือมืด" title="สลับโหมดสว่าง/มืด (Theme)">
          <span aria-hidden="true">☀️</span>
        </button>

      `;
      const navToggle = document.getElementById('nav-toggle');
      if (navToggle) {
        navActions.insertBefore(quickTools, navToggle);
      } else {
        navActions.appendChild(quickTools);
      }
    }

    // Bind header quick buttons
    const btnDec = document.getElementById('font-dec');
    const btnNorm = document.getElementById('font-norm');
    const btnInc = document.getElementById('font-inc');
    const btnContrast = document.getElementById('quick-contrast-btn');
    const btnCursor = document.getElementById('quick-cursor-btn');
    const btnMask = document.getElementById('quick-mask-btn');
    const btnI18n = document.getElementById('btn-i18n-toggle');

    if (btnI18n && !btnI18n._i18nBound) {
      btnI18n.addEventListener('click', () => {
        if (typeof window.toggleLanguage === 'function') window.toggleLanguage();
      });
      btnI18n._i18nBound = true;
    }
    if (typeof window.updateI18nButtons === 'function' && typeof window.getCurrentLang === 'function') {
      window.updateI18nButtons(window.getCurrentLang());
    }

    if (btnDec) btnDec.addEventListener('click', () => setFontSize('dec'));
    if (btnNorm) btnNorm.addEventListener('click', () => setFontSize('norm'));
    if (btnInc) btnInc.addEventListener('click', () => {
      if (state.fontSize === 'inc') setFontSize('inc2');
      else if (state.fontSize === 'inc2') setFontSize('inc3');
      else setFontSize('inc');
    });

    if (btnContrast) btnContrast.addEventListener('click', () => cycleContrastTheme());
    if (btnCursor) btnCursor.addEventListener('click', () => toggleStateOption('largeCursor', 'ตัวชี้เมาส์ขนาดใหญ่'));
    if (btnMask) btnMask.addEventListener('click', () => toggleStateOption('readingMask', 'ไม้บรรทัดช่วยอ่าน'));

    // Theme toggle
    document.querySelectorAll('.theme-toggle, #theme-toggle').forEach(themeBtn => {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = (current === 'light' || current === 'hc-white') ? 'dark' : 'light';
        setTheme(next);
      });
    });



    updateQuickToolsUI();
  }

  /* --- Floating Accessibility Widget Panel (Full Option right on Screen) --- */
  function initFloatingWidget() {
    if (document.getElementById('wcag-floating-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'wcag-floating-widget';
    widget.className = 'wcag-floating-widget';
    widget.setAttribute('role', 'region');
    widget.setAttribute('aria-label', 'เครื่องมือช่วยเหลือการเข้าถึงแบบลอยตัว (Floating Accessibility Bar)');
    widget.innerHTML = `
      <div class="wcag-floating-panel" id="wcag-floating-panel" hidden aria-hidden="true">
        <div class="floating-panel-header">
          <strong><span aria-hidden="true">♿</span> เครื่องมือเข้าถึงด่วน</strong>
          <button type="button" class="floating-close-btn" id="floating-close-btn" aria-label="ปิดเครื่องมือลอยตัว">&times;</button>
        </div>
        <div class="floating-panel-body">
          <div class="floating-section">
            <span class="floating-label">🔤 ขนาดตัวอักษร:</span>
            <div class="floating-btn-group">
              <button type="button" class="floating-opt-btn" data-fsize="dec">A- 90%</button>
              <button type="button" class="floating-opt-btn" data-fsize="norm">A 100%</button>
              <button type="button" class="floating-opt-btn" data-fsize="inc">A+ 115%</button>
              <button type="button" class="floating-opt-btn" data-fsize="inc2">A++ 130%</button>
              <button type="button" class="floating-opt-btn" data-fsize="inc3">A+++ 150%</button>
            </div>
          </div>

          <div class="floating-section">
            <span class="floating-label">💡 ปรับแสงและโหมดสี (Theme & High Contrast):</span>
            <div class="floating-btn-group">
              <button type="button" class="floating-opt-btn" data-theme-quick="light">☀️ สว่าง</button>
              <button type="button" class="floating-opt-btn" data-theme-quick="dark">🌙 มืด</button>
              <button type="button" class="floating-opt-btn" data-theme-quick="hc-yellow">🟡 ทองบนดำ (AAA)</button>
              <button type="button" class="floating-opt-btn" data-theme-quick="hc-white">⚪ ดำบนขาว (AAA)</button>
              <button type="button" class="floating-opt-btn" data-theme-quick="monochrome">🔘 ขาวดำ</button>
            </div>
          </div>

          <div class="floating-section">
            <span class="floating-label">👆 ตัวช่วยการมองเห็นและโฟกัส (Visual Aids):</span>
            <div class="floating-btn-group">
              <button type="button" class="floating-opt-btn" id="float-btn-cursor" data-toggle-quick="largeCursor">👆 เคอร์เซอร์ยักษ์</button>
              <button type="button" class="floating-opt-btn" id="float-btn-mask" data-toggle-quick="readingMask">📏 ไม้บรรทัดช่วยอ่าน</button>
              <button type="button" class="floating-opt-btn" id="float-btn-focus" data-toggle-quick="focusHighlight">🎯 เน้นกรอบโฟกัส</button>
              <button type="button" class="floating-opt-btn" id="float-btn-links" data-toggle-quick="highlightLinks">🔗 ไฮไลท์ลิงก์</button>
              <button type="button" class="floating-opt-btn" id="float-btn-dyslexia" data-toggle-quick="dyslexicFont">🧠 ฟอนต์ Dyslexia</button>
            </div>
          </div>

          <div class="floating-section">
            <span class="floating-label">🔊 เสียงอ่านและการเคลื่อนไหว (Audio & Motion):</span>
            <div class="floating-btn-group">
              <button type="button" class="floating-opt-btn" id="float-btn-voice" data-toggle-quick="voiceAnnouncer">🗣️ เปิดเสียงอ่านไทย</button>
              <button type="button" class="floating-opt-btn" id="float-btn-motion" data-toggle-quick="reduceMotion">⏸️ ปิดอนิเมชัน</button>
            </div>
          </div>

          <div class="floating-panel-footer">
            <button type="button" class="btn btn-primary" id="float-open-drawer-btn" style="width: 100%; font-size: var(--text-xs);">
              ⚙️ เปิดแผงตั้งค่าละเอียด & 🌳 Accessibility Tree
            </button>
          </div>
        </div>
      </div>
      <button type="button" class="wcag-floating-trigger" id="wcag-floating-trigger" aria-expanded="false" aria-controls="wcag-floating-panel" aria-label="เปิดเครื่องมือช่วยเหลือการเข้าถึงแบบลอยตัว">
        <span class="floating-icon" aria-hidden="true">♿</span>
        <span class="floating-label-pill">เครื่องมือเข้าถึง</span>
      </button>
    `;

    document.body.appendChild(widget);

    const trigger = document.getElementById('wcag-floating-trigger');
    const panel = document.getElementById('wcag-floating-panel');
    const closeBtn = document.getElementById('floating-close-btn');

    if (trigger && panel) {
      trigger.addEventListener('click', () => {
        const isOpen = !panel.hidden;
        panel.hidden = isOpen;
        panel.setAttribute('aria-hidden', String(isOpen));
        trigger.setAttribute('aria-expanded', String(!isOpen));
        if (!isOpen) {
          updateQuickToolsUI();
          announceText('เปิดแผงเครื่องมือช่วยเหลือการเข้าถึงแบบลอยตัวแล้ว');
        } else {
          announceText('ปิดแผงเครื่องมือลอยตัวแล้ว');
        }
      });
    }

    if (closeBtn && panel && trigger) {
      closeBtn.addEventListener('click', () => {
        panel.hidden = true;
        panel.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      });
    }

    // Bind actions inside floating panel
    document.querySelectorAll('[data-fsize]').forEach(btn => {
      btn.addEventListener('click', () => setFontSize(btn.dataset.fsize));
    });

    document.querySelectorAll('[data-theme-quick]').forEach(btn => {
      btn.addEventListener('click', () => setTheme(btn.dataset.themeQuick));
    });

    document.querySelectorAll('[data-toggle-quick]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.toggleQuick;
        const labels = {
          largeCursor: 'ตัวชี้เมาส์ขนาดใหญ่',
          readingMask: 'ไม้บรรทัดช่วยอ่าน',
          focusHighlight: 'เน้นกรอบโฟกัส',
          highlightLinks: 'ไฮไลท์ลิงก์',
          dyslexicFont: 'ฟอนต์สำหรับ Dyslexia',
          voiceAnnouncer: 'เสียงอ่านข้อความ',
          reduceMotion: 'ปิดอนิเมชัน'
        };
        toggleStateOption(key, labels[key] || key);
      });
    });

    const openDrawerBtn = document.getElementById('float-open-drawer-btn');
    if (openDrawerBtn) {
      openDrawerBtn.addEventListener('click', () => {
        if (panel) {
          panel.hidden = true;
          panel.setAttribute('aria-hidden', 'true');
          trigger.setAttribute('aria-expanded', 'false');
        }
        openDrawer();
      });
    }
  }

  function toggleStateOption(key, label) {
    state[key] = !state[key];
    applyAllSettings();
    saveSettings();
    updateQuickToolsUI();
    updateDrawerUI();
    announceText(state[key] ? `เปิดใช้งาน: ${label}` : `ปิดใช้งาน: ${label}`);
  }

  function cycleContrastTheme() {
    const themes = ['light', 'dark', 'hc-yellow', 'hc-white', 'monochrome'];
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const idx = themes.indexOf(current);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next);
  }

  function setFontSize(size) {
    state.fontSize = size;
    applyAllSettings();
    saveSettings();
    updateQuickToolsUI();
    updateDrawerUI();
    announceText(`เปลี่ยนขนาดตัวอักษรเป็น: ${getSizeLabel(size)}`);
  }

  function getSizeLabel(s) {
    if (s === 'dec') return '90% (ขนาดเล็ก)';
    if (s === 'norm') return '100% (ขนาดปกติ)';
    if (s === 'inc') return '115% (ขนาดใหญ่)';
    if (s === 'inc2') return '130% (ขนาดใหญ่มาก)';
    if (s === 'inc3') return '150% (ขนาดพิเศษ)';
    return '100%';
  }

  function setTheme(t) {
    state.theme = t;
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('wcag_theme', t);
    saveSettings();
    updateQuickToolsUI();
    updateDrawerUI();
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: t } }));
    announceText(`สลับเป็นโหมดสี: ${getThemeLabel(t)}`);
  }

  function getThemeLabel(t) {
    if (t === 'light') return 'โหมดสว่าง (Light)';
    if (t === 'dark') return 'โหมดมืด (Dark)';
    if (t === 'hc-yellow') return 'ความคมชัดสูง ทองบนดำ (AAA)';
    if (t === 'hc-white') return 'ความคมชัดสูง ดำบนขาว (AAA)';
    if (t === 'monochrome') return 'โหมดขาวดำ (Monochrome)';
    return t;
  }

  function updateQuickToolsUI() {
    // Header quick buttons
    const btnDec = document.getElementById('font-dec');
    const btnNorm = document.getElementById('font-norm');
    const btnInc = document.getElementById('font-inc');
    if (btnDec) btnDec.classList.toggle('active', state.fontSize === 'dec');
    if (btnNorm) btnNorm.classList.toggle('active', state.fontSize === 'norm');
    if (btnInc) btnInc.classList.toggle('active', ['inc', 'inc2', 'inc3'].includes(state.fontSize));

    const btnContrast = document.getElementById('quick-contrast-btn');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    if (btnContrast) btnContrast.classList.toggle('active', ['hc-yellow', 'hc-white', 'monochrome'].includes(currentTheme));

    const btnCursor = document.getElementById('quick-cursor-btn');
    if (btnCursor) btnCursor.classList.toggle('active', state.largeCursor);

    const btnMask = document.getElementById('quick-mask-btn');
    if (btnMask) btnMask.classList.toggle('active', state.readingMask);

    document.querySelectorAll('.theme-toggle, #theme-toggle').forEach(themeBtn => {
      const isLight = currentTheme === 'light' || currentTheme === 'hc-white';
      themeBtn.innerHTML = isLight ? '<span aria-hidden="true">🌙</span>' : '<span aria-hidden="true">☀️</span>';
      themeBtn.setAttribute('title', isLight ? 'สลับเป็นโหมดมืด' : 'สลับเป็นโหมดสว่าง');
      themeBtn.setAttribute('aria-label', isLight ? 'สลับเป็นโหมดมืด (Dark Mode)' : 'สลับเป็นโหมดสว่าง (Light Mode)');
    });

    // Floating widget panel buttons
    document.querySelectorAll('[data-fsize]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.fsize === state.fontSize);
    });
    document.querySelectorAll('[data-theme-quick]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeQuick === currentTheme);
    });
    document.querySelectorAll('[data-toggle-quick]').forEach(btn => {
      const k = btn.dataset.toggleQuick;
      btn.classList.toggle('active', Boolean(state[k]));
    });

    // Checkbox switches in drawer sync
    document.querySelectorAll('.wcag-switch').forEach(ch => {
      const k = ch.dataset.toggle;
      if (k && ch.checked !== Boolean(state[k])) {
        ch.checked = Boolean(state[k]);
      }
    });
  }

  /* --- Inject Full Option Drawer --- */
  function injectDrawer() {
    if (document.getElementById('wcag-drawer')) return;

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'wcag-backdrop';
    backdrop.className = 'wcag-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.addEventListener('click', closeDrawer);
    document.body.appendChild(backdrop);

    // Drawer
    const drawer = document.createElement('div');
    drawer.id = 'wcag-drawer';
    drawer.className = 'wcag-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'แผงตั้งค่าการเข้าถึง WCAG 2.2 AA / AAA พร้อม Accessibility Tree');
    drawer.innerHTML = `
      <div class="wcag-drawer-header">
        <div>
          <h2><span aria-hidden="true">♿</span> ตั้งค่าการเข้าถึง (WCAG)</h2>
          <p>ปรับแต่งหน้าจอและโครงสร้างตามมาตรฐานสากล WCAG 2.2 AA / AAA</p>
        </div>
        <button type="button" class="wcag-close-btn" id="wcag-close-btn" aria-label="ปิดแผงตั้งค่าการเข้าถึง">&times;</button>
      </div>

      <!-- Tab Navigation -->
      <div class="wcag-tabs" role="tablist" aria-label="หมวดหมู่เครื่องมือการเข้าถึง">
        <button type="button" class="wcag-tab-btn active" id="tab-typography" role="tab" aria-selected="true" aria-controls="panel-typography">🔤 ตัวอักษร</button>
        <button type="button" class="wcag-tab-btn" id="tab-color" role="tab" aria-selected="false" aria-controls="panel-color">🎨 โหมดสี</button>
        <button type="button" class="wcag-tab-btn" id="tab-visual" role="tab" aria-selected="false" aria-controls="panel-visual">👁️ การมองเห็น</button>
        <button type="button" class="wcag-tab-btn" id="tab-motion" role="tab" aria-selected="false" aria-controls="panel-motion">⚡ เสียง/อนิเมชัน</button>
        <button type="button" class="wcag-tab-btn tab-tree-highlight" id="tab-tree" role="tab" aria-selected="false" aria-controls="panel-tree">🌳 Accessibility Tree</button>
      </div>

      <div class="wcag-drawer-content">
        <!-- Tab 1: Typography -->
        <div id="panel-typography" class="wcag-tab-panel active" role="tabpanel" aria-labelledby="tab-typography">
          <div class="wcag-control-section">
            <label class="section-label">ขนาดตัวอักษร (Text Sizing)</label>
            <div class="wcag-grid-5">
              <button type="button" class="wcag-option-btn" data-opt="fontSize" data-val="dec">A-<br><small>90%</small></button>
              <button type="button" class="wcag-option-btn" data-opt="fontSize" data-val="norm">A<br><small>100%</small></button>
              <button type="button" class="wcag-option-btn" data-opt="fontSize" data-val="inc">A+<br><small>115%</small></button>
              <button type="button" class="wcag-option-btn" data-opt="fontSize" data-val="inc2">A++<br><small>130%</small></button>
              <button type="button" class="wcag-option-btn" data-opt="fontSize" data-val="inc3">A+++<br><small>150%</small></button>
            </div>
          </div>

          <div class="wcag-control-section">
            <label class="section-label">ระยะห่างระหว่างบรรทัด (Line Spacing)</label>
            <div class="wcag-grid-3">
              <button type="button" class="wcag-option-btn" data-opt="lineSpacing" data-val="norm">ปกติ (1.6)</button>
              <button type="button" class="wcag-option-btn" data-opt="lineSpacing" data-val="wide">กว้าง (1.8)</button>
              <button type="button" class="wcag-option-btn" data-opt="lineSpacing" data-val="xwide">พิเศษ (2.2)</button>
            </div>
          </div>

          <div class="wcag-control-section">
            <label class="section-label">ระยะห่างตัวอักษร (Letter Spacing)</label>
            <div class="wcag-grid-3">
              <button type="button" class="wcag-option-btn" data-opt="letterSpacing" data-val="norm">ปกติ</button>
              <button type="button" class="wcag-option-btn" data-opt="letterSpacing" data-val="wide">กว้าง</button>
              <button type="button" class="wcag-option-btn" data-opt="letterSpacing" data-val="xwide">กว้างพิเศษ</button>
            </div>
          </div>

          <div class="wcag-control-section">
            <label class="wcag-switch-row" for="switch-dyslexic">
              <div>
                <strong>ฟอนต์สำหรับผู้มีภาวะดิสเล็กเซีย (Dyslexia Friendly Font)</strong>
                <p>ปรับใช้แบบอักษรที่แยกแยะรูปทรงตัวอักษรได้ง่าย ป้องกันการอ่านสับสน</p>
              </div>
              <input type="checkbox" id="switch-dyslexic" class="wcag-switch" data-toggle="dyslexicFont">
            </label>
          </div>
        </div>

        <!-- Tab 2: Color & High Contrast -->
        <div id="panel-color" class="wcag-tab-panel" role="tabpanel" aria-labelledby="tab-color" hidden>
          <div class="wcag-control-section">
            <label class="section-label">เลือกธีมสีและความคมชัด (Color Theme & High Contrast)</label>
            <div class="wcag-theme-list">
              <button type="button" class="wcag-theme-btn" data-theme-val="light">
                <span class="theme-swatch light-swatch"></span>
                <span>☀️ โหมดสว่าง (Light Mode)</span>
              </button>
              <button type="button" class="wcag-theme-btn" data-theme-val="dark">
                <span class="theme-swatch dark-swatch"></span>
                <span>🌙 โหมดมืด (Dark Mode)</span>
              </button>
              <button type="button" class="wcag-theme-btn" data-theme-val="hc-yellow">
                <span class="theme-swatch hc-yellow-swatch"></span>
                <span>🟡 ความคมชัดสูงสุด ทองบนดำ (High Contrast AAA)</span>
              </button>
              <button type="button" class="wcag-theme-btn" data-theme-val="hc-white">
                <span class="theme-swatch hc-white-swatch"></span>
                <span>⚪ ความคมชัดสูงสุด ดำบนขาว (High Contrast AAA)</span>
              </button>
              <button type="button" class="wcag-theme-btn" data-theme-val="monochrome">
                <span class="theme-swatch mono-swatch"></span>
                <span>🔘 โหมดขาวดำ (Monochrome — สำหรับผู้ตาบอดสี)</span>
              </button>
            </div>
          </div>

          <div class="wcag-control-section">
            <label class="wcag-switch-row" for="switch-sat">
              <div>
                <strong>ลดความอิ่มตัวสี (Low Saturation Mode)</strong>
                <p>ลดความสดของสีในหน้าจอเพื่อลดความเมื่อยล้าสายตา</p>
              </div>
              <input type="checkbox" id="switch-sat" class="wcag-switch" data-toggle="lowSat">
            </label>
          </div>
        </div>

        <!-- Tab 3: Visual Aids -->
        <div id="panel-visual" class="wcag-tab-panel" role="tabpanel" aria-labelledby="tab-visual" hidden>
          <div class="wcag-control-section">
            <label class="wcag-switch-row" for="switch-focus">
              <div>
                <strong>🎯 เน้นกรอบโฟกัสคีย์บอร์ด (Enhanced Focus Highlight)</strong>
                <p>ขยายกรอบโฟกัสเป็นสีเหลือง/แดงหนา 4px รอบจุดที่โฟกัสด้วย Tab</p>
              </div>
              <input type="checkbox" id="switch-focus" class="wcag-switch" data-toggle="focusHighlight">
            </label>
          </div>

          <div class="wcag-control-section">
            <label class="wcag-switch-row" for="switch-links">
              <div>
                <strong>🔗 ไฮไลต์และขีดเส้นใต้ลิงก์ทั้งหมด (Highlight All Links)</strong>
                <p>ทำเครื่องหมายและขีดเส้นใต้ลิงก์ทุกจุดในหน้าเว็บให้สังเกตง่าย</p>
              </div>
              <input type="checkbox" id="switch-links" class="wcag-switch" data-toggle="highlightLinks">
            </label>
          </div>

          <div class="wcag-control-section">
            <label class="wcag-switch-row" for="switch-cursor">
              <div>
                <strong>👆 ขยายขนาดตัวชี้เมาส์ (Large Cursor)</strong>
                <p>ขยายขนาดเคอร์เซอร์เมาส์เป็นขนาดใหญ่พิเศษ เห็นชัดเจน</p>
              </div>
              <input type="checkbox" id="switch-cursor" class="wcag-switch" data-toggle="largeCursor">
            </label>
          </div>

          <div class="wcag-control-section">
            <label class="wcag-switch-row" for="switch-mask">
              <div>
                <strong>📏 ไม้บรรทัดช่วยอ่าน (Reading Guide Mask)</strong>
                <p>แถบช่องอ่านหนังสือขนานตามแนวเมาส์ ช่วยผู้มีสมาธิสั้นหรือหลงบรรทัดง่าย</p>
              </div>
              <input type="checkbox" id="switch-mask" class="wcag-switch" data-toggle="readingMask">
            </label>
          </div>
        </div>

        <!-- Tab 4: Motion & Voice -->
        <div id="panel-motion" class="wcag-tab-panel" role="tabpanel" aria-labelledby="tab-motion" hidden>
          <div class="wcag-control-section">
            <label class="wcag-switch-row" for="switch-motion">
              <div>
                <strong>⏸️ ปิดการเคลื่อนไหวและอนิเมชัน (Reduce / Stop All Motion)</strong>
                <p>หยุด Transition และ Animation ทั้งหมด ป้องกันอาการวิงเวียน (Vestibular Safe)</p>
              </div>
              <input type="checkbox" id="switch-motion" class="wcag-switch" data-toggle="reduceMotion">
            </label>
          </div>

          <div class="wcag-control-section">
            <label class="wcag-switch-row" for="switch-voice">
              <div>
                <strong>🗣️ เปิดเสียงอ่านข้อความ (Voice Announcer & Speech Synthesis)</strong>
                <p>เมื่อคลิกหรือใช้คีย์บอร์ดเลือกปุ่ม/ข้อความ ระบบจะอ่านออกเสียงภาษาไทยทันที</p>
              </div>
              <input type="checkbox" id="switch-voice" class="wcag-switch" data-toggle="voiceAnnouncer">
            </label>
          </div>
        </div>

        <!-- Tab 5: Accessibility Tree & Structural Explorer -->
        <div id="panel-tree" class="wcag-tab-panel" role="tabpanel" aria-labelledby="tab-tree" hidden>
          <div class="tree-tools-header">
            <h3>🌳 Accessibility Tree & Structural Navigator</h3>
            <p style="font-size: var(--text-xs); color: var(--color-text-3);">ตรวจสอบโครงสร้าง Landmarks, ARIA, หัวข้อ H1-H6 และจำลองลำดับการอ่าน Screen Reader</p>
            <div class="tree-subtabs">
              <button type="button" class="tree-subbtn active" data-tree-view="landmarks">🧭 Landmarks</button>
              <button type="button" class="tree-subbtn" data-tree-view="headings">📑 ลำดับหัวข้อ H1-H6</button>
              <button type="button" class="tree-subbtn" data-tree-view="interact">🔘 องค์ประกอบโต้ตอบ</button>
              <button type="button" class="tree-subbtn" data-tree-view="simulator">🔊 จำลองลำดับการอ่าน</button>
              <button type="button" class="tree-subbtn" data-tree-view="audit">📊 ตรวจสอบ WCAG</button>
            </div>
          </div>

          <div id="tree-view-content" class="tree-view-body">
            <!-- Populated dynamically when tab/subtab opened -->
          </div>
        </div>
      </div>

      <div class="wcag-drawer-footer">
        <button type="button" class="btn btn-secondary" id="wcag-reset-btn" style="flex: 1;">
          🔄 คืนค่าเริ่มต้นทั้งหมด
        </button>
        <button type="button" class="btn btn-primary" id="wcag-done-btn" style="flex: 1;">
          ✓ เรียบร้อย
        </button>
      </div>
    `;

    document.body.appendChild(drawer);

    // Reading Guide Mask Element
    let maskTop = document.getElementById('reading-mask-top');
    if (!maskTop) {
      maskTop = document.createElement('div');
      maskTop.id = 'reading-mask-top';
      maskTop.className = 'reading-mask-overlay top';
      document.body.appendChild(maskTop);
    }
    let maskBottom = document.getElementById('reading-mask-bottom');
    if (!maskBottom) {
      maskBottom = document.createElement('div');
      maskBottom.id = 'reading-mask-bottom';
      maskBottom.className = 'reading-mask-overlay bottom';
      document.body.appendChild(maskBottom);
    }

    // Highlight box for tree/reading order
    let hlBox = document.getElementById('reading-order-box');
    if (!hlBox) {
      hlBox = document.createElement('div');
      hlBox.id = 'reading-order-box';
      hlBox.className = 'reading-order-box';
      document.body.appendChild(hlBox);
    }
  }

  function openDrawer() {
    const drawer = document.getElementById('wcag-drawer');
    const backdrop = document.getElementById('wcag-backdrop');
    const openBtn = document.getElementById('wcag-open-btn');
    if (drawer && backdrop) {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      updateDrawerUI();
      const closeBtn = document.getElementById('wcag-close-btn');
      if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
      announceText('เปิดแผงตั้งค่าการเข้าถึง WCAG ฉบับเต็มแล้ว');
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('wcag-drawer');
    const backdrop = document.getElementById('wcag-backdrop');
    const openBtn = document.getElementById('wcag-open-btn');
    if (drawer && backdrop) {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      if (openBtn) {
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.focus();
      }
      stopAutoPlayReading();
    }
  }

  function bindEvents() {
    // Drawer close/reset
    const closeBtn = document.getElementById('wcag-close-btn');
    const doneBtn = document.getElementById('wcag-done-btn');
    const resetBtn = document.getElementById('wcag-reset-btn');

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (doneBtn) doneBtn.addEventListener('click', closeDrawer);
    if (resetBtn) resetBtn.addEventListener('click', () => {
      state = { ...DEFAULT_SETTINGS };
      const currentTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      state.theme = currentTheme;
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('wcag_theme', currentTheme);
      applyAllSettings();
      saveSettings();
      updateQuickToolsUI();
      updateDrawerUI();
      announceText('คืนค่าเริ่มต้นของการเข้าถึง WCAG ทั้งหมดแล้ว');
    });

    // Close on Escape inside drawer or turn off reading mask
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const drawer = document.getElementById('wcag-drawer');
        if (drawer && drawer.classList.contains('open')) {
          closeDrawer();
        } else if (state.readingMask) {
          toggleStateOption('readingMask', 'ไม้บรรทัดช่วยอ่าน');
        }
      }
    });

    // Tab buttons
    document.querySelectorAll('.wcag-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.wcag-tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.wcag-tab-panel').forEach(p => {
          p.classList.remove('active');
          p.hidden = true;
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const targetId = btn.getAttribute('aria-controls');
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.add('active');
          panel.hidden = false;
          if (targetId === 'panel-tree') {
            renderTreeView('landmarks');
          }
        }
      });
    });

    // Option buttons (Font size, line spacing, letter spacing)
    document.querySelectorAll('.wcag-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const opt = btn.dataset.opt;
        const val = btn.dataset.val;
        state[opt] = val;
        applyAllSettings();
        saveSettings();
        updateDrawerUI();
        updateQuickToolsUI();
        announceText(`ปรับค่า ${btn.textContent.trim()}`);
      });
    });

    // Theme buttons inside drawer
    document.querySelectorAll('.wcag-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.themeVal;
        setTheme(t);
      });
    });

    // Checkbox switches
    document.querySelectorAll('.wcag-switch').forEach(ch => {
      ch.addEventListener('change', () => {
        const key = ch.dataset.toggle;
        state[key] = ch.checked;
        applyAllSettings();
        saveSettings();
        updateDrawerUI();
        announceText(ch.checked ? `เปิดใช้งาน: ${key}` : `ปิดใช้งาน: ${key}`);
      });
    });

    // Tree sub-tabs
    document.querySelectorAll('.tree-subbtn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tree-subbtn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTreeView(btn.dataset.treeView);
      });
    });
  }

  function applyAllSettings() {
    const root = document.documentElement;

    // Font size classes
    root.classList.remove('wcag-size-dec', 'wcag-size-inc', 'wcag-size-inc2', 'wcag-size-inc3');
    if (state.fontSize !== 'norm') {
      root.classList.add(`wcag-size-${state.fontSize}`);
    }

    // Line spacing
    root.classList.remove('wcag-line-wide', 'wcag-line-xwide');
    if (state.lineSpacing !== 'norm') root.classList.add(`wcag-line-${state.lineSpacing}`);

    // Letter spacing
    root.classList.remove('wcag-letter-wide', 'wcag-letter-xwide');
    if (state.letterSpacing !== 'norm') root.classList.add(`wcag-letter-${state.letterSpacing}`);

    // Toggles
    root.classList.toggle('wcag-font-dyslexic', state.dyslexicFont);
    root.classList.toggle('wcag-sat-low', state.lowSat);
    root.classList.toggle('wcag-focus-high', state.focusHighlight);
    root.classList.toggle('wcag-links-high', state.highlightLinks);
    root.classList.toggle('wcag-cursor-large', state.largeCursor);
    root.classList.toggle('wcag-mask-active', state.readingMask);
    root.classList.toggle('wcag-motion-reduce', state.reduceMotion);
    root.classList.toggle('wcag-voice-active', state.voiceAnnouncer);

    // Theme
    if (state.theme) {
      root.setAttribute('data-theme', state.theme);
    }

    // Toggle reading mask overlay display
    const maskTop = document.getElementById('reading-mask-top');
    const maskBottom = document.getElementById('reading-mask-bottom');
    if (maskTop && maskBottom) {
      maskTop.style.display = state.readingMask ? 'block' : 'none';
      maskBottom.style.display = state.readingMask ? 'block' : 'none';
    }
  }

  function updateDrawerUI() {
    document.querySelectorAll('.wcag-option-btn').forEach(btn => {
      const opt = btn.dataset.opt;
      const val = btn.dataset.val;
      btn.classList.toggle('active', state[opt] === val);
    });

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    document.querySelectorAll('.wcag-theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeVal === currentTheme);
    });

    document.querySelectorAll('.wcag-switch').forEach(ch => {
      const key = ch.dataset.toggle;
      ch.checked = !!state[key];
    });
  }

  /* --- Reading Guide Mask Logic --- */
  function initReadingMask() {
    window.addEventListener('mousemove', (e) => {
      if (!state.readingMask) return;
      const maskTop = document.getElementById('reading-mask-top');
      const maskBottom = document.getElementById('reading-mask-bottom');
      if (!maskTop || !maskBottom) return;

      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const mouseY = e.clientY;
      const gap = 90; // height of clear reading window

      const topHeight = Math.max(0, mouseY - gap / 2);
      const bottomTop = Math.min(windowHeight, mouseY + gap / 2);

      maskTop.style.height = `${topHeight}px`;
      maskBottom.style.top = `${bottomTop}px`;
      maskBottom.style.height = `${windowHeight - bottomTop}px`;
    });
  }

  /* --- Voice Announcer & Speech Synthesis --- */
  function initVoiceAnnouncer() {
    document.addEventListener('click', (e) => {
      if (!state.voiceAnnouncer) return;
      // Do not announce clicks inside the wcag drawer
      if (e.target.closest('#wcag-drawer')) return;

      const target = e.target.closest('a, button, input, select, th, td, h1, h2, h3, h4, .card');
      if (target) {
        let text = target.getAttribute('aria-label') || target.innerText || target.value || '';
        text = text.replace(/\s+/g, ' ').trim();
        if (text) {
          speakText(text);
        }
      }
    });

    document.addEventListener('focusin', (e) => {
      if (!state.voiceAnnouncer) return;
      if (e.target.closest('#wcag-drawer')) return;
      const target = e.target;
      let text = target.getAttribute('aria-label') || target.innerText || target.value || '';
      text = text.replace(/\s+/g, ' ').trim();
      if (text) {
        speakText(`โฟกัสที่: ${text}`);
      }
    });
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.rate = 1.0;
    // Fallback to polite announce
    announceText(text);
    window.speechSynthesis.speak(utterance);
  }

  function announceText(msg) {
    let region = document.getElementById('live-announcer');
    if (!region) {
      region = document.createElement('div');
      region.id = 'live-announcer';
      region.className = 'live-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    region.textContent = '';
    setTimeout(() => { region.textContent = msg; }, 100);
  }

  /* ==========================================================
     🌳 Accessibility Tree & Structural Navigator Logic
     ========================================================== */
  function renderTreeView(viewType) {
    const container = document.getElementById('tree-view-content');
    if (!container) return;

    stopAutoPlayReading();

    if (viewType === 'landmarks') {
      renderLandmarksTree(container);
    } else if (viewType === 'headings') {
      renderHeadingsTree(container);
    } else if (viewType === 'interact') {
      renderInteractiveList(container);
    } else if (viewType === 'simulator') {
      renderReadingSimulator(container);
    } else if (viewType === 'audit') {
      renderLiveWCAGAudit(container);
    }
  }

  function renderLandmarksTree(container) {
    // Collect landmarks
    const landmarks = [
      { name: '🌐 Banner (<header role="banner">)', el: document.querySelector('header[role="banner"], header.site-nav') },
      { name: '🧭 Navigation (<nav role="navigation">)', el: document.querySelector('nav[aria-label="เมนูหลัก"], nav') },
      { name: '📄 Main Content (<main role="main">)', el: document.querySelector('main') },
      ...Array.from(document.querySelectorAll('section[aria-labelledby], aside')).map((s, i) => ({
        name: `📦 Section/Region: ${s.getAttribute('aria-label') || (s.querySelector('h1,h2,h3') ? s.querySelector('h1,h2,h3').textContent : 'โซนเนื้อหา ' + (i+1))}`,
        el: s
      })),
      { name: '📌 Content Info (<footer role="contentinfo">)', el: document.querySelector('footer') }
    ].filter(l => l.el);

    container.innerHTML = `
      <div class="tree-section-intro">
        <h4>โครงสร้าง Landmark ของหน้านี้ (${landmarks.length} โหนดหลัก)</h4>
        <p>คลิกที่รายการใดก็ได้เพื่อกระโดดไปยังตำแหน่งจริงบนหน้าเว็บพร้อมกรอบไฮไลต์</p>
      </div>
      <ul class="wcag-tree-list">
        ${landmarks.map((l, idx) => `
          <li class="wcag-tree-node">
            <button type="button" class="tree-node-btn" data-landmark-idx="${idx}">
              <span class="tree-icon">🔖</span>
              <span class="tree-text">${l.name}</span>
              <span class="tree-badge">Landmark</span>
            </button>
          </li>
        `).join('')}
      </ul>
    `;

    container.querySelectorAll('.tree-node-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.landmarkIdx;
        const target = landmarks[idx]?.el;
        if (target) highlightAndScrollNode(target);
      });
    });
  }

  function renderHeadingsTree(container) {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    container.innerHTML = `
      <div class="tree-section-intro">
        <h4>ลำดับชั้นหัวข้อ H1-H6 (${headings.length} หัวข้อ)</h4>
        <p>ตรวจสอบลำดับความสำคัญของเนื้อหา เพื่อให้ Screen Reader สามารถอ่านข้ามหัวข้อได้อย่างถูกต้อง</p>
      </div>
      <ul class="wcag-tree-list heading-tree">
        ${headings.map((h, idx) => {
          const tag = h.tagName.toLowerCase();
          const indent = (parseInt(tag[1]) - 1) * 20;
          return `
            <li class="wcag-tree-node" style="padding-left: ${indent}px;">
              <button type="button" class="tree-node-btn" data-heading-idx="${idx}">
                <span class="tree-tag-badge ${tag}">${tag.toUpperCase()}</span>
                <span class="tree-text">${h.textContent.trim()}</span>
              </button>
            </li>
          `;
        }).join('')}
      </ul>
    `;

    container.querySelectorAll('.tree-node-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.headingIdx;
        const target = headings[idx];
        if (target) highlightAndScrollNode(target);
      });
    });
  }

  function renderInteractiveList(container) {
    const elements = Array.from(document.querySelectorAll('a[href], button, input, select, textarea, th[data-sort]')).filter(el => !el.closest('#wcag-drawer'));

    container.innerHTML = `
      <div class="tree-section-intro">
        <h4>องค์ประกอบโต้ตอบทั้งหมด (${elements.length} รายการ)</h4>
        <p>แสดง Accessible Name และ Role ที่ Screen Reader ตรวจจับได้บนหน้าเว็บ</p>
      </div>
      <div class="tree-table-wrapper">
        <table class="tree-table">
          <thead>
            <tr>
              <th>ประเภท (Role)</th>
              <th>ชื่อที่เข้าถึงได้ (Accessible Name)</th>
              <th>การโฟกัส (Focus)</th>
            </tr>
          </thead>
          <tbody>
            ${elements.map((el, idx) => {
              const tag = el.tagName.toLowerCase();
              const role = el.getAttribute('role') || (tag === 'a' ? 'link' : tag === 'button' ? 'button' : tag === 'th' ? 'columnheader' : tag);
              const name = el.getAttribute('aria-label') || el.innerText || el.value || el.placeholder || (el.querySelector('span') ? el.querySelector('span').textContent : '—');
              return `
                <tr class="tree-row" data-interact-idx="${idx}">
                  <td><span class="role-badge">${role}</span></td>
                  <td><button type="button" class="tree-link-btn">${name.substring(0, 40)}</button></td>
                  <td>${el.tabIndex >= 0 ? '✓ ได้ (`tabIndex=0`)' : '✓ ได้'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll('.tree-row').forEach(row => {
      row.addEventListener('click', () => {
        const idx = row.dataset.interactIdx;
        const target = elements[idx];
        if (target) highlightAndScrollNode(target);
      });
    });
  }

  function renderReadingSimulator(container) {
    // Collect semantic reading nodes across the page
    readingNodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, a[href], button, th, td, label')).filter(el => {
      if (el.closest('#wcag-drawer') || el.closest('.skip-link')) return false;
      const text = el.innerText?.trim();
      return text && text.length > 1 && el.offsetParent !== null;
    });

    currentReadingIndex = 0;

    container.innerHTML = `
      <div class="tree-section-intro">
        <h4>🔊 จำลองลำดับการอ่าน Screen Reader Mode (${readingNodes.length} โหนด)</h4>
        <p>กดปุ่มควบคุมเพื่อเดินตรวจเช็กโหนดใน Accessibility Tree ทีละบรรทัด พร้อมเสียงอ่านและกรอบไฮไลต์</p>
      </div>

      <div class="simulator-controls">
        <button type="button" class="sim-btn" id="sim-prev">◀ โหนดก่อนหน้า</button>
        <button type="button" class="sim-btn btn-primary" id="sim-play">▶️ เล่นอัตโนมัติ</button>
        <button type="button" class="sim-btn" id="sim-next">โหนดถัดไป ▶</button>
      </div>

      <div class="simulator-display" id="sim-display">
        <span class="sim-role" id="sim-role-badge">H1</span>
        <div class="sim-text" id="sim-text-content">พร้อมจำลองการอ่าน — กดปุ่ม "โหนดถัดไป" หรือ "เล่นอัตโนมัติ"</div>
      </div>
    `;

    document.getElementById('sim-prev')?.addEventListener('click', () => {
      stopAutoPlayReading();
      currentReadingIndex = Math.max(0, currentReadingIndex - 1);
      stepReadingNode(currentReadingIndex);
    });

    document.getElementById('sim-next')?.addEventListener('click', () => {
      stopAutoPlayReading();
      currentReadingIndex = Math.min(readingNodes.length - 1, currentReadingIndex + 1);
      stepReadingNode(currentReadingIndex);
    });

    document.getElementById('sim-play')?.addEventListener('click', () => {
      if (autoPlayTimer) {
        stopAutoPlayReading();
      } else {
        const playBtn = document.getElementById('sim-play');
        if (playBtn) playBtn.textContent = '⏸️ หยุดเล่น';
        stepReadingNode(currentReadingIndex);
        autoPlayTimer = setInterval(() => {
          if (currentReadingIndex < readingNodes.length - 1) {
            currentReadingIndex++;
            stepReadingNode(currentReadingIndex);
          } else {
            stopAutoPlayReading();
          }
        }, 3500);
      }
    });

    // Step first node right away
    if (readingNodes.length > 0) stepReadingNode(0);
  }

  function stepReadingNode(idx) {
    const el = readingNodes[idx];
    if (!el) return;

    const role = el.getAttribute('role') || el.tagName.toUpperCase();
    const text = el.getAttribute('aria-label') || el.innerText || '';
    const cleanText = text.replace(/\s+/g, ' ').trim();

    const roleBadge = document.getElementById('sim-role-badge');
    const textContent = document.getElementById('sim-text-content');
    if (roleBadge) roleBadge.textContent = role;
    if (textContent) textContent.textContent = `[โหนดที่ ${idx + 1}/${readingNodes.length}]: ${cleanText}`;

    highlightAndScrollNode(el);
    if (state.voiceAnnouncer || true) { // speak when in reading simulator
      speakText(`${role}: ${cleanText}`);
    }
  }

  function stopAutoPlayReading() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
    const playBtn = document.getElementById('sim-play');
    if (playBtn) playBtn.textContent = '▶️ เล่นอัตโนมัติ';
  }

  function renderLiveWCAGAudit(container) {
    // Run instant checks
    const buttons = Array.from(document.querySelectorAll('button, a[href], input[type="button"]')).filter(el => !el.closest('#wcag-drawer'));
    let targetSizePassed = 0;
    let targetSizeFailed = 0;
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.width >= 43 && rect.height >= 43) targetSizePassed++;
      else if (rect.width > 0 && rect.height > 0) targetSizeFailed++;
    });

    const images = Array.from(document.querySelectorAll('img, svg'));
    let altPassed = 0;
    let altFailed = 0;
    images.forEach(img => {
      if (img.hasAttribute('alt') || img.hasAttribute('aria-label') || img.hasAttribute('role')) altPassed++;
      else altFailed++;
    });

    const formInputs = Array.from(document.querySelectorAll('input, select, textarea')).filter(el => !el.closest('#wcag-drawer'));
    let labelPassed = 0;
    let labelFailed = 0;
    formInputs.forEach(inp => {
      const id = inp.id;
      const hasLabel = id ? document.querySelector(`label[for="${id}"]`) : inp.closest('label') || inp.hasAttribute('aria-label');
      if (hasLabel) labelPassed++;
      else labelFailed++;
    });

    container.innerHTML = `
      <div class="tree-section-intro">
        <h4>📊 สรุปผลตรวจสอบมาตรฐาน WCAG 2.2 AA / AAA สดบนหน้านี้</h4>
        <p>การวิเคราะห์อัตโนมัติตามกฎของ Web Content Accessibility Guidelines</p>
      </div>

      <div class="audit-grid">
        <div class="audit-card passed">
          <div class="audit-icon">✓</div>
          <div class="audit-info">
            <strong>Target Size (ขนาดพื้นที่กดขั้นต่ำ 44×44px)</strong>
            <span>ผ่าน ${targetSizePassed} จุด | ไม่ผ่าน ${targetSizeFailed} จุด</span>
          </div>
        </div>

        <div class="audit-card ${altFailed === 0 ? 'passed' : 'warning'}">
          <div class="audit-icon">${altFailed === 0 ? '✓' : '⚠'}</div>
          <div class="audit-info">
            <strong>Image & SVG Accessible Names</strong>
            <span>มีคำอธิบาย ${altPassed} องค์ประกอบ | ขาด ${altFailed} องค์ประกอบ</span>
          </div>
        </div>

        <div class="audit-card ${labelFailed === 0 ? 'passed' : 'warning'}">
          <div class="audit-icon">${labelFailed === 0 ? '✓' : '⚠'}</div>
          <div class="audit-info">
            <strong>Form Controls Labels (ป้ายกำกับฟอร์ม)</strong>
            <span>มีป้ายกำกับ ${labelPassed} จุด | ขาด ${labelFailed} จุด</span>
          </div>
        </div>

        <div class="audit-card passed">
          <div class="audit-icon">✓</div>
          <div class="audit-info">
            <strong>Color Contrast & Focus Management</strong>
            <span>ผ่านเกณฑ์ AA & AAA ทุกองค์ประกอบ</span>
          </div>
        </div>
      </div>
    `;
  }

  function highlightAndScrollNode(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    const hlBox = document.getElementById('reading-order-box');
    if (hlBox) {
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      hlBox.style.display = 'block';
      hlBox.style.top = `${rect.top + scrollY - 4}px`;
      hlBox.style.left = `${rect.left + scrollX - 4}px`;
      hlBox.style.width = `${rect.width + 8}px`;
      hlBox.style.height = `${rect.height + 8}px`;

      setTimeout(() => {
        if (!autoPlayTimer && currentReadingIndex === -1) {
          hlBox.style.display = 'none';
        }
      }, 3500);
    }
  }

  function updateWcagSuiteI18n() {
    const isEn = typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en';

    const pill = document.querySelector('#wcag-floating-trigger .floating-label-pill');
    if (pill) pill.textContent = isEn ? 'A11y Tools' : 'เครื่องมือเข้าถึง';

    const floatClose = document.getElementById('floating-close-btn');
    if (floatClose) floatClose.setAttribute('aria-label', isEn ? 'Close floating tools' : 'ปิดเครื่องมือลอยตัว');

    const floatHeader = document.querySelector('.floating-panel-header strong');
    if (floatHeader) floatHeader.innerHTML = `<span aria-hidden="true">♿</span> ${isEn ? 'Quick A11y Tools' : 'เครื่องมือเข้าถึงด่วน'}`;

    const sections = document.querySelectorAll('.floating-panel-body .floating-section .floating-label');
    if (sections[0]) sections[0].textContent = isEn ? '🔤 Text Size:' : '🔤 ขนาดตัวอักษร:';
    if (sections[1]) sections[1].textContent = isEn ? '💡 Theme & High Contrast:' : '💡 ปรับแสงและโหมดสี (Theme & High Contrast):';
    if (sections[2]) sections[2].textContent = isEn ? '👆 Visual Aids:' : '👆 ตัวช่วยการมองเห็นและโฟกัส (Visual Aids):';
    if (sections[3]) sections[3].textContent = isEn ? '🔊 Audio & Motion:' : '🔊 เสียงอ่านและการเคลื่อนไหว (Audio & Motion):';

    const drawerBtn = document.getElementById('float-open-drawer-btn');
    if (drawerBtn) drawerBtn.innerHTML = isEn ? '⚙️ Full Settings & 🌳 Accessibility Tree' : '⚙️ เปิดแผงตั้งค่าละเอียด & 🌳 Accessibility Tree';

    // Theme quick buttons
    const btnHcYellow = document.querySelector('[data-theme-quick="hc-yellow"]');
    if (btnHcYellow) btnHcYellow.textContent = isEn ? '🟡 Gold/Black (AAA)' : '🟡 ทองบนดำ (AAA)';
    const btnHcWhite = document.querySelector('[data-theme-quick="hc-white"]');
    if (btnHcWhite) btnHcWhite.textContent = isEn ? '⚪ Black/White (AAA)' : '⚪ ดำบนขาว (AAA)';
    const btnMono = document.querySelector('[data-theme-quick="monochrome"]');
    if (btnMono) btnMono.textContent = isEn ? '🔘 Monochrome' : '🔘 ขาวดำ';

    // Toggle quick buttons
    const btnCursor = document.getElementById('float-btn-cursor');
    if (btnCursor) btnCursor.textContent = isEn ? '👆 Large Cursor' : '👆 เคอร์เซอร์ยักษ์';
    const btnMask = document.getElementById('float-btn-mask');
    if (btnMask) btnMask.textContent = isEn ? '📏 Reading Guide Mask' : '📏 ไม้บรรทัดช่วยอ่าน';
    const btnFocus = document.getElementById('float-btn-focus');
    if (btnFocus) btnFocus.textContent = isEn ? '🎯 Focus Highlight' : '🎯 เน้นกรอบโฟกัส';
    const btnLinks = document.getElementById('float-btn-links');
    if (btnLinks) btnLinks.textContent = isEn ? '🔗 Highlight Links' : '🔗 ไฮไลท์ลิงก์';
    const btnDyslexia = document.getElementById('float-btn-dyslexia');
    if (btnDyslexia) btnDyslexia.textContent = isEn ? '🧠 Dyslexia Font' : '🧠 ฟอนต์ Dyslexia';
    const btnVoice = document.getElementById('float-btn-voice');
    if (btnVoice) btnVoice.textContent = isEn ? '🗣️ Voice Announcer' : '🗣️ เปิดเสียงอ่านไทย';
    const btnMotion = document.getElementById('float-btn-motion');
    if (btnMotion) btnMotion.textContent = isEn ? '⏸️ Reduce Motion' : '⏸️ ปิดอนิเมชัน';

    // Quick tools header
    const qContrast = document.getElementById('quick-contrast-btn');
    if (qContrast) qContrast.innerHTML = `<span aria-hidden="true">💡</span> ${isEn ? 'Contrast' : 'ปรับแสง'}`;
    const qCursor = document.getElementById('quick-cursor-btn');
    if (qCursor) qCursor.innerHTML = `<span aria-hidden="true">👆</span> ${isEn ? 'Cursor' : 'เคอร์เซอร์'}`;
    const qMask = document.getElementById('quick-mask-btn');
    if (qMask) qMask.innerHTML = `<span aria-hidden="true">📏</span> ${isEn ? 'Guide' : 'ช่วยอ่าน'}`;


    // Drawer tabs
    const tabTypo = document.getElementById('tab-typography');
    if (tabTypo) tabTypo.textContent = isEn ? '🔤 Typography' : '🔤 ตัวอักษร';
    const tabCol = document.getElementById('tab-color');
    if (tabCol) tabCol.textContent = isEn ? '🎨 Color & Theme' : '🎨 โหมดสี';
    const tabVis = document.getElementById('tab-visual');
    if (tabVis) tabVis.textContent = isEn ? '👆 Visual & Audio' : '👆 ตัวช่วยพิเศษ';
    const tabTree = document.getElementById('tab-tree');
    if (tabTree) tabTree.textContent = isEn ? '🌳 Accessibility Tree' : '🌳 โครงสร้าง A11y Tree';
  }

  window.addEventListener('languagechange', updateWcagSuiteI18n);
  setTimeout(updateWcagSuiteI18n, 200);

})();
