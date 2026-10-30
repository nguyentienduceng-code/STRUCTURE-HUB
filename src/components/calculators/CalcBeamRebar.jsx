import { useState } from 'react';
import {
  Building2,
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
  calculateBeamRebarTCVN5574,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import { generatePhuLucData } from '../../services/phuLucGenerator';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';

export default function CalcBeamRebar() {
  const [b, setB] = useState(300);
  const [h, setH] = useState(600);
  const [a, setA] = useState(45);
  const [M, setM] = useState(240);
  const [concrete, setConcrete] = useState('B25');
  const [rebar, setRebar] = useState('CB400V');
  const [gammaB, setGammaB] = useState(1.0);
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateBeamRebarTCVN5574({
    b,
    h,
    a,
    M,
    concrete,
    rebar,
    gammaB,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== BÁO CÁO TÍNH CỐT THÉP DẦM CHỮ NHẬT ĐẶT CỐT ĐƠN (${result.standardRef}) ===`,
      `- Tiết diện: b × h = ${b} × ${h} mm (a = ${a} mm, h0 = ${result.h0} mm)`,
      `- Vật liệu: Bê tông ${concrete} (R_b = ${result.Rb} MPa) | Cốt thép ${rebar} (R_s = ${result.Rs} MPa)`,
      `- Mômen uốn tính toán M = ${M} kNm (M_ult = ${result.Mult} kNm)`,
      `- Chiều cao vùng nén: x = ${result.x} mm | ξ = ${result.xi} (ξ_R = ${result.xiR})`,
      `- Diện tích thép yêu cầu: A_s = ${result.AsDesignMm2} mm² (${result.AsDesignCm2} cm²)`,
      `- Hàm lượng cốt thép: μ = ${result.muDesignPercent}%`,
      `- Đánh giá η = M / M_ult = ${result.utilization.eta.toFixed(3)} (${result.utilization.icon} ${result.utilization.label})`,
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
        moduleName: 'Mô-đun 3: Tính Cốt thép Dầm Đặt Cốt Đơn',
        standard: result.standardRef,
        inputs: {
          b_mm: Number(b),
          h_mm: Number(h),
          a_mm: Number(a),
          M_kNm: Number(M),
          concrete,
          rebar,
          gamma_b: Number(gammaB),
        },
        outputs: {
          h0_mm: result.h0,
          Rb_MPa: result.Rb,
          Rs_MPa: result.Rs,
          xi: result.xi,
          xi_R: result.xiR,
          x_mm: result.x,
          Mult_kNm: result.Mult,
          is_over_reinforced: result.isOverReinforced,
          As_required_cm2: result.AsDesignCm2,
          mu_percent: result.muDesignPercent,
          utilization_eta: result.utilization.eta,
        },
        utilization: result.utilization,
        steps: result.steps,
      })
    : null;

  const phuLucData = result.valid
    ? generatePhuLucData('beam', { b_mm: b, h_mm: h, a_mm: a, M_kNm: M, concrete, rebar, gamma_b: gammaB }, result)
    : null;

  return (
    <div className="calc-module-card card">
      <div className="calc-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building2 size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 3: Tính Cốt thép Dầm Chữ nhật Đặt Cốt Đơn (<var>A<sub>s</sub>, &xi;, &mu;%</var>)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 5574:2018 — Điều 8.1.2.2, Bảng 6, Bảng 13 &amp; Điều 10.3.3</strong>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="spec-badge">Kiểm soát &xi; &le; &xi;_R</span>
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
            <label>Bề rộng dầm <var>b</var> (mm) [100 – 2500]</label>
            <input
              type="number"
              min="100"
              max="2500"
              step="10"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Chiều cao dầm <var>h</var> (mm) [150 – 4000]</label>
            <input
              type="number"
              min="150"
              max="4000"
              step="50"
              value={h}
              onChange={(e) => setH(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Lớp bảo vệ trọng tâm thép <var>a</var> (mm) [15 – 300]</label>
            <input
              type="number"
              min="15"
              max="300"
              step="5"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Mômen uốn tính toán <var>M</var> (kNm)</label>
            <input
              type="number"
              min="1"
              max="50000"
              step="5"
              value={M}
              onChange={(e) => setM(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Cấp độ bền Bê tông (Bảng 6 — TCVN 5574:2018)</label>
            <select value={concrete} onChange={(e) => setConcrete(e.target.value)} className="calc-select">
              {Object.values(CONCRETE_GRADES_TCVN5574).map((cItem) => (
                <option key={cItem.code} value={cItem.code}>
                  {cItem.code} (≈ {cItem.macEquiv}) — R_b = {cItem.Rb} MPa, R_bt = {cItem.Rbt} MPa
                </option>
              ))}
            </select>
          </div>

          <div className="calc-field">
            <label>Nhóm cốt thép dọc &amp; Hệ số <var>&gamma;<sub>b</sub></var></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
              <select value={rebar} onChange={(e) => setRebar(e.target.value)} className="calc-select">
                {Object.values(REBAR_GRADES_TCVN5574).map((rItem) => (
                  <option key={rItem.code} value={rItem.code}>
                    {rItem.code} (R_s = {rItem.Rs} MPa)
                  </option>
                ))}
              </select>
              <select
                value={String(gammaB)}
                onChange={(e) => setGammaB(parseFloat(e.target.value))}
                className="calc-select"
              >
                <option value="1">γ_b = 1.00</option>
                <option value="0.9">γ_b1 = 0.90</option>
              </select>
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
            {result.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {result.isOverReinforced && (
            <div className="alert-box" style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.16)' }}>
              <div className="alert-box-title" style={{ color: '#ef4444' }}>
                <AlertTriangle size={18} /> CẢNH BÁO ĐỎ — VƯỢT GIỚI HẠN VÙNG NÉN (&xi; = {result.xi} &gt; &xi;<sub>R</sub> = {result.xiR}):
              </div>
              <div className="alert-box-content" style={{ color: 'var(--text-danger)', fontWeight: 600 }}>
                {result.statusMessage} (Mômen giới hạn cốt đơn M<sub>ult</sub> = {result.Mult} kNm &lt; M = {M} kNm).
              </div>
            </div>
          )}

          {/* TẦNG 2: KẾT QUẢ TÍNH TOÁN THUẦN */}
          <div className="calc-tier">
            <div className="calc-tier-title">2. Tầng Tính toán Thuần (Deterministic Math Engine)</div>
            <div className="calc-results-grid">
              <div className="calc-metric-box">
                <span className="calc-metric-label">Vùng nén <var>x</var> &amp; Tỷ số <var>&xi;</var></span>
                <strong className="calc-metric-value" style={{ color: result.isOverReinforced ? '#ef4444' : '#60a5fa' }}>
                  &xi; = {result.xi} <small>(x = {result.x} mm)</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Giới hạn &xi;<sub>R</sub> = {result.xiR} (&alpha;<sub>R</sub> = {result.alphaR})
                </small>
              </div>

              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">Diện tích thép yêu cầu <var>A<sub>s</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-gold)' }}>
                  {result.AsDesignCm2} <small>cm²</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  ({result.AsDesignMm2} mm² | A_s,min = {result.AsMinMm2} mm²)
                </small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Hàm lượng cốt thép <var>&mu;%</var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--green)' }}>
                  {result.muDesignPercent}%
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  &mu;<sub>min</sub> = 0.10% | &mu;<sub>max</sub> = {result.muMax}%
                </small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Khả năng chịu uốn <var>M<sub>ult</sub></var></span>
                <strong className="calc-metric-value">
                  {result.Mult} <small>kNm</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  h₀ = {result.h0} mm, &alpha;<sub>m</sub> = {result.alphaM}
                </small>
              </div>
            </div>

            {!result.isOverReinforced && result.rebarSuggestions.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Gợi ý chọn cốt thép thực tế:
                </span>
                {result.rebarSuggestions.map((sug) => (
                  <span key={sug.diameter} className="spec-badge" style={{ fontSize: '0.82rem' }}>
                    <strong>{sug.label}</strong> ({sug.totalAreaCm2} cm²)
                  </span>
                ))}
              </div>
            )}
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
              3. Tầng Đánh giá Hệ số Sử dụng &eta; = M / M_ult
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.utilization.icon} &eta; = {result.utilization.eta.toFixed(3)} ({(result.utilization.eta * 100).toFixed(1)}%) —{' '}
                <span style={{ color: result.utilization.color }}>{result.utilization.label}</span>
              </div>
              <span className="spec-badge" style={{ borderColor: result.utilization.color, color: result.utilization.color }}>
                M = {M} / M_ult = {result.Mult} kNm
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
            <div style={{ marginTop: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <strong>Nhận xét kỹ thuật:</strong> {result.statusMessage}
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
                  Hệ số sử dụng &eta; = {result.utilization.eta.toFixed(2)} &le; 0.70 cho thấy tiết diện dầm đang dư nhiều khả năng chịu lực. Có thể xem xét giảm chiều cao dầm <var>h</var> hoặc giảm bề rộng <var>b</var> xuống khoảng 50 mm để tiết kiệm khối lượng bê tông và cốt thép, giảm tĩnh tải truyền xuống cột và móng.
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
                  Mômen tác dụng <var>M</var> = {M} kNm vượt khả năng chịu tải của dầm (<var>M<sub>ult</sub></var> = {result.Mult} kNm, &eta; = {result.utilization.eta.toFixed(2)}). Khuyến nghị: (1) Tăng chiều cao dầm <var>h</var> lên tối thiểu {Math.ceil(h * Math.sqrt(result.utilization.eta) / 50) * 50} mm; hoặc (2) Nâng cấp cấp bền bê tông; hoặc (3) Thiết kế đặt cốt kép (<var>A&apos;<sub>s</sub></var> chịu nén).
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
                        <th style={{ textAlign: 'right' }}>Giới hạn TCVN</th>
                        <th style={{ textAlign: 'center' }}>Chỉ số η</th>
                        <th style={{ textAlign: 'center' }}>Kết luận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Vùng nén tương đối</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>ξ</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.xi}</td>
                        <td style={{ textAlign: 'right' }}>≤ {result.xiR}</td>
                        <td style={{ textAlign: 'center' }}>{(result.xi / result.xiR).toFixed(3)}</td>
                        <td style={{ textAlign: 'center', color: !result.isOverReinforced ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                          {!result.isOverReinforced ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                        </td>
                      </tr>
                      <tr>
                        <td>Hàm lượng cốt thép</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>μ%</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.muDesignPercent}%</td>
                        <td style={{ textAlign: 'right' }}>0.10% – {result.muMax}%</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>HỢP LÝ</td>
                      </tr>
                      <tr style={{ background: 'rgba(255, 242, 204, 0.25)' }}>
                        <td style={{ fontWeight: 700 }}>Khả năng chịu uốn ULS</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 700 }}>M_ult</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>{result.Mult} kNm</td>
                        <td style={{ textAlign: 'right' }}>≥ {M} kNm</td>
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
