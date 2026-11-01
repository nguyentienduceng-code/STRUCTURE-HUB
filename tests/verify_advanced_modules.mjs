import assert from 'node:assert/strict';
import {
  calculateRCBeamAdvanced,
  calculateLoadCombination,
  calculatePunchingShear,
  calculateDeadLoad,
  buildSkillBridgePayload,
} from '../src/services/calculatorEngines.js';

console.log('=== KIỂM THỬ 3 MÔ-ĐUN NÂNG CẤP (B1 CỐT KÉP & CẮT / A4 TỔ HỢP / B4 CHỌC THỦNG) ===');
// Nguyên tắc: giá trị kỳ vọng được TÍNH LẠI ĐỘC LẬP trong file này (định luật cân bằng + hằng số
// từ bảng TCVN), KHÔNG đọc lại từ engine -> tránh kiểm thử tautology (vòng tròn) như suite gốc.

// Hằng số TCVN 5574:2018 (Bảng 6 & 13) — nguồn độc lập để đối chiếu:
const Rb25 = 14.5, Rbt25 = 1.05, Rs400 = 350, Rsc400 = 350, Rsw240 = 170, Es = 200000;
const xiR400 = 0.8 / (1 + Rs400 / (0.0035 * Es)); // = 0.8/1.5 = 0.533333
const alphaR400 = xiR400 * (1 - 0.5 * xiR400);    // = 0.391111

// --- MÔ-ĐUN B1-A: Dầm CỐT ĐƠN (M=220 < M_R,min) ---
{
  const b = 300, h = 600, a = 40, aPrime = 40, M = 220, V = 80;
  const h0 = h - a;                                  // 560
  const alphaM = (M * 1e6) / (Rb25 * b * h0 * h0);   // 0.16127
  const xi = 1 - Math.sqrt(1 - 2 * alphaM);
  const x = xi * h0;
  const AsExpected = ((Rb25 * b * h0) / Rs400) * (1 - Math.sqrt(1 - 2 * alphaM));
  // Cắt: V_Rd = V_Rd,c + V_Rd,s
  const Asw = 2 * (Math.PI * 8 ** 2) / 4;            // 2 nhánh Ø8
  const qSw = (Rsw240 * Asw) / 150;
  const Vrdc = 0.75 * Rbt25 * b * h0 * 1e-3;
  const Vrds = 0.75 * qSw * (2 * h0) * 1e-3;
  const VRdExpected = Vrdc + Vrds;

  const r = calculateRCBeamAdvanced({ b, h, a, aPrime, M, V, concrete: 'B25', rebar: 'CB400V', stirrupRebar: 'CB240T', stirrupDia: 8, stirrupLegs: 2, stirrupSpacing: 150 });
  assert.equal(r.valid, true);
  assert.equal(r.isDoubleLayer, false, `α_m=${alphaM.toFixed(4)} ≤ α_R=${alphaR400.toFixed(4)} → cốt đơn`);
  assert.ok(Math.abs(r.AsRequiredMm2 - AsExpected) < 0.5, `A_s: engine=${r.AsRequiredMm2}, độc lập=${AsExpected.toFixed(1)}`);
  assert.ok(Math.abs(r.VRd - VRdExpected) < 0.1, `V_Rd: engine=${r.VRd}, độc lập=${VRdExpected.toFixed(1)}`);
  assert.equal(r.utilization.level, 'WARNING', 'η_uốn = M/M_Rd = 1.0 → WARNING (sát ngưỡng, vẫn ĐẠT)');
  assert.equal(r.utilization.passed, true);
  console.log(`[PASS] B1-A (Cốt đơn M=220): A_s=${r.AsRequiredMm2} mm², V_Rd=${r.VRd} kN, η=${r.utilization.eta} → ${r.utilization.icon}`);
}

