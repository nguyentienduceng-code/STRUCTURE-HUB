import { useState } from 'react';
import {
  Hammer,
  FileText,
  Copy,
  Check,
  Bot,
  AlertTriangle,
} from 'lucide-react';
import {
  calculateSteelBeam,
  STEEL_PROFILES_I,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';
import { generatePhuLucData } from '../../services/phuLucGenerator';

export default function CalcSteelBeam() {
  const [profile, setProfile] = useState('I300x150x6.5x9');
  const [L, setL] = useState(6.0);
  const [steelGrade, setSteelGrade] = useState('SS400');
  const [q, setQ] = useState(25.0);
  const [Lcr, setLcr] = useState(6.0);
  const [hasDeckBracing, setHasDeckBracing] = useState(false);

  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateSteelBeam({
    profile, L, steelGrade, q, Lcr, hasDeckBracing,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== DẦM THÉP HÌNH CHỮ I & ỔN ĐỊNH LTB (${result.standardRef}) ===`,
      `- Tiết diện: ${result.profileName}, Nhịp L = ${L} m, Thép: ${steelGrade}`,
      `- Tải trọng: q = ${q} kN/m -> M_Ed = ${result.Med} kNm, V_Ed = ${result.Ved} kN`,
      `=> Bền uốn: M_c,Rd = ${result.McRd} kNm (η = ${result.etaFlex})`,
      `=> Bền cắt: V_c,Rd = ${result.VcRd} kN (η = ${result.etaShear})`,
      `=> Ổn định LTB: M_b,Rd = ${result.MbRd} kNm (χ_LT = ${result.chiLT})`,
      `=> Độ võng SLS: f = ${result.fCalc} mm ≤ [f] = ${result.fAllow} mm (η = ${result.etaDeflection})`,
      `=> Policy Engine: η = ${result.utilization.eta} (${result.utilization.icon} ${result.utilization.label})`,
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
    ? generatePhuLucData('steelbeam', { profile, L, steelGrade, q, Lcr, hasDeckBracing }, result)
    : null;

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 13: Dầm thép hình chữ I & Ổn định LTB',
        standard: result.standardRef,
        inputs: { profile, L, steelGrade, q, Lcr, hasDeckBracing },
        outputs: {
          Med_kNm: result.Med,
          Ved_kN: result.Ved,
          McRd_kNm: result.McRd,
          VcRd_kN: result.VcRd,
          MbRd_kNm: result.MbRd,
          fCalc_mm: result.fCalc,
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
          <Hammer size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 3.1: Kiểm toán Dầm Thép hình chữ I (Bền Uốn, Cắt &amp; Ổn định LTB)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 5575:2024 — Mục 8.1, 8.2 &amp; Phụ lục D (Mômen uốn xoắn tới hạn M_cr &amp; χ_LT)</strong>
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
        {/* Tier 1: Tiết diện & Mác thép */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>1. Tiết diện Định hình &amp; Mác thép</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Quy cách dầm I:</label>
              <select value={profile} onChange={(e) => setProfile(e.target.value)} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                {Object.entries(STEEL_PROFILES_I).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Mác thép kết cấu:</label>
              <select value={steelGrade} onChange={(e) => setSteelGrade(e.target.value)} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                <option value="SS400">SS400 / Q235 (fy = 235 MPa)</option>
                <option value="Q345">Q345 / S355 (fy = 345 MPa)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tier 2: Nhịp dầm & Giằng cánh nén */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>2. Chiều dài nhịp &amp; Giằng ổn định</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Nhịp dầm L (m):</label>
              <input type="number" step="0.5" value={L} onChange={(e) => setL(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Khoảng cách giằng L_cr (m):</label>
              <input type="number" step="0.5" value={Lcr} onChange={(e) => setLcr(Number(e.target.value))} disabled={hasDeckBracing} style={{ width: '100%', padding: '5px 8px', background: hasDeckBracing ? 'rgba(255,255,255,0.05)' : 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <input type="checkbox" id="deckBracing" checked={hasDeckBracing} onChange={(e) => setHasDeckBracing(e.target.checked)} />
              <label htmlFor="deckBracing" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Bản sàn BTCT / tôn deck giằng liên tục cánh nén (Không mất ổn định LTB)
              </label>
            </div>
          </div>
        </div>

        {/* Tier 3: Tải trọng tác dụng */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>3. Tải trọng tác dụng ULS</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tải phân bố q (kN/m):</span>
              <input type="number" step="2" value={q} onChange={(e) => setQ(Number(e.target.value))} style={{ width: '110px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Mômen uốn M_Ed:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{result.Med} kNm</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Lực cắt V_Ed:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{result.Ved} kN</span>
            </div>
          </div>
        </div>
      </div>

      {result.valid ? (
        <div style={{ padding: '16px', background: 'var(--bg-card-secondary, rgba(255,255,255,0.02))', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kháng uốn dầm M_b,Rd</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
                {result.MbRd} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kNm</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                M_c,Rd = {result.McRd} kNm (χ_LT = {result.chiLT})
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kháng cắt bản bụng V_c,Rd</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
                {result.VcRd} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kN</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                V_Ed = {result.Ved} kN (η_V = {result.etaShear})
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kiểm tra Võng SLS</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.etaDeflection <= 1.0 ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px' }}>
                {result.fCalc} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/ {result.fAllow} mm</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                [f] = L/400 (η_võng = {result.etaDeflection})
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

      {phuLucData && <PhuLucCalculationModal isOpen={isPhuLucOpen} onClose={() => setIsPhuLucOpen(false)} data={phuLucData} />}
      {handoffData && <HandoffModal isOpen={isHandoffOpen} onClose={() => setIsHandoffOpen(false)} handoffData={handoffData} />}
    </div>
  );
}
