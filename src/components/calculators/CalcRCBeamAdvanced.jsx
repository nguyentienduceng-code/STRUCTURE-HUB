import { useState } from 'react';
import {
  Building,
  FileText,
  Copy,
  Check,
  AlertTriangle,
  Bot,
  Lightbulb,
  CheckCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  CONCRETE_GRADES_TCVN5574,
  REBAR_GRADES_TCVN5574,
  COMMERCIAL_BEAM_REBAR_DIAMETERS,
  calculateRCBeamAdvanced,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';
import { generatePhuLucData } from '../../services/phuLucGenerator';

export default function CalcRCBeamAdvanced() {
  const [b, setB] = useState(300);
  const [h, setH] = useState(600);
  const [a, setA] = useState(40);
  const [aPrime, setAPrime] = useState(40);
  const [M, setM] = useState(600);
  const [V, setV] = useState(120);
  const [concrete, setConcrete] = useState('B25');
  const [rebar, setRebar] = useState('CB400V');
  const [stirrupRebar, setStirrupRebar] = useState('CB240T');
  const [stirrupDia, setStirrupDia] = useState('8');
  const [stirrupLegs, setStirrupLegs] = useState('2');
  const [stirrupSpacing, setStirrupSpacing] = useState('150');

  // Thép dọc thực tế lựa chọn (kéo & nén)
  const [tensionCount, setTensionCount] = useState(5);
  const [tensionDia, setTensionDia] = useState(25);
  const [compCount, setCompCount] = useState(2);
  const [compDia, setCompDia] = useState(18);

  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateRCBeamAdvanced({
    b,
    h,
    a,
    aPrime,
    M,
    V,
    concrete,
    rebar,
    stirrupRebar,
    stirrupDia,
    stirrupLegs,
    stirrupSpacing,
    tensionCount,
    tensionDia,
    compCount,
    compDia,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== BÁO CÁO DẦM BTCT TOÀN DIỆN (${result.standardRef}) ===`,
      `- Tiết diện: b×h = ${b}×${h} mm (a = ${a}, a' = ${aPrime})`,
      `- Nội lực: M = ${M} kNm, V = ${V} kN`,
      `- Trạng thái: ${result.isDoubleLayer ? 'CỐT KÉP (As & As\')' : 'Cốt đơn (As)'}`,
      `- A_s,req = ${result.AsDesignMm2} mm²${result.isDoubleLayer ? `, A_s',req = ${result.AsPrimeRequiredMm2} mm²` : ''} (x = ${result.x} mm)`,
      result.providedTension
        ? `- Thép kéo chọn: ${result.providedTension.label} (${result.providedTension.AsProvCm2} cm², chênh ${result.providedTension.deltaPct > 0 ? '+' : ''}${result.providedTension.deltaPct}%) | s_clear = ${result.providedTension.sClear} mm`
        : '',
      result.isDoubleLayer && result.providedComp
        ? `- Thép nén chọn: ${result.providedComp.label} (${result.providedComp.AsProvCm2} cm², chênh ${result.providedComp.deltaPct > 0 ? '+' : ''}${result.providedComp.deltaPct}%) | s_clear = ${result.providedComp.sClear} mm`
        : '',
      result.VRd !== null
        ? `- Khả năng chịu cắt: V_Rd = ${result.VRd} kN (V_Rd,c = ${result.VRdc}, V_Rd,s = ${result.VRds}) với đai Ø${stirrupDia}a${stirrupSpacing} (${stirrupLegs} nhánh)`
        : `- Khả năng chịu cắt: CHƯA KẾT LUẬN (thiếu thông số cốt đai; q_sw yêu cầu ≥ ${result.qSwReq} N/mm)`,
      `- η tổng hợp = ${result.utilization.eta.toFixed(3)} (${result.utilization.icon} ${result.utilization.label})`,
      ...result.steps,
    ].filter(Boolean).join('\n');
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  const phuLucData = result.valid
    ? generatePhuLucData(
        'rcbeamadvanced',
        {
          b,
          h,
          a,
          aPrime,
          M,
          V,
          concrete,
          rebar,
          stirrupRebar,
          stirrupDia,
          stirrupLegs,
          stirrupSpacing,
          selected_tension: result.providedTension ? result.providedTension.label : null,
          selected_comp: result.providedComp ? result.providedComp.label : null,
        },
        result
      )
    : null;

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 7: Dầm BTCT Cốt kép & Cắt cốt đai (B1 nâng cao)',
        standard: result.standardRef,
        inputs: {
          b_mm: Number(b),
          h_mm: Number(h),
          a_mm: Number(a),
          aPrime_mm: Number(aPrime),
          M_kNm: Number(M),
          V_kN: Number(V),
          concrete,
          rebar,
          stirrupRebar,
          stirrup_dia: stirrupDia || null,
          stirrup_spacing: stirrupSpacing || null,
          selected_tension: result.providedTension ? result.providedTension.label : null,
          selected_comp: result.providedComp ? result.providedComp.label : null,
        },
        outputs: {
          is_double: result.isDoubleLayer,
          As_cm2: result.AsDesignCm2,
          AsPrime_cm2: result.AsPrimeCm2,
          x_mm: result.x,
          xi: result.xi,
          VRd_kN: result.VRd,
          As_tension_prov_cm2: result.providedTension ? result.providedTension.AsProvCm2 : null,
          As_comp_prov_cm2: result.providedComp ? result.providedComp.AsProvCm2 : null,
          eta_overall: result.utilization.eta,
        },
        utilization: result.utilization,
        steps: result.steps,
      })
    : null;

  return (
    <div className="calc-module-card card">
      <div className="calc-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 7: Dầm BTCT Toàn diện — Cốt đơn/Cốt kép + Cắt Cốt đai (<var>A<sub>s</sub>, A<sub>s</sub>&apos; &amp; V<sub>Rd</sub></var>)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 5574:2018 — Điều 8.1.2 (uốn), Điều 8.1.3 (cắt) &amp; Điều 10.3 (cấu tạo)</strong>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="spec-badge">Tự động chuyển cốt kép khi &alpha;<sub>m</sub> &gt; &alpha;<sub>R</sub></span>
          <button
            type="button"
            className="calc-action-btn phuluc-btn"
            onClick={() => setIsPhuLucOpen(true)}
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          >
            <FileText size={14} /> <span>Xem Phụ lục A4</span>
          </button>
        </div>
      </div>

      {/* TẦNG 1: NHẬP LIỆU */}
      <div className="calc-tier">
        <div className="calc-tier-title">1. Tầng Nhập liệu &amp; Kiểm soát Tham số</div>
        <div className="calc-input-grid">
          <div className="calc-field">
            <label>Bề rộng b (mm)</label>
            <input type="number" min="100" max="2500" value={b} onChange={(e) => setB(e.target.value)} className="calc-input" />
          </div>
          <div className="calc-field">
            <label>Chiều cao h (mm)</label>
            <input type="number" min="150" max="4000" value={h} onChange={(e) => setH(e.target.value)} className="calc-input" />
          </div>
          <div className="calc-field">
            <label>Lớp bảo vệ a / a&apos; (mm)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="number" min="15" value={a} onChange={(e) => setA(e.target.value)} className="calc-input" placeholder="a (kéo)" />
              <input type="number" min="15" value={aPrime} onChange={(e) => setAPrime(e.target.value)} className="calc-input" placeholder="a' (nén)" />
            </div>
          </div>
          <div className="calc-field">
            <label>Mômen M (kNm) &amp; Lực cắt V (kN)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="number" min="1" value={M} onChange={(e) => setM(e.target.value)} className="calc-input" />
              <input type="number" min="0" value={V} onChange={(e) => setV(e.target.value)} className="calc-input" />
            </div>
          </div>
          <div className="calc-field">
            <label>Bê tông &amp; Thép dọc</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '8px' }}>
              <select value={concrete} onChange={(e) => setConcrete(e.target.value)} className="calc-select">
                {Object.values(CONCRETE_GRADES_TCVN5574).map((c) => (
                  <option key={c.code} value={c.code}>{c.code} (R_b = {c.Rb} MPa)</option>
                ))}
              </select>
              <select value={rebar} onChange={(e) => setRebar(e.target.value)} className="calc-select">
                {Object.values(REBAR_GRADES_TCVN5574).map((r) => (
                  <option key={r.code} value={r.code}>{r.code} (R_s = {r.Rs} MPa)</option>
                ))}
              </select>
            </div>
          </div>
          <div className="calc-field">
            <label>Cốt đai (TCVN 5574:2018 Điều 8.1.3 &amp; 10.3.2)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr 1fr', gap: '8px' }}>
              <select value={stirrupRebar} onChange={(e) => setStirrupRebar(e.target.value)} className="calc-select">
                {Object.values(REBAR_GRADES_TCVN5574).map((r) => (
                  <option key={r.code} value={r.code}>{r.code} (R_sw = {r.Rsw} MPa)</option>
                ))}
              </select>
              <input type="number" min="4" max="25" placeholder="Ø (mm)" value={stirrupDia} onChange={(e) => setStirrupDia(e.target.value)} className="calc-input" />
              <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1fr', gap: '8px' }}>
                <input type="number" min="1" max="4" value={stirrupLegs} onChange={(e) => setStirrupLegs(e.target.value)} className="calc-input" title="Số nhánh đai (1-4)" />
                <input type="number" min="50" max="300" placeholder="Bước s (mm)" value={stirrupSpacing} onChange={(e) => setStirrupSpacing(e.target.value)} className="calc-input" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!result.valid ? (
        <div className="alert-box" style={{ borderColor: 'var(--red)', background: 'rgba(239,68,68,0.1)' }}>
          <div className="alert-box-title" style={{ color: 'var(--red)' }}>
            <AlertTriangle size={18} /> Lỗi dữ liệu đầu vào:
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-danger)' }}>
            {result.errors.map((err, i) => (<li key={i}>{err}</li>))}
          </ul>
        </div>
      ) : (
        <>
          {result.warnings.map((w, i) => (
            <div key={i} className="alert-box" style={{ borderColor: 'var(--orange, #f97316)', background: 'rgba(249,115,22,0.08)' }}>
              <div className="alert-box-title" style={{ color: 'var(--text-warning, #f97316)', fontWeight: 600 }}>{w}</div>
            </div>
          ))}

          {/* TẦNG 2: KẾT QUẢ THUẦN */}
          <div className="calc-tier">
            <div className="calc-tier-title">2. Tầng Tính toán Thuần (Deterministic Math Engine)</div>
            <div className="calc-results-grid">
              <div className="calc-metric-box">
                <span className="calc-metric-label">Trạng thái tiết diện</span>
                <strong className="calc-metric-value" style={{ color: result.isDoubleLayer ? 'var(--text-warning, #f97316)' : '#60a5fa' }}>
                  {result.isDoubleLayer ? 'CỐT KÉP (As & As\')' : 'Cốt đơn (As)'}
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  &alpha;<sub>m</sub> = {result.alphaM} {result.isDoubleLayer ? '> α_R = ' : '≤ α_R = '}{result.alphaR}
                </small>
              </div>
              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">Thép dọc yêu cầu</span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-gold)' }}>
                  {result.AsDesignCm2} <small>cm²</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  As = {result.AsRequiredMm2} mm²{result.isDoubleLayer ? `, As' = ${result.AsPrimeRequiredMm2} mm²` : ''} | x = {result.x} mm
                </small>
              </div>
              <div className="calc-metric-box">
                <span className="calc-metric-label">Khả năng chịu cắt V<sub>Rd</sub></span>
                <strong className="calc-metric-value" style={{ color: result.VRd === null ? 'var(--text-muted)' : 'var(--green)' }}>
                  {result.VRd !== null ? `${result.VRd} kN` : 'CHƯA KẾT LUẬN'}
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  V_Rd,c = {result.VRdc} kN{result.VRds !== null ? ` + V_Rd,s = ${result.VRds} kN` : ` | q_sw cần ≥ ${result.qSwReq} N/mm`}
                </small>
              </div>
              <div className="calc-metric-box">
                <span className="calc-metric-label">Khả năng chịu uốn M<sub>Rd</sub></span>
                <strong className="calc-metric-value">{result.MRd} <small>kNm</small></strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>&xi; = {result.xi} (&xi;<sub>R</sub> = {result.xiR})</small>
              </div>
            </div>
          </div>

          {/* TẦNG 2.5: BỘ CHỌN CỐT THÉP & ĐÁNH GIÁ THỰC TẾ */}
          <div className="calc-tier" style={{ border: '1px solid var(--accent-primary)', background: 'rgba(59, 130, 246, 0.04)' }}>
            <div className="calc-tier-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)' }}>
              <Sparkles size={17} />
              <span>Gợi ý &amp; Chọn Cốt Thép Dọc &amp; Cốt Đai Thực Tế (Kiểm tra Cấu tạo Điều 10.3 TCVN 5574:2018)</span>
            </div>

            {/* PHẦN 1: THÉP DỌC CHỊU KÉO As */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  1. Cốt thép dọc chịu kéo <var>A<sub>s</sub></var> (Yêu cầu: {result.AsDesignMm2} mm² / {result.AsDesignCm2} cm²)
                </span>
                {result.providedTension && (
                  <span
                    className="spec-badge"
                    style={{
                      color: result.providedTension.clearanceOk ? '#10b981' : '#ef4444',
                      borderColor: result.providedTension.clearanceOk ? '#10b981' : '#ef4444',
                    }}
                  >
                    {result.providedTension.label} ({result.providedTension.AsProvCm2} cm², {result.providedTension.deltaPct > 0 ? `+${result.providedTension.deltaPct}%` : `${result.providedTension.deltaPct}%`}) — s<sub>clear</sub> = {result.providedTension.sClear} mm
                  </span>
                )}
              </div>

              {/* Gợi ý thép kéo */}
              {result.tensionSuggestions && result.tensionSuggestions.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {result.tensionSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTensionCount(sug.count);
                        setTensionDia(sug.dia);
                      }}
                      className="spec-badge"
                      style={{
                        cursor: 'pointer',
                        padding: '4px 10px',
                        fontSize: '0.8rem',
                        background: tensionCount === sug.count && tensionDia === sug.dia ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                        color: tensionCount === sug.count && tensionDia === sug.dia ? '#fff' : 'var(--text-primary)',
                      }}
                    >
                      <strong>{sug.label}</strong> ({sug.areaCm2} cm², {sug.deltaPct > 0 ? `+${sug.deltaPct}%` : `${sug.deltaPct}%`})
                    </button>
                  ))}
                </div>
              )}

              {/* Bộ chọn thép kéo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px', maxWidth: '380px' }}>
                <select value={tensionCount} onChange={(e) => setTensionCount(Number(e.target.value))} className="calc-select">
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => (<option key={n} value={n}>{n} thanh</option>))}
                </select>
                <select value={tensionDia} onChange={(e) => setTensionDia(Number(e.target.value))} className="calc-select">
                  {COMMERCIAL_BEAM_REBAR_DIAMETERS.map((d) => (<option key={d} value={d}>&Phi;{d} (Thanh A₁ = {((Math.PI * d * d) / 4).toFixed(0)} mm²)</option>))}
                </select>
              </div>
            </div>

            {/* PHẦN 2: THÉP DỌC CHỊU NÉN As' (NẾU CỐT KÉP) */}
            {result.isDoubleLayer && (
              <div style={{ marginBottom: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    2. Cốt thép dọc chịu nén <var>A&apos;<sub>s</sub></var> (Yêu cầu: {result.AsPrimeRequiredMm2} mm² / {result.AsPrimeCm2} cm²)
                  </span>
                  {result.providedComp && (
                    <span
                      className="spec-badge"
                      style={{
                        color: result.providedComp.clearanceOk ? '#10b981' : '#ef4444',
                        borderColor: result.providedComp.clearanceOk ? '#10b981' : '#ef4444',
                      }}
                    >
                      {result.providedComp.label} ({result.providedComp.AsProvCm2} cm², {result.providedComp.deltaPct > 0 ? `+${result.providedComp.deltaPct}%` : `${result.providedComp.deltaPct}%`}) — s<sub>clear</sub> = {result.providedComp.sClear} mm
                    </span>
                  )}
                </div>

                {/* Gợi ý thép nén */}
                {result.compSuggestions && result.compSuggestions.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {result.compSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCompCount(sug.count);
                          setCompDia(sug.dia);
                        }}
                        className="spec-badge"
                        style={{
                          cursor: 'pointer',
                          padding: '4px 10px',
                          fontSize: '0.8rem',
                          background: compCount === sug.count && compDia === sug.dia ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                          color: compCount === sug.count && compDia === sug.dia ? '#fff' : 'var(--text-primary)',
                        }}
                      >
                        <strong>{sug.label}</strong> ({sug.areaCm2} cm², {sug.deltaPct > 0 ? `+${sug.deltaPct}%` : `${sug.deltaPct}%`})
                      </button>
                    ))}
                  </div>
                )}

                {/* Bộ chọn thép nén */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px', maxWidth: '380px' }}>
                  <select value={compCount} onChange={(e) => setCompCount(Number(e.target.value))} className="calc-select">
                    {[2, 3, 4, 5, 6].map((n) => (<option key={n} value={n}>{n} thanh</option>))}
                  </select>
                  <select value={compDia} onChange={(e) => setCompDia(Number(e.target.value))} className="calc-select">
                    {COMMERCIAL_BEAM_REBAR_DIAMETERS.map((d) => (<option key={d} value={d}>&Phi;{d} (Thanh A₁ = {((Math.PI * d * d) / 4).toFixed(0)} mm²)</option>))}
                  </select>
                </div>
              </div>
            )}

            {/* NHẬN XÉT CẤU TẠO THÉP TOÀN DIỆN */}
            <div
              style={{
                marginTop: '12px',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid #10b981',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} color="#10b981" />
                <span>Đánh giá Chi tiết Cấu tạo &amp; Thi công Cốt thép (TCVN 5574:2018):</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                {result.providedTension && (
                  <li>
                    Thép kéo lớp dưới: {result.providedTension.label} (As = {result.providedTension.AsProvCm2} cm²), khoảng hở thông thủy s<sub>clear</sub> = {result.providedTension.sClear} mm {result.providedTension.clearanceOk ? '≥ [25 mm] đạt chuẩn Điều 10.3.1 (thuận tiện đầm dùi bê tông).' : '< [25 mm] QUÁ CHẬT, nguy cơ rỗ bê tông đáy dầm!'}
                  </li>
                )}
                {result.isDoubleLayer && result.providedComp && (
                  <li>
                    Thép nén lớp trên: {result.providedComp.label} (As&apos; = {result.providedComp.AsProvCm2} cm²), khoảng hở s<sub>clear</sub> = {result.providedComp.sClear} mm {result.providedComp.clearanceOk ? '≥ [30 mm] đạt chuẩn Điều 10.3.1.' : '< [30 mm] quá chật!'}
                  </li>
                )}
                {result.VRd !== null && (
                  <li>
                    Cốt đai đã chọn: &Phi;{stirrupDia}a{stirrupSpacing} ({stirrupLegs} nhánh) đạt sức kháng cắt V<sub>Rd</sub> = {result.VRd} kN ≥ V = {V} kN (bước đai s = {stirrupSpacing} mm ≤ [s<sub>max</sub> = {Math.min(h / 2, 300)} mm] theo Điều 10.3.2.1).
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* TẦNG 3: η & POLICY */}
          <div className="calc-tier" style={{ background: result.utilization.bg, borderColor: result.utilization.border }}>
            <div className="calc-tier-title" style={{ color: result.utilization.color }}>
              3. Tầng Đánh giá Hệ số Sử dụng η (uốn + cắt + dải nén)
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.utilization.icon} η = {result.utilization.eta.toFixed(3)} — <span style={{ color: result.utilization.color }}>{result.utilization.label}</span>
              </div>
              <span className="spec-badge" style={{ borderColor: result.utilization.color, color: result.utilization.color }}>
                η_uốn={result.etaFlex} · η_cắt={result.etaShear ?? '—'} · η_dải={result.etaStrut}
              </span>
            </div>
            <div className="eta-progress-track">
              <div className="eta-progress-fill" style={{ width: `${result.utilization.percent}%`, background: result.utilization.color }} />
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <strong>Nhận xét kỹ thuật:</strong> {result.statusMessage}
            </div>
            {result.utilization.eta <= 0.70 && (
              <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-success)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Lightbulb size={16} /> 💡 Giá trị có thể tối ưu (η ≤ 0.70): xem xét giảm tiết diện hoặc tăng nhịp để tiết kiệm bê tông/thép.
                </div>
              </div>
            )}
          </div>

          {/* TẦNG 4: BƯỚC TÍNH & XUẤT BÁO CÁO */}
          <div className="calc-tier">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div className="calc-tier-title" style={{ margin: 0 }}>4. Tầng Trình bày Bước tính &amp; Xuất Hồ sơ</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="calc-action-btn phuluc-btn"
                  onClick={() => setIsPhuLucOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={15} />
                  <span>📑 Xem Phụ lục Kỹ thuật (SKILL_PHULUC)</span>
                </button>
                <button type="button" className="calc-action-btn" onClick={() => setIsHandoffOpen(true)}>
                  <Bot size={15} /> <span>Xuất Handoff JSON</span>
                </button>
                <button type="button" className="calc-action-btn copy-btn" onClick={handleCopy}>
                  {copied ? <Check size={15} /> : <Copy size={15} />} <span>{copied ? 'Đã sao chép!' : 'Sao chép kết quả'}</span>
                </button>
                <button type="button" className="calc-action-btn" onClick={() => setShowSummary(!showSummary)}>
                  <Layers size={15} /> <span>{showSummary ? 'Ẩn bảng tổng hợp' : 'Bảng tổng hợp'}</span>
                </button>
              </div>
            </div>
            <ol className="calc-steps-list">
              {result.steps.map((step, idx) => (<li key={idx}>{step}</li>))}
            </ol>
            {showSummary && (
              <div style={{ marginTop: '16px' }}>
                <div className="spec-table-container">
                  <table className="spec-table" style={{ fontSize: '0.84rem', width: '100%' }}>
                    <thead>
                      <tr style={{ background: '#002060', color: '#fff' }}>
                        <th>Hạng mục kiểm toán</th><th style={{ textAlign: 'center' }}>Ký hiệu</th><th style={{ textAlign: 'right' }}>Giá trị tính</th><th style={{ textAlign: 'right' }}>Giới hạn</th><th style={{ textAlign: 'center' }}>η</th><th style={{ textAlign: 'center' }}>Kết luận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Uốn (cốt đơn/kép)</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>M/M_Rd</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{M} / {result.MRd} kNm</td>
                        <td style={{ textAlign: 'right' }}>M ≤ M_Rd</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{result.etaFlex}</td>
                        <td style={{ textAlign: 'center', color: result.etaFlex <= 1 ? '#10b981' : '#ef4444', fontWeight: 700 }}>{result.etaFlex <= 1 ? 'ĐẠT' : 'KHÔNG ĐẠT'}</td>
                      </tr>
                      {result.providedTension && (
                        <tr style={{ background: 'rgba(59, 130, 246, 0.08)' }}>
                          <td>Thép kéo chọn thực tế</td>
                          <td style={{ textAlign: 'center', fontStyle: 'italic' }}>A_s,prov</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.providedTension.label} ({result.providedTension.AsProvCm2} cm²)</td>
                          <td style={{ textAlign: 'right' }}>≥ {result.AsDesignCm2} cm²</td>
                          <td style={{ textAlign: 'center', fontWeight: 700 }}>{result.providedTension.deltaPct > 0 ? `+${result.providedTension.deltaPct}%` : `${result.providedTension.deltaPct}%`}</td>
                          <td style={{ textAlign: 'center', color: result.providedTension.status === 'PASS' ? '#10b981' : '#ef4444', fontWeight: 700 }}>{result.providedTension.status === 'PASS' ? 'ĐẠT' : 'CẢNH BÁO'}</td>
                        </tr>
                      )}
                      <tr>
                        <td>Cắt (nếu có cốt đai)</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>V/V_Rd</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{V} / {result.VRd ?? '—'} kN</td>
                        <td style={{ textAlign: 'right' }}>V ≤ V_Rd</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{result.etaShear ?? '—'}</td>
                        <td style={{ textAlign: 'center', color: result.etaShear == null ? '#f59e0b' : result.etaShear <= 1 ? '#10b981' : '#ef4444', fontWeight: 700 }}>{result.etaShear == null ? 'CHƯA KL' : result.etaShear <= 1 ? 'ĐẠT' : 'KHÔNG ĐẠT'}</td>
                      </tr>
                      <tr>
                        <td>Dải bê tông nghiêng</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>V/V_strut</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{V} / {result.VStrut} kN</td>
                        <td style={{ textAlign: 'right' }}>V ≤ 0.3·R_b·b·h₀</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{result.etaStrut}</td>
                        <td style={{ textAlign: 'center', color: result.etaStrut <= 1 ? '#10b981' : '#ef4444', fontWeight: 700 }}>{result.etaStrut <= 1 ? 'ĐẠT' : 'KHÔNG ĐẠT'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <HandoffModal isOpen={isHandoffOpen} onClose={() => setIsHandoffOpen(false)} data={handoffData} />

      <PhuLucCalculationModal
        isOpen={isPhuLucOpen}
        onClose={() => setIsPhuLucOpen(false)}
        phuLucData={phuLucData}
      />
    </div>
  );
}
