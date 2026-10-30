import { useState } from 'react';
import {
  Layers,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Bot,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import {
  LIVE_LOAD_CATEGORIES,
  calculateLiveLoadReduction,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import { generatePhuLucData } from '../../services/phuLucGenerator';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';

export default function CalcLiveLoadReduction() {
  const [category, setCategory] = useState('office');
  const [area, setArea] = useState(54);
  const [floors, setFloors] = useState(6);
  const [clampLowerBound, setClampLowerBound] = useState(true);
  const [designCapacityPd, setDesignCapacityPd] = useState(2.60);
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateLiveLoadReduction({
    category,
    area,
    floors: Number(floors),
    clampLowerBound,
    designCapacityPd,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== BÁO CÁO CHIẾT GIẢM HOẠT TẢI SÀN (${result.standardRef}) ===`,
      `- Công năng: ${result.categoryName} (p_k = ${result.pk} kN/m², γ_f = ${result.gammaF})`,
      `- Diện tích chịu tải A = ${area} m² | Số tầng truyền tải n = ${floors}`,
      `=> Hệ số chiết giảm diện tích α_A = ${result.alphaA} (Giảm ${result.reductionPercentArea}%)`,
      `=> Hệ số chiết giảm số tầng α_n = ${result.alphaN} (Giảm ${result.reductionPercentColumn}%)`,
      `=> Hoạt tải thiết kế sàn sau giảm p_d,red(A) = ${result.pdReducedArea} kN/m²`,
      `=> Hoạt tải thiết kế cột sau giảm p_d,red(n) = ${result.pdReducedColumn} kN/m²`,
      `=> Hệ số sử dụng η = ${result.utilization.eta.toFixed(3)} (${result.utilization.icon} ${result.utilization.label})`,
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
        moduleName: 'Mô-đun 2: Chiết giảm Hoạt tải Sàn & Cột',
        standard: result.standardRef,
        inputs: {
          category,
          area_m2: Number(area),
          floors: Number(floors),
          clamp_lower_bound: clampLowerBound,
          design_capacity_pd: Number(designCapacityPd),
        },
        outputs: {
          pk_kNm2: result.pk,
          pd_unreduced: result.pdUnreduced,
          alpha_A: result.alphaA,
          alpha_n: result.alphaN,
          pd_reduced_area: result.pdReducedArea,
          pd_reduced_column: result.pdReducedColumn,
          reduction_percent_area: result.reductionPercentArea,
          reduction_percent_column: result.reductionPercentColumn,
          utilization_eta: result.utilization.eta,
        },
        utilization: result.utilization,
        steps: result.steps,
      })
    : null;

  const phuLucData = result.valid
    ? generatePhuLucData('liveload', { category, area, floors, clampLowerBound, designCapacityPd }, result)
    : null;

  return (
    <div className="calc-module-card card">
      <div className="calc-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 2: Chiết giảm Hoạt tải theo Diện tích (<var>&alpha;<sub>A</sub></var>) &amp; Số tầng (<var>&alpha;<sub>n</sub></var>)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Căn cứ pháp lý: <strong>TCVN 2737:2023 — Điều 8.3 &amp; Bảng 4</strong>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="spec-badge">TCVN 2737:2023 Điều 8.3</span>
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
            <label>Loại phòng / Công năng sử dụng (Bảng 4)</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="calc-select">
              {Object.keys(LIVE_LOAD_CATEGORIES).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {LIVE_LOAD_CATEGORIES[catKey].name} — p_k = {LIVE_LOAD_CATEGORIES[catKey].pk} kN/m²
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Diện tích truyền tải của bản sàn / dầm <var>A</var> (m²) [1 – 1000]</label>
            <input
              type="number"
              min="1"
              max="1000"
              step="1"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Số tầng truyền tải lên cột/móng <var>n</var> [1 – 100]</label>
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={floors}
              onChange={(e) => setFloors(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Sức chịu tải thiết kế kiểm tra <var>p<sub>d,allow</sub></var> (kN/m²)</label>
            <input
              type="number"
              min="0.5"
              max="50"
              step="0.1"
              value={designCapacityPd}
              onChange={(e) => setDesignCapacityPd(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }}>
              <input
                type="checkbox"
                checked={clampLowerBound}
                onChange={(e) => setClampLowerBound(e.target.checked)}
              />
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Áp dụng ngưỡng sàn tối thiểu (Cắt chặn &alpha;<sub>A1</sub> &ge; 0.60; &alpha;<sub>A2</sub> &ge; 0.50 theo TCVN 2737:2023)
              </span>
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
                <span className="calc-metric-label">Hệ số giảm diện tích <var>&alpha;<sub>A</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-primary)' }}>{result.alphaA}</strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {result.reductionPercentArea > 0 ? `Giảm ${result.reductionPercentArea}% (A = ${area} m²)` : 'Không đủ điều kiện giảm'}
                </small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Hệ số giảm số tầng <var>&alpha;<sub>n</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-primary)' }}>{result.alphaN}</strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {result.reductionPercentColumn > 0 ? `Giảm ${result.reductionPercentColumn}% (n = ${floors} tầng)` : 'Không đủ điều kiện giảm'}
                </small>
              </div>

              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">Hoạt tải sàn sau giảm <var>p<sub>d,red</sub>(A)</var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-gold)' }}>
                  {result.pdReducedArea} <small>kN/m²</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Gốc: {result.pdUnreduced} kN/m² (&gamma;<sub>f</sub> = {result.gammaF})
                </small>
              </div>

              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">Hoạt tải cột sau giảm <var>p<sub>d,red</sub>(n)</var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--green)' }}>
                  {result.pdReducedColumn} <small>kN/m²</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Gốc: {result.pdUnreduced} kN/m² (&gamma;<sub>f</sub> = {result.gammaF})
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
              3. Tầng Đánh giá Hệ số Sử dụng &eta; = p_d,red(A) / p_d,allow
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.utilization.icon} &eta; = {result.utilization.eta.toFixed(3)} ({(result.utilization.eta * 100).toFixed(1)}%) —{' '}
                <span style={{ color: result.utilization.color }}>{result.utilization.label}</span>
              </div>
              <span className="spec-badge" style={{ borderColor: result.utilization.color, color: result.utilization.color }}>
                {result.pdReducedArea} / {Number(designCapacityPd).toFixed(2)} kN/m²
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
                  Hoạt tải sàn sau chiết giảm &eta; = {result.utilization.eta.toFixed(2)} &le; 0.70 cho thấy kết cấu sàn chịu lực có độ dự trữ cao. Chiết giảm {result.reductionPercentArea}% hoạt tải sàn và {result.reductionPercentColumn}% hoạt tải truyền cột cho phép tối ưu tiết diện cột, giảm tải móng cọc từ 10–25%, mang lại hiệu quả kinh tế lớn cho toàn dự án.
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
                  Hoạt tải sau chiết giảm <var>p<sub>d,red</sub></var> = {result.pdReducedArea} kN/m² vượt khả năng chịu tải cho phép ({Number(designCapacityPd).toFixed(2)} kN/m²). Cần gia cường sàn hoặc nâng cao khả năng chịu uốn của dầm phụ/bản sàn.
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
                        <th style={{ textAlign: 'right' }}>Giá trị tính</th>
                        <th style={{ textAlign: 'right' }}>Giới hạn cho phép</th>
                        <th style={{ textAlign: 'center' }}>Chỉ số η</th>
                        <th style={{ textAlign: 'center' }}>Kết luận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Hệ số giảm theo diện tích</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>α_A</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.alphaA}</td>
                        <td style={{ textAlign: 'right' }}>≥ 0.60</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>ĐẠT (Giảm {result.reductionPercentArea}%)</td>
                      </tr>
                      <tr>
                        <td>Hệ số giảm theo số tầng</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>α_n</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.alphaN}</td>
                        <td style={{ textAlign: 'right' }}>≥ 0.50</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>ĐẠT (Giảm {result.reductionPercentColumn}%)</td>
                      </tr>
                      <tr style={{ background: 'rgba(255, 242, 204, 0.25)' }}>
                        <td style={{ fontWeight: 700 }}>Hoạt tải tính toán sau giảm</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 700 }}>p_d,red(A)</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>{result.pdReducedArea} kN/m²</td>
                        <td style={{ textAlign: 'right' }}>≤ {Number(designCapacityPd).toFixed(2)} kN/m²</td>
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
