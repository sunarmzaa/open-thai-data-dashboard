/* ==========================================================
   Open Data ไทย — Mock Data
   ข้อมูลจำลองสำหรับทุกหน้า
   ========================================================== */

const PROVINCES = [
  // ภาคเหนือ (Northern) — 9 จังหวัด
  { name: 'เชียงใหม่', nameEn: 'Chiang Mai', region: 'ภาคเหนือ', regionEn: 'Northern', pop: 1789385 },
  { name: 'เชียงราย', nameEn: 'Chiang Rai', region: 'ภาคเหนือ', regionEn: 'Northern', pop: 1296550 },
  { name: 'ลำปาง', nameEn: 'Lampang', region: 'ภาคเหนือ', regionEn: 'Northern', pop: 729654 },
  { name: 'ลำพูน', nameEn: 'Lamphun', region: 'ภาคเหนือ', regionEn: 'Northern', pop: 404560 },
  { name: 'แม่ฮ่องสอน', nameEn: 'Mae Hong Son', region: 'ภาคเหนือ', regionEn: 'Northern', pop: 284138 },
  { name: 'น่าน', nameEn: 'Nan', region: 'ภาคเหนือ', regionEn: 'Northern', pop: 479838 },
  { name: 'พะเยา', nameEn: 'Phayao', region: 'ภาคเหนือ', regionEn: 'Northern', pop: 470478 },
  { name: 'แพร่', nameEn: 'Phrae', region: 'ภาคเหนือ', regionEn: 'Northern', pop: 438298 },
  { name: 'อุตรดิตถ์', nameEn: 'Uttaradit', region: 'ภาคเหนือ', regionEn: 'Northern', pop: 454519 },
  // ภาคตะวันออกเฉียงเหนือ (Northeastern) — 20 จังหวัด
  { name: 'กาฬสินธุ์', nameEn: 'Kalasin', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 975012 },
  { name: 'ขอนแก่น', nameEn: 'Khon Kaen', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 1802712 },
  { name: 'ชัยภูมิ', nameEn: 'Chaiyaphum', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 1125099 },
  { name: 'นครพนม', nameEn: 'Nakhon Phanom', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 714536 },
  { name: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 2634428 },
  { name: 'บึงกาฬ', nameEn: 'Bueng Kan', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 422417 },
  { name: 'บุรีรัมย์', nameEn: 'Buri Ram', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 1579166 },
  { name: 'มหาสารคาม', nameEn: 'Maha Sarakham', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 950381 },
  { name: 'มุกดาหาร', nameEn: 'Mukdahan', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 352428 },
  { name: 'ยโสธร', nameEn: 'Yasothon', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 535140 },
  { name: 'ร้อยเอ็ด', nameEn: 'Roi Et', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 1285854 },
  { name: 'เลย', nameEn: 'Loei', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 636389 },
  { name: 'ศรีสะเกษ', nameEn: 'Si Sa Ket', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 1467758 },
  { name: 'สกลนคร', nameEn: 'Sakon Nakhon', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 1140383 },
  { name: 'สุรินทร์', nameEn: 'Surin', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 1393124 },
  { name: 'หนองคาย', nameEn: 'Nong Khai', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 517260 },
  { name: 'หนองบัวลำภู', nameEn: 'Nong Bua Lam Phu', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 508414 },
  { name: 'อุดรธานี', nameEn: 'Udon Thani', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 1573851 },
  { name: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 1872400 },
  { name: 'อำนาจเจริญ', nameEn: 'Amnat Charoen', region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', pop: 375084 },
  // ภาคกลาง (Central) — 22 จังหวัด
  { name: 'กรุงเทพมหานคร', nameEn: 'Bangkok', region: 'ภาคกลาง', regionEn: 'Central', pop: 5527994 },
  { name: 'กำแพงเพชร', nameEn: 'Kamphaeng Phet', region: 'ภาคกลาง', regionEn: 'Central', pop: 717715 },
  { name: 'ชัยนาท', nameEn: 'Chai Nat', region: 'ภาคกลาง', regionEn: 'Central', pop: 328923 },
  { name: 'นครนายก', nameEn: 'Nakhon Nayok', region: 'ภาคกลาง', regionEn: 'Central', pop: 259428 },
  { name: 'นครปฐม', nameEn: 'Nakhon Pathom', region: 'ภาคกลาง', regionEn: 'Central', pop: 919767 },
  { name: 'นครสวรรค์', nameEn: 'Nakhon Sawan', region: 'ภาคกลาง', regionEn: 'Central', pop: 1053519 },
  { name: 'นนทบุรี', nameEn: 'Nonthaburi', region: 'ภาคกลาง', regionEn: 'Central', pop: 1271951 },
  { name: 'ปทุมธานี', nameEn: 'Pathum Thani', region: 'ภาคกลาง', regionEn: 'Central', pop: 1149079 },
  { name: 'พระนครศรีอยุธยา', nameEn: 'Phra Nakhon Si Ayutthaya', region: 'ภาคกลาง', regionEn: 'Central', pop: 812737 },
  { name: 'พิจิตร', nameEn: 'Phichit', region: 'ภาคกลาง', regionEn: 'Central', pop: 537647 },
  { name: 'พิษณุโลก', nameEn: 'Phitsanulok', region: 'ภาคกลาง', regionEn: 'Central', pop: 866891 },
  { name: 'เพชรบูรณ์', nameEn: 'Phetchabun', region: 'ภาคกลาง', regionEn: 'Central', pop: 986228 },
  { name: 'ลพบุรี', nameEn: 'Lop Buri', region: 'ภาคกลาง', regionEn: 'Central', pop: 756077 },
  { name: 'สมุทรปราการ', nameEn: 'Samut Prakan', region: 'ภาคกลาง', regionEn: 'Central', pop: 1340228 },
  { name: 'สมุทรสงคราม', nameEn: 'Samut Songkhram', region: 'ภาคกลาง', regionEn: 'Central', pop: 193835 },
  { name: 'สมุทรสาคร', nameEn: 'Samut Sakhon', region: 'ภาคกลาง', regionEn: 'Central', pop: 568832 },
  { name: 'สระบุรี', nameEn: 'Saraburi', region: 'ภาคกลาง', regionEn: 'Central', pop: 639969 },
  { name: 'สิงห์บุรี', nameEn: 'Sing Buri', region: 'ภาคกลาง', regionEn: 'Central', pop: 209905 },
  { name: 'สุโขทัย', nameEn: 'Sukhothai', region: 'ภาคกลาง', regionEn: 'Central', pop: 593264 },
  { name: 'สุพรรณบุรี', nameEn: 'Suphan Buri', region: 'ภาคกลาง', regionEn: 'Central', pop: 843387 },
  { name: 'อ่างทอง', nameEn: 'Ang Thong', region: 'ภาคกลาง', regionEn: 'Central', pop: 279500 },
  { name: 'อุทัยธานี', nameEn: 'Uthai Thani', region: 'ภาคกลาง', regionEn: 'Central', pop: 328557 },
  // ภาคตะวันออก (Eastern) — 7 จังหวัด
  { name: 'จันทบุรี', nameEn: 'Chanthaburi', region: 'ภาคตะวันออก', regionEn: 'Eastern', pop: 536197 },
  { name: 'ฉะเชิงเทรา', nameEn: 'Chachoengsao', region: 'ภาคตะวันออก', regionEn: 'Eastern', pop: 710990 },
  { name: 'ชลบุรี', nameEn: 'Chon Buri', region: 'ภาคตะวันออก', regionEn: 'Eastern', pop: 1558301 },
  { name: 'ตราด', nameEn: 'Trat', region: 'ภาคตะวันออก', regionEn: 'Eastern', pop: 229235 },
  { name: 'ปราจีนบุรี', nameEn: 'Prachin Buri', region: 'ภาคตะวันออก', regionEn: 'Eastern', pop: 485800 },
  { name: 'ระยอง', nameEn: 'Rayong', region: 'ภาคตะวันออก', regionEn: 'Eastern', pop: 740145 },
  { name: 'สระแก้ว', nameEn: 'Sa Kaeo', region: 'ภาคตะวันออก', regionEn: 'Eastern', pop: 564225 },
  // ภาคตะวันตก (Western) — 5 จังหวัด
  { name: 'กาญจนบุรี', nameEn: 'Kanchanaburi', region: 'ภาคตะวันตก', regionEn: 'Western', pop: 889946 },
  { name: 'ตาก', nameEn: 'Tak', region: 'ภาคตะวันตก', regionEn: 'Western', pop: 664452 },
  { name: 'ประจวบคีรีขันธ์', nameEn: 'Prachuap Khiri Khan', region: 'ภาคตะวันตก', regionEn: 'Western', pop: 538630 },
  { name: 'เพชรบุรี', nameEn: 'Phetchaburi', region: 'ภาคตะวันตก', regionEn: 'Western', pop: 479350 },
  { name: 'ราชบุรี', nameEn: 'Ratchaburi', region: 'ภาคตะวันตก', regionEn: 'Western', pop: 864678 },
  // ภาคใต้ (Southern) — 14 จังหวัด
  { name: 'กระบี่', nameEn: 'Krabi', region: 'ภาคใต้', regionEn: 'Southern', pop: 471620 },
  { name: 'ชุมพร', nameEn: 'Chumphon', region: 'ภาคใต้', regionEn: 'Southern', pop: 507467 },
  { name: 'ตรัง', nameEn: 'Trang', region: 'ภาคใต้', regionEn: 'Southern', pop: 642749 },
  { name: 'นครศรีธรรมราช', nameEn: 'Nakhon Si Thammarat', region: 'ภาคใต้', regionEn: 'Southern', pop: 1563877 },
  { name: 'นราธิวาส', nameEn: 'Narathiwat', region: 'ภาคใต้', regionEn: 'Southern', pop: 808182 },
  { name: 'ปัตตานี', nameEn: 'Pattani', region: 'ภาคใต้', regionEn: 'Southern', pop: 706686 },
  { name: 'พังงา', nameEn: 'Phang Nga', region: 'ภาคใต้', regionEn: 'Southern', pop: 270764 },
  { name: 'พัทลุง', nameEn: 'Phatthalung', region: 'ภาคใต้', regionEn: 'Southern', pop: 528837 },
  { name: 'ภูเก็ต', nameEn: 'Phuket', region: 'ภาคใต้', regionEn: 'Southern', pop: 416582 },
  { name: 'ยะลา', nameEn: 'Yala', region: 'ภาคใต้', regionEn: 'Southern', pop: 523210 },
  { name: 'ระนอง', nameEn: 'Ranong', region: 'ภาคใต้', regionEn: 'Southern', pop: 188600 },
  { name: 'สงขลา', nameEn: 'Songkhla', region: 'ภาคใต้', regionEn: 'Southern', pop: 1435635 },
  { name: 'สตูล', nameEn: 'Satun', region: 'ภาคใต้', regionEn: 'Southern', pop: 322791 },
  { name: 'สุราษฎร์ธานี', nameEn: 'Surat Thani', region: 'ภาคใต้', regionEn: 'Southern', pop: 1067838 },
];

const REGIONS = ['ภาคเหนือ', 'ภาคตะวันออกเฉียงเหนือ', 'ภาคกลาง', 'ภาคตะวันออก', 'ภาคตะวันตก', 'ภาคใต้'];
const REGIONS_EN = ['Northern', 'Northeastern', 'Central', 'Eastern', 'Western', 'Southern'];

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const MONTHS_FULL_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// --- สถิติหน้าหลัก ---
const STATS = {
  totalDatasets: 12847,
  totalOrganizations: 324,
  monthlyDownloads: 158420,
  weeklyUpdates: 89,
};

// --- การเข้าใช้งานย้อนหลัง 12 เดือน ---
const USAGE_TREND = [
  { month: 'ก.ค. 67', monthEn: 'Jul 24', value: 98500 },
  { month: 'ส.ค. 67', monthEn: 'Aug 24', value: 105200 },
  { month: 'ก.ย. 67', monthEn: 'Sep 24', value: 112300 },
  { month: 'ต.ค. 67', monthEn: 'Oct 24', value: 119800 },
  { month: 'พ.ย. 67', monthEn: 'Nov 24', value: 128400 },
  { month: 'ธ.ค. 67', monthEn: 'Dec 24', value: 135100 },
  { month: 'ม.ค. 68', monthEn: 'Jan 25', value: 142600 },
  { month: 'ก.พ. 68', monthEn: 'Feb 25', value: 139200 },
  { month: 'มี.ค. 68', monthEn: 'Mar 25', value: 148900 },
  { month: 'เม.ย. 68', monthEn: 'Apr 25', value: 144300 },
  { month: 'พ.ค. 68', monthEn: 'May 25', value: 155800 },
  { month: 'มิ.ย. 68', monthEn: 'Jun 25', value: 162400 },
];

// --- หมวดข้อมูลยอดนิยม 8 หมวด ---
const CATEGORIES = [
  { name: 'สาธารณสุข', nameEn: 'Public Health', icon: '🏥', count: 2145, color: '#f87171' },
  { name: 'การศึกษา', nameEn: 'Education', icon: '📚', count: 1832, color: '#60a5fa' },
  { name: 'คมนาคม', nameEn: 'Transport', icon: '🚗', count: 1567, color: '#34d399' },
  { name: 'เศรษฐกิจ', nameEn: 'Economy', icon: '💰', count: 1423, color: '#fbbf24' },
  { name: 'สิ่งแวดล้อม', nameEn: 'Environment', icon: '🌿', count: 1298, color: '#a78bfa' },
  { name: 'ความปลอดภัย', nameEn: 'Safety', icon: '🛡️', count: 1156, color: '#fb923c' },
  { name: 'เทคโนโลยี', nameEn: 'Technology', icon: '💻', count: 987, color: '#2dd4bf' },
  { name: 'การเกษตร', nameEn: 'Agriculture', icon: '🌾', count: 876, color: '#f472b6' },
];

// --- ชุดข้อมูลอัปเดตล่าสุด 5 รายการ ---
const LATEST_DATASETS = [
  { title: 'สถิติผู้ป่วยไข้เลือดออกรายเดือน', titleEn: 'Monthly Dengue Fever Statistics', org: 'กรมควบคุมโรค', orgEn: 'Dept of Disease Control', date: '14 ก.ค. 2568', dateEn: '14 Jul 2025', category: 'สาธารณสุข', categoryEn: 'Public Health' },
  { title: 'ข้อมูลการจราจรทางถนนสายหลัก', titleEn: 'Main Road Traffic Data', org: 'กรมทางหลวง', orgEn: 'Dept of Highways', date: '13 ก.ค. 2568', dateEn: '13 Jul 2025', category: 'คมนาคม', categoryEn: 'Transport' },
  { title: 'สถิติผลสอบ O-NET รายจังหวัด', titleEn: 'O-NET Exam Results by Province', org: 'สทศ.', orgEn: 'NIETS', date: '13 ก.ค. 2568', dateEn: '13 Jul 2025', category: 'การศึกษา', categoryEn: 'Education' },
  { title: 'ดัชนีราคาผู้บริโภครายเดือน', titleEn: 'Monthly Consumer Price Index', org: 'กระทรวงพาณิชย์', orgEn: 'Ministry of Commerce', date: '12 ก.ค. 2568', dateEn: '12 Jul 2025', category: 'เศรษฐกิจ', categoryEn: 'Economy' },
  { title: 'ข้อมูลคุณภาพอากาศรายชั่วโมง', titleEn: 'Hourly Air Quality Data (PM2.5)', org: 'กรมควบคุมมลพิษ', orgEn: 'Pollution Control Dept', date: '12 ก.ค. 2568', dateEn: '12 Jul 2025', category: 'สิ่งแวดล้อม', categoryEn: 'Environment' },
];

// --- ชุดข้อมูลทั้งหมดสำหรับหน้าสำรวจ ---
const ORGANIZATIONS = ['กรมควบคุมโรค', 'กรมทางหลวง', 'สทศ.', 'กระทรวงพาณิชย์', 'กรมควบคุมมลพิษ', 'กรมอุตุนิยมวิทยา', 'สำนักงานสถิติแห่งชาติ', 'กรมพัฒนาที่ดิน', 'ธนาคารแห่งประเทศไทย', 'กรมส่งเสริมการเกษตร'];
const ORGANIZATIONS_EN = ['Dept of Disease Control', 'Dept of Highways', 'NIETS', 'Ministry of Commerce', 'Pollution Control Dept', 'Meteorological Dept', 'National Statistical Office', 'Land Development Dept', 'Bank of Thailand', 'Agricultural Extension Dept'];
const FORMATS = ['CSV', 'JSON', 'Excel', 'API'];
const FREQUENCIES = ['รายวัน', 'รายสัปดาห์', 'รายเดือน', 'รายไตรมาส', 'รายปี'];
const FREQUENCIES_EN = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual'];
const TAGS_LIST = ['สถิติ', 'สาธารณสุข', 'เศรษฐกิจ', 'การศึกษา', 'สิ่งแวดล้อม', 'คมนาคม', 'ประชากร', 'งบประมาณ', 'การเกษตร', 'เทคโนโลยี'];
const TAGS_LIST_EN = ['Statistics', 'Public Health', 'Economy', 'Education', 'Environment', 'Transport', 'Population', 'Budget', 'Agriculture', 'Technology'];

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
  const titlesEn = [
    'Monthly Dengue Fever Statistics', 'Main Road Traffic Volume Data',
    'O-NET Test Results by Province', 'Monthly Consumer Price Index',
    'Hourly Air Quality PM2.5 Data', 'Daily Rainfall Measurements',
    'Population Statistics by Province', 'National Budget Allocation Data',
    'Monthly Tourism Statistics', 'Agricultural Produce Price Data',
    'Quarterly Unemployment Rate', 'Number of Schools by Province',
    'Monthly Traffic Accident Statistics', 'Export Value by Country',
    'Metro Passenger Volume Statistics', 'Flood Area Data by Province',
    'Monthly Newborn Statistics', 'Public Debt Statistics',
    'Electricity Consumption Statistics', 'Buddhist Temples Nationwide',
    'Monthly Criminal Case Statistics', 'Elderly Population by Province',
    'Vaccination Statistics', 'Forest Area Statistics',
    'Internet Usage Statistics', 'Gross Provincial Product Data',
    'COVID-19 Patient Statistics', 'Main Highway Network Data',
    'Student Loan Fund Statistics', 'Tap Water Usage Statistics',
  ];
  const descs = [
    'ชุดข้อมูลแสดงจำนวนผู้ป่วยรายจังหวัด แยกรายเดือน พร้อมอัตราป่วยต่อแสนประชากร',
    'ข้อมูลปริมาณการจราจรบนถนนสายหลักทั่วประเทศ แยกตามช่วงเวลา',
    'ผลการสอบวัดผลมาตรฐานระดับชาติ แยกรายวิชาและจังหวัด',
    'ดัชนีราคาสินค้าและบริการสำหรับผู้บริโภค เทียบปีฐาน',
    'ข้อมูลวัดคุณภาพอากาศ PM2.5 และ AQI จากสถานีตรวจวัดทั่วประเทศ',
  ];
  const descsEn = [
    'Dataset displaying monthly patient count by province along with rate per 100,000 population',
    'Traffic volume data on major nationwide roads categorized by time periods',
    'National educational test results categorized by subject and province',
    'Consumer goods and services price index relative to base year',
    'PM2.5 and AQI air quality measurement data from nationwide monitoring stations',
  ];
  const results = [];
  for (let i = 0; i < count; i++) {
    const catIdx = i % CATEGORIES.length;
    const orgIdx = i % ORGANIZATIONS.length;
    const freqIdx = i % FREQUENCIES.length;
    const fmts = FORMATS.slice(0, 1 + Math.floor(Math.random() * FORMATS.length)).sort();
    results.push({
      id: i + 1,
      title: titles[i % titles.length],
      titleEn: titlesEn[i % titlesEn.length],
      description: descs[i % descs.length],
      descriptionEn: descsEn[i % descsEn.length],
      organization: ORGANIZATIONS[orgIdx],
      organizationEn: ORGANIZATIONS_EN[orgIdx],
      category: CATEGORIES[catIdx].name,
      categoryEn: CATEGORIES[catIdx].nameEn,
      lastUpdated: `${14 - (i % 14)} ก.ค. 2568`,
      lastUpdatedEn: `${14 - (i % 14)} Jul 2025`,
      frequency: FREQUENCIES[freqIdx],
      frequencyEn: FREQUENCIES_EN[freqIdx],
      formats: [...new Set(fmts)],
      downloads: Math.floor(Math.random() * 50000) + 500,
      year: 2568 - (i % 3),
      tags: [TAGS_LIST[catIdx], TAGS_LIST[(catIdx + 3) % TAGS_LIST.length]],
      tagsEn: [TAGS_LIST_EN[catIdx], TAGS_LIST_EN[(catIdx + 3) % TAGS_LIST_EN.length]],
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
  { region: 'ภาคเหนือ', regionEn: 'Northern', cases: 4520 },
  { region: 'ภาคตะวันออกเฉียงเหนือ', regionEn: 'Northeastern', cases: 6830 },
  { region: 'ภาคกลาง', regionEn: 'Central', cases: 8240 },
  { region: 'ภาคตะวันออก', regionEn: 'Eastern', cases: 3150 },
  { region: 'ภาคตะวันตก', regionEn: 'Western', cases: 2180 },
  { region: 'ภาคใต้', regionEn: 'Southern', cases: 5480 },
];

// ข้อมูลตามช่วงอายุ
const DENGUE_BY_AGE = [
  { range: '0-14 ปี', rangeEn: '0-14 yrs', cases: 7250, percent: 23.8 },
  { range: '15-24 ปี', rangeEn: '15-24 yrs', cases: 9120, percent: 29.9 },
  { range: '25-44 ปี', rangeEn: '25-44 yrs', cases: 8340, percent: 27.4 },
  { range: '45-64 ปี', rangeEn: '45-64 yrs', cases: 4210, percent: 13.8 },
  { range: '65 ปีขึ้นไป', rangeEn: '65+ yrs', cases: 1480, percent: 4.9 },
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
  { id: 'cases', label: 'จำนวนผู้ป่วย (ราย)', labelEn: 'Number of Patients' },
  { id: 'rate', label: 'อัตราต่อแสนประชากร', labelEn: 'Rate per 100k pop' },
  { id: 'trend', label: 'แนวโน้มเทียบปีก่อน (%)', labelEn: 'Year-over-Year Trend (%)' },
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
  const lang = (typeof window !== 'undefined' && window.getCurrentLang && window.getCurrentLang() === 'en') ? 'en-US' : 'th-TH';
  return new Intl.NumberFormat(lang).format(n);
}
