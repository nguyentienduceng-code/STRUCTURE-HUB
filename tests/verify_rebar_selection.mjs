import assert from 'node:assert';
import {
  suggestBeamRebar,
  evaluateBeamProvidedRebar,
  suggestSlabRebar,
  evaluateSlabProvidedRebar,
  evaluateColumnClearance,
  suggestColumnRebar,
  calculateBeamRebarTCVN5574,
  calculateRCBeamAdvanced,
  calculateTwoWaySlab,
  calculateRCColumnBiaxial,
  COMMERCIAL_BEAM_REBAR_DIAMETERS,
  COMMERCIAL_SLAB_REBAR_DIAMETERS,
  COMMERCIAL_SLAB_SPACINGS,
  COMMERCIAL_COLUMN_REBAR_DIAMETERS,
} from '../src/services/calculatorEngines.js';

console.log('=== BỘ KIỂM THỬ HỆ THỐNG GỢI Ý & CHỌN CỐT THÉP (TCVN 5574:2018) ===');

// 1. Kiểm tra hằng số thương mại tiêu chuẩn Việt Nam (TCVN 1651:2018)
assert(COMMERCIAL_BEAM_REBAR_DIAMETERS.includes(20), 'Phải có Ø20 cho dầm');
assert(COMMERCIAL_SLAB_REBAR_DIAMETERS.includes(10), 'Phải có Ø10 cho sàn');
assert(COMMERCIAL_SLAB_SPACINGS.includes(150), 'Phải có bước a150 cho sàn');
assert(COMMERCIAL_COLUMN_REBAR_DIAMETERS.includes(22), 'Phải có Ø22 cho cột');
console.log('[PASS] Test 1: Hằng số đường kính cốt thép thương mại TCVN 1651:2018 chuẩn hóa.');

// 2. Gợi ý chọn thép dầm (suggestBeamRebar)
const beamSugs = suggestBeamRebar({ AsReq: 1250, b: 300, a: 45, isTop: false });
assert(Array.isArray(beamSugs) && beamSugs.length > 0, 'Phải có ít nhất 1 gợi ý thép dầm');
const topSug = beamSugs[0];
assert(topSug.areaMm2 >= 1250 * 0.98, `Thép gợi ý ${topSug.label} phải đủ diện tích (có ${topSug.areaMm2} >= 1225)`);
assert(topSug.sClear >= 25, `Khoảng hở thông thủy phải >= 25 mm (tính được ${topSug.sClear})`);
console.log(`[PASS] Test 2: Gợi ý thép dầm tối ưu: top 1 là ${topSug.label} (As = ${topSug.areaMm2} mm², delta = ${topSug.deltaPct}%, s_clear = ${topSug.sClear} mm)`);

// 3. Đánh giá thép dầm đã chọn (evaluateBeamProvidedRebar)
const beamEvalOptimal = evaluateBeamProvidedRebar({
  AsReq: 1250,
  barCount: 4,
  barDia: 20,
  b: 300,
  h: 600,
  a: 45,
  concrete: 'B25',
  rebar: 'CB400V',
  M: 220,
  isTop: false,
});
assert.strictEqual(beamEvalOptimal.status, 'PASS', 'Phương án 4Ø20 phải ĐẠT');
assert(beamEvalOptimal.clearanceOk, 'Khoảng hở 4Ø20 trong dầm b=300 phải đạt');
assert(beamEvalOptimal.deltaPct >= 0 && beamEvalOptimal.deltaPct <= 10, 'Tỷ lệ thép dư phải trong khoảng 0-10%');
assert(beamEvalOptimal.MRdProv >= 220, `Khả năng chịu uốn MRd = ${beamEvalOptimal.MRdProv} phải >= 220 kNm`);

const beamEvalCongested = evaluateBeamProvidedRebar({
  AsReq: 1250,
  barCount: 6,
  barDia: 25,
  b: 200,
  h: 600,
  a: 45,
  concrete: 'B25',
  rebar: 'CB400V',
  M: 220,
  isTop: false,
});
assert.strictEqual(beamEvalCongested.clearanceOk, false, '6Ø25 trong dầm b=200 phải cảnh báo không đạt khoảng hở');
assert(beamEvalCongested.remarks.some((r) => r.includes('QUÁ CHẬT') || r.includes('rỗ tổ ong')), 'Phải cảnh báo rỗ tổ ong');
console.log('[PASS] Test 3: Đánh giá thép dầm thực tế: bắt chuẩn khoảng hở s_clear & cảnh báo rỗ tổ ong Điều 10.3.1.');

// 4. Gợi ý & đánh giá thép sàn 2 phương (suggestSlabRebar & evaluateSlabProvidedRebar)
const slabSugs = suggestSlabRebar({ AsReqPerM: 520, h: 120 });
assert(Array.isArray(slabSugs) && slabSugs.length > 0, 'Phải có gợi ý thép sàn');
const topSlabSug = slabSugs[0];
assert(topSlabSug.spacingOk, 'Bước thép sàn phải thỏa điều kiện a <= a_max');
assert(topSlabSug.areaMm2 >= 520 * 0.95, 'Diện tích thép sàn phải đủ');

