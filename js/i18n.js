/* ==========================================================
   Open Data ไทย — Client-Side i18n Dictionary & Engine
   WCAG 2.2 AA & AAA Compliant Language Switcher
   ========================================================== */

const I18N_DICTIONARY = {
  th: {
    // Global Skip Link & Banner
    "skip.main": "ข้ามไปยังเนื้อหาหลัก",
    "banner.mockup": "ระบบนี้ใช้ข้อมูลจำลอง (Mockup) เพื่อสาธิตเท่านั้น",

    // Navigation Bar
    "nav.brand": "Open Data ไทย",
    "nav.home": "หน้าหลัก",
    "nav.explore": "สำรวจข้อมูล",
    "nav.viz": "แสดงผลด้วยภาพ",
    "nav.table": "ตารางข้อมูล",
    "nav.compare": "เปรียบเทียบ",
    "nav.compare.aria": "เปรียบเทียบข้อมูลสถิติผู้ป่วยไข้เลือดออกรายจังหวัด",
    "footer.nav.compare": "เปรียบเทียบรายจังหวัด",
    "nav.toggle.label": "เปิดเมนูนำทาง",
    "nav.i18n.btn": "🇹🇭 TH",
    "nav.i18n.aria": "เปลี่ยนภาษาเป็นภาษาอังกฤษ / Switch to English",

    // Enterprise Footer
    "footer.desc": "แพลตฟอร์มศูนย์รวมข้อมูลเปิดภาครัฐ เพื่อการวิเคราะห์และตัดสินใจบนรากฐานข้อมูลเชิงประจักษ์ที่ทุกคนเข้าถึงได้อย่างเท่าเทียม",
    "footer.quick": "เมนูด่วน",
    "footer.a11y": "การเข้าถึง (WCAG)",
    "footer.a11y.kb": "รองรับการนำทางด้วยคีย์บอร์ด 100% (Full Keyboard Nav)",
    "footer.a11y.sr": "เข้ากันได้กับโปรแกรมอ่านหน้าจอ (Screen Reader Friendly)",
    "footer.a11y.mode": "ความเปรียบต่างสูง (Light & Dark Modes)",
    "footer.standards": "มาตรฐานระบบ",
    "footer.std.label": "มาตรฐาน:",
    "footer.env.label": "สภาพแวดล้อม:",
    "footer.env.val": "🟢 Mockup Ready",
    "footer.ver.label": "เวอร์ชันระบบ:",
    "footer.copy": "© 2026 Open Data ไทย — พัฒนาตามมาตรฐานเว็บไซต์ที่ทุกคนเข้าถึงได้",
    "footer.disclaimer": "ข้อมูลจำลอง (Mockup Data) เพื่อการศึกษาและสาธิตเท่านั้น",

    // Home Page (index.html)
    "hero.title": "Open Data ไทย",
    "hero.desc": "แพลตฟอร์มข้อมูลเปิดภาครัฐ เข้าถึงชุดข้อมูลจากหน่วยงานรัฐทั่วประเทศ เพื่อความโปร่งใสและการพัฒนาที่ยั่งยืน",
    "hero.search.placeholder": "ค้นหาชุดข้อมูล เช่น ไข้เลือดออก, คุณภาพอากาศ...",
    "stats.title": "ตัวเลขสำคัญ",
    "stats.datasets": "ชุดข้อมูลทั้งหมด",
    "stats.orgs": "หน่วยงานเจ้าของข้อมูล",
    "stats.downloads": "ดาวน์โหลดสะสม",
    "stats.apis": "การเรียกใช้งาน API",
    "home.chart.title": "แนวโน้มการเข้าถึงข้อมูลและดาวน์โหลด (รายเดือน)",
    "home.chart.summary": "สรุปข้อมูลจากกราฟ",
    "home.chart.desc": "กราฟแสดงการเพิ่มขึ้นของการเข้าถึงและดาวน์โหลดชุดข้อมูลเปิดตั้งแต่เดือน ม.ค. ถึง ธ.ค. 2568 โดยมียอดดาวน์โหลดสูงสุดในเดือน พ.ย.",
    "home.cats.title": "ดูหมวดหมู่ชุดข้อมูลยอดนิยม",
    "home.updates.title": "ชุดข้อมูลอัปเดตล่าสุด",
    "home.view.all": "ดูทั้งหมด",
    "home.cats.viewall.aria": "ดูหมวดหมู่ชุดข้อมูลยอดนิยมและรูปภาพสัญลักษณ์ทั้งหมด",
    "home.updates.viewall.aria": "ดูชุดข้อมูลอัปเดตล่าสุดและรายการทั้งหมด",
    "home.search.landmark": "ค้นหาชุดข้อมูลในหน้าหลัก",

    // Explore Page (explore.html)
    "explore.title": "สำรวจชุดข้อมูล",
    "explore.results.title": "รายการชุดข้อมูล",
    "explore.desc": "ค้นหาและเข้าถึงชุดข้อมูลเปิดจากหน่วยงานภาครัฐทั่วประเทศ",
    "explore.filters": "ตัวกรอง",
    "explore.search.landmark": "กรองค้นหาชุดข้อมูล",
    "explore.search.label": "ค้นหา",
    "explore.search.placeholder": "ค้นหาชุดข้อมูล...",
    "explore.cat.legend": "หมวดหมู่",
    "explore.org.legend": "หน่วยงาน",
    "explore.format.legend": "รูปแบบไฟล์",
    "explore.year.legend": "ปีของข้อมูล",
    "explore.tag.legend": "ป้ายกำกับ",
    "explore.clear": "ล้างตัวกรองทั้งหมด",
    "explore.sort.label": "เรียงลำดับตาม",
    "explore.sort.name.asc": "ชื่อ (ก-ฮ)",
    "explore.sort.name.desc": "ชื่อ (ฮ-ก)",
    "explore.sort.date.desc": "วันอัปเดต (ล่าสุด)",
    "explore.sort.date.asc": "วันอัปเดต (เก่าสุด)",
    "explore.sort.dl.desc": "ดาวน์โหลด (มากสุด)",
    "explore.sort.dl.asc": "ดาวน์โหลด (น้อยสุด)",
    "explore.th.name": "ชื่อชุดข้อมูล",
    "explore.th.desc": "คำอธิบาย",
    "explore.th.org": "หน่วยงาน",
    "explore.th.date": "วันอัปเดต",
    "explore.th.freq": "ความถี่",
    "explore.th.format": "รูปแบบ",
    "explore.th.dl": "ดาวน์โหลด",

    // Visualization Page (visualization.html)
    "viz.title": "แสดงผลข้อมูลด้วยภาพ",
    "viz.desc": "ชุดข้อมูลตัวอย่าง: สถิติผู้ป่วยไข้เลือดออกรายเดือน — กรมควบคุมโรค",
    "viz.chart1.title": "จำนวนผู้ป่วยไข้เลือดออกรายเดือน เปรียบเทียบปี 2567 กับ 2568",
    "viz.chart1.summary": "สรุป: ปี 2568 มีจำนวนผู้ป่วยสูงกว่าปี 2567 ในทุกเดือน โดยจุดสูงสุดอยู่ในเดือนกรกฎาคม (2,100 ราย) เทียบกับปี 2567 (1,820 ราย) เพิ่มขึ้น 15.4% ช่วงระบาดหนักคือเดือนพฤษภาคม-กันยายน",
    "viz.chart2.title": "จำนวนผู้ป่วยไข้เลือดออกสะสม แยกตามภูมิภาค (ปี 2568)",
    "viz.chart2.summary": "สรุป: ภาคกลางมีจำนวนผู้ป่วยสะสมมากที่สุด (8,240 ราย) ตามด้วยภาคตะวันออกเฉียงเหนือ (6,830 ราย) และภาคใต้ (5,480 ราย) ภาคตะวันตกมีจำนวนน้อยที่สุด (2,180 ราย)",
    "viz.chart3.title": "สัดส่วนผู้ป่วยไข้เลือดออกตามช่วงอายุ (ปี 2568)",
    "viz.chart3.summary": "สรุป: กลุ่มอายุ 15-24 ปีมีสัดส่วนผู้ป่วยมากที่สุด (29.9%) รองลงมาคือ 25-44 ปี (27.4%) และ 0-14 ปี (23.8%) กลุ่มผู้สูงอายุ 65 ปีขึ้นไปมีสัดส่วนน้อยที่สุด (4.9%) แต่มีอัตราอาการรุนแรงสูง",
    "viz.dl.img": "📷 ดาวน์โหลดภาพ",
    "viz.dl.csv": "📥 CSV",
    "viz.dl.chart1.img.aria": "ดาวน์โหลดกราฟจำนวนผู้ป่วยไข้เลือดออกเปรียบเทียบปี 2567 กับ 2568 เป็นรูปภาพ PNG",
    "viz.dl.chart2.img.aria": "ดาวน์โหลดกราฟสัดส่วนผู้ป่วยไข้เลือดออกสะสมแยกตามภูมิภาค เป็นรูปภาพ PNG",
    "viz.dl.chart3.img.aria": "ดาวน์โหลดกราฟสัดส่วนผู้ป่วยไข้เลือดออกตามช่วงอายุ เป็นรูปภาพ PNG",
    "viz.summary.btn": "📋 สรุปข้อมูลจากกราฟ",
    "viz.table.toggle": "📋 ดูเป็นตารางข้อมูล",

    // Data Table Page (data-table.html)
    "table.page.title": "ตารางข้อมูลเชิงลึก",
    "table.main.heading": "ตารางข้อมูลผู้ป่วยไข้เลือดออกรายจังหวัด",
    "table.page.desc": "ข้อมูลผู้ป่วยไข้เลือดออกรายจังหวัด × รายเดือน ปี 2568",
    "table.search.landmark": "ค้นหาจังหวัดในตาราง",
    "table.toolbar.search": "🔍 ค้นหาจังหวัด...",
    "table.toolbar.region": "ทุกภูมิภาค",
    "table.toolbar.region.north": "ภาคเหนือ",
    "table.toolbar.region.northeast": "ภาคตะวันออกเฉียงเหนือ",
    "table.toolbar.region.central": "ภาคกลาง",
    "table.toolbar.region.east": "ภาคตะวันออก",
    "table.toolbar.region.west": "ภาคตะวันตก",
    "table.toolbar.region.south": "ภาคใต้",
    "table.export.csv": "📥 CSV",
    "table.export.excel": "📥 Excel",
    "table.export.json": "📤 ดาวน์โหลด JSON",
    "table.export.print": "🖨️ พิมพ์รายงาน",
    "table.th.province": "จังหวัด",
    "table.th.region": "ภูมิภาค",
    "table.th.total": "รวม",
    "table.th.rate": "อัตราต่อแสน",
    "table.note": "หมายเหตุ: สถิติผู้ป่วยโรคไข้เลือดออกสะสมปี 2568 อ้างอิงจากข้อมูลจำลองเพื่อการสาธิตระบบ โดยมีเครื่องหมาย ⚠️ แสดงในจังหวัดที่มีอัตราผู้ป่วยสูงกว่าเกณฑ์เฝ้าระวัง",

    // Compare Page (compare.html)
    "compare.page.title": "เปรียบเทียบข้อมูลรายจังหวัด",
    "compare.page.desc": "เลือก 2-5 จังหวัดเพื่อเปรียบเทียบข้อมูลผู้ป่วยไข้เลือดออก",
    "compare.controls.title": "ตั้งค่าการเปรียบเทียบ",
    "compare.prov.label": "เลือกจังหวัด (2-5 จังหวัด)",
    "compare.indicator.legend": "ตัวชี้วัด",
    "compare.year.label": "ปีข้อมูล",
    "compare.year.2568": "ปี 2568",
    "compare.year.2567": "ปี 2567",
    "compare.selector.title": "เลือกจังหวัดที่ต้องการเปรียบเทียบ (เลือกได้สูงสุด 5 จังหวัด)",
    "compare.combobox.label": "ค้นหาและเลือกจังหวัด",
    "compare.combobox.placeholder": "พิมพ์ค้นหาจังหวัด...",
    "compare.combobox.btn": "เปิดรายชื่อจังหวัด",
    "compare.selected.label": "จังหวัดที่เลือกขณะนี้:",
    "compare.selected.empty": "ยังไม่ได้เลือกจังหวัด — กรุณาเลือกจากช่องค้นหาด้านบน (เลือกได้สูงสุด 5 จังหวัด)",
    "compare.map.title": "แผนที่ประเทศไทย",
    "compare.map.note": "คลิกที่ชื่อจังหวัดบนแผนที่หรือใช้กล่องค้นหาด้านบนเพื่อเลือก",
    "compare.table.title": "ตารางเปรียบเทียบ",
    "compare.share.btn": "🔗 แชร์ลิงก์",
    "compare.share.aria": "แชร์ผลการเปรียบเทียบข้อมูลรายจังหวัดเป็นลิงก์",
    "compare.print.btn": "🖨️ พิมพ์รายงาน",
    "compare.print.aria": "พิมพ์รายงานสรุปผลการเปรียบเทียบข้อมูลรายจังหวัด",

    // Page Document Titles
    "doc.title.home": "หน้าหลัก — Open Data ไทย",
    "doc.title.explore": "สำรวจชุดข้อมูล — Open Data ไทย",
    "doc.title.viz": "แสดงผลด้วยภาพ — Open Data ไทย",
    "doc.title.table": "ตารางข้อมูลเชิงลึก — Open Data ไทย",
    "doc.title.compare": "เปรียบเทียบรายจังหวัด — Open Data ไทย"
  },

  en: {
    // Global Skip Link & Banner
    "skip.main": "Skip to main content",
    "banner.mockup": "This system uses mockup data for demonstration purposes only",

    // Navigation Bar
    "nav.brand": "Open Data Thailand",
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.viz": "Visualizations",
    "nav.table": "Data Tables",
    "nav.compare": "Compare",
    "nav.compare.aria": "Compare Provincial Statistical Data for Dengue Fever Cases",
    "footer.nav.compare": "Compare Provincial Data",
    "nav.toggle.label": "Toggle navigation menu",
    "nav.i18n.btn": "🇬🇧 EN",
    "nav.i18n.aria": "Switch to Thai / เปลี่ยนภาษาเป็นภาษาไทย",

    // Enterprise Footer
    "footer.desc": "Government open data platform for evidence-based analysis and decision making, accessible to everyone.",
    "footer.quick": "Quick Links",
    "footer.a11y": "Accessibility (WCAG)",
    "footer.a11y.kb": "100% Keyboard Navigation Supported (Full Keyboard Nav)",
    "footer.a11y.sr": "Screen Reader Friendly & Compatible",
    "footer.a11y.mode": "High Contrast (Light & Dark Modes)",
    "footer.standards": "System Standards",
    "footer.std.label": "Standard:",
    "footer.env.label": "Environment:",
    "footer.env.val": "🟢 Mockup Ready",
    "footer.ver.label": "Version:",
    "footer.copy": "© 2026 Open Data Thailand — Built to accessible web standards for everyone",
    "footer.disclaimer": "Mockup Data for educational and demonstration purposes only",

    // Home Page (index.html)
    "hero.title": "Open Data Thailand",
    "hero.desc": "Government open data platform. Access datasets from public agencies nationwide for transparency and sustainable development.",
    "hero.search.placeholder": "Search datasets e.g., Dengue fever, Air quality...",
    "stats.title": "Key Statistics",
    "stats.datasets": "Total Datasets",
    "stats.orgs": "Data Organizations",
    "stats.downloads": "Total Downloads",
    "stats.apis": "API Requests",
    "home.chart.title": "Data Access & Download Trends (Monthly)",
    "home.chart.summary": "Chart Summary",
    "home.chart.desc": "The chart illustrates increasing trends in open dataset access and downloads from Jan to Dec 2025, reaching peak downloads in Nov.",
    "home.cats.title": "Popular Dataset Categories",
    "home.updates.title": "Recently Updated Datasets",
    "home.view.all": "View All",
    "home.cats.viewall.aria": "View all popular dataset categories and symbol images",
    "home.updates.viewall.aria": "View all recently updated datasets and listings",
    "home.search.landmark": "Search datasets on homepage",

    // Explore Page (explore.html)
    "explore.title": "Explore Datasets",
    "explore.results.title": "Dataset Listings",
    "explore.desc": "Search and access open datasets from government agencies nationwide",
    "explore.filters": "Filters",
    "explore.search.landmark": "Filter and search datasets",
    "explore.search.label": "Search",
    "explore.search.placeholder": "Search datasets...",
    "explore.cat.legend": "Category",
    "explore.org.legend": "Organization",
    "explore.format.legend": "File Format",
    "explore.year.legend": "Data Year",
    "explore.tag.legend": "Tags",
    "explore.clear": "Clear All Filters",
    "explore.sort.label": "Sort By",
    "explore.sort.name.asc": "Name (A-Z)",
    "explore.sort.name.desc": "Name (Z-A)",
    "explore.sort.date.desc": "Updated (Newest)",
    "explore.sort.date.asc": "Updated (Oldest)",
    "explore.sort.dl.desc": "Downloads (Most)",
    "explore.sort.dl.asc": "Downloads (Least)",
    "explore.th.name": "Dataset Name",
    "explore.th.desc": "Description",
    "explore.th.org": "Organization",
    "explore.th.date": "Updated Date",
    "explore.th.freq": "Frequency",
    "explore.th.format": "Format",
    "explore.th.dl": "Downloads",

    // Visualization Page (visualization.html)
    "viz.title": "Data Visualizations",
    "viz.desc": "Sample Dataset: Monthly Dengue Fever Statistics — Department of Disease Control",
    "viz.chart1.title": "Monthly Dengue Fever Cases: 2024 vs 2025 Comparison",
    "viz.chart1.summary": "Summary: 2025 cases exceeded 2024 across all months, peaking in July (2,100 cases vs 1,820 in 2024, a +15.4% increase). Major outbreak period spans May-September.",
    "viz.chart2.title": "Cumulative Dengue Cases by Region (2025)",
    "viz.chart2.summary": "Summary: Central region reported the highest cumulative cases (8,240), followed by Northeastern (6,830) and Southern (5,480). Western region recorded the lowest (2,180).",
    "viz.chart3.title": "Dengue Patient Proportion by Age Group (2025)",
    "viz.chart3.summary": "Summary: Age group 15-24 years accounts for the largest proportion (29.9%), followed by 25-44 years (27.4%) and 0-14 years (23.8%). Elderly group 65+ accounts for the smallest proportion (4.9%) but has higher severity rates.",
    "viz.dl.img": "📷 Download PNG",
    "viz.dl.csv": "📥 CSV",
    "viz.dl.chart1.img.aria": "Download Monthly Dengue Cases Comparison Chart as PNG image",
    "viz.dl.chart2.img.aria": "Download Cumulative Dengue Cases by Region Chart as PNG image",
    "viz.dl.chart3.img.aria": "Download Dengue Patient Proportion by Age Group Chart as PNG image",
    "viz.summary.btn": "📋 Chart Summary",
    "viz.table.toggle": "📋 View as Data Table",

    // Data Table Page (data-table.html)
    "table.page.title": "Data Tables",
    "table.main.heading": "Provincial Dengue Fever Data Table",
    "table.page.desc": "Dengue Fever Cases by Province × Month, 2025",
    "table.search.landmark": "Search province in table",
    "table.toolbar.search": "🔍 Search province...",
    "table.toolbar.region": "All Regions",
    "table.toolbar.region.north": "Northern",
    "table.toolbar.region.northeast": "Northeastern",
    "table.toolbar.region.central": "Central",
    "table.toolbar.region.east": "Eastern",
    "table.toolbar.region.west": "Western",
    "table.toolbar.region.south": "Southern",
    "table.export.csv": "📥 CSV",
    "table.export.excel": "📥 Excel",
    "table.export.json": "📤 Download JSON",
    "table.export.print": "🖨️ Print Report",
    "table.th.province": "Province",
    "table.th.region": "Region",
    "table.th.total": "Total",
    "table.th.rate": "Rate per 100k",
    "table.note": "Note: Cumulative 2025 Dengue statistics are based on mockup data for demonstration. The ⚠️ icon indicates provinces exceeding surveillance thresholds.",

    // Compare Page (compare.html)
    "compare.page.title": "Compare Province Data",
    "compare.page.desc": "Select 2-5 provinces to compare dengue fever statistics",
    "compare.controls.title": "Comparison Settings",
    "compare.prov.label": "Select Provinces (2-5 provinces)",
    "compare.indicator.legend": "Indicators",
    "compare.year.label": "Data Year",
    "compare.year.2568": "Year 2025",
    "compare.year.2567": "Year 2024",
    "compare.selector.title": "Select provinces to compare (up to 5 provinces)",
    "compare.combobox.label": "Search and select province",
    "compare.combobox.placeholder": "Type province name to search...",
    "compare.combobox.btn": "Open province list",
    "compare.selected.label": "Currently selected provinces:",
    "compare.selected.empty": "No provinces selected — please select from the search box above (max 5 provinces)",
    "compare.map.title": "Thailand Map",
    "compare.map.note": "Click province names on map or use search box above to select",
    "compare.table.title": "Comparison Table",
    "compare.share.btn": "🔗 Share Link",
    "compare.share.aria": "Share provincial comparison results as a link",
    "compare.print.btn": "🖨️ Print Report",
    "compare.print.aria": "Print summary report of provincial data comparison",

    // Page Document Titles
    "doc.title.home": "Home — Open Data Thailand",
    "doc.title.explore": "Explore Datasets — Open Data Thailand",
    "doc.title.viz": "Visualizations — Open Data Thailand",
    "doc.title.table": "Data Tables — Open Data Thailand",
    "doc.title.compare": "Province Comparison — Open Data Thailand"
  }
};

