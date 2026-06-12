import { useState } from 'react';
import CollapsibleSection from '../components/CollapsibleSection';
import { 
  BookOpen, 
  ShieldAlert, 
  Layers, 
  Activity, 
  FileText, 
  Calculator, 
  TrendingUp
} from 'lucide-react';

export default function RCComponents() {
  const [activeTab, setActiveTab] = useState('theory');

  // Seismic Calculator States
  const [agr, setAgr] = useState(0.082);
  const [importance, setImportance] = useState(1.0);

  // Spacing Calculator States
  const [calcElement, setCalcElement] = useState('beam');
  const [calcDimension, setCalcDimension] = useState(400);
  const [calcDbl, setCalcDbl] = useState(16);
  const [calcDuctility, setCalcDuctility] = useState('DCM');

  // Ground Acceleration Calculation
  const calculatedAg = (agr * importance).toFixed(4);
  let seismicRecommendation;
  if (calculatedAg < 0.04) {
    seismicRecommendation = 'Không cần thiết kế kháng chấn (ag < 0.04g)';
  } else if (calculatedAg < 0.08) {
    seismicRecommendation = 'Chỉ áp dụng giải pháp kháng chấn giảm nhẹ (yêu cầu cấu tạo tối thiểu, 0.04g ≤ ag < 0.08g)';
  } else {
    seismicRecommendation = 'Bắt buộc tính toán và cấu tạo kháng chấn đầy đủ (ag ≥ 0.08g, q ≥ 1.5, chọn DCM hoặc DCH)';
  }

  // Spacing Calculation
  let calculatedSpacing;
  if (calcElement === 'beam') {
    if (calcDuctility === 'DCH') {
      calculatedSpacing = Math.min(calcDimension / 4, 240, 150, 6 * calcDbl);
    } else {
      calculatedSpacing = Math.min(calcDimension / 4, 192, 225, 8 * calcDbl);
    }
  } else {
    // Column
    const b0 = calcDimension - 50; // Assume 50mm cover total (25mm each side)
    if (calcDuctility === 'DCH') {
      calculatedSpacing = Math.min(b0 / 3, 125, 6 * calcDbl);
    } else {
      calculatedSpacing = Math.min(b0 / 2, 175, 8 * calcDbl);
    }
  }
  calculatedSpacing = Math.floor(calculatedSpacing);

  return (
    <div>
      <style>{`
        .tab-nav {
          display: flex;
          gap: 6px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
          flex-wrap: wrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .tab-nav::-webkit-scrollbar {
          display: none;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 20px;
          background: var(--overlay-very-light);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 600;
          font-size: 1.15rem;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tab-btn:hover {
          background: var(--overlay-light);
          color: var(--text-primary);
        }
        .tab-btn.active {
          background: var(--accent-gradient);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }
        @media (max-width: 768px) {
          .tab-nav {
            flex-wrap: nowrap;
            gap: 6px;
            margin-bottom: 16px;
            padding-bottom: 8px;
          }
          .tab-btn {
            padding: 12px 20px;
            font-size: 1.15rem;
            gap: 4px;
          }
        }
        .rc-section {
          animation: fadeIn 0.4s ease-out;
        }
        .formula-units {
          font-size: 1.15rem;
          color: var(--accent-secondary);
          margin-top: 4px;
          text-align: center;
        }
        .params-list {
          list-style: none;
          padding-left: 0;
          margin: 12px 0 0 0;
        }
        .params-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 1.15rem;
        }
        .bullet-blue {
          color: var(--accent-primary);
          font-weight: bold;
          margin-top: -2px;
        }
        .grid-half {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .grid-half {
            grid-template-columns: 1fr;
          }
        }
        .spec-badge {
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent-primary);
          padding: 12px 20px;
          border-radius: 4px;
          font-size: 1.15rem;
          font-weight: 600;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .highlight-text {
          color: var(--text-primary);
          font-weight: 600;
        }
      `}</style>

      <h1 className="page-title">BTCT Cấu kiện (TCVN 5574:2018)</h1>

      <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)', border: '1px solid rgba(102,126,234,0.3)', boxShadow: '0 0 30px rgba(102,126,234,0.15)' }}>
        <h2 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={24} color="var(--accent-primary)" />
          <span className="gradient-text">Tính toán Kết cấu Bê tông Cốt thép</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Báo cáo chuyên sâu và công cụ tra cứu cơ sở tính toán cấu kiện bê tông cốt thép (Dầm, Cột, Sàn, Vách, Móng) theo Tiêu chuẩn Quốc gia <strong>TCVN 5574:2018</strong> và Thiết kế kháng chấn theo <strong>TCVN 9386:2012</strong>.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'theory' ? 'active' : ''}`} onClick={() => setActiveTab('theory')}>
          <Activity size={18} />
          4.1. Triết lý & Phi tuyến
        </button>
        <button className={`tab-btn ${activeTab === 'beam' ? 'active' : ''}`} onClick={() => setActiveTab('beam')}>
          <Calculator size={18} />
          4.2. Dầm (Uốn - Cắt - Xoắn)
        </button>
        <button className={`tab-btn ${activeTab === 'column' ? 'active' : ''}`} onClick={() => setActiveTab('column')}>
          <Layers size={18} />
          4.3. Cột & Uốn dọc P-Δ
        </button>
        <button className={`tab-btn ${activeTab === 'slab' ? 'active' : ''}`} onClick={() => setActiveTab('slab')}>
          <ShieldAlert size={18} />
          4.4. Sàn phẳng (Chọc thủng)
        </button>
        <button className={`tab-btn ${activeTab === 'wall' ? 'active' : ''}`} onClick={() => setActiveTab('wall')}>
          <FileText size={18} />
          4.5. Vách cứng chịu cắt
        </button>
        <button className={`tab-btn ${activeTab === 'seismic' ? 'active' : ''}`} onClick={() => setActiveTab('seismic')}>
          <TrendingUp size={18} />
          4.6. Thiết kế Kháng chấn (9386)
        </button>
      </div>

      {/* Tab 1: Triết lý & Phi tuyến */}
      {activeTab === 'theory' && (
        <div className="rc-section">
          <div className="grid-half">
            <CollapsibleSection defaultOpen={false} title="1.1. Triết lý cốt lõi & Giả thiết nền tảng">
              <p style={{ lineHeight: 1.6 }}>
                Thay đổi mang tính triết lý sâu sắc nhất của <strong>TCVN 5574:2018</strong> so với phiên bản 2012 là việc chuyển giao từ các công thức giải tích bán thực nghiệm dựa trên biểu đồ ứng suất hình chữ nhật tương đương sang việc áp dụng toàn diện <strong>Mô hình biến dạng phi tuyến (Non-linear Strain Model)</strong>.
              </p>
              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>Ba giả thiết cơ bản:</h4>
              <ul className="bullet-list">
                <li><strong>Giả thiết tiết diện phẳng (Bernoulli):</strong> Biến dạng tỷ đối dọc trục phân bố tuyến tính trên toàn bộ chiều cao tiết diện.</li>
                <li><strong>Sự bám dính hoàn hảo:</strong> Biến dạng của cốt thép và lớp bê tông bao quanh tại cùng một vị trí tọa độ là bằng nhau. Không có sự trượt giữa cốt thép và bê tông.</li>
                <li><strong>Cường độ chịu kéo của bê tông:</strong> Bỏ qua hoàn toàn trong các tính toán độ bền (Trạng thái giới hạn 1), trừ các cấu kiện đặc thù chống nứt.</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="1.2. Đặc trưng Vật liệu & Hệ số An toàn">
              <p style={{ lineHeight: 1.6 }}>
                Cường độ tính toán của vật liệu được chuyển đổi từ cường độ tiêu chuẩn thông qua các hệ số độ tin cậy vật liệu:
              </p>
              
              <div className="formula-card">
                <div className="formula-line"><var>R<sub>b</sub></var> = <span className="fraction"><span className="numerator"><var>R<sub>b,n</sub></var></span><span className="denominator">&gamma;<sub>b</sub></span></span></div>
                <div className="formula-line"><var>R<sub>bt</sub></var> = <span className="fraction"><span className="numerator"><var>R<sub>bt,n</sub></var></span><span className="denominator">&gamma;<sub>bt</sub></span></span></div>
                <div className="formula-line"><var>R<sub>s</sub></var> = <span className="fraction"><span className="numerator"><var>R<sub>s,n</sub></var></span><span className="denominator">&gamma;<sub>s</sub></span></span></div>
                <div className="formula-units">Đơn vị: MPa hoặc N/mm&sup2;</div>
              </div>

              <ul className="bullet-list" style={{ fontSize: '0.95rem' }}>
                <li><strong>γ_b (Hệ số độ tin cậy bê tông chịu nén):</strong> γ_b = 1.3 đối với trạng thái giới hạn thứ nhất (TTGH1).</li>
                <li><strong>γ_bt (Hệ số độ tin cậy bê tông chịu kéo):</strong> γ_bt = 1.5 đối với TTGH1.</li>
                <li><strong>γ_s (Hệ số độ tin cậy của cốt thép):</strong> γ_s = 1.15 đối với các mác thép thường gặp (CB300-V, CB400-V, CB500-V).</li>
                <li><strong>Cường độ nén cốt thép giới hạn (R_sc):</strong> Khi nén, R_sc giới hạn không vượt quá <strong>400 MPa</strong> nhằm đảm bảo sự tương thích biến dạng với thớ bê tông ngoài cùng (biến dạng giới hạn ε_b2 = 0.002).</li>
              </ul>
            </CollapsibleSection>
          </div>

          <CollapsibleSection title="1.3. Hệ số điều kiện làm việc của Bê tông (γ_bi)" style={{ marginTop: '24px' }}>
            <p style={{ lineHeight: 1.6, marginBottom: '16px' }}>
              Ứng xử thực tế của bê tông trong cấu kiện chịu ảnh hưởng của điều kiện thi công và thời gian tác dụng tải trọng. Cường độ tính toán thực tế được nhân với các hệ số điều kiện làm việc:
            </p>
            <div className="spec-table-container">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Hệ số</th>
                    <th>Ý nghĩa vật lý</th>
                    <th>Trị số quy định</th>
                    <th>Phạm vi áp dụng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>γ_b1</strong></td>
                    <td>Ảnh hưởng của tác dụng dài hạn của tải trọng</td>
                    <td>0.90</td>
                    <td>Áp dụng cho hầu hết các tổ hợp tải trọng có kể đến tải trọng dài hạn.</td>
                  </tr>
                  <tr>
                    <td><strong>γ_b2</strong></td>
                    <td>Ảnh hưởng của việc bê tông hóa hủy hoại giòn (tải trọng lặp)</td>
                    <td>0.90</td>
                    <td>Áp dụng cho kết cấu chịu tải trọng lặp hoặc động lực học nhẹ.</td>
                  </tr>
                  <tr>
                    <td><strong>γ_b3</strong></td>
                    <td>Ảnh hưởng của phương đổ bê tông (hiệu ứng phân tầng nước)</td>
                    <td>0.85</td>
                    <td>Bắt buộc đối với các cấu kiện đổ bê tông theo phương thẳng đứng từng lớp cao hơn 1.5m (Cột, vách).</td>
                  </tr>
                  <tr>
                    <td><strong>γ_b5</strong></td>
                    <td>Ảnh hưởng của nhiệt độ môi trường và độ ẩm</td>
                    <td>Biến thiên</td>
                    <td>Phụ thuộc vào mức độ sấy nóng bê tông hoặc điều kiện khí hậu khô nóng đặc thù.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Tab 2: Cấu kiện Dầm */}
      {activeTab === 'beam' && (
        <div className="rc-section">
          <div className="grid-half">
            <CollapsibleSection defaultOpen={false} title="2.1. Khả năng chịu Uốn (TTGH1)">
              <p style={{ lineHeight: 1.6 }}>
                Khả năng chịu lực giới hạn của dầm chịu uốn dựa trên việc cân bằng ngẫu lực trên mặt cắt ngang. Với tiết diện chữ nhật đặt cốt thép đơn, momen kháng uốn giới hạn M_ult được tính như sau:
              </p>

              <div className="formula-card">
                <div className="formula-line"><var>M<sub>ult</sub></var> = &alpha;<sub><var>m</var></sub> &bull; <var>R<sub>b</sub></var> &bull; <var>b</var> &bull; <var>h<sub>0</sub>&sup2;</var></div>
                <div className="formula-line">&alpha;<sub><var>m</var></sub> = &xi; &bull; (1 - 0.5 &bull; &xi;)</div>
                <div className="formula-line">&xi; = <span className="fraction"><span className="numerator"><var>x</var></span><span className="denominator"><var>h<sub>0</sub></var></span></span></div>
                <div className="formula-units">Đơn vị: N&bull;mm (đổi ra kN&bull;m bằng cách chia cho 10&sup6;)</div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Ý nghĩa các đại lượng:</h4>
              <ul className="params-list">
                <li><span className="bullet-blue">»</span> <strong>b:</strong> Chiều rộng dầm (mm).</li>
                <li><span className="bullet-blue">»</span> <strong>h_0:</strong> Chiều cao làm việc của tiết diện dầm (h_0 = h - a) (mm), với h là chiều cao dầm và a là khoảng cách từ thớ chịu kéo ngoài cùng đến trọng tâm cốt thép dọc.</li>
                <li><span className="bullet-blue">»</span> <strong>x:</strong> Chiều cao vùng bê tông chịu nén thực tế (mm).</li>
                <li><span className="bullet-blue">»</span> <strong>ξ (xi):</strong> Chiều cao vùng nén tương đối. Yêu cầu khống chế <strong>ξ ≤ ξ_R</strong> (giới hạn chảy dẻo thép trước khi bê tông nén vỡ vụn) để phòng tránh phá hoại giòn.</li>
              </ul>
              
              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>Hệ số Khối ứng suất Tích phân (α, β):</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                Để mô tả chính xác biểu đồ ứng suất phi tuyến, hệ số α (diện tích khối ứng suất) và β (tọa độ điểm đặt hợp lực nén) được tích phân trực tiếp từ biến dạng thớ biên ε_b:
              </p>
              <div className="formula-card" style={{ fontSize: '1.1rem', padding: '16px' }}>
                <div className="formula-line">
                  &alpha; = <span className="fraction">
                    <span className="numerator">&int;<sub>0</sub><sup>&epsilon;<sub>b</sub></sup> &sigma;<sub>b</sub>(&epsilon;) d&epsilon;</span>
                    <span className="denominator"><var>R<sub>b</sub></var> &bull; &epsilon;<sub>b</sub></span>
                  </span>
                </div>
                <div className="formula-line">
                  &beta; = 1 - <span className="fraction">
                    <span className="numerator">&int;<sub>0</sub><sup>&epsilon;<sub>b</sub></sup> &epsilon; &bull; &sigma;<sub>b</sub>(&epsilon;) d&epsilon;</span>
                    <span className="denominator">&epsilon;<sub>b</sub> &bull; &int;<sub>0</sub><sup>&epsilon;<sub>b</sub></sup> &sigma;<sub>b</sub>(&epsilon;) d&epsilon;</span>
                  </span>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="2.2. Kiểm tra Vết nứt & Biến dạng (TTGH2)">
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. Mô-men kháng nứt (M_crc):</h4>
              <p style={{ fontSize: '0.92rem' }}>
                Vết nứt hình thành khi momen uốn do tải trọng tiêu chuẩn vượt quá momen kháng nứt của tiết diện:
              </p>
              <div className="formula-card">
                <div className="formula-line"><var>M<sub>crc</sub></var> = <var>R<sub>bt,ser</sub></var> &bull; <var>W<sub>pl</sub></var></div>
                <div className="formula-units">Đơn vị: N&bull;mm hoặc kN&bull;m</div>
              </div>
              <ul className="params-list" style={{ fontSize: '0.9rem' }}>
                <li><span className="bullet-blue">»</span> <strong>R_bt,ser:</strong> Cường độ chịu kéo tiêu chuẩn của bê tông ở TTGH2 (MPa).</li>
                <li><span className="bullet-blue">»</span> <strong>W_pl:</strong> Mô-men kháng uốn dẻo của tiết diện quy đổi đối với thớ kéo ngoài cùng (mm³).</li>
              </ul>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>2. Bề rộng vết nứt toàn phần (a_cr):</h4>
              <p style={{ fontSize: '0.92rem' }}>
                Được xác định bằng phương pháp chồng chất để kể đến ảnh hưởng của thời gian tác dụng tải trọng:
              </p>
              <div className="formula-card">
                <div className="formula-line"><var>a<sub>cr</sub></var> = <var>a<sub>cr,1</sub></var> - <var>a<sub>cr,2</sub></var> + <var>a<sub>cr,3</sub></var></div>
                <div className="formula-units">Đơn vị: mm (Yêu cầu khống chế &le; 0.3 mm cho ngắn hạn, &le; 0.2 mm cho dài hạn)</div>
              </div>
              <ul className="params-list" style={{ fontSize: '0.88rem' }}>
                <li><span className="bullet-blue">»</span> <strong>a_cr,1:</strong> Bề rộng vết nứt ngắn hạn dưới tác dụng của toàn bộ tải trọng tiêu chuẩn.</li>
                <li><span className="bullet-blue">»</span> <strong>a_cr,2:</strong> Bề rộng vết nứt ngắn hạn dưới tác dụng của tải trọng dài hạn tiêu chuẩn.</li>
                <li><span className="bullet-blue">»</span> <strong>a_cr,3:</strong> Bề rộng vết nứt dài hạn dưới tác dụng của tải trọng dài hạn tiêu chuẩn (kể đến co ngót và từ biến).</li>
              </ul>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>3. Tính toán độ võng dầm (f):</h4>
              <p style={{ fontSize: '0.92rem' }}>
                Tính qua tích phân độ cong dọc trục dầm. Độ cong toàn phần: <strong>1/r = (1/r)_1 - (1/r)_2 + (1/r)_3</strong>. Độ võng lớn nhất:
              </p>
              <div className="formula-card">
                <div className="formula-line"><var>f</var> = <var>s</var> &bull; <var>L&sup2;</var> &bull; <span className="fraction"><span className="numerator">1</span><span className="denominator"><var>r</var></span></span></div>
                <div className="formula-units">Đơn vị: mm (Yêu cầu <var>f</var> &le; <span className="fraction"><span className="numerator"><var>L</var></span><span className="denominator">250</span></span> đối với dầm thường)</div>
              </div>
              <p style={{ fontSize: '0.88rem' }}>
                Với <strong>s</strong> là hệ số phụ thuộc sơ đồ liên kết (s = 5/48 cho dầm đơn giản chịu tải phân bố đều; s = 1/12 cho dầm hai đầu ngàm). <strong>L</strong> là nhịp dầm (mm).
              </p>
            </CollapsibleSection>
          </div>

          <CollapsibleSection title="2.3. Khả năng chống Xoắn & Cắt phối hợp" style={{ marginTop: '24px' }}>
            <div className="grid-half">
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Mô hình dàn không gian (Space Truss Analogy):</h4>
                <p style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                  TCVN 5574:2018 xử lý xoắn bằng cách lý tưởng hóa cấu kiện thành hệ khung dàn không gian. Các dải bê tông nứt chéo đóng vai trò thanh chống nén, cốt đai kín và cốt dọc đóng vai trò thanh kéo.
                </p>
                <div className="formula-card">
                  <div className="formula-line"><var>T<sub>u</sub></var> &le; <var>T<sub>rd,s</sub></var> + <var>T<sub>rd,l</sub></var></div>
                  <div className="formula-units">Đơn vị: N&bull;mm hoặc kN&bull;m</div>
                </div>
                <ul className="params-list" style={{ fontSize: '0.9rem' }}>
                  <li><span className="bullet-blue">»</span> <strong>T_rd,s:</strong> Sức kháng xoắn giới hạn do hệ cốt thép đai kín cung cấp.</li>
                  <li><span className="bullet-blue">»</span> <strong>T_rd,l:</strong> Sức kháng xoắn giới hạn do hệ cốt thép dọc dọc cung cấp.</li>
                  <li><span className="bullet-blue">»</span> <strong>Yêu cầu cấu tạo:</strong> Cốt đai xoắn bắt buộc phải là đai khép kín có móc neo 135°. Khoảng cách đai <strong>s_w ≤ u/8</strong> (u là chu vi vòng đai) và <strong>s_w ≤ 300mm</strong>. Cốt dọc chống xoắn phân bố đều quanh chu vi, khoảng cách giữa các thanh dọc ≤ 300mm.</li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Trạng thái tương tác Xoắn - Cắt đồng thời:</h4>
                <p style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Tại các dầm biên chịu mô-men xoắn lớn từ sàn, ứng suất trượt do cắt V và xoắn T cộng hưởng làm nứt vỡ nghiêng bê tông mặt bên. Tiêu chuẩn khống chế điều kiện tương tác phi tuyến:
                </p>
                <div className="formula-card">
                  <div className="formula-line">
                    <span className="fraction"><span className="numerator"><var>T</var></span><span className="denominator"><var>T<sub>u</sub></var></span></span>&sup2; + 
                    <span className="fraction"><span className="numerator"><var>V</var></span><span className="denominator"><var>V<sub>u</sub></var></span></span>&sup2; &le; 1.0
                  </div>
                  <div className="formula-units">Tỷ số không thứ nguyên</div>
                </div>
                <ul className="params-list" style={{ fontSize: '0.9rem' }}>
                  <li><span className="bullet-blue">»</span> <strong>T, V:</strong> Momen xoắn và Lực cắt do ngoại lực (kN.m, kN).</li>
                  <li><span className="bullet-blue">»</span> <strong>T_u, V_u:</strong> Khả năng chịu xoắn thuần túy và chịu cắt thuần túy giới hạn của cấu kiện.</li>
                  <li><span className="bullet-blue">»</span> <strong>Khuyến nghị thiết kế:</strong> Tại các dầm chịu xoắn cắt lớn, nên chủ động tăng chiều dày lớp bê tông bảo vệ <strong>a_b thêm 5 - 10mm</strong> để tránh bong tróc bê tông (spalling) sớm khi lõi bắt đầu chịu xoắn.</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Tab 3: Cấu kiện Cột */}
      {activeTab === 'column' && (
        <div className="rc-section">
          <div className="grid-half">
            <CollapsibleSection defaultOpen={false} title="3.1. Nén lệch tâm & Tích phân Không gian">
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. Độ lệch tâm ngẫu nhiên (e_0):</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                Không tồn tại cột nén đúng tâm tuyệt đối. TCVN quy định mọi bài toán cột phải xét độ lệch tâm ban đầu ngẫu nhiên:
              </p>
              <div className="formula-card">
                <div className="formula-line"><var>e<sub>0</sub></var> = max( <span className="fraction"><span className="numerator"><var>L</var></span><span className="denominator">600</span></span>, <span className="fraction"><span className="numerator"><var>h</var></span><span className="denominator">30</span></span>, 10 mm )</div>
                <div className="formula-units">Đơn vị: mm (Với <var>L</var> là chiều dài cột, <var>h</var> là kích thước cạnh tiết diện)</div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>2. Cân bằng Lệch tâm xiên Không gian:</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                Khi cột chịu tải trọng lệch tâm xiên (N, M_x, M_y), mô hình biến dạng phi tuyến giải số bằng hệ phương trình tích phân cân bằng sức kháng:
              </p>
              <div className="formula-card">
                <div className="formula-line"><var>N</var> = &int;<sub><var>A<sub>b</sub></var></sub> &sigma;<sub>b</sub> d<var>A</var> + &sum; &sigma;<sub><var>s,i</var></sub> &bull; <var>A<sub>s,i</sub></var></div>
                <div className="formula-line"><var>M<sub>x</sub></var> = &int;<sub><var>A<sub>b</sub></var></sub> &sigma;<sub>b</sub> &bull; <var>y</var> d<var>A</var> + &sum; &sigma;<sub><var>s,i</var></sub> &bull; <var>A<sub>s,i</sub></var> &bull; <var>y<sub>i</sub></var></div>
                <div className="formula-line"><var>M<sub>y</sub></var> = &int;<sub><var>A<sub>b</sub></var></sub> &sigma;<sub>b</sub> &bull; <var>x</var> d<var>A</var> + &sum; &sigma;<sub><var>s,i</var></sub> &bull; <var>A<sub>s,i</sub></var> &bull; <var>x<sub>i</sub></var></div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                (Lực dọc N mang dấu dương khi nén, âm khi kéo. y, x là tọa độ của phân tố diện tích hoặc cốt thép so với trục trung hòa).
              </p>
              <ul className="bullet-list" style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                <li><strong>Hàm lượng thép dọc (μ):</strong> Khống chế tối thiểu <strong>μ_min = 0.5%</strong>. Mức thiết kế hợp lý tối đa là <strong>μ_max = 4.0%</strong> để tránh ách tắc cốt liệu lớn khi đổ bê tông cột.</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="3.2. Uốn dọc cục bộ & Mô-men cấp 2 (Hiệu ứng P-Δ)">
              <p style={{ lineHeight: 1.6 }}>
                Cột thanh mảnh chịu lực dọc nén lớn N sẽ sinh ra mô-men thứ cấp do uốn dọc ngang. Mô-men uốn tính toán được khuếch đại thông qua hệ số uốn dọc η (eta):
              </p>

              <div className="formula-card">
                <div className="formula-line"><var>M</var> = <var>M<sub>0</sub></var> &bull; &eta;</div>
                <div className="formula-line">&eta; = <span className="fraction"><span className="numerator">1</span><span className="denominator">1 - <span className="fraction"><span className="numerator"><var>N</var></span><span className="denominator"><var>N<sub>cr</sub></var></span></span></span></span></div>
                <div className="formula-line"><var>N<sub>cr</sub></var> = <span className="fraction"><span className="numerator">&pi;&sup2; &bull; <var>D</var></span><span className="denominator"><var>L<sub>0</sub>&sup2;</var></span></span></div>
                <div className="formula-units"><var>N<sub>cr</sub></var>: Lực nén tới hạn Euler (N hoặc kN); &eta;: hệ số uốn dọc (không thứ nguyên)</div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Độ cứng chống uốn hiệu dụng (D):</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
                Độ cứng D của cột bị suy giảm do nứt bê tông và biến dạng từ biến dài hạn dưới tác dụng của tải trọng tĩnh:
              </p>
              <div className="formula-card">
                <div className="formula-line"><var>D</var> = <span className="fraction"><span className="numerator">0.15 &bull; <var>E<sub>b</sub></var> &bull; <var>I<sub>g</sub></var></span><span className="denominator">&phi;<sub><var>L</var></sub> &bull; (1 + &delta;<sub><var>e</var></sub>)</span></span> + <var>E<sub>s</sub></var> &bull; <var>I<sub>s</sub></var></div>
              </div>
              <ul className="params-list" style={{ fontSize: '0.88rem', marginTop: '12px' }}>
                <li><span className="bullet-blue">»</span> <strong>E_b, E_s:</strong> Mô đun đàn hồi bê tông, cốt thép (MPa).</li>
                <li><span className="bullet-blue">»</span> <strong>I_g, I_s:</strong> Mô men quán tính của tiết diện bê tông nguyên và cốt thép đối với trọng tâm tiết diện (mm^4).</li>
                <li><span className="bullet-blue">»</span> <strong>φ_L (Hệ số tác dụng dài hạn):</strong> Kể đến từ biến (thường φ_L = 1.0 - 2.0).</li>
                <li><span className="bullet-blue">»</span> <strong>δ_e (Độ lệch tâm tương đối):</strong> δ_e = e_0 / h.</li>
                <li><span className="bullet-blue">»</span> <strong>Khuyến nghị cấu tạo:</strong> Nếu tính toán cho thấy <strong>η &gt; 1.2</strong>, mô-men thứ cấp rất lớn. Nên tăng kích thước hình học cột (b, h) để tăng I_g (lũy thừa bậc 3) nhằm giảm hệ số η nhanh hơn là tăng hàm lượng thép.</li>
              </ul>
            </CollapsibleSection>
          </div>
        </div>
      )}

      {/* Tab 4: Sàn phẳng */}
      {activeTab === 'slab' && (
        <div className="rc-section">
          <div className="grid-half">
            <CollapsibleSection defaultOpen={false} title="4.1. Kháng Chọc Thủng (Punching Shear)">
              <p style={{ lineHeight: 1.6 }}>
                Tại nút giao sàn phẳng không dầm và cột, toàn bộ lực cắt dồn nén cục bộ dễ gây phá hoại chọc thủng giòn theo hình tháp cụt nghiêng góc 45°. Sức kháng chọc thủng giới hạn:
              </p>

              <div className="formula-card">
                <div className="formula-line"><var>F</var> &le; <var>F<sub>b</sub></var> + <var>F<sub>sw</sub></var></div>
                <div className="formula-line"><var>F<sub>b</sub></var> = 0.5 &bull; <var>R<sub>bt</sub></var> &bull; <var>u</var> &bull; <var>h<sub>0</sub></var></div>
                <div className="formula-line"><var>F<sub>sw</sub></var> = 0.8 &bull; <var>q<sub>sw</sub></var> &bull; <var>u</var></div>
                <div className="formula-units">Đơn vị lực: N hoặc kN (1 kN = 1000 N)</div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Ý nghĩa các thông số:</h4>
              <ul className="params-list">
                <li><span className="bullet-blue">»</span> <strong>u:</strong> Chu vi tiết diện tính toán chọc thủng trung bình, cách mép cột một khoảng bằng <strong>0.5 h_0</strong> (mm).</li>
                <li><span className="bullet-blue">»</span> <strong>h_0:</strong> Chiều cao làm việc trung bình của bản sàn (mm).</li>
                <li><span className="bullet-blue">»</span> <strong>q_sw:</strong> Lượng cốt thép đai chọc thủng trên một đơn vị chu vi u (N/mm).</li>
              </ul>

              <div className="alert-box" style={{ marginTop: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div className="alert-box-title" style={{ color: '#ef4444' }}>
                  <ShieldAlert size={18} />
                  <span>SIẾT CHẶT GIỚI HẠN CỐT ĐAI CHỐNG CHỌC THỦNG</span>
                </div>
                <div className="alert-box-content" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Nghiên cứu chỉ ra nếu cốt thép đai quá dày, bê tông vùng nén chéo quanh cột sẽ bị nghiền nát trước khi thép đai đạt giới hạn chảy. Do đó TCVN 5574:2018 quy định giới hạn nghiêm ngặt:
                  <div style={{ color: '#ef4444', fontWeight: 'bold', margin: '8px 0', textAlign: 'center', fontSize: '1.2rem', fontFamily: '\'Cambria Math\', \'Times New Roman\', Times, serif' }}>
                    <var>F<sub>sw</sub></var> &le; 1.0 &bull; <var>F<sub>b</sub></var> &nbsp; | &nbsp; <var>F</var> &le; 2.0 &bull; <var>F<sub>b</sub></var>
                  </div>
                  (Giảm đáng kể so với mức F_sw ≤ 1.5 * F_b ở tiêu chuẩn 2012 cũ để chống phá hoại giòn nén vỡ chéo).
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="4.2. Cấu tạo vùng biên mép sàn phẳng">
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Xử lý xoắn và neo ở biên bản phẳng:</h4>
              <p style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                Mép biên sàn không dầm chịu ứng suất xoắn và uốn cục bộ rất phức tạp. Tiêu chuẩn bắt buộc bố trí các thanh thép cấu tạo dạng <strong>chữ U (U-bars)</strong> gài chặt mép bản biên.
              </p>
              <div style={{ textAlign: 'center', margin: '16px 0', padding: '16px', background: 'var(--overlay-very-light)', borderRadius: '8px', border: '1px dashed var(--border-glass)' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>Mô hình neo cốt thép vùng biên mép sàn</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  [Cốt dọc lớp trên] ──┐ <br/>
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; │ &lt;── Thép chữ U ôm viền mép <br/>
                  [Cốt dọc lớp dưới] ──┘
                </div>
              </div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Vai trò cơ học của cốt thép chữ U:</h4>
              <ul className="bullet-list" style={{ fontSize: '0.92rem' }}>
                <li>Tạo thành một gông kín bo quanh mép chu vi sàn, chống lại sự nứt toác bê tông do ứng suất xoắn cục bộ.</li>
                <li>Đóng vai trò là chốt neo truyền lực hiệu quả cho cốt thép dọc chịu uốn lớp trên và lớp dưới tại đầu mút tự do.</li>
                <li>Khuyên dùng thép có gân vằn (CB300-V, CB400-V) gài chữ U để tối ưu hóa chiều dài neo cốt thép dính bám.</li>
              </ul>
              
              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>Khuyến nghị kỹ thuật xử lý chọc thủng sàn phẳng:</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                Khi lực cắt tập trung quá lớn dẫn đến F_sw vượt quá giới hạn cứng 1.0 * F_b, không được tăng cốt đai đan chọc thủng nữa. Hãy nâng cấp độ bền bê tông (ví dụ từ B30 lên B40) để tăng cường R_bt của bê tông, hoặc tăng chiều dày làm việc h_0 bằng cách làm mũ cột (column capital) hay drop panel.
              </p>
            </CollapsibleSection>
          </div>

          <div style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--accent-primary)" />
              <span>Thiết kế Tiện nghi (SLS): Kiểm soát Rung động Sàn</span>
            </h3>
            <div className="grid-half">
              <CollapsibleSection title="4.3. Nghịch lý Kết cấu & Sinh lý học Rung động">
                <p style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Xu hướng thiết kế sàn nhịp lớn, siêu nhẹ và bê tông cường độ cao dễ dàng thỏa mãn Trạng thái giới hạn chịu lực (ULS), nhưng lại dẫn đến <strong>Tần số tự nhiên (<var>f</var><sub><var>n</var></sub>) thấp</strong> và <strong>Độ cản (&zeta;) kém</strong>. Hệ quả là sàn cực kỳ nhạy cảm với tải trọng động học từ bước chân người.
                </p>
                <div className="alert-yellow" style={{ marginTop: '12px', borderLeftColor: '#ef4444' }}>
                  <div className="alert-yellow-title" style={{ color: '#ef4444' }}>
                    <Activity size={18} />
                    <span>Sinh lý học: Dải tần số nguy hiểm</span>
                  </div>
                  <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    <li><strong>4 Hz - 8 Hz:</strong> Là dải tần số cộng hưởng của các cơ quan nội tạng. Con người sẽ cảm thấy khó chịu tột độ nếu tần số nhịp bước rơi vào vùng này (do cộng hưởng của sóng điều hòa bậc cao từ bước chân).</li>
                    <li><strong>Ngưỡng cảm nhận tối thiểu (Trục Z):</strong> Gia tốc hiệu dụng <var>a</var><sub><var>rms</var></sub> = 0.005 m/s&sup2;. Vượt quá ngưỡng này, trạng thái SLS bị vi phạm gây hoảng sợ tâm lý.</li>
                  </ul>
                </div>
                <div className="param-table-container" style={{ marginTop: '16px' }}>
                  <table className="param-table" style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Phân loại Sàn</th>
                        <th>Ngưỡng <var>f</var><sub><var>n</var></sub></th>
                        <th>Cơ chế Vật lý & Mô phỏng</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="highlight-text">Tần số thấp</td>
                        <td>&lt; 9 Hz</td>
                        <td>
                          <strong>Cộng hưởng (Resonant):</strong> Năng lượng cộng dồn tạo sóng biên độ lớn. <br/>
                          <em>Phân tích ETABS:</em> Trạng thái ổn định (Steady-State).
                        </td>
                      </tr>
                      <tr>
                        <td className="highlight-text">Tần số cao</td>
                        <td>&gt; 9 Hz</td>
                        <td>
                          <strong>Xung lực (Impulsive):</strong> Chấn động bị dập tắt nhanh chóng. <br/>
                          <em>Phân tích ETABS:</em> Lịch sử thời gian (Time-History).
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="4.4. Cạm bẫy ETABS & Nguyên tắc Can thiệp">
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Cạm bẫy Khai báo Khối lượng (Mass Source):</h4>
                <p style={{ lineHeight: 1.6, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Khác với động đất, mô phỏng rung động sàn đòi hỏi nắm bắt các dao động cục bộ ngoài mặt phẳng dọc trục Z.
                </p>
                <ul className="bullet-list" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
                  <li><strong>Bắt buộc:</strong> Chọn <em>Include Vertical Mass</em> để khởi tạo khối lượng dọc trục Z.</li>
                  <li><strong>Tối kỵ:</strong> Không chọn <em>Lump Lateral Mass at Story Levels</em>.</li>
                  <li><strong>Tải trọng:</strong> 100% Dead Load + <strong>Max 10% Live Load</strong>. Hoạt tải ảo tưởng lớn sẽ tạo sức ức chế quán tính giả, làm kết quả gia tốc dự đoán thấp hơn thực tế một cách nguy hiểm.</li>
                  <li><strong>Nguyên tắc 20 Mode:</strong> Khai báo tối thiểu 20 modes hoặc thuật toán phải quét đến giới hạn tần số 20 Hz để không bỏ sót dao động vùng giữa nhịp (Missing Mass Error).</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Can thiệp Kết cấu & Thước đo R:</h4>
                <div className="formula-card" style={{ marginBottom: '12px' }}>
                  <div className="formula-line">
                    <var>Hysteretic Loss Factor</var> = 2 &times; &zeta;
                  </div>
                  <div className="formula-desc">
                    &zeta; = 0.5% - 4.5% (Tùy thuộc có trần giả, vách ngăn, hay sàn trống).
                  </div>
                </div>
                <ul className="bullet-list" style={{ fontSize: '0.9rem' }}>
                  <li><strong>Lưu ý:</strong> Không khắc phục rung bằng cách tăng tĩnh tải (do làm giảm <var>f</var><sub><var>n</var></sub>). Phải tăng độ cứng (chiều dày bản, dầm phụ) hoặc bố trí bộ tiêu tán năng lượng TMD.</li>
                  <li><strong>Thước đo R:</strong> R=1 (Bệnh viện, phòng mổ), R=4 (Văn phòng), R=8 (Hành lang đi bộ). Tải trọng ngắt quãng dùng phương pháp VDV (Vibration Dose Value).</li>
                </ul>
              </CollapsibleSection>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Vách cứng */}
      {activeTab === 'wall' && (
        <div className="rc-section">
          <div className="grid-half">
            <CollapsibleSection defaultOpen={false} title="5.1. Phương pháp Vùng biên chịu Mô-men (Boundary Elements)">
              <p style={{ lineHeight: 1.6 }}>
                Vách cứng chịu tải ngang gió động và động đất làm việc như một console khổng lồ chịu momen uốn lật rất lớn. Tiêu chuẩn áp dụng phương pháp vùng biên:
              </p>
              
              <div style={{ textAlign: 'center', margin: '16px 0', padding: '12px', background: 'var(--overlay-very-light)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '8px' }}>Phân bố tiết diện ngang vách cứng</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  ▕█ Vùng biên █▏───────────────[ Thân vách ]───────────────▕█ Vùng biên █▏ <br/>
                  (Thép dọc cột ẩn) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; (Thép ngang/đứng thân vách)
                </div>
              </div>
              
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                Vách cứng chịu mô-men uốn và tải trọng ngang lớn cần thiết kế vùng biên gia cường ở hai đầu (tiết diện biên). Vùng này bố trí đai dày và cốt dọc mật độ cao đóng vai trò như các cột ẩn chịu kéo/nén ngẫu lực chống lật.
              </p>
            </CollapsibleSection>

            <CollapsibleSection title="5.2. Cốt thép thân vách & Lanh tô liên kết">
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. Hàm lượng cốt thép thân vách tối thiểu:</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
                Đan 2 lớp cốt thép đứng và ngang ở thân vách để chống nứt xiên và phân phối ứng suất cắt:
              </p>
              <div className="formula-card">
                <div className="formula-line">&rho;<sub>v,min</sub> &ge; 0.2% &nbsp; | &nbsp; &rho;<sub>h,min</sub> &ge; 0.2%</div>
                <div className="formula-units">Đứng (vertical) và Ngang (horizontal) theo TCVN 9386</div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>2. Lanh tô liên kết vách (Coupling Beams):</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
                Đối với hệ vách song song có lỗ mở cửa, cấu kiện lanh tô liên kết chịu ứng suất trượt cực lớn. Khi ứng suất cắt vượt quá giới hạn nứt chéo của bê tông, bắt buộc thiết kế cốt thép chéo đặt trong đai dày (dạng khung giả dẻo - pseudo-frame) để chống trượt và hấp thụ năng lượng.
              </p>
            </CollapsibleSection>
          </div>
        </div>
      )}

      {/* Tab 6: Thiết kế Kháng chấn (TCVN 9386:2012) */}
      {activeTab === 'seismic' && (
        <div className="rc-section">
          <div className="grid-half">
            <CollapsibleSection defaultOpen={false} title="6.1. Gia tốc nền thiết kế (a_g) & Ngưỡng Kháng chấn">
              <p style={{ lineHeight: 1.6, marginBottom: '16px' }}>
                Gia tốc nền thiết kế <strong>a<sub>g</sub></strong> tại địa điểm xây dựng là căn cứ quyết định việc bắt buộc áp dụng thiết kế kháng chấn (theo <strong>TCVN 9386:2012</strong> và <strong>QCVN 02:2022/BXD</strong>):
              </p>
              
              <div className="formula-card">
                <div className="formula-line"><var>a<sub>g</sub></var> = &gamma;<sub>I</sub> &bull; <var>a<sub>gR</sub></var></div>
                <div className="formula-units">Đơn vị: <var>g</var> (quy đổi theo gia tốc trọng trường <var>g</var> = 9.81 m/s&sup2;)</div>
              </div>

              {/* Calculator Widget 1 */}
              <div style={{ background: 'var(--overlay-very-light)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)', marginTop: '16px' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calculator size={16} />
                  <span>Bộ tính toán nhanh gia tốc nền a<sub>g</sub></span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Gia tốc nền tham chiếu a<sub>gR</sub> (g)</label>
                    <input 
                      type="number" 
                      step="0.001"
                      min="0"
                      value={agr} 
                      onChange={(e) => setAgr(parseFloat(e.target.value) || 0)} 
                      style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Hệ số tầm quan trọng γ<sub>I</sub></label>
                    <select 
                      value={importance} 
                      onChange={(e) => setImportance(parseFloat(e.target.value) || 1.0)}
                      style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                    >
                      <option value="1.25">Cấp đặc biệt (γ_I = 1.25)</option>
                      <option value="1.15">Cấp I (γ_I = 1.15)</option>
                      <option value="1.0">Cấp II (γ_I = 1.0)</option>
                      <option value="0.8">Cấp III (γ_I = 0.8)</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ background: 'rgba(102,126,234,0.12)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(102,126,234,0.2)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Gia tốc thiết kế tính toán:</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '4px 0', fontFamily: '\'Cambria Math\', \'Times New Roman\', Times, serif' }}>
                    <var>a<sub>g</sub></var> = {calculatedAg}<var>g</var>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: '600', lineHeight: 1.4 }}>
                    Kết luận: {seismicRecommendation}
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="6.2. Bộ tính toán khoảng cách cốt đai s_max trong vùng tới hạn">
              <p style={{ lineHeight: 1.6, marginBottom: '16px' }}>
                Bố trí đai dày trong vùng khớp dẻo (vùng tới hạn) có vai trò kẹp chặt bê tông lõi, chống phình cốt dọc chịu nén và đảm bảo tính dẻo:
              </p>

              {/* Calculator Widget 2 */}
              <div style={{ background: 'var(--overlay-very-light)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cấu kiện</label>
                    <select 
                      value={calcElement} 
                      onChange={(e) => setCalcElement(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                    >
                      <option value="beam">Dầm (Beam)</option>
                      <option value="column">Cột (Column)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Kích thước h_d / b_col (mm)</label>
                    <input 
                      type="number" 
                      value={calcDimension} 
                      onChange={(e) => setCalcDimension(parseInt(e.target.value) || 0)} 
                      style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Đường kính thép dọc d_bL (mm)</label>
                    <input 
                      type="number" 
                      value={calcDbl} 
                      onChange={(e) => setCalcDbl(parseInt(e.target.value) || 0)} 
                      style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cấp độ dẻo kết cấu</label>
                    <select 
                      value={calcDuctility} 
                      onChange={(e) => setCalcDuctility(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                    >
                      <option value="DCM">DCM (Dẻo trung bình)</option>
                      <option value="DCH">DCH (Dẻo cao)</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: 'rgba(118,75,162,0.12)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(118,75,162,0.2)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Khoảng cách cốt đai tối đa cho phép (s<sub>max</sub>):</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '4px 0', fontFamily: '\'Cambria Math\', \'Times New Roman\', Times, serif' }}>
                    <var>s</var> &le; {calculatedSpacing} mm
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)' }}>
                    {calcElement === 'beam' 
                      ? `Công thức: min(h_d / 4, ${calcDuctility === 'DCH' ? '6d_bL, 150mm' : '8d_bL, 225mm'}, 24d_bw) [Đai đầu tiên cách mép gối ≤ 50mm]` 
                      : `Công thức: min(b_0 / ${calcDuctility === 'DCH' ? '3, 6d_bL, 125mm' : '2, 8d_bL, 175mm'}) (giả thiết lõi b_0 = b_col - 50mm)`}
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          {/* Triết lý thiết kế & Khớp dẻo */}
          <div className="grid-half" style={{ marginTop: '24px' }}>
            <CollapsibleSection title="6.3. Triết lý Thiết kế theo Khả năng (Capacity Design)">
              <p style={{ lineHeight: 1.6, fontSize: '0.92rem' }}>
                Đảm bảo cơ chế phá hoại dẻo uốn xuất hiện trước phá hoại giòn cắt. Lực cắt tính toán thiết kế dầm/cột được khuếch đại dựa trên khả năng chịu uốn giới hạn của khớp dẻo ở hai đầu cấu kiện kể đến sự vượt cường độ vật liệu:
              </p>
              <div className="formula-card">
                <div className="formula-line"><var>V<sub>Ed</sub></var> = &gamma;<sub>Rd</sub> &bull; <span className="fraction"><span className="numerator"><var>M<sub>Rd,i</sub></var> + <var>M<sub>Rd,j</sub></var></span><span className="denominator"><var>L<sub>cl</sub></var></span></span> &plusmn; <var>V<sub>Ed,G</sub></var></div>
                <div className="formula-units">&gamma;<sub>Rd</sub> = 1.0 (DCM), 1.2 (DCH); <var>M<sub>Rd</sub></var>: mô-men kháng dẻo giới hạn đầu dầm; <var>L<sub>cl</sub></var>: chiều dài thông thủy dầm</div>
              </div>
              <ul className="bullet-list" style={{ fontSize: '0.88rem', marginTop: '12px' }}>
                <li><strong>Cột khỏe - Dầm yếu:</strong> Khống chế tỷ số mô-men kháng uốn tại nút khung để dầm chảy dẻo trước cột, phòng chống sập tầng. Công thức: <code>∑M_Rc ≥ 1.3 ∑M_Rb</code>.</li>
                <li><strong>Đai nút khung liên tục:</strong> Đai cột chạy liên tục qua nút khung dầm-cột để ngăn ngừa phá hoại cắt nút giòn làm sập toàn bộ công trình.</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="6.4. Ứng ứng xử phi tuyến & Chiết giảm độ cứng">
              <p style={{ lineHeight: 1.6, fontSize: '0.92rem' }}>
                Dưới tác động của động đất mạnh, kết cấu bê tông cốt thép bị nứt và biến dạng dẻo lớn. Để mô phỏng đúng chu kỳ dao động thực tế khi phân tích lực ngang, độ cứng chống uốn của cấu kiện phải chiết giảm:
              </p>
              <ul className="bullet-list" style={{ fontSize: '0.9rem', marginTop: '12px' }}>
                <li><strong>Dầm:</strong> Chiết giảm còn <strong>50%</strong> độ cứng tiết diện nguyên (<code>0.5 E * I<sub>g</sub></code>).</li>
                <li><strong>Cột:</strong> Chiết giảm còn <strong>50%</strong> độ cứng tiết diện nguyên (<code>0.5 E * I<sub>g</sub></code>).</li>
                <li><strong>Vách cứng:</strong> Chiết giảm còn <strong>50%</strong> độ cứng tiết diện nguyên (<code>0.5 E * I<sub>g</sub></code>).</li>
              </ul>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                Chú ý: Sự suy giảm độ cứng này làm tăng chu kỳ dao động riêng T của công trình, dẫn đến thay đổi lực động đất thiết kế (lực cắt đáy) thu được từ phổ phản ứng địa chấn.
              </p>
            </CollapsibleSection>
          </div>

          <CollapsibleSection title="6.5. So sánh chi tiết yêu cầu cấu tạo cốt thép TCVN 5574:2018 và TCVN 9386:2012 / Giáo trình" style={{ marginTop: '24px' }}>
            <p style={{ lineHeight: 1.6, marginBottom: '16px', fontSize: '0.95rem' }}>
              Bảng so sánh trực quan các thông số cấu tạo thép giữa kết cấu thông thường chịu tải trọng tĩnh (TCVN 5574:2018) và kết cấu kháng chấn (TCVN 9386:2012) đối với cấp dẻo trung bình (DCM) và khuyến nghị giáo trình:
            </p>
            <div className="spec-table-container">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Cấu kiện</th>
                    <th>Thông số thiết kế</th>
                    <th>Thiết kế thông thường (TCVN 5574:2018)</th>
                    <th>Thiết kế kháng chấn (TCVN 9386 & Giáo trình)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Dầm */}
                  <tr>
                    <td rowSpan={6} style={{ fontWeight: 'bold', color: 'var(--accent-primary)', verticalAlign: 'middle' }}>DẦM</td>
                    <td>Thép dọc tối thiểu (ρ_min)</td>
                    <td>0.1%</td>
                    <td>≥ max(0.5 f_yk / f_ctm, 0.0015) (DCM khoảng <strong>0.13%</strong>, DCH: <strong>0.15%</strong>)</td>
                  </tr>
                  <tr>
                    <td>Thép dọc tối đa (ρ_max)</td>
                    <td>Không giới hạn phần trăm cứng, khống chế qua ξ ≤ ξ_R</td>
                    <td>Vùng tới hạn: <strong>ρ ≤ ρ' + 0.025</strong> (DCM: ≤ 4.0% | DCH: ≤ 2.5%)</td>
                  </tr>
                  <tr>
                    <td>Thép dọc thớ dưới đầu dầm</td>
                    <td>Theo biểu đồ bao mô-men uốn tĩnh thường</td>
                    <td>Bắt buộc: <strong>A_s,bottom ≥ 0.5 * A_s,top</strong> tại tiết diện gối dầm (chống mô-men đảo chiều)</td>
                  </tr>
                  <tr>
                    <td>Cốt đai vùng tới hạn (l_cr)</td>
                    <td>
                      s_w ≤ min(0.5h_0, 300mm)<br/>
                      Đường kính đai d_bw ≥ 6mm
                    </td>
                    <td>
                      Chiều dài tới hạn: <strong>l_cr = 1.5h_d</strong> (Đỡ cột gián đoạn: <strong>2.0h_d</strong>)<br/>
                      Đường kính đai: <strong>d_bw ≥ max(6mm, d_bL,max / 4)</strong> (DCH: d_bw ≥ 10mm)<br/>
                      Khoảng cách đai: <strong>s ≤ min(h_d / 4, 24d_bw, s_limit, 8d_bL,min)</strong><br/>
                      (với s_limit = 225mm cho DCM; s_limit = 150mm cho DCH với s ≤ 6d_bL,min)
                    </td>
                  </tr>
                  <tr>
                    <td>Thiết kế chịu cắt (V_Ed)</td>
                    <td>Tính toán theo lực cắt từ biểu đồ nội lực đàn hồi</td>
                    <td>Bắt buộc **Thiết kế theo khả năng (Capacity Design)**: V_Ed = (M_Rd,i + M_Rd,j)/L_cl ± V_Ed,G</td>
                  </tr>
                  <tr>
                    <td>Vị trí nối & Chiều dài neo</td>
                    <td>Nối chồng tự do theo quy định chung</td>
                    <td><strong>CẤM nối chồng trong vùng tới hạn</strong>. Nếu buộc phải nối chồng, chiều dài nối chồng tăng 50%. Neo thép dọc kéo vào nút tính từ 5d_bL cách mép trong cột. Đường kính dọc d_bL ≥ 14mm.</td>
                  </tr>

                  {/* Cột */}
                  <tr>
                    <td rowSpan={5} style={{ fontWeight: 'bold', color: 'var(--accent-primary)', verticalAlign: 'middle' }}>CỘT</td>
                    <td>Thép dọc (μ_min / μ_max)</td>
                    <td>Min: 0.1% - 0.25% | Max: 3% - 6%</td>
                    <td>Min: <strong>1.0%</strong> | Max: <strong>4.0%</strong> (Giáo trình: kháng chấn yếu khuyến nghị 0.6% - 0.8% để tối ưu kinh tế)</td>
                  </tr>
                  <tr>
                    <td>Lực dọc quy đổi (ν_d)</td>
                    <td>Không khống chế trực tiếp, tính theo sức bền lệch tâm</td>
                    <td>Khống chế độ dẻo cột: <strong>ν_d = N_Ed / (A_c * f_cd) ≤ 0.65</strong> (DCH: ≤ 0.55)</td>
                  </tr>
                  <tr>
                    <td>Cốt đai vùng tới hạn (l_cr)</td>
                    <td>
                      s_w ≤ min(15d_dọc, 500mm)<br/>
                      Đường kính đai d_bw ≥ 6mm (8mm cho B70+)
                    </td>
                    <td>
                      Chiều dài tới hạn: <strong>l_cr = max(h_col, l_cl / 6, 450mm)</strong> (Chân cột sát móng: <strong>l_cl / 4</strong>)<br/>
                      Đường kính đai: <strong>d_bw ≥ max(6mm, d_bL,max / 4)</strong> (DCM: ≥ 8mm, DCH: ≥ 10mm)<br/>
                      Khoảng cách đai: <strong>s ≤ min(b_0 / 2, 175mm, 8d_bL,min)</strong> (DCH: s ≤ min(b_0 / 3, 125mm, 6d_bL,min))<br/>
                      Hàm lượng cốt đai cơ học: <strong>ω_wd ≥ 0.08</strong> (DCM) | <strong>ω_wd ≥ 0.12</strong> (DCH)
                    </td>
                  </tr>
                  <tr>
                    <td>Thiết kế chịu cắt (V_Ed)</td>
                    <td>Theo lực cắt đàn hồi kết hợp nén</td>
                    <td>**Thiết kế theo khả năng (Capacity Design)** dựa trên mô-men kháng dẻo lớn nhất tại các đầu liên kết cột.</td>
                  </tr>
                  <tr>
                    <td>Nối chồng & Chiều dài neo</td>
                    <td>Nối chồng tự do theo quy định chung</td>
                    <td><strong>Mối nối dọc phải nằm ngoài vùng tới hạn l_cr</strong>. Nếu bắt buộc nối trong vùng l_cr, chiều dài L_lap tăng 50% và bố trí đai dày. Neo cột chịu kéo do lật tăng 50%.</td>
                  </tr>

                  {/* Nút khung */}
                  <tr>
                    <td rowSpan={2} style={{ fontWeight: 'bold', color: 'var(--accent-primary)', verticalAlign: 'middle' }}>NÚT KHUNG</td>
                    <td>Đai cột chạy xuyên nút</td>
                    <td>Đặt cốt đai thưa hoặc không yêu cầu khắt khe</td>
                    <td>**Bắt buộc chạy cốt đai cột liên tục xuyên qua nút khung** với mật độ đai dày để tránh phá hoại cắt nút giòn đột ngột. Bố trí đai bổ sung d_bw = 8-10mm, s_w = 70-100mm.</td>
                  </tr>
                  <tr>
                    <td>Chiều dài neo dầm vào nút</td>
                    <td>Chiều dài neo cơ sở L_an</td>
                    <td><strong>L_neo = L_an + 5d_bL</strong> (Động đất mạnh: <strong>L_an + 10d_bL</strong>) tính từ mép trong cột.</td>
                  </tr>

                  {/* Vách */}
                  <tr>
                    <td rowSpan={4} style={{ fontWeight: 'bold', color: 'var(--accent-primary)', verticalAlign: 'middle' }}>VÁCH CỨNG</td>
                    <td>Thép thân vách tối thiểu</td>
                    <td>Thép đứng: 0.1% | Thép ngang: 0.05%</td>
                    <td>Thép đứng (ρ_v,min) & Thép ngang (ρ_h,min) đều **≥ 0.2%** (Giáo trình khuyến nghị: Đứng ≥ 0.6%, Ngang ≤ 0.4% cho động đất trung bình/mạnh).</td>
                  </tr>
                  <tr>
                    <td>Bố trí cốt thép</td>
                    <td>Đặt 1 hoặc 2 lớp tùy chiều dày vách</td>
                    <td>**Bắt buộc đan 2 lớp lưới thép** (Đứng và Ngang). Hai lưới phải được liên kết bằng các móc néo chữ C/S đường kính ≥ 6mm với mật độ **≥ 6 móc/m²** (khoảng cách ≤ 400mm).</td>
                  </tr>
                  <tr>
                    <td>Vùng biên vách (Boundary)</td>
                    <td>Cấu tạo chữ U hoặc đai khép kín bo đầu mép</td>
                    <td>Bắt buộc thiết kế cột chìm (vùng biên gia cường) khi **ν_d &gt; 0.15** (DCH) hoặc ứng suất nén lớn. Kích thước biên ≥ max(0.15l_w, 1.5t_w). Thép dọc biên ≥ 1.0%, đai biên s ≤ min(100mm, 6d_bL) với thép ngang ≥ 0.3%.</td>
                  </tr>
                  <tr>
                    <td>Cốt thép lanh tô cửa</td>
                    <td>Thép gia cường nằm ngang cơ bản</td>
                    <td>Đối với vách có lỗ mở lớn, phần lanh tô cửa bắt buộc bố trí **cốt thép chéo dạng pseudo-frame** đặt trong đai dày s ≤ 100mm, chiều dài neo tăng thêm 50% (1.5 L_neo).</td>
                  </tr>

                  {/* Sàn */}
                  <tr>
                    <td rowSpan={2} style={{ fontWeight: 'bold', color: 'var(--accent-primary)', verticalAlign: 'middle' }}>SÀN PHẲNG</td>
                    <td>Vai trò chịu lực ngang</td>
                    <td>Hầu như không xét vai trò truyền lực ngang</td>
                    <td>Làm việc như **Tấm cứng (Diaphragm)** truyền lực quán tính ngang về cột/vách. Yêu cầu liên kết neo cốt thép cực kỳ chặt chẽ với dầm/cột biên.</td>
                  </tr>
                  <tr>
                    <td>Thép dọc tối thiểu sàn</td>
                    <td>0.1%</td>
                    <td>**0.2% mỗi phương** để đảm bảo độ cứng màng sàn diaphragm truyền tải địa chấn.</td>
                  </tr>

                  {/* Móng */}
                  <tr>
                    <td rowSpan={2} style={{ fontWeight: 'bold', color: 'var(--accent-primary)', verticalAlign: 'middle' }}>MÓNG</td>
                    <td>Dầm móng (đà kiềng)</td>
                    <td>Chịu tường xây, lún lệch cơ bản</td>
                    <td>**Giằng liên kết móng** chịu kéo/nén dọc trục lớn do chênh lệch chuyển vị động đất. Hàm lượng thép dọc tối thiểu **0.4%** độc lập cho cả mặt trên và dưới.</td>
                  </tr>
                  <tr>
                    <td>Đài cọc & Liên kết cọc</td>
                    <td>Kiểm tra chọc thủng và uốn thông thường</td>
                    <td>Đài móng thiết kế chịu lực quán tính lớn nhất từ kết cấu trên khi có khớp dẻo (Capacity Design). Liên kết thép chủ cọc vào đài phải có chiều dài neo đủ lớn (L_neo) truyền ngàm mô-men uốn lật.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          {/* Quy định bổ sung từ giáo trình nhà cao tầng */}
          <div className="card" style={{ marginTop: '24px' }}>
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldAlert size={22} color="var(--accent-primary)" />
              <span>Các quy tắc vàng trong bố trí mặt bằng vách cứng (Giáo trình Nhà cao tầng)</span>
            </h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <p>
                Để công trình nhà cao tầng ứng xử tốt dưới tải trọng ngang cực lớn của động đất và gió bão, giáo trình nhấn mạnh 3 quy tắc vàng khi thiết kế vách cứng:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '12px' }}>
                <div style={{ background: 'var(--overlay-very-light)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <strong style={{ color: 'var(--accent-primary)' }}>1. Quy tắc 3 vách cứng độc lập</strong>
                  <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                    Mặt bằng phải bố trí ít nhất 3 vách cứng độc lập và các đường trục của các vách này **không được gặp nhau tại một điểm** để tránh hiện tượng mất ổn định xoắn tổng thể.
                  </p>
                </div>
                <div style={{ background: 'var(--overlay-very-light)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <strong style={{ color: 'var(--accent-primary)' }}>2. Đồng tâm Cứng và khối lượng</strong>
                  <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                    Phải bố trí vách/lõi sao cho **tâm cứng (Center of Rigidity) trùng hoặc gần nhất với tâm khối lượng (Center of Mass)** để giảm thiểu mô-men xoắn ngẫu nhiên khi chịu gia tốc ngang.
                  </p>
                </div>
                <div style={{ background: 'var(--overlay-very-light)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <strong style={{ color: 'var(--accent-primary)' }}>3. Nhiều vách nhỏ tốt hơn ít vách lớn</strong>
                  <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                    Ưu tiên bố trí nhiều vách cứng kích thước vừa phải phân bố đều trên mặt bằng hơn là tập trung vào một vài vách siêu lớn, giúp kết cấu truyền lực đa hướng dẻo dai hơn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
