import { useState } from 'react';
import {
  Hammer,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Bot,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import {
  BOLT_DIAMETERS_TCVN5575,
  BOLT_GRADES_TCVN5575,
  PLATE_STEELS_TCVN5575,
  calculateBoltCapacityTCVN5575,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import { generatePhuLucData } from '../../services/phuLucGenerator';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';

export default function CalcBoltCapacity() {
  const [boltCode, setBoltCode] = useState('M20');
  const [grade, setGrade] = useState('8.8');
  const [nv, setNv] = useState(1);
  const [sumTMin, setSumTMin] = useState(12);
  const [plateSteel, setPlateSteel] = useState('S235_SS400');
  const [gammaB, setGammaB] = useState(0.90);
  const [shearForceV, setShearForceV] = useState(72);
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateBoltCapacityTCVN5575({
    boltCode,
    grade,
    nv: Number(nv),
    sumTMin,
    plateSteel,
    gammaC: 1.0,
    gammaB,
    shearForceV,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== BÁO CÁO KIỂM TRA BU LÔNG CƯỜNG ĐỘ CAO (${result.standardRef}) ===`,
      `- Bu lông: ${boltCode} (d = ${result.d} mm, A = ${result.A} mm²), Cấp bền ${grade} (f_vb = ${result.fvb} MPa)`,
      `- Số mặt cắt n_v = ${nv} | Bề dày ép mặt (∑t)_min = ${sumTMin} mm (f_cb = ${result.fcb} MPa)`,
      `=> Khả năng chịu cắt N_bs = ${result.Nbs} kN`,
      `=> Khả năng chịu ép mặt N_bp = ${result.Nbp} kN`,
      `=> Sức chịu lực thiết kế 1 bu lông N_b = min(N_bs, N_bp) = ${result.Nb} kN`,
      `=> Hệ số sử dụng η = V / N_b = ${result.utilization.eta.toFixed(3)} (${result.utilization.icon} ${result.utilization.label})`,
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

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 4: Kiểm tra Bu lông Cường độ cao',
        standard: result.standardRef,
        inputs: {
          boltCode,
          grade,
          nv: Number(nv),
          sumTMin: Number(sumTMin),
          plateSteel,
          gammaC: 1.0,
          gammaB: Number(gammaB),
          shearForceV: Number(shearForceV),
        },
        outputs: {
          d_mm: result.d,
          A_mm2: result.A,
          Abn_mm2: result.Abn,
          fvb_MPa: result.fvb,
          fcb_MPa: result.fcb,
          Nbs_kN: result.Nbs,
          Nbp_kN: result.Nbp,
          Nbt_kN: result.Nbt,
          Nb_kN: result.Nb,
          governing_mode: result.governingMode,
          shearForceV_kN: result.shearForceV,
          utilization_eta: result.utilization.eta,
        },
        utilization: result.utilization,
        steps: result.steps,
      })
    : null;

  const phuLucData = result.valid
    ? generatePhuLucData('bolt', { boltCode, grade, nv, sumTMin, plateSteel, gammaB, shearForceV }, result)
    : null;

  return (
    <div className="calc-module-card card">
      <div className="calc-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Hammer size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 4: Kiểm tra Bu lông Cường độ cao (<var>N<sub>bs</sub>, N<sub>bp</sub>, N<sub>b</sub></var>)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Căn cứ pháp lý: <strong>TCVN 5575:2024 — Điều 14.2, Bảng B.8 &amp; B.9 (Thay thế TCVN 5575:2012)</strong>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="spec-badge">TCVN 5575:2024 Điều 14.2</span>
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
        <div className="calc-tier-title">1. Tầng Nhập liệu &amp; Kiểm soát Tham số (Input UI Layer)</div>
        <div className="calc-input-grid">
          <div className="calc-field">
            <label>Đường kính Bu lông (Bảng B.9)</label>
            <select value={boltCode} onChange={(e) => setBoltCode(e.target.value)} className="calc-select">
              {Object.keys(BOLT_DIAMETERS_TCVN5575).map((bKey) => (
                <option key={bKey} value={bKey}>
                  {bKey} (d = {BOLT_DIAMETERS_TCVN5575[bKey].d} mm, A = {BOLT_DIAMETERS_TCVN5575[bKey].A} mm²)
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Cấp bền Bu lông (TCVN 5575:2024 Bảng B.8)</label>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className="calc-select">
              {Object.keys(BOLT_GRADES_TCVN5575).map((gKey) => (
                <option key={gKey} value={gKey}>
                  Cấp bền {gKey} (f_vb = {BOLT_GRADES_TCVN5575[gKey].fvb} MPa — {BOLT_GRADES_TCVN5575[gKey].astmEquiv})
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Số lượng mặt cắt tính toán <var>n<sub>v</sub></var></label>
            <select value={nv} onChange={(e) => setNv(Number(e.target.value))} className="calc-select">
              <option value="1">nv = 1 (Cắt đơn - 1 mặt phẳng trượt)</option>
              <option value="2">nv = 2 (Cắt đôi - 2 bản giằng kẹp 2 bên)</option>
              <option value="3">nv = 3</option>
              <option value="4">nv = 4</option>
            </select>
          </div>

          <div className="calc-field">
            <label>Mác thép bản mã / bản cánh ghép</label>
            <select value={plateSteel} onChange={(e) => setPlateSteel(e.target.value)} className="calc-select">
              {Object.keys(PLATE_STEELS_TCVN5575).map((pKey) => (
                <option key={pKey} value={pKey}>
                  {PLATE_STEELS_TCVN5575[pKey].name}
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Tổng bề dày nhỏ nhất bản thép ép mặt <var>(&sum;t)<sub>min</sub></var> (mm)</label>
            <input
              type="number"
              min="3"
              max="120"
              step="1"
              value={sumTMin}
              onChange={(e) => setSumTMin(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Hệ số điều kiện làm việc bu lông <var>&gamma;<sub>b</sub></var></label>
            <select
              value={String(gammaB)}
              onChange={(e) => setGammaB(parseFloat(e.target.value))}
              className="calc-select"
            >
              <option value="0.9">γ_b = 0.90 (Bu lông thô / tinh vừa, lỗ đột)</option>
              <option value="1.0">γ_b = 1.00 (Bu lông tinh, lỗ khoan doa)</option>
              <option value="0.8">γ_b = 0.80 (Liên kết chịu tải trọng xung chấn)</option>
            </select>
          </div>

          <div className="calc-field">
            <label>Lực cắt tính toán tác dụng lên 1 bu lông <var>V</var> (kN)</label>
            <input
              type="number"
              min="1"
              max="1000"
              step="1"
              value={shearForceV}
              onChange={(e) => setShearForceV(e.target.value)}
              className="calc-input"
            />
          </div>
        </div>
      </div>

      {!result.valid ? (
        <div className="alert-box" style={{ borderColor: 'var(--red)', background: 'rgba(239,68,68,0.1)' }}>
          <div className="alert-box-title" style={{ color: 'var(--red)' }}>
            <AlertTriangle size={18} /> Lỗi dữ liệu đầu vào:
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-danger)' }}>
            {result.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {/* TẦNG 2: KẾT QUẢ TÍNH TOÁN THUẦN */}
          <div className="calc-tier">
            <div className="calc-tier-title">2. Tầng Tính toán Thuần (Deterministic Math Engine)</div>
            <div className="calc-results-grid">
              <div className="calc-metric-box">
                <span className="calc-metric-label">Khả năng chịu cắt <var>N<sub>bs</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-primary)' }}>
                  {result.Nbs.toFixed(2)} <small>kN</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  n_v = {nv}, f_vb = {result.fvb} MPa
                </small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Khả năng chịu ép mặt <var>N<sub>bp</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-primary)' }}>
                  {result.Nbp.toFixed(2)} <small>kN</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  d = {result.d} mm, ∑t = {sumTMin} mm, f_cb = {result.fcb} MPa
                </small>
              </div>

              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">Thiết kế 1 bu lông <var>N<sub>b</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-gold)' }}>
                  {result.Nb.toFixed(2)} <small>kN</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {result.governingMode}
                </small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Khả năng chịu kéo <var>N<sub>bt</sub></var></span>
                <strong className="calc-metric-value">
                  {result.Nbt.toFixed(2)} <small>kN</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  A_bn = {result.Abn} mm² (Tham khảo)
                </small>
              </div>
            </div>
          </div>

          {/* TẦNG 3: ĐÁNH GIÁ CHỈ SỐ SỬ DỤNG η & POLICY ENGINE */}
          <div
            className="calc-tier"
            style={{
              background: result.utilization.bg,
              borderColor: result.utilization.border,
            }}
          >
            <div className="calc-tier-title" style={{ color: result.utilization.color }}>
              3. Tầng Đánh giá Hệ số Sử dụng &eta; = V / N_b
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.utilization.icon} &eta; = {result.utilization.eta.toFixed(3)} ({(result.utilization.eta * 100).toFixed(1)}%) —{' '}
                <span style={{ color: result.utilization.color }}>{result.utilization.label}</span>
              </div>
              <span className="spec-badge" style={{ borderColor: result.utilization.color, color: result.utilization.color }}>
                V = {result.shearForceV} / N_b = {result.Nb} kN
              </span>
            </div>
            <div className="eta-progress-track">
              <div
                className="eta-progress-fill"
                style={{
                  width: `${result.utilization.percent}%`,
                  background: result.utilization.color,
                }}
              />
            </div>

            {/* GỢI Ý VALUE ENGINEERING HOẶC CẢNH BÁO AN TOÀN */}
            {result.utilization.eta <= 0.70 && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid #10b981',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-success)' }}>
                  <Lightbulb size={16} />
                  <span>💡 Khuyến nghị Tối ưu Value Engineering (Cost_Estimator):</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Hệ số sử dụng bu lông &eta; = {result.utilization.eta.toFixed(2)} &le; 0.70 cho thấy liên kết đang dư nhiều sức chịu tải. Có thể xem xét giảm bớt số lượng bu lông trong liên kết, hoặc chuyển từ bu lông {boltCode} sang đường kính nhỏ hơn (hoặc giảm cấp bền 10.9 xuống 8.8) để tiết kiệm chi phí phụ kiện và công gia công khoan lỗ.
                </div>
              </div>
            )}

            {result.utilization.eta > 1.00 && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid #ef4444',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-danger)' }}>
                  <ShieldAlert size={16} />
                  <span>⚠️ Cảnh báo An toàn &amp; Khắc phục (Policy Engine):</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Lực cắt tác dụng <var>V</var> = {shearForceV} kN vượt sức chịu lực thiết kế của 1 bu lông (<var>N<sub>b</sub></var> = {result.Nb} kN, &eta; = {result.utilization.eta.toFixed(2)}). Khuyến nghị: (1) Tăng số lượng bu lông trong nút khung; (2) Tăng đường kính bu lông lên cấp tiếp theo; hoặc (3) Tăng bề dày bản ghép <var>(&sum;t)<sub>min</sub></var> nếu phá hoại do ép mặt chi phối.
                </div>
              </div>
            )}
          </div>

          {/* TẦNG 4: BƯỚC TÍNH CHI TIẾT & XUẤT BÁO CÁO */}
          <div className="calc-tier">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div className="calc-tier-title" style={{ margin: 0 }}>
                4. Tầng Trình bày Bước tính Giải tích &amp; Xuất Hồ sơ Phụ lục
              </div>
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
                <button
                  type="button"
                  className="calc-action-btn"
                  onClick={() => setIsHandoffOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
                    borderColor: 'rgba(168, 85, 247, 0.4)',
                    color: 'var(--accent-secondary)',
                    fontWeight: 600,
                  }}
                >
                  <Bot size={15} />
                  <span>Xuất Handoff JSON</span>
                </button>
                <button type="button" className="calc-action-btn copy-btn" onClick={handleCopy}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép kết quả'}</span>
                </button>
                <button type="button" className="calc-action-btn" onClick={() => setShowSummary(!showSummary)}>
                  <FileText size={15} />
                  <span>{showSummary ? 'Ẩn tóm tắt' : 'Bảng tóm tắt'}</span>
                </button>
              </div>
            </div>

            {/* TRÌNH BÀY BƯỚC TÍNH NÂNG CẤP VỚI FONT KỸ THUẬT */}
            <ol className="calc-steps-list">
              {result.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>

            {showSummary && (
              <div style={{ marginTop: '16px' }}>
                <div className="spec-table-container">
                  <table className="spec-table" style={{ fontSize: '0.84rem', width: '100%' }}>
                    <thead>
                      <tr style={{ background: '#002060', color: '#fff' }}>
                        <th>Hạng mục kiểm toán</th>
                        <th style={{ textAlign: 'center' }}>Ký hiệu</th>
                        <th style={{ textAlign: 'right' }}>Khả năng chịu lực</th>
                        <th style={{ textAlign: 'right' }}>Lực tác dụng V</th>
                        <th style={{ textAlign: 'center' }}>Chỉ số η</th>
                        <th style={{ textAlign: 'center' }}>Kết luận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Khả năng chịu cắt</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>N_bs</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.Nbs} kN</td>
                        <td style={{ textAlign: 'right' }}>{shearForceV} kN</td>
                        <td style={{ textAlign: 'center' }}>{(shearForceV / result.Nbs).toFixed(3)}</td>
                        <td style={{ textAlign: 'center', color: result.Nbs >= shearForceV ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                          {result.Nbs >= shearForceV ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                        </td>
                      </tr>
                      <tr>
                        <td>Khả năng chịu ép mặt</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>N_bp</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.Nbp} kN</td>
                        <td style={{ textAlign: 'right' }}>{shearForceV} kN</td>
                        <td style={{ textAlign: 'center' }}>{(shearForceV / result.Nbp).toFixed(3)}</td>
                        <td style={{ textAlign: 'center', color: result.Nbp >= shearForceV ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                          {result.Nbp >= shearForceV ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                        </td>
                      </tr>
                      <tr style={{ background: 'rgba(255, 242, 204, 0.25)' }}>
                        <td style={{ fontWeight: 700 }}>Thiết kế bu lông (Chi phối: {result.governingMode})</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 700 }}>N_b</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>{result.Nb} kN</td>
                        <td style={{ textAlign: 'right' }}>{shearForceV} kN</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{result.utilization.eta.toFixed(3)}</td>
                        <td style={{ textAlign: 'center', color: result.utilization.color, fontWeight: 700 }}>
                          {result.utilization.passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* MODAL XUẤT HANDOFF JSON */}
      <HandoffModal
        isOpen={isHandoffOpen}
        onClose={() => setIsHandoffOpen(false)}
        data={handoffData}
      />

      {/* MODAL THUYẾT MINH PHỤ LỤC TÍNH TOÁN SKILL_PHULUC */}
      <PhuLucCalculationModal
        isOpen={isPhuLucOpen}
        onClose={() => setIsPhuLucOpen(false)}
        phuLucData={phuLucData}
      />
    </div>
  );
}
