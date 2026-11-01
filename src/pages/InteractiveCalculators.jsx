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
  Building,
  TrendingUp,
  Shield,
  Boxes,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import CalcWindTCVN2737 from '../components/calculators/CalcWindTCVN2737';
import CalcLiveLoadReduction from '../components/calculators/CalcLiveLoadReduction';
import CalcBeamRebar from '../components/calculators/CalcBeamRebar';
import CalcBoltCapacity from '../components/calculators/CalcBoltCapacity';
import CalcPileCapacity from '../components/calculators/CalcPileCapacity';
import CalcAnchorageLap from '../components/calculators/CalcAnchorageLap';
import CalcRCBeamAdvanced from '../components/calculators/CalcRCBeamAdvanced';
import CalcLoadCombination from '../components/calculators/CalcLoadCombination';
import CalcPunchingShear from '../components/calculators/CalcPunchingShear';
import CalcDeadLoadBuilder from '../components/calculators/CalcDeadLoadBuilder';

export default function InteractiveCalculators() {
  const [selectedCalc, setSelectedCalc] = useState('all');

  const modules = [
    { id: 'all', label: 'Tất cả 10 Mô-đun (Toàn diện)', icon: <Calculator size={17} /> },
    { id: 'wind', label: '1. Gió TCVN 2737:2023', icon: <Wind size={17} /> },
    { id: 'liveload', label: '2. Chiết giảm Hoạt tải', icon: <Layers size={17} /> },
    { id: 'beam', label: '3. Cốt thép Dầm 5574:2018', icon: <Building2 size={17} /> },
    { id: 'bolt', label: '4. Bu lông CĐC 5575:2024', icon: <Hammer size={17} /> },
    { id: 'pile', label: '5. Sức chịu tải Cọc SPT', icon: <CheckCircle size={17} /> },
    { id: 'anchorage', label: '6. Neo & Nối thép 5574', icon: <Compass size={17} /> },
    { id: 'beamadvanced', label: '7. Dầm Cốt kép & Cắt (B1)', icon: <Building size={17} /> },
    { id: 'combos', label: '8. Tổ hợp ULS/SLS Envelope (A4)', icon: <TrendingUp size={17} /> },
    { id: 'punching', label: '9. Chọc thủng Sàn nấm (B4)', icon: <Shield size={17} /> },
    { id: 'deadload', label: '10. Tĩnh tải Sàn & Tường (A1)', icon: <Boxes size={17} /> },
  ];

  return (
    <div className="interactive-calculators-container">
      <PageHeader
        title="8. Bộ Công cụ Tính toán Tương tác TCVN (10 Mô-đun)"
        breadcrumb="Trang chủ / 8. Máy tính Tương tác TCVN"
        description="Hệ thống máy tính kỹ thuật kết cấu chuẩn 4 tầng (Zero-Error Tolerance): 10 mô-đun chuyên sâu (Tải trọng Gió/Tĩnh tải A1/Hoạt tải/Tổ hợp A4, BTCT Dầm đơn/Dầm kép B1/Chọc thủng B4/Neo nối, Thép Bu lông CĐC, Nền móng Cọc SPT) tích hợp Policy Engine, Phụ lục A4 & Handoff Bridge SKILL_BRIDGE v2.1.0."
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
          Toàn bộ 10 mô-đun tính toán tương tác tuân thủ nghiêm ngặt chuẩn mực: <strong>(1) Input có kiểm soát biên</strong> &rarr;{' '}
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
      {(selectedCalc === 'all' || selectedCalc === 'beamadvanced') && <CalcRCBeamAdvanced />}
      {(selectedCalc === 'all' || selectedCalc === 'combos') && <CalcLoadCombination />}
      {(selectedCalc === 'all' || selectedCalc === 'punching') && <CalcPunchingShear />}
      {(selectedCalc === 'all' || selectedCalc === 'deadload') && <CalcDeadLoadBuilder />}
    </div>
  );
}