// --- MÔ-ĐUN B1-B: Dầm CỐT KÉP (M=600 > M_R,min) ---
{
  const b = 300, h = 600, a = 40, aPrime = 40, M = 600, V = 120;
  const h0 = h - a, za = h - aPrime - a;            // h0=560, za=520
  const xR = xiR400 * h0;                            // 298.667
  const MBt = (Rb25 * b * xR * (h0 - xR / 2)) / 1e6; // mô men bê tông gánh
  const AsPrimeExpected = Math.max(0, ((M - MBt) * 1e6) / (Rsc400 * za));
  const AsExpected = Math.max(0, (Rb25 * b * xR + Rsc400 * AsPrimeExpected) / Rs400);

  const r = calculateRCBeamAdvanced({ b, h, a, aPrime, M, V, concrete: 'B25', rebar: 'CB400V', stirrupRebar: 'CB240T', stirrupDia: 8, stirrupLegs: 2, stirrupSpacing: 150 });
  assert.equal(r.valid, true);
  assert.equal(r.isDoubleLayer, true, `α_m=${(M*1e6/(Rb25*b*h0*h0)).toFixed(4)} > α_R → tự động CỐT KÉP`);
  assert.ok(Math.abs(r.AsPrimeRequiredMm2 - AsPrimeExpected) < 1.0, `A_s': engine=${r.AsPrimeRequiredMm2}, độc lập=${AsPrimeExpected.toFixed(1)}`);
  assert.ok(Math.abs(r.AsRequiredMm2 - AsExpected) < 1.0, `A_s: engine=${r.AsRequiredMm2}, độc lập=${AsExpected.toFixed(1)}`);
  assert.ok(r.warnings.some((w) => w.includes('CỐT KÉP')), 'Phải cảnh báo chuyển trạng thái cốt kép');
  console.log(`[PASS] B1-B (Cốt kép M=600): A_s=${r.AsRequiredMm2} mm², A_s'=${r.AsPrimeRequiredMm2} mm² (x=x_R=${r.x} mm), khớp định luật cân bằng.`);
}

// --- MÔ-ĐUN B1-C: Chưa nhập cốt đai → KHÔNG kết luận cắt (No-Hallucination) ---
{
  const r = calculateRCBeamAdvanced({ b: 300, h: 600, a: 40, aPrime: 40, M: 150, V: 160, concrete: 'B25', rebar: 'CB400V', stirrupRebar: 'CB240T' });
  assert.equal(r.valid, true);
  assert.equal(r.VRd, null, 'Thiếu thông số cốt đai → V_Rd = null (không bịa kết quả chịu cắt)');
  // V=160 kN > V_Rd,c=132.3 kN → cần cốt đai, q_sw yêu cầu phải > 0
  assert.ok(r.qSwReq !== null && r.qSwReq > 0, `V=160 > V_Rd,c=${r.VRdc} → q_sw yêu cầu = ${r.qSwReq} N/mm (>0)`);
  assert.ok(r.warnings.some((w) => w.toLowerCase().includes('chưa kết luận')), 'Phải ghi rõ CHƯA KẾT LUẬN khả năng chịu cắt');
  console.log(`[PASS] B1-C (Không nhập cốt đai, V=${r.VRdc}→160 kN): V_Rd=null, q_sw yêu cầu ≥ ${r.qSwReq} N/mm, η chỉ gồm uốn + dải nén (an toàn).`);
}

