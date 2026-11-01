import { useState } from 'react';
import {
  Layers,
  FileText,
  Copy,
  Check,
  Bot,
  Plus,
  Trash2,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import {
  calculateDeadLoad,
  BRICK_TYPES_TCVN2737,
  exportHandoffJSON,
} from '../../services/calculatorEngines';
import HandoffModal from './HandoffModal';
import PhuLucCalculationModal from './PhuLucCalculationModal';
import { generatePhuLucData } from '../../services/phuLucGenerator';

const PRESETS = {
  residential: {
    name: 'Sàn Căn hộ / Phòng ở',
    layers: [
      { id: 1, name: 'Gạch ceramic lát nền', thickness: 10, density: 20, gammaF: 1.1 },
      { id: 2, name: 'Vữa lót xi măng cát M75', thickness: 30, density: 18, gammaF: 1.2 },
      { id: 3, name: 'Bản sàn BTCT chịu lực', thickness: 120, density: 25, gammaF: 1.15 },
      { id: 4, name: 'Trần thạch cao khung chìm & MEP', thickness: 0, density: 0, loadK: 0.35, gammaF: 1.2 },
    ],
  },
  office: {
    name: 'Sàn Văn phòng / Thương mại',
    layers: [
      { id: 1, name: 'Gạch granite / đá ốp lát', thickness: 15, density: 24, gammaF: 1.1 },
      { id: 2, name: 'Vữa đệm lót xi măng cát M100', thickness: 40, density: 18, gammaF: 1.2 },
      { id: 3, name: 'Bản sàn BTCT chịu lực', thickness: 150, density: 25, gammaF: 1.15 },
      { id: 4, name: 'Trần sợi khoáng & cơ điện MEP', thickness: 0, density: 0, loadK: 0.45, gammaF: 1.2 },
    ],
  },
  roof: {
    name: 'Sàn Mái bằng chống thấm & tạo dốc',
    layers: [
      { id: 1, name: 'Lớp gạch lá nem / chống nóng', thickness: 20, density: 18, gammaF: 1.2 },
      { id: 2, name: 'Bê tông bọt / vữa tạo dốc', thickness: 50, density: 14, gammaF: 1.2 },
      { id: 3, name: 'Màng chống thấm + vữa bảo vệ', thickness: 20, density: 18, gammaF: 1.2 },
      { id: 4, name: 'Bản sàn BTCT chịu lực', thickness: 120, density: 25, gammaF: 1.15 },
      { id: 5, name: 'Vữa trát trần nhà M75', thickness: 15, density: 18, gammaF: 1.2 },
    ],
  },
};

export default function CalcDeadLoadBuilder() {
  const [layers, setLayers] = useState(PRESETS.residential.layers);
  const [storyHeight, setStoryHeight] = useState(3.6);
  const [beamHeight, setBeamHeight] = useState(0.6);
  const [wallThickness, setWallThickness] = useState(200);
  const [brickType, setBrickType] = useState('hollow_clay');
  const [plasterThickness, setPlasterThickness] = useState(15);
  const [openingPercent, setOpeningPercent] = useState(15);
  const [allowableFloorGd, setAllowableFloorGd] = useState(6.0);

  const [copied, setCopied] = useState(false);
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const [isPhuLucOpen, setIsPhuLucOpen] = useState(false);

  const result = calculateDeadLoad({
    floorLayers: layers,
    storyHeight,
    beamHeight,
    wallThickness,
    brickType,
    plasterThickness,
    openingPercent,
    allowableFloorGd,
  });

  const handleAddLayer = () => {
    const newId = layers.length > 0 ? Math.max(...layers.map((l) => l.id)) + 1 : 1;
    setLayers([
      ...layers,
      { id: newId, name: 'Lớp hoàn thiện mới', thickness: 20, density: 18, gammaF: 1.2 },
    ]);
  };

  const handleRemoveLayer = (id) => {
    if (layers.length <= 1) return;
    setLayers(layers.filter((l) => l.id !== id));
  };

  const handleLayerChange = (id, field, value) => {
    setLayers(
      layers.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const applyPreset = (key) => {
    if (PRESETS[key]) {
      setLayers(PRESETS[key].layers);
    }
  };

  const handleCopy = () => {
    if (!result.valid) return;
    const text = [
      `=== TÍCH LŨY TĨNH TẢI SÀN & TƯỜNG TRÊN DẦM (${result.standardRef}) ===`,
      `- Tĩnh tải sàn: G_k = ${result.floorGk} kN/m², G_d = ${result.floorGd} kN/m² (Giới hạn: [G_d] = ${result.allowableFloorGd} kN/m², η = ${result.utilization.eta.toFixed(3)})`,
      `- Tải tường xây: Loại gạch ${result.brickTypeName}, dày ${wallThickness} mm, H_w = ${result.netWallHeight} m (trừ ${openingPercent}% mở cửa)`,
      `=> q_w,k = ${result.wallQk} kN/m, q_w,d = ${result.wallQd} kN/m`,
      `=> Đánh giá Policy Engine: ${result.utilization.icon} ${result.utilization.label}`,
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
        'deadload',
        { storyHeight, beamHeight, wallThickness, brickType, plasterThickness, openingPercent, allowableFloorGd },
        result
      )
    : null;

  const handoffData = result.valid
    ? exportHandoffJSON({
        moduleName: 'Mô-đun 10: Tích lũy Tĩnh tải Sàn & Tường trên Dầm (A1)',
        standard: result.standardRef,
        inputs: { storyHeight, beamHeight, wallThickness, brickType, plasterThickness, openingPercent, allowableFloorGd },
        outputs: {
          floorGk_kNm2: result.floorGk,
          floorGd_kNm2: result.floorGd,
          wallQk_kNm: result.wallQk,
          wallQd_kNm: result.wallQd,
          netWallHeight_m: result.netWallHeight,
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
          <Layers size={22} color="var(--accent-primary)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Mô-đun 10: Tích lũy Tĩnh tải Sàn Hoàn thiện &amp; Tường xây trên Dầm
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Trích dẫn pháp lý: <strong>TCVN 2737:2023 — Bảng 3 &amp; Mục 5 (Hệ số tin cậy γ<sub>f</sub> tra cứu chuẩn hóa)</strong>
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

      {/* Preset selector bar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '14px 0 16px 0', padding: '10px 14px', background: 'var(--bg-card-secondary, rgba(255,255,255,0.03))', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mẫu sàn cấu tạo sẵn:</span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              style={{
                fontSize: '0.8rem',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              {p.name}
            </button>
          ))}
          <button
            key="reset"
            type="button"
            onClick={() => applyPreset('residential')}
            style={{
              fontSize: '0.8rem',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Khôi phục mặc định"
          >
            <RotateCcw size={13} />
            <span>Mặc định</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: Floor Finish vs Masonry Wall */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
        {/* Left Column: Floor Layers */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={17} />
              <span>Phần A: Các lớp Hoàn thiện Sàn (G<sub>k</sub>, G<sub>d</sub>)</span>
            </h4>
            <button
              type="button"
              onClick={handleAddLayer}
              style={{
                fontSize: '0.78rem',
                padding: '3px 8px',
                borderRadius: '5px',
                border: '1px solid var(--accent-primary)',
                background: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={13} />
              <span>Thêm lớp</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '6px 4px' }}>Tên lớp cấu tạo</th>
                  <th style={{ padding: '6px 4px', width: '65px' }}>Dày (mm)</th>
                  <th style={{ padding: '6px 4px', width: '65px' }}>γ (kN/m³)</th>
                  <th style={{ padding: '6px 4px', width: '55px' }}>γ<sub>f</sub></th>
                  <th style={{ padding: '6px 4px', width: '30px' }}></th>
                </tr>
              </thead>
              <tbody>
                {layers.map((l) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border-color-soft, rgba(255,255,255,0.05))' }}>
                    <td style={{ padding: '4px' }}>
                      <input
                        type="text"
                        value={l.name}
                        onChange={(e) => handleLayerChange(l.id, 'name', e.target.value)}
                        style={{ width: '100%', padding: '4px 6px', fontSize: '0.8rem', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ padding: '4px' }}>
                      <input
                        type="number"
                        value={l.thickness}
                        onChange={(e) => handleLayerChange(l.id, 'thickness', Number(e.target.value))}
                        style={{ width: '100%', padding: '4px 6px', fontSize: '0.8rem', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ padding: '4px' }}>
                      <input
                        type="number"
                        step="0.5"
                        value={l.density}
                        onChange={(e) => handleLayerChange(l.id, 'density', Number(e.target.value))}
                        style={{ width: '100%', padding: '4px 6px', fontSize: '0.8rem', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ padding: '4px' }}>
                      <input
                        type="number"
                        step="0.05"
                        value={l.gammaF}
                        onChange={(e) => handleLayerChange(l.id, 'gammaF', Number(e.target.value))}
                        style={{ width: '100%', padding: '4px 6px', fontSize: '0.8rem', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ padding: '4px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveLayer(l.id)}
                        disabled={layers.length <= 1}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: layers.length <= 1 ? 'var(--text-muted)' : 'var(--accent-red, #ef4444)',
                          cursor: layers.length <= 1 ? 'not-allowed' : 'pointer',
                          padding: '2px',
                        }}
                        title="Xóa lớp"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Giới hạn tĩnh tải cho phép [G<sub>d</sub>] (kN/m²):
            </label>
            <input
              type="number"
              step="0.5"
              value={allowableFloorGd}
              onChange={(e) => setAllowableFloorGd(Number(e.target.value))}
              style={{ width: '85px', padding: '4px 8px', fontSize: '0.82rem', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>
        </div>

        {/* Right Column: Wall on Beam */}
        <div className="calc-subcard" style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.98rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🧱 Phần B: Tải trọng Tường xây trên Dầm (q<sub>w,k</sub>, q<sub>w,d</sub>)</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Chiều cao tầng H<sub>t</sub> (m):</label>
              <input
                type="number"
                step="0.1"
                value={storyHeight}
                onChange={(e) => setStoryHeight(Number(e.target.value))}
                style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Chiều cao dầm h<sub>d</sub> (m):</label>
              <input
                type="number"
                step="0.05"
                value={beamHeight}
                onChange={(e) => setBeamHeight(Number(e.target.value))}
                style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Bề dày tường t<sub>w</sub> (mm):</label>
              <input
                type="number"
                step="10"
                value={wallThickness}
                onChange={(e) => setWallThickness(Number(e.target.value))}
                style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Trát vữa 2 mặt t (mm):</label>
              <input
                type="number"
                step="5"
                value={plasterThickness}
                onChange={(e) => setPlasterThickness(Number(e.target.value))}
                style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '10px', fontSize: '0.82rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>Chủng loại gạch xây (TCVN 2737):</label>
            <select
              value={brickType}
              onChange={(e) => setBrickType(e.target.value)}
              style={{ width: '100%', padding: '5px 8px', background: 'var(--bg-input, #1e293b)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            >
              {Object.entries(BRICK_TYPES_TCVN2737).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name} (γ = {v.density} kN/m³)
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '10px', fontSize: '0.82rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '3px' }}>
              Tỷ lệ mở cửa sổ/cửa đi (% diện tích tường):
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={openingPercent}
                onChange={(e) => setOpeningPercent(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ minWidth: '40px', fontWeight: 600, color: 'var(--text-primary)' }}>{openingPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result.valid ? (
        <div style={{ marginTop: '18px', padding: '16px', background: 'var(--bg-card-secondary, rgba(255,255,255,0.02))', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            {/* Tile 1: Floor Gk/Gd */}
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tĩnh tải sàn G<sub>k</sub> / G<sub>d</sub></div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
                {result.floorGk} / {result.floorGd} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kN/m²</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {result.processedLayers.length} lớp hoàn thiện
              </div>
            </div>

            {/* Tile 2: Utilization Eta */}
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hệ số sử dụng η (Sàn)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.utilization.badgeColor || 'var(--text-primary)', marginTop: '4px' }}>
                η = {result.utilization.eta.toFixed(3)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {result.utilization.icon} {result.utilization.label}
              </div>
            </div>

            {/* Tile 3: Wall on Beam */}
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tải tường trên dầm q<sub>w,k</sub> / q<sub>w,d</sub></div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
                {result.wallQk} / {result.wallQd} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kN/m</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                H<sub>w</sub> = {result.netWallHeight} m (trừ {openingPercent}% mở)
              </div>
            </div>

            {/* Tile 4: Wall unit weight */}
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Trọng lượng tường m²</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {result.gWallTotalK} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kN/m²</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Gạch: {result.gBrickK} + Trát: {result.gPlasterK}
              </div>
            </div>
          </div>

          {/* Step-by-step Audit Trail */}
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
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-red, #ef4444)', borderRadius: '6px', color: 'var(--accent-red, #ef4444)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertTriangle size={18} />
          <span>{result.errors.join('; ')}</span>
        </div>
      )}

      {/* Modals */}
      {phuLucData && (
        <PhuLucCalculationModal
          isOpen={isPhuLucOpen}
          onClose={() => setIsPhuLucOpen(false)}
          data={phuLucData}
        />
      )}
      {handoffData && (
        <HandoffModal
          isOpen={isHandoffOpen}
          onClose={() => setIsHandoffOpen(false)}
          handoffData={handoffData}
        />
      )}
    </div>
  );
}
