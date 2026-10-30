// ============================================================================
// HỆ THỐNG MÁY TÍNH KẾT CẤU TƯƠNG TÁC CHUẨN 4 TẦNG (TCVN)
// TCVN 2737:2023 | TCVN 5574:2018 | TCVN 5575:2024 | TCVN 10304:2014
// ============================================================================

export function evaluateUtilization(eta) {
  const safeEta = Number.isFinite(eta) && eta >= 0 ? eta : 0;
  if (safeEta <= 0.70) {
    return {
      eta: safeEta,
      percent: Math.min(100, +(safeEta * 100).toFixed(1)),
      level: 'SAFE',
      icon: '🟢',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.35)',
      label: 'An toàn, có thể tối ưu tiết diện (η ≤ 0.70)',
      policyAdvice: 'Value Engineering — An toàn cao, xem xét giảm tiết diện hoặc giảm hàm lượng thép để tiết kiệm chi phí CAPEX.',
      passed: true,
    };
  }
  if (safeEta <= 0.90) {
    return {
      eta: safeEta,
      percent: Math.min(100, +(safeEta * 100).toFixed(1)),
      level: 'OPTIMAL',
      icon: '🟡',
      color: '#eab308',
      bg: 'rgba(234, 179, 8, 0.12)',
      border: 'rgba(234, 179, 8, 0.35)',
      label: 'Hợp lý, thiết kế tối ưu (0.70 < η ≤ 0.90)',
      policyAdvice: 'Thiết kế tối ưu — Tiết diện và khả năng chịu lực cân bằng kỹ thuật & kinh tế.',
      passed: true,
    };
  }
  if (safeEta <= 1.00) {
    return {
      eta: safeEta,
      percent: Math.min(100, +(safeEta * 100).toFixed(1)),
      level: 'WARNING',
      icon: '🟠',
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.12)',
      border: 'rgba(249, 115, 22, 0.35)',
      label: 'Sát giới hạn cho phép (0.90 < η ≤ 1.00)',
      policyAdvice: 'Cảnh báo sát ngưỡng cho phép — Cần kiểm tra kỹ các giả định liên kết và sai số thi công.',
      passed: true,
    };
  }
  return {
    eta: safeEta,
    percent: 100,
    level: 'FAIL',
    icon: '🔴',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.45)',
    label: 'KHÔNG ĐẠT — Nguy hiểm, vượt giới hạn chịu lực (η > 1.00)',
    policyAdvice: 'HOLD POINT — KHÔNG ĐẠT (η > 1.00). Bắt buộc dừng hồ sơ và điều chỉnh tăng tiết diện hoặc mác vật liệu.',
    passed: false,
  };
}

// ============================================================================
// MÔ-ĐUN 1: TÍNH ÁP LỰC GIÓ THEO TCVN 2737:2023 (Điều 10 & Phụ lục E)
// ============================================================================
export const WIND_ZONES_TCVN2737 = {
  'I-A': { code: 'I-A', name: 'Vùng I-A (Nội địa Tây Nam Bộ, Tây Nguyên kín)', W0: 0.55, locationHint: 'Lâm Đồng, Bình Phước, Tây Ninh, Đồng Tháp' },
  'I-B': { code: 'I-B', name: 'Vùng I-B (Đô thị Nam Bộ - TP.HCM, Bình Dương)', W0: 0.65, locationHint: 'TP. Hồ Chí Minh, Bình Dương, Đồng Nai, Cần Thơ' },
  'II-A': { code: 'II-A', name: 'Vùng II-A (Đồng bằng Bắc Bộ & Trung du - Hà Nội)', W0: 0.83, locationHint: 'Hà Nội, Bắc Ninh, Vĩnh Phúc, Phú Thọ, Huế' },
  'II-B': { code: 'II-B', name: 'Vùng II-B (Ven biển Nam Bộ & Nam Trung Bộ)', W0: 0.95, locationHint: 'Bà Rịa - Vũng Tàu, Khánh Hòa, Ninh Thuận, Cà Mau' },
  'III-A': { code: 'III-A', name: 'Vùng III-A (Đô thị ven biển Trung/Bắc Bộ - Đà Nẵng)', W0: 1.10, locationHint: 'Đà Nẵng, Quảng Nam, Quảng Ngãi, Bình Định' },
  'III-B': { code: 'III-B', name: 'Vùng III-B (Ven biển Bắc Bộ - Hải Phòng, Quảng Ninh)', W0: 1.25, locationHint: 'Hải Phòng, Thái Bình, Nam Định, Ninh Bình' },
  'IV-A': { code: 'IV-A', name: 'Vùng IV-A (Ven biển Bắc Trung Bộ cấp A)', W0: 1.40, locationHint: 'Khu vực ven biển Hà Tĩnh, Quảng Bình' },
  'IV-B': { code: 'IV-B', name: 'Vùng IV-B (Vùng bão rất mạnh Bắc Trung Bộ & Ven biển)', W0: 1.55, locationHint: 'Quảng Ninh ven biển, Nam Định, Thanh Hóa, Nghệ An' },
  'IV': { code: 'IV', name: 'Vùng IV (Vùng bão mạnh Bắc Trung Bộ & Ven biển QN)', W0: 1.55, locationHint: 'Quảng Ninh (ven biển), Thanh Hóa, Nghệ An, Hà Tĩnh' },
  'V': { code: 'V', name: 'Vùng V (Hải đảo xa bờ - Bạch Long Vĩ, Hoàng Sa)', W0: 1.85, locationHint: 'Đảo Bạch Long Vĩ, Cô Tô, Cồn Cỏ, Hoàng Sa, Trường Sa' },
};

export const TERRAIN_TYPES_TCVN2737 = {
  A: {
    code: 'A',
    name: 'Dạng A — Trống trải ven biển, mặt hồ/sông lớn (vật cản < 1.5m)',
    zg: 215,
    alpha: 11.5,
    zmin: 2.0,
  },
  B: {
    code: 'B',
    name: 'Dạng B — Thị trấn, ngoại ô, vật cản thưa cao < 10m (Địa hình chuẩn)',
    zg: 275,
    alpha: 9.5,
    zmin: 4.5,
  },
  C: {
    code: 'C',
    name: 'Dạng C — Đô thị nhà cao tầng san sát, vật cản cao > 10m',
    zg: 365,
    alpha: 7.0,
    zmin: 9.0,
  },
};