// --- MÔ-ĐUN A4: Tổ hợp ULS/SLS + Envelope (TCVN 2737:2023) — đối chiếu tính tay độc lập ---
{
  const G = 10, Q = 5, W = 2;
  const gG = 1.15, gQ = 1.3, gW = 1.25, pDom = 1.0, pAcc = 0.9, pLow = 0.7; // hệ số đã khóa Chapter 3
  const ulsG = gG * G + pLow * gQ * Q;              // 11.5 + 4.55 = 16.05
  const ulsQ = gG * G + gQ * Q + pAcc * gW * W;      // 11.5 + 6.5 + 2.25 = 20.25
  const ulsW = gG * G + gW * W + pAcc * gQ * Q;       // 11.5 + 2.5 + 5.85 = 19.85
  const sls = G + Q + 0.5 * W;                       // 10 + 5 + 1 = 16.0

  const r = calculateLoadCombination({ Gk: G, Qk: Q, Wk: W, capacity: 18, material: 'btct' });
  assert.equal(r.valid, true);
  assert.equal(r.combinations.length, 4);
  assert.equal(r.combinations[0].value, +ulsG.toFixed(2), 'ULS_G khớp tính tay');
  assert.equal(r.combinations[1].value, +ulsQ.toFixed(2), 'ULS_Q khớp tính tay');
  assert.equal(r.combinations[2].value, +ulsW.toFixed(2), 'ULS_W khớp tính tay');
  assert.equal(r.combinations[3].value, +sls.toFixed(2), 'SLS khớp tính tay');
  assert.equal(r.envelope.max, 20.25, 'Envelope = max(16.05, 20.25, 19.85, 16.0) = 20.25');
  assert.equal(r.envelope.governing, 'ULS_Q', 'Tổ hợp chi phối = ULS_Q');
  assert.equal(r.utilization.eta, +(20.25 / 18).toFixed(3), 'η = M_env / [M_d] = 20.25/18');
  assert.equal(r.utilization.passed, false, 'η = 1.125 > 1 → KHÔNG ĐẠT (vượt khả năng chịu tải)');
  console.log(`[PASS] A4-A (Tổ hợp ULS/SLS): 4 tổ hợp khớp tính tay, M_env=${r.envelope.max} (ULS_Q), η=${r.utilization.eta} → ${r.utilization.icon} KHÔNG ĐẠT.`);

  // A4-B: có động đất (tổ hợp đặc biệt) + capacity đủ
  const r2 = calculateLoadCombination({ Gk: G, Qk: Q, Wk: W, Ek: 8, capacity: 40, includeSeismic: true });
  const ulsE = gG * G + 8 + 0.5 * gQ * Q + 0.3 * gW * W; // 11.5+8+3.25+0.75 = 23.5
  const eCombo = r2.combinations.find((c) => c.id === 'ULS_E');
  assert.equal(r2.combinations.length, 5, 'Thêm ULS_E (đặc biệt)');
  assert.ok(eCombo, 'Tổ hợp ULS_E phải tồn tại');
  assert.equal(eCombo.value, +ulsE.toFixed(2), 'ULS_E khớp tính tay (ψ_L=0.5, ψ_t=0.3)');
  assert.equal(r2.envelope.governing, 'ULS_E', 'Envelope chi phối = ULS_E = 23.5');
  assert.equal(r2.envelope.max, +ulsE.toFixed(2));
  assert.equal(r2.utilization.eta, 0.5875, 'η = M_env/[M_d] = 23.5/40 = 0.5875 (engine giữ 4 số)');
  assert.equal(r2.utilization.level, 'SAFE', 'η = 0.5875 ≤ 0.70 → SAFE (dư, có thể VE)');
  console.log(`[PASS] A4-B (Tổ hợp đặc biệt E): ULS_E=${eCombo.value} kN (tính tay ${ulsE}), M_env=${r2.envelope.max}, η=${r2.utilization.eta} → ${r2.utilization.icon}.`);

  // A4-C: chưa nhập capacity → η = null (không kết luận khống)
  const r3 = calculateLoadCombination({ Gk: G, Qk: Q });
  assert.equal(r3.utilization.eta, null, 'Chưa nhập [M_d] → η = null (tuân thủ No-Hallucination)');
  assert.equal(r3.utilization.level, 'INFO');
  console.log(`[PASS] A4-C (Chưa nhập [M_d]): η=null, mã INFO — không bịa kết luận.`);
}

