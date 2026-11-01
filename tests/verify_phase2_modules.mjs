import assert from 'node:assert/strict';
import {
  calculateRCColumnBiaxial,
  calculateTwoWaySlab,
  calculateSteelBeam,
  calculateGlobalStabilityCheck,
  buildSkillBridgePayload,
} from '../src/services/calculatorEngines.js';

console.log('=== KIỂM THỬ BỘ 4 MÔ-ĐUN CẤU KIỆN & ỔN ĐỊNH MỚI (PHASE 2) ===');

// --- 1. MÔ-ĐUN 11: CỘT BTCT NÉN LỆCH TÂM XIÊN BRESLER ---
{
  const r = calculateRCColumnBiaxial({
    b: 400,
    h: 400,
    a: 40,
    L: 3.6,
    concrete: 'B25',
    rebar: 'CB400V',
    Ned: 1200,
    Medx: 80,
    Medy: 60,
    rebarDia: 20,
    rebarCount: 8,
  });

  assert.equal(r.valid, true);
  assert.equal(r.b, 400);
  assert.equal(r.h, 400);
  assert.equal(r.rebarCount, 8);
  assert.ok(r.AsTot > 2500, 'As_tot > 2500 mm²');
  assert.ok(r.mu >= 0.1 && r.mu <= 3.0, 'Hàm lượng thép hợp chuẩn');
  assert.ok(r.NRd0 > 3000, `N_Rd,0 = ${r.NRd0} kN (nén đúng tâm)`);
  assert.ok(r.NRdBresler > 0, `N_Rd,Bresler = ${r.NRdBresler} kN`);
  assert.ok(r.utilization.eta > 0, `η = ${r.utilization.eta}`);
  assert.equal(r.utilization.passed, true);
  console.log(`[PASS] M11 (Cột lệch tâm xiên Bresler): N_Rd0=${r.NRd0} kN, N_Rd,Bresler=${r.NRdBresler} kN, η=${r.utilization.eta} → ${r.utilization.icon}`);
}

// --- 2. MÔ-ĐUN 12: Ô BẢN SÀN BTCT 2 PHƯƠNG MARCUS ---
{
  const r = calculateTwoWaySlab({
    Lx: 4.0,
    Ly: 6.0,
    h: 120,
    a: 20,
    concrete: 'B25',
    rebar: 'CB240T',
    gdl: 4.5,
    qll: 2.0,
    boundary: 'fixed_all',
  });

  assert.equal(r.valid, true);
  assert.equal(r.L1, 4.0);
  assert.equal(r.L2, 6.0);
  assert.equal(r.rho, 1.5);
  assert.equal(r.isOneWay, false, '1.5 <= 2.0 -> Bản 2 phương');
  assert.equal(r.qUls, 8.0, 'q_ULS = 1.2*4.5 + 1.3*2.0 = 8.0 kN/m²');
  assert.ok(r.M1Pos > 0, `M1_pos = ${r.M1Pos} kNm`);
  assert.ok(r.As1Pos > 0, `As1_pos = ${r.As1Pos} mm²/m`);
  assert.ok(r.fCalc <= r.fAllow, `f = ${r.fCalc} mm <= [f] = ${r.fAllow} mm`);
  assert.equal(r.utilization.passed, true);
  console.log(`[PASS] M12 (Ô bản sàn 2 phương Marcus): q_u=${r.qUls} kN/m², M1_pos=${r.M1Pos} kNm, f=${r.fCalc}/${r.fAllow} mm, η=${r.utilization.eta} → ${r.utilization.icon}`);
}

// --- 3. MÔ-ĐUN 13: DẦM THÉP HÌNH I & ỔN ĐỊNH LTB ---
{
  const r = calculateSteelBeam({
    profile: 'I300x150x6.5x9',
    L: 6.0,
    steelGrade: 'SS400',
    q: 25.0,
    Lcr: 6.0,
    hasDeckBracing: false,
  });

  assert.equal(r.valid, true);
  assert.equal(r.Med, 112.5, 'Med = 25*36/8 = 112.5 kNm');
  assert.equal(r.Ved, 75.0, 'Ved = 25*6/2 = 75 kN');
  assert.ok(r.McRd > r.Med, `Mc,Rd = ${r.McRd} kNm > Med = ${r.Med} kNm`);
  assert.ok(r.VcRd > r.Ved, `Vc,Rd = ${r.VcRd} kN > Ved = ${r.Ved} kN`);
  assert.ok(r.chiLT <= 1.0 && r.chiLT > 0, `χ_LT = ${r.chiLT}`);
  assert.ok(r.fCalc > 0 && r.fAllow === 15.0, `f = ${r.fCalc} mm, [f] = 6000/400 = 15 mm`);
  console.log(`[PASS] M13 (Dầm thép hình I & LTB): M_ed=${r.Med} kNm, M_c,Rd=${r.McRd} kNm, χ_LT=${r.chiLT}, M_b,Rd=${r.MbRd} kNm, η=${r.utilization.eta} → ${r.utilization.icon}`);
}