/* --- Get Current Language --- */
function getCurrentLang() {
  try {
    const saved = localStorage.getItem('wcag_lang');
    if (saved === 'en' || saved === 'th') return saved;
  } catch (e) { }
  return 'th'; // Default language is Thai
}

/* --- Get i18n Translation String --- */
function t(key, fallback = '') {
  const lang = getCurrentLang();
  const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.th;
  return dict[key] !== undefined ? dict[key] : (fallback || key);
}

/* --- Set & Apply Language --- */
function setLanguage(newLang, announce = true) {
  if (newLang !== 'en' && newLang !== 'th') newLang = 'th';

  try {
    localStorage.setItem('wcag_lang', newLang);
  } catch (e) { }

  // 1. Update Root DOM <html lang="...">
  document.documentElement.setAttribute('lang', newLang);

  // 2. Update Page Title
  const pageType = getPageType();
  if (pageType && I18N_DICTIONARY[newLang][`doc.title.${pageType}`]) {
    document.title = I18N_DICTIONARY[newLang][`doc.title.${pageType}`];
  }

  // 3. Update all static DOM elements with data-i18n
  applyI18nToDOM();

  // 4. Update language toggle buttons across the page
  updateI18nButtons(newLang);

  // 5. Announce via ARIA Live Region for Screen Readers
  if (announce) {
    const announcer = document.getElementById('i18n-announcer');
    if (announcer) {
      const msg = newLang === 'en' ? 'Language switched to English' : 'เปลี่ยนภาษาเป็น ภาษาไทย เรียบร้อยแล้ว';
      announcer.textContent = msg;
    }
  }

  // 6. Dispatch custom event so page scripts (tables, charts, cards) redraw
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: newLang } }));
}

