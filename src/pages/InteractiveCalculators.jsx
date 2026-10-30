import { useState } from 'react';
import {
  Calculator,
  Wind,
  Layers,
  Building2,
  Hammer,
  CheckCircle,
  Compass,
  Sparkles,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import CalcWindTCVN2737 from '../components/calculators/CalcWindTCVN2737';
import CalcLiveLoadReduction from '../components/calculators/CalcLiveLoadReduction';
import CalcBeamRebar from '../components/calculators/CalcBeamRebar';
import CalcBoltCapacity from '../components/calculators/CalcBoltCapacity';
import CalcPileCapacity from '../components/calculators/CalcPileCapacity';
import CalcAnchorageLap from '../components/calculators/CalcAnchorageLap';

export default function InteractiveCalculators() {
  const [selectedCalc, setSelectedCalc] = useState('all');

  const modules = [
    { id: 'all', label: 'Tất cả 6 Mô-đun (P1 & P2)', icon: <Calculator size={17} /> },
    { id: 'wind', label: '1. Gió TCVN 2737:2023', icon: <Wind size={17} /> },
    { id: 'liveload', label: '2. Chiết giảm Hoạt tải', icon: <Layers size={17} /> },
    { id: 'beam', label: '3. Cốt thép Dầm 5574:2018', icon: <Building2 size={17} /> },
    { id: 'bolt', label: '4. Bu lông CĐC 5575:2024', icon: <Hammer size={17} /> },
    { id: 'pile', label: '5. Sức chịu tải Cọc SPT', icon: <CheckCircle size={17} /> },
    { id: 'anchorage', label: '6. Neo & Nối thép 5574', icon: <Compass size={17} /> },
  ];

  return (
    <div className="interactive-calculators-container">
      <PageHeader
        title="8. Bộ Công cụ Tính toán Tương tác TCVN (6 Mô-đun Tinh hoa AI Agent)"
        breadcrumb="Trang chủ / 8. Máy tính Tương tác TCVN"
        description="Hệ thống máy tính kỹ thuật kết cấu chuẩn 4 tầng (Zero-Error Tolerance) tích hợp Policy Engine & Handoff Bridge SKILL_BRIDGE v2.1.0 cho AI Agents."
      />

      <div
        className="card"
        style={{
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(16,185,129,0.10) 100%)',
          border: '1px solid rgba(102,126,234,0.35)',
        }}
      >
        <h2 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} color="var(--accent-gold)" />
          <span className="gradient-text">Kiến trúc Tính toán Tinh hoa Kết nối AI Agent Ecosystem</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
          Toàn bộ 6 mô-đun tính toán tương tác tuân thủ nghiêm ngặt chuẩn mực: <strong>(1) Input có kiểm soát biên</strong> &rarr;{' '}
          <strong>(2) Deterministic Math Engine theo công thức gốc TCVN</strong> &rarr;{' '}
          <strong>(3) Đánh giá chỉ số sử dụng &eta; (🟢/🟡/🟠/🔴) &amp; Khuyến nghị Policy Engine (Value Engineering / Cảnh báo an toàn)</strong> &rarr;{' '}
          <strong>(4) Xuất bước tính thay số và Cầu nối Handoff JSON (SKILL_BRIDGE) cho AI Agent lập Thuyết minh .docx</strong>.
        </p>
      </div>

      <div className="tab-nav">
        {modules.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`tab-btn ${selectedCalc === m.id ? 'active' : ''}`}
            onClick={() => setSelectedCalc(m.id)}
          >
            {m.icon}
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {(selectedCalc === 'all' || selectedCalc === 'wind') && <CalcWindTCVN2737 />}
      {(selectedCalc === 'all' || selectedCalc === 'liveload') && <CalcLiveLoadReduction />}
      {(selectedCalc === 'all' || selectedCalc === 'beam') && <CalcBeamRebar />}
      {(selectedCalc === 'all' || selectedCalc === 'bolt') && <CalcBoltCapacity />}
      {(selectedCalc === 'all' || selectedCalc === 'pile') && <CalcPileCapacity />}
      {(selectedCalc === 'all' || selectedCalc === 'anchorage') && <CalcAnchorageLap />}
    </div>
  );
}