// --- 4. MÔ-ĐUN 14: KIỂM TOÁN ỔN ĐỊNH TỔNG THỂ CÔNG TRÌNH ---
{
  const r = calculateGlobalStabilityCheck({
    totalWeightG: 45000,
    lateralWindV: 2200,
    overturningMw: 38000,
    foundationB: 24.0,
    totalHeightH: 60.0,
    storyCount: 18,
    maxStoryDrift: 8.0,
    storyHeight: 3.3,
    frictionCoeff: 0.35,
  });

  assert.equal(r.valid, true);
  assert.equal(r.Mcl, 486000.0, 'M_cl = 0.9 * 45000 * 12 = 486000 kNm');
  assert.equal(r.Klat, 12.79, 'K_lat = 486000 / 38000 = 12.79');
  assert.equal(r.passLat, true, 'K_lat >= 1.50');
  assert.equal(r.passTruot, true, 'K_truot >= 1.20');
  assert.ok(r.theta <= 0.20, `Hệ số P-Delta θ = ${r.theta}`);
  assert.equal(r.passDrift, true, `Δ/h = ${r.driftRatio} <= 0.004`);
  assert.equal(r.passTop, true, `Δ_top/H = ${r.deltaTopRatio} <= 0.002`);
  assert.equal(r.utilization.passed, true);
  console.log(`[PASS] M14 (Ổn định tổng thể toàn nhà): K_lật=${r.Klat} (≥1.5), K_trượt=${r.Ktruot} (≥1.2), θ_PDelta=${r.theta}, η=${r.utilization.eta} → ${r.utilization.icon}`);
}

// --- 5. TẦNG 4: SKILL_BRIDGE v2.1.0 SERIALIZATION CHO 4 MÔ-ĐUN MỚI ---
{
  const col = calculateRCColumnBiaxial({ b: 400, h: 400, Ned: 1200, Medx: 80, Medy: 60 });
  const slab = calculateTwoWaySlab({ Lx: 4, Ly: 6 });
  const beam = calculateSteelBeam({ profile: 'I300x150x6.5x9', L: 6, q: 20 });
  const stab = calculateGlobalStabilityCheck({ totalWeightG: 45000, lateralWindV: 2200, overturningMw: 38000 });

  const cases = [
    ['M11', col, 'rccolumn_bresler_tcvn5574'],
    ['M12', slab, 'twoway_slab_tcvn5574'],
    ['M13', beam, 'steel_beam_tcvn5575'],
    ['M14', stab, 'global_stability_tcvn2737'],
  ];

  for (const [tag, res, expId] of cases) {
    const bridge = buildSkillBridgePayload(res);
    assert.equal(bridge.schema_version, '2.1.0', `${tag}: schema_version`);
    assert.equal(bridge.module_id, expId, `${tag}: module_id = ${bridge.module_id}`);
    assert.ok(bridge.standard_reference, `${tag}: standard_reference`);
    assert.ok(bridge.inputs && bridge.outputs, `${tag}: inputs & outputs`);
    assert.ok(bridge.policy_evaluation && bridge.calculation_logs, `${tag}: policy_evaluation & logs`);
    assert.ok(!JSON.stringify(bridge).includes('NaN'), `${tag}: JSON không chứa NaN`);
  }
  console.log('[PASS] Tầng 4 (SKILL_BRIDGE v2.1.0): 4 mô-đun mới (Cột Bresler, Sàn Marcus, Dầm thép LTB, Ổn định tổng thể) xuất payload chuẩn hóa 100%.');
}

console.log('=== TẤT CẢ 5 BỘ KIỂM THỬ MÔ-ĐUN MỚI PHASE 2 ĐẠT TUYỆT ĐỐI (100% PASS) ===');
