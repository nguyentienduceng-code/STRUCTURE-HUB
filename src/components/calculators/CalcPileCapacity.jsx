import { useState } from 'react';
import {
  Layers,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Plus,
  Trash2,
  Bot,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import {
  calculatePileCapacityTCVN10304,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import { generatePhuLucData } from '../../services/phuLucGenerator';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';

export default function CalcPileCapacity() {
  const [pileMethod, setPileMethod] = useState('driven_square');
  const [D, setD] = useState(400);
  const [Np, setNp] = useState(35);
  const [gammaK, setGammaK] = useState(1.75);
  const [designLoadP, setDesignLoadP] = useState(850);
  const [sandFrictionFormula, setSandFrictionFormula] = useState('aij_10_3');
  const [layers, setLayers] = useState([
    { id: 1, name: 'Lớp 1 — Sét dẻo mềm', soilType: 'clay', length: 6.0, Ns: 8 },
    { id: 2, name: 'Lớp 2 — Cát pha chặt vừa', soilType: 'sand', length: 8.0, Ns: 18 },
    { id: 3, name: 'Lớp 3 — Cát hạt trung chặt', soilType: 'sand', length: 5.0, Ns: 30 },
  ]);
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculatePileCapacityTCVN10304({
    pileMethod,
    D,
    Np,
    gammaK,
    designLoadP,
    layers,
    sandFrictionFormula,
  });

  const handleLayerChange = (id, field, value) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, [field]: value } : layer))
    );
  };

  const handleAddLayer = () => {
    const nextIdx = layers.length + 1;
    setLayers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: `Lớp ${nextIdx} — Đất chịu lực`,
        soilType: 'sand',
        length: 4.0,
        Ns: 25,
      },
    ]);
  };

  const handleRemoveLayer = (id) => {
    if (layers.length <= 1) return;
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
  };

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== BÁO CÁO TÍNH SỨC CHỊU TẢI CỌC ĐƠN THEO SPT (${result.standardRef}) ===`,
      `- Loại cọc: ${pileMethod === 'driven_square' ? 'Cọc ép/đóng vuông' : pileMethod === 'driven_circle' ? 'Cọc ly tâm tròn' : 'Cọc khoan nhồi'} | D = ${D} mm`,
      `- Tổng chiều dài cọc ngàm đất L = ${result.totalLength} m | Chu vi u = ${result.u} m | Diện tích mũi Ap = ${result.Ap} m²`,
      `- Sức kháng mũi đơn vị qb = ${result.qb} kPa (Np = ${Np}) => Sức kháng mũi cực hạn Qb = ${result.Qb} kN`,
      `- Sức kháng ma sát cực hạn thân cọc Qs = ${result.Qs} kN`,
      `=> Sức chịu tải cực hạn R_cu = ${result.Rcu} kN`,
      `=> Sức chịu tải tính toán Rc = R_cu / γ_k = ${result.Rc} kN (γ_k = ${gammaK})`,
      `=> Tải trọng đầu cọc Pd = ${designLoadP} kN => Hệ số sử dụng η = ${result.utilization.eta.toFixed(3)} (${result.utilization.icon} ${result.utilization.label})`,
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
        moduleName: 'Mô-đun 5: Sức Chịu tải Cọc Đơn (SPT)',
        standard: result.standardRef,
        inputs: {
          pile_method: pileMethod,
          dimension_D_mm: Number(D),
          spt_tip_Np: Number(Np),
          safety_factor_gamma_k: Number(gammaK),
          design_load_Pd_kN: Number(designLoadP),
          sand_friction_formula: sandFrictionFormula,
          layers_count: layers.length,
          total_length_m: result.totalLength,
        },
        outputs: {
          Ap_m2: result.Ap,
          u_m: result.u,
          qb_kPa: result.qb,
          Qb_kN: result.Qb,
          Qs_kN: result.Qs,
          Rcu_kN: result.Rcu,
          Rc_kN: result.Rc,
          utilization_eta: result.utilization.eta,
        },
        utilization: result.utilization,
        steps: result.steps,
      })
    : null;

  const phuLucData = result.valid
    ? generatePhuLucData('pile', { pileMethod, D, Np, gammaK, designLoadP, sandFrictionFormula, layers }, result)
    : null;

  return (
    <div className="calc-module-card card">
      <div className="calc-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 5: Tính Sức chịu tải Cọc đơn theo SPT (<var>Q<sub>b</sub>, Q<sub>s</sub>, R<sub>c</sub></var>)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Căn cứ pháp lý: <strong>TCVN 10304:2014 — Điều 7.1.11 &amp; Phụ lục G (Phương pháp Meyerhof)</strong>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="spec-badge">TCVN 10304:2014 Phụ lục G</span>
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
        <div className="calc-tier-title">1. Tầng Nhập liệu &amp; Kiểm soát Tham số Cọc &amp; Đất nền (Input UI Layer)</div>
        <div className="calc-input-grid">
          <div className="calc-field">
            <label>Phương pháp thi công &amp; Hình dạng cọc</label>
            <select value={pileMethod} onChange={(e) => setPileMethod(e.target.value)} className="calc-select">
              <option value="driven_square">Cọc ép / đóng tiết diện vuông (q_b = 300·N_p)</option>
              <option value="driven_circle">Cọc ly tâm ống tròn đóng/ép (q_b = 300·N_p)</option>
              <option value="bored_circle">Cọc khoan nhồi tiết diện tròn (q_b = 150·N_p)</option>
            </select>
          </div>

          <div className="calc-field">
            <label>Kích thước cạnh / đường kính cọc <var>D</var> (mm)</label>
            <input
              type="number"
              min="200"
              max="2500"
              step="50"
              value={D}
              onChange={(e) => setD(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Chỉ số SPT tại mũi cọc <var>N<sub>p</sub></var> [1 – 100]</label>
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              value={Np}
              onChange={(e) => setNp(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Hệ số an toàn đất nền <var>&gamma;<sub>k</sub></var> (Mặc định 1.75 theo TCVN)</label>
            <input
              type="number"
              min="1.0"
              max="3.0"
              step="0.05"
              value={gammaK}
              onChange={(e) => setGammaK(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Tải trọng thiết kế đầu cọc <var>P<sub>d</sub></var> (kN)</label>
            <input
              type="number"
              min="10"
              max="50000"
              step="10"
              value={designLoadP}
              onChange={(e) => setDesignLoadP(e.target.value)}
              className="calc-input"
            />
          </div>

          <div className="calc-field">
            <label>Công thức ma sát đất rời <var>f<sub>s</sub></var> (Đất cát)</label>
            <select
              value={sandFrictionFormula}
              onChange={(e) => setSandFrictionFormula(e.target.value)}
              className="calc-select"
            >
              <option value="aij_10_3">Chuẩn AIJ / Phụ lục G: f_s = (10/3) · N_s (kPa)</option>
              <option value="audit_1_3">Hồ sơ thẩm tra thực tế: f_s = N_s / 3 (kPa)</option>
            </select>
          </div>
        </div>

        {/* BẢNG ĐỊA TẦNG ĐẤT */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Phân chia các lớp địa tầng dọc thân cọc ({layers.length} lớp, tổng chiều dài: {result.valid ? result.totalLength : 0} m):
            </span>
            <button
              type="button"
              className="calc-action-btn"
              onClick={handleAddLayer}
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Thêm lớp đất
            </button>
          </div>

          <div className="spec-table-container">
            <table className="spec-table" style={{ fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>STT</th>
                  <th>Mô tả lớp đất</th>
                  <th style={{ width: '130px' }}>Loại đất</th>
                  <th style={{ width: '110px' }}>Chiều dày (m)</th>
                  <th style={{ width: '100px' }}>SPT N_s</th>
                  <th style={{ width: '60px' }}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {layers.map((layer, idx) => (
                  <tr key={layer.id}>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={layer.name}
                        onChange={(e) => handleLayerChange(layer.id, 'name', e.target.value)}
                        className="calc-input"
                        style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                      />
                    </td>
                    <td>
                      <select
                        value={layer.soilType}
                        onChange={(e) => handleLayerChange(layer.id, 'soilType', e.target.value)}
                        className="calc-select"
                        style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                      >
                        <option value="clay">Đất dính (Sét)</option>
                        <option value="sand">Đất rời (Cát)</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0.5"
                        max="100"
                        step="0.5"
                        value={layer.length}
                        onChange={(e) => handleLayerChange(layer.id, 'length', e.target.value)}
                        className="calc-input"
                        style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={layer.Ns}
                        onChange={(e) => handleLayerChange(layer.id, 'Ns', e.target.value)}
                        className="calc-input"
                        style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveLayer(layer.id)}
                        disabled={layers.length <= 1}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: layers.length <= 1 ? 'var(--text-muted)' : 'var(--red)',
                          cursor: layers.length <= 1 ? 'not-allowed' : 'pointer',
                          padding: '4px',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <span className="calc-metric-label">Kháng mũi cực hạn <var>Q<sub>b</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-primary)' }}>
                  {result.Qb} <small>kN</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  q_b = {result.qb} kPa (A_p = {result.Ap} m²)
                </small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Kháng ma sát bên <var>Q<sub>s</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-primary)' }}>
                  {result.Qs} <small>kN</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  u = {result.u} m ({layers.length} lớp đất)
                </small>
              </div>

              <div className="calc-metric-box">
                <span className="calc-metric-label">Sức chịu tải cực hạn <var>R<sub>cu</sub></var></span>
                <strong className="calc-metric-value">
                  {result.Rcu} <small>kN</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  R_cu = Q_b + Q_s
                </small>
              </div>

              <div className="calc-metric-box highlight">
                <span className="calc-metric-label">Sức chịu tải thiết kế <var>R<sub>c</sub></var></span>
                <strong className="calc-metric-value" style={{ color: 'var(--accent-gold)' }}>
                  {result.Rc} <small>kN</small>
                </strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  R_c = R_cu / {result.gammaK}
                </small>
              </div>
            </div>

            {/* CHI TIẾT MA SÁT TỪNG LỚP */}
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Chi tiết ma sát thành bên từng lớp:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {result.layerDetails.map((l) => (
                  <span key={l.index} className="spec-badge" style={{ fontSize: '0.8rem' }}>
                    <strong>{l.name}</strong> ({l.soilLabel}, l={l.length}m, N={l.Ns}): f_s = {l.fsi} kPa &rarr; Q_si = {l.Qsi} kN
                  </span>
                ))}
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
              3. Tầng Đánh giá Hệ số Sử dụng &eta; = P_d / R_c
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {result.utilization.icon} &eta; = {result.utilization.eta.toFixed(3)} ({(result.utilization.eta * 100).toFixed(1)}%) —{' '}
                <span style={{ color: result.utilization.color }}>{result.utilization.label}</span>
              </div>
              <span className="spec-badge" style={{ borderColor: result.utilization.color, color: result.utilization.color }}>
                P_d = {result.designLoadP} / R_c = {result.Rc} kN
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
                  Hệ số sử dụng cọc &eta; = {result.utilization.eta.toFixed(2)} &le; 0.70 cho thấy sức chịu tải cọc đang dư nhiều ({((1 - result.utilization.eta) * 100).toFixed(0)}% dư thừa). Có thể xem xét: (1) Rút ngắn chiều dài cọc ngàm vào lớp chịu lực; (2) Giảm bớt số cọc trong mỗi đài móng; hoặc (3) Giảm tiết diện cọc từ {D} mm xuống cấp nhỏ hơn để tiết kiệm đáng kể chi phí ép cọc và bê tông móng.
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
                  Tải trọng tác dụng đầu cọc <var>P<sub>d</sub></var> = {designLoadP} kN vượt quá sức chịu tải tính toán của cọc (<var>R<sub>c</sub></var> = {result.Rc} kN, &eta; = {result.utilization.eta.toFixed(2)}). Nguy cơ lún lệch móng hoặc phá hoại đất nền. Khuyến nghị: (1) Kéo dài cọc cắm sâu hơn vào lớp chịu lực có SPT cao; (2) Tăng kích thước tiết diện cọc <var>D</var>; hoặc (3) Bố trí thêm cọc vào đài để phân tán tải trọng.
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
                        <th>Thành phần sức kháng</th>
                        <th style={{ textAlign: 'center' }}>Ký hiệu</th>
                        <th style={{ textAlign: 'right' }}>Giá trị cực hạn</th>
                        <th style={{ textAlign: 'right' }}>Giá trị tính toán</th>
                        <th style={{ textAlign: 'center' }}>Chỉ số η</th>
                        <th style={{ textAlign: 'center' }}>Kết luận</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Sức kháng mũi cọc</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>Q_b</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.Qb} kN</td>
                        <td style={{ textAlign: 'right' }}>q_b = {result.qb} kPa</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>ĐẠT</td>
                      </tr>
                      <tr>
                        <td>Ma sát thành bên</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic' }}>Q_s</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{result.Qs} kN</td>
                        <td style={{ textAlign: 'right' }}>{layers.length} lớp địa tầng</td>
                        <td style={{ textAlign: 'center' }}>—</td>
                        <td style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>ĐẠT</td>
                      </tr>
                      <tr style={{ background: 'rgba(255, 242, 204, 0.25)' }}>
                        <td style={{ fontWeight: 700 }}>Sức chịu tải thiết kế của cọc</td>
                        <td style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 700 }}>R_c</td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{result.Rcu} kN</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>{result.Rc} kN</td>
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
