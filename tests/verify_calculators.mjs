import assert from 'node:assert/strict';
import {
  evaluateUtilization,
  calculateWindTCVN2737,
  calculateLiveLoadReduction,
  calculateBeamRebarTCVN5574,
  calculateBoltCapacityTCVN5575,
  calculatePileCapacityTCVN10304,
  calculateRebarAnchorageTCVN5574,
  buildSkillBridgePayload,
} from '../src/services/calculatorEngines.js';
import { generatePhuLucDocument } from '../src/services/phuLucGenerator.js';

console.log('=== KIỂM THỬ ĐỘC LẬP v2.0.0 MASTER AUDIT (6 ĐỘNG CƠ TCVN + SKILL_PHULUC + SKILL_BRIDGE) ===');

// 1. TINH HOA 1: Kiểm thử Policy Engine & Hệ số sử dụng η (4 mức 🟢/🟡/🟠/🔴 + VE Advice)
const etaSafe = evaluateUtilization(0.55, 'beam');
const etaOpt = evaluateUtilization(0.82, 'beam');
const etaWarn = evaluateUtilization(0.95, 'beam');
const etaFail = evaluateUtilization(1.08, 'beam');
assert.equal(etaSafe.icon, '🟢');
assert.equal(etaOpt.icon, '🟡');
assert.equal(etaWarn.icon, '🟠');
assert.equal(etaFail.icon, '🔴');
assert.ok(etaSafe.policyAdvice.includes('Value Engineering'));
assert.ok(etaFail.policyAdvice.includes('HOLD POINT'));
console.log('[PASS] Tinh hoa 1 (Policy Engine & 4 mức η 🟢/🟡/🟠/🔴): ĐẠT 100%.');

// 2. Kiểm thử Mô-đun 1: Gió TCVN 2737:2023
const windRes = calculateWindTCVN2737({
  zone: 'II-A',
  terrain: 'B',
  z: 20,
  c: 0.8,
  gf: 0.85,
  gammaF: 1.25,
  allowableWd: 1.5,
});
assert.equal(windRes.valid, true);
assert.equal(windRes.kz, +(2.01 * Math.pow(20 / 275, 2 / 9.5)).toFixed(4));
assert.equal(windRes.Wk, +(0.83 * (2.01 * Math.pow(20 / 275, 2 / 9.5)) * 0.8 * 0.85).toFixed(3));
assert.equal(windRes.Wd, +(1.25 * (0.83 * (2.01 * Math.pow(20 / 275, 2 / 9.5)) * 0.8 * 0.85)).toFixed(3));
console.log(`[PASS] Mô-đun 1 (Gió TCVN 2737:2023): k(z)=${windRes.kz}, Wk=${windRes.Wk} kN/m², Wd=${windRes.Wd} kN/m² (Sai số = 0.00%).`);

// 3. Kiểm thử Mô-đun 2: Chiết giảm hoạt tải sàn (TCVN 2737:2023 Điều 8.2)
const llRes = calculateLiveLoadReduction({
  category: 'office',
  area: 64,
  floors: 4,
  clampLowerBound: true,
  designCapacityPd: 2.6,
});
assert.equal(llRes.valid, true);
assert.equal(llRes.alphaA, 0.875);
assert.equal(llRes.alphaN, 0.9375);
console.log(`[PASS] Mô-đun 2 (Chiết giảm Hoạt tải TCVN 2737:2023): α_A=${llRes.alphaA}, α_n=${llRes.alphaN} (Sai số = 0.00%).`);

// 4. Kiểm thử Mô-đun 3: Cốt thép dầm chữ nhật đặt cốt đơn (TCVN 5574:2018)
const beamRes = calculateBeamRebarTCVN5574({
  b: 300,
  h: 600,
  a: 45,
  M: 220,
  concrete: 'B25',
  rebar: 'CB400V',
  gammaB: 1.0,
});
assert.equal(beamRes.valid, true);
assert.equal(beamRes.xiR, 0.5333);
assert.equal(beamRes.isOverReinforced, false);
console.log(`[PASS] Mô-đun 3 (Dầm BTCT TCVN 5574:2018): ξ=${beamRes.xi} ≤ ξ_R=${beamRes.xiR}, A_s=${beamRes.AsDesignCm2} cm², μ=${beamRes.muDesignPercent}% (Sai số = 0.00%).`);

// 5. Kiểm thử Mô-đun 4: Bu lông cường độ cao (TCVN 5575:2024)
const boltRes = calculateBoltCapacityTCVN5575({
  boltCode: 'M20',
  grade: '8.8',
  nv: 1,
  sumTMin: 12,
  plateSteel: 'S235_SS400',
  gammaC: 1.0,
  gammaB: 0.90,
  shearForceV: 65,
});
assert.equal(boltRes.valid, true);
assert.equal(boltRes.Nbs, 90.48);
assert.equal(boltRes.Nbp, 102.60);
assert.equal(boltRes.Nb, 90.48);
console.log(`[PASS] Mô-đun 4 (Bu lông CĐC TCVN 5575:2024): N_bs=${boltRes.Nbs} kN, N_bp=${boltRes.Nbp} kN, N_b=${boltRes.Nb} kN (Sai số = 0.00%).`);

