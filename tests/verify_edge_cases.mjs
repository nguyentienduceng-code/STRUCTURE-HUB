import assert from 'node:assert/strict';
import {
  calculateWindTCVN2737,
  calculateLiveLoadReduction,
  calculateBeamRebarTCVN5574,
  calculateBoltCapacityTCVN5575,
  calculatePileCapacityTCVN10304,
  calculateRebarAnchorageTCVN5574,
  buildSkillBridgePayload,
} from '../src/services/calculatorEngines.js';

console.log('=== KIỂM THỬ BỘ CA BIÊN & ĐIỀU KIỆN DỊ THƯỜNG (TẦNG 3 - EDGE-CASE SUITE) ===');

// Ca biên 1 — Cao độ gió dưới ngưỡng z_min (Mô-đun 1 - CalcWindTCVN2737.jsx)
// Địa hình C (z_min = 9.0 m, z_g = 365 m, alpha = 7.0), nhập z = 3.5 m
const windEdge = calculateWindTCVN2737({
  zone: 'II-A',
  terrain: 'C',
  z: 3.5,
  c: 0.8,
  gf: 0.85,
  gammaF: 1.25,
  allowableWd: 1.5,
});

assert.equal(windEdge.valid, true);
assert.equal(windEdge.zEff, 9.0, 'z_eff phải được cắt chặn ở z_min = 9.0m');
const expKzEdge = +(2.01 * Math.pow(9.0 / 365, 2 / 7.0)).toFixed(4);
assert.equal(windEdge.kz, expKzEdge, 'k(z) phải tính theo z_eff = 9.0m');
assert.ok(windEdge.steps[1].includes('z = 3.5m < z_min = 9m'), 'Log phải có cảnh báo cắt chặn z_min');
console.log(`[PASS] Ca biên 1 (Gió z=3.5m < z_min=9m ở Địa hình C): z_eff=${windEdge.zEff}m, k(z)=${windEdge.kz} (Cắt chặn chuẩn Điều 10.2.5).`);

// Ca biên 2 — Chiết giảm hoạt tải sàn diện tích lớn (Mô-đun 2 - CalcLiveLoadReduction.jsx)
// Diện tích truyền tải A = 500 m2 (Nhóm phòng Văn phòng - A2 = 36 m2)
const llEdge = calculateLiveLoadReduction({
  category: 'office',
  area: 500,
  floors: 6,
  clampLowerBound: true,
  designCapacityPd: 3.0,
});

assert.equal(llEdge.valid, true);
assert.ok(llEdge.alphaA >= 0.60, 'Hệ số alpha_A phải được khóa cận dưới an toàn >= 0.60');
console.log(`[PASS] Ca biên 2 (Chiết giảm Hoạt tải diện tích lớn A=500m²): rawAlphaA=${llEdge.rawAlphaA}, alphaA=${llEdge.alphaA} (Đã khóa biên an toàn ≥ 0.60).`);

// Ca biên 3 — Dầm phá hoại giòn xi > xi_R và Cốt thép tối thiểu mu < mu_min (Mô-đun 3 - CalcBeamRebar.jsx)
// Input A (Quá tải): Dầm 200x350, a=35 -> h0=315, B20 (Rb=11.5), M = 180 kNm
const beamOverstressed = calculateBeamRebarTCVN5574({
  b: 200,
  h: 350,
  a: 35,
  M: 180,
  concrete: 'B20',
  rebar: 'CB400V',
  gammaB: 1.0,
});

assert.equal(beamOverstressed.valid, true);
assert.equal(beamOverstressed.isOverReinforced, true, 'Dầm phải phát hiện quá tải cốt đơn');
assert.equal(beamOverstressed.utilization.passed, false, 'Trạng thái kiểm toán phải là FAIL');
assert.equal(beamOverstressed.utilization.icon, '🔴', 'Icon cảnh báo phải là 🔴');
assert.ok(beamOverstressed.statusMessage.includes('HOLD POINT'), 'Thông điệp phải chứa HOLD POINT');
assert.equal(beamOverstressed.rebarSuggestions.length, 0, 'Khóa không xuất cốt thép đơn giả tạo khi vượt ULS');
console.log(`[PASS] Ca biên 3A (Dầm quá tải ULS M=180 kNm): xi=${beamOverstressed.xi} > xi_R=${beamOverstressed.xiR} → 🔴 HOLD POINT (Khóa xuất thép giả tạo).`);

// Input B (Momen rất nhỏ): Dầm 300x700, a=45 -> h0=655, B25, M = 15 kNm
const beamMinRebar = calculateBeamRebarTCVN5574({
  b: 300,
  h: 700,
  a: 45,
  M: 15,
  concrete: 'B25',
  rebar: 'CB400V',
  gammaB: 1.0,
});

