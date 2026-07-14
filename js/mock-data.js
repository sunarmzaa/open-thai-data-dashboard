/* ==========================================================
   Open Data ไทย — Mock Data
   ข้อมูลจำลองสำหรับทุกหน้า
   ========================================================== */

const PROVINCES = [
  // ภาคเหนือ (Northern) — 9 จังหวัด
  { name: 'เชียงใหม่', region: 'ภาคเหนือ', pop: 1789385 },
  { name: 'เชียงราย', region: 'ภาคเหนือ', pop: 1296550 },
  { name: 'ลำปาง', region: 'ภาคเหนือ', pop: 729654 },
  { name: 'ลำพูน', region: 'ภาคเหนือ', pop: 404560 },
  { name: 'แม่ฮ่องสอน', region: 'ภาคเหนือ', pop: 284138 },
  { name: 'น่าน', region: 'ภาคเหนือ', pop: 479838 },
  { name: 'พะเยา', region: 'ภาคเหนือ', pop: 470478 },
  { name: 'แพร่', region: 'ภาคเหนือ', pop: 438298 },
  { name: 'อุตรดิตถ์', region: 'ภาคเหนือ', pop: 454519 },
  // ภาคตะวันออกเฉียงเหนือ (Northeastern) — 20 จังหวัด
  { name: 'กาฬสินธุ์', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 975012 },
  { name: 'ขอนแก่น', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 1802712 },
  { name: 'ชัยภูมิ', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 1125099 },
  { name: 'นครพนม', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 714536 },
  { name: 'นครราชสีมา', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 2634428 },
  { name: 'บึงกาฬ', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 422417 },
  { name: 'บุรีรัมย์', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 1579166 },
  { name: 'มหาสารคาม', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 950381 },
  { name: 'มุกดาหาร', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 352428 },
  { name: 'ยโสธร', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 535140 },
  { name: 'ร้อยเอ็ด', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 1285854 },
  { name: 'เลย', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 636389 },
  { name: 'ศรีสะเกษ', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 1467758 },
  { name: 'สกลนคร', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 1140383 },
  { name: 'สุรินทร์', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 1393124 },
  { name: 'หนองคาย', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 517260 },
  { name: 'หนองบัวลำภู', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 508414 },
  { name: 'อุดรธานี', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 1573851 },
  { name: 'อุบลราชธานี', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 1872400 },
  { name: 'อำนาจเจริญ', region: 'ภาคตะวันออกเฉียงเหนือ', pop: 375084 },
  // ภาคกลาง (Central) — 22 จังหวัด
  { name: 'กรุงเทพมหานคร', region: 'ภาคกลาง', pop: 5527994 },
  { name: 'กำแพงเพชร', region: 'ภาคกลาง', pop: 717715 },
  { name: 'ชัยนาท', region: 'ภาคกลาง', pop: 328923 },
  { name: 'นครนายก', region: 'ภาคกลาง', pop: 259428 },
  { name: 'นครปฐม', region: 'ภาคกลาง', pop: 919767 },
  { name: 'นครสวรรค์', region: 'ภาคกลาง', pop: 1053519 },
  { name: 'นนทบุรี', region: 'ภาคกลาง', pop: 1271951 },
  { name: 'ปทุมธานี', region: 'ภาคกลาง', pop: 1149079 },
  { name: 'พระนครศรีอยุธยา', region: 'ภาคกลาง', pop: 812737 },
  { name: 'พิจิตร', region: 'ภาคกลาง', pop: 537647 },
  { name: 'พิษณุโลก', region: 'ภาคกลาง', pop: 866891 },
  { name: 'เพชรบูรณ์', region: 'ภาคกลาง', pop: 986228 },
  { name: 'ลพบุรี', region: 'ภาคกลาง', pop: 756077 },
  { name: 'สมุทรปราการ', region: 'ภาคกลาง', pop: 1340228 },
  { name: 'สมุทรสงคราม', region: 'ภาคกลาง', pop: 193835 },
  { name: 'สมุทรสาคร', region: 'ภาคกลาง', pop: 568832 },
  { name: 'สระบุรี', region: 'ภาคกลาง', pop: 639969 },
  { name: 'สิงห์บุรี', region: 'ภาคกลาง', pop: 209905 },
  { name: 'สุโขทัย', region: 'ภาคกลาง', pop: 593264 },
  { name: 'สุพรรณบุรี', region: 'ภาคกลาง', pop: 843387 },
  { name: 'อ่างทอง', region: 'ภาคกลาง', pop: 279500 },
  { name: 'อุทัยธานี', region: 'ภาคกลาง', pop: 328557 },
  // ภาคตะวันออก (Eastern) — 7 จังหวัด
  { name: 'จันทบุรี', region: 'ภาคตะวันออก', pop: 536197 },
  { name: 'ฉะเชิงเทรา', region: 'ภาคตะวันออก', pop: 710990 },
  { name: 'ชลบุรี', region: 'ภาคตะวันออก', pop: 1558301 },
  { name: 'ตราด', region: 'ภาคตะวันออก', pop: 229235 },
  { name: 'ปราจีนบุรี', region: 'ภาคตะวันออก', pop: 485800 },
  { name: 'ระยอง', region: 'ภาคตะวันออก', pop: 740145 },
  { name: 'สระแก้ว', region: 'ภาคตะวันออก', pop: 564225 },
  // ภาคตะวันตก (Western) — 5 จังหวัด
  { name: 'กาญจนบุรี', region: 'ภาคตะวันตก', pop: 889946 },
  { name: 'ตาก', region: 'ภาคตะวันตก', pop: 664452 },
  { name: 'ประจวบคีรีขันธ์', region: 'ภาคตะวันตก', pop: 538630 },
  { name: 'เพชรบุรี', region: 'ภาคตะวันตก', pop: 479350 },
  { name: 'ราชบุรี', region: 'ภาคตะวันตก', pop: 864678 },
  // ภาคใต้ (Southern) — 14 จังหวัด
  { name: 'กระบี่', region: 'ภาคใต้', pop: 471620 },
  { name: 'ชุมพร', region: 'ภาคใต้', pop: 507467 },
  { name: 'ตรัง', region: 'ภาคใต้', pop: 642749 },
  { name: 'นครศรีธรรมราช', region: 'ภาคใต้', pop: 1563877 },
  { name: 'นราธิวาส', region: 'ภาคใต้', pop: 808182 },
  { name: 'ปัตตานี', region: 'ภาคใต้', pop: 706686 },
  { name: 'พังงา', region: 'ภาคใต้', pop: 270764 },
  { name: 'พัทลุง', region: 'ภาคใต้', pop: 528837 },
  { name: 'ภูเก็ต', region: 'ภาคใต้', pop: 416582 },
  { name: 'ยะลา', region: 'ภาคใต้', pop: 523210 },
  { name: 'ระนอง', region: 'ภาคใต้', pop: 188600 },
  { name: 'สงขลา', region: 'ภาคใต้', pop: 1435635 },
  { name: 'สตูล', region: 'ภาคใต้', pop: 322791 },
  { name: 'สุราษฎร์ธานี', region: 'ภาคใต้', pop: 1067838 },
];