// --- MÔ-ĐUN B4: Chọc thủng sàn nấm (TCVN 5574:2018 Mục 8.1.6) ---
{
  const Rbt = 1.05, h = 200, a = 30, bc = 300, hc = 300, F = 600, Mbx = 30, Mby = 20;
  const d = h - a;                                   // 170
  const Lx = bc + d, Ly = hc + d;                   // 470, 470 (cột giữa)
  const uB = 2 * (Lx + Ly);                          // 1880
  const Ac = uB * d;
  const Fult = Rbt * Ac * 1e-3;                     // 335.58
  const WBx = Ly * (Ly / 3 + Lx);                    // 294533
  const WBy = Lx * (Lx / 3 + Ly);
  const MBxUlt = Rbt * WBx * d * 1e-6;               // 52.57
  const MByUlt = Rbt * WBy * d * 1e-6;
  const etaF = F / Fult;
  const etaMraw = Math.abs(Mbx) / MBxUlt + Math.abs(Mby) / MByUlt;
  const etaPunchExpected = etaF + Math.min(etaMraw, 0.5 * etaF); // cap 0.5η_F (Điều 8.1.6.1)

  const r = calculatePunchingShear({ h, a, columnB: bc, columnH: hc, columnPosition: 'interior', F, Mbx, Mby, concrete: 'B25' });
  assert.equal(r.valid, true);
  assert.equal(r.uB, uB, `u_b = ${uB} mm (cột giữa: 2(b_c+h_c+2h₀))`);
  assert.ok(Math.abs(r.Fult - Fult) < 0.1, `F_ult: engine=${r.Fult}, độc lập=${Fult.toFixed(2)}`);
  assert.ok(Math.abs(r.etaPunch - etaPunchExpected) < 0.001, `η_punch: engine=${r.etaPunch}, độc lập=${etaPunchExpected.toFixed(4)}`);
  assert.ok(r.warnings.some((w) => w.includes('mũ cột') || w.includes('cốt đai')), 'η>1 & chưa nhập đai → cảnh báo cốt đai/mũ cột');
  console.log(`[PASS] B4-A (Chọc thủng 2 phương): u_b=${r.uB} mm, F_ult=${r.Fult} kN, η=${r.etaPunch} (đã cap 0.5η_F).`);
}
{
  const Rbt = 1.05, h = 250, a = 35, bc = 300, hc = 300, F = 300;
  const d = h - a, Lx = bc + d, Ly = hc + d;
  const uB = 2 * (Lx + Ly), Fult = Rbt * (uB * d) * 1e-3;
  const r = calculatePunchingShear({ h, a, columnB: bc, columnH: hc, columnPosition: 'interior', F, concrete: 'B25' });
  assert.equal(r.valid, true);
  assert.ok(r.etaPunch <= 1.0, `η = ${r.etaPunch} ≤ 1 → ĐẠT (bê tông chịu được, F_ult=${Fult.toFixed(1)} kN)`);
  assert.equal(r.warnings.length, 0, 'Không cảnh báo khi η ≤ 1');
  console.log(`[PASS] B4-B (Chọc thủng ĐẠT): F_ult=${r.Fult} kN, η=${r.etaPunch} — không cần cốt đai/mũ.`);
}
{
  const Rbt = 1.05, h = 200, a = 30, bc = 300, hc = 300, F = 600;
  const d = h - a, uB = 2 * ((bc + d) + (hc + d)), Fult = Rbt * (uB * d) * 1e-3;
  const Rsw = 170, Asw = 4 * (Math.PI * 8 ** 2) / 4, qSw = (Rsw * Asw) / 75;
  const Fsw = 0.8 * qSw * d * 2.0 * 1e-3;
  const FUltSw = Math.min(Fult + Fsw, 2 * Fult);
  const etaF = F / Fult;
  const r = calculatePunchingShear({ h, a, columnB: bc, columnH: hc, columnPosition: 'interior', F, Mbx: 0, Mby: 0, concrete: 'B25', stirrupDia: 8, stirrupLegs: 4, stirrupSpacing: 75, stirrupRebar: 'CB240T' });
  assert.equal(r.hasStirrup, true);
  assert.ok(Math.abs(r.FStirrup - Fsw) < 0.1, `F_sw: engine=${r.FStirrup}, độc lập=${Fsw.toFixed(1)}`);
  assert.ok(Math.abs(r.FUltStirrup - FUltSw) < 0.1, `F_ult,sw: engine=${r.FUltStirrup}, độc lập=${FUltSw.toFixed(1)}`);
  assert.ok(r.etaPunchStirrup < r.etaPunch, 'Cốt đai phải GIẢM η so với không đai');
  console.log(`[PASS] B4-C (Chọc thủng có cốt đai): F_sw=${r.FStirrup} kN, F_ult,sw=${r.FUltStirrup} kN (≤2F_ult), η_đai=${r.etaPunchStirrup} < η=${r.etaPunch}.`);
}


// --- MÔ-ĐUN A1-A: TĨNH TẢI SÀN DÂN DỤNG 4 LỚP ---
{
  const layers = [
    { id: 1, name: 'Gạch ceramic', thickness: 10, density: 20, gammaF: 1.1 },
    { id: 2, name: 'Vữa lót M75', thickness: 30, density: 18, gammaF: 1.2 },
    { id: 3, name: 'Bản sàn BTCT', thickness: 120, density: 25, gammaF: 1.15 },
    { id: 4, name: 'Trần thạch cao', thickness: 0, density: 0, loadK: 0.35, gammaF: 1.2 },
  ];
  // Tính độc lập:
  // G_k = 0.01*20 + 0.03*18 + 0.12*25 + 0.35 = 0.2 + 0.54 + 3.0 + 0.35 = 4.09
  // G_d = 0.2*1.1 + 0.54*1.2 + 3.0*1.15 + 0.35*1.2 = 0.22 + 0.648 + 3.45 + 0.42 = 4.738
  const r = calculateDeadLoad({ floorLayers: layers, allowableFloorGd: 6.0 });
  assert.equal(r.valid, true);
  assert.equal(r.floorGk, 4.09);
  assert.equal(r.floorGd, 4.738);
  assert.ok(Math.abs(r.utilization.eta - 4.738 / 6.0) < 0.001);
  assert.equal(r.utilization.passed, true);
  console.log(`[PASS] A1-A (Sàn dân dụng 4 lớp): G_k=${r.floorGk} kN/m², G_d=${r.floorGd} kN/m², η=${r.utilization.eta.toFixed(3)} → ${r.utilization.icon}`);
}

