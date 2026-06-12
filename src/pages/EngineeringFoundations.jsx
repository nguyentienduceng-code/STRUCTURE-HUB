import { useState } from 'react';
import CollapsibleSection from '../components/CollapsibleSection';
import { 
  BookOpen, 
  Activity, 
  Cpu,
  CornerRightDown,
  Maximize2,
  Layers
} from 'lucide-react';

export default function EngineeringFoundations() {
  const [activeTab, setActiveTab] = useState('properties');

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
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .tab-btn:hover {
          background: var(--overlay-light);
          color: var(--text-primary);
        }
        .tab-btn.active {
          background: var(--accent-gradient);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
        }
        @media (max-width: 768px) {
          .tab-nav {
            flex-wrap: nowrap;
          }
          .tab-btn {
            padding: 12px 20px;
            font-size: 1.15rem;
            gap: 4px;
          }
        }
        .theory-section {
          animation: fadeIn 0.4s ease-out;
        }

        .app-box {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }
        .app-box-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #10b981;
          font-weight: 700;
          margin-bottom: 8px;
          font-size: 1.15rem;
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
          padding: 12px 20px;
          border-radius: 4px;
          font-size: 1.15rem;
          font-weight: 600;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        .bullet-purple {
          color: var(--accent-primary);
          font-weight: bold;
          margin-right: 6px;
        }
      `}</style>

      <h1 className="page-title">1. Nền tảng Kỹ thuật & Sức bền Vật liệu</h1>

      <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(102,126,234,0.1) 100%)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 30px rgba(139,92,246,0.15)' }}>
        <h2 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={24} color="var(--accent-primary)" />
          <span className="gradient-text">Hệ thống Lý thuyết Sức bền & Ứng dụng Thực hành Kết cấu</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Tổng hợp kiến thức nền tảng về Sức bền Vật liệu (SBVL), cơ lý vật chất và ngoại lực. Bản tra cứu giải thích chi tiết ý nghĩa của các đại lượng vật lý, ký hiệu toán học và vai trò quyết định của chúng trong các quy trình tính toán kết cấu thực tế sau này.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
          <Cpu size={18} />
          1.1. Đặc trưng Vật liệu
        </button>
        <button className={`tab-btn ${activeTab === 'basics' ? 'active' : ''}`} onClick={() => setActiveTab('basics')}>
          <BookOpen size={18} />
          1.2. Cơ sở & Tải trọng
        </button>
        <button className={`tab-btn ${activeTab === 'internal' ? 'active' : ''}`} onClick={() => setActiveTab('internal')}>
          <CornerRightDown size={18} />
          1.3. Nội lực & Biểu đồ
        </button>
        <button className={`tab-btn ${activeTab === 'stress' ? 'active' : ''}`} onClick={() => setActiveTab('stress')}>
          <Maximize2 size={18} />
          1.4. Ứng suất & Vòng tròn Mohr
        </button>
        <button className={`tab-btn ${activeTab === 'strain' ? 'active' : ''}`} onClick={() => setActiveTab('strain')}>
          <Activity size={18} />
          1.5. Biến dạng & Hooke
        </button>
        <button className={`tab-btn ${activeTab === 'buckling' ? 'active' : ''}`} onClick={() => setActiveTab('buckling')}>
          <Layers size={18} />
          1.6. Ổn định dọc (Buckling)
        </button>
      </div>

      {/* TAB 1: ĐẶC TRƯNG VẬT LIỆU & TIẾT DIỆN */}
      {activeTab === 'properties' && (
        <div className="theory-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="1. Đặc trưng Hình học Tiết diện (Sức bền Vật liệu)">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Khả năng chịu lực của cấu kiện phụ thuộc lớn vào hình dạng và kích thước hình học của mặt cắt ngang:
              </p>
              
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Mô men quán tính (<var>I</var>):</strong> Khả năng chống uốn cong quanh một trục.
                  <div className="formula-card">
                    <div className="formula-line">
                      Tiết diện chữ nhật: <var>I</var><sub>x</sub> = <span className="fraction"><span className="numerator"><var>b</var>&middot;<var>h</var><sup>3</sup></span><span className="denominator">12</span></span>
                    </div>
                    <div className="formula-line">
                      Tiết diện tròn: <var>I</var> = <span className="fraction"><span className="numerator">&pi;&middot;<var>d</var><sup>4</sup></span><span className="denominator">64</span></span>
                    </div>
                    <div className="formula-desc">
                      <var>b</var>, <var>h</var>: chiều rộng, chiều cao tiết diện chữ nhật; <var>d</var>: đường kính hình tròn.
                    </div>
                  </div>
                </li>
                
                <li style={{ marginBottom: '12px' }}>
                  <strong>Mô đun chống uốn (<var>W</var> hoặc <var>S</var>):</strong> Thể hiện mức độ chịu ứng suất pháp cực đại tại thớ xa nhất của tiết diện.
                  <div className="formula-card">
                    <div className="formula-line">
                      Tiết diện chữ nhật: <var>W</var><sub>x</sub> = <span className="fraction"><span className="numerator"><var>b</var>&middot;<var>h</var><sup>2</sup></span><span className="denominator">6</span></span>
                    </div>
                    <div className="formula-line">
                      Tiết diện tròn: <var>W</var><sub>x</sub> = <span className="fraction"><span className="numerator">&pi;&middot;<var>d</var><sup>3</sup></span><span className="denominator">32</span></span>
                    </div>
                    <div className="formula-line">
                      Ứng suất lớn nhất: <var>&sigma;</var><sub>max</sub> = <span className="fraction"><span className="numerator"><var>M</var><sub>max</sub></span><span className="denominator"><var>W</var></span></span> &le; <var>f</var>
                    </div>
                    <div className="formula-desc">
                      <var>M</var><sub>max</sub>: mô-men uốn lớn nhất; <var>f</var>: cường độ tính toán của vật liệu.
                    </div>
                  </div>
                </li>
                
                <li>
                  <strong>Đặc trưng Độ cứng cơ học dầm/cột:</strong>
                  <ul style={{ paddingLeft: '16px', marginTop: '6px' }}>
                    <li>Độ cứng dọc trục: <var>E</var>&middot;<var>A</var> (kéo/nén dọc trục).</li>
                    <li>Độ cứng chống uốn: <var>E</var>&middot;<var>I</var> (chống võng/cong). Độ cong <var>C</var> = <span className="fraction"><span className="numerator">1</span><span className="denominator"><var>&rho;</var></span></span> = <span className="fraction"><span className="numerator"><var>M</var></span><span className="denominator"><var>E</var>&middot;<var>I</var></span></span>. Công thức độ võng dầm đơn giản giữa nhịp: <var>f</var> &prop; <span className="fraction"><span className="numerator"><var>P</var>&middot;<var>L</var><sup>3</sup></span><span className="denominator"><var>E</var>&middot;<var>I</var></span></span>.</li>
                    <li>Độ cứng chống xoắn: <var>G</var>&middot;<var>I</var><sub>p</sub> hoặc <var>G</var>&middot;<var>I</var><sub>t</sub> (chống vặn xoắn).</li>
                  </ul>
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="2. Đặc trưng Vật lý Bê tông (TCVN 5574:2018)">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Bê tông là vật liệu đàn dẻo chịu nén tốt, chịu kéo yếu, biến dạng phức tạp theo thời gian:
              </p>
              
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Mô đun đàn hồi ban đầu (<var>E</var><sub>b</sub>):</strong> Trong miền đàn hồi (&sigma; &le; 0.3 <var>R</var><sub>b</sub>). Cấp bền B25: <var>E</var><sub>b</sub> = 30&times;10<sup>3</sup> MPa (30 GPa). Cấp bền B50: <var>E</var><sub>b</sub> = 37&times;10<sup>3</sup> MPa (37 GPa).
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Mô đun trượt (<var>G</var><sub>b</sub>):</strong> Chống biến dạng trượt do cắt, xoắn:
                  <div className="formula-block">
                    <var>G</var><sub>b</sub> = 0.4 &middot; <var>E</var><sub>b</sub>
                  </div>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Hệ số Poisson (&nu;<sub>b</sub>):</strong> Tỷ lệ nở ngang lấy cố định bằng &nu;<sub>b</sub> = 0.2.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Biến dạng dài hạn (<var>E</var><sub>b,long</sub>):</strong> Do từ biến dài hạn dưới tác dụng của tĩnh tải:
                  <div className="formula-block">
                    <var>E</var><sub>b,long</sub> = <span className="fraction"><span className="numerator"><var>E</var><sub>b</sub></span><span className="denominator">1 + <var>&phi;</var><sub>b,cr</sub></span></span>
                  </div>
                  <div className="formula-desc">
                    <var>&phi;</var><sub>b,cr</sub>: hệ số từ biến của bê tông (thường lấy từ 1.5 đến 3.0).
                  </div>
                </li>
                <li>
                  <strong>Giãn nở nhiệt (&alpha;<sub>bt</sub>):</strong> Hệ số dãn nở nhiệt tuyến tính đối với bê tông nặng lấy bằng &alpha;<sub>bt</sub> = 1&times;10<sup>-5</sup> / &deg;C.
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="3. Đặc trưng Vật lý Thép (TCVN 5575:2024 & TCVN 5574:2018)">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Thép là vật liệu đẳng hướng, có tính dẻo cao giúp phân phối lại nội lực và chịu lực rất tốt:
              </p>
              
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Giới hạn chảy (<var>f</var><sub>y</sub> hoặc <var>R</var><sub>yn</sub>):</strong> Ứng suất chuyển sang miền chảy dẻo. Biến dạng giãn dài tương đối cực hạn đàn hồi:
                  <div className="formula-block">
                    <var>&epsilon;</var><sub>s,el</sub> = <span className="fraction"><span className="numerator"><var>f</var><sub>y</sub></span><span className="denominator"><var>E</var><sub>s</sub></span></span>
                  </div>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Mô đun đàn hồi (<var>E</var><sub>s</sub>):</strong>
                  <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                    <li>Cốt thép trong bê tông: <var>E</var><sub>s</sub> = 2&times;10<sup>5</sup> MPa (200 GPa).</li>
                    <li>Cáp thép cường độ cao: <var>E</var><sub>s</sub> = 1.8&times;10<sup>5</sup> MPa (180 GPa).</li>
                    <li>Thép hình kết cấu (TCVN 5575:2024): <var>E</var><sub>s</sub> = 2.06&times;10<sup>5</sup> MPa (206 GPa).</li>
                  </ul>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Mô đun trượt của thép (<var>G</var><sub>s</sub>):</strong> Lấy bằng <var>G</var><sub>s</sub> = 7.9&times;10<sup>4</sup> MPa (79000 MPa, tương ứng 7900 kN/cm²). Mối liên hệ tổng quát:
                  <div className="formula-block">
                    <var>G</var><sub>s</sub> = <span className="fraction"><span className="numerator"><var>E</var><sub>s</sub></span><span className="denominator">2 &middot; (1 + <var>&nu;</var><sub>s</sub>)</span></span>
                  </div>
                </li>
                <li>
                  <strong>Hệ số Poisson (&nu;<sub>s</sub>):</strong> Lấy cố định &nu;<sub>s</sub> = 0.3 đối với thép trong giới hạn đàn hồi.
                </li>
              </ul>
            </CollapsibleSection>
          </div>
          
          <div className="app-box" style={{ marginTop: '24px' }}>
            <div className="app-box-title">
              <Cpu size={16} />
              Ý NGHĨA CỦA CÁC ĐẠI LƯỢNG ĐẶC TRƯNG TRONG THIẾT KẾ THỰC TẾ:
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
              <li><strong>Phân tích ứng suất cục bộ:</strong> Công thức ứng suất pháp <var>&sigma;</var> = <var>M</var>/<var>W</var> quyết định trực tiếp tính toán dầm thép hình (I, H, U) chịu uốn theo trạng thái giới hạn ULS.</li>
              <li><strong>Độ võng và biến dạng dài hạn:</strong> Trong BTCT, do bê tông bị nứt và có từ biến dài hạn dưới tĩnh tải đứng, độ cứng <var>E</var>&middot;<var>I</var> bị suy giảm nghiêm trọng. Kỹ sư bắt buộc phải dùng mô-đun đàn hồi dài hạn <var>E</var><sub>b,long</sub> và nhân hệ số độ cứng hiệu chỉnh khi tính độ võng dài hạn của sàn bê tông nhịp lớn.</li>
              <li><strong>Thiết kế chống động đất & gió động:</strong> Mô-đun trượt <var>G</var><sub>s</sub> của thép hình kết cấu và <var>G</var><sub>b</sub> của bê tông quyết định độ cứng chống xoắn của toàn công trình khi phân tích dao động không gian.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: CƠ SỞ & TẢI TRỌNG */}
      {activeTab === 'basics' && (
        <div className="theory-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="3 Trụ cột của Sức bền Vật liệu">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Mục tiêu cốt lõi của SBVL là thiết kế cấu kiện thỏa mãn 3 tiêu chuẩn cơ bản dưới tác động của các điều kiện tải trọng bất lợi nhất:
              </p>
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '8px' }}>
                  <span className="bullet-purple">&bull;</span>
                  <strong>Độ bền (Strength):</strong> Khả năng chống chịu lực kéo, nén, cắt, uốn mà không bị nứt vỡ, đứt gãy hoặc phá hủy hoàn toàn.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <span className="bullet-purple">&bull;</span>
                  <strong>Độ cứng (Stiffness):</strong> Khả năng chống lại sự biến dạng và chuyển vị (võng, xoay). Biến dạng phải nằm trong giới hạn cho phép để đảm bảo mỹ quan và khả năng sử dụng bình thường.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <span className="bullet-purple">&bull;</span>
                  <strong>Độ ổn định (Stability):</strong> Khả năng duy trì hình học cân bằng ban đầu. Cấu kiện chịu nén không được bị oằn hoặc mất ổn định đột ngột (buckling).
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Các Giả thuyết Kinh điển">
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Liên tục, đồng chất, đẳng hướng:</strong> Vật liệu chiếm đầy không gian, không có lỗ rỗng vĩ mô và có đặc tính cơ lý giống nhau tại mọi điểm theo mọi hướng. Cho phép dùng vi tích phân để giải bài toán.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Đàn hồi tuyến tính:</strong> Vật liệu phục hồi hoàn toàn trạng thái ban đầu sau khi dỡ tải. Mối quan hệ giữa ứng suất và biến dạng là bậc nhất (Định luật Hooke).
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Biến dạng bé:</strong> Chuyển vị rất nhỏ so với kích thước ban đầu. Cho phép thiết lập phương trình cân bằng trên hình dạng chưa biến dạng và áp dụng <em>Nguyên lý cộng tác dụng</em>.
                </li>
              </ul>
            </CollapsibleSection>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Ngoại lực & Cách thức Phân loại</h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p>Ngoại lực bao gồm <strong>Tải trọng chủ động</strong> (tác nhân ngoài tác dụng lên kết cấu) và <strong>Phản lực liên kết</strong> (lực bị động phát sinh tại gối đỡ để cân bằng hệ lực).</p>
              <div className="grid-half" style={{ marginTop: '16px' }}>
                <div>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>Theo thời gian tác dụng:</h4>
                  <ul>
                    <li><strong>Tải trọng tĩnh:</strong> Đặt vào từ từ, giá trị không đổi hoặc thay đổi rất chậm, có thể bỏ qua lực quán tính (Trọng lượng bản thân kết cấu, lớp trát, sàn lát).</li>
                    <li><strong>Tải trọng động:</strong> Thay đổi nhanh theo thời gian, gây ra dao động và lực quán tính đáng kể (Gió giật, động đất, thiết bị máy móc rung lắc, va chạm xe).</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>Theo sơ đồ phân bố:</h4>
                  <ul>
                    <li><strong>Lực tập trung (P):</strong> Tác dụng lên một diện tích rất nhỏ, lý tưởng hóa thành một điểm duy nhất (Vd: cột truyền lực xuống dầm).</li>
                    <li><strong>Lực phân bố (q):</strong> Tác dụng đều dọc theo chiều dài (dầm) hoặc diện tích (sàn). Phổ biến gồm: phân bố đều, phân bố tam giác (áp lực nước lên thành bể), phân bố hình thang (áp lực đất lên tường chắn).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Tổ hợp Tải trọng Tiêu chuẩn Việt Nam (TCVN 2737-2023)</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Quy trình thiết kế bắt buộc phải tổ hợp các loại tải trọng khác nhau (Thường xuyên G<sub>k</sub>, Tạm thời dài hạn Q<sub>k,L</sub>, Tạm thời ngắn hạn Q<sub>k,t</sub>, Đặc biệt A<sub>d</sub>) để tìm ra nội lực bất lợi nhất.
            </p>

            <div className="grid-layout">
              <div className="formula-card">
                <div className="formula-line">Trạng thái Giới hạn 1 (TTGH1 - ULS):</div>
                <var>C</var><sub><var>m</var></sub> = &gamma;<sub><var>n</var></sub> [ &sum;&thinsp;&gamma;<sub><var>f</var>,<var>i</var></sub><var>G</var><sub><var>k</var>,<var>i</var></sub> + &gamma;<sub><var>f</var>,<var>j</var></sub>&psi;<sub><var>L</var>,<var>j</var></sub><var>Q</var><sub><var>k</var>,<var>L</var>,<var>j</var></sub> + &sum;&thinsp;&gamma;<sub><var>f</var>,<var>m</var></sub>&psi;<sub><var>t</var>,<var>m</var></sub><var>Q</var><sub><var>k</var>,<var>t</var>,<var>m</var></sub> ]
                <div className="formula-desc">
                  Thiết kế theo khả năng chịu lực (Bền & Ổn định). Trong đó: &gamma;<sub><var>f</var></sub> là hệ số độ tin cậy tải trọng (vượt tải, vd: gió &gamma;<sub><var>f</var></sub> = 2.1); &psi; là hệ số tổ hợp (&le; 1.0) xét xác suất xuất hiện đồng thời; &gamma;<sub><var>n</var></sub> là hệ số tầm quan trọng công trình (QCVN 03:2022).
                </div>
              </div>

              <div className="formula-card">
                <div className="formula-line">Trạng thái Giới hạn 2 (TTGH2 - SLS):</div>
                <var>C</var><sub><var>m</var></sub> = &sum;&thinsp;<var>G</var><sub><var>k</var>,<var>i</var></sub> + &sum;&thinsp;&psi;<sub><var>L</var>,<var>j</var></sub><var>Q</var><sub><var>k</var>,<var>L</var>,<var>j</var></sub> + &sum;&thinsp;&psi;<sub><var>t</var>,<var>m</var></sub><var>Q</var><sub><var>k</var>,<var>t</var>,<var>m</var></sub>
                <div className="formula-desc">
                  Thiết kế theo điều kiện sử dụng bình thường (Độ võng & Khe nứt). Các hệ số độ tin cậy tải trọng được lấy bằng 1.0 (&gamma;<sub><var>f</var></sub> = 1.0) và &gamma;<sub><var>n</var></sub> = 1.0.
                </div>
              </div>
            </div>

            <div className="app-box">
              <div className="app-box-title">
                <Cpu size={16} />
                ỨNG DỤNG TRONG QUÁ TRÌNH TÍNH TOÁN KẾT CẤU SAU NÀY:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                <li>Các tổ hợp ULS (TTGH1) được nhập trực tiếp vào các phần mềm phân tích phần tử hữu hạn (ETABS, SAP2000, SAFE) để tính toán mô-men uốn và lực cắt thiết kế, làm căn cứ xác định diện tích cốt thép dầm, cột, móng, vách cứng hoặc kiểm tra ứng suất trong kết cấu thép.</li>
                <li>Các tổ hợp SLS (TTGH2) được dùng để chạy phân tích độ võng của dầm, sàn bê tông (phải kể đến nứt và từ biến dài hạn của bê tông) và kiểm tra chuyển vị ngang đỉnh tháp nhà cao tầng dưới tác dụng của gió tiêu chuẩn nhằm đảm bảo giới hạn H/500.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NỘI LỰC & BIỂU ĐỒ */}
      {activeTab === 'internal' && (
        <div className="theory-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="Phương pháp Mặt cắt & Bộc lộ Nội lực">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Nội lực là các lực tương tác nội tại phát sinh giữa các phần tử vật chất để chống lại xu hướng biến dạng do ngoại lực. Để xác định nội lực tại một tiết diện:
              </p>
              <ol style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li><strong>Cắt:</strong> Tưởng tượng dùng mặt phẳng cắt qua tiết diện cần xét để chia thanh làm 2 phần.</li>
                <li><strong>Bỏ:</strong> Loại bỏ 1 phần (thường chọn phần phức tạp hơn).</li>
                <li><strong>Thay:</strong> Thay thế tác dụng của phần đã bỏ bằng các thành phần nội lực đặt tại trọng tâm mặt cắt.</li>
                <li><strong>Cân bằng:</strong> Viết phương trình cân bằng tĩnh học cho phần được giữ lại để tìm trị số nội lực.</li>
              </ol>
            </CollapsibleSection>

            <CollapsibleSection title="6 Thành phần Nội lực Không gian">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Trên một mặt cắt ngang của thanh trong không gian 3 chiều, nội lực quy đổi về trọng tâm tiết diện gồm:
              </p>
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li><strong>Lực dọc (N<sub>z</sub>):</strong> Vuông góc mặt cắt. N<sub>z</sub> &gt; 0 gây kéo, N<sub>z</sub> &lt; 0 gây nén.</li>
                <li><strong>Lực cắt (Q<sub>x</sub>, Q<sub>y</sub>):</strong> Nằm trong mặt phẳng tiết diện, gây ra biến dạng trượt cắt.</li>
                <li><strong>Mô-men uốn (M<sub>x</sub>, M<sub>y</sub>):</strong> Quay quanh trục x và y, gây uốn cong thanh làm căng thớ vật liệu.</li>
                <li><strong>Mô-men xoắn (M<sub>z</sub> / T):</strong> Quay quanh trục z của thanh, gây xoắn các thớ dọc.</li>
                <li><em>Bài toán phẳng:</em> Thường chỉ xét 3 thành phần chính: Lực dọc N<sub>z</sub>, Lực cắt Q<sub>y</sub>, Mô-men uốn M<sub>x</sub>.</li>
              </ul>
            </CollapsibleSection>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Mối quan hệ Vi phân & Quy luật Bước nhảy trên Biểu đồ</h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p>Mối liên hệ vi phân giữa tải trọng phân bố q(z), lực cắt Q<sub>y</sub>(z) và mô-men uốn M<sub>x</sub>(z) trong uốn phẳng:</p>
              
              <div className="grid-half" style={{ marginTop: '16px' }}>
                <div className="formula-card">
                  <div className="formula-line">Đạo hàm lực cắt:</div>
                  d<var>Q</var><sub><var>y</var></sub>(<var>z</var>) / d<var>z</var> = -<var>q</var>(<var>z</var>)
                  <div className="formula-desc">
                    Độ dốc của biểu đồ lực cắt tại một điểm bằng trị số âm của tải trọng phân bố tại điểm đó.
                  </div>
                </div>

                <div className="formula-card">
                  <div className="formula-line">Đạo hàm mô-men uốn:</div>
                  d<var>M</var><sub><var>x</var></sub>(<var>z</var>) / d<var>z</var> = <var>Q</var><sub><var>y</var></sub>(<var>z</var>)
                  <div className="formula-desc">
                    Đạo hàm bậc nhất của mô-men uốn bằng lực cắt. Biểu đồ mô-men đạt cực trị (M<sub>max</sub>) tại vị trí Q<sub>y</sub> = 0.
                  </div>
                </div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>Quy tắc bước nhảy khi vẽ biểu đồ nội lực nhanh:</h4>
              <ul>
                <li><strong>Lực tập trung P<sub>y</sub>:</strong> Làm biểu đồ lực cắt Q<sub>y</sub> nhảy một bước bằng đúng trị số P<sub>y</sub> (theo chiều của lực).</li>
                <li><strong>Mô-men tập trung M<sub>0</sub>:</strong> Làm biểu đồ mô-men uốn M<sub>x</sub> nhảy một bước bằng đúng trị số M<sub>0</sub> (chiều bước nhảy phụ thuộc quy ước căng thớ).</li>
              </ul>
            </div>

            <div className="app-box">
              <div className="app-box-title">
                <Cpu size={16} />
                ỨNG DỤNG TRONG QUÁ TRÌNH TÍNH TOÁN KẾT CẤU SAU NÀY:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                <li><strong>Thiết kế thép dọc dầm BTCT:</strong> Dựa vào biểu đồ mô-men uốn M<sub>x</sub> để tìm vị trí M<sub>max</sub> (thường ở giữa nhịp gây căng thớ dưới và ở gối tựa gây căng thớ trên), từ đó tính lượng thép dọc kéo tương ứng A<sub>s</sub> = M / (f<sub>y</sub> &middot; z).</li>
                <li><strong>Cắt giảm cốt thép dọc:</strong> Điểm uốn mô-men bằng 0 (điểm uốn hình học) trên biểu đồ mô-men là căn cứ kỹ thuật để kỹ sư quyết định vị trí cắt bớt thép dọc hoặc chọn vị trí nối thép (vùng chịu mô-men nhỏ hoặc bằng 0).</li>
                <li><strong>Bố trí thép đai dầm:</strong> Biểu đồ lực cắt Q<sub>y</sub> cho biết lực cắt cực đại Q<sub>max</sub> tại mép cột gối tựa. Cốt đai sẽ được bố trí dày đặc hơn (vd: a100) tại các vùng biên này để chống nứt xiên do cắt, và thưa dần về giữa nhịp (vd: a200) nơi lực cắt giảm nhỏ.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ỨNG SUẤT & VÒNG TRÒN MOHR */}
      {activeTab === 'stress' && (
        <div className="theory-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="Ứng suất Pháp (σ) & Ứng suất Tiếp (τ)">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Ứng suất là cường độ nội lực phân bố trên một đơn vị diện tích tiết diện tại một điểm cụ thể. Đơn vị: N/m² (Pa) hoặc MPa (1 MPa = 1 N/mm²).
              </p>
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Ứng suất pháp (&sigma;):</strong> Thành phần vuông góc với mặt cắt. Gây ra sự kéo dài hoặc co ngắn thớ dọc trục. Công thức kéo/nén đúng tâm:
                  <div className="formula-block" style={{ margin: '8px 0', padding: '6px' }}><var>&sigma;</var> = <var>N</var><sub><var>z</var></sub> / <var>A</var></div>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Ứng suất tiếp (&tau;):</strong> Thành phần song song (nằm trong) mặt phẳng tiết diện. Gây ra hiện tượng trượt cắt giữa các lớp vật liệu kề nhau. Công thức cắt trung bình:
                  <div className="formula-block" style={{ margin: '8px 0', padding: '6px' }}><var>&tau;</var><sub><var>tb</var></sub> = <var>Q</var> / <var>A</var></div>
                </li>
                <li>Mối liên hệ ứng suất toàn phần <var>p</var>: <var>p</var><sup>2</sup> = <var>&sigma;</var><sup>2</sup> + <var>&tau;</var><sup>2</sup>.</li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Ứng suất Chính & Phương chính">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Tại mỗi điểm bên trong cấu kiện, khi ta xoay mặt cắt theo các góc khác nhau, trị số ứng suất pháp và tiếp sẽ thay đổi.
              </p>
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Mặt chính:</strong> Mặt cắt đặc biệt mà tại đó ứng suất tiếp &tau; = 0.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Phương chính:</strong> Phương pháp tuyến vuông góc với mặt chính.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Ứng suất chính (&sigma;<sub>1</sub>, &sigma;<sub>2</sub>, &sigma;<sub>3</sub>):</strong> Ứng suất pháp tác dụng trên các mặt chính, được sắp xếp theo thứ tự đại số giảm dần:
                  <div className="formula-block" style={{ margin: '8px 0', padding: '6px' }}><var>&sigma;</var><sub>1</sub> &ge; <var>&sigma;</var><sub>2</sub> &ge; <var>&sigma;</var><sub>3</sub></div>
                  &sigma;<sub>1</sub> là ứng suất kéo chính cực đại, &sigma;<sub>3</sub> là ứng suất nén chính cực đại.
                </li>
              </ul>
            </CollapsibleSection>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Vòng tròn Mohr cho Trạng thái Ứng suất phẳng</h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p>
                Vòng tròn Mohr là công cụ hình học trực quan hóa phương trình biến đổi ứng suất phẳng khi xoay trục tọa độ. Từ các giá trị ứng suất ban đầu (&sigma;<sub>x</sub>, &sigma;<sub>y</sub>, &tau;<sub>xy</sub>), ta dựng vòng tròn trên hệ tọa độ trục hoành &sigma; và trục tung &tau;:
              </p>

              <div className="grid-half" style={{ marginTop: '16px' }}>
                <div className="formula-card">
                  <div className="formula-line">Tọa độ tâm C và Bán kính R:</div>
                  <var>&sigma;</var><sub><var>C</var></sub> = (&sigma;<sub><var>x</var></sub> + &sigma;<sub><var>y</var></sub>) / 2
                  <br/>
                  <var>R</var> = &radic;[ ((&sigma;<sub><var>x</var></sub> - &sigma;<sub><var>y</var></sub>)/2)<sup>2</sup> + &tau;<sub><var>xy</var></sub><sup>2</sup> ]
                  <div className="formula-desc">
                    Tâm C nằm trên trục hoành (&sigma;<sub>C</sub>, 0). Bán kính R biểu thị biên độ biến đổi của ứng suất.
                  </div>
                </div>

                <div className="formula-card">
                  <div className="formula-line">Ứng suất chính & Ứng suất tiếp cực đại:</div>
                  <var>&sigma;</var><sub>1,2</sub> = <var>&sigma;</var><sub><var>C</var></sub> &plusmn; <var>R</var>
                  <br/>
                  <var>&tau;</var><sub><var>max</var></sub> = <var>R</var>
                  <br/>
                  tan(2&theta;<sub><var>p</var></sub>) = 2&tau;<sub><var>xy</var></sub> / (&sigma;<sub><var>x</var></sub> - &sigma;<sub><var>y</var></sub>)
                  <div className="formula-desc">
                    &sigma;<sub>1</sub>, &sigma;<sub>2</sub> là hoành độ giao điểm của vòng tròn với trục &sigma;. &tau;<sub>max</sub> là đỉnh cao nhất của vòng tròn.
                  </div>
                </div>
              </div>
            </div>

            <div className="app-box">
              <div className="app-box-title">
                <Cpu size={16} />
                ỨNG DỤNG TRONG QUÁ TRÌNH TÍNH TOÁN KẾT CẤU SAU NÀY:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                <li><strong>Kiểm tra nứt chéo dầm BTCT:</strong> Bê tông chịu kéo rất kém. Lực cắt lớn gần gối tựa kết hợp ứng suất uốn tạo ra trạng thái ứng suất phẳng phức tạp. Bằng cách tính ứng suất kéo chính &sigma;<sub>1</sub> tại mép dầm, nếu &sigma;<sub>1</sub> &gt; R<sub>bt</sub> (cường độ chịu kéo tính toán của bê tông), bê tông sẽ bị nứt xiên một góc 45 độ (hướng vết nứt vuông góc với phương của &sigma;<sub>1</sub>). Đây là cơ sở lý thuyết bắt buộc kỹ sư phải bố trí thép đai hoặc thép xiên để gánh lực kéo chính này.</li>
                <li><strong>Cơ học đất nền (Thí nghiệm nén 3 trục):</strong> Trong địa kỹ thuật, mẫu đất chịu áp lực buồng &sigma;<sub>3</sub> và áp lực dọc &sigma;<sub>1</sub> tăng dần. Vòng tròn Mohr được vẽ cho các giai đoạn phá hủy của các mẫu đất khác nhau. Đường tiếp tuyến chung của các vòng tròn Mohr này (Đường phá hủy Mohr-Coulomb) xác định trực tiếp hai thông số cốt lõi của đất nền: Góc ma sát trong &phi; và Lực dính c, dùng để tính toán sức chịu tải của móng nông và móng cọc.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BIẾN DẠNG & ĐỊNH LUẬT HOOKE */}
      {activeTab === 'strain' && (
        <div className="theory-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="Biến dạng dài (ε) & Biến dạng trượt (γ)">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Biến dạng mô tả sự thay đổi hình học của cấu kiện dưới tác dụng của lực hoặc nhiệt độ.
              </p>
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Biến dạng dài tương đối (&epsilon;):</strong> Sự thay đổi chiều dài trên một đơn vị chiều dài ban đầu. Là đại lượng không thứ nguyên.
                  <div className="formula-block" style={{ margin: '8px 0', padding: '6px' }}><var>&epsilon;</var> = &Delta;<var>l</var> / <var>l</var><sub>0</sub></div>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Biến dạng trượt (&gamma;):</strong> Sự thay đổi góc vuông ban đầu giữa hai thớ trực giao (đo bằng radian). Thể hiện mức độ méo hình học do ứng suất tiếp gây ra.
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Định luật Hooke & Hằng số Đàn hồi">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Trong miền đàn hồi tuyến tính, ứng suất tỷ lệ thuận với biến dạng thông qua các đặc trưng vật lý:
              </p>
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Định luật Hooke 1D:</strong> <var>&sigma;</var> = <var>E</var> &middot; <var>&epsilon;</var> &nbsp; | &nbsp; <var>&tau;</var> = <var>G</var> &middot; <var>&gamma;</var>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Mô-đun đàn hồi Young (E):</strong> Đặc trưng cho độ cứng chống kéo/nén dọc trục (Thép E &asymp; 2&times;10<sup>5</sup> MPa; Bê tông B25 E &asymp; 3&times;10<sup>4</sup> MPa).
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Mô-đun trượt (G):</strong> Đặc trưng cho độ cứng chống cắt.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Hệ số Poisson (&nu;):</strong> Tỷ số co ngót ngang khi kéo dọc (Thép &nu; = 0.3; Bê tông &nu; = 0.2).
                </li>
                <li><strong>Mối liên hệ vật liệu đẳng hướng:</strong> <var>G</var> = <var>E</var> / [2(1 + &nu;)].</li>
              </ul>
            </CollapsibleSection>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Biểu đồ Kéo Thép Dẻo điển hình & Hiện tượng Mỏi</h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p>Khi thí nghiệm kéo một thanh thép dẻo carbon thấp, mẫu thép trải qua các giai đoạn rõ rệt:</p>
              <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li><strong>Đàn hồi tuyến tính:</strong> Tuân thủ định luật Hooke &sigma; = E&epsilon; lên tới giới hạn tỷ lệ.</li>
                <li><strong>Chảy dẻo (Thềm chảy):</strong> Thanh thép tiếp tục giãn dài mà lực kéo hầu như không đổi. Giá trị ứng suất tại thềm này gọi là <strong>Giới hạn chảy f<sub>y</sub></strong> (hoặc &sigma;<sub>ch</sub>). Đây là thông số thiết kế quan trọng nhất của thép kết cấu.</li>
                <li><strong>Tái bền (Củng cố):</strong> Vật liệu tự phục hồi khả năng chịu lực, ứng suất tiếp tục tăng đạt cực đại tại <strong>Giới hạn bền f<sub>u</sub></strong> (hoặc &sigma;<sub>b</sub>).</li>
                <li><strong>Thắt cổ chai & Đứt:</strong> Tiết diện mẫu co hẹp cục bộ tại một điểm và đứt hoàn toàn.</li>
              </ol>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>Giới hạn mỏi của vật liệu (&sigma;<sub>f</sub>):</h4>
              <p>
                Dưới tác dụng của tải trọng lặp tuần hoàn nhiều chu kỳ (vd: dầm cầu xe chạy, dầm đỡ máy), vật liệu có thể bị nứt vỡ đột ngột ở mức ứng suất thấp hơn nhiều so với giới hạn chảy f<sub>y</sub>. Hiện tượng này gọi là <strong>phá hoại mỏi</strong>. Giới hạn mỏi &sigma;<sub>f</sub> phụ thuộc rất lớn vào chất lượng bề mặt thanh thép (gân thép vằn làm tập trung ứng suất, làm giảm độ bền mỏi so với thép tròn trơn) và các liên kết hàn.
              </p>
            </div>

            <div className="app-box">
              <div className="app-box-title">
                <Cpu size={16} />
                ỨNG DỤNG TRONG QUÁ TRÌNH TÍNH TOÁN KẾT CẤU SAU NÀY:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                <li><strong>Khống chế độ võng dầm/sàn (SLS):</strong> Độ cứng chống uốn của dầm phụ thuộc trực tiếp vào tích số <strong>E &middot; I</strong> (Mô-đun đàn hồi &times; Mô-men quán tính). Việc tính toán độ võng dài hạn của sàn BTCT theo TCVN 5574:2018 bắt buộc phải điều chỉnh Mô-đun đàn hồi E<sub>b</sub> của bê tông bằng các hệ số chiết giảm từ biến để xét đến sự suy giảm độ cứng theo thời gian.</li>
                <li><strong>Phân tích dao động và động đất:</strong> Trong mô hình tòa nhà cao tầng, ma trận độ cứng của khung nhà tỷ lệ thuận với E. Chu kỳ dao động tự riêng của tòa nhà (được dùng để tính toán lực động đất tác dụng theo TCVN 9386:2012) được xác định trực tiếp từ độ cứng đàn hồi E và khối lượng phân bổ của công trình.</li>
                <li><strong>Phân tích kết cấu thép (TCVN 5575:2024):</strong> Cường độ tính toán thiết kế của cấu kiện thép f được tính bằng f = f<sub>y</sub> / &gamma;<sub>M</sub> (với f<sub>y</sub> là giới hạn chảy tiêu chuẩn và &gamma;<sub>M</sub> là hệ số độ tin cậy vật liệu từ 1.05 đến 1.1). Đối với các cấu kiện chịu tải trọng lặp trực tiếp (như dầm cầu trục nhà xưởng), bắt buộc phải kiểm tra điều kiện bền mỏi dựa trên biên độ ứng suất &Delta;&sigma; &le; [&Delta;&sigma;]<sub>f</sub>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ỔN ĐỊNH DỌC (BUCKLING) */}
      {activeTab === 'buckling' && (
        <div className="theory-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="Hiện tượng Uốn dọc & Lực tới hạn Euler">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Khi một cột mảnh chịu lực nén đúng tâm dọc trục tăng dần, đến một giá trị lực cụ thể gọi là <strong>Lực tới hạn P<sub>cr</sub> (Euler)</strong>, cột sẽ bị oằn cong sang bên và mất khả năng chịu tải một cách đột ngột.
              </p>
              <div className="formula-card">
                <div className="formula-line">Công thức Euler cho cột đàn hồi:</div>
                <var>P</var><sub><var>cr</var></sub> = &pi;<sup>2</sup> <var>E</var> <var>I</var> / <var>l</var><sub>0</sub><sup>2</sup>
                <div className="formula-desc">
                  Trong đó: E là mô-đun đàn hồi; I là mô-men quán tính nhỏ nhất của mặt cắt ngang; l<sub>0</sub> là chiều dài tính toán của cột.
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Hệ số Chiều dài tính toán (μ)">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Chiều dài tính toán l<sub>0</sub> = &mu; &middot; l. Hệ số &mu; phụ thuộc vào điều kiện liên kết biên ở hai đầu cột, phản ánh hình dạng oằn cong thực tế:
              </p>
              <table className="spec-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Liên kết biên</th>
                    <th>Hệ số &mu;</th>
                    <th>Mô tả hình dạng oằn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Khớp - Khớp</strong></td>
                    <td className="highlight-text">1.0</td>
                    <td>Một nửa sóng parabol đơn giản</td>
                  </tr>
                  <tr>
                    <td><strong>Ngàm - Tự do</strong></td>
                    <td className="highlight-text">2.0</td>
                    <td>Cột điện hoặc cột cờ oằn tự do ở đỉnh</td>
                  </tr>
                  <tr>
                    <td><strong>Ngàm - Khớp</strong></td>
                    <td className="highlight-text">0.7</td>
                    <td>Điểm uốn xuất hiện ở 1/3 chiều cao</td>
                  </tr>
                  <tr>
                    <td><strong>Ngàm - Ngàm</strong></td>
                    <td className="highlight-text">0.5</td>
                    <td>Bị kiềm chế xoay mạnh ở cả hai đầu</td>
                  </tr>
                </tbody>
              </table>
            </CollapsibleSection>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Độ mảnh (λ), Ứng suất tới hạn & Giới hạn áp dụng Euler</h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p>Khả năng mất ổn định của cột phụ thuộc vào tỷ lệ hình học giữa chiều dài và kích thước mặt cắt, được định lượng bằng <strong>Độ mảnh &lambda;</strong>:</p>
              
              <div className="grid-half" style={{ marginTop: '16px' }}>
                <div className="formula-card">
                  <div className="formula-line">Độ mảnh cột (&lambda;):</div>
                  <var>&lambda;</var> = <var>l</var><sub>0</sub> / <var>r</var>
                  <br/>
                  <var>r</var> = &radic;(<var>I</var> / <var>A</var>)
                  <div className="formula-desc">
                    Trong đó: r là bán kính quán tính của mặt cắt ngang; A là diện tích tiết diện. Cột có độ mảnh càng lớn càng dễ bị oằn.
                  </div>
                </div>

                <div className="formula-card">
                  <div className="formula-line">Ứng suất tới hạn (&sigma;<sub>cr</sub>):</div>
                  <var>&sigma;</var><sub><var>cr</var></sub> = &pi;<sup>2</sup> <var>E</var> / <var>&lambda;</var><sup>2</sup>
                  <div className="formula-desc">
                    Ứng suất tới hạn Euler chỉ áp dụng khi cột làm việc trong miền đàn hồi, tức là ứng suất tới hạn &sigma;<sub>cr</sub> &le; giới hạn tỷ lệ &sigma;<sub>tl</sub> (hay &lambda; &ge; &lambda;<sub>gh</sub> &asymp; 100 đối với thép).
                  </div>
                </div>
              </div>

              <h4 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>Cột trung bình và ngắn (Ngoài miền đàn hồi):</h4>
              <p>
                Khi cột có độ mảnh nhỏ (&lambda; &lt; &lambda;<sub>gh</sub>), vật liệu bị chảy dẻo trước khi oằn đàn hồi. Ứng suất tới hạn được xác định bằng công thức thực nghiệm của Yassin-sky: <strong>&sigma;<sub>cr</sub> = a - b &middot; &lambda;</strong>. Đối với cột rất ngắn (&lambda; &le; &lambda;<sub>0</sub>), cột hoàn toàn không bị uốn dọc mà bị phá hủy nén trực tiếp khi ứng suất đạt cường độ chảy dẻo của vật liệu.
              </p>
            </div>

            <div className="app-box">
              <div className="app-box-title">
                <Cpu size={16} />
                ỨNG DỤNG TRONG QUÁ TRÌNH TÍNH TOÁN KẾT CẤU SAU NÀY:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                <li><strong>Kiểm tra ổn định cột thép (TCVN 5575:2024):</strong> Thiết kế cột thép chịu nén dọc trục bắt buộc phải kiểm tra điều kiện ổn định tổng thể theo công thức N / (&phi; &middot; A) &le; f &middot; &gamma;<sub>c</sub>. Trong đó, hệ số uốn dọc &phi; (&le; 1.0) được tra cứu hoặc tính toán trực tiếp từ độ mảnh &lambda; của cột. Cột càng mảnh thì &phi; càng nhỏ (vd: &phi; có thể giảm xuống 0.2 - 0.3), làm giảm đáng kể khả năng chịu nén thực tế của cột thép.</li>
                <li><strong>Xác định chiều dài tính toán cột trong hệ khung cứng nhà cao tầng:</strong> Hệ số &mu; của cột trong khung nhà không phải là các con số lý thuyết cố định (0.5, 0.7, 1.0) mà được tính toán dựa trên độ cứng tương đối giữa dầm và cột tại các nút khung liên kết (sử dụng các sơ đồ đồ thị hình toán trong phụ lục tiêu chuẩn). Trong hệ khung không giằng (khung có thể dịch chuyển ngang), hệ số &mu; luôn lớn hơn 1.0 và có thể đạt tới 2.0 - 3.0, đòi hỏi cột phải có tiết diện lớn hơn nhiều để tránh oằn.</li>
                <li><strong>Thiết kế cột BTCT (TCVN 5574:2018):</strong> Độ mảnh của cột BTCT &lambda; = l<sub>0</sub> / h (với h là chiều rộng cạnh cột) quyết định xem cột là cột ngắn hay cột dài mảnh. Khi cột dài mảnh (&lambda; &gt; 8), sự mất ổn định dọc sẽ gây phát sinh thêm mô-men uốn phụ, tiêu chuẩn bắt buộc phải nhân mô-men uốn thiết kế ban đầu với hệ số khuếch đại mô-men &eta; &ge; 1.0 để đảm bảo an toàn.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
