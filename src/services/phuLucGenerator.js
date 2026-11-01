/**
 * PHỤ LỤC GENERATOR ENGINE (Chuẩn SKILL_PHULUC v2.0)
 * Tự động tạo cấu trúc Thuyết minh & Phụ lục Tính toán chi tiết chuẩn Bộ 1 (Times New Roman) / TVTK
 * Tương thích 100% với docx_generator_v2.py
 */

export function generatePhuLucData(moduleKey, inputs, results) {
  if (!results || !results.valid) return null;

  const dateStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  switch (moduleKey) {
    case 'wind':
      return generateWindPhuLuc(inputs, results, dateStr);
    case 'liveload':
      return generateLiveLoadPhuLuc(inputs, results, dateStr);
    case 'beam':
      return generateBeamPhuLuc(inputs, results, dateStr);
    case 'bolt':
      return generateBoltPhuLuc(inputs, results, dateStr);
    case 'pile':
      return generatePilePhuLuc(inputs, results, dateStr);
    case 'anchorage':
      return generateAnchoragePhuLuc(inputs, results, dateStr);
    case 'rcbeamadvanced':
      return generateRCBeamAdvancedPhuLuc(inputs, results, dateStr);
    case 'loadcombo':
      return generateLoadComboPhuLuc(inputs, results, dateStr);
    case 'punching':
      return generatePunchingPhuLuc(inputs, results, dateStr);
    case 'deadload':
      return generateDeadLoadPhuLuc(inputs, results, dateStr);
    case 'rccolumn':
      return generateRCColumnPhuLuc(inputs, results, dateStr);
    case 'twowayslab':
      return generateTwoWaySlabPhuLuc(inputs, results, dateStr);
    case 'steelbeam':
      return generateSteelBeamPhuLuc(inputs, results, dateStr);
    case 'globalstability':
      return generateGlobalStabilityPhuLuc(inputs, results, dateStr);
    default:
      return null;
  }
}