const REGIONS = ['ภาคเหนือ', 'ภาคตะวันออกเฉียงเหนือ', 'ภาคกลาง', 'ภาคตะวันออก', 'ภาคตะวันตก', 'ภาคใต้'];

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

// --- สถิติหน้าหลัก ---
const STATS = {
  totalDatasets: 12847,
  totalOrganizations: 324,
  monthlyDownloads: 158420,
  weeklyUpdates: 89,
};

// --- การเข้าใช้งานย้อนหลัง 12 เดือน ---
const USAGE_TREND = [
  { month: 'ก.ค. 67', value: 98500 },
  { month: 'ส.ค. 67', value: 105200 },
  { month: 'ก.ย. 67', value: 112300 },
  { month: 'ต.ค. 67', value: 119800 },
  { month: 'พ.ย. 67', value: 128400 },
  { month: 'ธ.ค. 67', value: 135100 },
  { month: 'ม.ค. 68', value: 142600 },
  { month: 'ก.พ. 68', value: 139200 },
  { month: 'มี.ค. 68', value: 148900 },
  { month: 'เม.ย. 68', value: 144300 },
  { month: 'พ.ค. 68', value: 155800 },
  { month: 'มิ.ย. 68', value: 162400 },
];

// --- หมวดข้อมูลยอดนิยม 8 หมวด ---
const CATEGORIES = [
  { name: 'สาธารณสุข', icon: '🏥', count: 2145, color: '#f87171' },
  { name: 'การศึกษา', icon: '📚', count: 1832, color: '#60a5fa' },
  { name: 'คมนาคม', icon: '🚗', count: 1567, color: '#34d399' },
  { name: 'เศรษฐกิจ', icon: '💰', count: 1423, color: '#fbbf24' },
  { name: 'สิ่งแวดล้อม', icon: '🌿', count: 1298, color: '#a78bfa' },
  { name: 'ความปลอดภัย', icon: '🛡️', count: 1156, color: '#fb923c' },
  { name: 'เทคโนโลยี', icon: '💻', count: 987, color: '#2dd4bf' },
  { name: 'การเกษตร', icon: '🌾', count: 876, color: '#f472b6' },
];

