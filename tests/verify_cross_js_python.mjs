// ============================================================================
// CROSS-CHECK JAVASCRIPT <-> PYTHON (SKILL_VERIFY — differential / oracle test)
// Chạy cùng 1 bộ đầu vào qua calc_rc_section.py & calc_punching_shear.py
// (nguồn chân lý Python đã kiểm chứng) VÀ engine JS STRUCTURE-HUB, sau đó
// so sánh. Mục tiêu: loại bỏ "kiểm thử tautology" (cùng sai cả 2) bằng cách
// dùng Python làm oracle độc lập. Ngưỡng: sai số <= 0.5–1% trên trị chính.
// ============================================================================
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  calculateRCBeamAdvanced,
  calculatePunchingShear as calculatePunchingShearX,
} from '../src/services/calculatorEngines.js';

// Python skill nằm trên Google Drive (G:) — AGENTS.md Rule 1 (absolute path).
const SKILL_DIR = 'g:/My Drive/Google AI Studio/.agents/skills/Structural_Design_Engineer/scripts';
const PY_BEAM = `${SKILL_DIR}/calc_rc_section.py`;
const PY_PUNCH = `${SKILL_DIR}/calc_punching_shear.py`;

// Truyền payload qua argv (không qua shell) → an toàn mọi hệ điều hành.
function runPython(pyPath, payload) {
  const out = execFileSync('python', [pyPath, JSON.stringify(payload)], {
    encoding: 'utf-8',
  });
  return JSON.parse(out);
}

function relDiff(a, b) {
  const denom = Math.max(Math.abs(a), Math.abs(b), 1e-9);
  return Math.abs(a - b) / denom;
}

console.log('=== CROSS-CHECK JS <-> PYTHON (Python skill làm oracle độc lập) ===');

// --- Case X1: Dầm CỐT ĐƠN (M nhỏ) — so A_s, Q_b, Q_Rd với calc_rc_section.py ---
{
  const inputs = {
    b: 300, h: 600, a: 40, concrete: 'B25', rebar: 'CB400-V',
    M_ed: 200, V_ed: 80, stirrup_dia: 8, stirrup_legs: 2, stirrup_spacing: 150,
  };
  const py = runPython(PY_BEAM, inputs);
  const js = calculateRCBeamAdvanced({
    b: inputs.b, h: inputs.h, a: inputs.a, aPrime: 40, M: inputs.M_ed, V: inputs.V_ed,
    concrete: 'B25', rebar: 'CB400V', stirrupRebar: 'CB240T',
    stirrupDia: 8, stirrupLegs: 2, stirrupSpacing: 150,
  });
  assert.equal(py.status, 'PASSED', `Python: ${py.status} (kỳ vọng PASSED — cốt đơn)`);
  assert.equal(js.isDoubleLayer, false, 'JS: phải là cốt đơn');
  assert.ok(relDiff(py.As_req_mm2, js.AsRequiredMm2) < 0.005,
    `X1 A_s: Python=${py.As_req_mm2}, JS=${js.AsRequiredMm2}`);
  assert.ok(relDiff(py.Qb_kN, js.VRdc) < 0.005, `X1 Q_b: Python=${py.Qb_kN}, JS=${js.VRdc}`);
  assert.ok(relDiff(py.Q_rd_kN, js.VRd) < 0.005, `X1 Q_Rd: Python=${py.Q_rd_kN}, JS=${js.VRd}`);
  console.log(`[PASS] X1 (Cốt đơn): A_s Δ=${(relDiff(py.As_req_mm2, js.AsRequiredMm2) * 100).toFixed(3)}%, Q_b Δ=${(relDiff(py.Qb_kN, js.VRdc) * 100).toFixed(3)}%, Q_Rd Δ=${(relDiff(py.Q_rd_kN, js.VRd) * 100).toFixed(3)}% — JS khớp Python oracle.`);
}

// --- Case X2: Vượt α_R (cốt kép) — Python báo FAILED, JS phải tự chuyển CỐT KÉP ---
{
  const Mbig = 600; // α_m = 0.579 > α_R = 0.39 (CB400)
  const py = runPython(PY_BEAM, {
    b: 300, h: 600, a: 40, concrete: 'B25', rebar: 'CB400-V',
    M_ed: Mbig, V_ed: 120, alpha_R: 0.39,
  });
  const js = calculateRCBeamAdvanced({
    b: 300, h: 600, a: 40, aPrime: 40, M: Mbig, V: 120,
    concrete: 'B25', rebar: 'CB400V', stirrupRebar: 'CB240T',
    stirrupDia: 8, stirrupLegs: 2, stirrupSpacing: 150,
  });
  assert.ok(py.status === 'FAILED' || py.status_uon.includes('FAILED'), `Python: ${py.status} (kỳ vọng FAILED khi α_m > α_R)`);
  assert.equal(js.isDoubleLayer, true, 'JS phải tự chuyển CỐT KÉP khi α_m > α_R');
  assert.ok(js.AsPrimeRequiredMm2 > 0, 'JS phải cho A_s\' > 0 (giải pháp an toàn, không bịa cốt đơn)');
  console.log(`[PASS] X2 (Vượt α_R): Python=${py.status_uon} (từ chối cốt đơn), JS tự động CỐT KÉP A_s'=${js.AsPrimeRequiredMm2} mm² (x=x_R) — JS vượt lên Python.`);
}

// --- Case X3: Chọc thủng — so với calc_punching_shear.py làm oracle ---
{
  const inputs = {
    h: 200, a: 30, column_b: 300, column_h: 300, column_position: 'interior',
    F_b: 300, M_bx: 0, M_by: 0, concrete: 'B25', rebar: 'CB400-V',
  };
  const py = runPython(PY_PUNCH, inputs);
  const js = calculatePunchingShearX({
    h: 200, a: 30, columnB: 300, columnH: 300, columnPosition: 'interior',
    F: 300, Mbx: 0, Mby: 0, concrete: 'B25',
  });
  assert.equal(py.status, 'PASSED', `Python: ${py.status}`);
  assert.ok(relDiff(py.u_b_mm, js.uB) < 0.005, `X3 u_b: Python=${py.u_b_mm}, JS=${js.uB}`);
  assert.ok(relDiff(py.F_b_ult_kN, js.Fult) < 0.005, `X3 F_ult: Python=${py.F_b_ult_kN}, JS=${js.Fult}`);
  assert.ok(relDiff(py.eta_punch, js.etaPunch) < 0.01, `X3 η_punch: Python=${py.eta_punch}, JS=${js.etaPunch}`);
  console.log(`[PASS] X3 (Chọc thủng): u_b Δ=${(relDiff(py.u_b_mm, js.uB) * 100).toFixed(3)}%, F_ult Δ=${(relDiff(py.F_b_ult_kN, js.Fult) * 100).toFixed(3)}%, η Δ=${(relDiff(py.eta_punch, js.etaPunch) * 100).toFixed(3)}% — JS khớp Python oracle.`);
}

console.log('=== TẤT CẢ 3 CROSS-CHECK JS<->PYTHON ĐẠT (Oracle sai số < 0.5–1%) ===');
