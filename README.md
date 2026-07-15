<div align="center">
  <h1>🇹🇭 Open Data ไทย (<span lang="en">Open Thai Data Dashboard</span>)</h1>
  <p><strong>แพลตฟอร์มศูนย์รวมข้อมูลเปิดภาครัฐ เพื่อการวิเคราะห์และตัดสินใจบนรากฐานข้อมูลเชิงประจักษ์ ที่ทุกคนเข้าถึงได้อย่างเท่าเทียม</strong></p>
  
  [![WCAG 2.2 AAA Compliant](https://img.shields.io/badge/WCAG%202.2-AAA%20Compliant-10B981?style=for-the-badge&logo=w3c&logoColor=white)](https://www.w3.org/WAI/WCAG2AAA-Conformance)
  [![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![HTML5 & CSS3](https://img.shields.io/badge/HTML5%20%26%20CSS3-Design%20System-143694?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://otdata.vercel.app/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

  <br />
  <a href="https://otdata.vercel.app/"><strong>🔗 เข้าสู่เว็บไซต์ Demo (Live Preview) »</strong></a>
  <br /><br />
</div>

---

## 📋 ภาพรวมระบบ (<span lang="en">Overview</span>)

**Open Data ไทย** คือต้นแบบระบบหน้ากระดานข้อมูลเชิงสถิติ (Statistical Data Dashboard) ที่ได้รับการออกแบบและพัฒนาภายใต้มาตรฐานสากล **WCAG 2.2 ระดับ AAA (Web Content Accessibility Guidelines Level AAA)** ซึ่งเป็นระดับสูงสุดของการออกแบบเว็บไซต์เพื่อให้ผู้ใช้งานทุกคน ไม่ว่าจะเป็นผู้พิการทางสายตา ผู้มีความบกพร่องทางการได้ยิน การเคลื่อนไหว หรือผู้สูงอายุ สามารถเข้าถึงและใช้งานข้อมูลสถิติภาครัฐได้อย่างมีประสิทธิภาพและเท่าเทียม 100%

ระบบถูกสร้างขึ้นด้วยเทคโนโลยีพื้นฐานที่ทันสมัยและมีประสิทธิภาพสูง (**Zero-Dependency Vanilla Architecture:** HTML5, CSS3, ES6+) โดยไม่พึ่งพา External UI Framework หรือ Library ขนาดใหญ่ ทำให้เว็บไซต์โหลดได้อย่างรวดเร็ว รองรับการแสดงผลทุกอุปกรณ์ และมีความเสถียรสูงสุด

---

## ✨ จุดเด่นและคุณสมบัติหลัก (<span lang="en">Key Features & Highlights</span>)

### 🥇 1. ผ่านมาตรฐานการเข้าถึงสูงสุดระดับสากล (`WCAG 2.2 Level AAA`)
* **🎨 อัตราส่วนความเปรียบต่างสีระดับสูง (High Contrast Ratios >= 7:1):** โครงสร้างสีทั้งหมดผ่านการคำนวณและตรวจสอบด้วยเครื่องมือมาตรฐานสากล (axe-core, WAVE, Lighthouse) โดยข้อความทั่วไปมีอัตราส่วนความคมชัดสูงกว่า `7:1` (AAA) และข้อความขนาดใหญ่สูงกว่า `4.5:1` (AAA) ในทุกโหมดสี พร้อมจัดการสไตล์ปุ่มปิดใช้งาน (`disabled`) ให้คงความคมชัดสูงสุดโดยไม่เกิดปัญหา Contrast ต่ำ
* **👆 ขนาดพื้นที่เป้าหมายสัมผัสปลอดภัย (`Target Size >= 44x44px`):** ปุ่มกด ลิงก์ และองค์ประกอบที่โต้ตอบได้ทุกจุด ถูกออกแบบให้มีพื้นที่สัมผัสไม่น้อยกว่า 44x44 พิกเซลตามเกณฑ์ WCAG 2.5.5 AAA
* **⌨️ รองรับการนำทางด้วยคีย์บอร์ด 100% (`Full Keyboard Navigation`):** สามารถใช้งานเว็บไซต์ได้ครบทุกฟังก์ชันผ่านปุ่ม `Tab`, `Shift + Tab`, `Enter`, `Space` และ `Arrow Keys` โดยมีกรอบโฟกัส (Focus Ring) ที่เด่นชัดและไม่มีกับดักโฟกัส (No Focus Trap)
* **🗣️ เข้ากันได้กับโปรแกรมอ่านหน้าจอ (`Screen Reader Friendly`):** โครงสร้าง HTML5 ถูกต้องตามหลักความหมาย (Semantic HTML) พร้อมป้ายกำกับ `ARIA Labels`, `aria-expanded`, `aria-current` และระบบการแจ้งเตือนสด (`Live Regions / Toasts`)

### 🧰 2. ศูนย์รวมเครื่องมือช่วยเหลือการเข้าถึง (`Accessibility Suite & Live Audit`)
* **♿ เครื่องมือเข้าถึงด่วน (`Floating Widget & Quick Actions`):** แถบเครื่องมือลอยที่ช่วยให้ผู้ใช้สามารถปรับแต่งหน้าเว็บตามความต้องการได้ทันที:
  * **🔤 ปรับขนาดตัวอักษร:** ปรับขนาดอักษรได้ 3 ระดับ (`ปกติ`, `ใหญ่ +15%`, `ใหญ่มาก +30%`) โดยโครงสร้างหน้าเว็บไม่แตก และรองรับการซูมขยายของเบราว์เซอร์ถึง 400% โดยไม่ต้องเลื่อนแนวนอน
  * **💡 โหมดสีและความเปรียบต่างสูง 5 รูปแบบ:** โหมดสว่าง (`Light`), โหมดมืด (`Dark`), โหมดความเปรียบต่างสูงอักษรเหลืองพื้นดำ (`High Contrast Yellow`), โหมดอักษรขาวพื้นดำ (`High Contrast White`) และโหมดขาวดำ (`Monochrome`)
  * **👆 ตัวช่วยการมองเห็นและโฟกัส (`Visual Aids`):** เปิด/ปิดขยายขนาดเคอร์เซอร์ (`Cursor Enhancement`), ไม้บรรทัดช่วยอ่าน (`Reading Mask`) และไฮไลต์ขีดเส้นใต้ลิงก์/หัวข้อทั้งหมด (`Highlight Headings & Links`)
  * **🔊 เสียงอ่านและการเคลื่อนไหว (`Audio & Motion`):** เปิดระบบอ่านข้อความด้วยเสียง (`Screen Reader Mode`) และปุ่มลดการเคลื่อนไหว/แอนิเมชัน (`Reduce Motion`)
* **📊 รายงานตรวจสอบการเข้าถึงแบบเรียลไทม์ (`Interactive Automated Audit Report`):** ระบบตรวจเช็คสถานะ WCAG ของหน้าเว็บขณะทำงานจริง พร้อมสรุปผลคะแนนและจุดที่ผ่านเกณฑ์ AAA อย่างชัดเจน

### 🌐 3. รองรับสองภาษาเรียลไทม์ (`Real-Time Bilingual i18n — TH / EN`)
* สลับภาษาไทย (`ไทย`) และภาษาอังกฤษ (`English`) ได้ทันทีโดยไม่ต้องรีโหลดหน้าเว็บ พร้อมปรับเปลี่ยนป้ายกำกับสำหรับโปรแกรมอ่านหน้าจอ (`ARIA Labels`) และคำอธิบายกราฟให้ตรงตามภาษาที่เลือกโดยอัตโนมัติ

### 📈 4. เครื่องมือวิเคราะห์และการแสดงผลเชิงลึก (`Data Exploration & Visualizations`)
* **หน้าหลัก (`index.html`):** สรุปตัวเลขสถิติสำคัญพร้อมเอฟเฟกต์นับเลข (`CountUp`), กราฟแนวโน้มการใช้งาน 12 เดือน, หมวดข้อมูลยอดนิยม 8 หมวด และรายการชุดข้อมูลอัปเดตล่าสุด
* **สำรวจชุดข้อมูล (`explore.html`):** คลังชุดข้อมูลทั้งหมด พร้อมระบบค้นหาแบบเรียลไทม์, ตัวกรองตามหมวดหมู่และรูปแบบไฟล์ (`CSV`, `JSON`, `API`, `GeoJSON`, `XLSX`), แท็กสถานะ และระบบแบ่งหน้าที่รองรับ WCAG
* **แสดงผลด้วยภาพ (`visualization.html`):** เครื่องมือสร้างกราฟเชิงโต้ตอบ สามารถเลือกรูปแบบการแสดงผล (`Bar Chart`, `Line Chart`, `Pie Chart`), ดูข้อมูลสรุปเชิงลึก และกดดูตารางข้อมูลกำกับกราฟเพื่อความเท่าเทียม
* **ตารางข้อมูลเชิงลึก (`data-table.html`):** ตารางข้อมูลสถิติขนาดใหญ่ที่รองรับการเรียงลำดับข้อมูล (`Multi-column Sorting`), การค้นหา และการนำทางด้วยคีย์บอร์ดบนตาราง
* **เปรียบเทียบข้อมูลเชิงสถิติ (`compare.html`):** เครื่องมือเปรียบเทียบข้อมูลสถิติรายจังหวัด (เช่น ผู้ป่วยไข้เลือดออก) แบบเคียงข้างกัน (`Side-by-Side Comparison`) พร้อมกราฟแท่งเปรียบเทียบและบทวิเคราะห์อัตโนมัติ

---

## 🏗️ โครงสร้างโปรเจกต์ (`Project Architecture`)

```text
WCAG/
├── index.html               # หน้าหลัก (Home Dashboard & Statistics)
├── explore.html             # หน้าสำรวจและค้นหาชุดข้อมูล (Dataset Catalog)
├── visualization.html       # หน้าแสดงผลด้วยภาพและกราฟโต้ตอบ (Interactive Visualizations)
├── data-table.html          # หน้าตารางข้อมูลเชิงลึก (Data Table & Sorting)
├── compare.html             # หน้าเปรียบเทียบสถิติรายจังหวัด (Provincial Data Comparison)
├── css/
│   ├── styles.css           # Design Tokens, Color Variables, Grid Layouts & Animations
│   └── components.css       # Core UI Components, Buttons, Cards, Charts, WCAG Drawer & Audit UI
└── js/
    ├── i18n.js              # ระบบจัดการภาษา (Internationalization — TH / EN)
    ├── wcag-suite.js        # แผงเครื่องมือช่วยเหลือการเข้าถึง, Floating Widget และระบบ Audit สด
    ├── chart.js             # Engine วาดกราฟเชิงสถิติ (Canvas/DOM Accessible Charting)
    ├── data.js              # ฐานข้อมูลจำลอง (Mockup Datasets, Categories & Statistics)
    ├── main.js              # Shared Logic, Navigation, Pagination & Theme Controls
    └── home.js              # Logic เฉพาะสำหรับหน้าหลัก (Counter Animation & Trend Chart)
```

---

## 🎨 ระบบสีและ Design System (`WCAG 2.2 AAA Color Palette`)

ระบบสีถูกออกแบบโดยใช้ **CSS Custom Properties (Variables)** เพื่อให้เปลี่ยนโหมดสีได้อย่างราบรื่น โดยรักษาระดับความเปรียบต่างสีให้ผ่านเกณฑ์ **AAA (> 7:1 สำหรับข้อความทั่วไป และ > 4.5:1 สำหรับข้อความใหญ่)** เสมอ:

| โหมดสี (`data-theme`) | พื้นหลังหลัก (`--color-bg`) | สีตัวอักษรหลัก (`--color-text`) | อัตราส่วนความเปรียบต่างสี (Contrast Ratio) | สถานะ WCAG |
| :--- | :--- | :--- | :--- | :--- |
| **Light Theme** (สว่าง) | `#f8fafc` | `#0f172a` | **`17.8:1`** | `AAA Pass` 🟢 |
| **Dark Theme** (มืด) | `#080e1a` | `#f8fafc` | **`18.4:1`** | `AAA Pass` 🟢 |
| **High Contrast Yellow** | `#000000` | `#ffff00` | **`19.5:1`** | `AAA Pass` 🟢 |
| **High Contrast White** | `#000000` | `#ffffff` | **`21.0:1`** | `AAA Pass` 🟢 |
| **Monochrome** (ขาวดำ) | `#e2e8f0` | `#0f172a` | **`15.8:1`** | `AAA Pass` 🟢 |

---

## 🚀 การเริ่มต้นใช้งานและการติดตั้ง (`Getting Started & Deployment`)

เนื่องจากโปรเจกต์นี้ถูกพัฒนาแบบ **Pure HTML / CSS / JS** คุณจึงสามารถเปิดรันได้ทันทีโดยไม่ต้องติดตั้ง Dependency หรือทำการ Build ใดๆ ทั้งสิ้น

### 1. การรันบนเครื่องเซิร์ฟเวอร์จำลองส่วนตัว (`Local Development`)

สามารถเลือกใช้ Web Server ง่ายๆ ที่คุณมีในเครื่องได้ทันที:

#### วิธีที่ A: ใช้ Python (แนะนำ)
```bash
# โหลดโค้ดหรือเข้าสู่แฟ้มโปรเจกต์
cd path/to/WCAG

# รัน Local Server ด้วย Python 3
python3 -m http.server 8000

# เปิดเบราว์เซอร์ไปที่: http://localhost:8000
```

#### วิธีที่ B: ใช้ Node.js (`npx serve`)
```bash
npx serve .
# เปิดเบราว์เซอร์ไปที่ URL ที่ปรากฏในเทอร์มินัล (เช่น http://localhost:3000)
```

#### วิธีที่ C: VS Code Live Extension
* เปิดโฟลเดอร์โปรเจกต์ใน **Visual Studio Code**
* ติดตั้ง Extension **Live Server** (โดย Ritwick Dey)
* คลิกขวาที่ `index.html` แล้วเลือก **"Open with Live Server"**

---

### 2. การนำขึ้นแสดงผลจริงบน `Vercel` (`Production Deployment`)

โปรเจกต์ได้รับการตั้งค่าให้พร้อมทำงานร่วมกับ **Vercel** ได้ทันที:
1. ทำการเชื่อมต่อ Git Repository นี้เข้ากับ [Vercel Dashboard](https://vercel.com/)
2. ตั้งค่า Framework Preset เป็น **Other / Static HTML**
3. คลิก **Deploy** — เว็บไซต์ของคุณพร้อมให้บริการออนไลน์ทันทีด้วยความเร็วสูงสุด

---

## 🛠️ วิธีทดสอบฟังก์ชันการเข้าถึง (`Testing Accessibility Features`)

1. **ทดสอบด้วยคีย์บอร์ด (`Keyboard Only Navigation`):**
   * กดปุ่ม `Tab` จากแถบ URL เบราว์เซอร์ จะพบ **"ปุ่มข้ามไปยังเนื้อหาหลัก (Skip to Main Content)"** ปรากฏขึ้นมุมบนซ้าย กด `Enter` เพื่อข้ามเมนูนำทางไปยังเนื้อหาทันที
   * กด `Tab` หรือ `Shift + Tab` เพื่อเลื่อนกรอบโฟกัส (Focus Ring สีน้ำเงินชัดเจน) ไปยังปุ่มและลิงก์ต่างๆ
   * ใช้ `Arrow Keys` (`⬆️` `⬇️` `⬅️` `➡️`) เพื่อเลื่อนเลือกแท็บหรือเมนูภายใน
2. **ทดสอบแผงตั้งค่า WCAG Suite:**
   * คลิกปุ่มลอยมุมขวาล่าง **"♿ เครื่องมือเข้าถึง"** หรือกดปุ่ม `💡`, `👆`, `📏` บนแถบส่วนหัว
   * ลองปรับเปลี่ยนโหมดสีเป็น **"อักษรเหลืองพื้นดำ (High Contrast Yellow)"** และปรับขนาดตัวอักษรเป็น **"ใหญ่มาก (Extra Large +30%)"** เพื่อทดสอบความยืดหยุ่นของ Layout
3. **ตรวจสอบรายงาน Audit สด:**
   * ในแถบลิ้นชักตั้งค่า WCAG ให้เลือกแท็บ **"รายงานตรวจสอบ (Audit)"** เพื่อดูคะแนนความสอดคล้องตามมาตรฐาน WCAG 2.2 AAA แบบเรียลไทม์บนหน้าเว็บปัจจุบันของคุณ

---

## 🛡️ มาตรฐานระบบและข้อจำกัดรับผิดชอบ (`Standards & Disclaimer`)

* **มาตรฐานระบบ:** นำทางภายใต้ข้อกำหนด [W3C Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) ระดับ **AAA**
* **ข้อมูลสาธิต:** ข้อมูลสถิติ ตัวเลขสถิติผู้ป่วย และรายชื่อชุดข้อมูลทั้งหมดภายในแพลตฟอร์มนี้เป็น **ข้อมูลจำลอง (`Mockup Data`)** ที่จัดทำขึ้นเพื่อวัตถุประสงค์ในการศึกษา การสาธิตงานออกแบบ และการทดสอบระบบการเข้าถึงเท่านั้น ไม่ใช่ข้อมูลราชการจริง

---

## 📄 ลิขสิทธิ์ (`License`)

โปรเจกต์นี้เผยแพร่ภายใต้สัญญาอนุญาต [MIT License](LICENSE) — สามารถนำไปศึกษา ดัดแปลง และต่อยอดเพื่อประโยชน์สาธารณะและการพัฒนาเว็บไซต์ที่ทุกคนเข้าถึงได้อย่างอิสระ

<br />
<div align="center">
  <p>💡 <strong>ร่วมสร้างสรรค์สังคมดิจิทัลที่ไม่ทิ้งใครไว้ข้างหลัง — Built with ❤️ for Accessibility & Inclusion</strong></p>
</div>
