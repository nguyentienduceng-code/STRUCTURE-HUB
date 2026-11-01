import { useState } from 'react';
import {
  Shield,
  FileText,
  Copy,
  Check,
  AlertTriangle,
  Bot,
} from 'lucide-react';
import {
  CONCRETE_GRADES_TCVN5574,
  REBAR_GRADES_TCVN5574,
  calculatePunchingShear,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';
import { generatePhuLucData } from '../../services/phuLucGenerator';

export default function CalcPunchingShear() {
  const [h, setH] = useState(200);
  const [a, setA] = useState(30);
  const [columnB, setColumnB] = useState(300);
  const [columnH, setColumnH] = useState(300);
  const [columnPosition, setColumnPosition] = useState('interior');
  const [F, setF] = useState(600);
  const [Mbx, setMbx] = useState(30);
  const [Mby, setMby] = useState(20);
  const [concrete, setConcrete] = useState('B25');
  const [stirrupDia, setStirrupDia] = useState('');
  const [stirrupLegs, setStirrupLegs] = useState('');
  const [stirrupSpacing, setStirrupSpacing] = useState('');
  const [stirrupRebar, setStirrupRebar] = useState('CB240T');
  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculatePunchingShear({
    h, a, columnB, columnH, columnPosition, F, Mbx, Mby, concrete,
    stirrupDia, stirrupLegs, stirrupSpacing, stirrupRebar,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== KIỂM TOÁN CHỌC THỦNG SÀN NẤM/ĐÀI CỌC (${result.standardRef}) ===`,
      `- Cột ${columnB}×${columnH} mm, vị trí ${columnPosition}, sàn h=${h} mm (h₀=${result.d} mm)`,
      `- Lực tập trung F=${F} kN, M_bx=${Mbx} kNm, M_by=${Mby} kNm`,
      `- Chu vi đường bao u_b = ${result.uB} mm; F_b,ult = ${result.Fult} kN`,
      `- η_chọc thủng = ${result.etaPunch}${result.hasStirrup ? ` (có cốt đai: F_ult,sw = ${result.FUltStirrup} kN, η = ${result.etaPunchStirrup})` : ''}`,
      `- Kết luận: ${result.utilization.icon} ${result.utilization.label}`,
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
        'punching',
        { h, a, columnB, columnH, columnPosition, F, Mbx, Mby, concrete, stirrupDia, stirrupLegs, stirrupSpacing, stirrupRebar },
        result
      )
    : null;

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 9: Chọc thủng Sàn nấm & Đài cọc (B4)',
        standard: result.standardRef,
        inputs: { h_mm: Number(h), a_mm: Number(a), columnB_mm: Number(columnB), columnH_mm: Number(columnH), column_position: columnPosition, F_kN: Number(F), M_bx_kNm: Number(Mbx), M_by_kNm: Number(Mby), concrete },
        outputs: {
          uB_mm: result.uB,
          Fult_kN: result.Fult,
          eta_punch: result.etaPunch,
          has_stirrups: result.hasStirrup,
          eta_punch_stirrup: result.etaPunchStirrup,
        },
        utilization: result.utilization,
        steps: result.steps,
      })
    : null;

  const positionLabel = { interior: 'Cột giữa (chôn trong sàn)', edge: 'Cột biên (1 mặt sát mép)', corner: 'Cột góc (2 mặt sát mép)' };

  return (
    <div className="calc-module-card card">
      <div className="calc-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 9: Kiểm toán Chọc thủng Sàn nấm &amp; Đài cọc (<var>F<sub>b</sub> &le; F<sub>b,ult</sub></var> + M<sub>x</sub>, M<sub>y</sub>)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 5574:2018 — Mục 8.1.6 (CT 194–205)</strong>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
            <label>Chiều cao sàn h / a (mm)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="number" min="100" max="1500" value={h} onChange={(e) => setH(e.target.value)} className="calc-input" />
              <input type="number" min="10" value={a} onChange={(e) => setA(e.target.value)} className="calc-input" />
            </div>
          </div>
          <div className="calc-field">
            <label>Kích thước cột b<sub>c</sub> × h<sub>c</sub> (mm)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="number" min="100" max="3000" value={columnB} onChange={(e) => setColumnB(e.target.value)} className="calc-input" />
              <input type="number" min="100" max="3000" value={columnH} onChange={(e) => setColumnH(e.target.value)} className="calc-input" />
            </div>
          </div>
          <div className="calc-field">
            <label>Vị trí cột</label>
            <select value={columnPosition} onChange={(e) => setColumnPosition(e.target.value)} className="calc-select">
              {Object.entries(positionLabel).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
            </select>
          </div>
          <div className="calc-field">
            <label>Bê tông</label>
            <select value={concrete} onChange={(e) => setConcrete(e.target.value)} className="calc-select">
              {Object.values(CONCRETE_GRADES_TCVN5574).map((c) => (
                <option key={c.code} value={c.code}>{c.code} (R_bt = {c.Rbt} MPa)</option>
              ))}
            </select>
          </div>
          <div className="calc-field">
            <label>Nội lực tại cột (F, M<sub>x</sub>, M<sub>y</sub>)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <input type="number" min="0" value={F} onChange={(e) => setF(e.target.value)} className="calc-input" />
              <input type="number" value={Mbx} onChange={(e) => setMbx(e.target.value)} className="calc-input" />
              <input type="number" value={Mby} onChange={(e) => setMby(e.target.value)} className="calc-input" />
            </div>
          </div>
          <div className="calc-field">
            <label>Cốt đai chống chọc thủng (tuỳ chọn)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr 1fr 1fr', gap: '8px' }}>
              <select value={stirrupRebar} onChange={(e) => setStirrupRebar(e.target.value)} className="calc-select">
                {Object.values(REBAR_GRADES_TCVN5574).map((r) => (
                  <option key={r.code} value={r.code}>{r.code}</option>
                ))}
              </select>
              <input type="number" min="4" max="25" placeholder="Ø" value={stirrupDia} onChange={(e) => setStirrupDia(e.target.value)} className="calc-input" />
              <input type="number" min="1" max="6" placeholder="Nhánh" value={stirrupLegs} onChange={(e) => setStirrupLegs(e.target.value)} className="calc-input" />
              <input type="number" min="50" max="300" placeholder="Bước s" value={stirrupSpacing} onChange={(e) => setStirrupSpacing(e.target.value)} className="calc-input" />
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

          {/* TẦNG 2: KẾT QUẢ */}
          <div className="calc-tier">
            <div className="calc-tier-title">2. Tầng Tính toán Thuần (Deterministic Math Engine)</div>
            <div className="calc-results-grid">
              <div className="calc-metric-box">
                <span className="calc-metric-label">Chu vi đường bao u<sub>b</sub></span>
                <strong className="calc-metric-value" style={{ color: '#60a5fa' }}>{result.uB} <small>mm</small></strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Vị trí {columnPosition} (h₀ = {result.d} mm)</small>
              </div>
              <div className="calc-metric-box">
                <span className="calc-metric-label">F<sub>b,ult</sub> (bê tông)</span>
                <strong className="calc-metric-value">{result.Fult} <small>kN</small></strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>R_bt·u_b·h₀</small>
              </div>
              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">η chọc thủng</span>
                <strong className="calc-metric-value" style={{ color: result.utilization.color }}>{result.etaPunch}</strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>η_F = {result.etaF} (capped M ≤ 0.5η_F)</small>
              </div>
              <div className="calc-metric-box">
                <span className="calc-metric-label">Khi có cốt đai</span>
                <strong className="calc-metric-value" style={{ color: result.hasStirrup ? 'var(--green)' : 'var(--text-muted)' }}>
                  {result.hasStirrup ? `η = ${result.etaPunchStirrup}` : 'Chưa nhập'}
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {result.hasStirrup ? `F_ult,sw = ${result.FUltStirrup} kN (≤ 2·F_ult)` : 'F_ult,sw = min(F_ult + F_sw, 2·F_ult)'}
                </small>
              </div>
            </div>
          </div>

          {/* TẦNG 3: η & POLICY */}
          <div className="calc-tier" style={{ background: result.utilization.bg, borderColor: result.utilization.border }}>
            <div className="calc-tier-title" style={{ color: result.utilization.color }}>3. Tầng Đánh giá η &amp; Policy Engine</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.utilization.icon} η = {result.utilization.eta.toFixed(3)} — <span style={{ color: result.utilization.color }}>{result.utilization.label}</span>
              </div>
              <span className="spec-badge" style={{ borderColor: result.utilization.color, color: result.utilization.color }}>
                {result.hasStirrup ? `F_tương đương / F_ult,sw` : 'F + min(M, 0.5F/F_ult)'}
              </span>
            </div>
            <div className="eta-progress-track">
              <div className="eta-progress-fill" style={{ width: `${result.utilization.percent}%`, background: result.utilization.color }} />
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <strong>Nhận xét kỹ thuật:</strong> {result.utilization.policyAdvice}
            </div>
          </div>

          {/* TẦNG 4: BƯỚC TÍNH & XUẤT */}
          <div className="calc-tier">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div className="calc-tier-title" style={{ margin: 0 }}>4. Tầng Trình bày Bước tính &amp; Xuất Hồ sơ</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" className="calc-action-btn" onClick={() => setIsHandoffOpen(true)}>
                  <Bot size={15} /> <span>Xuất Handoff JSON</span>
                </button>
                <button type="button" className="calc-action-btn copy-btn" onClick={handleCopy}>
                  {copied ? <Check size={15} /> : <Copy size={15} />} <span>{copied ? 'Đã sao chép!' : 'Sao chép kết quả'}</span>
                </button>
              </div>
            </div>
            <ol className="calc-steps-list">
              {result.steps.map((step, idx) => (<li key={idx}>{step}</li>))}
            </ol>
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