// --- MÔ-ĐUN A1-B: TƯỜNG XÂY TRÊN DẦM CÓ CỬA MỞ ---
{
  // H_t = 3.6m, h_d = 0.6m -> H_w = 3.0m
  // Tường dày 200mm gạch rỗng (γ = 13 kN/m³), trát 2 mặt 15mm (γ = 18 kN/m³)
  // g_brick,k = 0.2 * 13 = 2.6 kN/m²
  // g_plaster,k = 2 * 0.015 * 18 = 0.54 kN/m²
  // g_wall,k = 3.14 kN/m²
  // Cửa mở 15% -> factor = 0.85
  // q_w,k = 3.14 * 3.0 * 0.85 = 8.007 kN/m
  // q_w,d = 8.007 * 1.15 = 9.208 kN/m
  const r = calculateDeadLoad({
    storyHeight: 3.6,
    beamHeight: 0.6,
    wallThickness: 200,
    brickType: 'hollow_clay',
    plasterThickness: 15,
    openingPercent: 15,
  });
  assert.equal(r.valid, true);
  assert.equal(r.netWallHeight, 3.0);
  assert.equal(r.gWallTotalK, 3.14);
  assert.equal(r.wallQk, 8.01);
  assert.equal(r.wallQd, 9.21);
  console.log(`[PASS] A1-B (Tường trên dầm): H_w=${r.netWallHeight} m, g_wall=${r.gWallTotalK} kN/m², q_w,k=${r.wallQk} kN/m, q_w,d=${r.wallQd} kN/m.`);
}

// --- MÔ-ĐUN A1-C: VALIDATION BIÊN ---
{
  const r = calculateDeadLoad({ storyHeight: 3.0, beamHeight: 3.5, brickType: 'invalid_brick' });
  assert.equal(r.valid, false);
  assert.ok(r.errors.length >= 2, 'Bắt đúng 2 lỗi: loại gạch và chiều cao dầm >= tầng');
  console.log('[PASS] A1-C (Validation biên): Bắt lỗi đúng quy cách khi input sai.');
}

// --- TẦNG 4: SKILL_BRIDGE payload cho 3 module mới (6 khóa gốc + sanitize) ---
{
  const beam = calculateRCBeamAdvanced({ b: 300, h: 600, a: 40, aPrime: 40, M: 600, V: 120, concrete: 'B25', rebar: 'CB400V', stirrupRebar: 'CB240T', stirrupDia: 8, stirrupLegs: 2, stirrupSpacing: 150 });
  const combo = calculateLoadCombination({ Gk: 10, Qk: 5, Wk: 2, capacity: 18 });
  const punch = calculatePunchingShear({ h: 200, a: 30, columnB: 300, columnH: 300, F: 600, Mbx: 30, Mby: 20, concrete: 'B25' });
  const deadload = calculateDeadLoad({ allowableFloorGd: 6.0 });
  const cases = [
    ['B1', beam, 'rcbeam_advanced_tcvn5574'],
    ['A4', combo, 'load_combination_tcvn2737'],
    ['B4', punch, 'punching_shear_tcvn5574'],
    ['A1', deadload, 'deadload_tcvn2737'],
  ];
  for (const [tag, res, expId] of cases) {
    const bridge = buildSkillBridgePayload(res);
    assert.equal(bridge.schema_version, '2.1.0', `${tag}: schema_version`);
    assert.equal(bridge.module_id, expId, `${tag}: module_id = ${bridge.module_id}`);
    assert.ok(bridge.standard_reference, `${tag}: standard_reference`);
    assert.ok(bridge.inputs && bridge.outputs, `${tag}: inputs & outputs`);
    assert.ok(bridge.policy_evaluation && bridge.calculation_logs, `${tag}: policy_evaluation & calculation_logs`);
    assert.ok(!JSON.stringify(bridge).includes('NaN'), `${tag}: JSON không chứa NaN`);
  }
  console.log('[PASS] Tầng 4 (SKILL_BRIDGE v2.1.0): 4 module mới (B1/A4/B4/A1) xuất payload đúng module_id, 6 khóa gốc đầy đủ, sanitize sạch.');
}

console.log('=== TẤT CẢ 13 KÍCH THỬ 4 MÔ-ĐUN NÂNG CẤP ĐẠT (B1 ×3, A4 ×3, B4 ×3, A1 ×3 + SKILL_BRIDGE) ===');
