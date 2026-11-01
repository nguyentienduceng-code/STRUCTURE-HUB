import { useState } from 'react';
import {
  Building2,
  FileText,
  Copy,
  Check,
  Bot,
  AlertTriangle,
} from 'lucide-react';
import {
  calculateRCColumnBiaxial,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';
import { generatePhuLucData } from '../../services/phuLucGenerator';

export default function CalcRCColumn() {
  const [b, setB] = useState(400);
  const [h, setH] = useState(400);
  const [a, setA] = useState(40);
  const [L, setL] = useState(3.6);
  const [concrete, setConcrete] = useState('B25');
  const [rebar, setRebar] = useState('CB400V');
  const [Ned, setNed] = useState(1200);
  const [Medx, setMedx] = useState(80);
  const [Medy, setMedy] = useState(60);
  const [rebarDia, setRebarDia] = useState(20);
  const [rebarCount, setRebarCount] = useState(8);

  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateRCColumnBiaxial({
    b, h, a, L, concrete, rebar, Ned, Medx, Medy, rebarDia, rebarCount,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== CỘT BTCT NÉN LỆCH TÂM XIÊN BRESLER (${result.standardRef}) ===`,
      `- Tiết diện: ${b}x${h} mm, H_tầng = ${L} m, Bê tông: ${concrete}, Thép: ${rebar}`,
      `- Bố trí thép: ${rebarCount}Ø${rebarDia} (As = ${result.AsTot} mm², μ = ${result.mu}%)`,
      `- Nội lực: N = ${Ned} kN, Mx = ${Medx} kNm, My = ${Medy} kNm`,
      `=> Sức kháng: N_Rd,0 = ${result.NRd0} kN, N_Rd,x = ${result.NRdx} kN, N_Rd,y = ${result.NRdy} kN`,
      `=> N_Rd,Bresler = ${result.NRdBresler} kN (η = ${result.utilization.eta} -> ${result.utilization.icon} ${result.utilization.label})`,
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
    ? generatePhuLucData('rccolumn', { b, h, a, L, concrete, rebar, Ned, Medx, Medy, rebarDia, rebarCount }, result)
    : null;

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 11: Cột BTCT Nén lệch tâm xiên Bresler',
        standard: result.standardRef,
        inputs: { b, h, a, L, concrete, rebar, Ned, Medx, Medy, rebarDia, rebarCount },
        outputs: {
          AsTot_mm2: result.AsTot,
          mu_percent: result.mu,
          NRd0_kN: result.NRd0,
          NRdx_kN: result.NRdx,
          NRdy_kN: result.NRdy,
          NRdBresler_kN: result.NRdBresler,
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
          <Building2 size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 2.3: Thiết kế Cột BTCT Nén Lệch tâm xiên (Công thức tương tác Bresler)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 5574:2018 — Mục 8.1.4, Phụ lục E (Uốn dọc η) &amp; Xấp xỉ tương tác Bresler</strong>
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
        {/* Tier 1: Tiết diện & Chiều dài */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>1. Kích thước Cột &amp; Chiều dài tính toán</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Bề rộng b (mm):</label>
              <input type="number" step="50" value={b} onChange={(e) => setB(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Chiều cao h (mm):</label>
              <input type="number" step="50" value={h} onChange={(e) => setH(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Chiều cao tầng L (m):</label>
              <input type="number" step="0.1" value={L} onChange={(e) => setL(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Lớp bảo vệ a (mm):</label>
              <input type="number" step="5" value={a} onChange={(e) => setA(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Tier 2: Vật liệu & Bố trí cốt thép */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>2. Cấp bền Bê tông &amp; Thép bố trí</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Bê tông:</label>
              <select value={concrete} onChange={(e) => setConcrete(e.target.value)} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                <option value="B15">B15 (Rb=8.5)</option>
                <option value="B20">B20 (Rb=11.5)</option>
                <option value="B25">B25 (Rb=14.5)</option>
                <option value="B30">B30 (Rb=17.0)</option>
                <option value="B35">B35 (Rb=19.5)</option>
                <option value="B40">B40 (Rb=22.0)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Nhóm thép:</label>
              <select value={rebar} onChange={(e) => setRebar(e.target.value)} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                <option value="CB240T">CB240-T</option>
                <option value="CB300V">CB300-V</option>
                <option value="CB400V">CB400-V</option>
                <option value="CB500V">CB500-V</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Đường kính Ø (mm):</label>
              <select value={rebarDia} onChange={(e) => setRebarDia(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                {[14, 16, 18, 20, 22, 25, 28, 32].map((d) => (
                  <option key={d} value={d}>Ø{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Số thanh n:</label>
              <input type="number" step="2" min="4" value={rebarCount} onChange={(e) => setRebarCount(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Tier 3: Nội lực ULS */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>3. Nội lực tính toán ULS</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Lực nén N (kN):</span>
              <input type="number" step="50" value={Ned} onChange={(e) => setNed(Number(e.target.value))} style={{ width: '110px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mômen M_x (kNm):</span>
              <input type="number" step="5" value={Medx} onChange={(e) => setMedx(Number(e.target.value))} style={{ width: '110px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mômen M_y (kNm):</span>
              <input type="number" step="5" value={Medy} onChange={(e) => setMedy(Number(e.target.value))} style={{ width: '110px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>

      {result.valid ? (
        <div style={{ padding: '16px', background: 'var(--bg-card-secondary, rgba(255,255,255,0.02))', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sức kháng Bresler N_Rd</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
                {result.NRdBresler} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kN</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                N_Ed = {result.Ned} kN
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

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hàm lượng thép μ</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.mu >= 0.1 && result.mu <= 3.0 ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px' }}>
                {result.mu}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {result.rebarCount}Ø{result.rebarDia} (As = {result.AsTot} mm²)
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sức kháng đơn phương</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                X: {result.NRdx} kN | Y: {result.NRdy} kN
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Nén đúng tâm: {result.NRd0} kN
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
