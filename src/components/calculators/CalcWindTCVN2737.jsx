import { useState } from 'react';
import {
  Wind,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Bot,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import {
  WIND_ZONES_TCVN2737,
  TERRAIN_TYPES_TCVN2737,
  calculateWindTCVN2737,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import { generatePhuLucData } from '../../services/phuLucGenerator';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';

export default function CalcWindTCVN2737() {
  const [zone, setZone] = useState('II-A');
  const [terrain, setTerrain] = useState('B');
  const [z, setZ] = useState(25);
  const [c, setC] = useState(0.8);
  const [gf, setGf] = useState(0.85);
  const [gammaF, setGammaF] = useState(1.25);
  const [allowableWd, setAllowableWd] = useState(1.50);
  const [copied, setCopied] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateWindTCVN2737({
    zone,
    terrain,
    z,
    c,
    gf,
    gammaF,
    allowableWd,
  });

  const handleCopyReport = () => {
    if (!result.valid) return;
    const text = [
      `=== BÁO CÁO TÍNH TẢI TRỌNG GIÓ (${result.standardRef}) ===`,
      `- Vùng áp lực gió: ${WIND_ZONES_TCVN2737[zone].name} (W0 = ${result.W0} kN/m²)`,
      `- Dạng địa hình: ${TERRAIN_TYPES_TCVN2737[terrain].name}`,
      `- Cao độ tính toán z = ${z} m (z_eff = ${result.zEff} m) -> Hệ số k(z) = ${result.kz}`,
      `- Hệ số khí động c = ${c} | Hệ số giật G_f = ${gf} | Hệ số độ tin cậy γ_f = ${gammaF}`,
      `=> Áp lực gió tiêu chuẩn W_k = ${result.Wk} kN/m²`,
      `=> Áp lực gió tính toán W_d = ${result.Wd} kN/m²`,
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
        moduleName: 'Mô-đun 1: Tính Tải trọng Gió Động',
        standard: result.standardRef,
        inputs: {
          wind_zone: zone,
          terrain_category: terrain,
          height_z_m: Number(z),
          aerodynamic_c: Number(c),
          gust_factor_gf: Number(gf),
          reliability_factor_gamma_f: Number(gammaF),
          allowable_wd_kNm2: Number(allowableWd),
        },
        outputs: {
          W0_kNm2: result.W0,
          kz: result.kz,
          zeff_m: result.zEff,
          Wk_kNm2: result.Wk,
          Wd_kNm2: result.Wd,
          utilization_eta: result.utilization.eta,
        },
        utilization: result.utilization,
        steps: result.steps,
      })
    : null;

  const phuLucData = result.valid
    ? generatePhuLucData('wind', { zone, terrain, z, c, gf, gammaF, allowableWd }, result)
    : null;

  return (
    <div className="calc-module-card card">
      <div className="calc-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wind size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 1: Tính Tải trọng Gió Động TCVN 2737:2023 (<var>W<sub>k</sub>, W<sub>d</sub></var>)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Căn cứ pháp lý: <strong>TCVN 2737:2023 — Điều 10.2 &amp; Bảng F.1 (Thay thế TCVN 2737:1995)</strong>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="spec-badge">Chu kỳ lặp 50 năm</span>
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
            <label>Vùng áp lực gió (Bảng F.1)</label>
            <select value={zone} onChange={(e) => setZone(e.target.value)} className="calc-select">
              {Object.keys(WIND_ZONES_TCVN2737).map((zKey) => (
                <option key={zKey} value={zKey}>
                  {WIND_ZONES_TCVN2737[zKey].name} — W₀ = {WIND_ZONES_TCVN2737[zKey].W0} kN/m²
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Dạng địa hình (Bảng 7)</label>
            <select value={terrain} onChange={(e) => setTerrain(e.target.value)} className="calc-select">
              {Object.keys(TERRAIN_TYPES_TCVN2737).map((tKey) => (
                <option key={tKey} value={tKey}>
                  Dạng {tKey}: {TERRAIN_TYPES_TCVN2737[tKey].name}
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Cao độ điểm tính toán <var>z</var> (m) [1 – 500]</label>
            <input
              type="number"
              min="1"
              max="500"
              step="1"
              value={z}
              onChange={(e) => setZ(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Hệ số khí động <var>c</var> [-2.0 đến +2.0]</label>
            <input
              type="number"
              min="-2.0"
              max="2.0"
              step="0.05"
              value={c}
              onChange={(e) => setC(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Hệ số phản ứng giật <var>G<sub>f</sub></var> [0.80 – 1.60]</label>
            <input
              type="number"
              min="0.8"
              max="1.6"
              step="0.05"
              value={gf}
              onChange={(e) => setGf(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Hệ số tin cậy tải gió <var>&gamma;<sub>f</sub></var> (Mặc định 1.25)</label>
            <input
              type="number"
              min="1.0"
              max="1.5"
              step="0.05"
              value={gammaF}
              onChange={(e) => setGammaF(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Tải gió cho phép / thiết kế kết cấu <var>W<sub>d,allow</sub></var> (kN/m²)</label>
            <input
              type="number"
              min="0.1"
              max="10"
              step="0.1"
              value={allowableWd}
              onChange={(e) => setAllowableWd(e.target.value)}
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
                <span className="calc-metric-label">Áp lực gió cơ sở <var>W₀</var></span>
                <strong className="calc-metric-value">{result.W0} <small>kN/m²</small></strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{WIND_ZONES_TCVN2737[zone].name}</small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Hệ số độ cao <var>k(z)</var></span>
                <strong className="calc-metric-value">{result.kz}</strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Dạng địa hình {terrain} (z_eff = {result.zEff} m)</small>
              </div>

              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">Áp lực tiêu chuẩn <var>W<sub>k</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-gold)' }}>
                  {result.Wk} <small>kN/m²</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>≈ {(result.Wk * 100).toFixed(1)} daN/m²</small>
              </div>

              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">Áp lực tính toán <var>W<sub>d</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--green)' }}>
                  {result.Wd} <small>kN/m²</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>γ_f = {gammaF} (≈ {(result.Wd * 100).toFixed(1)} daN/m²)</small>
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
              3. Tầng Đánh giá Hệ số Sử dụng &eta; = W_d / W_d,allow
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.utilization.icon} &eta; = {result.utilization.eta.toFixed(3)} ({(result.utilization.eta * 100).toFixed(1)}%) —{' '}
                <span style={{ color: result.utilization.color }}>{result.utilization.label}</span>
              </div>
              <span className="spec-badge" style={{ borderColor: result.utilization.color, color: result.utilization.color }}>
                {result.Wd} / {Number(allowableWd).toFixed(2)} kN/m²
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
                  Hệ số sử dụng tải gió &eta; = {result.utilization.eta.toFixed(2)} &le; 0.70 cho thấy kết cấu bao che/xà gồ đang dư nhiều khả năng chịu lực. Có thể xem xét tăng nhịp xà gồ hoặc giảm chiều dày tôn bao che/tấm ốp mặt tiền để tiết kiệm chi phí vật tư CAPEX.
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
                  Áp lực gió tính toán <var>W<sub>d</sub></var> = {result.Wd} kN/m² vượt quá sức chịu tải cho phép của kết cấu bao che ({Number(allowableWd).toFixed(2)} kN/m²). Nguy cơ tốc mái hoặc phá hoại tấm ốp. Cần tăng cường xà gồ, thu hẹp khoảng cách điểm tựa hoặc tăng khả năng chịu tải của liên kết vít/bu lông neo.
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
                <button type="button" className="calc-action-btn copy-btn" onClick={handleCopyReport}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép kết quả'}</span>
                </button>
                <button
                  type="button"
                  className="calc-action-btn"
                  onClick={() => setShowSummaryModal(!showSummaryModal)}
                >
                  <FileText size={15} />
                  <span>{showSummaryModal ? 'Ẩn tóm tắt' : 'Bảng tóm tắt'}</span>
                </button>
              </div>
            </div>

            {/* TRÌNH BÀY BƯỚC TÍNH NÂNG CẤP VỚI FONT KỸ THUẬT */}
            <ol className="calc-steps-list">
              {result.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>

            {showSummaryModal && (
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
                        <td>Áp lực gió cơ sở</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>W₀</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.W0} kN/m²</td>
                        <td style={{ textAlign: 'right' }}>{WIND_ZONES_TCVN2737[zone].name}</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>ĐẠT</td>
                      </tr>
                      <tr>
                        <td>Áp lực gió tiêu chuẩn</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>W_k</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.Wk} kN/m²</td>
                        <td style={{ textAlign: 'right' }}>k(z) = {result.kz}</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>ĐẠT</td>
                      </tr>
                      <tr style={{ background: 'rgba(255, 242, 204, 0.25)' }}>
                        <td style={{ fontWeight: 700 }}>Áp lực gió tính toán ULS</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 700 }}>W_d</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>{result.Wd} kN/m²</td>
                        <td style={{ textAlign: 'right' }}>≤ {Number(allowableWd).toFixed(2)} kN/m²</td>
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
