import { useState } from 'react';
import {
  Grid,
  FileText,
  Copy,
  Check,
  Bot,
  AlertTriangle,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import {
  calculateTwoWaySlab,
  exportHandoffJSON,
  COMMERCIAL_SLAB_REBAR_DIAMETERS,
  COMMERCIAL_SLAB_SPACINGS,
} from '../../services/calculatorEngines';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';
import { generatePhuLucData } from '../../services/phuLucGenerator';

export default function CalcTwoWaySlab() {
  const [Lx, setLx] = useState(4.0);
  const [Ly, setLy] = useState(6.0);
  const [h, setH] = useState(120);
  const [a, setA] = useState(20);
  const [concrete, setConcrete] = useState('B25');
  const [rebar, setRebar] = useState('CB240T');
  const [gdl, setGdl] = useState(4.5);
  const [qll, setQll] = useState(2.0);
  const [boundary, setBoundary] = useState('fixed_all');

  // Thép thực tế lựa chọn cho 4 vị trí cốt thép sàn (nhịp & gối theo 2 phương)
  const [dia1Pos, setDia1Pos] = useState(10);
  const [s1Pos, setS1Pos] = useState(150);

  const [dia1Neg, setDia1Neg] = useState(10);
  const [s1Neg, setS1Neg] = useState(120);

  const [dia2Pos, setDia2Pos] = useState(8);
  const [s2Pos, setS2Pos] = useState(150);

  const [dia2Neg, setDia2Neg] = useState(8);
  const [s2Neg, setS2Neg] = useState(120);

  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateTwoWaySlab({
    Lx,
    Ly,
    h,
    a,
    concrete,
    rebar,
    gdl,
    qll,
    boundary,
    dia1Pos,
    s1Pos,
    dia1Neg,
    s1Neg,
    dia2Pos,
    s2Pos,
    dia2Neg,
    s2Neg,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const p = result.providedSlabRebars || {};
    const text = [
      `=== Ô BẢN SÀN BTCT 2 PHƯƠNG KÊ 4 CẠNH (${result.standardRef}) ===`,
      `- Ô sàn: Lx = ${Lx} m, Ly = ${Ly} m, h = ${h} mm, Liên kết: ${boundary}`,
      `- Tải trọng: q_u = ${result.qUls} kN/m², q_s = ${result.qSls} kN/m²`,
      `=> Nhịp ngắn (L1 = ${result.L1}m):`,
      `   * Bụng nhịp: M = ${result.M1Pos} kNm -> As,req = ${result.As1Pos} mm²/m | Thép chọn: ${p.pos1 ? `${p.pos1.label} (${p.pos1.AsProvMm2} mm²/m, ${p.pos1.deltaPct > 0 ? '+' : ''}${p.pos1.deltaPct}%)` : '—'}`,
      `   * Gối biên:  M = ${result.M1Neg} kNm -> As,req = ${result.As1Neg} mm²/m | Thép chọn: ${p.neg1 ? `${p.neg1.label} (${p.neg1.AsProvMm2} mm²/m, ${p.neg1.deltaPct > 0 ? '+' : ''}${p.neg1.deltaPct}%)` : '—'}`,
      `=> Nhịp dài (L2 = ${result.L2}m):`,
      `   * Bụng nhịp: M = ${result.M2Pos} kNm -> As,req = ${result.As2Pos} mm²/m | Thép chọn: ${p.pos2 ? `${p.pos2.label} (${p.pos2.AsProvMm2} mm²/m, ${p.pos2.deltaPct > 0 ? '+' : ''}${p.pos2.deltaPct}%)` : '—'}`,
      `   * Gối biên:  M = ${result.M2Neg} kNm -> As,req = ${result.As2Neg} mm²/m | Thép chọn: ${p.neg2 ? `${p.neg2.label} (${p.neg2.AsProvMm2} mm²/m, ${p.neg2.deltaPct > 0 ? '+' : ''}${p.neg2.deltaPct}%)` : '—'}`,
      `=> Độ võng SLS: f = ${result.fCalc} mm ≤ [f] = ${result.fAllow} mm (η_f = ${result.etaDeflection})`,
      `=> Đánh giá Policy Engine: η = ${result.utilization.eta} (${result.utilization.icon} ${result.utilization.label})`,
      ...result.steps,
    ].join('\n');
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
        'twowayslab',
        {
          Lx,
          Ly,
          h,
          a,
          concrete,
          rebar,
          gdl,
          qll,
          boundary,
          dia1Pos,
          s1Pos,
          dia1Neg,
          s1Neg,
          dia2Pos,
          s2Pos,
          dia2Neg,
          s2Neg,
        },
        result
      )
    : null;

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 12: Ô bản sàn BTCT 2 phương Marcus',
        standard: result.standardRef,
        inputs: {
          Lx,
          Ly,
          h,
          a,
          concrete,
          rebar,
          gdl,
          qll,
          boundary,
          rebar_choices: {
            pos1: `Ø${dia1Pos}a${s1Pos}`,
            neg1: `Ø${dia1Neg}a${s1Neg}`,
            pos2: `Ø${dia2Pos}a${s2Pos}`,
            neg2: `Ø${dia2Neg}a${s2Neg}`,
          },
        },
        outputs: {
          qUls_kNm2: result.qUls,
          M1Pos_kNm: result.M1Pos,
          M1Neg_kNm: result.M1Neg,
          As1Pos_mm2: result.As1Pos,
          As1Neg_mm2: result.As1Neg,
          fCalc_mm: result.fCalc,
          fAllow_mm: result.fAllow,
          utilization_eta: result.utilization.eta,
        },
        utilization: result.utilization,
        steps: result.steps,
      })
    : null;

  return (
    <div className="calc-module-card card">
      <div className="calc-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Grid size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 2.4: Tính &amp; Chọn Cốt thép Ô bản Sàn BTCT 2 phương kê 4 cạnh (Marcus &amp; TCVN 5574:2018)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 5574:2018 — Mục 8.1.2, Điều 10.3.3 (khoảng cách thép sàn) &amp; Marcus dải 1m</strong>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className="calc-action-btn phuluc-btn"
            onClick={() => setIsPhuLucOpen(true)}
            disabled={!result.valid}
            title="Xem Thuyết minh & Phụ lục A4"
          >
            <FileText size={16} />
            <span>Xem Phụ lục A4</span>
          </button>
          <button
            type="button"
            className="calc-action-btn handoff-btn"
            onClick={() => setIsHandoffOpen(true)}
            disabled={!result.valid}
            title="Xuất Handoff JSON chuẩn SKILL_BRIDGE"
          >
            <Bot size={16} />
            <span>Handoff JSON</span>
          </button>
          <button
            type="button"
            className="calc-action-btn copy-btn"
            onClick={handleCopy}
            disabled={!result.valid}
            title="Sao chép kết quả"
          >
            {copied ? <Check size={16} color="var(--accent-green)" /> : <Copy size={16} />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '14px 0' }}>
        {/* Tier 1: Hình học ô sàn */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>1. Kích thước hình học Ô bản</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Nhịp L_x (m):</label>
              <input type="number" step="0.2" value={Lx} onChange={(e) => setLx(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Nhịp L_y (m):</label>
              <input type="number" step="0.2" value={Ly} onChange={(e) => setLy(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Chiều dày h (mm):</label>
              <input type="number" step="10" value={h} onChange={(e) => setH(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Lớp bảo vệ a (mm):</label>
              <input type="number" step="5" value={a} onChange={(e) => setA(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Tier 2: Vật liệu & Liên kết biên */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>2. Cấp bền Vật liệu &amp; Liên kết</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Bê tông:</label>
              <select value={concrete} onChange={(e) => setConcrete(e.target.value)} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                <option value="B15">B15 (Rb=8.5)</option>
                <option value="B20">B20 (Rb=11.5)</option>
                <option value="B25">B25 (Rb=14.5)</option>
                <option value="B30">B30 (Rb=17.0)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Nhóm thép:</label>
              <select value={rebar} onChange={(e) => setRebar(e.target.value)} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                <option value="CB240T">CB240-T</option>
                <option value="CB300V">CB300-V</option>
                <option value="CB400V">CB400-V</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Điều kiện liên kết 4 cạnh:</label>
              <select value={boundary} onChange={(e) => setBoundary(e.target.value)} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                <option value="fixed_all">Ngàm 4 cạnh (Ô sàn giữa điển hình)</option>
                <option value="fixed_one">1 cạnh ngàm, 3 cạnh khớp (Ô sàn biên)</option>
                <option value="simply_supported">Khớp 4 cạnh (Ô sàn tự do kê tường)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tier 3: Tải trọng sàn */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>3. Tải trọng tác dụng (kN/m²)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tĩnh tải g_dl:</span>
              <input type="number" step="0.2" value={gdl} onChange={(e) => setGdl(Number(e.target.value))} style={{ width: '110px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Hoạt tải q_ll:</span>
              <input type="number" step="0.2" value={qll} onChange={(e) => setQll(Number(e.target.value))} style={{ width: '110px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Tải tính toán q_u:</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{result.qUls} kN/m²</span>
            </div>
          </div>
        </div>
      </div>

      {result.valid ? (
        <div style={{ padding: '16px', background: 'var(--bg-card-secondary, rgba(255,255,255,0.02))', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {/* STATS TILES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Thép Nhịp Ngắn (L1 = {result.L1}m)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
                Bụng: {result.As1Pos} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>mm²/m</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Gối: {result.As1Neg} mm²/m | M_pos = {result.M1Pos} kNm
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Thép Nhịp Dài (L2 = {result.L2}m)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
                Bụng: {result.As2Pos} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>mm²/m</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Gối: {result.As2Neg} mm²/m | M_pos = {result.M2Pos} kNm
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kiểm tra Võng f (SLS)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: result.etaDeflection <= 1.0 ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px' }}>
                {result.fCalc} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/ {result.fAllow} mm</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                η_võng = {result.etaDeflection} (L/250)
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hệ số sử dụng η</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.utilization.badgeColor || 'var(--text-primary)', marginTop: '4px' }}>
                η = {result.utilization.eta}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {result.utilization.icon} {result.utilization.label}
              </div>
            </div>
          </div>

          {/* BẢNG CHỌN & KIỂM TRA THÉP SÀN THỰC TẾ 4 VỊ TRÍ */}
          <div style={{ marginBottom: '16px', padding: '14px', background: 'rgba(59, 130, 246, 0.04)', borderRadius: '8px', border: '1px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '12px' }}>
              <Sparkles size={17} />
              <span>Gợi ý &amp; Chọn Cốt thép Ô Bản Sàn Thực tế (TCVN 5574:2018 Điều 10.3.3)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {/* Vị trí 1: Bụng nhịp ngắn */}
              <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  1. Bụng nhịp ngắn (L1 = {result.L1}m)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Yêu cầu: <strong>{result.As1Pos} mm²/m</strong> (M = {result.M1Pos} kNm)
                </div>
                {/* Gợi ý */}
                {result.slabSuggestions?.pos1?.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {result.slabSuggestions.pos1.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setDia1Pos(sug.dia); setS1Pos(sug.spacing); }}
                        className="spec-badge"
                        style={{
                          cursor: 'pointer',
                          padding: '2px 6px',
                          fontSize: '0.72rem',
                          background: dia1Pos === sug.dia && s1Pos === sug.spacing ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                          color: dia1Pos === sug.dia && s1Pos === sug.spacing ? '#fff' : 'var(--text-primary)',
                        }}
                      >
                        {sug.label} ({sug.areaMm2})
                      </button>
                    ))}
                  </div>
                )}
                {/* Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <select value={dia1Pos} onChange={(e) => setDia1Pos(Number(e.target.value))} className="calc-select" style={{ padding: '4px 6px', fontSize: '0.78rem' }}>
                    {COMMERCIAL_SLAB_REBAR_DIAMETERS.map((d) => (<option key={d} value={d}>Ø{d}</option>))}
                  </select>
                  <select value={s1Pos} onChange={(e) => setS1Pos(Number(e.target.value))} className="calc-select" style={{ padding: '4px 6px', fontSize: '0.78rem' }}>
                    {COMMERCIAL_SLAB_SPACINGS.map((s) => (<option key={s} value={s}>a{s}</option>))}
                  </select>
                </div>
                {/* Kết quả */}
                {result.providedSlabRebars?.pos1 && (
                  <div style={{ marginTop: '6px', fontSize: '0.76rem', color: result.providedSlabRebars.pos1.status === 'PASS' ? '#10b981' : '#ef4444' }}>
                    Ø{dia1Pos}a{s1Pos}: {result.providedSlabRebars.pos1.AsProvMm2} mm²/m ({result.providedSlabRebars.pos1.deltaPct > 0 ? `+${result.providedSlabRebars.pos1.deltaPct}%` : `${result.providedSlabRebars.pos1.deltaPct}%`}) — {result.providedSlabRebars.pos1.spacingOk ? 'ĐẠT' : 'Bước thép không hợp lệ'}
                  </div>
                )}
              </div>

              {/* Vị trí 2: Gối nhịp ngắn */}
              <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  2. Gối nhịp ngắn (L1 = {result.L1}m)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Yêu cầu: <strong>{result.As1Neg} mm²/m</strong> (M = {result.M1Neg} kNm)
                </div>
                {result.slabSuggestions?.neg1?.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {result.slabSuggestions.neg1.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setDia1Neg(sug.dia); setS1Neg(sug.spacing); }}
                        className="spec-badge"
                        style={{
                          cursor: 'pointer',
                          padding: '2px 6px',
                          fontSize: '0.72rem',
                          background: dia1Neg === sug.dia && s1Neg === sug.spacing ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                          color: dia1Neg === sug.dia && s1Neg === sug.spacing ? '#fff' : 'var(--text-primary)',
                        }}
                      >
                        {sug.label} ({sug.areaMm2})
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <select value={dia1Neg} onChange={(e) => setDia1Neg(Number(e.target.value))} className="calc-select" style={{ padding: '4px 6px', fontSize: '0.78rem' }}>
                    {COMMERCIAL_SLAB_REBAR_DIAMETERS.map((d) => (<option key={d} value={d}>Ø{d}</option>))}
                  </select>
                  <select value={s1Neg} onChange={(e) => setS1Neg(Number(e.target.value))} className="calc-select" style={{ padding: '4px 6px', fontSize: '0.78rem' }}>
                    {COMMERCIAL_SLAB_SPACINGS.map((s) => (<option key={s} value={s}>a{s}</option>))}
                  </select>
                </div>
                {result.providedSlabRebars?.neg1 && (
                  <div style={{ marginTop: '6px', fontSize: '0.76rem', color: result.providedSlabRebars.neg1.status === 'PASS' ? '#10b981' : '#ef4444' }}>
                    Ø{dia1Neg}a{s1Neg}: {result.providedSlabRebars.neg1.AsProvMm2} mm²/m ({result.providedSlabRebars.neg1.deltaPct > 0 ? `+${result.providedSlabRebars.neg1.deltaPct}%` : `${result.providedSlabRebars.neg1.deltaPct}%`}) — {result.providedSlabRebars.neg1.spacingOk ? 'ĐẠT' : 'Bước thép không hợp lệ'}
                  </div>
                )}
              </div>

              {/* Vị trí 3: Bụng nhịp dài */}
              <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  3. Bụng nhịp dài (L2 = {result.L2}m)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Yêu cầu: <strong>{result.As2Pos} mm²/m</strong> (M = {result.M2Pos} kNm)
                </div>
                {result.slabSuggestions?.pos2?.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {result.slabSuggestions.pos2.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setDia2Pos(sug.dia); setS2Pos(sug.spacing); }}
                        className="spec-badge"
                        style={{
                          cursor: 'pointer',
                          padding: '2px 6px',
                          fontSize: '0.72rem',
                          background: dia2Pos === sug.dia && s2Pos === sug.spacing ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                          color: dia2Pos === sug.dia && s2Pos === sug.spacing ? '#fff' : 'var(--text-primary)',
                        }}
                      >
                        {sug.label} ({sug.areaMm2})
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <select value={dia2Pos} onChange={(e) => setDia2Pos(Number(e.target.value))} className="calc-select" style={{ padding: '4px 6px', fontSize: '0.78rem' }}>
                    {COMMERCIAL_SLAB_REBAR_DIAMETERS.map((d) => (<option key={d} value={d}>Ø{d}</option>))}
                  </select>
                  <select value={s2Pos} onChange={(e) => setS2Pos(Number(e.target.value))} className="calc-select" style={{ padding: '4px 6px', fontSize: '0.78rem' }}>
                    {COMMERCIAL_SLAB_SPACINGS.map((s) => (<option key={s} value={s}>a{s}</option>))}
                  </select>
                </div>
                {result.providedSlabRebars?.pos2 && (
                  <div style={{ marginTop: '6px', fontSize: '0.76rem', color: result.providedSlabRebars.pos2.status === 'PASS' ? '#10b981' : '#ef4444' }}>
                    Ø{dia2Pos}a{s2Pos}: {result.providedSlabRebars.pos2.AsProvMm2} mm²/m ({result.providedSlabRebars.pos2.deltaPct > 0 ? `+${result.providedSlabRebars.pos2.deltaPct}%` : `${result.providedSlabRebars.pos2.deltaPct}%`}) — {result.providedSlabRebars.pos2.spacingOk ? 'ĐẠT' : 'Bước thép không hợp lệ'}
                  </div>
                )}
              </div>

              {/* Vị trí 4: Gối nhịp dài */}
              <div style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  4. Gối nhịp dài (L2 = {result.L2}m)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Yêu cầu: <strong>{result.As2Neg} mm²/m</strong> (M = {result.M2Neg} kNm)
                </div>
                {result.slabSuggestions?.neg2?.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {result.slabSuggestions.neg2.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setDia2Neg(sug.dia); setS2Neg(sug.spacing); }}
                        className="spec-badge"
                        style={{
                          cursor: 'pointer',
                          padding: '2px 6px',
                          fontSize: '0.72rem',
                          background: dia2Neg === sug.dia && s2Neg === sug.spacing ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                          color: dia2Neg === sug.dia && s2Neg === sug.spacing ? '#fff' : 'var(--text-primary)',
                        }}
                      >
                        {sug.label} ({sug.areaMm2})
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <select value={dia2Neg} onChange={(e) => setDia2Neg(Number(e.target.value))} className="calc-select" style={{ padding: '4px 6px', fontSize: '0.78rem' }}>
                    {COMMERCIAL_SLAB_REBAR_DIAMETERS.map((d) => (<option key={d} value={d}>Ø{d}</option>))}
                  </select>
                  <select value={s2Neg} onChange={(e) => setS2Neg(Number(e.target.value))} className="calc-select" style={{ padding: '4px 6px', fontSize: '0.78rem' }}>
                    {COMMERCIAL_SLAB_SPACINGS.map((s) => (<option key={s} value={s}>a{s}</option>))}
                  </select>
                </div>
                {result.providedSlabRebars?.neg2 && (
                  <div style={{ marginTop: '6px', fontSize: '0.76rem', color: result.providedSlabRebars.neg2.status === 'PASS' ? '#10b981' : '#ef4444' }}>
                    Ø{dia2Neg}a{s2Neg}: {result.providedSlabRebars.neg2.AsProvMm2} mm²/m ({result.providedSlabRebars.neg2.deltaPct > 0 ? `+${result.providedSlabRebars.neg2.deltaPct}%` : `${result.providedSlabRebars.neg2.deltaPct}%`}) — {result.providedSlabRebars.neg2.spacingOk ? 'ĐẠT' : 'Bước thép không hợp lệ'}
                  </div>
                )}
              </div>
            </div>

            {/* Nhận xét kỹ thuật thép sàn */}
            <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid #10b981' }}>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-success)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <CheckCircle size={15} />
                <span>Kiểm soát Nứt &amp; Bước thép sàn (TCVN 5574:2018 Điều 10.3.3):</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Khoảng cách tối đa giữa các thanh cốt thép sàn chịu lực: [a<sub>max</sub> = {Math.min(1.5 * h, h <= 150 ? 200 : 300)} mm]. Khoảng cách tối thiểu a ≥ 70 mm. Việc bố trí các bước thép a120 – a150 giúp phân bố đều nội lực và khống chế bề rộng khe nứt nhiệt ẩm SLS hiệu quả.
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Trình tự tính toán &amp; kiểm chứng kỹ thuật:
            </div>
            <ol style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
              {result.steps.map((step, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '6px', color: 'var(--accent-red)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertTriangle size={18} />
          <span>{result.errors.join('; ')}</span>
        </div>
      )}

      {phuLucData && <PhuLucCalculationModal isOpen={isPhuLucOpen} onClose={() => setIsPhuLucOpen(false)} phuLucData={phuLucData} />}
      {handoffData && <HandoffModal isOpen={isHandoffOpen} onClose={() => setIsHandoffOpen(false)} data={handoffData} />}
    </div>
  );
}