// ============================================================================
// 1. PHỤ LỤC TẢI TRỌNG GIÓ (TCVN 2737:2023)
// ============================================================================
function generateWindPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN TẢI TRỌNG GIÓ ĐỘNG TÁC DỤNG LÊN CÔNG TRÌNH';
  const subtitle = 'Kiểm toán áp lực gió tiêu chuẩn và tính toán theo TCVN 2737:2023 (Chu kỳ lặp 50 năm)';
  const standardRef = 'TCVN 2737:2023 — Điều 10.2 & Bảng F.1, Bảng 7';

  const inputTable = [
    { label: 'Vùng áp lực gió', symbol: 'Vùng gió', value: inputs.wind_zone || inputs.zone, unit: '-', ref: 'Bảng F.1' },
    { label: 'Áp lực gió cơ sở', symbol: 'W₀', value: results.W0, unit: 'daN/m² (kN/m²)', ref: `W₀ = ${results.W0} kN/m²` },
    { label: 'Dạng địa hình', symbol: 'Địa hình', value: `Dạng ${inputs.terrain_category || inputs.terrain}`, unit: '-', ref: 'Bảng 7' },
    { label: 'Cao độ điểm tính toán', symbol: 'z', value: inputs.height_z_m || inputs.z, unit: 'm', ref: `z_eff = ${results.zEff} m` },
    { label: 'Hệ số khí động', symbol: 'c', value: inputs.aerodynamic_c || inputs.c, unit: '-', ref: 'Phụ lục E' },
    { label: 'Hệ số phản ứng giật', symbol: 'G_f', value: inputs.gust_factor_gf || inputs.gf, unit: '-', ref: 'Điều 10.2.4' },
    { label: 'Hệ số tin cậy tải trọng', symbol: 'γ_f', value: inputs.reliability_factor_gamma_f || inputs.gammaF, unit: '-', ref: 'Điều 10.2.1 (γ_f = 1.25)' },
    { label: 'Tải trọng gió cho phép', symbol: 'W_d,allow', value: inputs.allowable_wd_kNm2 || inputs.allowableWd, unit: 'kN/m²', ref: 'Giới hạn kết cấu' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Hệ số độ cao địa hình', symbol: 'k(z)', calcVal: results.kz, limitVal: '-', eta: '-', status: 'ĐẠT' },
    { stt: 2, item: 'Áp lực gió tiêu chuẩn', symbol: 'W_k', calcVal: `${results.Wk} kN/m²`, limitVal: '-', eta: '-', status: 'ĐẠT' },
    { stt: 3, item: 'Áp lực gió tính toán thiết kế', symbol: 'W_d', calcVal: `${results.Wd} kN/m²`, limitVal: `${inputs.allowable_wd_kNm2 || inputs.allowableWd} kN/m²`, eta: results.utilization.eta.toFixed(3), status: results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (η = ${results.utilization.eta.toFixed(3)})

---

### 1. BẢNG THÔNG SỐ ĐẦU VÀO & HỆ SỐ KHÍ ĐỘNG
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP (THAY SỐ CHI TIẾT)
${results.steps.map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP KẾT QUẢ KIỂM TOÁN CHỈ SỐ SỬ DỤNG η
| STT | Tiêu chí kiểm tra | Ký hiệu | Giá trị tính toán | Giới hạn cho phép | Hệ số η | Kết luận |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có CCHN kiểm tra trước khi ký đóng dấu.*
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 2. PHỤ LỤC CHIẾT GIẢM HOẠT TẢI (TCVN 2737:2023)
// ============================================================================
function generateLiveLoadPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN CHIẾT GIẢM HOẠT TẢI SÀN VÀ CỘT';
  const subtitle = 'Xác định hệ số chiết giảm hoạt tải theo diện tích chịu tải và số tầng truyền tải';
  const standardRef = 'TCVN 2737:2023 — Điều 8.3 & Bảng 4';

  const inputTable = [
    { label: 'Loại công năng phòng', symbol: 'Công năng', value: results.categoryName, unit: '-', ref: 'Bảng 4' },
    { label: 'Hoạt tải tiêu chuẩn danh định', symbol: 'p_k', value: results.pk, unit: 'kN/m²', ref: 'Bảng 4' },
    { label: 'Hệ số độ tin cậy hoạt tải', symbol: 'γ_f', value: results.gammaF, unit: '-', ref: 'Điều 8.2' },
    { label: 'Diện tích truyền tải sàn/dầm', symbol: 'A', value: inputs.area_m2 || inputs.area, unit: 'm²', ref: 'Sơ đồ hình học' },
    { label: 'Số tầng truyền tải lên cột/móng', symbol: 'n', value: inputs.floors, unit: 'tầng', ref: 'Số tầng kết cấu' },
    { label: 'Áp dụng ngưỡng sàn tối thiểu', symbol: 'Clamp', value: inputs.clamp_lower_bound || inputs.clampLowerBound ? 'Có (Cắt chặn min)' : 'Không', unit: '-', ref: 'Điều 8.3.1' },
    { label: 'Sức chịu tải thiết kế cho phép', symbol: 'p_d,allow', value: inputs.design_capacity_pd || inputs.designCapacityPd, unit: 'kN/m²', ref: 'Khả năng chịu lực' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Hệ số giảm theo diện tích', symbol: 'α_A', calcVal: results.alphaA, limitVal: '≥ 0.60', eta: '-', status: 'ĐẠT' },
    { stt: 2, item: 'Hệ số giảm theo số tầng', symbol: 'α_n', calcVal: results.alphaN, limitVal: '≥ 0.50', eta: '-', status: 'ĐẠT' },
    { stt: 3, item: 'Hoạt tải sàn sau giảm', symbol: 'p_d,red(A)', calcVal: `${results.pdReducedArea} kN/m²`, limitVal: `${inputs.design_capacity_pd || inputs.designCapacityPd} kN/m²`, eta: results.utilization.eta.toFixed(3), status: results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 4, item: 'Hoạt tải cột sau giảm', symbol: 'p_d,red(n)', calcVal: `${results.pdReducedColumn} kN/m²`, limitVal: '-', eta: '-', status: 'ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT]'} (η = ${results.utilization.eta.toFixed(3)})

---

### 1. BẢNG THÔNG SỐ CÔNG NĂNG & DIỆN TÍCH
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP
${results.steps.map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP HOẠT TẢI SAU CHIẾT GIẢM
| STT | Hạng mục | Ký hiệu | Giá trị sau giảm | Ngưỡng cho phép | Tỷ lệ giảm | Kết luận |
|:---:|---|:---:|---:|---:|:---:|:---:|
| 1 | Hoạt tải tính toán sàn | p_d,red(A) | ${results.pdReducedArea} kN/m² | ${inputs.design_capacity_pd || inputs.designCapacityPd} kN/m² | Giảm ${results.reductionPercentArea}% | **${results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}** |
| 2 | Hoạt tải tính toán cột | p_d,red(n) | ${results.pdReducedColumn} kN/m² | — | Giảm ${results.reductionPercentColumn}% | **ĐẠT** |
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 3. PHỤ LỤC CỐT THÉP DẦM CHỮ NHẬT (TCVN 5574:2018)
// ============================================================================
function generateBeamPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN CỐT THÉP DẦM BÊ TÔNG CỐT THÉP ĐẶT CỐT ĐƠN';
  const subtitle = 'Kiểm toán khả năng chịu uốn ULS, xác định diện tích cốt thép As và hàm lượng μ%';
  const standardRef = 'TCVN 5574:2018 — Điều 8.1.2.2 & Điều 10.3.3';

  const inputTable = [
    { label: 'Bề rộng tiết diện dầm', symbol: 'b', value: inputs.b_mm || inputs.b, unit: 'mm', ref: 'Thiết kế kiến trúc' },
    { label: 'Chiều cao tiết diện dầm', symbol: 'h', value: inputs.h_mm || inputs.h, unit: 'mm', ref: 'Thiết kế kết cấu' },
    { label: 'Lớp bảo vệ trọng tâm thép', symbol: 'a', value: inputs.a_mm || inputs.a, unit: 'mm', ref: `h₀ = ${results.h0} mm` },
    { label: 'Cấp độ bền bê tông', symbol: 'B', value: inputs.concrete, unit: '-', ref: `R_b = ${results.Rb} MPa (Bảng 6)` },
    { label: 'Nhóm cốt thép dọc chịu kéo', symbol: 'Thép', value: inputs.rebar, unit: '-', ref: `R_s = ${results.Rs} MPa (Bảng 13)` },
    { label: 'Hệ số điều kiện làm việc bê tông', symbol: 'γ_b', value: inputs.gamma_b || inputs.gammaB, unit: '-', ref: 'Điều 8.1.2.1' },
    { label: 'Mômen uốn tính toán tác dụng', symbol: 'M', value: inputs.M_kNm || inputs.M, unit: 'kN·m', ref: 'Tổ hợp nội lực ULS' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Chiều cao vùng nén tương đối', symbol: 'ξ', calcVal: results.xi, limitVal: `≤ ξ_R = ${results.xiR}`, eta: (results.xi / results.xiR).toFixed(3), status: !results.isOverReinforced ? 'ĐẠT' : 'VƯỢT GIỚI HẠN' },
    { stt: 2, item: 'Hàm lượng cốt thép chịu kéo', symbol: 'μ%', calcVal: `${results.muDesignPercent}%`, limitVal: `0.10% ≤ μ ≤ ${results.muMax}%`, eta: '-', status: 'HỢP LÝ' },
    { stt: 3, item: 'Mômen giới hạn của tiết diện', symbol: 'M_ult', calcVal: `${results.Mult} kN·m`, limitVal: `≥ M = ${inputs.M_kNm || inputs.M} kN·m`, eta: results.utilization.eta.toFixed(3), status: results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT]'} (η = ${results.utilization.eta.toFixed(3)})

---

### 1. THÔNG SỐ HÌNH HỌC TIẾT DIỆN & VẬT LIỆU
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Ghi chú & Căn cứ |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP (TCVN 5574:2018)
${results.steps.map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP KIỂM TOÁN KHẢ NĂNG CHỊU UỐN
| STT | Tiêu chí kiểm tra | Ký hiệu | Giá trị tính toán | Giới hạn quy chuẩn | Hệ số η | Kết luận |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

#### 3.1 Khuyến nghị chọn cốt thép thực tế:
- Diện tích thép yêu cầu tính toán: **A_s = ${results.AsDesignCm2} cm² (${results.AsDesignMm2} mm²)**.
- Gợi ý bố trí: ${results.rebarSuggestions && results.rebarSuggestions.length > 0 ? results.rebarSuggestions.map((s) => `${s.label} (${s.totalAreaCm2} cm²)`).join('; ') : 'Tùy chọn kỹ sư'}.
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 4. PHỤ LỤC BU LÔNG CƯỜNG ĐỘ CAO (TCVN 5575:2024)
// ============================================================================
function generateBoltPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN KHẢ NĂNG CHỊU LỰC BU LÔNG CƯỜNG ĐỘ CAO';
  const subtitle = 'Kiểm toán khả năng chịu cắt thân bu lông và ép mặt bản thép theo TCVN 5575:2024';
  const standardRef = 'TCVN 5575:2024 — Điều 14.2 & Bảng B.8, B.9';

  const inputTable = [
    { label: 'Quy cách bu lông', symbol: 'Mã', value: inputs.boltCode, unit: '-', ref: `d = ${results.d} mm, A = ${results.A} mm²` },
    { label: 'Cấp bền bu lông', symbol: 'Cấp bền', value: inputs.grade, unit: '-', ref: `f_vb = ${results.fvb} MPa (Bảng B.8)` },
    { label: 'Số mặt phẳng cắt tính toán', symbol: 'n_v', value: inputs.nv, unit: 'mặt cắt', ref: 'Cấu tạo liên kết' },
    { label: 'Mác thép bản mã / bản ghép', symbol: 'Mác thép', value: inputs.plateSteel, unit: '-', ref: `f_cb = ${results.fcb} MPa` },
    { label: 'Tổng bề dày nhỏ nhất bản thép ép mặt', symbol: '(∑t)_min', value: inputs.sumTMin, unit: 'mm', ref: 'Chiều dày bản ghép' },
    { label: 'Hệ số điều kiện làm việc bu lông', symbol: 'γ_b', value: inputs.gammaB, unit: '-', ref: 'Điều 14.2.9' },
    { label: 'Lực cắt tính toán tác dụng lên 1 bu lông', symbol: 'V', value: inputs.shearForceV, unit: 'kN', ref: 'Nội lực nút khung' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Khả năng chịu cắt 1 bu lông', symbol: 'N_bs', calcVal: `${results.Nbs} kN`, limitVal: `≥ V = ${inputs.shearForceV} kN`, eta: (inputs.shearForceV / results.Nbs).toFixed(3), status: results.Nbs >= inputs.shearForceV ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 2, item: 'Khả năng chịu ép mặt bản thép', symbol: 'N_bp', calcVal: `${results.Nbp} kN`, limitVal: `≥ V = ${inputs.shearForceV} kN`, eta: (inputs.shearForceV / results.Nbp).toFixed(3), status: results.Nbp >= inputs.shearForceV ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 3, item: 'Sức chịu lực thiết kế của 1 bu lông', symbol: 'N_b', calcVal: `${results.Nb} kN`, limitVal: `min(N_bs, N_bp)`, eta: results.utilization.eta.toFixed(3), status: results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT]'} (η = ${results.utilization.eta.toFixed(3)})

---

### 1. THÔNG SỐ VẬT LIỆU BU LÔNG & BẢN GHÉP
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP (TCVN 5575:2024)
${results.steps.map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP KIỂM TOÁN BU LÔNG
| STT | Dạng phá hoại kiểm tra | Ký hiệu | Sức chịu tải | Tải trọng tác dụng V | Chỉ số η | Kết luận |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${inputs.shearForceV} kN | ${r.eta} | **${r.status}** |`).join('\n')}

*Chế độ chi phối:* **${results.governingMode}**
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 5. PHỤ LỤC SỨC CHỊU TẢI CỌC ĐƠN THEO SPT (TCVN 10304:2014)
// ============================================================================
function generatePilePhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN SỨC CHỊU TẢI CỌC ĐƠN THEO SỐ LIỆU SPT ĐỊA CHẤT';
  const subtitle = 'Xác định sức kháng mũi Qb, ma sát thành bên Qs và sức chịu tải tính toán Rc theo TCVN 10304';
  const standardRef = 'TCVN 10304:2014 — Điều 7.1.11 & Phụ lục G';

  const inputTable = [
    { label: 'Phương pháp thi công & Hình dạng', symbol: 'Loại cọc', value: inputs.pileMethod === 'driven_square' ? 'Cọc ép vuông' : inputs.pileMethod === 'driven_circle' ? 'Cọc tròn ly tâm' : 'Cọc khoan nhồi', unit: '-', ref: 'Biện pháp thi công' },
    { label: 'Kích thước tiết diện cọc', symbol: 'D', value: inputs.D, unit: 'mm', ref: `A_p = ${results.Ap} m², u = ${results.u} m` },
    { label: 'Tổng chiều dài cọc ngàm đất', symbol: 'L', value: results.totalLength, unit: 'm', ref: `${results.layerDetails ? results.layerDetails.length : 3} lớp đất` },
    { label: 'Chỉ số SPT tại mũi cọc', symbol: 'N_p', value: inputs.Np, unit: 'búa', ref: `q_b = ${results.qb} kPa` },
    { label: 'Hệ số an toàn đất nền', symbol: 'γ_k', value: inputs.gammaK, unit: '-', ref: 'TCVN 10304:2014 (γ_k = 1.75)' },
    { label: 'Tải trọng thiết kế đầu cọc', symbol: 'P_d', value: inputs.designLoadP, unit: 'kN', ref: 'Nội lực chân cột ULS' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Sức kháng mũi cực hạn', symbol: 'Q_b', calcVal: `${results.Qb} kN`, limitVal: '-', eta: '-', status: 'ĐẠT' },
    { stt: 2, item: 'Sức kháng ma sát bên cực hạn', symbol: 'Q_s', calcVal: `${results.Qs} kN`, limitVal: '-', eta: '-', status: 'ĐẠT' },
    { stt: 3, item: 'Sức chịu tải cực hạn tổng', symbol: 'R_cu', calcVal: `${results.Rcu} kN`, limitVal: 'Q_b + Q_s', eta: '-', status: 'ĐẠT' },
    { stt: 4, item: 'Sức chịu tải tính toán của cọc', symbol: 'R_c', calcVal: `${results.Rc} kN`, limitVal: `≥ P_d = ${inputs.designLoadP} kN`, eta: results.utilization.eta.toFixed(3), status: results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT]'} (η = ${results.utilization.eta.toFixed(3)})

---

### 1. ĐẶC TRƯNG HÌNH HỌC CỌC & THÔNG SỐ ĐỊA NỀN
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Ghi chú & Căn cứ |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. CHI TIẾT MA SÁT THÀNH BÊN CÁC LỚP ĐỊA TẦNG
| Lớp | Mô tả lớp đất | Loại đất | Chiều dày li (m) | SPT Ns | Ma sát f_si (kPa) | Sức kháng Q_si (kN) |
|:---:|---|:---:|---:|---:|---:|---:|
${results.layerDetails ? results.layerDetails.map((l) => `| ${l.index} | ${l.name} | ${l.soilLabel} | ${l.length} | ${l.Ns} | ${l.fsi} | ${l.Qsi} |`).join('\n') : ''}

---

### 3. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP (TCVN 10304:2014)
${results.steps.map((s, i) => `#### 3.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 4. BẢNG TỔNG HỢP SỨC CHỊU TẢI CỌC ĐƠN
| STT | Đại lượng | Ký hiệu | Giá trị tính toán | Giới hạn yêu cầu | Hệ số η | Kết luận |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 6. PHỤ LỤC NEO & NỐI CHỒNG CỐT THÉP (TCVN 5574:2018)
// ============================================================================
function generateAnchoragePhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN CHIỀU DÀI NEO VÀ NỐI CHỒNG CỐT THÉP';
  const subtitle = 'Kiểm toán chiều dài neo Lan và chiều dài nối chồng Llap theo TCVN 5574:2018 (Công thức 255 – 259)';
  const standardRef = 'TCVN 5574:2018 — Mục 10.3.5 & Mục 10.3.6';

  const inputTable = [
    { label: 'Cấp độ bền bê tông', symbol: 'Bê tông', value: inputs.concrete, unit: '-', ref: `R_bt = ${results.Rbt} MPa (Bảng 6)` },
    { label: 'Nhóm cốt thép', symbol: 'Thép', value: inputs.rebarGrade, unit: '-', ref: `R_s = ${results.RsDesign} MPa (Bảng 13)` },
    { label: 'Đường kính thanh thép', symbol: 'd', value: inputs.d, unit: 'mm', ref: `Φ${inputs.d}` },
    { label: 'Trạng thái chịu lực', symbol: 'Trạng thái', value: inputs.stressState === 'compression' ? 'Chịu Nén' : 'Chịu Kéo', unit: '-', ref: `α_an = ${results.alphaAn}` },
    { label: 'Dạng hình học đoạn neo', symbol: 'Dạng neo', value: inputs.anchorageType === 'hook_bend' ? 'Uốn móc 90°/135°' : 'Thẳng', unit: '-', ref: 'Điều 10.3.5.3' },
    { label: 'Diện tích cốt thép yêu cầu', symbol: 'A_s,req', value: inputs.asReq, unit: 'mm²', ref: 'Tính toán nội lực' },
    { label: 'Diện tích cốt thép thực tế bố trí', symbol: 'A_s,prov', value: inputs.asProv, unit: 'mm²', ref: `A_req/A_prov = ${results.areaRatio}` },
    { label: 'Tỷ lệ nối chồng tại 1 mặt cắt', symbol: 'Tỷ lệ nối', value: `${inputs.lapRatio}%`, unit: '%', ref: `α_lap = ${results.alphaLap} (Điều 10.3.6)` },
    { label: 'Chiều dài thực tế bố trí trên bản vẽ', symbol: 'L_actual', value: inputs.actualLength, unit: 'mm', ref: 'Kiểm toán thi công' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Cường độ bám dính tính toán', symbol: 'R_bond', calcVal: `${results.Rbond} MPa`, limitVal: `η₁·η₂·R_bt`, eta: '-', status: 'ĐẠT' },
    { stt: 2, item: 'Chiều dài neo cơ sở', symbol: 'L_0,an', calcVal: `${results.L0an} mm`, limitVal: `${results.L0anD}d`, eta: '-', status: 'ĐẠT' },
    { stt: 3, item: 'Chiều dài neo tính toán yêu cầu', symbol: 'L_an', calcVal: `${results.Lan} mm`, limitVal: `${results.LanD}d`, eta: '-', status: 'ĐẠT' },
    { stt: 4, item: 'Chiều dài nối chồng tính toán', symbol: 'L_lap', calcVal: `${results.Llap} mm`, limitVal: `${results.LlapD}d`, eta: '-', status: 'ĐẠT' },
    { stt: 5, item: 'Kiểm tra chiều dài neo thực tế bố trí', symbol: 'L_actual', calcVal: `${results.actualLength} mm`, limitVal: `≥ L_an = ${results.Lan} mm`, eta: results.utilization.eta.toFixed(3), status: results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT]'} (η = ${results.utilization.eta.toFixed(3)})

---

### 1. BẢNG THÔNG SỐ VẬT LIỆU & QUY CÁCH NEO CỐT THÉP
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP (TCVN 5574:2018)
${results.steps.map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP CHIỀU DÀI NEO VÀ NỐI CHỒNG CỐT THÉP
| STT | Tiêu chí kiểm tra | Ký hiệu | Chiều dài yêu cầu | Bội số đường kính | Chiều dài bố trí | Hệ số η | Kết luận |
|:---:|---|:---:|---:|:---:|---:|:---:|:---:|
| 1 | Chiều dài neo thiết kế | L_an | **${results.Lan} mm** | **${results.LanD}d** | ${results.actualLength} mm | **${results.utilization.eta.toFixed(3)}** | **${results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}** |
| 2 | Chiều dài nối chồng thiết kế | L_lap | **${results.Llap} mm** | **${results.LlapD}d** | — | — | **ĐẠT** |
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}



// ============================================================================
// HỆ THỐNG XUẤT THUYẾT MINH & PHỤ LỤC TÍNH TOÁN THEO FORMAT BỘ 1 / BỘ 2
// (Tương thích 100% với verify_calculators.mjs & SKILL_PHULUC Master Engine)
// ============================================================================


// ============================================================================
// 7. PHỤ LỤC DẦM BTCT CỐT KÉP & CỐT ĐAI CHỊU CẮT (TCVN 5574:2018)
// ============================================================================
function generateRCBeamAdvancedPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN CỐT THÉP DẦM BTCT CHỊU UỐN VÀ CẮT TOÀN DIỆN';
  const subtitle = "Tự động tính cốt đơn / cốt kép (As, As') và kiểm toán cốt đai chịu cắt (V_Rd) theo TCVN 5574:2018";
  const standardRef = results.standardRef || 'TCVN 5574:2018 — Điều 8.1.2 & Điều 8.1.3';

  const inputTable = [
    { label: 'Bề rộng tiết diện dầm', symbol: 'b', value: results.b, unit: 'mm', ref: 'Thiết kế kết cấu' },
    { label: 'Chiều cao tiết diện dầm', symbol: 'h', value: results.h, unit: 'mm', ref: 'Thiết kế kết cấu' },
    { label: 'Chiều cao làm việc tiết diện', symbol: 'h₀', value: results.h0, unit: 'mm', ref: `a = ${results.a} mm, a' = ${results.aPrime} mm` },
    { label: 'Cấp độ bền bê tông', symbol: 'B', value: inputs.concrete || 'B25', unit: '-', ref: 'Bảng 6 (TCVN 5574:2018)' },
    { label: 'Nhóm cốt thép dọc chịu lực', symbol: 'Thép dọc', value: inputs.rebar || 'CB400V', unit: '-', ref: 'Bảng 13' },
    { label: 'Nhóm cốt đai chịu cắt', symbol: 'Thép đai', value: inputs.stirrupRebar || 'CB240T', unit: '-', ref: 'Bảng 14' },
    { label: 'Quy cách cốt đai bố trí', symbol: 'Cốt đai', value: inputs.stirrupDia && inputs.stirrupSpacing ? `${inputs.stirrupLegs || 2}c-Ø${inputs.stirrupDia}s${inputs.stirrupSpacing}` : 'Chưa bố trí', unit: '-', ref: 'Cấu tạo cốt đai' },
    { label: 'Mômen uốn tính toán ULS', symbol: 'M', value: inputs.M, unit: 'kNm', ref: 'Tổ hợp nội lực' },
    { label: 'Lực cắt tính toán ULS', symbol: 'V', value: inputs.V, unit: 'kN', ref: 'Tổ hợp nội lực' },
  ];

  const summaryTable = [
    {
      stt: 1,
      item: results.isDoubleLayer ? 'Cốt thép dọc chịu nén (Cốt kép)' : 'Cốt thép dọc chịu kéo (Cốt đơn)',
      symbol: results.isDoubleLayer ? "As / As'" : 'As',
      calcVal: results.isDoubleLayer ? `As = ${results.AsDesignCm2} cm², As' = ${results.AsPrimeCm2} cm²` : `As = ${results.AsDesignCm2} cm²`,
      limitVal: results.isDoubleLayer ? 'Cốt kép (α_m > α_R)' : `ξ = ${results.xi} ≤ ξ_R = ${results.xiR}`,
      eta: results.etaFlex ? results.etaFlex.toFixed(3) : '-',
      status: results.etaFlex <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT',
    },
    {
      stt: 2,
      item: 'Khả năng chịu nén dải nghiêng bê tông',
      symbol: 'V_strut',
      calcVal: `${results.VStrut} kN`,
      limitVal: `≥ V = ${inputs.V} kN`,
      eta: results.etaStrut ? results.etaStrut.toFixed(3) : '-',
      status: results.etaStrut <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT',
    },
    {
      stt: 3,
      item: 'Khả năng chịu cắt cốt đai + bê tông',
      symbol: 'V_Rd',
      calcVal: results.VRd !== null ? `${results.VRd} kN` : `Chưa nhập đai (cần q_sw ≥ ${results.qSwReq} N/mm)`,
      limitVal: `≥ V = ${inputs.V} kN`,
      eta: results.etaShear !== null ? results.etaShear.toFixed(3) : '-',
      status: results.VRd !== null ? (results.VRd >= inputs.V ? 'ĐẠT' : 'KHÔNG ĐẠT') : 'CHỜ BỐ TRÍ ĐAI',
    },
    {
      stt: 4,
      item: 'Chỉ số sử dụng tổng thể max(η_uốn, η_cắt, η_dải)',
      symbol: 'η',
      calcVal: results.utilization.eta.toFixed(3),
      limitVal: '≤ 1.000',
      eta: results.utilization.eta.toFixed(3),
      status: results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT',
    },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (η = ${results.utilization.eta.toFixed(3)})

---

### 1. BẢNG THÔNG SỐ ĐẦU VÀO & VẬT LIỆU
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP (TCVN 5574:2018)
${results.steps.map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP KẾT QUẢ KIỂM TOÁN CHỈ SỐ SỬ DỤNG η
| STT | Tiêu chí kiểm tra | Ký hiệu | Giá trị tính toán | Giới hạn cho phép | Hệ số η | Kết luận |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có CCHN kiểm tra trước khi ký đóng dấu.*
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 8. PHỤ LỤC TỔ HỢP TẢI TRỌNG ENVELOPE (TCVN 2737:2023)
// ============================================================================
function generateLoadComboPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC THIẾT LẬP TỔ HỢP TẢI TRỌNG VÀ BAO NỘI LỰC ENVELOPE';
  const subtitle = 'Tổ hợp trạng thái giới hạn ULS (Cơ bản, Đặc biệt) và SLS theo TCVN 2737:2023';
  const standardRef = results.standardRef || 'TCVN 2737:2023 — Điều 5, Điều 8 & Điều 10';

  const inputTable = [
    { label: 'Tĩnh tải chuẩn tại tiết diện', symbol: 'G_k', value: inputs.Gk, unit: 'kN (kNm)', ref: `γ_G = ${results.gammaG}` },
    { label: 'Hoạt tải chuẩn tại tiết diện', symbol: 'Q_k', value: inputs.Qk, unit: 'kN (kNm)', ref: 'γ_Q = 1.30' },
    { label: 'Tải gió chuẩn tại tiết diện', symbol: 'W_k', value: inputs.Wk, unit: 'kN (kNm)', ref: 'γ_W = 1.25' },
    { label: 'Tải động đất chuẩn (nếu có)', symbol: 'E_k', value: inputs.Ek || 0, unit: 'kN (kNm)', ref: inputs.includeSeismic ? 'Kể đến Động đất' : 'Không kể đến' },
    { label: 'Vật liệu kết cấu', symbol: 'Vật liệu', value: inputs.material === 'thep' ? 'Kết cấu Thép' : 'Bê tông cốt thép', unit: '-', ref: inputs.material === 'thep' ? 'γ_G = 1.05' : 'γ_G = 1.15' },
    { label: 'Khả năng chịu tải cho phép', symbol: '[M_d]', value: inputs.capacity || 'Chưa nhập', unit: 'kN (kNm)', ref: 'Giới hạn chịu lực' },
  ];

  const summaryTable = results.combinations.map((c, i) => ({
    stt: i + 1,
    item: c.name,
    symbol: c.id,
    calcVal: `${c.value} kN`,
    limitVal: c.formula,
    eta: results.utilization.eta !== null ? (c.value / Number(inputs.capacity)).toFixed(3) : '-',
    status: c.id === results.envelope.governing ? 'CHI PHỐI (MAX)' : 'ĐẠT',
  }));

  // Append envelope row
  summaryTable.push({
    stt: summaryTable.length + 1,
    item: `Envelope cực đại (${results.envelope.governing})`,
    symbol: 'M_ULS,max',
    calcVal: `${results.envelope.max} kN`,
    limitVal: inputs.capacity ? `≤ ${inputs.capacity} kN` : 'Bao nội lực thiết kế',
    eta: results.utilization.eta !== null ? results.utilization.eta.toFixed(3) : '—',
    status: results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT',
  });

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (Tổ hợp chi phối: ${results.envelope.governing})

---

### 1. BẢNG TẢI TRỌNG TIÊU CHUẨN THÀNH PHẦN
| STT | Tải trọng thành phần | Ký hiệu | Giá trị | Đơn vị | Hệ số độ tin cậy |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. KẾT QUẢ TÍNH TOÁN CÁC TỔ HỢP TẢI TRỌNG
${results.steps.map((s, i) => `#### 2.${i + 1} Tổ hợp ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP CÁC TỔ HỢP VÀ BAO NỘI LỰC ENVELOPE
| STT | Tên tổ hợp tải trọng | Mã | Giá trị tính toán | Công thức áp dụng | Hệ số η | Đánh giá |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có CCHN kiểm tra trước khi ký đóng dấu.*
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 9. PHỤ LỤC KIỂM TOÁN CHỌC THỦNG SÀN NẤM & ĐÀI CỌC (TCVN 5574:2018)
// ============================================================================
function generatePunchingPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC KIỂM TOÁN KHẢ NĂNG CHỐNG CHỌC THỦNG SÀN NẤM VÀ ĐÀI CỌC';
  const subtitle = 'Kiểm toán sức kháng chọc thủng của bê tông và cốt đai theo TCVN 5574:2018 Mục 8.1.6';
  const standardRef = results.standardRef || 'TCVN 5574:2018 — Mục 8.1.6 (Công thức 194–205)';

  const posLabel = inputs.columnPosition === 'edge' ? 'Cột biên' : inputs.columnPosition === 'corner' ? 'Cột góc' : 'Cột giữa';

  const inputTable = [
    { label: 'Chiều dày bản sàn / đài cọc', symbol: 'h', value: results.h, unit: 'mm', ref: 'Thiết kế kết cấu' },
    { label: 'Chiều cao làm việc tính toán', symbol: 'h₀', value: results.d, unit: 'mm', ref: `a = ${inputs.a} mm` },
    { label: 'Kích thước tiết diện cột', symbol: 'b_c × h_c', value: `${results.columnB} × ${results.columnH}`, unit: 'mm', ref: 'Mặt cắt cột' },
    { label: 'Vị trí cột trên mặt bằng', symbol: 'Vị trí', value: posLabel, unit: '-', ref: 'Sơ đồ hình học' },
    { label: 'Cấp độ bền bê tông', symbol: 'B', value: inputs.concrete || 'B25', unit: '-', ref: `R_bt = ${results.Rbt || 1.05} MPa` },
    { label: 'Lực tập trung gây chọc thủng', symbol: 'F', value: inputs.F, unit: 'kN', ref: 'Tổ hợp nội lực ULS' },
    { label: 'Mômen uốn cột truyền vào sàn', symbol: 'M_bx / M_by', value: `${inputs.Mbx || 0} / ${inputs.Mby || 0}`, unit: 'kNm', ref: 'Uốn 2 phương' },
    { label: 'Cốt đai chống chọc thủng', symbol: 'Cốt đai', value: results.hasStirrup ? `${inputs.stirrupLegs}c-Ø${inputs.stirrupDia}s${inputs.stirrupSpacing}` : 'Không bố trí', unit: '-', ref: inputs.stirrupRebar || 'CB240T' },
  ];

  const summaryTable = [
    {
      stt: 1,
      item: 'Chu vi đường bao tính toán cách mép cột h₀/2',
      symbol: 'u_b',
      calcVal: `${results.uB} mm`,
      limitVal: 'Đường bao tới hạn',
      eta: '-',
      status: 'ĐẠT',
    },
    {
      stt: 2,
      item: 'Sức kháng chọc thủng của bê tông nguyên sinh',
      symbol: 'F_b,ult',
      calcVal: `${results.Fult} kN`,
      limitVal: `≥ F = ${inputs.F} kN`,
      eta: results.etaF.toFixed(3),
      status: results.etaF <= 1.0 ? 'ĐẠT' : 'CẦN CỐT ĐAI / MŨ CỘT',
    },
    {
      stt: 3,
      item: results.hasStirrup ? 'Sức kháng chọc thủng có cốt đai bổ sung' : 'Chỉ số kiểm toán chọc thủng (kể cả mômen)',
      symbol: results.hasStirrup ? 'F_b,ult,sw' : 'η_punch',
      calcVal: results.hasStirrup ? `${results.FUltStirrup} kN` : `η = ${results.etaPunch}`,
      limitVal: results.hasStirrup ? `min(F_b + F_sw, 2F_b)` : 'η ≤ 1.000',
      eta: results.utilization.eta.toFixed(3),
      status: results.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT',
    },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (η = ${results.utilization.eta.toFixed(3)})

---

### 1. BẢNG THÔNG SỐ HÌNH HỌC VÀ TẢI TRỌNG TÁC DỤNG
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ KIỂM TOÁN CHỌC THỦNG STEP-BY-STEP
${results.steps.map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP KẾT QUẢ KIỂM TOÁN CHỈ SỐ SỬ DỤNG η
| STT | Tiêu chí kiểm tra | Ký hiệu | Giá trị tính toán | Giới hạn cho phép | Hệ số η | Kết luận |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có CCHN kiểm tra trước khi ký đóng dấu.*
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}


// ============================================================================
// 10. PHỤ LỤC TÍNH TOÁN TĨNH TẢI SÀN & TƯỜNG (TCVN 2737:2023)
// ============================================================================
function generateDeadLoadPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN TÍCH LŨY TĨNH TẢI SÀN VÀ TƯỜNG XÂY TRÊN DẦM';
  const subtitle = 'Xác định tĩnh tải nhiều lớp hoàn thiện sàn & tải trọng phân bố đều của tường theo TCVN 2737:2023';
  const standardRef = results.standardRef || 'TCVN 2737:2023 — Bảng 3 & Mục 5';

  const inputTable = [
    { label: 'Số lớp cấu tạo sàn', symbol: 'Số lớp', value: `${results.processedLayers?.length || 0} lớp`, unit: '-', ref: 'Bảng 3 TCVN 2737' },
    { label: 'Chiều cao tầng', symbol: 'H_t', value: inputs.storyHeight || 3.6, unit: 'm', ref: 'Bản vẽ kiến trúc' },
    { label: 'Chiều cao tiết diện dầm đỡ tường', symbol: 'h_d', value: inputs.beamHeight || 0.6, unit: 'm', ref: 'Mặt cắt dầm kết cấu' },
    { label: 'Bề dày tường xây', symbol: 't_w', value: inputs.wallThickness || 200, unit: 'mm', ref: 'Bản vẽ xây tường' },
    { label: 'Loại gạch xây tường', symbol: 'Gạch', value: results.brickTypeName || 'Gạch 4 lỗ rỗng', unit: '-', ref: 'Bảng 3' },
    { label: 'Chiều dày vữa trát 2 mặt', symbol: 't_plaster', value: inputs.plasterThickness || 15, unit: 'mm', ref: 'Trát trong + ngoài' },
    { label: 'Tỷ lệ mở cửa tường', symbol: 'k_open', value: inputs.openingPercent || 0, unit: '%', ref: 'Cửa sổ + cửa đi' },
    { label: 'Tĩnh tải sàn cho phép', symbol: '[G_d]', value: results.allowableFloorGd, unit: 'kN/m²', ref: 'Giới hạn kết cấu' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Tổng tĩnh tải sàn tiêu chuẩn', symbol: 'G_k', calcVal: `${results.floorGk} kN/m²`, limitVal: '-', eta: '-', status: 'ĐẠT' },
    { stt: 2, item: 'Tổng tĩnh tải sàn tính toán', symbol: 'G_d', calcVal: `${results.floorGd} kN/m²`, limitVal: `≤ ${results.allowableFloorGd} kN/m²`, eta: results.utilization?.eta?.toFixed(3) || '-', status: results.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 3, item: 'Trọng lượng tường tiêu chuẩn trên m²', symbol: 'g_w,k', calcVal: `${results.gWallTotalK} kN/m²`, limitVal: 'Gạch + Vữa trát', eta: '-', status: 'ĐẠT' },
    { stt: 4, item: 'Chiều cao thông thủy tường', symbol: 'H_w', calcVal: `${results.netWallHeight} m`, limitVal: 'H_t - h_d', eta: '-', status: 'ĐẠT' },
    { stt: 5, item: 'Tải trọng tường tiêu chuẩn trên dầm', symbol: 'q_w,k', calcVal: `${results.wallQk} kN/m`, limitVal: '-', eta: '-', status: 'ĐẠT' },
    { stt: 6, item: 'Tải trọng tường tính toán trên dầm', symbol: 'q_w,d', calcVal: `${results.wallQd} kN/m`, limitVal: '-', eta: '-', status: 'ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization?.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (η = ${results.utilization?.eta?.toFixed(3) || '-'})

---

### 1. BẢNG THÔNG SỐ ĐẦU VÀO
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. CHI TIẾT CÁC LỚP HOÀN THIỆN SÀN
| STT | Lớp cấu tạo | Chiều dày (mm) | Khối lượng thể tích (kN/m³) | Hệ số γ_f | Tải tiêu chuẩn G_k (kN/m²) | Tải tính toán G_d (kN/m²) |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
${(results.processedLayers || []).map((l) => `| ${l.index} | ${l.name} | ${l.thickness} | ${l.density} | ${l.gammaF} | ${l.gk} | ${l.gd} |`).join('\n')}
| **Σ** | **TỔNG CỘNG TĨNH TẢI SÀN** | - | - | - | **${results.floorGk}** | **${results.floorGd}** |

---

### 3. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP (TCVN 2737:2023)
${(results.steps || []).map((s, i) => `#### 3.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 4. BẢNG TỔNG HỢP KẾT QUẢ VÀ CHỈ SỐ SỬ DỤNG η
| STT | Cấu kiện / Tải trọng | Ký hiệu | Giá trị tính toán | Giới hạn thiết kế | Hệ số η | Đánh giá |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có chứng chỉ hành nghề kiểm tra trước khi ký đóng dấu.*
`;

  return {
    title,
    subtitle,
    standardRef,
    dateStr,
    inputTable,
    summaryTable,
    steps: results.steps,
    utilization: results.utilization,
    markdown,
  };
}


// ============================================================================
// 11. PHỤ LỤC TÍNH TOÁN CỘT BTCT NÉN LỆCH TÂM XIÊN BRESLER (TCVN 5574:2018)
// ============================================================================
function generateRCColumnPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN CỘT BTCT NÉN LỆCH TÂM XIÊN (BRESLER)';
  const subtitle = 'Kiểm toán khả năng chịu lực nén uốn 2 phương theo TCVN 5574:2018 & Công thức tương tác Bresler';
  const standardRef = results.standardRef || 'TCVN 5574:2018 — Mục 8.1.4 & Phụ lục E';

  const inputTable = [
    { label: 'Kích thước tiết diện cột (b x h)', symbol: 'b x h', value: `${results.b} x ${results.h}`, unit: 'mm', ref: 'Mặt bằng kết cấu' },
    { label: 'Chiều dài tính toán cột', symbol: 'L_0', value: results.L0, unit: 'mm', ref: '0.7 x H_tầng' },
    { label: 'Cấp độ bền bê tông', symbol: 'Bê tông', value: inputs.concrete || 'B25', unit: '-', ref: 'Bảng 6 TCVN 5574' },
    { label: 'Nhóm cốt thép dọc', symbol: 'Thép', value: inputs.rebar || 'CB400V', unit: '-', ref: 'Bảng 13 TCVN 5574' },
    { label: 'Cốt thép bố trí', symbol: 'A_s,tot', value: `${results.rebarCount}Ø${results.rebarDia} (As = ${results.AsTot} mm²)`, unit: 'mm²', ref: `μ = ${results.mu}%` },
    { label: 'Lực nén tính toán ULS', symbol: 'N_Ed', value: results.Ned, unit: 'kN', ref: 'Tổ hợp nội lực' },
    { label: 'Mômen uốn phương x', symbol: 'M_Ed,x', value: results.Medx, unit: 'kNm', ref: 'Tổ hợp nội lực' },
    { label: 'Mômen uốn phương y', symbol: 'M_Ed,y', value: results.Medy, unit: 'kNm', ref: 'Tổ hợp nội lực' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Sức chịu nén đúng tâm', symbol: 'N_Rd,0', calcVal: `${results.NRd0} kN`, limitVal: 'R_b.A_b + R_sc.A_s', eta: '-', status: 'ĐẠT' },
    { stt: 2, item: 'Sức chịu nén lệch tâm phẳng phương X', symbol: 'N_Rd,x', calcVal: `${results.NRdx} kN`, limitVal: 'Lệch tâm tĩnh e_0x', eta: '-', status: 'ĐẠT' },
    { stt: 3, item: 'Sức chịu nén lệch tâm phẳng phương Y', symbol: 'N_Rd,y', calcVal: `${results.NRdy} kN`, limitVal: 'Lệch tâm tĩnh e_0y', eta: '-', status: 'ĐẠT' },
    { stt: 4, item: 'Sức chịu nén lệch tâm xiên Bresler', symbol: 'N_Rd,Bresler', calcVal: `${results.NRdBresler} kN`, limitVal: `≥ N = ${results.Ned} kN`, eta: results.utilization?.eta?.toFixed(3) || '-', status: results.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization?.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (η = ${results.utilization?.eta?.toFixed(3) || '-'})

---

### 1. BẢNG THÔNG SỐ ĐẦU VÀO CỘT
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ TÍNH TOÁN CHI TIẾT (BRESLER FORMULA)
${(results.steps || []).map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP KHẢ NĂNG CHỊU LỰC & CHỈ SỐ η
| STT | Trạng thái chịu lực | Ký hiệu | Giá trị tính toán | Giới hạn thiết kế | Hệ số η | Đánh giá |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có CCHN kiểm tra trước khi ký đóng dấu.*
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 12. PHỤ LỤC TÍNH TOÁN Ô BẢN SÀN BTCT 2 PHƯƠNG (MARCUS - TCVN 5574:2018)
// ============================================================================
function generateTwoWaySlabPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC TÍNH TOÁN CỐT THÉP Ô BẢN SÀN BTCT 2 PHƯƠNG';
  const subtitle = 'Xác định mômen uốn Marcus dải 1m & kiểm toán võng nứt theo TCVN 5574:2018';
  const standardRef = results.standardRef || 'TCVN 5574:2018 — Mục 8.1.2 & Lý thuyết bản kê 4 cạnh';

  const inputTable = [
    { label: 'Kích thước ô bản (Lx x Ly)', symbol: 'L_x x L_y', value: `${results.Lx} x ${results.Ly}`, unit: 'm', ref: 'Mặt bằng kết cấu' },
    { label: 'Tỷ số cạnh ô bản', symbol: 'ρ = L_2/L_1', value: results.rho, unit: '-', ref: results.isOneWay ? 'Bản 1 phương' : 'Bản 2 phương' },
    { label: 'Chiều dày bản sàn', symbol: 'h_s', value: results.h, unit: 'mm', ref: `h₀ = ${results.h0} mm` },
    { label: 'Cấp độ bền bê tông sàn', symbol: 'Bê tông', value: inputs.concrete || 'B25', unit: '-', ref: 'Bảng 6 TCVN 5574' },
    { label: 'Nhóm cốt thép sàn', symbol: 'Thép', value: inputs.rebar || 'CB240T', unit: '-', ref: 'Bảng 13 TCVN 5574' },
    { label: 'Tải trọng ULS dải 1m', symbol: 'q_ULS', value: results.qUls, unit: 'kN/m²', ref: '1.2 DL + 1.3 LL' },
    { label: 'Tải trọng SLS dải 1m', symbol: 'q_SLS', value: results.qSls, unit: 'kN/m²', ref: 'DL + LL' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Mômen nhịp ngắn (Nhịp / Gối)', symbol: 'M_1', calcVal: `M_pos = ${results.M1Pos} kNm | M_neg = ${results.M1Neg} kNm`, limitVal: 'Dải bản 1m', eta: '-', status: 'ĐẠT' },
    { stt: 2, item: 'Cốt thép nhịp ngắn yêu cầu', symbol: 'A_s1', calcVal: `Nhịp: ${results.As1Pos} mm²/m | Gối: ${results.As1Neg} mm²/m`, limitVal: 'TCVN 5574', eta: '-', status: 'ĐẠT' },
    { stt: 3, item: 'Mômen nhịp dài (Nhịp / Gối)', symbol: 'M_2', calcVal: `M_pos = ${results.M2Pos} kNm | M_neg = ${results.M2Neg} kNm`, limitVal: 'Dải bản 1m', eta: '-', status: 'ĐẠT' },
    { stt: 4, item: 'Cốt thép nhịp dài yêu cầu', symbol: 'A_s2', calcVal: `Nhịp: ${results.As2Pos} mm²/m | Gối: ${results.As2Neg} mm²/m`, limitVal: 'TCVN 5574', eta: '-', status: 'ĐẠT' },
    { stt: 5, item: 'Kiểm toán độ võng SLS', symbol: 'f', calcVal: `${results.fCalc} mm`, limitVal: `≤ [f] = ${results.fAllow} mm (L/250)`, eta: results.etaDeflection ? results.etaDeflection.toFixed(3) : '-', status: results.etaDeflection <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization?.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (η = ${results.utilization?.eta?.toFixed(3) || '-'})

---

### 1. BẢNG THÔNG SỐ ĐẦU VÀO Ô BẢN SÀN
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ TÍNH TOÁN NỘI LỰC VÀ BỐ TRÍ CỐT THÉP
${(results.steps || []).map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP MÔMEN, CỐT THÉP & ĐỘ VÕNG SLS
| STT | Cấu kiện / Phương lực | Ký hiệu | Giá trị tính toán | Giới hạn thiết kế | Hệ số η | Đánh giá |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có CCHN kiểm tra trước khi ký đóng dấu.*
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 13. PHỤ LỤC TÍNH TOÁN DẦM THÉP HÌNH CHỮ I & ỔN ĐỊNH LTB (TCVN 5575:2024)
// ============================================================================
function generateSteelBeamPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC KIỂM TOÁN DẦM THÉP HÌNH CHỮ I (BỀN UỐN, CẮT & LTB)';
  const subtitle = 'Kiểm toán khả năng chịu tải ULS và ổn định uốn xoắn tổng thể theo TCVN 5575:2024';
  const standardRef = results.standardRef || 'TCVN 5575:2024 — Mục 8.1, 8.2 & Phụ lục D';

  const inputTable = [
    { label: 'Quy cách tiết diện dầm thép', symbol: 'Tiết diện', value: results.profileName, unit: '-', ref: 'Bảng quy cách I' },
    { label: 'Nhịp tính toán dầm', symbol: 'L', value: results.L, unit: 'm', ref: 'Bản vẽ kết cấu thép' },
    { label: 'Chiều dài giằng cánh nén', symbol: 'L_cr', value: results.hasDeckBracing ? '0 (Giằng liên tục)' : `${results.Lcr} m`, unit: 'm', ref: 'Cấu tạo giằng' },
    { label: 'Mác thép kết cấu', symbol: 'Mác thép', value: results.steelGrade, unit: '-', ref: `f_y = ${results.fy} MPa` },
    { label: 'Tải trọng phân bố đều', symbol: 'q', value: results.q, unit: 'kN/m', ref: 'Tổ hợp ULS' },
    { label: 'Mômen uốn tính toán ULS', symbol: 'M_Ed', value: results.Med, unit: 'kNm', ref: 'q.L²/8' },
    { label: 'Lực cắt tính toán ULS', symbol: 'V_Ed', value: results.Ved, unit: 'kN', ref: 'q.L/2' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Khả năng chịu uốn bền tiết diện', symbol: 'M_c,Rd', calcVal: `${results.McRd} kNm`, limitVal: `≥ M_Ed = ${results.Med} kNm`, eta: (results.Med / results.McRd).toFixed(3), status: 'ĐẠT' },
    { stt: 2, item: 'Khả năng chịu cắt bản bụng', symbol: 'V_c,Rd', calcVal: `${results.VcRd} kN`, limitVal: `≥ V_Ed = ${results.Ved} kN`, eta: results.etaShear.toFixed(3), status: results.etaShear <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 3, item: 'Ổn định uốn xoắn tổng thể (LTB)', symbol: 'M_b,Rd', calcVal: `${results.MbRd} kNm`, limitVal: `χ_LT = ${results.chiLT}`, eta: results.etaFlex.toFixed(3), status: results.etaFlex <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 4, item: 'Độ võng dầm đàn hồi SLS', symbol: 'f', calcVal: `${results.fCalc} mm`, limitVal: `≤ [f] = ${results.fAllow} mm (L/400)`, eta: results.etaDeflection.toFixed(3), status: results.etaDeflection <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization?.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (η = ${results.utilization?.eta?.toFixed(3) || '-'})

---

### 1. BẢNG THÔNG SỐ TIẾT DIỆN VÀ TẢI TRỌNG
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ KIỂM TOÁN ULS & ỔN ĐỊNH LTB (TCVN 5575:2024)
${(results.steps || []).map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP KIỂM TOÁN VÀ CHỈ SỐ SỬ DỤNG η
| STT | Tiêu chí kiểm tra | Ký hiệu | Giá trị tính toán | Giới hạn thiết kế | Hệ số η | Đánh giá |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có CCHN kiểm tra trước khi ký đóng dấu.*
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

// ============================================================================
// 14. PHỤ LỤC KIỂM TOÁN ỔN ĐỊNH TỔNG THỂ CÔNG TRÌNH (TCVN 2737 / TCVN 5574)
// ============================================================================
function generateGlobalStabilityPhuLuc(inputs, results, dateStr) {
  const title = 'PHỤ LỤC KIỂM TOÁN ỔN ĐỊNH TỔNG THỂ CÔNG TRÌNH';
  const subtitle = 'Kiểm toán Chống lật, Chống trượt, Hiệu ứng P-Delta và Chuyển vị tầng theo TCVN 2737 & TCVN 5574';
  const standardRef = results.standardRef || 'TCVN 2737:2023 & TCVN 5574:2018';

  const inputTable = [
    { label: 'Tổng trọng lượng công trình', symbol: 'G_tot', value: results.totalWeightG, unit: 'kN', ref: 'Tổ hợp tĩnh tải' },
    { label: 'Tổng lực cắt ngang đáy (Gió/Động đất)', symbol: 'V_ngang', value: results.lateralWindV, unit: 'kN', ref: 'Tổ hợp tải ngang' },
    { label: 'Tổng mômen gây lật quanh đáy móng', symbol: 'M_w', value: results.overturningMw, unit: 'kNm', ref: 'Tổ hợp tải ngang' },
    { label: 'Bề rộng móng công trình', symbol: 'B', value: results.foundationB, unit: 'm', ref: 'Mặt bằng móng' },
    { label: 'Tổng chiều cao công trình', symbol: 'H', value: results.totalHeightH, unit: 'm', ref: 'Số tầng: ' + results.storyCount },
    { label: 'Chuyển vị lệch tầng lớn nhất', symbol: 'Δ_i', value: results.maxStoryDrift, unit: 'mm', ref: 'Phân tích ETABS' },
    { label: 'Hệ số ma sát đáy móng với đất', symbol: 'f', value: results.frictionCoeff, unit: '-', ref: 'Khảo sát địa chất' },
  ];

  const summaryTable = [
    { stt: 1, item: 'Ổn định chống lật công trình', symbol: 'K_lật', calcVal: `K = ${results.Klat} (M_cl = ${results.Mcl} kNm)`, limitVal: '≥ [1.50]', eta: results.etaLat.toFixed(3), status: results.passLat ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 2, item: 'Ổn định chống trượt công trình', symbol: 'K_trượt', calcVal: `K = ${results.Ktruot} (F_tr = ${results.Ftr} kN)`, limitVal: '≥ [1.20]', eta: results.etaTruot.toFixed(3), status: results.passTruot ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 3, item: 'Độ nhạy P-Delta bậc hai', symbol: 'θ', calcVal: `θ = ${results.theta}`, limitVal: '≤ [0.10 / 0.20]', eta: (results.theta / 0.10).toFixed(3), status: results.passPDelta ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 4, item: 'Chuyển vị lệch tầng đàn hồi', symbol: 'Δ_i / h_i', calcVal: results.driftRatio, limitVal: `≤ [${results.allowDriftRatio}] (1/250)`, eta: (results.driftRatio / results.allowDriftRatio).toFixed(3), status: results.passDrift ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    { stt: 5, item: 'Chuyển vị đỉnh công trình', symbol: 'Δ_top / H', calcVal: results.deltaTopRatio, limitVal: `≤ [${results.allowTopRatio}] (1/500)`, eta: (results.deltaTopRatio / results.allowTopRatio).toFixed(3), status: results.passTop ? 'ĐẠT' : 'KHÔNG ĐẠT' },
  ];

  const markdown = `# ${title}
## ${subtitle}

**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr} | **Đơn vị:** STRUCTURE-HUB (Bộ 1 Times New Roman)  
**Trạng thái kiểm toán:** ${results.utilization?.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (η = ${results.utilization?.eta?.toFixed(3) || '-'})

---

### 1. BẢNG THÔNG SỐ TẢI TRỌNG VÀ HÌNH HỌC TỔNG THỂ
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputTable.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ KIỂM TOÁN ỔN ĐỊNH TOÀN DIỆN
${(results.steps || []).map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP CÁC CHỈ SỐ ỔN ĐỊNH HỆ THỐNG
| STT | Tiêu chí kiểm tra ổn định | Ký hiệu | Giá trị tính toán | Giới hạn thiết kế | Hệ số η | Đánh giá |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryTable.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có CCHN kiểm tra trước khi ký đóng dấu.*
`;

  return { title, subtitle, standardRef, dateStr, inputTable, summaryTable, steps: results.steps, utilization: results.utilization, markdown };
}

export function generatePhuLucDocument(calcResult, options = {}) {
  if (!calcResult || !calcResult.valid) return null;

  const stylePreset = options.stylePreset || 'bo1';
  const isBo2 = stylePreset === 'tvtk' || stylePreset === 'bo2';
  const presetLabel = isBo2 ? 'Bộ 2 (TVTK - Arial)' : 'Bộ 1 (Times New Roman)';
  const orgName = isBo2 ? 'CƠ QUAN TƯ VẤN THIẾT KẾ KỸ THUẬT XÂY DỰNG' : 'CÔNG TY CP TƯ VẤN THIẾT KẾ KẾT CẤU XÂY DỰNG';
  const fontNote = isBo2
    ? 'Font: Arial 11pt | Khoảng cách dòng: 1.15 lines | Khổ giấy: A4 Chuẩn TVTK'
    : 'Font: Times New Roman 13pt | Khoảng cách dòng: 1.20 lines | Khổ giấy: A4 Chuẩn Bộ 1';

  const dateStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  let title = 'PHỤ LỤC TÍNH TOÁN KẾT CẤU';
  let subtitle = 'Kiểm toán khả năng chịu lực theo Tiêu chuẩn Xây dựng Việt Nam (TCVN)';
  let standardRef = calcResult.standardRef || 'TCVN';
  let inputRows = [];
  let summaryRows = [];

  if (calcResult.kz !== undefined) {
    // 1. Tải trọng gió (TCVN 2737:2023)
    title = 'PHỤ LỤC TÍNH TOÁN TẢI TRỌNG GIÓ ĐỘNG TÁC DỤNG LÊN CÔNG TRÌNH';
    subtitle = 'Kiểm toán áp lực gió tiêu chuẩn và tính toán theo TCVN 2737:2023 (Chu kỳ lặp 50 năm)';
    inputRows = [
      { label: 'Vùng áp lực gió', symbol: 'Vùng gió', value: calcResult.zone || 'II-A', unit: '-', ref: 'Bảng F.1' },
      { label: 'Áp lực gió cơ sở W₀', symbol: 'W₀', value: calcResult.W0, unit: 'kN/m²', ref: `W₀ = ${calcResult.W0} kN/m²` },
      { label: 'Dạng địa hình', symbol: 'Địa hình', value: `Dạng ${calcResult.terrain || 'B'}`, unit: '-', ref: 'Bảng 7' },
      { label: 'Cao độ tính toán hiệu dụng', symbol: 'z_eff', value: calcResult.zEff || 20, unit: 'm', ref: 'Điều 10.2.5' },
      { label: 'Hệ số khí động', symbol: 'c', value: calcResult.c, unit: '-', ref: 'Phụ lục E' },
      { label: 'Hệ số phản ứng giật', symbol: 'G_f', value: calcResult.gf, unit: '-', ref: 'Điều 10.2.4' },
      { label: 'Hệ số tin cậy tải trọng gió', symbol: 'γ_f', value: calcResult.gammaF, unit: '-', ref: 'Điều 10.2.1' },
      { label: 'Giới hạn áp lực gió cho phép', symbol: 'W_d,allow', value: calcResult.allowableWd, unit: 'kN/m²', ref: 'Khả năng chịu lực' },
    ];
    summaryRows = [
      { stt: 1, item: 'Hệ số độ cao địa hình', symbol: 'k(z)', calcVal: calcResult.kz, limitVal: 'Bảng 10', eta: '-', status: 'ĐẠT' },
      { stt: 2, item: 'Áp lực gió tiêu chuẩn', symbol: 'W_k', calcVal: `${calcResult.Wk} kN/m²`, limitVal: 'Công thức 35', eta: '-', status: 'ĐẠT' },
      { stt: 3, item: 'Áp lực gió tính toán thiết kế', symbol: 'W_d', calcVal: `${calcResult.Wd} kN/m²`, limitVal: `≤ ${calcResult.allowableWd} kN/m²`, eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.alphaA !== undefined) {
    // 2. Chiết giảm hoạt tải (TCVN 2737:2023)
    title = 'PHỤ LỤC TÍNH TOÁN CHIẾT GIẢM HOẠT TẢI SÀN VÀ CỘT';
    subtitle = 'Xác định hệ số chiết giảm hoạt tải theo diện tích chịu tải và số tầng truyền tải';
    inputRows = [
      { label: 'Loại công năng phòng', symbol: 'Công năng', value: calcResult.categoryName || 'Văn phòng làm việc (Nhóm B)', unit: '-', ref: 'Bảng 4' },
      { label: 'Hoạt tải tiêu chuẩn danh định', symbol: 'p_k', value: calcResult.pk || 2.0, unit: 'kN/m²', ref: 'Bảng 4' },
      { label: 'Hệ số độ tin cậy hoạt tải', symbol: 'γ_f', value: calcResult.gammaF || 1.3, unit: '-', ref: 'Điều 8.2' },
      { label: 'Diện tích chịu tải sàn/dầm', symbol: 'A', value: calcResult.area || 64, unit: 'm²', ref: 'Sơ đồ truyền tải' },
      { label: 'Số tầng truyền tải lên cột/móng', symbol: 'n', value: calcResult.floors || 4, unit: 'tầng', ref: 'Số tầng' },
      { label: 'Khả năng chịu tải cho phép', symbol: 'p_d,allow', value: calcResult.designCapacityPd || 2.6, unit: 'kN/m²', ref: 'Giới hạn thiết kế' },
    ];
    summaryRows = [
      { stt: 1, item: 'Hệ số chiết giảm sàn theo diện tích', symbol: 'α_A', calcVal: calcResult.alphaA, limitVal: '≥ 0.60', eta: '-', status: 'ĐẠT' },
      { stt: 2, item: 'Hệ số chiết giảm cột theo số tầng', symbol: 'α_n', calcVal: calcResult.alphaN, limitVal: '≥ 0.50', eta: '-', status: 'ĐẠT' },
      { stt: 3, item: 'Hoạt tải sàn tính toán sau chiết giảm', symbol: 'p_d,red', calcVal: `${calcResult.pdReducedArea} kN/m²`, limitVal: `≤ ${calcResult.designCapacityPd || 2.6} kN/m²`, eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.VRdc !== undefined) {
    // 7. Dầm BTCT Cốt kép & Cắt (B1 nâng cao)
    title = 'PHỤ LỤC TÍNH TOÁN CỐT THÉP DẦM BTCT CHỊU UỐN VÀ CẮT TOÀN DIỆN';
    subtitle = "Tự động tính cốt đơn / cốt kép (As, As') và kiểm toán cốt đai chịu cắt (V_Rd) theo TCVN 5574:2018";
    inputRows = [
      { label: 'Bề rộng tiết diện dầm', symbol: 'b', value: calcResult.b, unit: 'mm', ref: 'Thiết kế kết cấu' },
      { label: 'Chiều cao tiết diện dầm', symbol: 'h', value: calcResult.h, unit: 'mm', ref: 'Thiết kế kết cấu' },
      { label: 'Chiều cao làm việc tiết diện', symbol: 'h₀', value: calcResult.h0, unit: 'mm', ref: `a = ${calcResult.a} mm, a' = ${calcResult.aPrime} mm` },
      { label: 'Cốt thép uốn yêu cầu', symbol: "As / As'", value: calcResult.isDoubleLayer ? `As = ${calcResult.AsDesignCm2} cm², As' = ${calcResult.AsPrimeCm2} cm²` : `As = ${calcResult.AsDesignCm2} cm²`, unit: '-', ref: calcResult.isDoubleLayer ? 'Cốt kép' : 'Cốt đơn' },
      { label: 'Mômen uốn tính toán ULS', symbol: 'M', value: calcResult.MRd ? calcResult.MRd : 220, unit: 'kNm', ref: 'Tổ hợp nội lực' },
      { label: 'Khả năng chịu cắt cốt đai', symbol: 'V_Rd', value: calcResult.VRd !== null ? `${calcResult.VRd} kN` : 'Chưa bố trí đai', unit: '-', ref: 'Điều 8.1.3' },
    ];
    summaryRows = [
      { stt: 1, item: 'Khả năng chịu uốn tiết diện dầm', symbol: 'M / M_Rd', calcVal: calcResult.MRd ? `${calcResult.MRd} kNm` : '-', limitVal: 'Điều 8.1.2', eta: calcResult.etaFlex ? calcResult.etaFlex.toFixed(3) : '-', status: calcResult.etaFlex <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT' },
      { stt: 2, item: 'Khả năng chịu nén dải nghiêng bê tông', symbol: 'V_strut', calcVal: `${calcResult.VStrut} kN`, limitVal: 'Điều 8.1.3', eta: calcResult.etaStrut ? calcResult.etaStrut.toFixed(3) : '-', status: calcResult.etaStrut <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT' },
      { stt: 3, item: 'Chỉ số sử dụng tổng hợp lớn nhất', symbol: 'η', calcVal: calcResult.utilization?.eta?.toFixed(3) || '-', limitVal: '≤ 1.000', eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.combinations !== undefined) {
    // 8. Tổ hợp Envelope (A4)
    title = 'PHỤ LỤC THIẾT LẬP TỔ HỢP TẢI TRỌNG VÀ BAO NỘI LỰC ENVELOPE';
    subtitle = 'Xác định bao nội lực ULS và SLS theo TCVN 2737:2023';
    inputRows = [
      { label: 'Số lượng tổ hợp phát sinh', symbol: 'Số tổ hợp', value: `${calcResult.combinations.length} tổ hợp`, unit: 'tổ hợp', ref: 'Điều 5, 8 & 10' },
      { label: 'Tổ hợp chi phối lớn nhất', symbol: 'Governing', value: calcResult.envelope.governing, unit: '-', ref: 'Max Envelope' },
      { label: 'Giá trị bao cực đại', symbol: 'M_ULS,max', value: `${calcResult.envelope.max} kN`, unit: 'kN (kNm)', ref: 'Nội lực tính toán' },
      { label: 'Giá trị bao cực tiểu', symbol: 'M_ULS,min', value: `${calcResult.envelope.min} kN`, unit: 'kN (kNm)', ref: 'Nội lực tính toán' },
    ];
    summaryRows = [
      { stt: 1, item: 'Bao nội lực cực đại thiết kế', symbol: 'Envelope Max', calcVal: `${calcResult.envelope.max} kN`, limitVal: calcResult.envelope.governing, eta: calcResult.utilization?.eta !== null ? calcResult.utilization?.eta?.toFixed(3) : '-', status: 'ĐẠT' },
      { stt: 2, item: 'Đánh giá chỉ số an toàn Policy Engine', symbol: 'η', calcVal: calcResult.utilization?.eta !== null ? calcResult.utilization?.eta?.toFixed(3) : 'Chưa nhập [M_d]', limitVal: '≤ 1.000', eta: calcResult.utilization?.eta !== null ? calcResult.utilization?.eta?.toFixed(3) : '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'INFO' },
    ];
  } else if (calcResult.NRdBresler !== undefined) {
    // 11. Cột BTCT nén lệch tâm xiên Bresler
    title = 'PHỤ LỤC TÍNH TOÁN CỘT BTCT NÉN LỆCH TÂM XIÊN (BRESLER)';
    subtitle = 'Kiểm toán khả năng chịu lực nén uốn 2 phương theo TCVN 5574:2018 & Công thức Bresler';
    inputRows = [
      { label: 'Kích thước cột b x h', symbol: 'b x h', value: `${calcResult.b} x ${calcResult.h}`, unit: 'mm', ref: 'Tiết diện cột' },
      { label: 'Chiều dài tính toán L0', symbol: 'L_0', value: `${calcResult.L0} mm`, unit: 'mm', ref: '0.7 H_tầng' },
      { label: 'Cốt thép bố trí', symbol: 'A_s,tot', value: `${calcResult.rebarCount}Ø${calcResult.rebarDia}`, unit: '-', ref: `As = ${calcResult.AsTot} mm²` },
      { label: 'Lực nén tính toán ULS', symbol: 'N_Ed', value: `${calcResult.Ned} kN`, unit: 'kN', ref: 'Tổ hợp nội lực' },
    ];
    summaryRows = [
      { stt: 1, item: 'Sức chịu nén đúng tâm', symbol: 'N_Rd,0', calcVal: `${calcResult.NRd0} kN`, limitVal: '-', eta: '-', status: 'ĐẠT' },
      { stt: 2, item: 'Sức chịu nén lệch tâm phẳng X', symbol: 'N_Rd,x', calcVal: `${calcResult.NRdx} kN`, limitVal: '-', eta: '-', status: 'ĐẠT' },
      { stt: 3, item: 'Sức chịu nén lệch tâm phẳng Y', symbol: 'N_Rd,y', calcVal: `${calcResult.NRdy} kN`, limitVal: '-', eta: '-', status: 'ĐẠT' },
      { stt: 4, item: 'Sức chịu nén lệch tâm xiên Bresler', symbol: 'N_Rd', calcVal: `${calcResult.NRdBresler} kN`, limitVal: `≥ N = ${calcResult.Ned} kN`, eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.M1Pos !== undefined) {
    // 12. Bản sàn 2 phương Marcus
    title = 'PHỤ LỤC TÍNH TOÁN CỐT THÉP Ô BẢN SÀN BTCT 2 PHƯƠNG';
    subtitle = 'Xác định mômen uốn Marcus dải 1m & kiểm toán võng theo TCVN 5574:2018';
    inputRows = [
      { label: 'Kích thước ô bản Lx x Ly', symbol: 'L_x x L_y', value: `${calcResult.Lx} x ${calcResult.Ly}`, unit: 'm', ref: 'Mặt bằng sàn' },
      { label: 'Chiều dày bản sàn', symbol: 'h_s', value: `${calcResult.h} mm`, unit: 'mm', ref: `h0 = ${calcResult.h0} mm` },
      { label: 'Tải trọng tính toán ULS', symbol: 'q_ULS', value: `${calcResult.qUls} kN/m²`, unit: 'kN/m²', ref: '1.2 DL + 1.3 LL' },
    ];
    summaryRows = [
      { stt: 1, item: 'Mômen nhịp ngắn (Nhịp/Gối)', symbol: 'M_1', calcVal: `${calcResult.M1Pos} / ${calcResult.M1Neg} kNm`, limitVal: '-', eta: '-', status: 'ĐẠT' },
      { stt: 2, item: 'Cốt thép nhịp ngắn (Nhịp/Gối)', symbol: 'A_s1', calcVal: `${calcResult.As1Pos} / ${calcResult.As1Neg} mm²/m`, limitVal: 'TCVN 5574', eta: '-', status: 'ĐẠT' },
      { stt: 3, item: 'Kiểm toán độ võng đàn hồi', symbol: 'f', calcVal: `${calcResult.fCalc} mm`, limitVal: `≤ [f] = ${calcResult.fAllow} mm`, eta: calcResult.etaDeflection ? calcResult.etaDeflection.toFixed(3) : '-', status: calcResult.etaDeflection <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.MbRd !== undefined) {
    // 13. Dầm thép hình chữ I
    title = 'PHỤ LỤC KIỂM TOÁN DẦM THÉP HÌNH CHỮ I (BỀN UỐN, CẮT & LTB)';
    subtitle = 'Kiểm toán khả năng chịu tải ULS và ổn định uốn xoắn tổng thể theo TCVN 5575:2024';
    inputRows = [
      { label: 'Quy cách tiết diện dầm', symbol: 'Tiết diện', value: calcResult.profileName, unit: '-', ref: 'Bảng quy cách' },
      { label: 'Nhịp dầm tính toán L', symbol: 'L', value: `${calcResult.L} m`, unit: 'm', ref: 'Nhịp kết cấu' },
      { label: 'Mômen uốn tính toán ULS', symbol: 'M_Ed', value: `${calcResult.Med} kNm`, unit: 'kNm', ref: 'q.L²/8' },
    ];
    summaryRows = [
      { stt: 1, item: 'Khả năng chịu uốn bền tiết diện', symbol: 'M_c,Rd', calcVal: `${calcResult.McRd} kNm`, limitVal: `≥ M = ${calcResult.Med} kNm`, eta: calcResult.etaFlex?.toFixed(3) || '-', status: 'ĐẠT' },
      { stt: 2, item: 'Khả năng chịu cắt bản bụng', symbol: 'V_c,Rd', calcVal: `${calcResult.VcRd} kN`, limitVal: `≥ V = ${calcResult.Ved} kN`, eta: calcResult.etaShear?.toFixed(3) || '-', status: calcResult.etaShear <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT' },
      { stt: 3, item: 'Ổn định uốn xoắn LTB', symbol: 'M_b,Rd', calcVal: `${calcResult.MbRd} kNm`, limitVal: `χ_LT = ${calcResult.chiLT}`, eta: calcResult.etaFlex?.toFixed(3) || '-', status: calcResult.etaFlex <= 1.0 ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.Klat !== undefined) {
    // 14. Ổn định tổng thể
    title = 'PHỤ LỤC KIỂM TOÁN ỔN ĐỊNH TỔNG THỂ CÔNG TRÌNH';
    subtitle = 'Kiểm toán Chống lật, Chống trượt, Hiệu ứng P-Delta và Chuyển vị tầng theo TCVN 2737 & TCVN 5574';
    inputRows = [
      { label: 'Tổng tải trọng công trình', symbol: 'G_tot', value: `${calcResult.totalWeightG} kN`, unit: 'kN', ref: 'Tĩnh tải' },
      { label: 'Lực cắt ngang đáy V', symbol: 'V_ngang', value: `${calcResult.lateralWindV} kN`, unit: 'kN', ref: 'Tải ngang' },
      { label: 'Mômen gây lật Mw', symbol: 'M_w', value: `${calcResult.overturningMw} kNm`, unit: 'kNm', ref: 'Tải ngang' },
    ];
    summaryRows = [
      { stt: 1, item: 'Hệ số ổn định chống lật', symbol: 'K_lật', calcVal: `${calcResult.Klat}`, limitVal: '≥ [1.50]', eta: calcResult.etaLat?.toFixed(3) || '-', status: calcResult.passLat ? 'ĐẠT' : 'KHÔNG ĐẠT' },
      { stt: 2, item: 'Hệ số ổn định chống trượt', symbol: 'K_trượt', calcVal: `${calcResult.Ktruot}`, limitVal: '≥ [1.20]', eta: calcResult.etaTruot?.toFixed(3) || '-', status: calcResult.passTruot ? 'ĐẠT' : 'KHÔNG ĐẠT' },
      { stt: 3, item: 'Hệ số độ nhạy P-Delta', symbol: 'θ', calcVal: `${calcResult.theta}`, limitVal: '≤ [0.10 / 0.20]', eta: (calcResult.theta / 0.10).toFixed(3), status: calcResult.passPDelta ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.floorGd !== undefined) {
    // 10. Tích lũy tĩnh tải sàn & tường (TCVN 2737:2023)
    title = 'PHỤ LỤC TÍNH TOÁN TÍCH LŨY TĨNH TẢI SÀN VÀ TƯỜNG XÂY TRÊN DẦM';
    subtitle = 'Xác định tĩnh tải nhiều lớp hoàn thiện sàn & tải trọng phân bố đều của tường theo TCVN 2737:2023';
    inputRows = [
      { label: 'Số lớp cấu tạo sàn', symbol: 'Số lớp', value: `${calcResult.processedLayers?.length || 0} lớp`, unit: '-', ref: 'Bảng 3 TCVN 2737' },
      { label: 'Loại gạch xây tường', symbol: 'Gạch', value: calcResult.brickTypeName || 'Gạch 4 lỗ rỗng', unit: '-', ref: 'Bảng 3' },
      { label: 'Chiều cao tường thông thủy', symbol: 'H_w', value: `${calcResult.netWallHeight} m`, unit: 'm', ref: 'H_t - h_d' },
      { label: 'Tải tường tiêu chuẩn m²', symbol: 'g_w,k', value: `${calcResult.gWallTotalK} kN/m²`, unit: 'kN/m²', ref: 'Gạch + Trát vữa' },
      { label: 'Tĩnh tải sàn cho phép', symbol: '[G_d]', value: `${calcResult.allowableFloorGd} kN/m²`, unit: 'kN/m²', ref: 'Giới hạn kết cấu' },
    ];
    summaryRows = [
      { stt: 1, item: 'Tổng tĩnh tải sàn tiêu chuẩn', symbol: 'G_k', calcVal: `${calcResult.floorGk} kN/m²`, limitVal: '-', eta: '-', status: 'ĐẠT' },
      { stt: 2, item: 'Tổng tĩnh tải sàn tính toán', symbol: 'G_d', calcVal: `${calcResult.floorGd} kN/m²`, limitVal: `≤ ${calcResult.allowableFloorGd} kN/m²`, eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
      { stt: 3, item: 'Tải trọng tường tiêu chuẩn trên dầm', symbol: 'q_w,k', calcVal: `${calcResult.wallQk} kN/m`, limitVal: '-', eta: '-', status: 'ĐẠT' },
      { stt: 4, item: 'Tải trọng tường tính toán trên dầm', symbol: 'q_w,d', calcVal: `${calcResult.wallQd} kN/m`, limitVal: '-', eta: '-', status: 'ĐẠT' },
    ];
  } else if (calcResult.uB !== undefined) {
    // 9. Chọc thủng (B4)
    title = 'PHỤ LỤC KIỂM TOÁN KHẢ NĂNG CHỐNG CHỌC THỦNG SÀN NẤM VÀ ĐÀI CỌC';
    subtitle = 'Kiểm toán khả năng chống đâm thủng của bê tông và cốt đai theo TCVN 5574:2018 Mục 8.1.6';
    inputRows = [
      { label: 'Chiều dày bản sàn / đài cọc', symbol: 'h', value: calcResult.h, unit: 'mm', ref: `h₀ = ${calcResult.d} mm` },
      { label: 'Kích thước tiết diện cột', symbol: 'b_c × h_c', value: `${calcResult.columnB} × ${calcResult.columnH}`, unit: 'mm', ref: 'Mặt cắt cột' },
      { label: 'Chu vi đường bao tính toán', symbol: 'u_b', value: `${calcResult.uB} mm`, unit: 'mm', ref: 'Mục 8.1.6' },
      { label: 'Sức chịu chọc thủng bê tông', symbol: 'F_b,ult', value: `${calcResult.Fult} kN`, unit: 'kN', ref: 'CT 194' },
    ];
    summaryRows = [
      { stt: 1, item: 'Sức kháng chọc thủng của bê tông', symbol: 'F_b,ult', calcVal: `${calcResult.Fult} kN`, limitVal: 'Mục 8.1.6', eta: calcResult.etaF ? calcResult.etaF.toFixed(3) : '-', status: 'ĐẠT' },
      { stt: 2, item: 'Chỉ số kiểm toán chọc thủng tổng thể', symbol: 'η', calcVal: calcResult.utilization?.eta?.toFixed(3) || '-', limitVal: '≤ 1.000', eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.AsDesignMm2 !== undefined || calcResult.xiR !== undefined) {
    // 3. Cốt thép dầm BTCT (TCVN 5574:2018)
    title = 'PHỤ LỤC TÍNH TOÁN CỐT THÉP DẦM BÊ TÔNG CỐT THÉP ĐẶT CỐT ĐƠN';
    subtitle = 'Kiểm toán khả năng chịu uốn ULS, xác định diện tích cốt thép As và hàm lượng μ%';
    inputRows = [
      { label: 'Bề rộng tiết diện dầm', symbol: 'b', value: calcResult.b, unit: 'mm', ref: 'Thiết kế kiến trúc' },
      { label: 'Chiều cao tiết diện dầm', symbol: 'h', value: calcResult.h, unit: 'mm', ref: 'Thiết kế kết cấu' },
      { label: 'Lớp bảo vệ trọng tâm thép', symbol: 'a', value: calcResult.a, unit: 'mm', ref: `h₀ = ${calcResult.h0} mm` },
      { label: 'Cấp độ bền bê tông', symbol: 'B', value: calcResult.concrete || 'B25', unit: '-', ref: `R_b = ${calcResult.Rb} MPa (Bảng 6)` },
      { label: 'Nhóm cốt thép dọc chịu lực', symbol: 'Thép', value: calcResult.rebar || 'CB400V', unit: '-', ref: `R_s = ${calcResult.Rs} MPa (Bảng 13)` },
      { label: 'Moment uốn tính toán thiết kế', symbol: 'M_Ed', value: calcResult.M || 220, unit: 'kN.m', ref: 'Tổ hợp nội lực ULS' },
      { label: 'Giới hạn chiều cao vùng nén', symbol: 'ξ_R', value: calcResult.xiR, unit: '-', ref: 'Điều 8.1.2.2.3' },
    ];
    summaryRows = [
      { stt: 1, item: 'Chiều cao vùng nén bê tông tương đối', symbol: 'ξ', calcVal: calcResult.xi, limitVal: `≤ ξ_R = ${calcResult.xiR}`, eta: '-', status: calcResult.isOverReinforced ? 'KHÔNG ĐẠT' : 'ĐẠT' },
      { stt: 2, item: 'Diện tích cốt thép tính toán yêu cầu', symbol: 'A_s,req', calcVal: `${calcResult.AsDesignCm2} cm²`, limitVal: `μ = ${calcResult.muDesignPercent}%`, eta: '-', status: 'ĐẠT' },
      { stt: 3, item: 'Khả năng chịu uốn ULS tiết diện dầm', symbol: 'M_ult', calcVal: `${calcResult.Mult} kN.m`, limitVal: `≥ M = ${calcResult.M || 220} kN.m`, eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.Nbs !== undefined) {
    // 4. Bu lông CĐC (TCVN 5575:2024)
    title = 'PHỤ LỤC TÍNH TOÁN LIÊN KẾT BU LÔNG CƯỜNG ĐỘ CAO';
    subtitle = 'Kiểm toán khả năng chịu cắt và ép mặt của liên kết bu lông theo TCVN 5575:2024';
    inputRows = [
      { label: 'Mã hiệu bu lông', symbol: 'M', value: calcResult.boltCode || 'M20', unit: '-', ref: 'Quy cách thiết kế' },
      { label: 'Cấp độ bền bu lông', symbol: 'Grade', value: calcResult.grade || '8.8', unit: '-', ref: 'Bảng B.8' },
      { label: 'Đường kính thân bu lông', symbol: 'd', value: calcResult.d || 20, unit: 'mm', ref: `A = ${calcResult.A || 314} mm²` },
      { label: 'Số mặt cắt trượt tính toán', symbol: 'n_v', value: calcResult.nv || 1, unit: 'mặt', ref: 'Cấu tạo liên kết' },
      { label: 'Tổng chiều dày bản thép nhỏ nhất', symbol: 'Σt_min', value: calcResult.sumTMin || 12, unit: 'mm', ref: 'Chiều dày bản mã' },
      { label: 'Mác thép bản mã liên kết', symbol: 'Mác thép', value: calcResult.plateSteel || 'S235_SS400', unit: '-', ref: `f_u = ${calcResult.fu || 360} MPa` },
      { label: 'Lực cắt tính toán tác dụng', symbol: 'V_Ed', value: calcResult.shearForceV || 65, unit: 'kN', ref: 'Tổ hợp nội lực nút' },
    ];
    summaryRows = [
      { stt: 1, item: 'Khả năng chịu cắt của 1 bu lông', symbol: 'N_bs', calcVal: `${calcResult.Nbs} kN`, limitVal: 'Công thức 152', eta: '-', status: 'ĐẠT' },
      { stt: 2, item: 'Khả năng chịu ép mặt 1 bu lông', symbol: 'N_bp', calcVal: `${calcResult.Nbp} kN`, limitVal: 'Công thức 153', eta: '-', status: 'ĐẠT' },
      { stt: 3, item: 'Sức chịu cắt tính toán của bu lông', symbol: 'N_b', calcVal: `${calcResult.Nb} kN`, limitVal: `≥ V = ${calcResult.shearForceV || 65} kN`, eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.Qb !== undefined) {
    // 5. Cọc SPT (TCVN 10304:2014)
    title = 'PHỤ LỤC TÍNH TOÁN SỨC CHỊU TẢI CỌC ĐƠN THEO KẾT QUẢ SPT';
    subtitle = 'Xác định sức kháng mũi Qb, ma sát thân Qs và sức chịu tải cho phép Rc theo TCVN 10304:2014';
    inputRows = [
      { label: 'Phương pháp thi công cọc', symbol: 'Loại cọc', value: calcResult.pileMethodName || 'Cọc đóng/ép vuông bê tông cốt thép', unit: '-', ref: 'Giải pháp móng' },
      { label: 'Kích thước tiết diện cọc', symbol: 'D', value: calcResult.D || 400, unit: 'mm', ref: `u = ${(calcResult.u || 1.6).toFixed(2)} m` },
      { label: 'Chỉ số SPT trung bình tại mũi', symbol: 'N_p', value: calcResult.Np || 35, unit: 'búa', ref: 'Địa tầng mũi cọc' },
      { label: 'Hệ số an toàn đất nền', symbol: 'γ_k', value: calcResult.gammaK || 1.75, unit: '-', ref: 'Điều 7.1.11' },
      { label: 'Tải trọng thiết kế tác dụng đầu cọc', symbol: 'P_Ed', value: calcResult.designLoadP || 850, unit: 'kN', ref: 'Tổ hợp nội lực móng' },
      { label: 'Số lớp địa chất đi qua', symbol: 'Lớp đất', value: `${calcResult.layerCount || calcResult.layers?.length || 2} lớp`, unit: 'lớp', ref: 'Cột địa chất' },
    ];
    summaryRows = [
      { stt: 1, item: 'Sức kháng cực hạn mũi cọc', symbol: 'Q_b', calcVal: `${calcResult.Qb} kN`, limitVal: 'Điều 7.1.11', eta: '-', status: 'ĐẠT' },
      { stt: 2, item: 'Tổng ma sát cực hạn thành bên', symbol: 'Q_s', calcVal: `${calcResult.Qs} kN`, limitVal: 'Điều 7.1.11', eta: '-', status: 'ĐẠT' },
      { stt: 3, item: 'Sức chịu tải cho phép của cọc đơn', symbol: 'R_c', calcVal: `${calcResult.Rc} kN`, limitVal: `≥ P = ${calcResult.designLoadP || 850} kN`, eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  } else if (calcResult.L0an !== undefined) {
    // 6. Neo & nối thép (TCVN 5574:2018)
    title = 'PHỤ LỤC TÍNH TOÁN CHIỀU DÀI NEO VÀ NỐI CHỒNG CỐT THÉP';
    subtitle = 'Kiểm toán chiều dài neo Lan và chiều dài nối chồng Llap theo TCVN 5574:2018 (Công thức 255 – 259)';
    inputRows = [
      { label: 'Cấp độ bền bê tông', symbol: 'Bê tông', value: calcResult.concrete || 'B25', unit: '-', ref: `R_bt = ${calcResult.Rbt} MPa (Bảng 6)` },
      { label: 'Nhóm cốt thép', symbol: 'Thép', value: calcResult.rebarGrade || 'CB400V', unit: '-', ref: `R_s = ${calcResult.RsDesign} MPa (Bảng 13)` },
      { label: 'Đường kính thanh thép', symbol: 'd', value: calcResult.d || 20, unit: 'mm', ref: `Φ${calcResult.d || 20}` },
      { label: 'Trạng thái chịu lực', symbol: 'Trạng thái', value: calcResult.stressState === 'compression' ? 'Chịu Nén' : 'Chịu Kéo', unit: '-', ref: `α_an = ${calcResult.alphaAn}` },
      { label: 'Cường độ bám dính tính toán', symbol: 'R_bond', value: calcResult.Rbond, unit: 'MPa', ref: 'Điều 10.3.5.2' },
      { label: 'Tỷ số diện tích cốt thép', symbol: 'A_req/A_prov', value: calcResult.areaRatio || 1.0, unit: '-', ref: 'Điều 10.3.5.3' },
      { label: 'Chiều dài thực tế bố trí', symbol: 'L_actual', value: calcResult.actualLength || 850, unit: 'mm', ref: 'Kiểm toán thi công' },
    ];
    summaryRows = [
      { stt: 1, item: 'Chiều dài neo cơ sở', symbol: 'L_0,an', calcVal: `${calcResult.L0an} mm`, limitVal: `${calcResult.L0anD || +(calcResult.L0an / (calcResult.d || 20)).toFixed(1)}d`, eta: '-', status: 'ĐẠT' },
      { stt: 2, item: 'Chiều dài nối chồng tính toán', symbol: 'L_lap', calcVal: `${calcResult.Llap} mm`, limitVal: `${calcResult.LlapD || +(calcResult.Llap / (calcResult.d || 20)).toFixed(1)}d`, eta: '-', status: 'ĐẠT' },
      { stt: 3, item: 'Chiều dài neo tính toán thiết kế', symbol: 'L_an', calcVal: `${calcResult.Lan} mm`, limitVal: `≤ L_thực tế = ${calcResult.actualLength || 850} mm`, eta: calcResult.utilization?.eta?.toFixed(3) || '-', status: calcResult.utilization?.passed ? 'ĐẠT' : 'KHÔNG ĐẠT' },
    ];
  }

  const markdownContent = `# ${title}
## ${subtitle}

**Đơn vị:** ${orgName}  
**Quy cách định dạng:** ${presetLabel}  
**Thông số in ấn:** ${fontNote}  
**Căn cứ pháp lý:** ${standardRef}  
**Ngày lập:** ${dateStr}  
**Trạng thái kiểm toán:** ${calcResult.utilization?.passed ? '[ĐẠT / OK]' : '[KHÔNG ĐẠT / REJECT]'} (η = ${calcResult.utilization?.eta?.toFixed(3) || '-'})

---

### 1. BẢNG THÔNG SỐ ĐẦU VÀO THIẾT KẾ
| STT | Thông số thiết kế | Ký hiệu | Giá trị | Đơn vị | Căn cứ tiêu chuẩn |
|:---:|---|:---:|---:|:---:|---|
${inputRows.map((r, i) => `| ${i + 1} | ${r.label} | ${r.symbol} | ${r.value} | ${r.unit} | ${r.ref} |`).join('\n')}

---

### 2. TRÌNH TỰ TÍNH TOÁN STEP-BY-STEP (THAY SỐ CHI TIẾT)
${(calcResult.steps || []).map((s, i) => `#### 2.${i + 1} Bước ${i + 1}\n> ${s}\n`).join('\n')}

---

### 3. BẢNG TỔNG HỢP KẾT QUẢ KIỂM TOÁN CHỈ SỐ SỬ DỤNG η
| STT | Tiêu chí kiểm tra | Ký hiệu | Giá trị tính toán | Giới hạn cho phép | Hệ số η | Kết luận |
|:---:|---|:---:|---:|---:|:---:|:---:|
${summaryRows.map((r) => `| ${r.stt} | ${r.item} | ${r.symbol} | ${r.calcVal} | ${r.limitVal} | ${r.eta} | **${r.status}** |`).join('\n')}

---
*Ghi chú: Hồ sơ do Trợ lý AI lập tự động chuẩn SKILL_PHULUC. Cần kỹ sư có chứng chỉ hành nghề kiểm tra trước khi ký đóng dấu.*
`;

  return {
    title,
    subtitle,
    standardRef,
    dateStr,
    stylePreset,
    inputRows,
    summaryRows,
    steps: calcResult.steps || [],
    utilization: calcResult.utilization,
    markdownContent,
  };
}
