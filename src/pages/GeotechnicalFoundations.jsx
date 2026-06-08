import { useState } from 'react';
import Card from '../components/Card';
import { 
  BookOpen, 
  ShieldAlert, 
  Layers, 
  Activity, 
  FileText, 
  Calculator, 
  HelpCircle,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

export default function GeotechnicalFoundations() {
  const [activeTab, setActiveTab] = useState('uls');

  // Calculator 1: Unit Converter & bearing capacities
  const [qUlt, setQUlt] = useState(350);
  const [df, setDf] = useState(2.0);
  const [gamma, setGamma] = useState(18);
  const [fs, setFs] = useState(2.5);

  const qNetU = Math.max(0, qUlt - (gamma * df)).toFixed(1);
  const qNetSafe = (parseFloat(qNetU) / fs).toFixed(1);
  const qSafe = (parseFloat(qNetSafe) + (gamma * df)).toFixed(1);

  // Calculator 2: Pile SPT estimator
  const [pileType, setPileType] = useState('bored');
  const [pileD, setPileD] = useState(800);
  const [pileL, setPileL] = useState(25);
  const [nShaft, setNShaft] = useState(12);
  const [nTip, setNTip] = useState(28);

  const dMeter = pileD / 1000;
  const areaTip = pileType === 'bored' 
    ? (Math.PI * Math.pow(dMeter, 2) / 4) 
    : Math.pow(dMeter, 2);
  const perimeter = pileType === 'bored' 
    ? (Math.PI * dMeter) 
    : (4 * dMeter);

  // Skin friction and tip resistance parameters from SPT
  const fsi = pileType === 'bored' ? (1.2 * nShaft) : (2.0 * nShaft);
  const qb = pileType === 'bored' ? (120 * nTip) : (250 * nTip);
  const Qs = (perimeter * pileL * fsi).toFixed(1);
  const Qb = (areaTip * qb).toFixed(1);
  const Ru = (parseFloat(Qs) + parseFloat(Qb)).toFixed(1);
  const Rsafe = (parseFloat(Ru) / 2.0).toFixed(1); // Fs = 2.0 for preliminary design from SPT

  // Calculator 3: Static Load Test requirements
  const [totalPiles, setTotalPiles] = useState(120);
  const [consequenceClass, setConsequenceClass] = useState('C2');

  let consequenceFactor = 1.0;
  let minTests = 1;
  let testNote = '';

  if (consequenceClass === 'C1') {
    consequenceFactor = 1.0;
    minTests = Math.max(1, Math.ceil(totalPiles * 0.005));
    testNote = 'Cấp C1 (Hậu quả thấp): Thí nghiệm nén tĩnh tối thiểu 0.5% tổng số cọc (ít nhất 1 cọc).';
  } else if (consequenceClass === 'C2') {
    consequenceFactor = 1.15;
    minTests = Math.max(2, Math.ceil(totalPiles * 0.01));
    testNote = 'Cấp C2 (Hậu quả trung bình): Thí nghiệm nén tĩnh tối thiểu 1% tổng số cọc và không ít hơn 2 cọc.';
  } else {
    consequenceFactor = 1.20;
    minTests = Math.max(3, Math.ceil(totalPiles * 0.01));
    testNote = 'Cấp C3 (Hậu quả cao - Siêu cao tầng, công trình y tế): Thí nghiệm nén tĩnh tối thiểu 1% tổng số cọc và không ít hơn 3 cọc.';
  }

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
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
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
          }
          .tab-btn {
            padding: 7px 10px;
            font-size: 0.8rem;
            gap: 4px;
          }
        }
        .geo-section {
          animation: fadeIn 0.4s ease-out;
        }
        .formula-card {
          background: rgba(0, 0, 0, 0.25);
          border-left: 4px solid var(--accent-primary);
          padding: 16px;
          border-radius: 4px 8px 8px 4px;
          margin: 16px 0;
          font-family: 'Courier New', Courier, monospace;
        }
        .formula-line {
          font-size: clamp(1rem, 2vw, 1.1rem);
          color: var(--text-formula);
          font-weight: 700;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .formula-units {
          font-size: 0.85rem;
          color: var(--accent-secondary);
          margin-top: 4px;
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
          font-size: 0.92rem;
        }
        .bullet-purple {
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
        .highlight-text {
          color: var(--text-primary);
          font-weight: 600;
        }
        .spec-badge {
          background: rgba(139, 92, 246, 0.1);
          color: var(--accent-primary);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
      `}</style>

      <h1 className="page-title">Cơ sở Địa kỹ thuật & Thiết kế Nền móng</h1>

      <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(102,126,234,0.1) 100%)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 30px rgba(139,92,246,0.15)' }}>
        <h2 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={24} color="var(--accent-primary)" />
          <span className="gradient-text">Nguyên lý Địa kỹ thuật Nền móng và Thiết kế Tiêu chuẩn</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Hệ thống tra cứu chuyên sâu về triết lý sức chịu tải đất nền, các công thức thực hành thiết kế móng nông theo <strong>TCVN 9362:2012</strong>, móng cọc sâu theo tiêu chuẩn mới <strong>TCVN 10304:2025</strong>, độ lún SLS, và các widget tính toán kỹ thuật.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'uls' ? 'active' : ''}`} onClick={() => setActiveTab('uls')}>
          <Activity size={18} />
          1. Triết lý Sức chịu tải (ULS)
        </button>
        <button className={`tab-btn ${activeTab === 'shallow' ? 'active' : ''}`} onClick={() => setActiveTab('shallow')}>
          <Layers size={18} />
          2. Móng nông thực hành (9362)
        </button>
        <button className={`tab-btn ${activeTab === 'deep' ? 'active' : ''}`} onClick={() => setActiveTab('deep')}>
          <FileText size={18} />
          3. Móng cọc sâu (10304:2025)
        </button>
        <button className={`tab-btn ${activeTab === 'sls' ? 'active' : ''}`} onClick={() => setActiveTab('sls')}>
          <TrendingUp size={18} />
          4. Lý thuyết Biến dạng (SLS)
        </button>
        <button className={`tab-btn ${activeTab === 'calcs' ? 'active' : ''}`} onClick={() => setActiveTab('calcs')}>
          <Calculator size={18} />
          5. Bộ tính toán Địa kỹ thuật
        </button>
      </div>

      {/* Tab 1: Triết lý Sức chịu tải (ULS) */}
      {activeTab === 'uls' && (
        <div className="geo-section">
          <div className="grid-half">
            <Card title="Phân loại & Định nghĩa các loại Sức chịu tải">
              <p style={{ lineHeight: 1.6 }}>
                Trong thiết kế móng theo trạng thái giới hạn cường độ (ULS), ta cần phân biệt rõ ràng 5 định nghĩa sức chịu tải nền đất để tránh nhầm lẫn nghiêm trọng trong việc áp dụng hệ số an toàn:
              </p>
              
              <ul className="bullet-list" style={{ fontSize: '0.92rem', marginTop: '12px' }}>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Sức chịu tải cực hạn gộp (Gross Ultimate Bearing Capacity - <var>q</var><sub>ult</sub>):</strong> Cường độ áp lực lớn nhất tại cao độ đáy móng mà tại đó nền đất bị phá hoại cắt trượt hoàn toàn.
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Sức chịu tải cực hạn tịnh (Net Ultimate Bearing Capacity - <var>q</var><sub>net(u)</sub>):</strong> Phần chênh lệch giữa sức chịu tải cực hạn và áp lực do trọng lượng cột đất phủ xung quanh móng:
                  <div className="formula-block">
                    <var>q</var><sub>net(u)</sub> = <var>q</var><sub>ult</sub> - <var>&gamma;</var> &middot; <var>D</var><sub>f</sub>
                  </div>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Sức chịu tải an toàn tịnh (Net Safe Bearing Capacity - <var>q</var><sub>net(safe)</sub>):</strong> Cường độ áp lực tịnh cho phép truyền lên nền đất sau khi đã chia cho hệ số an toàn <var>F</var><sub>s</sub> (thường chọn từ 2.5 đến 3.0):
                  <div className="formula-block">
                    <var>q</var><sub>net(safe)</sub> = <span className="fraction"><span className="numerator"><var>q</var><sub>net(u)</sub></span><span className="denominator"><var>F</var><sub>s</sub></span></span>
                  </div>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Sức chịu tải an toàn gộp (Gross Safe Bearing Capacity - <var>q</var><sub>safe</sub>):</strong> Tổng áp lực gộp lớn nhất được phép đặt lên đáy móng để đảm bảo an toàn cắt trượt:
                  <div className="formula-block">
                    <var>q</var><sub>safe</sub> = <var>q</var><sub>net(safe)</sub> + <var>&gamma;</var> &middot; <var>D</var><sub>f</sub>
                  </div>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Áp lực mang tải cho phép (Allowable Bearing Pressure - <var>q</var><sub>all</sub>):</strong> Giá trị áp lực lớn nhất được khống chế bởi cả điều kiện sức chịu tải (ULS) và điều kiện lún giới hạn cho phép của công trình (SLS):
                  <div className="formula-block">
                    <var>q</var><sub>all</sub> = min(<var>q</var><sub>safe</sub>, <var>q</var><sub>lún cho phép</sub>)
                  </div>
                </li>
              </ul>
            </Card>

            <Card title="So sánh 4 Lý thuyết Sức chịu tải Kinh điển">
              <p style={{ lineHeight: 1.6, marginBottom: '12px' }}>
                Lịch sử cơ học đất ghi nhận 4 thuyết tính toán sức chịu tải cực hạn móng nông phổ biến, phát triển từ mô hình đơn giản đến các mô hình thực hành sát thực tế:
              </p>
              
              <div className="spec-table-container">
                <table className="spec-table" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Lý thuyết</th>
                      <th>Giả thiết cốt lõi</th>
                      <th>Công thức & Đặc điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Terzaghi (1943)</strong></td>
                      <td>Móng băng nhám, đáy móng nằm ngang ở độ sâu <var>D</var><sub>f</sub>. Mặt trượt chỉ kéo dài lên tới đáy móng, bỏ qua sức kháng cắt của đất trên đáy móng (thay bằng tải trọng hông <var>q</var> = <var>&gamma;</var><var>D</var><sub>f</sub>).</td>
                      <td>
                        <var>q</var><sub>ult</sub> = <var>c</var>&middot;<var>N</var><sub>c</sub> + <var>q</var>&middot;<var>N</var><sub>q</sub> + 0.5&middot;<var>&gamma;</var>&middot;<var>B</var>&middot;<var>N</var><sub>&gamma;</sub> <br/>
                        (<var>N</var><sub>c</sub>, <var>N</var><sub>q</sub>, <var>N</var><sub>&gamma;</sub> phụ thuộc góc ma sát trong <var>&phi;</var>)
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Meyerhof (1963)</strong></td>
                      <td>Mặt trượt vươn lên mặt đất tự nhiên (kể đến sức kháng cắt của lớp phủ). Đưa ra các hệ số hình dạng (<var>s</var>), độ sâu (<var>d</var>) và độ nghiêng tải trọng (<var>i</var>).</td>
                      <td>
                        Sử dụng kích thước móng hiệu dụng hiệu chỉnh do momen lệch tâm:<br/>
                        <var>B'</var> = <var>B</var> - 2<var>e</var><sub>B</sub> và <var>L'</var> = <var>L</var> - 2<var>e</var><sub>L</sub>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Hansen (1970)</strong></td>
                      <td>Mở rộng mô hình Meyerhof bằng cách bổ sung thêm hệ số độ dốc mái đất xung quanh (<var>g</var>) và độ nghiêng của đáy móng (<var>b</var>).</td>
                      <td>
                        Thích hợp cho các móng nằm trên sườn dốc hoặc móng giật cấp chịu lực xiên lớn.
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Vesic (1973, 1975)</strong></td>
                      <td>Tương tự Hansen nhưng hiệu chỉnh lại hệ số sức chịu tải <var>N</var><sub>&gamma;</sub> và bổ sung hệ số nén nún thể tích (<var>I</var><sub>r</sub> - Stiffness Index) để tính toán cho đất sét yếu dễ nén co.</td>
                      <td>
                        <var>N</var><sub>&gamma;</sub> = 2&middot;(<var>N</var><sub>q</sub> + 1)&middot;tan(<var>&phi;</var>) <br/>
                        Được đánh giá là tiệm cận gần nhất với các kết quả thí nghiệm thực tế.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Móng nông thực hành (TCVN 9362:2012) */}
      {activeTab === 'shallow' && (
        <div className="geo-section">
          <div className="grid-half">
            <Card title="Sức chịu tải tính toán của Đất nền R (TCVN 9362:2012)">
              <p style={{ lineHeight: 1.6 }}>
                Theo tiêu chuẩn thiết kế nền nhà và công trình <strong>TCVN 9362:2012</strong>, cường độ tính toán của đất nền dưới đáy móng <var>R</var> (kPa) được xác định bằng công thức nửa thực nghiệm:
              </p>
              
              <div className="formula-card">
                <div className="formula-line">
                  <var>R</var> = <span className="fraction"><span className="numerator"><var>m</var><sub>1</sub>&middot;<var>m</var><sub>2</sub></span><span className="denominator"><var>k</var><sub>tc</sub></span></span> &middot; [ <var>A</var>&middot;<var>b</var>&middot;<var>&gamma;</var> + <var>B</var>&middot;<var>h</var>&middot;<var>&gamma;'</var> + <var>D</var>&middot;<var>c</var> ]
                </div>
                <div className="formula-desc">Đơn vị: kPa (hoặc kN/m²); <var>b</var>: chiều rộng móng (m); <var>h</var>: chiều sâu chôn móng (m)</div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Ý nghĩa các hệ số:</h4>
              <ul className="params-list" style={{ fontSize: '0.9rem' }}>
                <li><span className="bullet-purple">»</span> <strong><var>m</var><sub>1</sub>, <var>m</var><sub>2</sub>:</strong> Hệ số điều kiện làm việc của đất nền và hệ số quy mô công trình (tra bảng theo loại đất).</li>
                <li><span className="bullet-purple">»</span> <strong><var>k</var><sub>tc</sub>:</strong> Hệ số tin cậy (thường lấy bằng 1.0 đến 1.1).</li>
                <li><span className="bullet-purple">»</span> <strong><var>A</var>, <var>B</var>, <var>D</var>:</strong> Các hệ số không thứ nguyên tra cứu phụ thuộc góc ma sát trong tính toán <var>&phi;</var><sub>II</sub> của đất dưới đáy móng.</li>
                <li><span className="bullet-purple">»</span> <strong><var>&gamma;</var>, <var>&gamma;'</var>:</strong> Trọng lượng riêng của đất nằm dưới đáy móng và trên đáy móng (kN/m³).</li>
                <li><span className="bullet-purple">»</span> <strong><var>c</var>:</strong> Lực dính đơn vị tính toán của lớp đất nằm trực tiếp dưới đáy móng (kPa).</li>
              </ul>
            </Card>

            <Card title="Ảnh hưởng của Nước ngầm & Kiểm tra chọc thủng đài móng">
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. Sự suy giảm sức chịu tải do mực nước ngầm:</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                Khi mực nước ngầm dâng cao lên trên đáy móng, lực đẩy nổi Archimedes làm giảm trọng lượng riêng hữu hiệu của đất (<var>&gamma;</var><sub>sub</sub> &asymp; <var>&gamma;</var><sub>sat</sub> - 10 kN/m³). Trọng lượng riêng giảm gần 50% sẽ trực tiếp làm giảm sức chịu tải của nền đất tới 30% - 50%. Do đó, thiết kế bắt buộc phải dùng trị số <var>&gamma;</var><sub>nổi</sub> cho phần đất ngập nước dưới đáy móng.
              </p>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>2. Kiểm tra chọc thủng móng đơn và móng bè (TCVN 5574:2018):</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                Lực nén cột truyền xuống đài móng gây ứng suất chọc thủng cục bộ làm nứt vỡ đài theo hình tháp cụt 45 độ. Tiêu chuẩn khống chế điều kiện chống chọc thủng của bê tông đài móng:
              </p>
              
              <div className="formula-card">
                <div className="formula-line">
                  <var>F</var> &le; <var>R</var><sub>bt</sub> &middot; <var>u</var><sub>m</sub> &middot; <var>h</var><sub>0</sub>
                </div>
                <div className="formula-desc"><var>F</var>: Lực chọc thủng tính toán; <var>R</var><sub>bt</sub>: Cường độ kéo bê tông; <var>u</var><sub>m</sub>: Chu vi trung bình tháp chọc thủng; <var>h</var><sub>0</sub>: Chiều cao làm việc đài móng</div>
              </div>
              
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Nếu chiều dày đài móng <var>h</var><sub>0</sub> không đủ chịu chọc thủng, ta phải chủ động gia tăng chiều dày đài móng hoặc bố trí cốt thép đai, cốt thép xiên chống chọc thủng bên trong đài.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: Móng cọc sâu (TCVN 10304:2025) */}
      {activeTab === 'deep' && (
        <div className="geo-section">
          <Card title="Cập nhật quan trọng theo Tiêu chuẩn Mới TCVN 10304:2025">
            <div className="grid-half">
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. Phân cấp hậu quả công trình & Hệ số tầm quan trọng (<var>&gamma;</var><sub>n</sub>):</h4>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Tiêu chuẩn mới <strong>TCVN 10304:2025</strong> đồng bộ trực tiếp với QCVN 03:2022/BXD, yêu cầu tính toán thiết kế lực dọc trục đầu cọc nhân với hệ số tầm quan trọng <var>&gamma;</var><sub>n</sub>:
                </p>
                <ul className="params-list" style={{ fontSize: '0.88rem', marginLeft: '12px' }}>
                  <li><span className="bullet-purple">▪</span> <strong>Cấp C1 (Hậu quả thấp):</strong> <var>&gamma;</var><sub>n</sub> = 1.0</li>
                  <li><span className="bullet-purple">▪</span> <strong>Cấp C2 (Hậu quả trung bình):</strong> <var>&gamma;</var><sub>n</sub> = 1.15</li>
                  <li><span className="bullet-purple">▪</span> <strong>Cấp C3 (Hậu quả cao - nhà &gt; 25 tầng, bệnh viện...):</strong> <var>&gamma;</var><sub>n</sub> = 1.20</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>2. Sức chịu tải dọc trục giới hạn cực hạn <var>R</var><sub>u</sub>:</h4>
                <div className="formula-card">
                  <div className="formula-line">
                    <var>R</var><sub>u</sub> = <var>q</var><sub>b</sub> &middot; <var>A</var><sub>b</sub> + <var>u</var> &middot; &sum;(<var>f</var><sub>si</sub> &middot; <var>l</var><sub>i</sub>)
                  </div>
                  <div className="formula-desc"><var>q</var><sub>b</sub>: sức kháng mũi cọc (kPa); <var>A</var><sub>b</sub>: diện tích mũi cọc (m&sup2;); <var>u</var>: chu vi cọc (m); <var>f</var><sub>si</sub>: ma sát thành cọc thứ <var>i</var> (kPa)</div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Khi thi công cọc nhồi giữ thành bằng dung dịch bentonite, sức ma sát bên <var>f</var><sub>si</sub> phải nhân thêm hệ số chiết giảm điều kiện làm việc <strong><var>&gamma;</var><sub>cf</sub> = 0.70</strong> để kể đến lớp bùn sét bám trên thành lỗ khoan.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>3. Tính toán sức chịu tải từ chỉ số SPT (Phụ lục D):</h4>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Sử dụng chỉ số xuyên tiêu chuẩn <var>N</var><sub>SPT</sub> dọc theo thân cọc và mũi cọc để ước lượng nhanh sức chịu tải:
                </p>
                <ul className="bullet-list" style={{ fontSize: '0.88rem' }}>
                  <li><strong>Đối với đất dính (sét, á sét):</strong> Cường độ chịu cắt không thoát nước được nội suy: <strong><var>c</var><sub>u</sub> &asymp; 6.25 &middot; <var>N</var><sub>SPT</sub></strong> (kPa). Ma sát thành bên <var>f</var><sub>si</sub> tính theo hệ số <var>&alpha;</var> (<var>f</var><sub>si</sub> = <var>&alpha;</var> &middot; <var>c</var><sub>u</sub>).</li>
                  <li><strong>Đối với đất rời (cát):</strong> Sức kháng mũi cọc tính trực tiếp từ <var>N</var><sub>SPT</sub> tại cao độ mũi cọc (<var>q</var><sub>b</sub> = <var>K</var> &middot; <var>N</var><sub>tip</sub>).</li>
                </ul>

                <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>4. Quy chuẩn thử nghiệm nén tĩnh & Cấu tạo:</h4>
                <ul className="bullet-list" style={{ fontSize: '0.88rem' }}>
                  <li><strong>Khoảng cách cọc tối thiểu:</strong> Bằng 3<var>d</var> đối với cọc đóng/ép ma sát và 2.5<var>d</var> đối với cọc khoan nhồi (<var>d</var> là đường kính cọc).</li>
                  <li><strong>Số lượng cọc thí nghiệm nén tĩnh bắt buộc:</strong> Cấp C2 tối thiểu 2 cọc và &ge; 1% tổng số cọc đại trà. Cấp C3 tối thiểu 3 cọc và &ge; 1% số cọc.</li>
                  <li><strong>Độ lún giới hạn phá hoại quy định:</strong> Khi thí nghiệm nén tĩnh, nếu độ lún vượt quá <strong><var>s</var><sub>max</sub> = 35 mm</strong> thì cọc được coi là đã bị phá hoại cơ học sức chịu tải nền đất.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Lý thuyết Biến dạng & Hiệu ứng nhóm cọc (SLS) */}
      {activeTab === 'sls' && (
        <div className="geo-section">
          <div className="grid-half">
            <Card title="Khống chế Lún giới hạn & Mô hình Bán không gian đàn hồi">
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. Ràng buộc lún của TCVN 9362:2012:</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                Để đảm bảo công trình vận hành bình thường, không gây nứt toác tường xây hoặc nghiêng lệch kết cấu, độ lún tuyệt đối và lún lệch phải thỏa mãn:
              </p>
              <div className="formula-card">
                <div className="formula-line">
                  <var>S</var><sub>max</sub> &le; 80 mm &nbsp; | &nbsp; <span className="fraction"><span className="numerator">&Delta;<var>S</var></span><span className="denominator"><var>L</var></span></span> &le; 0.002
                </div>
                <div className="formula-desc"><var>S</var><sub>max</sub>: Độ lún tối đa; &Delta;<var>S</var>: Độ lún lệch; <var>L</var>: Khoảng cách giữa hai trục cột kề nhau (mm)</div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>2. Độ lún cọc đơn (Linear Deformable Half-space):</h4>
              <div style={{ fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '16px' }}>
                Tính toán độ lún đàn hồi của cọc đơn dựa trên lý thuyết nửa không gian biến dạng tuyến tính liên tục. Độ lún chịu ảnh hưởng lớn từ tỷ số độ cứng tương đối giữa thân cọc và đất nền xung quanh:
                <div className="formula-block">
                  <var>K</var> = <span className="fraction"><span className="numerator"><var>E</var><sub>s</sub></span><span className="denominator"><var>G</var><sub>s</sub></span></span>
                </div>
                Với <var>E</var><sub>s</sub> là mô-đun đàn hồi của vật liệu cọc, <var>G</var><sub>s</sub> là mô-đun biến dạng trượt của đất nền.
              </div>
            </Card>

            <Card title="Hiệu ứng Nhóm cọc & Độ lún do xây chen">
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>1. Hiệu ứng nhóm cọc (Group interaction effect):</h4>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                Khi các cọc bố trí gần nhau (khoảng cách &lt; 6<var>d</var>), bầu ứng suất dưới mũi cọc sẽ giao thoa và cộng dồn. Độ lún của cọc thứ <var>i</var> trong nhóm tăng lên do ảnh hưởng của các cọc <var>j</var> lân cận:
              </p>
              
              <div className="formula-card">
                <div className="formula-line">
                  <var>s</var><sub>total,i</sub> = <var>s</var><sub>single</sub> &middot; [ 1 + &sum; ( <var>&alpha;</var><sub>ij</sub> &middot; <span className="fraction"><span className="numerator"><var>P</var><sub>j</sub></span><span className="denominator"><var>P</var><sub>i</sub></span></span> ) ]
                </div>
                <div className="formula-line">
                  <var>&alpha;</var><sub>ij</sub> = <span className="fraction"><span className="numerator">ln(<var>r</var><sub>max</sub> / <var>r</var><sub>ij</sub>)</span><span className="denominator">ln(<var>r</var><sub>max</sub> / <var>r</var><sub>0</sub>)</span></span>
                </div>
                <div className="formula-desc"><var>&alpha;</var><sub>ij</sub>: Hệ số tương tác; <var>r</var><sub>ij</sub>: Khoảng cách giữa cọc <var>i</var> và cọc <var>j</var>; <var>r</var><sub>max</sub>: Bán kính ảnh hưởng; <var>r</var><sub>0</sub>: Bán kính hiệu dụng của cọc</div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>2. Độ lún do xây chen & Thi công ép cọc:</h4>
              <ul className="bullet-list" style={{ fontSize: '0.88rem' }}>
                <li><strong>Độ lún co ngắn đàn hồi thân cọc (<var>s</var><sub>el</sub>):</strong> Biến dạng co ngắn bản thân vật liệu bê tông cọc dưới tải trọng dọc cực lớn (thường chiếm 5-15% tổng độ lún).</li>
                <li><strong>Ảnh hưởng ép cọc làm trồi đất (<var>s</var><sub>constr</sub>):</strong> Việc đóng/ép hàng loạt cọc đặc chiếm chỗ trong sét dẻo chảy tạo ra áp lực nước lỗ rỗng thặng dư cực lớn, đẩy trồi đất nền và gây lún nứt nghiêm trọng cho công trình lân cận khi áp lực này tiêu tán. Bắt buộc phải khoan dẫn giảm áp hoặc ép tốc độ chậm.</li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 5: Bộ tính toán thực hành (Geotechnical Calculators) */}
      {activeTab === 'calcs' && (
        <div className="geo-section">
          <div className="grid-half">
            {/* Widget 1: Bearing Capacity Converter */}
            <Card title="1. Quy đổi Đại lượng Sức chịu tải Móng nông">
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Nhập áp lực cực hạn gộp để tự động tính ra các thành phần áp lực tịnh và an toàn theo lý thuyết ULS:
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Sức chịu tải cực hạn gộp <var>q</var><sub>ult</sub> (kPa)</label>
                  <input 
                    type="number" 
                    value={qUlt} 
                    onChange={(e) => setQUlt(parseFloat(e.target.value) || 0)} 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Chiều sâu chôn móng <var>D</var><sub>f</sub> (m)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={df} 
                    onChange={(e) => setDf(parseFloat(e.target.value) || 0)} 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Trọng lượng riêng của đất <var>&gamma;</var> (kN/m³)</label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={gamma} 
                    onChange={(e) => setGamma(parseFloat(e.target.value) || 0)} 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Hệ số an toàn sức chịu tải <var>F</var><sub>s</sub></label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="1.0"
                    value={fs} 
                    onChange={(e) => setFs(parseFloat(e.target.value) || 2.5)} 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Kết quả phân tích áp suất đáy móng:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Cực hạn tịnh <var>q</var><sub>net(u)</sub>:</span>
                    <strong style={{ display: 'block', color: '#fff', fontSize: '1.05rem' }}>{qNetU} kPa</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>An toàn tịnh <var>q</var><sub>net(safe)</sub>:</span>
                    <strong style={{ display: 'block', color: '#fff', fontSize: '1.05rem' }}>{qNetSafe} kPa</strong>
                  </div>
                </div>
                <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                  <span style={{ color: 'var(--accent-secondary)' }}>Sức chịu tải an toàn gộp <var>q</var><sub>safe</sub>:</span>
                  <strong style={{ display: 'block', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>{qSafe} kPa</strong>
                </div>
              </div>
            </Card>

            {/* Widget 2: Pile capacity estimator from SPT */}
            <Card title="2. Ước lượng Sức chịu tải Cọc đơn từ SPT">
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Ước tính sơ bộ sức chịu tải dọc trục thiết kế dựa trên chỉ số SPT trung bình dọc thân cọc và tại mũi cọc:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Loại cọc thi công</label>
                  <select 
                    value={pileType} 
                    onChange={(e) => setPileType(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                  >
                    <option value="bored">Cọc khoan nhồi (Bored)</option>
                    <option value="driven">Cọc đóng/ép vuông (Driven)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Đường kính / Cạnh <var>d</var> (mm)</label>
                  <input 
                    type="number" 
                    value={pileD} 
                    onChange={(e) => setPileD(parseInt(e.target.value) || 0)} 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Chiều dài cọc <var>L</var> (m)</label>
                  <input 
                    type="number" 
                    value={pileL} 
                    onChange={(e) => setPileL(parseInt(e.target.value) || 0)} 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>SPT trung bình thân cọc (<var>N</var><sub>shaft</sub>)</label>
                  <input 
                    type="number" 
                    value={nShaft} 
                    onChange={(e) => setNShaft(parseInt(e.target.value) || 0)} 
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>SPT tại cao độ mũi cọc (<var>N</var><sub>tip</sub>)</label>
                <input 
                  type="number" 
                  value={nTip} 
                  onChange={(e) => setNTip(parseInt(e.target.value) || 0)} 
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(102, 126, 234, 0.2)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem', marginBottom: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Sức kháng bên <var>Q</var><sub>s</sub>:</span>
                    <strong style={{ display: 'block', color: '#fff' }}>{Qs} kN</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Sức kháng mũi <var>Q</var><sub>b</sub>:</span>
                    <strong style={{ display: 'block', color: '#fff' }}>{Qb} kN</strong>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cực hạn <var>R</var><sub>u</sub>: <strong>{Ru} kN</strong></span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--accent-secondary)' }}>Thiết kế sơ bộ <var>R</var><sub>design</sub>:</span>
                  </div>
                  <strong style={{ display: 'block', color: 'var(--accent-primary)', fontSize: '1.25rem', textAlign: 'right', marginTop: '2px' }}>
                    <var>P</var><sub>cp</sub> &asymp; {Rsafe} kN
                  </strong>
                </div>
              </div>
            </Card>
          </div>

          {/* Widget 3: Testing specifications checker */}
          <Card title="3. Tra cứu Quy chuẩn Thí nghiệm Nén tĩnh & Khoảng cách cọc" style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Nhập tổng số lượng cọc thiết kế đại trà trên mặt bằng và chọn cấp hậu quả công trình để xác định số lượng cọc phải thí nghiệm nén tĩnh bắt buộc theo quy định tiêu chuẩn:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Tổng số lượng cọc đại trà</label>
                <input 
                  type="number" 
                  value={totalPiles} 
                  onChange={(e) => setTotalPiles(parseInt(e.target.value) || 0)} 
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.92rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Cấp hậu quả công trình (QCVN 03)</label>
                <select 
                  value={consequenceClass} 
                  onChange={(e) => setConsequenceClass(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.92rem' }}
                >
                  <option value="C1">Cấp C1 (Hậu quả thấp - Nhà &lt; 7 tầng)</option>
                  <option value="C2">Cấp C2 (Hậu quả trung bình - Nhà từ 7 - 25 tầng)</option>
                  <option value="C3">Cấp C3 (Hậu quả cao - Nhà &gt; 25 tầng, Bệnh viện...)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.92rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} />
                  <span>Quy định Nén tĩnh bắt buộc</span>
                </h4>
                <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                  Tối thiểu {minTests} cọc
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {testNote}
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.92rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={16} />
                  <span>Hệ số tầm quan trọng & Cấu tạo cọc</span>
                </h4>
                <ul className="params-list" style={{ fontSize: '0.82rem', margin: 0 }}>
                  <li>
                    <span style={{ color: 'var(--accent-secondary)', fontWeight: '600' }}>Hệ số tầm quan trọng:</span>
                    <span className="spec-badge"><var>&gamma;</var><sub>n</sub> = {consequenceFactor}</span>
                  </li>
                  <li style={{ marginTop: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Khoảng cách tim cọc tối thiểu:</span>
                    <strong style={{ color: '#fff' }}>
                      {pileType === 'bored' ? '2.5d = ' + (2.5 * pileD) + ' mm' : '3d = ' + (3 * pileD) + ' mm'}
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Footer warning */}
      <div className="card" style={{ marginTop: '32px' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={22} color="var(--accent-primary)" />
          <span>Lưu ý quan trọng cho Thiết kế Cơ sở Địa kỹ thuật Nền móng</span>
        </h2>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          <p>
            Thiết kế móng cọc sâu theo tiêu chuẩn mới <strong>TCVN 10304:2025</strong> đặt nặng vai trò của việc phân cấp hậu quả công trình để áp dụng các hệ số chiết giảm và tần suất thí nghiệm nghiêm ngặt. Người thiết kế cần đặc biệt chú ý:
          </p>
          <ul className="bullet-list" style={{ marginTop: '10px' }}>
            <li>Đối với các công trình có tầng hầm sâu ngập nước, cần tính toán kiểm tra ổn định đẩy nổi (buoyancy) của tòa nhà ở trạng thái giới hạn thứ nhất dưới áp lực nước ngầm lớn nhất vào mùa mưa.</li>
            <li>Khi tính toán sức chịu tải cọc từ số liệu SPT, chỉ số <var>N</var><sub>SPT</sub> phải được hiệu chỉnh theo các hệ số năng lượng búa và chiều dài cần khoan để đưa về giá trị <var>N</var><sub>60</sub> trước khi tính toán.</li>
            <li>Bắt buộc quan trắc lún định kỳ đối với các công trình cấp đặc biệt (C3) từ khi thi công móng đến khi bàn giao và đưa vào sử dụng.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
