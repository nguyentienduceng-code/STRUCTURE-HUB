import { useState } from 'react';
import CollapsibleSection from '../components/CollapsibleSection';
import { 
  Building2, 
  Layers, 
  Settings, 
  ShieldAlert, 
  Calculator,
  Activity,
  Cpu
} from 'lucide-react';

export default function ParametersDefinitions() {
  const [activeTab, setActiveTab] = useState('concrete');

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
          padding: 10px 18px;
          background: var(--overlay-very-light);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
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
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }
        @media (max-width: 768px) {
          .tab-nav {
            flex-wrap: nowrap;
          }
          .tab-btn {
            padding: 8px 14px;
            font-size: 0.95rem;
            gap: 4px;
          }
        }
        .material-section {
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
          font-size: 0.95rem;
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
          background: rgba(102, 126, 234, 0.1);
          color: var(--accent-primary);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.95rem;
          font-weight: 600;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }
        .bullet-blue {
          color: var(--accent-primary);
          font-weight: bold;
          margin-right: 6px;
        }
      `}</style>

      <h1 className="page-title">2. Định nghĩa Thông số & Đối chiếu Tiêu chuẩn</h1>

      <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)', border: '1px solid rgba(102,126,234,0.3)', boxShadow: '0 0 30px rgba(102,126,234,0.15)' }}>
        <h2 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calculator size={24} color="var(--accent-primary)" />
          <span className="gradient-text">Bảng tra cứu Hòa giải Tiêu chuẩn Việt Nam (TCVN) và Hoa Kỳ (ACI/ASTM/AISC/AWS)</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Hòa giải sự khác biệt kỹ thuật về triết lý tính toán, phương pháp thử nghiệm cơ lý vật liệu, và thiết lập công thức quy đổi thực hành đối với Bê tông, Cốt thép, Thép hình, Bu lông, Hàn, và Địa kỹ thuật Nền móng.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'concrete' ? 'active' : ''}`} onClick={() => setActiveTab('concrete')}>
          <Building2 size={18} />
          2.1. Bê tông (TCVN vs ACI)
        </button>
        <button className={`tab-btn ${activeTab === 'steel' ? 'active' : ''}`} onClick={() => setActiveTab('steel')}>
          <Activity size={18} />
          2.2. Cốt thép & Thép hình
        </button>
        <button className={`tab-btn ${activeTab === 'bolts_welding' ? 'active' : ''}`} onClick={() => setActiveTab('bolts_welding')}>
          <Settings size={18} />
          2.3. Bu lông & Hàn kết cấu
        </button>
        <button className={`tab-btn ${activeTab === 'geotechnical' ? 'active' : ''}`} onClick={() => setActiveTab('geotechnical')}>
          <Layers size={18} />
          2.4. Đất nền & Móng cọc
        </button>
      </div>

      {/* TAB 1: BÊ TÔNG */}
      {activeTab === 'concrete' && (
        <div className="material-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="Phương pháp luận Xác định Cường độ Bê tông">
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Cách tiếp cận TCVN (Mẫu Lập phương):</h4>
                <p>Cường độ dựa trên việc nén mẫu lập phương <strong>150x150x150 mm</strong> dưỡng hộ 28 ngày (TCVN 3118:1993):</p>
                <ul>
                  <li><strong>Mác Bê tông (M):</strong> Cường độ nén trung bình của các mẫu thử, tính bằng kgf/cm² (Vd: M250).</li>
                  <li><strong>Cấp độ bền (B):</strong> Cường độ chịu nén đặc trưng tính bằng MPa với xác suất đảm bảo không dưới 95% (Vd: B20 tương ứng M250).</li>
                </ul>
                <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>Cách tiếp cận ACI (Mẫu Trụ):</h4>
                <ul>
                  <li><strong>Cường độ quy định (f'<sub>c</sub>):</strong> Cường độ chịu nén đặc trưng do kỹ sư chỉ định, kiểm tra bằng cách nén mẫu hình trụ <strong>150x300 mm</strong> (ASTM C39).</li>
                  <li><strong>Nghiệm thu thống kê:</strong> ACI 318 không yêu cầu mọi mẫu nén đều vượt f'<sub>c</sub>. Việc nghiệm thu đánh giá theo xác suất thống kê (trung bình 3 mẫu liên tiếp &ge; f'<sub>c</sub>, không mẫu nào dưới quá 500 psi hoặc 10%).</li>
                </ul>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Cơ sở Vật lý của Hiệu ứng Hình dạng Mẫu nén">
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <p>
                  Sự khác biệt lớn nhất giữa hai loại mẫu thử nằm ở hiệu ứng kiềm chế ma sát giữa bàn nén của máy và bề mặt mẫu:
                </p>
                <ul>
                  <li>
                    <strong>Mẫu lập phương (150mm):</strong> Do chiều cao bé, lực ma sát thớt nén kiềm chế sự nở hông trên toàn bộ chiều cao mẫu. Điều này vô tình tạo ra <strong>trạng thái ứng suất 3 trục (triaxial stress state)</strong> nhân tạo, làm tăng giả tạo khả năng chịu lực nén của mẫu.
                  </li>
                  <li>
                    <strong>Mẫu trụ (150x300mm):</strong> Với tỷ lệ chiều cao / đường kính là 2:1, vùng giữa mẫu nằm ngoài tầm ảnh hưởng của ma sát bàn nén. Mẫu trượt tự do ngang và phá hoại dưới <strong>trạng thái nén đơn trục (uniaxial stress)</strong> thực tế. Do đó, cường độ nén mẫu trụ phản ánh chính xác nhất cường độ bê tông thực tế trong kết cấu dầm, cột.
                  </li>
                </ul>
                <div className="formula-card">
                  <div className="formula-line">Hòa giải công thức quy đổi mẫu (TCVN 3118:2022):</div>
                  <var>f&thinsp;'</var><sub><var>c</var></sub> &asymp; 0.83 &times; <var>B</var> (hoặc <var>f</var><sub><var>cube</var></sub> / <var>f</var><sub><var>cyl</var></sub> = 1.20)
                </div>
              </div>
            </CollapsibleSection>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Bảng Quy đổi Tương đương Cấp Cường độ Bê tông (TCVN sang ACI)</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Bảng quy đổi dựa trên việc chuyển đổi đặc tính vật lý nguyên bản (Material Property Conversion) để tìm cấp cường độ <var>f&thinsp;'</var><sub><var>c</var></sub> tương đương của ACI từ mác bê tông TCVN.
            </p>

            <div className="spec-table-container">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Cấp độ bền TCVN (B)</th>
                    <th>Cường độ Đặc trưng (MPa)</th>
                    <th>Mác Bê tông TCVN tương đương (M)</th>
                    <th>Cường độ Trụ tương đương ACI (f'<sub>c</sub>) MPa</th>
                    <th>Cấp Cường độ Trụ quy đổi (psi)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>B15</strong></td>
                    <td>19.3</td>
                    <td>M200</td>
                    <td className="highlight-text">16.0</td>
                    <td>~ 2300 psi</td>
                  </tr>
                  <tr>
                    <td><strong>B20</strong></td>
                    <td>25.7</td>
                    <td>M250</td>
                    <td className="highlight-text">21.3</td>
                    <td>~ 3000 psi (ASTM 3000)</td>
                  </tr>
                  <tr>
                    <td><strong>B22.5</strong></td>
                    <td>28.9</td>
                    <td>M300</td>
                    <td className="highlight-text">24.0</td>
                    <td>~ 3500 psi</td>
                  </tr>
                  <tr>
                    <td><strong>B25</strong></td>
                    <td>32.1</td>
                    <td>M350</td>
                    <td className="highlight-text">26.6</td>
                    <td>~ 4000 psi (ASTM 4000)</td>
                  </tr>
                  <tr>
                    <td><strong>B30</strong></td>
                    <td>38.5</td>
                    <td>M400</td>
                    <td className="highlight-text">32.0</td>
                    <td>~ 4600 psi</td>
                  </tr>
                  <tr>
                    <td><strong>B35</strong></td>
                    <td>45.0</td>
                    <td>M450</td>
                    <td className="highlight-text">37.4</td>
                    <td>~ 5400 psi</td>
                  </tr>
                  <tr>
                    <td><strong>B40</strong></td>
                    <td>51.4</td>
                    <td>M500</td>
                    <td className="highlight-text">42.7</td>
                    <td>~ 6200 psi (ASTM 6000)</td>
                  </tr>
                  <tr>
                    <td><strong>B45</strong></td>
                    <td>57.8</td>
                    <td>M600</td>
                    <td className="highlight-text">48.0</td>
                    <td>~ 7000 psi</td>
                  </tr>
                  <tr>
                    <td><strong>B50</strong></td>
                    <td>64.2</td>
                    <td>M700</td>
                    <td className="highlight-text">53.3</td>
                    <td>~ 7700 psi</td>
                  </tr>
                  <tr>
                    <td><strong>B60</strong></td>
                    <td>77.1</td>
                    <td>M800</td>
                    <td className="highlight-text">64.0</td>
                    <td>~ 9300 psi</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="app-box">
              <div className="app-box-title">
                <Cpu size={16} />
                LƯU Ý KHI THIẾT KẾ & NGHIỆM THU ĐA TIÊU CHUẨN:
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Không sử dụng các công thức quy đổi trực tiếp tham số thiết kế chứa hệ số an toàn (vd: R<sub>b</sub> so với f'<sub>c</sub>) cho các tính toán chi tiết. Quy trình hòa giải đúng chuẩn là: Quy đổi cường độ mẫu nén thực tế (B sang f'<sub>c</sub>) bằng hệ số 0.83, sau đó tiến hành toàn bộ thiết kế cấu kiện bằng đúng hệ thống công thức và hệ số sức kháng &phi; quy định trong tiêu chuẩn thiết kế chủ đạo (vd: ACI 318-19).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CỐT THÉP & THÉP HÌNH */}
      {activeTab === 'steel' && (
        <div className="material-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="Triết lý Thiết kế Thép: TCVN 5575 vs AISC 360">
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>TCVN 5575:2012 (Gốc SNIP Nga):</h4>
                <p>
                  Đặt nặng yêu cầu khống chế độ cứng và chống biến dạng. Rất bảo thủ về ổn định cục bộ. Ví dụ, bản bụng dầm thép chữ I chỉ được phép có độ mảnh (chiều cao / chiều dày bụng h/t) tối đa là <strong>100</strong> trước khi bắt buộc phải hàn thêm sườn gia cường để ngăn ngừa hiện tượng oằn bụng.
                </p>
                <h4 style={{ color: 'var(--text-primary)', marginTop: '12px', marginBottom: '6px' }}>AISC 360 (Mỹ LRFD/ASD):</h4>
                <p>
                  Hướng tới việc tối ưu hóa khối lượng vật liệu. AISC chấp nhận hiện tượng oằn cục bộ của bản cánh, bản bụng dầm thép dưới tải trọng giới hạn. Phân loại cấu kiện thành 3 cấp (Compact, Non-compact, Slender) và áp dụng hệ số giảm sức chịu tải tương ứng. Tỷ số h/t bản bụng dầm theo AISC có thể lên tới <strong>320</strong> mà không cần bố trí sườn gia cường dọc bụng.
                </p>
                <p><em>Hệ quả:</em> Cùng một điều kiện tải trọng, giàn thép thiết kế theo tiêu chuẩn Mỹ AISC thường nhẹ hơn và tiết kiệm thép hơn từ 10% - 15% so với thiết kế theo TCVN 5575.
                </p>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="So sánh Danh pháp & Cấp Cường độ Thép">
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Ký hiệu Mác thép:</h4>
                <ul>
                  <li><strong>TCVN 1765-75 (Thép tấm, hình):</strong> Ký hiệu dạng CTxx (Vd: CT38). Số xx biểu thị **Giới hạn bền kéo tối thiểu (f<sub>u</sub>)** tính bằng kgf/mm². Vd: CT38 có f<sub>u</sub> &ge; 380 MPa.</li>
                  <li><strong>TCVN 1651-2:2018 (Thép cốt):</strong> Ký hiệu dạng CBxxx-V (Vd: CB400-V). Con số xxx biểu thị trực tiếp **Giới hạn chảy tối thiểu (f<sub>y</sub>)** tính bằng MPa.</li>
                  <li><strong>ASTM (Thép hình Mỹ):</strong> Ký hiệu theo tên tiêu chuẩn + cấp bền (Vd: A36, A572 Gr 50). Định danh thép dựa trên **Giới hạn chảy tối thiểu (f<sub>y</sub>)** tính bằng ksi (1 ksi &asymp; 6.89 MPa).</li>
                </ul>
                <div className="alert-box" style={{ marginTop: '16px' }}>
                  <div className="alert-box-title">
                    <ShieldAlert size={16} />
                    <span>CẢNH BÁO MUA SẮM VẬT TƯ CHÊNH LỆCH TIÊU CHUẨN</span>
                  </div>
                  <div className="alert-box-content" style={{ fontSize: '0.85rem' }}>
                    Tránh nhầm lẫn CT38 và A36 do các con số tương đồng. CT38 là thép TCVN có giới hạn bền kéo 380 MPa và giới hạn chảy 250 MPa, trong khi ASTM A36 là thép Mỹ có giới hạn chảy 250 MPa (36 ksi) và giới hạn bền kéo 400 MPa. Cặp tương đương thay thế chuẩn xác nhất là ASTM A36 &harr; TCVN CT38.
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Bảng Đối chiếu Đặc tính Cơ học Mác thép Kết cấu</h3>
            <div className="spec-table-container">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Hệ thống tiêu chuẩn</th>
                    <th>Mác thép tiêu biểu</th>
                    <th>Giới hạn Chảy (f<sub>y</sub>) MPa</th>
                    <th>Giới hạn Bền (f<sub>u</sub>) MPa</th>
                    <th>Nhận xét & Tương đương tương ứng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>TCVN 1765-75</strong></td>
                    <td>CT34</td>
                    <td>230</td>
                    <td>340 - 440</td>
                    <td>Thép carbon thấp cường độ thấp</td>
                  </tr>
                  <tr>
                    <td><strong>TCVN 1765-75</strong></td>
                    <td>CT38</td>
                    <td className="highlight-text">250</td>
                    <td>380 - 490</td>
                    <td>Tương đương trực tiếp với mác **ASTM A36**</td>
                  </tr>
                  <tr>
                    <td><strong>TCVN 1765-75</strong></td>
                    <td>CT42</td>
                    <td>270</td>
                    <td>420 - 540</td>
                    <td>Thép carbon trung bình</td>
                  </tr>
                  <tr>
                    <td><strong>TCVN 1765-75</strong></td>
                    <td>CT51</td>
                    <td className="highlight-text">290</td>
                    <td>510 - 640</td>
                    <td>Tương đương với mác **ASTM A572 Gr 42**</td>
                  </tr>
                  <tr>
                    <td><strong>ASTM (Mỹ)</strong></td>
                    <td>A36 (36 ksi)</td>
                    <td className="highlight-text">250</td>
                    <td>400 - 550</td>
                    <td>Thép hình cacbon thông dụng nhất tại Mỹ</td>
                  </tr>
                  <tr>
                    <td><strong>ASTM (Mỹ)</strong></td>
                    <td>A572 Gr 42 (42 ksi)</td>
                    <td className="highlight-text">290</td>
                    <td>415</td>
                    <td>Thép hợp kim thấp cường độ cao</td>
                  </tr>
                  <tr>
                    <td><strong>ASTM (Mỹ)</strong></td>
                    <td>A572 Gr 50 (50 ksi)</td>
                    <td className="highlight-text">345</td>
                    <td>450</td>
                    <td>Cường độ cao, vượt trội các mác thép TCVN thường</td>
                  </tr>
                  <tr>
                    <td><strong>ASTM (Mỹ)</strong></td>
                    <td>A572 Gr 55 (55 ksi)</td>
                    <td>380</td>
                    <td>485</td>
                    <td>Thường dùng cho kết cấu nhịp lớn</td>
                  </tr>
                  <tr>
                    <td><strong>ASTM (Mỹ)</strong></td>
                    <td>A572 Gr 60 (60 ksi)</td>
                    <td>415</td>
                    <td>520</td>
                    <td>Kết cấu chịu tải trọng nặng</td>
                  </tr>
                  <tr>
                    <td><strong>ASTM (Mỹ)</strong></td>
                    <td>A572 Gr 65 (65 ksi)</td>
                    <td>450</td>
                    <td>550</td>
                    <td>Giới hạn cường độ cao nhất nhóm A572</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BU LÔNG & HÀN KẾT CẤU */}
      {activeTab === 'bolts_welding' && (
        <div className="material-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="Bu lông Cường độ cao: Cấp bền ISO vs ASTM">
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Ký hiệu Cấp bền TCVN/ISO (Vd: 8.8, 10.9):</h4>
                <p>Ký hiệu số học thể hiện trực tiếp đặc tính cơ học:</p>
                <ul>
                  <li><strong>Chữ số đầu tiên:</strong> Nhân với 100 cho ra giới hạn bền kéo danh nghĩa f<sub>u</sub> (MPa). Ví dụ, 8.8 có f<sub>u</sub> = 800 MPa; 10.9 có f<sub>u</sub> = 1000 MPa.</li>
                  <li><strong>Chữ số thứ hai:</strong> Nhân với 10 cho ra tỷ lệ (%) giữa giới hạn chảy và giới hạn bền kéo. Ví dụ, 8.8 có f<sub>y</sub> = 800 &times; 80% = 640 MPa; 10.9 có f<sub>y</sub> = 1000 &times; 90% = 900 MPa.</li>
                </ul>
                <h4 style={{ color: 'var(--text-primary)', marginTop: '12px', marginBottom: '8px' }}>Ký hiệu ASTM (Mỹ, ASTM F3125):</h4>
                <p>Đặt tên trực tiếp theo tiêu chuẩn danh định. Mỗi cấp quy định một phạm vi vật liệu và cơ lý tính đặc thù.</p>
                
                <table className="spec-table" style={{ fontSize: '0.85rem', marginTop: '12px' }}>
                  <thead>
                    <tr>
                      <th>Cấp TCVN / ISO</th>
                      <th>Cấp ASTM tương đương</th>
                      <th>Giới hạn Bền (MPa)</th>
                      <th>Giới hạn Chảy (MPa)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>8.8</strong></td>
                      <td><strong>F3125 Gr. A325</strong></td>
                      <td>800 - 830</td>
                      <td>640 - 660</td>
                    </tr>
                    <tr>
                      <td><strong>10.9</strong></td>
                      <td><strong>F3125 Gr. A490</strong></td>
                      <td>1000 - 1040</td>
                      <td>900 - 940</td>
                    </tr>
                    <tr>
                      <td><strong>12.9</strong></td>
                      <td>(Vượt cấp A490)</td>
                      <td>1200 - 1220</td>
                      <td>1080 - 1100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Yêu cầu về Hàn: TCVN so với AWS D1.1">
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Tiêu chuẩn Mỹ AWS D1.1 (Structural Welding Code):</h4>
                <p>
                  Một bộ quy phạm cực kỳ toàn diện điều phối toàn bộ quá trình thiết kế liên kết hàn (rãnh, góc, nút), sát hạch quy trình hàn (WPS), cấp chứng chỉ thợ hàn (WPQ), gia công chế tạo và kiểm tra chất lượng không phá hủy (NDT).
                </p>
                <h4 style={{ color: 'var(--text-primary)', marginTop: '12px', marginBottom: '8px' }}>Khung tiêu chuẩn TCVN:</h4>
                <p>
                  Hệ thống TCVN chia nhỏ thành nhiều văn bản riêng biệt: TCVN 5575 (tính toán kết cấu), TCVN 9366-1 (lắp đặt cơ khí), TCVN 1691 (kiểu kích thước mối hàn), TCVN 3223 (que hàn điện).
                </p>
                <h4 style={{ color: 'var(--text-primary)', marginTop: '12px', marginBottom: '8px' }}>Sự hội tụ thông qua Tiêu chuẩn Quốc tế (ISO):</h4>
                <p>
                  Việt Nam đã dịch và áp dụng trực tiếp tiêu chuẩn quốc tế ISO vào hệ thống QA/QC nhà xưởng:
                </p>
                <ul>
                  <li><strong>TCVN 7506 (ISO 3834):</strong> Yêu cầu chất lượng đối với hàn nóng chảy kim loại. Đảm bảo toàn bộ quy trình chế tạo được kiểm soát đồng bộ.</li>
                  <li><strong>TCVN 6700 (ISO 9606):</strong> Kiểm tra sát hạch và cấp chứng chỉ cho thợ hàn.</li>
                </ul>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      )}

      {/* TAB 4: ĐẤT NỀN & MỐNG CỌC */}
      {activeTab === 'geotechnical' && (
        <div className="material-section">
          <div className="grid-layout">
            <CollapsibleSection defaultOpen={false} title="Sức chịu tải Đất nền & Móng cọc">
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Sức chịu tải cực hạn giới hạn (Q<sub>u</sub>):</strong> Khả năng gánh tải trọng lớn nhất của cọc đơn trước khi bị phá hoại cơ học, tính bằng công thức tổng sức kháng mũi và sức kháng ma sát thành bên:
                  <div className="formula-card">
                    <var>Q</var><sub><var>u</var></sub> = <var>q</var><sub><var>b</var></sub> &times; <var>A</var><sub><var>b</var></sub> + <var>u</var> &times; &sum;(<var>f</var><sub><var>si</var></sub> &times; <var>l</var><sub><var>i</var></sub>)
                  </div>
                  Trong đó: q<sub>b</sub> là cường độ sức kháng mũi cọc; A<sub>b</sub> là diện tích mũi cọc; u là chu vi cọc; f<sub>si</sub> là sức kháng ma sát bên của lớp đất thứ i; l<sub>i</sub> là chiều dài đoạn cọc đi qua lớp đất i.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Sức chịu tải thiết kế cho phép (Q<sub>a</sub>):</strong> Sức chịu tải an toàn dùng để kiểm tra phản lực đầu cọc dưới tải trọng sử dụng (SLS):
                  <div className="formula-card">
                    <var>Q</var><sub><var>a</var></sub> = <var>Q</var><sub><var>u</var></sub> / &gamma;<sub><var>g</var></sub>
                  </div>
                  Với &gamma;<sub>g</sub> là hệ số tin cậy đất nền theo tiêu chuẩn mới TCVN 10304:2025 (vd: &gamma;<sub>g</sub> = 1.20 đối với trường hợp xác định từ thí nghiệm nén tĩnh cọc).
                </li>
              </ul>
            </CollapsibleSection>

            <CollapsibleSection title="Các Thông số Địa kỹ thuật Cốt lõi">
              <ul style={{ paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Dung trọng tự nhiên (&gamma;):</strong> Trọng lượng riêng của đất, quyết định áp lực địa tầng tự nhiên tại đáy móng.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Góc ma sát trong (&phi;):</strong> Đặc trưng cho khả năng chống cắt của đất rời. Quyết định hệ số sức chịu tải N<sub>c</sub>, N<sub>q</sub>, N<sub>&gamma;</sub> trong móng nông.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Lực dính kết (c):</strong> Sức kháng cắt liên kết hóa học của đất dính (đất sét).
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Hệ số Poisson đất (&nu;<sub>s</sub>):</strong> Tỷ số co ngang của đất (sét chặt &nu;<sub>s</sub> &asymp; 0.35, cát khô &nu;<sub>s</sub> &asymp; 0.25).
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Ảnh hưởng của mực nước ngầm:</strong> Sự xuất hiện của mực nước ngầm sẽ đẩy nổi đất làm giảm trọng lượng riêng hữu hiệu (&gamma;' = &gamma;<sub>bão hòa</sub> - &gamma;<sub>nước</sub>) xuống gần 50%, làm giảm trực tiếp áp lực địa tầng hữu hiệu và sức kháng ma sát hông cọc.
                </li>
              </ul>
            </CollapsibleSection>
          </div>
        </div>
      )}
    </div>
  );
}
