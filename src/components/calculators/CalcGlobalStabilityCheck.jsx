import { useState } from 'react';
import {
  RotateCw,
  FileText,
  Copy,
  Check,
  Bot,
  AlertTriangle,
} from 'lucide-react';
import {
  calculateGlobalStabilityCheck,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';
import { generatePhuLucData } from '../../services/phuLucGenerator';

export default function CalcGlobalStabilityCheck() {
  const [totalWeightG, setTotalWeightG] = useState(45000);
  const [lateralWindV, setLateralWindV] = useState(2200);
  const [overturningMw, setOverturningMw] = useState(38000);
  const [foundationB, setFoundationB] = useState(24.0);
  const [totalHeightH, setTotalHeightH] = useState(60.0);
  const [storyCount, setStoryCount] = useState(18);
  const [maxStoryDrift, setMaxStoryDrift] = useState(12.0);
  const [storyHeight, setStoryHeight] = useState(3.3);
  const [frictionCoeff, setFrictionCoeff] = useState(0.35);

  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateGlobalStabilityCheck({
    totalWeightG, lateralWindV, overturningMw, foundationB, totalHeightH, storyCount, maxStoryDrift, storyHeight, frictionCoeff,
  });

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== KIỂM TOÁN ỔN ĐỊNH TỔNG THỂ CÔNG TRÌNH (${result.standardRef}) ===`,
      `- Tải trọng: G_tot = ${totalWeightG} kN, V_ngang = ${lateralWindV} kN, M_w = ${overturningMw} kNm`,
      `- Hình học: B_móng = ${foundationB} m, H = ${totalHeightH} m (${storyCount} tầng)`,
      `=> Ổn định Chống lật: K_lật = ${result.Klat} (Yêu cầu ≥ 1.50 -> ${result.passLat ? 'ĐẠT' : 'KHÔNG ĐẠT'})`,
      `=> Ổn định Chống trượt: K_trượt = ${result.Ktruot} (Yêu cầu ≥ 1.20 -> ${result.passTruot ? 'ĐẠT' : 'KHÔNG ĐẠT'})`,
      `=> Hiệu ứng P-Delta: θ = ${result.theta} (Ngưỡng 0.10 / 0.20 -> ${result.pDeltaAdvice})`,
      `=> Chuyển vị tầng: Δ_i/h_i = ${result.driftRatio} (Yêu cầu ≤ 1/250 = 0.004 -> ${result.passDrift ? 'ĐẠT' : 'VƯỢT'})`,
      `=> Chuyển vị đỉnh: Δ_top/H = ${result.deltaTopRatio} (Yêu cầu ≤ 1/500 = 0.002 -> ${result.passTop ? 'ĐẠT' : 'VƯỢT'})`,
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
    ? generatePhuLucData('globalstability', { totalWeightG, lateralWindV, overturningMw, foundationB, totalHeightH, storyCount, maxStoryDrift, storyHeight, frictionCoeff }, result)
    : null;

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 14: Kiểm toán Ổn định Tổng thể Công trình',
        standard: result.standardRef,
        inputs: { totalWeightG, lateralWindV, overturningMw, foundationB, totalHeightH, storyCount, maxStoryDrift, storyHeight, frictionCoeff },
        outputs: {
          Klat: result.Klat,
          Ktruot: result.Ktruot,
          theta_PDelta: result.theta,
          driftRatio: result.driftRatio,
          deltaTop_mm: result.deltaTop,
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
          <RotateCw size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 4.1: Kiểm toán Ổn định Tổng thể Công trình (Chống Lật, Trượt, P-Delta &amp; Chuyển vị Tầng)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 2737:2023 (Mục 7.3, 10.2), TCVN 5574:2018 (Chương 6) &amp; Tiêu chuẩn Eurocode/ASCE</strong>
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
        {/* Tier 1: Tải trọng đứng & ngang */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>1. Tải trọng tác dụng toàn nhà</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tổng trọng lượng G (kN):</span>
              <input type="number" step="1000" value={totalWeightG} onChange={(e) => setTotalWeightG(Number(e.target.value))} style={{ width: '120px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Lực cắt ngang đáy V (kN):</span>
              <input type="number" step="100" value={lateralWindV} onChange={(e) => setLateralWindV(Number(e.target.value))} style={{ width: '120px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mômen gây lật Mw (kNm):</span>
              <input type="number" step="1000" value={overturningMw} onChange={(e) => setOverturningMw(Number(e.target.value))} style={{ width: '120px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Tier 2: Kích thước móng & Chiều cao */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>2. Kích thước Móng &amp; Hình học</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Bề rộng móng B (m):</label>
              <input type="number" step="1" value={foundationB} onChange={(e) => setFoundationB(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Chiều cao nhà H (m):</label>
              <input type="number" step="1" value={totalHeightH} onChange={(e) => setTotalHeightH(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Số tầng:</label>
              <input type="number" step="1" value={storyCount} onChange={(e) => setStoryCount(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Hệ số ma sát f:</label>
              <input type="number" step="0.05" value={frictionCoeff} onChange={(e) => setFrictionCoeff(Number(e.target.value))} style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Tier 3: Chuyển vị tầng ETABS */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>3. Chuyển vị tầng (Từ ETABS)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Chuyển vị tầng max Δ (mm):</span>
              <input type="number" step="0.5" value={maxStoryDrift} onChange={(e) => setMaxStoryDrift(Number(e.target.value))} style={{ width: '100px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Chiều cao tầng điển hình h (m):</span>
              <input type="number" step="0.1" value={storyHeight} onChange={(e) => setStoryHeight(Number(e.target.value))} style={{ width: '100px', padding: '4px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Độ nhạy P-Delta θ: <strong style={{ color: result.theta <= 0.1 ? 'var(--accent-green)' : result.theta <= 0.2 ? 'var(--accent-gold)' : 'var(--accent-red)' }}>{result.theta}</strong>
            </div>
          </div>
        </div>
      </div>

      {result.valid ? (
        <div style={{ padding: '16px', background: 'var(--bg-card-secondary, rgba(255,255,255,0.02))', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ổn định Chống Lật K_lật</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.passLat ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px' }}>
                K = {result.Klat}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Yêu cầu ≥ [1.50] ({result.passLat ? 'ĐẠT' : 'KHÔNG ĐẠT'})
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ổn định Chống Trượt K_trượt</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.passTruot ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px' }}>
                K = {result.Ktruot}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Yêu cầu ≥ [1.20] ({result.passTruot ? 'ĐẠT' : 'KHÔNG ĐẠT'})
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hệ số P-Delta θ</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.theta <= 0.1 ? 'var(--accent-green)' : result.theta <= 0.2 ? 'var(--accent-gold)' : 'var(--accent-red)', marginTop: '4px' }}>
                θ = {result.theta}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {result.theta <= 0.1 ? 'Đủ cứng (Bỏ qua P-Delta)' : result.theta <= 0.2 ? 'Cần khuếch đại 1/(1-θ)' : 'Mất ổn định'}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Chuyển vị Lệch Tầng Δ/h</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.passDrift ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px' }}>
                {result.driftRatio}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Giới hạn ≤ 1/250 (0.004) ({result.passDrift ? 'ĐẠT' : 'VƯỢT'})
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