const slabEval = evaluateSlabProvidedRebar({ AsReqPerM: 520, dia: 10, spacing: 150, h: 120 });
assert.strictEqual(slabEval.status, 'PASS', 'Ø10a150 (As=523.6 mm2/m) phải ĐẠT cho AsReq=520 mm2/m');
assert.strictEqual(slabEval.spacingOk, true, 'Bước a150 <= a_max = 180 mm phải ĐẠT');
console.log(`[PASS] Test 4: Gợi ý & Đánh giá thép sàn: ${topSlabSug.label} (As = ${topSlabSug.areaMm2} mm²/m, a_max = ${topSlabSug.sMax} mm).`);

// 5. Kiểm tra khoảng hở & gợi ý thép cột (evaluateColumnClearance & suggestColumnRebar)
const colClear = evaluateColumnClearance(400, 400, 40, 20, 8);
assert.strictEqual(colClear.clearOk, true, '8Ø20 cột 400x400 khoảng hở phải đạt >= 50 mm');
assert(colClear.minClear >= 50, `Khoảng hở tịnh cột phải >= 50 mm (tính được ${colClear.minClear})`);

const colSugs = suggestColumnRebar({
  Ned: 1200,
  Medx: 80,
  Medy: 60,
  b: 400,
  h: 400,
  a: 40,
  L: 3.6,
  concrete: 'B25',
  rebar: 'CB400V',
});
assert(Array.isArray(colSugs) && colSugs.length > 0, 'Phải có ít nhất 1 phương án thép cột gợi ý');
assert(colSugs[0].eta <= 1.0, 'Phương án thép cột top 1 phải có eta <= 1.0');
console.log(`[PASS] Test 5: Khoảng hở & Gợi ý thép cột: s_min = ${colClear.minClear} mm >= 50 mm; Gợi ý top 1: ${colSugs[0].label} (η = ${colSugs[0].eta}, μ = ${colSugs[0].mu}%).`);

// 6. Kiểm tra tích hợp vào các Engine chính
const beamRes = calculateBeamRebarTCVN5574({
  b: 300,
  h: 600,
  a: 45,
  M: 220,
  concrete: 'B25',
  rebar: 'CB400V',
  selectedCount: 4,
  selectedDia: 20,
});
assert(beamRes.suggestedRebars.length > 0, 'calculateBeamRebarTCVN5574 phải trả về suggestedRebars');
assert(beamRes.providedRebar !== null, 'calculateBeamRebarTCVN5574 phải trả về providedRebar khi có selectedCount');
assert.strictEqual(beamRes.providedRebar.label, '4Ø20', 'Nhãn thép chọn phải là 4Ø20');

const advRes = calculateRCBeamAdvanced({
  b: 300,
  h: 600,
  a: 40,
  aPrime: 40,
  M: 600,
  V: 120,
  concrete: 'B25',
  rebar: 'CB400V',
  tensionDia: 25,
  tensionCount: 5,
  compDia: 18,
  compCount: 2,
});
assert(advRes.tensionSuggestions.length > 0, 'calculateRCBeamAdvanced phải có tensionSuggestions');
assert(advRes.compSuggestions.length > 0, 'calculateRCBeamAdvanced cốt kép phải có compSuggestions');
assert(advRes.providedTension !== null, 'calculateRCBeamAdvanced phải có providedTension');
assert(advRes.providedComp !== null, 'calculateRCBeamAdvanced phải có providedComp');

const slabRes = calculateTwoWaySlab({
  Lx: 4.0,
  Ly: 6.0,
  h: 120,
  a: 20,
  dia1Pos: 10,
  s1Pos: 150,
});
assert(slabRes.slabSuggestions.pos1.length > 0, 'calculateTwoWaySlab phải có slabSuggestions.pos1');
assert(slabRes.providedSlabRebars.pos1 !== null, 'calculateTwoWaySlab phải có providedSlabRebars.pos1');

const colRes = calculateRCColumnBiaxial({
  b: 400,
  h: 400,
  a: 40,
  L: 3.6,
  Ned: 1200,
  Medx: 80,
  Medy: 60,
  rebarDia: 20,
  rebarCount: 8,
});
assert(colRes.columnClearance !== undefined, 'calculateRCColumnBiaxial phải có columnClearance');
assert(colRes.columnSuggestions.length > 0, 'calculateRCColumnBiaxial phải có columnSuggestions');
assert(colRes.remarks.length > 0, 'calculateRCColumnBiaxial phải có remarks');
console.log('[PASS] Test 6: Tích hợp trọn vẹn vào cả 4 Engine kết cấu (Dầm đơn, Dầm nâng cao, Sàn Marcus, Cột Bresler).');

console.log('=== TẤT CẢ 6 BỘ KIỂM THỬ GỢI Ý & CHỌN THÉP ĐẠT 100% TUYỆT ĐỐI ===');
