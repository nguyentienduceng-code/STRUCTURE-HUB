import { useState } from 'react';
import {
  Grid,
  FileText,
  Copy,
  Check,
  Bot,
  AlertTriangle,
} from 'lucide-react';
import {
  calculateTwoWaySlab,
  exportHandoffJSON,
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

  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateTwoWaySlab({
    Lx, Ly, h, a, concrete, rebar, gdl, qll, boundary,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== Ô BẢN SÀN BTCT 2 PHƯƠNG KÊ 4 CẠNH (${result.standardRef}) ===`,
      `- Ô sàn: Lx = ${Lx} m, Ly = ${Ly} m, h = ${h} mm, Liên kết: ${boundary}`,
      `- Tải trọng: q_u = ${result.qUls} kN/m², q_s = ${result.qSls} kN/m²`,
      `=> Nhịp ngắn (L1 = ${result.L1}m): M_pos = ${result.M1Pos} kNm (As = ${result.As1Pos} mm²/m), M_neg = ${result.M1Neg} kNm (As = ${result.As1Neg} mm²/m)`,
      `=> Nhịp dài (L2 = ${result.L2}m): M_pos = ${result.M2Pos} kNm (As = ${result.As2Pos} mm²/m), M_neg = ${result.M2Neg} kNm (As = ${result.As2Neg} mm²/m)`,
      `=> Độ võng SLS: f = ${result.fCalc} mm ≤ [f] = ${result.fAllow} mm (η_f = ${result.etaDeflection})`,
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
    ? generatePhuLucData('twowayslab', { Lx, Ly, h, a, concrete, rebar, gdl, qll, boundary }, result)
    : null;

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 12: Ô bản sàn BTCT 2 phương Marcus',
        standard: result.standardRef,
        inputs: { Lx, Ly, h, a, concrete, rebar, gdl, qll, boundary },
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
              Mô-đun 2.4: Tính toán Cốt thép Ô bản Sàn BTCT 2 phương kê 4 cạnh (Marcus)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 5574:2018 — Mục 8.1.2 &amp; Bảng hệ số mômen đàn hồi Marcus dải bản 1m</strong>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Thép Nhịp Ngắn (L1 = {result.L1}m)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
                {result.As1Pos} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>mm²/m</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                M_pos = {result.M1Pos} kNm | Gối: {result.As1Neg} mm²/m
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Thép Nhịp Dài (L2 = {result.L2}m)</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
                {result.As2Pos} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>mm²/m</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                M_pos = {result.M2Pos} kNm | Gối: {result.As2Neg} mm²/m
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