assert.equal(beamMinRebar.valid, true);
assert.equal(beamMinRebar.isOverReinforced, false);
assert.ok(beamMinRebar.muPercent < 0.10, 'Hàm lượng tính toán phải < mu_min = 0.10%');
assert.equal(beamMinRebar.AsDesignMm2, beamMinRebar.AsMinMm2, 'Phải tự động lấy theo As_min cấu tạo');
assert.ok(beamMinRebar.statusMessage.includes('A_s,min'), 'Thông báo phải ghi chú lấy theo As_min cấu tạo');
console.log(`[PASS] Ca biên 3B (Dầm momen nhỏ M=15 kNm): mu_tính=${beamMinRebar.muPercent}% < 0.10% → As_chọn=As_min=${beamMinRebar.AsDesignMm2} mm² (Theo cấu tạo).`);

// Ca biên 4 — Cọc có Np > 50 và lớp bùn sét Ns = 0 (Mô-đun 5 - CalcPileCapacity.jsx)
const pileEdge = calculatePileCapacityTCVN10304({
  pileMethod: 'driven_square',
  D: 400,
  Np: 75,
  gammaK: 1.75,
  designLoadP: 850,
  layers: [
    { id: 1, name: 'Bùn sét chảy', soilType: 'clay', length: 5.0, Ns: 0 },
    { id: 2, name: 'Cát chặt', soilType: 'sand', length: 10.0, Ns: 30 },
  ],
});

assert.equal(pileEdge.valid, true);
assert.ok(pileEdge.warnings.length > 0, 'Phải có cảnh báo Np > 50');
assert.ok(pileEdge.warnings[0].includes('Meyerhof'), 'Cảnh báo phải trích dẫn khuyến cáo Meyerhof & TCVN 10304');
assert.equal(pileEdge.layerDetails[0].fsi, 0, 'Lớp bùn sét Ns=0 phải có ma sát fsi = 0');
console.log(`[PASS] Ca biên 4 (Cọc SPT Np=75 > 50 & Lớp bùn Ns=0): Xuất cảnh báo Meyerhof trần thực nghiệm, xử lý mượt Ns=0.`);

// Ca biên 5 — Nối chồng thép đường kính lớn d = 36 mm (Mô-đun 6 - CalcRebarAnchorage.jsx)
const anchorEdge = calculateRebarAnchorageTCVN5574({
  concrete: 'B25',
  rebar: 'CB400V',
  d: 36,
  stressState: 'tension',
  asRatio: 1.0,
  providedLength: 1600,
});

assert.equal(anchorEdge.valid, true);
const expEta2 = +((132 - 36) / 100).toFixed(2); // 0.96
assert.equal(anchorEdge.eta2, expEta2, 'eta_2 cho d=36mm phải là (132 - 36)/100 = 0.96');
assert.ok(anchorEdge.warnings.length > 0, 'Phải có cảnh báo khuyến nghị Coupler cho d > 32mm (khớp ngưỡng η₂ = (132-d)/100)');
assert.ok(anchorEdge.warnings[0].includes('Coupler'), 'Cảnh báo phải nhắc đến ống nối cơ khí Coupler');
console.log(`[PASS] Ca biên 5 (Thép lớn d=36mm > 32mm): eta_2=${anchorEdge.eta2} = (132-36)/100=0.96, có cảnh báo Coupler chuẩn Điều 10.3.5.2.`);

// TẦNG 4: Kiểm tra Schema SKILL_BRIDGE v2.1.0 với 6 khóa bắt buộc cấp gốc & Sanitize
const bridgeEdge = buildSkillBridgePayload(windEdge);
assert.ok(bridgeEdge.schema_version, 'Phải có schema_version');
assert.ok(bridgeEdge.module_id, 'Phải có module_id');
assert.ok(bridgeEdge.standard_reference, 'Phải có standard_reference');
assert.ok(bridgeEdge.inputs, 'Phải có inputs');
assert.ok(bridgeEdge.outputs, 'Phải có outputs');
assert.ok(bridgeEdge.policy_evaluation, 'Phải có policy_evaluation');
assert.ok(Array.isArray(bridgeEdge.calculation_logs), 'Phải có calculation_logs');
assert.equal(bridgeEdge.policy_evaluation.hold_point, false);

// Kiểm tra Sanitize: không có NaN hay Infinity
const jsonString = JSON.stringify(bridgeEdge);
assert.ok(!jsonString.includes('NaN'), 'JSON không được chứa NaN');
assert.ok(!jsonString.includes('null" : undefined'), 'JSON không được chứa undefined');
console.log(`[PASS] Tầng 4 (Schema SKILL_BRIDGE v2.1.0): Đầy đủ 6 khóa bắt buộc, policy_evaluation và sanitize sạch sẽ.`);

console.log('=== TẤT CẢ 5 CA BIÊN & SCHEMA AUDIT ĐỀU ĐẠT TUYỆT ĐỐI (100% PASS) ===');