export function calculateWindTCVN2737({
  zone = 'II-A',
  terrain = 'B',
  z = 20,
  c = 0.8,
  gf = 0.85,
  gammaF = 1.25,
  allowableWd = 2.0,
}) {
  const errors = [];
  const numZ = Number(z);
  const numC = Number(c);
  const numGf = Number(gf);
  const numGammaF = Number(gammaF);
  const numAllowable = Number(allowableWd);

  if (!WIND_ZONES_TCVN2737[zone]) errors.push('Vùng gió không hợp lệ.');
  if (!TERRAIN_TYPES_TCVN2737[terrain]) errors.push('Dạng địa hình không hợp lệ.');
  if (!Number.isFinite(numZ) || numZ <= 0 || numZ > 300) {
    errors.push('Chiều cao tính toán z phải nằm trong khoảng (0 < z ≤ 300 m).');
  }
  if (!Number.isFinite(numC) || numC === 0 || Math.abs(numC) > 3.5) {
    errors.push('Hệ số khí động c phải khác 0 và |c| ≤ 3.5.');
  }
  if (!Number.isFinite(numGf) || numGf < 0.5 || numGf > 2.0) {
    errors.push('Hệ số hiệu ứng giật Gf phải nằm trong khoảng [0.50, 2.00].');
  }
  if (!Number.isFinite(numAllowable) || numAllowable <= 0) {
    errors.push('Áp lực gió giới hạn cho phép [Wd] phải lớn hơn 0.');
  }
  if (!Number.isFinite(numGammaF) || numGammaF < 1.0 || numGammaF > 2.1) {
    errors.push('Hệ số tin cậy tải trọng gió γ_f phải nằm trong khoảng [1.00, 2.10] (1.25 = TCVN 2737:2023, 2.1 = quy đổi TCVN 2737:1995).');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const zoneData = WIND_ZONES_TCVN2737[zone];
  const terrainData = TERRAIN_TYPES_TCVN2737[terrain];
  const W0 = zoneData.W0;
  const zEff = Math.max(numZ, terrainData.zmin);

  // Công thức lũy thừa giải tích TCVN 2737:2023 (Bảng 10 / Công thức E.1):
  // k(z) = 2.01 * (z_eff / z_g)^(2 / alpha)
  const kz = 2.01 * Math.pow(zEff / terrainData.zg, 2 / terrainData.alpha);

  // Áp lực gió tiêu chuẩn W_k = W_0 * k(z) * c * G_f
  const Wk = W0 * kz * numC * numGf;

  // Áp lực gió tính toán W_d = gamma_f * W_k
  const Wd = numGammaF * Wk;

  // Hệ số sử dụng η = |W_d| / [W_d]
  const eta = Math.abs(Wd) / numAllowable;
  const utilization = evaluateUtilization(eta);

  const isClampedZ = numZ < terrainData.zmin;
  const steps = [
    `Bước 1 [TCVN 2737:2023 — Bảng 9]: Tra áp lực gió cơ sở vùng ${zoneData.code}: W₀ = ${W0.toFixed(2)} kN/m² (${(W0 * 100).toFixed(0)} daN/m²).`,
    `Bước 2 [TCVN 2737:2023 — Điều 10.2.5]: Địa hình dạng ${terrainData.code} có z_g = ${terrainData.zg} m, α = ${terrainData.alpha}, z_min = ${terrainData.zmin} m. Cao độ tính toán hiệu dụng z_eff = max(${numZ}, ${terrainData.zmin}) = ${zEff.toFixed(2)} m${isClampedZ ? ` (⚠️ Do z = ${numZ}m < z_min = ${terrainData.zmin}m, theo Điều 10.2.5 TCVN 2737:2023 lấy z_eff = z_min để không làm hụt áp lực gió tầng thấp)` : ''}.`,
    `Bước 3 [TCVN 2737:2023 — Bảng 10]: Hệ số kể đến sự thay đổi áp lực gió theo độ cao: k(z) = 2.01 × (${zEff.toFixed(2)} / ${terrainData.zg})^(2 / ${terrainData.alpha}) = ${kz.toFixed(4)}.`,
    `Bước 4 [TCVN 2737:2023 — Công thức (35)]: Áp lực gió tiêu chuẩn: W_k = W₀ × k(z) × c × G_f = ${W0.toFixed(2)} × ${kz.toFixed(4)} × (${numC}) × ${numGf.toFixed(2)} = ${Wk.toFixed(3)} kN/m².`,
    `Bước 5 [TCVN 2737:2023 — Điều 10.2.2]: Áp lực gió tính toán (γ_f = ${numGammaF.toFixed(2)}): W_d = ${numGammaF.toFixed(2)} × (${Wk.toFixed(3)}) = ${Wd.toFixed(3)} kN/m² (${(Wd * 100).toFixed(1)} daN/m²).`,
    `Bước 6 [Đánh giá η]: η = |W_d| / [W_d] = ${Math.abs(Wd).toFixed(3)} / ${numAllowable.toFixed(2)} = ${eta.toFixed(3)} → ${utilization.icon} ${utilization.label}.`,
  ];

  return {
    valid: true,
    errors: [],
    W0,
    zEff,
    kz: +kz.toFixed(4),
    Wk: +Wk.toFixed(3),
    Wd: +Wd.toFixed(3),
    absWk: +Math.abs(Wk).toFixed(3),
    absWd: +Math.abs(Wd).toFixed(3),
    gammaF: numGammaF,
    gf: numGf,
    c: numC,
    allowableWd: numAllowable,
    utilization,
    steps,
    standardRef: 'TCVN 2737:2023 — Điều 10, Bảng 9 & Bảng 10',
  };
}

// ============================================================================
// MÔ-ĐUN 2: TÍNH HỆ SỐ CHIẾT GIẢM HOẠT TẢI SÀN THEO DIỆN TÍCH & SỐ TẦNG
// ============================================================================
export const LIVE_LOAD_CATEGORIES = {
  residential: {
    id: 'residential',
    name: 'Phòng ở căn hộ, nhà ở, ký túc xá (Nhóm A)',
    pk: 1.5,
    gammaF: 1.3,
    groupType: 'A1',
    A0: 9.0,
    clause: 'TCVN 2737:2023 — Bảng 4 & Điều 8.2.3 (Nhóm A1)',
  },
  office: {
    id: 'office',
    name: 'Văn phòng làm việc, phòng học, bệnh viện (Nhóm B)',
    pk: 2.0,
    gammaF: 1.3,
    groupType: 'A2',
    A0: 36.0,
    clause: 'TCVN 2737:2023 — Bảng 4 & Điều 8.2.3 (Nhóm A2)',
  },
  parking: {
    id: 'parking',
    name: 'Bãi đỗ xe con, khu vực giao thông nhẹ (Nhóm F)',
    pk: 2.5,
    gammaF: 1.2,
    groupType: 'A2',
    A0: 36.0,
    clause: 'TCVN 2737:2023 — Bảng 4 & Điều 8.2.3',
  },
  assembly: {
    id: 'assembly',
    name: 'Hội trường, hành lang, sảnh công cộng (Nhóm C)',
    pk: 3.0,
    gammaF: 1.2,
    groupType: 'A2',
    A0: 36.0,
    clause: 'TCVN 2737:2023 — Bảng 4 & Điều 8.2.3 (Nhóm A2)',
  },
};

export function calculateLiveLoadReduction({
  category = 'office',
  area = 48,
  floors = 6,
  clampLowerBound = true,
  designCapacityPd = 3.0,
}) {
  const errors = [];
  const numA = Number(area);
  const numN = Number(floors);
  const numCap = Number(designCapacityPd);

  if (!LIVE_LOAD_CATEGORIES[category]) errors.push('Loại công năng không hợp lệ.');
  if (!Number.isFinite(numA) || numA <= 0 || numA > 5000) {
    errors.push('Diện tích chịu tải A phải nằm trong khoảng (0 < A ≤ 5000 m²).');
  }
  if (!Number.isFinite(numN) || numN < 1 || numN > 150 || !Number.isInteger(numN)) {
    errors.push('Số tầng truyền tải n phải là số nguyên từ 1 đến 150.');
  }
  if (!Number.isFinite(numCap) || numCap <= 0) {
    errors.push('Khả năng chịu hoạt tải thiết kế [p_d] phải lớn hơn 0.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const cat = LIVE_LOAD_CATEGORIES[category];
  const pk = cat.pk;
  const gammaF = cat.gammaF;
  const pdUnreduced = pk * gammaF;

  // Tính hệ số chiết giảm diện tích alpha_A theo Điều 8.2 TCVN 2737:2023:
  // Nhóm A1 (A > A1 = 9 m²): alpha_A1 = 0.4 + 0.6 / sqrt(A / 9) = 0.4 + 1.8 / sqrt(A)
  // Nhóm A2 (A > A2 = 36 m²): alpha_A2 = 0.5 + 0.5 / sqrt(A / 36) = 0.5 + 3.0 / sqrt(A)
  let rawAlphaA;
  if (cat.groupType === 'A1') {
    rawAlphaA = numA > cat.A0 ? 0.4 + 0.6 / Math.sqrt(numA / cat.A0) : 1.0;
  } else {
    rawAlphaA = numA > cat.A0 ? 0.5 + 0.5 / Math.sqrt(numA / cat.A0) : 1.0;
  }
  rawAlphaA = Math.min(1.0, rawAlphaA);

  const minAlphaFloor = clampLowerBound ? 0.60 : 0.40;
  const isClamped = rawAlphaA < minAlphaFloor;
  const alphaA = Math.max(minAlphaFloor, rawAlphaA);

  // Hệ số chiết giảm theo số tầng n (Điều 8.2 & Bảng 7):
  // alpha_n = alpha_A + (1 - alpha_A) / sqrt(n) khi n >= 2
  const alphaN = numN >= 2
    ? alphaA + (1 - alphaA) / Math.sqrt(numN)
    : alphaA;

  const pkReducedArea = pk * alphaA;
  const pdReducedArea = pdUnreduced * alphaA;
  const pdReducedColumn = pdUnreduced * alphaN;

  // Chỉ số sử dụng η = p_d,red / [p_d]
  const eta = pdReducedArea / numCap;
  const utilization = evaluateUtilization(eta);

  const steps = [
    `Bước 1 [TCVN 2737:2023 — Bảng 4]: Công năng "${cat.name}" có p_k = ${pk.toFixed(2)} kN/m², hệ số độ tin cậy γ_f = ${gammaF.toFixed(2)} → Hoạt tải tính toán chưa giảm p_d = ${pk.toFixed(2)} × ${gammaF.toFixed(2)} = ${pdUnreduced.toFixed(3)} kN/m².`,
    cat.groupType === 'A1'
      ? `Bước 2 [TCVN 2737:2023 — Điều 8.2]: Với A = ${numA.toFixed(1)} m² (A₁ = 9 m²), tính α_A1,lt = 0.4 + 0.6 / √(${numA.toFixed(1)} / 9) = ${rawAlphaA.toFixed(4)}.`
      : `Bước 2 [TCVN 2737:2023 — Điều 8.2]: Với A = ${numA.toFixed(1)} m² (A₂ = 36 m²), tính α_A2,lt = ${numA > 36 ? `0.5 + 0.5 / √(${numA.toFixed(1)} / 36) = ${rawAlphaA.toFixed(4)}` : '1.0000 (do A ≤ 36 m²)'}.`,
    `Bước 3 [Kiểm soát biên an toàn]: ${clampLowerBound ? `Áp dụng khóa cận dưới α_A ≥ 0.60 → α_A = ${alphaA.toFixed(4)}${isClamped ? ' (Đã khóa ở ngưỡng an toàn 0.60)' : ''}.` : `Không khóa cận dưới 0.60 → α_A = ${alphaA.toFixed(4)}.`}`,
    `Bước 4 [TCVN 2737:2023 — Điều 8.2]: Hệ số chiết giảm theo số tầng (n = ${numN} tầng): α_n = ${numN >= 2 ? `${alphaA.toFixed(4)} + (1 - ${alphaA.toFixed(4)}) / √${numN} = ${alphaN.toFixed(4)}` : `${alphaN.toFixed(4)} (n = 1)`}.`,
    `Bước 5 [Hoạt tải sau chiết giảm]: Sàn/Dầm: p_d,red(A) = ${alphaA.toFixed(4)} × ${pdUnreduced.toFixed(3)} = ${pdReducedArea.toFixed(3)} kN/m² | Cột/Vách (${numN} tầng): p_d,red(n) = ${alphaN.toFixed(4)} × ${pdUnreduced.toFixed(3)} = ${pdReducedColumn.toFixed(3)} kN/m².`,
    `Bước 6 [Đánh giá η]: η = p_d,red(A) / [p_d] = ${pdReducedArea.toFixed(3)} / ${numCap.toFixed(2)} = ${eta.toFixed(3)} → ${utilization.icon} ${utilization.label}.`,
  ];

  return {
    valid: true,
    errors: [],
    categoryName: cat.name,
    groupType: cat.groupType,
    pk,
    gammaF,
    pdUnreduced: +pdUnreduced.toFixed(3),
    rawAlphaA: +rawAlphaA.toFixed(4),
    alphaA: +alphaA.toFixed(4),
    alphaN: +alphaN.toFixed(4),
    isClamped,
    pkReducedArea: +pkReducedArea.toFixed(3),
    pdReducedArea: +pdReducedArea.toFixed(3),
    pdReducedColumn: +pdReducedColumn.toFixed(3),
    reductionPercentArea: +((1 - alphaA) * 100).toFixed(1),
    reductionPercentColumn: +((1 - alphaN) * 100).toFixed(1),
    utilization,
    steps,
    standardRef: cat.clause,
  };
}

// ============================================================================
// MÔ-ĐUN 3: TÍNH CỐT THÉP DẦM CHỮ NHẬT ĐẶT CỐT ĐƠN (TCVN 5574:2018)
// ============================================================================
export const CONCRETE_GRADES_TCVN5574 = {
  B15: { code: 'B15', Rb: 8.5, Rbt: 0.75, Eb: 24000, macEquiv: 'M200' },
  B20: { code: 'B20', Rb: 11.5, Rbt: 0.90, Eb: 27500, macEquiv: 'M250' },
  B25: { code: 'B25', Rb: 14.5, Rbt: 1.05, Eb: 30000, macEquiv: 'M300' },
  B30: { code: 'B30', Rb: 17.0, Rbt: 1.15, Eb: 32500, macEquiv: 'M400' },
  B35: { code: 'B35', Rb: 19.5, Rbt: 1.30, Eb: 34500, macEquiv: 'M450' },
  B40: { code: 'B40', Rb: 22.0, Rbt: 1.40, Eb: 36000, macEquiv: 'M500' },
  B45: { code: 'B45', Rb: 25.0, Rbt: 1.50, Eb: 37500, macEquiv: 'M600' },
  B50: { code: 'B50', Rb: 27.5, Rbt: 1.60, Eb: 39000, macEquiv: 'M650' },
  B55: { code: 'B55', Rb: 30.0, Rbt: 1.70, Eb: 39500, macEquiv: 'M700' },
  B60: { code: 'B60', Rb: 33.0, Rbt: 1.80, Eb: 40000, macEquiv: 'M750' },
};

export const REBAR_GRADES_TCVN5574 = {
  CB240T: { code: 'CB240T', Rs: 210, Rsc: 210, Rsw: 170, Es: 200000, type: 'plain' },
  CB300V: { code: 'CB300V', Rs: 260, Rsc: 260, Rsw: 210, Es: 200000, type: 'deformed' },
  CB400V: { code: 'CB400V', Rs: 350, Rsc: 350, Rsw: 280, Es: 200000, type: 'deformed' },
  CB500V: { code: 'CB500V', Rs: 435, Rsc: 400, Rsw: 300, Es: 200000, type: 'deformed' },
};

export function calculateBeamRebarTCVN5574({
  b = 300,
  h = 600,
  a = 45,
  M = 220,
  concrete = 'B25',
  rebar = 'CB400V',
  gammaB = 1.0,
}) {
  const errors = [];
  const numB = Number(b);
  const numH = Number(h);
  const numA = Number(a);
  const numM = Number(M);
  const numGammaB = Number(gammaB);

  if (!CONCRETE_GRADES_TCVN5574[concrete]) errors.push('Cấp độ bền bê tông không hợp lệ.');
  if (!REBAR_GRADES_TCVN5574[rebar]) errors.push('Nhóm cốt thép không hợp lệ.');
  if (!Number.isFinite(numB) || numB < 100 || numB > 2500) {
    errors.push('Bề rộng dầm b phải nằm trong khoảng [100, 2500] mm.');
  }
  if (!Number.isFinite(numH) || numH < 150 || numH > 4000) {
    errors.push('Chiều cao dầm h phải nằm trong khoảng [150, 4000] mm.');
  }
  if (!Number.isFinite(numA) || numA < 15 || numA >= numH / 2) {
    errors.push('Khoảng cách a phải nằm trong khoảng [15 mm, h/2).');
  }
  if (!Number.isFinite(numM) || numM <= 0 || numM > 50000) {
    errors.push('Mômen uốn tính toán M phải lớn hơn 0 (0 < M ≤ 50000 kNm).');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const conc = CONCRETE_GRADES_TCVN5574[concrete];
  const steel = REBAR_GRADES_TCVN5574[rebar];
  const Rb = conc.Rb * numGammaB;
  const Rs = steel.Rs;
  const Es = steel.Es;
  const epsB2 = 0.0035;

  const h0 = numH - numA;

  // Chiều cao vùng nén giới hạn tương đối (Điều 8.1.2.2.2 — TCVN 5574:2018):
  // xi_R = 0.8 / (1 + (Rs / Es) / eps_b2)
  const xiR = 0.8 / (1 + (Rs / Es) / epsB2);
  const alphaR = xiR * (1 - 0.5 * xiR);

  // Mômen giới hạn tiết diện đặt cốt đơn M_ult (kNm):
  const Mult = (alphaR * Rb * numB * Math.pow(h0, 2)) / 1e6;

  // Hệ số alpha_m:
  const alphaM = (numM * 1e6) / (Rb * numB * Math.pow(h0, 2));

  const isOverReinforced = alphaM > alphaR;

  let xi;
  let x;
  let AsRequired;

  if (alphaM <= 0.5) {
    xi = 1 - Math.sqrt(Math.max(0, 1 - 2 * alphaM));
    x = xi * h0;
    // Công thức chuẩn TCVN 5574:2018:
    // As = (Rb * b * h0 / Rs) * (1 - sqrt(1 - 2M / (Rb * b * h0^2)))
    AsRequired = ((Rb * numB * h0) / Rs) * (1 - Math.sqrt(Math.max(0, 1 - 2 * alphaM)));
  } else {
    xi = 1.0;
    x = h0;
    AsRequired = (numM * 1e6) / (Rs * 0.5 * h0);
  }

  // Hàm lượng cốt thép tối thiểu mu_min = 0.10% (Điều 10.3.3.2 — TCVN 5574:2018)
  const muMin = 0.10;
  const muMax = (xiR * Rb / Rs) * 100;
  const AsMin = (muMin / 100) * numB * h0;
  const AsDesign = Math.max(AsRequired, AsMin);
  const muPercent = (AsRequired / (numB * h0)) * 100;
  const muDesignPercent = (AsDesign / (numB * h0)) * 100;

  // Gợi ý bố trí cốt thép thực tế (Ø16, Ø18, Ø20, Ø22, Ø25, Ø28)
  const barDiameters = [16, 18, 20, 22, 25, 28];
  const rebarSuggestions = barDiameters.map((d) => {
    const area1 = (Math.PI * d * d) / 4;
    const count = Math.max(2, Math.ceil(AsDesign / area1));
    const totalArea = count * area1;
    return {
      diameter: d,
      count,
      label: `${count}Ø${d}`,
      totalAreaMm2: +totalArea.toFixed(0),
      totalAreaCm2: +(totalArea / 100).toFixed(2),
    };
  }).filter((item) => item.count >= 2 && item.count <= 8);

  // Chỉ số sử dụng η = M / M_ult
  const eta = numM / Mult;
  const utilization = evaluateUtilization(eta);

  let statusMessage;
  let finalSuggestions = rebarSuggestions;
  let finalUtilization = utilization;

  if (isOverReinforced) {
    statusMessage = '🔴 HOLD POINT — Tiết diện quá tải, phá hoại giòn (ξ > ξ_R). Bắt buộc tăng kích thước tiết diện b x h, nâng cấp bền bê tông hoặc thiết kế cốt kép (As & As\')!';
    finalSuggestions = []; // Khóa không xuất cốt thép đơn giả tạo khi vượt giới hạn ULS
    finalUtilization = {
      ...utilization,
      level: 'FAIL',
      icon: '🔴',
      passed: false,
      label: 'HOLD POINT — Quá tải, phá hoại giòn (ξ > ξ_R)',
      policyAdvice: 'HOLD POINT — Quá tải ULS (ξ > ξ_R). Nguy cơ bê tông vùng nén bị vỡ nát trước khi cốt thép chảy dẻo. Bắt buộc tăng kích thước hoặc tính cốt kép.',
    };
  } else if (muPercent < muMin) {
    statusMessage = `Hàm lượng tính toán μ = ${muPercent.toFixed(2)}% < μ_min = 0.10% → Đã tự động lấy theo cấu tạo A_s,min = ${AsMin.toFixed(0)} mm² (TCVN 5574:2018 Điều 10.3.3.2).`;
  } else if (muPercent >= 0.8 && muPercent <= 1.8) {
    statusMessage = `Hàm lượng cốt thép hợp lý và kinh tế (μ = ${muPercent.toFixed(2)}%, nằm trong vùng tối ưu 0.8% – 1.8%).`;
  } else {
    statusMessage = `Tiết diện đủ khả năng chịu uốn đặt cốt đơn (ξ = ${xi.toFixed(3)} ≤ ξ_R = ${xiR.toFixed(3)}).`;
  }

  const steps = [
    `Bước 1 [Thông số vật liệu — TCVN 5574:2018 Bảng 6 & 13]: Bê tông ${conc.code} có R_b = ${conc.Rb} × ${numGammaB} = ${Rb.toFixed(2)} MPa; Cốt thép ${steel.code} có R_s = ${Rs} MPa, E_s = 200,000 MPa, ε_b2 = 0.0035.`,
    `Bước 2 [Chiều cao làm việc & Giới hạn vùng nén — Điều 8.1.2.2.2]: h₀ = h - a = ${numH} - ${numA} = ${h0} mm. Tính ξ_R = 0.8 / [1 + ${Rs} / (0.0035 × 200000)] = ${xiR.toFixed(4)} → α_R = ξ_R(1 - 0.5ξ_R) = ${alphaR.toFixed(4)}.`,
    `Bước 3 [Mômen giới hạn cốt đơn]: M_ult = α_R × R_b × b × h₀² = ${alphaR.toFixed(4)} × ${Rb.toFixed(2)} × ${numB} × ${h0}² × 10⁻⁶ = ${Mult.toFixed(2)} kNm.`,
    `Bước 4 [Tính α_m & ξ]: α_m = M / (R_b × b × h₀²) = (${numM} × 10⁶) / (${Rb.toFixed(2)} × ${numB} × ${h0}²) = ${alphaM.toFixed(4)} → ξ = 1 - √(1 - 2α_m) = ${xi.toFixed(4)}, chiều cao vùng nén x = ξ × h₀ = ${x.toFixed(1)} mm.`,
    `Bước 5 [Kiểm tra điều kiện hạn chế ξ ≤ ξ_R]: ξ = ${xi.toFixed(4)} ${isOverReinforced ? `> ξ_R = ${xiR.toFixed(4)} → 🔴 VƯỢT GIỚI HẠN CỐT ĐƠN!` : `≤ ξ_R = ${xiR.toFixed(4)} → 🟢 ĐẠT điều kiện đặt cốt đơn.`}`,
    `Bước 6 [Diện tích cốt thép & Hàm lượng μ%]: A_s,yc = ${AsRequired.toFixed(1)} mm² (${(AsRequired / 100).toFixed(2)} cm²), A_s,min = ${AsMin.toFixed(1)} mm² → Chọn A_s,tk = ${AsDesign.toFixed(1)} mm² (${(AsDesign / 100).toFixed(2)} cm²), μ = ${muDesignPercent.toFixed(2)}%.`,
    `Bước 7 [Đánh giá η]: η = M / M_ult = ${numM.toFixed(1)} / ${Mult.toFixed(2)} = ${eta.toFixed(3)} → ${utilization.icon} ${utilization.label}.`,
  ];

  return {
    valid: true,
    errors: [],
    b: numB,
    h: numH,
    a: numA,
    h0,
    Rb: +Rb.toFixed(2),
    Rs,
    xiR: +xiR.toFixed(4),
    alphaR: +alphaR.toFixed(4),
    alphaM: +alphaM.toFixed(4),
    xi: +xi.toFixed(4),
    x: +x.toFixed(1),
    Mult: +Mult.toFixed(2),
    isOverReinforced,
    AsRequiredMm2: +AsRequired.toFixed(1),
    AsRequiredCm2: +(AsRequired / 100).toFixed(2),
    AsMinMm2: +AsMin.toFixed(1),
    AsDesignMm2: +AsDesign.toFixed(1),
    AsDesignCm2: +(AsDesign / 100).toFixed(2),
    muPercent: +muPercent.toFixed(2),
    muDesignPercent: +muDesignPercent.toFixed(2),
    muMin,
    muMax: +muMax.toFixed(2),
    statusMessage,
    rebarSuggestions: finalSuggestions,
    utilization: finalUtilization,
    steps,
    standardRef: 'TCVN 5574:2018 — Điều 8.1.2.2 & Điều 10.3.3',
  };
}

// ============================================================================
// MÔ-ĐUN 4: KIỂM TRA BU LÔNG CƯỜNG ĐỘ CAO (TCVN 5575:2024)
// ============================================================================
export const BOLT_DIAMETERS_TCVN5575 = {
  M16: { code: 'M16', d: 16, A: 201.06, Abn: 157 },
  M20: { code: 'M20', d: 20, A: 314.16, Abn: 245 },
  M22: { code: 'M22', d: 22, A: 380.13, Abn: 303 },
  M24: { code: 'M24', d: 24, A: 452.39, Abn: 353 },
  M27: { code: 'M27', d: 27, A: 572.56, Abn: 459 },
  M30: { code: 'M30', d: 30, A: 706.86, Abn: 561 },
};

export const BOLT_GRADES_TCVN5575 = {
  '8.8': { code: '8.8', fub: 800, fyb: 640, fvb: 320, ftb: 400, astmEquiv: 'ASTM F3125 Gr. A325' },
  '10.9': { code: '10.9', fub: 1000, fyb: 900, fvb: 400, ftb: 500, astmEquiv: 'ASTM F3125 Gr. A490' },
};

export const PLATE_STEELS_TCVN5575 = {
  S235_SS400: { code: 'S235_SS400', name: 'SS400 / S235 / CT38 (f_u = 380–400 MPa)', fu: 380, fcb: 475 },
  S275_Q275: { code: 'S275_Q275', name: 'S275 / Q275 (f_u = 430 MPa)', fu: 430, fcb: 525 },
  S355_Q345: { code: 'S355_Q345', name: 'Q345 / Q355 / S355 (f_u = 470 MPa)', fu: 470, fcb: 595 },
};

export function calculateBoltCapacityTCVN5575({
  boltCode = 'M20',
  grade = '8.8',
  nv = 1,
  sumTMin = 12,
  plateSteel = 'S235_SS400',
  gammaC = 1.0,
  gammaB = 0.90,
  shearForceV = 65,
}) {
  const errors = [];
  const numNv = Number(nv);
  const numT = Number(sumTMin);
  const numGammaC = Number(gammaC);
  const numGammaB = Number(gammaB);
  const numV = Number(shearForceV);

  if (!BOLT_DIAMETERS_TCVN5575[boltCode]) errors.push('Đường kính bu lông không hợp lệ.');
  if (!BOLT_GRADES_TCVN5575[grade]) errors.push('Cấp bền bu lông không hợp lệ.');
  if (!PLATE_STEELS_TCVN5575[plateSteel]) errors.push('Mác thép bản ghép không hợp lệ.');
  if (!Number.isInteger(numNv) || numNv < 1 || numNv > 4) {
    errors.push('Số mặt cắt tính toán n_v phải là 1, 2, 3 hoặc 4.');
  }
  if (!Number.isFinite(numT) || numT < 3 || numT > 120) {
    errors.push('Bề dày nhỏ nhất bản thép ép mặt (∑t)_min phải nằm trong khoảng [3, 120] mm.');
  }
  if (!Number.isFinite(numV) || numV < 0) {
    errors.push('Lực cắt tác dụng lên 1 bu lông V phải ≥ 0 kN.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const bolt = BOLT_DIAMETERS_TCVN5575[boltCode];
  const boltGrade = BOLT_GRADES_TCVN5575[grade];
  const plate = PLATE_STEELS_TCVN5575[plateSteel];

  const d = bolt.d;
  const A = (Math.PI * d * d) / 4;
  const fvb = boltGrade.fvb;
  const fcb = plate.fcb;

  // Khả năng chịu cắt của 1 bu lông (TCVN 5575:2024 — Công thức 187):
  // N_bs = n_v * (pi * d^2 / 4) * f_vb * gamma_c * gamma_b (đổi N sang kN chia 1000)
  const Nbs = (numNv * A * fvb * numGammaC * numGammaB) / 1000;

  // Khả năng chịu ép mặt của 1 bu lông (TCVN 5575:2024 — Công thức 188):
  // N_bp = d * (sum_t)_min * f_cb * gamma_c * gamma_b (đổi N sang kN chia 1000)
  const Nbp = (d * numT * fcb * numGammaC * numGammaB) / 1000;

  // Khả năng chịu kéo của 1 bu lông:
  // N_bt = A_bn * f_tb * gamma_c (kN)
  const Nbt = (bolt.Abn * boltGrade.ftb * numGammaC) / 1000;

  // Sức chịu lực thiết kế của 1 bu lông chịu cắt - ép mặt:
  const Nb = Math.min(Nbs, Nbp);
  const governingMode = Nbs <= Nbp ? 'Chịu cắt thân bu lông (N_bs)' : 'Chịu ép mặt bản thép (N_bp)';

  const eta = numV / Nb;
  const utilization = evaluateUtilization(eta);

  const steps = [
    `Bước 1 [Thông số bu lông — TCVN 5575:2024 Bảng B.8 & B.9]: Bu lông ${bolt.code} (d = ${d} mm, A = π×${d}²/4 = ${A.toFixed(2)} mm², A_bn = ${bolt.Abn} mm²), cấp bền ${boltGrade.code} có f_vb = ${fvb} MPa, f_tb = ${boltGrade.ftb} MPa. Bản ghép ${plate.name} có f_cb = ${fcb} MPa.`,
    `Bước 2 [Khả năng chịu cắt — Điều 14.2.9]: N_bs = n_v × (πd²/4) × f_vb × γ_c × γ_b = ${numNv} × ${A.toFixed(2)} × ${fvb} × ${numGammaC} × ${numGammaB} × 10⁻³ = ${Nbs.toFixed(2)} kN.`,
    `Bước 3 [Khả năng chịu ép mặt — Điều 14.2.9]: N_bp = d × (∑t)_min × f_cb × γ_c × γ_b = ${d} × ${numT} × ${fcb} × ${numGammaC} × ${numGammaB} × 10⁻³ = ${Nbp.toFixed(2)} kN.`,
    `Bước 4 [Sức chịu lực thiết kế 1 bu lông]: N_b = min(N_bs, N_bp) = min(${Nbs.toFixed(2)}, ${Nbp.toFixed(2)}) = ${Nb.toFixed(2)} kN (Chi phối bởi: ${governingMode}).`,
    `Bước 5 [Đánh giá η]: η = V / N_b = ${numV.toFixed(2)} / ${Nb.toFixed(2)} = ${eta.toFixed(3)} → ${utilization.icon} ${utilization.label}.`,
  ];

  return {
    valid: true,
    errors: [],
    d,
    A: +A.toFixed(2),
    Abn: bolt.Abn,
    fvb,
    fcb,
    Nbs: +Nbs.toFixed(2),
    Nbp: +Nbp.toFixed(2),
    Nbt: +Nbt.toFixed(2),
    Nb: +Nb.toFixed(2),
    governingMode,
    shearForceV: numV,
    utilization,
    steps,
    standardRef: 'TCVN 5575:2024 — Điều 14.2, Bảng B.8 & B.9',
  };
}

// ============================================================================
// MÔ-ĐUN 5: TÍNH SỨC CHỊU TẢI CỌC ĐƠN SƠ BỘ THEO SPT (TCVN 10304:2014)
// ============================================================================
export function calculatePileCapacityTCVN10304({
  pileMethod = 'driven_square', // 'driven_square' | 'driven_circle' | 'bored_circle'
  D = 400, // mm
  Np = 35,
  gammaK = 1.75,
  designLoadP = 850, // kN
  layers = [
    { id: 1, name: 'Lớp 1 — Sét dẻo mềm', soilType: 'clay', length: 6.0, Ns: 8 },
    { id: 2, name: 'Lớp 2 — Cát pha chặt vừa', soilType: 'sand', length: 8.0, Ns: 18 },
    { id: 3, name: 'Lớp 3 — Cát hạt trung chặt', soilType: 'sand', length: 5.0, Ns: 30 },
  ],
  sandFrictionFormula = 'aij_10_3', // 'aij_10_3' (10/3 Ns kPa) | 'audit_1_3' (Ns/3 kPa)
}) {
  const errors = [];
  const numD = Number(D);
  const numNp = Number(Np);
  const numGammaK = Number(gammaK);
  const numP = Number(designLoadP);

  if (!Number.isFinite(numD) || numD < 200 || numD > 2500) {
    errors.push('Đường kính / cạnh cọc D phải nằm trong khoảng [200, 2500] mm.');
  }
  if (!Number.isFinite(numNp) || numNp <= 0 || numNp > 100) {
    errors.push('Chỉ số SPT tại mũi cọc N_p phải nằm trong khoảng (0 < N_p ≤ 100).');
  }
  if (!Number.isFinite(numGammaK) || numGammaK < 1.0 || numGammaK > 3.0) {
    errors.push('Hệ số an toàn đất nền γ_k phải nằm trong khoảng [1.0, 3.0].');
  }
  if (!Array.isArray(layers) || layers.length === 0) {
    errors.push('Phải có ít nhất 1 lớp đất dọc thân cọc.');
  } else {
    layers.forEach((l, idx) => {
      if (!Number.isFinite(Number(l.length)) || Number(l.length) <= 0) {
        errors.push(`Chiều dày lớp đất ${idx + 1} phải lớn hơn 0 m.`);
      }
      if (!Number.isFinite(Number(l.Ns)) || Number(l.Ns) < 0 || Number(l.Ns) > 100) {
        errors.push(`Chỉ số SPT N_s của lớp đất ${idx + 1} phải nằm trong khoảng [0, 100].`);
      }
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const dMeter = numD / 1000;
  const isSquare = pileMethod === 'driven_square';
  const isBored = pileMethod === 'bored_circle';

  const Ap = isSquare ? dMeter * dMeter : (Math.PI * dMeter * dMeter) / 4;
  const u = isSquare ? 4 * dMeter : Math.PI * dMeter;

  // Sức kháng mũi đơn vị q_b (kPa):
  // Cọc đóng/ép: q_b = 300 * N_p (kPa) [TCVN 10304:2014 Phụ lục G & Hồ sơ Kiểm toán Mục 2.4]
  // Cọc khoan nhồi: q_b = 150 * N_p (kPa) [TCVN 10304:2014 Phụ lục G]
  const qbFactor = isBored ? 150 : 300;
  const qb = qbFactor * numNp;
  const Qb = qb * Ap;

  // Tính ma sát thành bên từng lớp đất:
  let sumFsLi = 0;
  let totalLength = 0;
  const layerDetails = layers.map((l, idx) => {
    const li = Number(l.length);
    const nsi = Number(l.Ns);
    totalLength += li;
    let fsi;
    if (l.soilType === 'clay') {
      // Đất dính: f_s = 2 * N_s (kPa)
      fsi = 2.0 * nsi;
    } else {
      // Đất rời:
      fsi = sandFrictionFormula === 'audit_1_3' ? nsi / 3 : (10 / 3) * nsi;
    }
    const qsi = u * fsi * li;
    sumFsLi += fsi * li;
    return {
      index: idx + 1,
      name: l.name || `Lớp ${idx + 1}`,
      soilType: l.soilType,
      soilLabel: l.soilType === 'clay' ? 'Đất dính (Sét/Á sét)' : 'Đất rời (Cát)',
      length: li,
      Ns: nsi,
      fsi: +fsi.toFixed(2),
      Qsi: +qsi.toFixed(2),
    };
  });

  const Qs = u * sumFsLi;
  const Rcu = Qb + Qs;
  const Rc = Rcu / numGammaK;

  const eta = numP / Rc;
  const utilization = evaluateUtilization(eta);

  const steps = [
    `Bước 1 [Đặc trưng hình học cọc]: Tiết diện ${isSquare ? 'vuông' : 'tròn'} D = ${numD} mm (${dMeter.toFixed(3)} m) → Diện tích mũi A_p = ${Ap.toFixed(4)} m², Chu vi thân cọc u = ${u.toFixed(3)} m, Tổng chiều dài ngàm đất L = ${totalLength.toFixed(1)} m.`,
    `Bước 2 [TCVN 10304:2014 — Phụ lục G]: Sức kháng mũi đơn vị (${isBored ? 'Cọc khoan nhồi: q_b = 150×N_p' : 'Cọc đóng/ép: q_b = 300×N_p'}): q_b = ${qbFactor} × ${numNp} = ${qb.toFixed(1)} kPa → Tổng sức kháng mũi Q_b = q_b × A_p = ${qb.toFixed(1)} × ${Ap.toFixed(4)} = ${Qb.toFixed(2)} kN.`,
    `Bước 3 [Sức kháng ma sát thành bên Q_s]: Q_s = u × ∑(f_s,i × l_i) = ${u.toFixed(3)} × ${sumFsLi.toFixed(2)} = ${Qs.toFixed(2)} kN.`,
    `Bước 4 [Sức chịu tải cực hạn & tính toán — Điều 7.1.11]: R_c,u = Q_b + Q_s = ${Qb.toFixed(2)} + ${Qs.toFixed(2)} = ${Rcu.toFixed(2)} kN → Sức chịu tải tính toán R_c = R_c,u / γ_k = ${Rcu.toFixed(2)} / ${numGammaK.toFixed(2)} = ${Rc.toFixed(2)} kN.`,
    `Bước 5 [Đánh giá η]: η = P_d / R_c = ${numP.toFixed(1)} / ${Rc.toFixed(2)} = ${eta.toFixed(3)} → ${utilization.icon} ${utilization.label}.`,
  ];

  const warnings = [];
  if (numNp > 50) {
    warnings.push(`Chỉ số SPT tại mũi cọc N_p = ${numNp} vượt ngưỡng thực nghiệm tin cậy (N_p ≤ 50–60). Khuyến nghị khống chế N_p ≤ 50 theo khuyến cáo của Meyerhof & TCVN 10304 để tránh đánh giá quá cao sức kháng mũi.`);
  }

  return {
    valid: true,
    errors: [],
    warnings,
    D: numD,
    totalLength: +totalLength.toFixed(2),
    Ap: +Ap.toFixed(4),
    u: +u.toFixed(3),
    qb: +qb.toFixed(1),
    Qb: +Qb.toFixed(2),
    Qs: +Qs.toFixed(2),
    Rcu: +Rcu.toFixed(2),
    Rc: +Rc.toFixed(2),
    gammaK: numGammaK,
    designLoadP: numP,
    layerDetails,
    utilization,
    steps,
    standardRef: 'TCVN 10304:2014 — Điều 7.1.11 & Phụ lục G (Phương pháp SPT)',
  };
}




// ============================================================================
// MÔ-ĐUN 6: TÍNH CHIỀU DÀI NEO & NỐI CHỒNG CỐT THÉP THEO TCVN 5574:2018
// Căn cứ pháp lý: Mục 10.3.5 (Neo cốt thép) & Mục 10.3.6 (Nối chồng)
// ============================================================================

export function calculateAnchorageLapTCVN5574({
  rebarGrade,
  rebar,
  concrete = 'B25',
  d = 20, // mm
  stressState = 'tension', // 'tension' | 'compression'
  anchorageType = 'straight', // 'straight' | 'hook_bend'
  asReq = 942, // mm²
  asProv = 942, // mm²
  asRatio,
  lapRatio,
  actualLength,
  providedLength,
  ...restOptions
}) {
  const chosenGrade = rebarGrade || rebar || 'CB400V';
  const numActual = Number(providedLength || actualLength || 800);
  const effectiveLapRatio = lapRatio !== undefined ? Number(lapRatio) : 25;
  const errors = [];
  const numD = Number(d);
  const numReq = Number(asReq);
  const numProv = Number(asProv);

  if (!CONCRETE_GRADES_TCVN5574[concrete]) errors.push('Cấp độ bền bê tông không hợp lệ.');
  if (!REBAR_GRADES_TCVN5574[chosenGrade]) errors.push('Nhóm cốt thép không hợp lệ.');
  if (!Number.isFinite(numD) || numD < 6 || numD > 40) {
    errors.push('Đường kính cốt thép d phải nằm trong khoảng [6, 40] mm.');
  }
  if (!Number.isFinite(numReq) || numReq <= 0) {
    errors.push('Diện tích cốt thép yêu cầu A_s,req phải > 0.');
  }
  if (!Number.isFinite(numProv) || numProv < numReq) {
    errors.push('Diện tích cốt thép thực tế A_s,prov phải ≥ A_s,req.');
  }
  if (!Number.isFinite(numActual) || numActual <= 0) {
    errors.push('Chiều dài neo bố trí thực tế phải > 0 mm.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const conc = CONCRETE_GRADES_TCVN5574[concrete];
  const steel = REBAR_GRADES_TCVN5574[chosenGrade];

  const Rbt = conc.Rbt; // MPa
  const isCompression = stressState === 'compression';
  const RsDesign = isCompression ? steel.Rsc : steel.Rs; // MPa

  // 1. Hệ số bám dính eta_1 & eta_2 (Điều 10.3.5.2):
  // eta_1: 2.5 cho thép có gân (CB300V, CB400V, CB500V); 1.5 cho thép trơn CB240T
  const isDeformed = steel.type === 'deformed' || chosenGrade.endsWith('V') || chosenGrade !== 'CB240T';
  const eta1 = isDeformed ? 2.5 : 1.5;
  // eta_2 theo Điều 10.3.5.2 TCVN 5574:2018:
  // d <= 32 mm -> eta_2 = 1.0; d > 32 mm -> eta_2 = (132 - d) / 100
  const eta2 = numD <= 32 ? 1.0 : +((132 - numD) / 100).toFixed(2);

  // Cường độ bám dính tính toán R_bond (CT 256):
  const Rbond = eta1 * eta2 * Rbt;

  // 2. Chiều dài neo cơ sở L_0,an (CT 255):
  // L_0,an = (Rs * d) / (4 * R_bond)
  const exactL0an = (RsDesign * numD) / (4 * Rbond);
  const L0an = Math.ceil(exactL0an);

  // 3. Hệ số neo alpha_an (Điều 10.3.5.3):
  // Kéo: thẳng alpha_an = 1.0; uốn móc/gập neo: alpha_an = 0.7
  // Nén: alpha_an = 0.75
  let alphaAn;
  if (isCompression) {
    alphaAn = 0.75;
  } else {
    alphaAn = anchorageType === 'hook_bend' ? 0.70 : 1.0;
  }

  // Tỷ số diện tích cốt thép As_req / As_prov (không được lấy < 0.70 theo TCVN)
  const calcAreaRatio = asRatio !== undefined ? Number(asRatio) : (numReq / (numProv || numReq));
  const areaRatio = Math.max(0.70, calcAreaRatio);

  // Chiều dài neo tính toán L_an (CT 257 & CT 258):
  const rawLan = Math.ceil(alphaAn * exactL0an * areaRatio);
  const minLan = Math.max(0.3 * exactL0an, 15 * numD, 200);
  const Lan = Math.max(rawLan, Math.ceil(minLan));

  // 4. Chiều dài nối chồng L_lap (Điều 10.3.6, CT 259):
  // alpha_lap phụ thuộc tỷ số cốt thép nối chồng trên 1 mặt cắt:
  // <= 25%: 1.2; 50%: 1.5; 100%: 2.0
  let alphaLap = 1.2;
  if (effectiveLapRatio > 25 && effectiveLapRatio <= 50) alphaLap = 1.5;
  else if (effectiveLapRatio > 50) alphaLap = 2.0;

  const rawLlap = Math.ceil(alphaLap * exactL0an * areaRatio);
  const minLlap = Math.max(0.4 * alphaLap * exactL0an, 20 * numD, 250);
  const Llap = Math.max(rawLlap, Math.ceil(minLlap));

  // 5. Đánh giá chỉ số sử dụng η = Lan / actualLength
  const eta = Lan / numActual;
  const utilization = evaluateUtilization(eta);

  // Gợi ý Value Engineering & An toàn từ Policy Engine:
  let veAdvice = null;
  if (eta <= 0.70) {
    const excessMm = Math.round(numActual - Lan);
    veAdvice = {
      type: 'VE_OPTIMIZE',
      title: '💡 Gợi ý Tối ưu Value Engineering (Cost_Estimator)',
      message: `Chiều dài neo đang bố trí dư ${excessMm} mm (${((1 - eta) * 100).toFixed(0)}% dư thừa). Có thể rút ngắn chiều dài neo về mức ${Math.ceil(Lan / 10) * 10} mm để tiết kiệm chiều dài thanh thép, giảm mật độ thép tại nút khung và giảm va chạm cốt thép khi đổ bê tông.`,
    };
  } else if (eta > 1.00) {
    const deficitMm = Math.round(Lan - numActual);
    veAdvice = {
      type: 'SAFETY_WARNING',
      title: '⚠️ Cảnh báo An toàn & Giải pháp Khắc phục (Policy Engine)',
      message: `Chiều dài neo thiếu ${deficitMm} mm! Nguy cơ tuột neo trước khi cốt thép đạt giới hạn chảy dẻo. Khuyến nghị: (1) Tăng chiều dài neo lên tối thiểu ${Math.ceil(Lan / 10) * 10} mm; hoặc (2) Bổ sung móc neo uốn 90°/135° để giảm hệ số alpha_an xuống 0.70; hoặc (3) Tăng cấp bền bê tông từ ${concrete} lên cấp cao hơn.`,
    };
  }

  const steps = [
    `Bước 1 [TCVN 5574:2018 — Điều 10.3.5.2]: Cường độ bám dính R_bond = η₁ · η₂ · R_bt = ${eta1} × ${eta2} × ${Rbt.toFixed(2)} = ${Rbond.toFixed(3)} MPa.`,
    `Bước 2 [Công thức 255]: Chiều dài neo cơ sở L₀,an = (R_s · d) / (4 · R_bond) = (${RsDesign} × ${numD}) / (4 × ${Rbond.toFixed(3)}) = ${L0an.toFixed(1)} mm (${(L0an / numD).toFixed(1)}d).`,
    `Bước 3 [Công thức 257 & 258]: Chiều dài neo yêu cầu L_an = max[α_an · L₀,an · (A_req/A_prov), L_an,min] = max[${alphaAn} × ${L0an.toFixed(1)} × ${areaRatio.toFixed(2)}, max(${ (0.3 * L0an).toFixed(0) }, ${15 * numD}, 200)] = ${Lan.toFixed(0)} mm (${(Lan / numD).toFixed(1)}d).`,
    `Bước 4 [Công thức 259]: Chiều dài nối chồng cốt thép L_lap (với ${lapRatio}% mối nối tại 1 mặt cắt, α_lap = ${alphaLap}): L_lap = max[α_lap · L₀,an · (A_req/A_prov), L_lap,min] = ${Llap.toFixed(0)} mm (${(Llap / numD).toFixed(1)}d).`,
    `Bước 5 [Đánh giá chỉ số sử dụng η]: η = L_an / L_thực tế = ${Lan.toFixed(0)} / ${numActual} = ${eta.toFixed(3)} (${utilization.icon} ${utilization.label}).`,
  ];

  const warnings = [];
  if (numD > 32) {
    warnings.push(`Cốt thép đường kính lớn d = ${numD} mm (d > 32 mm, η₂ = ${(132 - numD) / 100} < 1.0): Theo TCVN 5574:2018, khuyến nghị ưu tiên sử dụng ống nối ren cơ khí (Coupler) hoặc nối hàn thay vì nối chồng buộc thông thường để đảm bảo liên kết và tránh nghẽn bê tông.`);
  }

  return {
    valid: true,
    standardRef: 'TCVN 5574:2018 — Mục 10.3.5 & Mục 10.3.6',
    options: restOptions,
    warnings,
    d: numD,
    concrete,
    rebarGrade: chosenGrade,
    Rbt,
    RsDesign,
    eta1,
    eta2,
    Rbond: +Rbond.toFixed(3),
    L0an: +L0an.toFixed(1),
    L0anD: +(L0an / numD).toFixed(1),
    alphaAn,
    areaRatio: +areaRatio.toFixed(3),
    Lan: Math.ceil(Lan),
    LanD: +(Lan / numD).toFixed(1),
    alphaLap,
    Llap: Math.ceil(Llap),
    LlapD: +(Llap / numD).toFixed(1),
    actualLength: numActual,
    utilization,
    veAdvice,
    steps,
  };
}

// ============================================================================
// HỆ THỐNG XUẤT HANDOFF JSON CHUẨN SKILL_BRIDGE (ĐỒNG BỘ AI AGENTS)
// ============================================================================

function sanitizePayloadValue(val) {
  if (val === undefined || Number.isNaN(val)) return null;
  if (val === Infinity || val === -Infinity) return 999999;
  if (typeof val === 'object' && val !== null) {
    if (Array.isArray(val)) return val.map(sanitizePayloadValue);
    const clean = {};
    for (const [k, v] of Object.entries(val)) {
      clean[k] = sanitizePayloadValue(v);
    }
    return clean;
  }
  return val;
}

export function buildSkillBridgePayload(param) {
  if (!param) return null;

  let moduleId = 'generic_calc';
  let moduleName = 'Mô-đun Tính toán Kết cấu';
  let standard = param.standardRef || param.standard || 'TCVN';
  let inputs = {};
  let outputs = {};
  const utilization = param.utilization || { eta: 0, level: 'SAFE', passed: true };
  const steps = param.steps || [];

  if (param.moduleName && param.steps) {
    moduleName = param.moduleName;
    standard = param.standard || standard;
    inputs = param.inputs || {};
    outputs = param.outputs || {};
    if (moduleName.includes('Gió')) moduleId = 'wind_tcvn2737';
    else if (moduleName.includes('hoạt tải')) moduleId = 'liveload_tcvn2737';
    else if (moduleName.includes('dầm')) moduleId = 'beam_tcvn5574';
    else if (moduleName.includes('Bu lông')) moduleId = 'bolt_tcvn5575';
    else if (moduleName.includes('cọc')) moduleId = 'pile_tcvn10304';
    else if (moduleName.includes('neo') || moduleName.includes('nối')) moduleId = 'anchorage_tcvn5574';
  } else if (param.kz !== undefined) {
    moduleId = 'wind_tcvn2737';
    moduleName = 'Gió TCVN 2737:2023';
    standard = 'TCVN 2737:2023';
    inputs = { W0: param.W0, z: param.zEff, c: param.c, gf: param.gf, gammaF: param.gammaF, allowableWd: param.allowableWd };
    outputs = { kz: param.kz, Wk: param.Wk, Wd: param.Wd };
  } else if (param.alphaA !== undefined) {
    moduleId = 'liveload_tcvn2737';
    moduleName = 'Chiết giảm hoạt tải TCVN 2737:2023';
    standard = 'TCVN 2737:2023';
    inputs = { category: param.categoryName, pk: param.pk };
    outputs = { alphaA: param.alphaA, alphaN: param.alphaN, pdReducedArea: param.pdReducedArea, pdReducedColumn: param.pdReducedColumn };
  } else if (param.AsDesignMm2 !== undefined || param.xiR !== undefined) {
    moduleId = 'beam_tcvn5574';
    moduleName = 'Cốt thép dầm BTCT TCVN 5574:2018';
    standard = 'TCVN 5574:2018';
    inputs = { b: param.b, h: param.h, a: param.a };
    outputs = { xi: param.xi, xiR: param.xiR, AsDesignCm2: param.AsDesignCm2, muDesignPercent: param.muDesignPercent };
  } else if (param.Nbs !== undefined) {
    moduleId = 'bolt_tcvn5575';
    moduleName = 'Bu lông CĐC TCVN 5575:2024';
    standard = 'TCVN 5575:2024';
    outputs = { Nbs: param.Nbs, Nbp: param.Nbp, Nb: param.Nb };
  } else if (param.Rc !== undefined) {
    moduleId = 'pile_tcvn10304';
    moduleName = 'Sức chịu tải cọc đơn TCVN 10304:2014';
    standard = 'TCVN 10304:2014';
    outputs = { Qb: param.Qb, Qs: param.Qs, Rc: param.Rc };
  } else if (param.L0an !== undefined) {
    moduleId = 'anchorage_tcvn5574';
    moduleName = 'Neo & nối cốt thép TCVN 5574:2018';
    standard = 'TCVN 5574:2018';
    outputs = { Rbond: param.Rbond, L0an: param.L0an, Lan: param.Lan, Llap: param.Llap };
  }

  const timestamp = new Date().toISOString();
  return {
    schema_id: 'SKILL_BRIDGE_SCHEMA_v2.1',
    schema_version: '2.1.0',
    generated_at: timestamp,
    module_id: moduleId,
    module_name: moduleName,
    standard_reference: standard,
    standard_method: standard,
    status: utilization.passed ? 'PASS' : 'FAIL',
    utilization_ratio_eta: utilization.eta,
    confidence_level: 'HIGH',
    policy_evaluation: {
      eta: utilization.eta,
      status_code: utilization.level || (utilization.passed ? 'SAFE' : 'FAIL'),
      hold_point: !utilization.passed,
      advice: utilization.policyAdvice || 'Đạt tiêu chuẩn kỹ thuật.',
    },
    calculation_module: {
      id: moduleId,
      name: moduleName,
      standard: standard,
      confidence_level: 'HIGH',
      status: utilization.passed ? 'PASS' : 'FAIL',
    },
    inputs: sanitizePayloadValue(inputs),
    outputs: sanitizePayloadValue(outputs),
    calculation_logs: steps.map((s, idx) => ({
      step_number: idx + 1,
      description: s,
    })),
    approval_metadata: {
      proposed_by: 'STRUCTURE-HUB Interactive Calculator',
      review_required: true,
      note: 'Dữ liệu được chuẩn hóa theo định dạng SKILL_BRIDGE v2.1.0 để chuyển giao cho AI Agent (SKILL_PHULUC / Design_Evaluation) lập Thuyết minh tính toán .docx.',
    },
  };
}

export const exportHandoffJSON = buildSkillBridgePayload;
export const calculateRebarAnchorageTCVN5574 = calculateAnchorageLapTCVN5574;