/* --- Identify Current Page Type for Document Title --- */
function getPageType() {
  const path = window.location.pathname;
  if (path.includes('explore.html')) return 'explore';
  if (path.includes('visualization.html')) return 'viz';
  if (path.includes('data-table.html')) return 'table';
  if (path.includes('compare.html')) return 'compare';
  return 'home';
}

/* --- Apply Translations to Static DOM Elements --- */
function applyI18nToDOM() {
  const lang = getCurrentLang();
  const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.th;

  // data-i18n -> textContent / innerHTML
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // data-i18n-placeholder -> placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // data-i18n-aria-label -> aria-label attribute
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (dict[key] !== undefined) {
      el.setAttribute('aria-label', dict[key]);
    }
  });
}

/* --- Update Language Switcher Buttons --- */
function updateI18nButtons(lang) {
  if (document.querySelector('.wcag-quick-tools')) {
    document.querySelectorAll('.btn-i18n-toggle, #btn-i18n-toggle').forEach(btn => {
      if (!btn.closest('.wcag-quick-tools')) {
        btn.remove();
      }
    });
  }
  let btns = document.querySelectorAll('.btn-i18n-toggle, #btn-i18n-toggle');
  if (btns.length === 0) {
    const container = document.querySelector('.wcag-quick-tools') || document.querySelector('.nav-actions');
    const target = document.getElementById('theme-toggle') || document.getElementById('nav-toggle');
    if (container) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wcag-tool-btn btn-i18n-toggle';
      btn.id = 'btn-i18n-toggle';
      if (target && target.parentNode === container) {
        container.insertBefore(btn, target);
      } else {
        container.appendChild(btn);
      }
      btns = [btn];
    }
  }

  btns.forEach(btn => {
    const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.th;
    btn.textContent = dict["nav.i18n.btn"];
    btn.setAttribute('aria-label', dict["nav.i18n.aria"]);
    btn.setAttribute('title', dict["nav.i18n.aria"]);
    if (!btn._i18nBound) {
      btn.addEventListener('click', toggleLanguage);
      btn._i18nBound = true;
    }
  });
}

/* --- Toggle Language --- */
function toggleLanguage() {
  const current = getCurrentLang();
  const next = current === 'th' ? 'en' : 'th';
  setLanguage(next, true);
}

/* --- Initialize i18n on DOM Ready --- */
function initI18n() {
  // Ensure ARIA live region exists
  if (!document.getElementById('i18n-announcer')) {
    const announcer = document.createElement('div');
    announcer.id = 'i18n-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    document.body.appendChild(announcer);
  }

  // Apply saved language without announcing on initial load
  const lang = getCurrentLang();
  setLanguage(lang, false);
}

// Auto init on DOMContentLoaded or immediately if ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