// --- ชุดข้อมูลอัปเดตล่าสุด 5 รายการ ---
const LATEST_DATASETS = [
  { title: 'สถิติผู้ป่วยไข้เลือดออกรายเดือน', org: 'กรมควบคุมโรค', date: '14 ก.ค. 2568', category: 'สาธารณสุข' },
  { title: 'ข้อมูลการจราจรทางถนนสายหลัก', org: 'กรมทางหลวง', date: '13 ก.ค. 2568', category: 'คมนาคม' },
  { title: 'สถิติผลสอบ O-NET รายจังหวัด', org: 'สทศ.', date: '13 ก.ค. 2568', category: 'การศึกษา' },
  { title: 'ดัชนีราคาผู้บริโภครายเดือน', org: 'กระทรวงพาณิชย์', date: '12 ก.ค. 2568', category: 'เศรษฐกิจ' },
  { title: 'ข้อมูลคุณภาพอากาศรายชั่วโมง', org: 'กรมควบคุมมลพิษ', date: '12 ก.ค. 2568', category: 'สิ่งแวดล้อม' },
];

// --- ชุดข้อมูลทั้งหมดสำหรับหน้าสำรวจ ---
const ORGANIZATIONS = ['กรมควบคุมโรค', 'กรมทางหลวง', 'สทศ.', 'กระทรวงพาณิชย์', 'กรมควบคุมมลพิษ', 'กรมอุตุนิยมวิทยา', 'สำนักงานสถิติแห่งชาติ', 'กรมพัฒนาที่ดิน', 'ธนาคารแห่งประเทศไทย', 'กรมส่งเสริมการเกษตร'];
const FORMATS = ['CSV', 'JSON', 'Excel', 'API'];
const FREQUENCIES = ['รายวัน', 'รายสัปดาห์', 'รายเดือน', 'รายไตรมาส', 'รายปี'];
const TAGS_LIST = ['สถิติ', 'สาธารณสุข', 'เศรษฐกิจ', 'การศึกษา', 'สิ่งแวดล้อม', 'คมนาคม', 'ประชากร', 'งบประมาณ', 'การเกษตร', 'เทคโนโลยี'];

function generateDatasets(count) {
  const titles = [
    'สถิติผู้ป่วยไข้เลือดออกรายเดือน', 'ข้อมูลการจราจรทางถนนสายหลัก',
    'สถิติผลสอบ O-NET รายจังหวัด', 'ดัชนีราคาผู้บริโภครายเดือน',
    'ข้อมูลคุณภาพอากาศรายชั่วโมง', 'สถิติน้ำฝนรายวัน',
    'จำนวนประชากรรายจังหวัด', 'ข้อมูลงบประมาณแผ่นดิน',
    'สถิติการท่องเที่ยวรายเดือน', 'ข้อมูลราคาพืชผลเกษตร',
    'อัตราการว่างงานรายไตรมาส', 'จำนวนโรงเรียนรายจังหวัด',
    'สถิติอุบัติเหตุจราจรรายเดือน', 'ข้อมูลการส่งออกรายประเทศ',
    'สถิติผู้ใช้บริการรถไฟฟ้า', 'ข้อมูลน้ำท่วมรายจังหวัด',
    'สถิติเด็กแรกเกิดรายเดือน', 'ข้อมูลหนี้สาธารณะ',
    'สถิติการใช้พลังงานไฟฟ้า', 'ข้อมูลจำนวนวัดทั่วประเทศ',
    'สถิติคดีอาญารายเดือน', 'ข้อมูลผู้สูงอายุรายจังหวัด',
    'สถิติการเข้ารับวัคซีน', 'ข้อมูลพื้นที่ป่าไม้',
    'สถิติการใช้อินเทอร์เน็ต', 'ข้อมูลผลิตภัณฑ์มวลรวมจังหวัด',
    'สถิติผู้ป่วย COVID-19', 'ข้อมูลถนนสายหลัก',
    'สถิติการกู้ยืมเงิน กยศ.', 'ข้อมูลการใช้น้ำประปา',
  ];
  const descs = [
    'ชุดข้อมูลแสดงจำนวนผู้ป่วยรายจังหวัด แยกรายเดือน พร้อมอัตราป่วยต่อแสนประชากร',
    'ข้อมูลปริมาณการจราจรบนถนนสายหลักทั่วประเทศ แยกตามช่วงเวลา',
    'ผลการสอบวัดผลมาตรฐานระดับชาติ แยกรายวิชาและจังหวัด',
    'ดัชนีราคาสินค้าและบริการสำหรับผู้บริโภค เทียบปีฐาน',
    'ข้อมูลวัดคุณภาพอากาศ PM2.5 และ AQI จากสถานีตรวจวัดทั่วประเทศ',
  ];
  const results = [];
  for (let i = 0; i < count; i++) {
    const catIdx = i % CATEGORIES.length;
    const fmts = FORMATS.slice(0, 1 + Math.floor(Math.random() * FORMATS.length)).sort();
    results.push({
      id: i + 1,
      title: titles[i % titles.length],
      description: descs[i % descs.length],
      organization: ORGANIZATIONS[i % ORGANIZATIONS.length],
      category: CATEGORIES[catIdx].name,
      lastUpdated: `${14 - (i % 14)} ก.ค. 2568`,
      frequency: FREQUENCIES[i % FREQUENCIES.length],
      formats: [...new Set(fmts)],
      downloads: Math.floor(Math.random() * 50000) + 500,
      year: 2568 - (i % 3),
      tags: [TAGS_LIST[catIdx], TAGS_LIST[(catIdx + 3) % TAGS_LIST.length]],
    });
  }
  return results;
}