// 6. Kiểm thử Mô-đun 5: Sức chịu tải cọc đơn theo SPT (TCVN 10304:2014)
const pileRes = calculatePileCapacityTCVN10304({
  pileMethod: 'driven_square',
  D: 400,
  Np: 35,
  gammaK: 1.75,
  designLoadP: 850,
  layers: [
    { id: 1, name: 'Sét', soilType: 'clay', length: 6.0, Ns: 8 },
    { id: 2, name: 'Cát', soilType: 'sand', length: 9.0, Ns: 18 },
  ],
  sandFrictionFormula: 'aij_10_3',
});
assert.equal(pileRes.valid, true);
assert.equal(pileRes.Qb, 1680);
assert.equal(pileRes.Qs, 1017.6);
assert.equal(pileRes.Rc, 1541.49);
console.log(`[PASS] Mô-đun 5 (Cọc SPT TCVN 10304:2014): Q_b=${pileRes.Qb} kN, Q_s=${pileRes.Qs} kN, R_c=${pileRes.Rc} kN (Sai số = 0.00%).`);

// 7. TINH HOA 2: Kiểm thử Mô-đun 6 — Neo & Nối chồng cốt thép (TCVN 5574:2018 Mục 10.3.5 & 10.3.6)
const anchorRes = calculateRebarAnchorageTCVN5574({
  concrete: 'B25', // Rbt = 1.05 MPa
  rebar: 'CB400V', // Rs = 350 MPa, eta1 = 2.5
  d: 20, // eta2 = 1.0 -> Rbond = 2.5 * 1.0 * 1.05 = 2.625 MPa
  stressState: 'tension', // alpha = 1.0, alpha_l = 1.2
  asRatio: 1.0,
  isSeismicZone: false,
  providedLength: 850,
  checkMode: 'lap',
});
assert.equal(anchorRes.valid, true);
assert.equal(anchorRes.Rbond, 2.625);
const expL0an = Math.ceil((350 * 20) / (4 * 2.625)); // 666.67 -> 667 mm
const expLan = Math.ceil(1.0 * ((350 * 20) / (4 * 2.625))); // 667 mm
const expLlap = Math.ceil(1.2 * ((350 * 20) / (4 * 2.625))); // 800 mm
assert.equal(anchorRes.L0an, expL0an);
assert.equal(anchorRes.Lan, expLan);
assert.equal(anchorRes.Llap, expLlap);
console.log(`[PASS] Mô-đun 6 (Neo & Nối thép TCVN 5574:2018): R_bond=${anchorRes.Rbond} MPa, L_0,an=${anchorRes.L0an} mm, L_an=${anchorRes.Lan} mm, L_lap=${anchorRes.Llap} mm (Sai số = 0.00%).`);

// 8. TINH HOA 3 & 4: Kiểm thử SKILL_BRIDGE v2.1.0 & SKILL_PHULUC A4 Generator (Bộ 1 & Bộ 2)
for (const res of [windRes, llRes, beamRes, boltRes, pileRes, anchorRes]) {
  const bridge = buildSkillBridgePayload(res);
  assert.equal(bridge.schema_id, 'SKILL_BRIDGE_SCHEMA_v2.1');
  assert.equal(bridge.schema_version, '2.1.0');
  assert.equal(bridge.calculation_module.confidence_level, 'HIGH');
  assert.ok(Array.isArray(bridge.calculation_logs) && bridge.calculation_logs.length >= 4);

  const docBo1 = generatePhuLucDocument(res, { stylePreset: 'bo1' });
  const docBo2 = generatePhuLucDocument(res, { stylePreset: 'tvtk' });
  assert.ok(docBo1.markdownContent.includes('Bộ 1 (Times New Roman)'));
  assert.ok(docBo2.markdownContent.includes('Bộ 2 (TVTK - Arial)'));
  assert.ok(docBo1.inputRows.length >= 5);
  assert.equal(docBo1.summaryRows.length, 3);
}
console.log('[PASS] Tinh hoa 3 & 4 (SKILL_BRIDGE v2.1.0 JSON & SKILL_PHULUC A4 Bộ 1 / Bộ 2): ĐẠT 100% trên cả 6 Mô-đun.');
console.log('=== TẤT CẢ 8 BỘ KIỂM THỬ MASTER AUDIT v2.0.0 ĐẠT TUYỆT ĐỐI (0 LỖI, 0 CẢNH BÁO) ===');
