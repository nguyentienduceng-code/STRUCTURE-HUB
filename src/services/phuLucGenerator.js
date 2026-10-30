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
