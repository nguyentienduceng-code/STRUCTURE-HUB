import { useState } from 'react';
import {
  TrendingUp,
  FileText,
  Copy,
  Check,
  AlertTriangle,
  Bot,
} from 'lucide-react';
import {
  calculateLoadCombination,
  exportHandoffJSON,
  LOAD_COMBINATION_FACTORS_TCVN2737,
} from '../../services/calculatorEngines';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';
import { generatePhuLucData } from '../../services/phuLucGenerator';

export default function CalcLoadCombination() {
  const [Gk, setGk] = useState(10);
  const [Qk, setQk] = useState(5);
  const [Wk, setWk] = useState(2);
  const [Ek, setEk] = useState(0);
  const [capacity, setCapacity] = useState('');
  const [material, setMaterial] = useState('btct');
  const [includeSeismic, setIncludeSeismic] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateLoadCombination({
    Gk, Qk, Wk, Ek,
    capacity: capacity === '' ? null : capacity,
    material, includeSeismic,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== TỔ HỢP TẢI TRỌNG ULS/SLS + ENVELOPE (${result.standardRef}) ===`,
      `- Đầu vào (kN tại tiết diện): G=${Gk}, Q=${Qk}, W=${Wk}, E=${Ek}`,
      `- Vật liệu: ${material === 'thep' ? 'Thép (γ_G=1.05)' : 'BTCT (γ_G=1.15)'}`,
      ...result.combinations.map((c) => `- ${c.name}: ${c.formula} = ${c.value} kN`),
      `=> ENVELOPE: max = ${result.envelope.max} kN (${result.envelope.governing}), min = ${result.envelope.min} kN`,
      result.utilization.eta !== null
        ? `=> η = M_env/[M_d] = ${result.utilization.eta} (${result.utilization.icon} ${result.utilization.label})`
        : '=> Chưa nhập [M_d] → chưa đánh giá η',
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
        'loadcombo',
        { Gk, Qk, Wk, Ek, capacity, material, includeSeismic },
        result
      )
    : null;

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 8: Tổ hợp Tải trọng ULS/SLS & Envelope (A4)',
        standard: result.standardRef,
        inputs: { Gk, Qk, Wk, Ek, material, includeSeismic, capacity: capacity === '' ? null : Number(capacity) },
        outputs: {
          combinations: result.combinations.map((c) => ({ id: c.id, value: c.value })),
          envelope_max_kN: result.envelope.max,
          envelope_governing: result.envelope.governing,
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
          <TrendingUp size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 8: Trình Tạo Tổ hợp Tải trọng ULS/SLS &amp; Bao Nội lực Envelope
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 2737:2023 — Điều 5, 8 &amp; 10 (hệ số tổ hợp &psi;<sub>t</sub>, &psi;<sub>L</sub> đã khóa)</strong>
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
        <div className="calc-tier-title">1. Tầng Nhập liệu (nội lực chuẩn tại tiết diện kiểm tra)</div>
        <div className="calc-input-grid">
          <div className="calc-field">
            <label>Tĩnh tải chuẩn G<sub>k</sub> (kN)</label>
            <input type="number" min="0" value={Gk} onChange={(e) => setGk(e.target.value)} className="calc-input" />
          </div>
          <div className="calc-field">
            <label>Hoạt tải chuẩn Q<sub>k</sub> (kN)</label>
            <input type="number" min="0" value={Qk} onChange={(e) => setQk(e.target.value)} className="calc-input" />
          </div>
          <div className="calc-field">
            <label>Gió chuẩn W<sub>k</sub> (kN)</label>
            <input type="number" min="0" value={Wk} onChange={(e) => setWk(e.target.value)} className="calc-input" />
          </div>
          <div className="calc-field">
            <label>Động đất E (kN, tùy chọn)</label>
            <input type="number" min="0" value={Ek} onChange={(e) => setEk(e.target.value)} className="calc-input" />
          </div>
          <div className="calc-field">
            <label>Nhóm vật liệu (γ<sub>G</sub>)</label>
            <select value={material} onChange={(e) => setMaterial(e.target.value)} className="calc-select">
              <option value="btct">BTCT (γ_G = {LOAD_COMBINATION_FACTORS_TCVN2737.gammaG_btct})</option>
              <option value="thep">Thép (γ_G = 1.05)</option>
            </select>
          </div>
          <div className="calc-field">
            <label>Khả năng chịu tải [M<sub>d</sub>] (kN) — bỏ trống = chưa kết luận η</label>
            <input type="number" min="0" placeholder="vd: 18" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="calc-input" />
          </div>
          <div className="calc-field" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={includeSeismic} onChange={(e) => setIncludeSeismic(e.target.checked)} />
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Thêm tổ hợp đặc biệt (Động đất E)</span>
            </label>
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
          {/* TẦNG 2: TỔ HỢP */}
          <div className="calc-tier">
            <div className="calc-tier-title">2. Tầng Sinh Tổ hợp &amp; Trích Envelope</div>
            <div className="spec-table-container">
              <table className="spec-table" style={{ fontSize: '0.84rem', width: '100%' }}>
                <thead>
                  <tr style={{ background: '#002060', color: '#fff' }}>
                    <th>STT</th><th>Tổ hợp</th><th>Phương trình (đã thay số)</th><th style={{ textAlign: 'right' }}>Giá trị (kN)</th><th style={{ textAlign: 'center' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {result.combinations.map((c, i) => (
                    <tr key={c.id} style={c.id === result.envelope.governing ? { background: 'rgba(255, 242, 204, 0.25)' } : undefined}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{c.name}{c.id === result.envelope.governing ? ' ⭐' : ''}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{c.formula}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: c.id === result.envelope.governing ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{c.value}</td>
                      <td style={{ textAlign: 'center' }}>{c.id === result.envelope.governing ? <span className="spec-badge">CHI PHỐI</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TẦNG 3: η */}
          <div className="calc-tier" style={{ background: result.utilization.bg, borderColor: result.utilization.border }}>
            <div className="calc-tier-title" style={{ color: result.utilization.color }}>3. Tầng Đánh giá η = M<sub>ULS,max</sub> / [M<sub>d</sub>]</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.utilization.eta !== null
                  ? `${result.utilization.icon} η = ${result.utilization.eta.toFixed(4)} — ${result.utilization.label}`
                  : 'ℹ️ Đã sinh tổ hợp ULS/SLS — chưa so với khả năng chịu tải (chưa nhập [M_d])'}
              </div>
              <span className="spec-badge" style={{ borderColor: result.utilization.color, color: result.utilization.color }}>
                M_env = {result.envelope.max} kN ({result.envelope.governing})
              </span>
            </div>
            <div className="eta-progress-track">
              <div className="eta-progress-fill" style={{ width: `${result.utilization.percent}%`, background: result.utilization.color }} />
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <strong>Nhận xét:</strong> {result.utilization.policyAdvice}
            </div>
          </div>

          {/* TẦNG 4: XUẤT */}
          <div className="calc-tier">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div className="calc-tier-title" style={{ margin: 0 }}>4. Trình bày Bước tính &amp; Xuất Hồ sơ</div>
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
