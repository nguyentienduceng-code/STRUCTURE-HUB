import { useState } from 'react';
import {
  Compass,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Bot,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import {
  CONCRETE_GRADES_TCVN5574,
  REBAR_GRADES_TCVN5574,
  calculateAnchorageLapTCVN5574,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import { generatePhuLucData } from '../../services/phuLucGenerator';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';

const REBAR_DIAMETERS = [6, 8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40];

export default function CalcAnchorageLap() {
  const [rebarGrade, setRebarGrade] = useState('CB400V');
  const [concrete, setConcrete] = useState('B25');
  const [d, setD] = useState(20);
  const [stressState, setStressState] = useState('tension');
  const [anchorageType, setAnchorageType] = useState('straight');
  const [asReq, setAsReq] = useState(942);
  const [asProv, setAsProv] = useState(942);
  const [lapRatio, setLapRatio] = useState(50);
  const [actualLength, setActualLength] = useState(800);

  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateAnchorageLapTCVN5574({
    rebarGrade,
    concrete,
    d,
    stressState,
    anchorageType,
    asReq,
    asProv,
    lapRatio,
    actualLength,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== BÁO CÁO TÍNH CHIỀU DÀI NEO VÀ NỐI CHỒNG CỐT THÉP (${result.standardRef}) ===`,
      `- Cốt thép: ${rebarGrade} (d = ${d} mm, R_s = ${result.RsDesign} MPa) | Bê tông: ${concrete} (R_bt = ${result.Rbt} MPa)`,
      `- Trạng thái: Chịu ${stressState === 'compression' ? 'Nén' : 'Kéo'} | Dạng neo: ${anchorageType === 'hook_bend' ? 'Uốn móc/gập' : 'Thẳng'}`,
      `- Diện tích thép: A_s,req = ${asReq} mm² / A_s,prov = ${asProv} mm² (Tỷ số = ${result.areaRatio})`,
      `- Tỷ lệ nối tại 1 mặt cắt: ${lapRatio}% (alpha_lap = ${result.alphaLap})`,
      `- Cường độ bám dính tính toán: R_bond = ${result.Rbond} MPa (eta1 = ${result.eta1}, eta2 = ${result.eta2})`,
      `- Chiều dài neo cơ sở: L_0,an = ${result.L0an} mm (${result.L0anD}d)`,
      `- Chiều dài neo thiết kế: L_an = ${result.Lan} mm (${result.LanD}d)`,
      `- Chiều dài nối chồng thiết kế: L_lap = ${result.Llap} mm (${result.LlapD}d)`,
      `- Chiều dài bố trí thực tế: L_actual = ${actualLength} mm`,
      `- Đánh giá chỉ số sử dụng: eta = ${result.utilization.eta.toFixed(3)} (${result.utilization.icon} ${result.utilization.label})`,
      ...result.steps,
    ].join('\n');

    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error(err);
    }
  };

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 6: Tính Chiều dài Neo & Nối chồng Cốt thép',
        standard: result.standardRef,
        inputs: {
          rebarGrade,
          concrete,
          diameter_mm: Number(d),
          stress_state: stressState,
          anchorage_type: anchorageType,
          as_required_mm2: Number(asReq),
          as_provided_mm2: Number(asProv),
          lap_ratio_percent: Number(lapRatio),
          actual_length_mm: Number(actualLength),
        },
        outputs: {
          Rbond_MPa: result.Rbond,
          L0an_mm: result.L0an,
          L0an_d: result.L0anD,
          Lan_mm: result.Lan,
          Lan_d: result.LanD,
          Llap_mm: result.Llap,
          Llap_d: result.LlapD,
          actual_length_mm: result.actualLength,
          utilization_eta: result.utilization.eta,
        },
        utilization: result.utilization,
        steps: result.steps,
      })
    : null;

  const phuLucData = result.valid
    ? generatePhuLucData('anchorage', { rebarGrade, concrete, d, stressState, anchorageType, asReq, asProv, lapRatio, actualLength }, result)
    : null;

  return (
    <div className="calc-module-card card">
      <div className="calc-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Compass size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 6: Chiều dài Neo (<var>L<sub>an</sub></var>) &amp; Nối Chồng (<var>L<sub>lap</sub></var>) Cốt thép
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Căn cứ pháp lý: <strong>TCVN 5574:2018 — Mục 10.3.5 &amp; Mục 10.3.6 (Công thức 255 – 259)</strong>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="spec-badge">TCVN 5574:2018 Điều 10.3</span>
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
            <label>Cấp độ bền Bê tông (TCVN 5574:2018 Bảng 6)</label>
            <select
              value={concrete}
              onChange={(e) => setConcrete(e.target.value)}
              className="calc-select"
            >
              {Object.values(CONCRETE_GRADES_TCVN5574).map((cItem) => (
                <option key={cItem.code} value={cItem.code}>
                  {cItem.code} (≈ {cItem.macEquiv}) — R_bt = {cItem.Rbt} MPa
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Nhóm cốt thép (TCVN 5574:2018 Bảng 13)</label>
            <select
              value={rebarGrade}
              onChange={(e) => setRebarGrade(e.target.value)}
              className="calc-select"
            >
              {Object.values(REBAR_GRADES_TCVN5574).map((rItem) => (
                <option key={rItem.code} value={rItem.code}>
                  {rItem.code} ({rItem.type === 'deformed' ? 'Thép có gân' : 'Thép trơn'}, R_s = {rItem.Rs} MPa)
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Đường kính thanh cốt thép <var>d</var> (mm)</label>
            <select
              value={d}
              onChange={(e) => setD(Number(e.target.value))}
              className="calc-select"
            >
              {REBAR_DIAMETERS.map((dia) => (
                <option key={dia} value={dia}>
                  &Phi;{dia} (d = {dia} mm)
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Trạng thái chịu lực cốt thép</label>
            <select
              value={stressState}
              onChange={(e) => setStressState(e.target.value)}
              className="calc-select"
            >
              <option value="tension">Vùng Kéo (&alpha;_an = 1.0 hoặc 0.70)</option>
              <option value="compression">Vùng Nén (&alpha;_an = 0.75)</option>
            </select>
          </div>

          <div className="calc-field">
            <label>Dạng hình học đoạn neo</label>
            <select
              value={anchorageType}
              onChange={(e) => setAnchorageType(e.target.value)}
              className="calc-select"
              disabled={stressState === 'compression'}
            >
              <option value="straight">Neo thẳng (Thanh kéo &alpha;_an = 1.00)</option>
              <option value="hook_bend">Uốn móc / gập thanh neo (&alpha;_an = 0.70)</option>
            </select>
          </div>

          <div className="calc-field">
            <label>Tỷ lệ nối chồng tại 1 mặt cắt (%)</label>
            <select
              value={lapRatio}
              onChange={(e) => setLapRatio(Number(e.target.value))}
              className="calc-select"
            >
              <option value="25">&le; 25% tiết diện (&alpha;_lap = 1.20)</option>
              <option value="50">50% tiết diện (&alpha;_lap = 1.50 - Phổ biến nhất)</option>
              <option value="100">100% tiết diện (&alpha;_lap = 2.00 - Nối toàn bộ)</option>
            </select>
          </div>

          <div className="calc-field">
            <label>Diện tích yêu cầu <var>A<sub>s,req</sub></var> (mm²)</label>
            <input
              type="number"
              min="10"
              max="20000"
              step="10"
              value={asReq}
              onChange={(e) => setAsReq(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Diện tích thực tế <var>A<sub>s,prov</sub></var> (mm² &ge; A<sub>s,req</sub>)</label>
            <input
              type="number"
              min={asReq || 10}
              max="30000"
              step="10"
              value={asProv}
              onChange={(e) => setAsProv(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Chiều dài thực tế bố trí <var>L<sub>actual</sub></var> (mm)</label>
            <input
              type="number"
              min="100"
              max="5000"
              step="10"
              value={actualLength}
              onChange={(e) => setActualLength(e.target.value)}
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
                <span className="calc-metric-label">Cường độ bám dính <var>R<sub>bond</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-primary)' }}>
                  {result.Rbond} <small>MPa</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  &eta;₁ = {result.eta1}, &eta;₂ = {result.eta2}, R_bt = {result.Rbt} MPa
                </small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Chiều dài neo cơ sở <var>L<sub>0,an</sub></var></span>
                <strong className="calc-metric-value">
                  {result.L0an} <small>mm</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Tương đương <strong>{result.L0anD}d</strong> (CT 255)
                </small>
              </div>

              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">Chiều dài neo tính toán <var>L<sub>an</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-gold)' }}>
                  {result.Lan} <small>mm</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Tương đương <strong>{result.LanD}d</strong> (&alpha;_an = {result.alphaAn})
                </small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Chiều dài nối chồng <var>L<sub>lap</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--green)' }}>
                  {result.Llap} <small>mm</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Tương đương <strong>{result.LlapD}d</strong> (&alpha;_lap = {result.alphaLap})
                </small>
              </div>
            </div>

            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'var(--overlay-very-light)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span>
                • Tỷ số giảm diện tích cốt thép: <strong>A<sub>req</sub> / A<sub>prov</sub> = {result.areaRatio}</strong>
              </span>
              <span>
                • Chiều dài neo tối thiểu: <strong>L<sub>an,min</sub> = {Math.max(0.3 * result.L0an, 15 * d, 200).toFixed(0)} mm</strong>
              </span>
              <span>
                • Chiều dài nối chồng tối thiểu: <strong>L<sub>lap,min</sub> = {Math.max(0.4 * result.alphaLap * result.L0an, 20 * d, 250).toFixed(0)} mm</strong>
              </span>
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
              3. Tầng Đánh giá Hệ số Sử dụng &eta; = L_an / L_thực tế
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.utilization.icon} &eta; = {result.utilization.eta.toFixed(3)} ({(result.utilization.eta * 100).toFixed(1)}%) —{' '}
                <span style={{ color: result.utilization.color }}>{result.utilization.label}</span>
              </div>
              <span className="spec-badge" style={{ borderColor: result.utilization.color, color: result.utilization.color }}>
                L_an = {result.Lan} mm / L_bố trí = {result.actualLength} mm
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

            {/* GỢI Ý POLICY ENGINE / VALUE ENGINEERING */}
            {result.veAdvice && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background:
                    result.veAdvice.type === 'VE_OPTIMIZE'
                      ? 'rgba(16, 185, 129, 0.12)'
                      : 'rgba(239, 68, 68, 0.12)',
                  border: `1px solid ${
                    result.veAdvice.type === 'VE_OPTIMIZE' ? '#10b981' : '#ef4444'
                  }`,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: result.veAdvice.type === 'VE_OPTIMIZE' ? '#34d399' : '#f87171',
                  }}
                >
                  {result.veAdvice.type === 'VE_OPTIMIZE' ? <Lightbulb size={16} /> : <ShieldAlert size={16} />}
                  <span>{result.veAdvice.title}</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {result.veAdvice.message}
                </div>
              </div>
            )}
          </div>

          {/* TẦNG 4: BƯỚC TÍNH CHI TIẾT & XUẤT HANDOFF JSON */}
          <div className="calc-tier">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
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
                <button
                  type="button"
                  className="calc-action-btn"
                  onClick={() => setShowSummary(!showSummary)}
                >
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
                        <th style={{ textAlign: 'right' }}>Giá trị tính</th>
                        <th style={{ textAlign: 'right' }}>Quy đổi bội số</th>
                        <th style={{ textAlign: 'center' }}>Chỉ số η</th>
                        <th style={{ textAlign: 'center' }}>Kết luận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Cường độ bám dính</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>R_bond</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.Rbond} MPa</td>
                        <td style={{ textAlign: 'right' }}>η₁·η₂·R_bt</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>ĐẠT</td>
                      </tr>
                      <tr>
                        <td>Chiều dài neo cơ sở</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>L_0,an</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.L0an} mm</td>
                        <td style={{ textAlign: 'right' }}>{result.L0anD}d</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>ĐẠT</td>
                      </tr>
                      <tr>
                        <td>Chiều dài nối chồng</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>L_lap</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.Llap} mm</td>
                        <td style={{ textAlign: 'right' }}>{result.LlapD}d</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>ĐẠT</td>
                      </tr>
                      <tr style={{ background: 'rgba(255, 242, 204, 0.25)' }}>
                        <td style={{ fontWeight: 700 }}>Chiều dài neo yêu cầu</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 700 }}>L_an</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>{result.Lan} mm</td>
                        <td style={{ textAlign: 'right' }}>{result.LanD}d (Bố trí: {result.actualLength} mm)</td>
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