const ALL_DATASETS = generateDatasets(60);

// --- ข้อมูลผู้ป่วยไข้เลือดออก (Dengue) ---
// สำหรับ Visualization (Page 3) และ Data Table (Page 4)

// ข้อมูลรายเดือน ปี 2567 vs 2568
const DENGUE_MONTHLY_2567 = [320, 280, 350, 480, 850, 1450, 1820, 1650, 1200, 780, 420, 310];
const DENGUE_MONTHLY_2568 = [380, 340, 420, 560, 980, 1680, 2100, 1890, 1350, 850, 490, 360];

// ข้อมูลรายภูมิภาค (สะสมทั้งปี 2568)
const DENGUE_BY_REGION = [
  { region: 'ภาคเหนือ', cases: 4520 },
  { region: 'ภาคตะวันออกเฉียงเหนือ', cases: 6830 },
  { region: 'ภาคกลาง', cases: 8240 },
  { region: 'ภาคตะวันออก', cases: 3150 },
  { region: 'ภาคตะวันตก', cases: 2180 },
  { region: 'ภาคใต้', cases: 5480 },
];

// ข้อมูลตามช่วงอายุ
const DENGUE_BY_AGE = [
  { range: '0-14 ปี', cases: 7250, percent: 23.8 },
  { range: '15-24 ปี', cases: 9120, percent: 29.9 },
  { range: '25-44 ปี', cases: 8340, percent: 27.4 },
  { range: '45-64 ปี', cases: 4210, percent: 13.8 },
  { range: '65 ปีขึ้นไป', cases: 1480, percent: 4.9 },
];

// --- ข้อมูลรายจังหวัด × 12 เดือน ---
// Generate with seed-like determinism
function generateProvinceMonthly(province, idx) {
  const seed = idx * 137 + 42;
  const base = Math.floor(province.pop / 50000) + 5;
  const monthly = [];
  for (let m = 0; m < 12; m++) {
    // Simulate seasonal pattern: peak Jun-Aug (m=5,6,7)
    const seasonal = m >= 4 && m <= 8
      ? 2.5 + Math.sin((m - 4) * Math.PI / 4) * 1.5
      : 0.5 + Math.cos((m - 6) * Math.PI / 6) * 0.3;
    const noise = ((seed * (m + 1) * 31) % 100) / 100;
    const value = Math.max(1, Math.round(base * seasonal + noise * base * 0.5));
    monthly.push(value);
  }
  return monthly;
}

const PROVINCE_DATA_2568 = PROVINCES.map((p, i) => ({
  ...p,
  monthly: generateProvinceMonthly(p, i),
  get total() { return this.monthly.reduce((a, b) => a + b, 0); },
  get rate() { return parseFloat(((this.total / this.pop) * 100000).toFixed(1)); }
}));

// หาค่าเฉลี่ย และกำหนด threshold สำหรับค่าสูงผิดปกติ
const allMonthlyValues = PROVINCE_DATA_2568.flatMap(p => p.monthly);
const avgValue = allMonthlyValues.reduce((a, b) => a + b, 0) / allMonthlyValues.length;
const ANOMALY_THRESHOLD = avgValue * 3;

// --- Compare page: ข้อมูลสำหรับเปรียบเทียบ ---
const COMPARE_INDICATORS = [
  { id: 'cases', label: 'จำนวนผู้ป่วย (ราย)' },
  { id: 'rate', label: 'อัตราต่อแสนประชากร' },
  { id: 'trend', label: 'แนวโน้มเทียบปีก่อน (%)' },
];

// สร้างข้อมูลสำหรับเปรียบเทียบ 2 ปี
const PROVINCE_DATA_2567 = PROVINCES.map((p, i) => ({
  ...p,
  monthly: generateProvinceMonthly(p, i + 77),
  get total() { return this.monthly.reduce((a, b) => a + b, 0); },
  get rate() { return parseFloat(((this.total / this.pop) * 100000).toFixed(1)); }
}));

// --- Utility: format numbers ---
function formatNumber(n) {
  return new Intl.NumberFormat('th-TH').format(n);
}
