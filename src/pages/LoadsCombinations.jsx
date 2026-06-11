import { useState } from 'react';
import Card from '../components/Card';
import { 
  Scale, 
  Wind, 
  Layers, 
  BookOpen, 
  Cpu, 
  Calculator, 
  ShieldAlert, 
  HelpCircle, 
  Activity, 
  CheckCircle,
  TrendingUp,
  BarChart3,
  Zap
} from 'lucide-react';

export default function LoadsCombinations() {
  const [activeTab, setActiveTab] = useState('tcvn_philosophy');

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
        .loads-section {
          animation: fadeIn 0.4s ease-out;
        }
        .formula-card {
          background: rgba(0, 0, 0, 0.35);
          border-left: 4px solid var(--accent-primary);
          padding: 20px;
          border-radius: 6px 12px 12px 6px;
          margin: 20px 0;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
          transition: all 0.3s ease;
        }
        .formula-card:hover {
          background: rgba(0, 0, 0, 0.45);
          border-left-color: #f59e0b;
        }
        .formula-line {
          font-size: clamp(1rem, 2vw, 1.3rem);
          color: var(--text-formula);
          font-weight: 600;
          margin-bottom: 8px;
          text-align: center;
          font-family: 'Cambria Math', 'Times New Roman', Times, serif;
          letter-spacing: 0.5px;
          padding: 6px 0;
          flex-wrap: wrap;
        }
        .formula-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-top: 8px;
          text-align: center;
        }
        var {
          font-family: 'Cambria Math', 'Times New Roman', Times, serif;
          font-style: italic;
          font-weight: 600;
          color: inherit;
        }
        sub, sup {
          font-size: 70%;
          line-height: 0;
          position: relative;
          vertical-align: baseline;
        }
        sub {
          bottom: -0.3em;
        }
        sup {
          top: -0.55em;
        }
        sub sub, sup sup, sub sup, sup sub {
          font-size: 80%;
          vertical-align: bottom;
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
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }
        .bullet-blue {
          color: var(--accent-primary);
          font-weight: bold;
          margin-right: 6px;
        }
        .param-table-container {
          overflow-x: auto;
          margin: 16px 0;
          border: 1px solid var(--border-glass);
          border-radius: 8px;
        }
        .param-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .param-table th {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
          padding: 12px 16px;
          font-weight: 600;
          border-bottom: 1px solid var(--border-glass);
        }
        .param-table td {
          padding: 12px 16px;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-glass);
        }
        .param-table tr:last-child td {
          border-bottom: none;
        }
        .param-table tr:hover td {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.01);
        }
        .alert-yellow {
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }
        .alert-yellow-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f59e0b;
          font-weight: 700;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
      `}</style>

      <h1 className="page-title">3. Tải trọng & Tổ hợp tải trọng (TCVN 2737:2023)</h1>

      <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)', border: '1px solid rgba(102,126,234,0.3)', boxShadow: '0 0 30px rgba(102,126,234,0.15)' }}>
        <h2 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calculator size={24} color="var(--accent-primary)" />
          <span className="gradient-text">Nghiên cứu chuyên sâu về triết lý tải trọng và tổ hợp theo TCVN 2737:2023 & ASCE 7-10</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Hòa giải sự khác biệt kỹ thuật về mô hình tính toán tải trọng, hệ số độ tin cậy tải trọng, các hệ số tổ hợp xác suất, và phương án thiết lập các tổ hợp kiểm tra ULS/SLS tối ưu trên phần mềm giải tích kết cấu.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'tcvn_philosophy' ? 'active' : ''}`} onClick={() => setActiveTab('tcvn_philosophy')}>
          <Scale size={18} />
          1. Triết lý & Tĩnh tải TCVN
        </button>
        <button className={`tab-btn ${activeTab === 'wind_aerodynamics' ? 'active' : ''}`} onClick={() => setActiveTab('wind_aerodynamics')}>
          <Wind size={18} />
          2. Khí động học Tải gió
        </button>
        <button className={`tab-btn ${activeTab === 'tcvn_combinations' ? 'active' : ''}`} onClick={() => setActiveTab('tcvn_combinations')}>
          <Layers size={18} />
          3. Tổ hợp TCVN 2737:2023
        </button>
        <button className={`tab-btn ${activeTab === 'asce_combinations' ? 'active' : ''}`} onClick={() => setActiveTab('asce_combinations')}>
          <BookOpen size={18} />
          4. Tổ hợp ASCE 7-10 (Mỹ)
        </button>
        <button className={`tab-btn ${activeTab === 'fea_modeling' ? 'active' : ''}`} onClick={() => setActiveTab('fea_modeling')}>
          <Cpu size={18} />
          5. Mô hình hóa & Giải tích FEA
        </button>
        <button className={`tab-btn ${activeTab === 'live_load_reduction' ? 'active' : ''}`} onClick={() => setActiveTab('live_load_reduction')}>
          <BarChart3 size={18} />
          6. Hoạt tải & Giảm tải XS
        </button>
        <button className={`tab-btn ${activeTab === 'earthquake_tcvn' ? 'active' : ''}`} onClick={() => setActiveTab('earthquake_tcvn')}>
          <Zap size={18} />
          7. Động đất TCVN 9386
        </button>
      </div>

      {/* Tab 1: Triết lý & Tĩnh tải TCVN */}
      {activeTab === 'tcvn_philosophy' && (
        <div className="loads-section">
          <div className="grid-half">
            <Card title="Phân loại hai Trạng thái giới hạn (Limit States)">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Triết lý cốt lõi của <span className="highlight-text">TCVN 2737:2023</span> được xây dựng dựa trên phương pháp thiết kế bán xác suất (Semi-Probabilistic Design) thông qua hai nhóm trạng thái giới hạn:
              </p>
              <ul style={{ paddingLeft: '16px', margin: '12px 0', fontSize: '0.92rem', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '12px' }}>
                  <span className="highlight-text">Trạng thái giới hạn thứ nhất (Group 1 - ULS - Ultimate Limit State):</span> Liên quan trực tiếp đến khả năng chịu lực, mất ổn định tổng thể, sự phá hoại dẻo/giòn của vật liệu, hoặc mất cân bằng tĩnh học (lật, trượt). Vượt qua trạng thái này sẽ gây mất an toàn sinh mạng.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <span className="highlight-text">Trạng thái giới hạn thứ hai (Group 2 - SLS - Serviceability Limit State):</span> Tập trung vào điều kiện sử dụng bình thường như kiểm soát độ võng (deflection), chuyển vị ngang (drift), gia tốc rung động và nứt nẻ cục bộ để bảo đảm thẩm mỹ và công năng sử dụng.
                </li>
              </ul>
            </Card>

            <Card title="Hệ số độ tin cậy tĩnh tải G (TCVN 2737:2023)">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Thay vì áp dụng một hệ số chung chung, TCVN 2737:2023 quy định chi tiết hệ số độ tin cậy tải trọng (<span className="highlight-text">&gamma;<sub><var>f</var></sub></span>) cho tĩnh tải tùy thuộc vào đặc thù chế tạo và thi công vật liệu:
              </p>
              <div className="param-table-container">
                <table className="param-table">
                  <thead>
                    <tr>
                      <th>Hạng mục kết cấu / Vật liệu</th>
                      <th>Hệ số &gamma;<sub><var>f</var></sub></th>
                      <th>Ghi chú vật lý</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="highlight-text">Kết cấu thép (Kim loại)</td>
                      <td><span className="spec-badge">1.05</span></td>
                      <td>QA/QC nhà máy cao, sai số trọng lượng lý thuyết rất nhỏ.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Bê tông nặng, khối xây, BTCT</td>
                      <td><span className="spec-badge">1.15</span></td>
                      <td>Áp dụng cho khối lượng thể tích &gt; 1600 kg/m&sup3;.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Bê tông nhẹ, cách nhiệt</td>
                      <td><span className="spec-badge">1.20</span></td>
                      <td>Khối lượng thể tích &le; 1600 kg/m&sup3;.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Lớp hoàn thiện chế tạo sẵn</td>
                      <td><span className="spec-badge">1.20</span></td>
                      <td>Các tấm panel, vật liệu dạng cuộn sản xuất công nghiệp.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Lớp vữa, láng nền tại công trường</td>
                      <td><span className="spec-badge">1.30</span></td>
                      <td>Bất định về chiều dày lớn nhất do thi công thủ công.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Đất nguyên thổ</td>
                      <td><span className="spec-badge">1.10</span></td>
                      <td>Kiểm soát tốt trạng thái tự nhiên.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Đất đắp</td>
                      <td><span className="spec-badge">1.15</span></td>
                      <td>Xét đến sai lệch do quy trình đầm nén hiện trường.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={20} color="var(--accent-primary)" />
              <span>Đối chiếu Triết lý Tĩnh tải với Tiêu chuẩn Mỹ (ASCE 7-10)</span>
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Trong hệ quy chiếu <span className="highlight-text">ASCE 7-10 LRFD</span>, tĩnh tải (Dead Load - <var>D</var>) được áp dụng một hệ số thống nhất là <span className="highlight-text">1.2</span> khi cộng dồn bất lợi với các hoạt tải khác, hoặc <span className="highlight-text">1.4</span> khi tĩnh tải kiểm soát hoàn toàn hệ thống.
            </p>
            <div className="alert-yellow">
              <div className="alert-yellow-title">
                <ShieldAlert size={18} />
                <span>Kịch bản kiểm tra ổn định chống lật và bốc mái (Uplift)</span>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
                Khi tĩnh tải đóng vai trò giữ ổn định kết cấu chống lại tải trọng ngang cực hạn (gió, động đất), cả ASCE 7-10 và TCVN đều giảm mạnh tĩnh tải xuống:
                <br />
                - <strong>ASCE 7-10 (LRFD):</strong> Sử dụng hệ số <span className="highlight-text">0.9<var>D</var></span>.
                <br />
                - <strong>TCVN 2737:2023:</strong> Sử dụng hệ số độ tin cậy có lợi <span className="highlight-text">&gamma;<sub><var>f</var></sub> = 0.90</span>.
                <br />
                Mô hình này mô phỏng kịch bản cực đoan nhất: Công trình nhẹ hơn dự kiến thực tế, trong khi chịu lực bốc hoặc lực lật ngang lớn nhất.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Khí động học Tải gió */}
      {activeTab === 'wind_aerodynamics' && (
        <div className="loads-section">
          <div className="grid-half">
            <Card title="Dịch chuyển định chuẩn vận tốc gió">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Bước chuyển mình lịch sử của <span className="highlight-text">TCVN 2737:2023</span> là việc thay thế mô hình vận tốc gió trung bình dài hạn (10 phút hoặc 2 phút) của bản cũ bằng mô hình <span className="highlight-text">gió giật 3 giây (3-second gust)</span> ở cao độ 10m trên bề mặt địa hình chuẩn, với chu kỳ lặp 20 năm.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, marginTop: '12px' }}>
                Sự thay đổi này đồng bộ hóa hoàn toàn cơ sở dữ liệu khí động học với tiêu chuẩn Mỹ <span className="highlight-text">ASCE 7-10 / 7-16</span> và Eurocode.
              </p>
              <div className="app-box">
                <div className="app-box-title">
                  <TrendingUp size={16} />
                  <span>Ánh xạ phân loại địa hình TCVN &leftrightarrow; ASCE</span>
                </div>
                <div className="param-table-container" style={{ margin: '8px 0 0 0' }}>
                  <table className="param-table">
                    <thead>
                      <tr>
                        <th>Đặc trưng bề mặt địa hình</th>
                        <th>Dạng TCVN 2737:2023</th>
                        <th>Tương đương ASCE 7-10</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="highlight-text">Vùng trống trải, bờ biển thoáng, mặt hồ/sông lớn, vật cản &lt; 1.5m</td>
                        <td><span className="spec-badge">Dạng A</span></td>
                        <td><span className="spec-badge" style={{ borderColor: '#10b981', color: '#10b981' }}>Exposure D</span></td>
                      </tr>
                      <tr>
                        <td className="highlight-text">Vùng ngoại ô, làng mạc, vật cản thưa thớt &lt; 10m (Địa hình chuẩn)</td>
                        <td><span className="spec-badge">Dạng B</span></td>
                        <td><span className="spec-badge" style={{ borderColor: '#10b981', color: '#10b981' }}>Exposure C</span></td>
                      </tr>
                      <tr>
                        <td className="highlight-text">Vùng bị che chắn mạnh, trung tâm đô thị lớn, rừng rậm, vật cản &gt; 10m</td>
                        <td><span className="spec-badge">Dạng C</span></td>
                        <td><span className="spec-badge" style={{ borderColor: '#10b981', color: '#10b981' }}>Exposure B</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <Card title="Hệ số độ tin cậy gió cực hạn 2.1 vs SLS 1.0">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Sự khác biệt cốt lõi trong việc quản lý rủi ro bão lũ giữa Việt Nam và Mỹ:
              </p>
              <ul style={{ paddingLeft: '16px', margin: '12px 0', fontSize: '0.92rem', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong>ASCE 7-10 LRFD:</strong> Bản đồ bão cung cấp trực tiếp vận tốc cực hạn (chu kỳ lặp 700 năm cho công trình Risk Cat II). Vì thế hệ số tải trọng gió trong tổ hợp LRFD chỉ là <span className="highlight-text">1.0</span> (Strength-level wind).
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>TCVN 2737:2023 ULS:</strong> Bản đồ phân vùng gió cơ sở Việt Nam (QCVN 02:2022/BXD) cung cấp vận tốc gió chu kỳ lặp 20 năm (Service-level). Để quy đổi phi tuyến tính (theo phân phối cực trị Gumbel) lên mức cực hạn ULS (chu kỳ lặp khoảng 430 - 450 năm), tiêu chuẩn áp dụng hệ số độ tin cậy tải trọng gió <span className="highlight-text">&gamma;<sub><var>f</var></sub> = 2.1</span>.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>TCVN 2737:2023 SLS:</strong> Khi kiểm tra võng dầm, chuyển vị ngang đỉnh cột hoặc thẩm mỹ vách kính, hệ số độ tin cậy được đưa về <span className="highlight-text">&gamma;<sub><var>f</var></sub> = 1.0</span> để tránh lãng phí kinh tế khi bắt cấu kiện phục vụ thẩm mỹ phải chống siêu bão ngàn năm.
                </li>
              </ul>
            </Card>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--accent-primary)" />
              <span>Hiệu ứng giật động lực học (Gust-Effect Factor)</span>
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Cả hai tiêu chuẩn đều thống nhất về mô tả xung lực động của gió lên bề mặt kết cấu thông qua hệ số hiệu ứng giật (<span className="highlight-text"><var>G</var><sub><var>f</var></sub></span> trong TCVN hoặc <span className="highlight-text"><var>G</var></span> trong ASCE):
            </p>
            <ul style={{ paddingLeft: '16px', margin: '12px 0', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              <li>
                Đối với kết cấu được xem là <strong>"Cứng" (Rigid structures)</strong> có chu kỳ dao động riêng thứ nhất <span className="highlight-text"><var>T</var><sub>1</sub> &le; 1.0s</span>: Hằng số an toàn được lấy bằng <span className="highlight-text">0.85</span> cho cả hai tiêu chuẩn.
              </li>
              <li style={{ marginTop: '8px' }}>
                Đối với công trình <strong>"Mềm" (Flexible structures)</strong> có <span className="highlight-text"><var>T</var><sub>1</sub> &gt; 1.0s</span> (như nhà cao tầng, tháp thép): Phải tính toán chi tiết dựa trên các phương trình vi phân mô tả sự cộng hưởng cơ học và mật độ phổ năng lượng gió.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Tổ hợp TCVN 2737:2023 */}
      {activeTab === 'tcvn_combinations' && (
        <div className="loads-section">
          <div className="grid-half">
            <Card title="Phương trình tổ hợp cơ bản (ULS - Trạng thái giới hạn 1)">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Xác suất xảy ra đồng thời của tất cả các hoạt tải cực đại cùng một thời điểm là rất bé. TCVN 2737:2023 định lượng sự không đồng thời này bằng hệ số tổ hợp <span className="highlight-text">&psi;</span>:
              </p>
              <div className="formula-card">
                <div className="formula-line">
                  <var>E</var><sub><var>d</var></sub> = &gamma;<sub><var>f</var>,<var>G</var></sub><var>G</var><sub><var>k</var></sub> + &sum;&thinsp;&psi;<sub><var>L</var>,<var>i</var></sub>(&gamma;<sub><var>f</var>,<var>Q</var><sub><var>L</var></sub></sub><var>Q</var><sub><var>L</var>,<var>i</var>,<var>k</var></sub>) + &sum;&thinsp;&psi;<sub><var>t</var>,<var>j</var></sub>(&gamma;<sub><var>f</var>,<var>Q</var><sub><var>t</var></sub></sub><var>Q</var><sub><var>t</var>,<var>j</var>,<var>k</var></sub>)
                </div>
                <div className="formula-desc">
                  Trong đó: <var>G</var><sub><var>k</var></sub> là tĩnh tải; <var>Q</var><sub><var>L</var>,<var>k</var></sub> và <var>Q</var><sub><var>t</var>,<var>k</var></sub> là hoạt tải dài hạn và ngắn hạn; &gamma;<sub><var>f</var></sub> là các hệ số độ tin cậy tương ứng.
                </div>
              </div>
              
              <div className="app-box" style={{ background: 'rgba(102,126,234,0.05)', borderColor: 'rgba(102,126,234,0.2)' }}>
                <div className="app-box-title" style={{ color: 'var(--accent-primary)' }}>
                  <CheckCircle size={16} />
                  <span>Quy tắc gán hệ số tổ hợp &psi;<sub><var>t</var></sub> (Ngắn hạn)</span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  <li><strong>Hoạt tải ngắn hạn chủ đạo (Thứ 1):</strong> Nhân hệ số <span className="highlight-text">&psi;<sub><var>t</var>,1</sub> = 1.0</span> (Không giảm).</li>
                  <li><strong>Hoạt tải ngắn hạn thứ 2:</strong> Nhân hệ số <span className="highlight-text">&psi;<sub><var>t</var>,2</sub> = 0.9</span>.</li>
                  <li><strong>Các hoạt tải ngắn hạn thứ 3 trở đi:</strong> Nhân hệ số <span className="highlight-text">&psi;<sub><var>t</var>,3...</sub> = 0.7</span>.</li>
                </ul>
              </div>

              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, marginTop: '16px', color: 'var(--text-secondary)' }}>
                * Đối với tải trọng dài hạn: Cấu kiện chủ đạo dùng <span className="highlight-text">&psi;<sub><var>L</var>,1</sub> = 1.0</span>, các thành phần tiếp theo dùng <span className="highlight-text">&psi;<sub><var>L</var>,2...</sub> = 0.95</span>.
              </p>
            </Card>

            <Card title="Phương trình tổ hợp đặc biệt (Accidental Combinations)">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Khi xuất hiện tải trọng đặc biệt <span className="highlight-text"><var>A</var><sub><var>d</var></sub></span> (như động đất, nổ, cháy, hoặc va chạm cầu trục), khả năng xuất hiện đồng thời với các hoạt tải cực đại khác là cực kỳ thấp. Phương trình được thiết lập:
              </p>
              <div className="formula-card" style={{ borderLeftColor: '#f59e0b' }}>
                <div className="formula-line" style={{ color: '#f59e0b' }}>
                  <var>E</var><sub><var>d</var></sub> = &gamma;<sub><var>f</var>,<var>G</var></sub><var>G</var><sub><var>k</var></sub> + <var>A</var><sub><var>d</var></sub> + &sum;&thinsp;&psi;<sub><var>L</var>,<var>i</var></sub>(&gamma;<sub><var>f</var>,<var>Q</var><sub><var>L</var></sub></sub><var>Q</var><sub><var>L</var>,<var>i</var>,<var>k</var></sub>) + &sum;&thinsp;&psi;<sub><var>t</var>,<var>j</var></sub>(&gamma;<sub><var>f</var>,<var>Q</var><sub><var>t</var></sub></sub><var>Q</var><sub><var>t</var>,<var>j</var>,<var>k</var></sub>)
                </div>
                <div className="formula-desc">
                  Tải trọng đặc biệt <var>A</var><sub><var>d</var></sub> được đưa trực tiếp vào tổ hợp mà không giảm hệ số.
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Hệ số tổ hợp ngắn hạn trong kịch bản này bị chiết giảm sâu sắc:
              </p>
              <ul style={{ paddingLeft: '16px', margin: '12px 0', fontSize: '0.92rem', lineHeight: 1.6 }}>
                <li>Tải trọng ngắn hạn chủ đạo: <span className="highlight-text">&psi;<sub><var>t</var>,1</sub> = 0.5</span>.</li>
                <li>Các tải trọng ngắn hạn còn lại: <span className="highlight-text">&psi;<sub><var>t</var>,2</sub> = &psi;<sub><var>t</var>,3</sub> = 0.3</span>.</li>
              </ul>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                Sự cắt giảm này giúp tối ưu hóa chi phí đầu tư, tránh việc thiết kế kết cấu thép quá dư thừa khi tính toán chống chọi đồng thời nhiều thảm họa hiếm gặp.
              </p>
            </Card>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="var(--accent-primary)" />
              <span>Ví dụ thực tiễn: Hoán vị tổ hợp bất lợi cho Cột khung Portal</span>
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Trong quá trình giải tích hệ khung Portal, phần mềm phải tự động quét qua bao nội lực (Envelope) của các phép hoán vị vai trò chủ đạo:
            </p>
            <div className="grid-half" style={{ marginTop: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>Kịch bản 1: Gió (<var>W</var>) làm chủ đạo</h4>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <li>Tĩnh tải: <span className="highlight-text">1.05 &times; <var>G</var><sub><var>k</var></sub></span></li>
                  <li>Tải trọng Gió: <span className="highlight-text">(2.1 &times; 1.0) &times; <var>W</var><sub><var>k</var></sub> = 2.1 <var>W</var><sub><var>k</var></sub></span></li>
                  <li>Hoạt tải mái: <span className="highlight-text">(1.3 &times; 0.9) &times; <var>Q</var><sub><var>m&aacute;i</var>,<var>k</var></sub> = 1.17 <var>Q</var><sub><var>m&aacute;i</var>,<var>k</var></sub></span></li>
                </ul>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>Kịch bản 2: Hoạt tải mái (<var>Q</var><sub><var>t</var></sub>) làm chủ đạo</h4>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <li>Tĩnh tải: <span className="highlight-text">1.05 &times; <var>G</var><sub><var>k</var></sub></span></li>
                  <li>Hoạt tải mái: <span className="highlight-text">(1.3 &times; 1.0) &times; <var>Q</var><sub><var>m&aacute;i</var>,<var>k</var></sub> = 1.3 <var>Q</var><sub><var>m&aacute;i</var>,<var>k</var></sub></span></li>
                  <li>Tải trọng Gió: <span className="highlight-text">(2.1 &times; 0.9) &times; <var>W</var><sub><var>k</var></sub> = 1.89 <var>W</var><sub><var>k</var></sub></span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tổ hợp ASCE 7-10 (Mỹ) */}
      {activeTab === 'asce_combinations' && (
        <div className="loads-section">
          <div className="grid-half">
            <Card title="Phương pháp LRFD (Load & Resistance Factor Design)">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                ASCE 7-10 tích hợp trực tiếp xác suất vào 7 phương trình tổ hợp cố định thay vì dùng hệ số chiết giảm linh hoạt:
              </p>
              <div className="param-table-container">
                <table className="param-table">
                  <thead>
                    <tr>
                      <th>Mã LC</th>
                      <th>Phương trình tổ hợp LRFD</th>
                      <th>Mô tả & Ý nghĩa vật lý</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="highlight-text">LC1</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}>1.4<var>D</var></span></td>
                      <td>Trường hợp tĩnh tải vượt định mức kiểm soát.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">LC2</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}>1.2<var>D</var> + 1.6<var>L</var> + 0.5(<var>L</var><sub><var>r</var></sub> hoặc <var>S</var> hoặc <var>R</var>)</span></td>
                      <td>Hoạt tải sàn (<var>L</var>) là chủ đạo. Tải mái giảm còn 50%.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">LC3</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}>1.2<var>D</var> + 1.6(<var>L</var><sub><var>r</var></sub> hoặc <var>S</var> hoặc <var>R</var>) + (<var>L</var> hoặc 0.5<var>W</var>)</span></td>
                      <td>Đảo ngược LC2, tải trọng mái đóng vai trò cực hạn 1.6.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">LC4</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}>1.2<var>D</var> + 1.0<var>W</var> + <var>L</var> + 0.5(<var>L</var><sub><var>r</var></sub> hoặc <var>S</var> hoặc <var>R</var>)</span></td>
                      <td>Bão lớn cực hạn (1.0<var>W</var>). Hoạt tải sàn giảm còn 1.0.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">LC5</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}>1.2<var>D</var> + 1.0<var>E</var> + <var>L</var> + 0.2<var>S</var></span></td>
                      <td>Tổ hợp động đất (<var>E</var>) tác dụng cực hạn.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">LC6</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}>0.9<var>D</var> + 1.0<var>W</var></span></td>
                      <td>Khống chế gió bốc (Uplift) gây lật móng/nhổ neo chân cột.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">LC7</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}>0.9<var>D</var> + 1.0<var>E</var></span></td>
                      <td>Khống chế lực cắt đáy động đất gây lật.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Phương pháp ASD (Allowable Strength Design)">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Duy trì tải trọng ở mức tiêu chuẩn (Service-level) và kiểm tra ứng suất cấu kiện trước cường độ danh định đã chia cho hệ số an toàn uốn/nén/cắt tổng thể <span className="highlight-text">&Omega;</span>:
              </p>
              <div className="param-table-container">
                <table className="param-table">
                  <thead>
                    <tr>
                      <th>Mã ASD</th>
                      <th>Phương trình tổ hợp ASD</th>
                      <th>Cơ chế giảm quy đổi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="highlight-text">ASD1 / 2</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}><var>D</var>; <var>D</var> + <var>L</var></span></td>
                      <td>Tải tiêu chuẩn cơ bản.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">ASD3 / 4</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}><var>D</var> + <var>H</var>; <var>D</var> + 0.75<var>L</var> + 0.75<var>H</var></span></td>
                      <td><var>H</var> là tải trọng mái (<var>L</var><sub><var>r</var></sub>/<var>S</var>/<var>R</var>). Chiết giảm 25% tổng.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">ASD5</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}><var>D</var> + 0.6<var>W</var></span></td>
                      <td>Gió cực hạn <var>W</var> nhân 0.6 để đưa về gió sử dụng thường ngày.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">ASD6a</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}><var>D</var> + 0.75<var>L</var> + 0.75(0.6<var>W</var>) + 0.75<var>H</var></span></td>
                      <td>Hệ số 0.75 phản ánh xác suất co-occurrence của bão và hoạt tải.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">ASD6b</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}><var>D</var> + 0.75<var>L</var> + 0.75(0.7<var>E</var>) + 0.75<var>S</var></span></td>
                      <td>Quy đổi động đất cực hạn về ASD thông qua hệ số 0.7.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">ASD7</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}>0.6<var>D</var> + 0.6<var>W</var></span></td>
                      <td>Đánh giá ổn định chống lật và bốc mái dưới dạng ASD.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">ASD8</td>
                      <td><span style={{ fontFamily: 'Cambria Math, Times New Roman, serif', fontSize: '1.05rem' }}>0.6<var>D</var> + 0.7<var>E</var></span></td>
                      <td>Đánh giá ổn định chống lật do động đất dạng ASD.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={20} color="var(--accent-primary)" />
              <span>Sự hội tụ thiết kế trong AISC 360-10</span>
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
              Một điểm cực kỳ tiến bộ trong tiêu chuẩn thép Mỹ là việc đồng bộ hóa toán học giữa hai triết lý: 
              Mối quan hệ <var>&phi;</var> &times; <var>&Omega;</var> = 1.5 được áp dụng đồng bộ cho hầu hết các trạng thái giới hạn uốn, cắt, kéo và nén của thép hình. Điều này triệt tiêu chênh lệch tiết diện đầu ra, bất kể kỹ sư chọn giải pháp LRFD hay ASD.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Mô hình hóa & Giải tích FEA */}
      {activeTab === 'fea_modeling' && (
        <div className="loads-section">
          <div className="grid-half">
            <Card title="Phương pháp phân tích trực tiếp (Direct Analysis Method - DAM)">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                AISC 360-10 quy định phương pháp <span className="highlight-text">Direct Analysis Method (DAM)</span> tại Chương C nhằm giải quyết bài toán mất ổn định mà không cần tính toán hệ số chiều dài tính toán <span className="highlight-text"><var>K</var>-factor</span> phức tạp. DAM áp đặt hai điều kiện giải tích trong phần mềm:
              </p>
              <ul style={{ paddingLeft: '16px', margin: '12px 0', fontSize: '0.92rem', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '12px' }}>
                  <span className="highlight-text">Tải trọng giả định (Notional Loads - <var>N</var><sub><var>i</var></sub>):</span> Mô phỏng độ lệch tâm hình học thực tế khi dựng khung thép ngoài công trường (out-of-plumbness). Áp dụng lực ngang tập trung giả lập <span className="highlight-text"><var>N</var><sub><var>i</var></sub> = 0.002 <var>Y</var><sub><var>i</var></sub></span> tại mỗi tầng (với <var>Y</var><sub><var>i</var></sub> là tổng tải trọng trọng trường LRFD tác dụng lên tầng đó).
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <span className="highlight-text">Chiết giảm độ cứng (Stiffness Reduction):</span> Xét đến ảnh hưởng của ứng suất dư (residual stresses) do quá trình cán nóng hoặc hàn nhiệt. Độ cứng ngang đóng góp của cấu kiện bị giảm: <span className="highlight-text"><var>EA</var><sub><var>calc</var></sub> = 0.8<var>EA</var></span> và <span className="highlight-text"><var>EI</var><sub><var>calc</var></sub> = 0.8 &tau;<sub><var>b</var></sub><var>EI</var></span>.
                </li>
              </ul>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                Hệ số uốn phi tuyến &tau;<sub><var>b</var></sub> sẽ tiếp tục suy giảm khi lực nén dọc trục trong thanh thép vượt quá mức giới hạn chảy dẻo quy định.
              </p>
            </Card>

            <Card title="Kỹ thuật lập tổ hợp tùy chỉnh (Custom Combination Method)">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Khi gán tải trọng Việt Nam (TCVN 2737:2023) vào mô hình tính toán thép theo AISC 360, kỹ sư dễ gặp lỗi <span className="highlight-text">nhân đôi hệ số an toàn</span> nếu sử dụng trình sinh tổ hợp tự động của phần mềm Mỹ (ETABS / SAP2000).
              </p>
              <div className="app-box" style={{ marginTop: '12px' }}>
                <div className="app-box-title">
                  <CheckCircle size={16} />
                  <span>Quy trình thiết lập thực hành tối ưu</span>
                </div>
                <ol style={{ paddingLeft: '16px', margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: '8px' }}>Khai báo toàn bộ tải trọng (Dead, Live, Wind) vào phần mềm dưới dạng lực Tiêu chuẩn (Nominal Loads) chưa nhân bất kỳ hệ số &gamma;<sub><var>f</var></sub> nào của TCVN.</li>
                  <li style={{ marginBottom: '8px' }}>Tắt tính năng tự động tạo tổ hợp tải trọng của phần mềm.</li>
                  <li style={{ marginBottom: '8px' }}>Tự định nghĩa các tổ hợp tùy chỉnh theo công thức TCVN. Ví dụ, tổ hợp ULS với gió chủ đạo:
                    <div style={{ fontFamily: 'monospace', padding: '6px 12px', background: 'rgba(0,0,0,0.3)', margin: '8px 0', borderRadius: '4px', color: '#f8fafc' }}>
                      COMB_ULS_WindMax = 1.05 &times; Dead + 2.1 &times; Wind + 1.08 &times; Live
                    </div>
                    (Với 1.08 = 1.2 &gamma;<sub><var>f</var></sub> hoạt tải &times; 0.9 &psi;<sub><var>t</var>,2</sub>)
                  </li>
                  <li>Chạy bộ kiểm tra thép AISC 360-10 LRFD Design, phần mềm sẽ đối chiếu nội lực ULS tùy chỉnh này trực tiếp với cường độ kháng tiết diện &phi;<var>R</var><sub><var>n</var></sub>.</li>
                </ol>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 6: Hoạt tải & Giảm tải Xác suất */}
      {activeTab === 'live_load_reduction' && (
        <div className="loads-section">
          <div className="grid-half">
            <Card title="Giá trị tiêu chuẩn hoạt tải sử dụng (Bảng 4 – TCVN 2737:2023)">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Hoạt tải được phân nhóm theo <span className="highlight-text">mục đích công năng</span> của không gian sử dụng. Các khu vực có lưu thông người liên tục hoặc là nút sơ tán khi sự cố phải chịu tải trọng thiết kế cao hơn nhằm đảm bảo an toàn sinh mạng:
              </p>
              <div className="param-table-container">
                <table className="param-table">
                  <thead>
                    <tr>
                      <th>Khu vực / Công năng</th>
                      <th>p<sub>n</sub> (kN/m²)</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="highlight-text">Nhà ở, buồng ngủ, bếp</td>
                      <td><span className="spec-badge">1.5</span></td>
                      <td>Khu vực A – hoạt động dân sinh thông thường.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Văn phòng, hành lang phụ</td>
                      <td><span className="spec-badge">2.0</span></td>
                      <td>Khu vực B – làm việc ngồi cố định, lưu thông nhẹ.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Sảnh, hành lang chính, lối thoát</td>
                      <td><span className="spec-badge">3.0 – 4.0</span></td>
                      <td>Khu vực C – lưu thông liên tục, đông người.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Phòng hội thảo, triển lãm, rạp chiếu</td>
                      <td><span className="spec-badge">4.0 – 5.0</span></td>
                      <td>Khu vực D – tập trung đông người ngắn hạn.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Mái bằng không sử dụng</td>
                      <td><span className="spec-badge">0.75</span></td>
                      <td>Chỉ phục vụ bảo trì, không chịu tải trọng người thường xuyên.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Mái bằng có sử dụng (sân thượng)</td>
                      <td><span className="spec-badge">1.5</span></td>
                      <td>Tương đương hoạt tải nhà ở.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Bãi đỗ xe ô tô (hạng nhẹ)</td>
                      <td><span className="spec-badge">2.5</span></td>
                      <td>Khu vực F – xe con, xe tải nhẹ ≤ 30 kN.</td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Bãi đỗ xe tải nặng</td>
                      <td><span className="spec-badge">5.0</span></td>
                      <td>Khu vực G – chịu tải bánh xe trục lớn.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Hệ số độ tin cậy tĩnh tải γ_f theo loại vật liệu">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Tĩnh tải được tính toán theo công thức <span className="highlight-text">G<sub>d</sub> = γ<sub><var>f</var></sub> × V × γ<sub><var>vl</var></sub></span>, trong đó <var>V</var> là thể tích hình học và γ<sub><var>vl</var></sub> là trọng lượng riêng vật liệu. Hệ số độ tin cậy phụ thuộc vào mức độ kiểm soát chất lượng sản xuất:
              </p>
              <div className="formula-card">
                <div className="formula-line">
                  G<sub><var>d</var></sub> = γ<sub><var>f</var></sub> × <var>V</var> × γ<sub><var>vl</var></sub>
                </div>
                <div className="formula-desc">
                  γ<sub><var>f</var></sub> = 1.05 (thép) | 1.15 (BTCT) | 1.20 (BT nhẹ) | 1.30 (vữa thi công)
                </div>
              </div>
              <div className="app-box">
                <div className="app-box-title">
                  <CheckCircle size={16} />
                  <span>Lưu ý thực hành trên ETABS / SAP2000</span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  <li>Trọng lượng bản thân kết cấu thường được phần mềm tự động tính và nhân hệ số 1.05 (thép) hoặc 1.15 (BTCT) khi thiết lập tổ hợp.</li>
                  <li>Tĩnh tải hoàn thiện (SDL – Superimposed Dead Load) như gạch lát, trần thạch cao, thiết bị cơ điện cần khai báo riêng và gán γ<sub><var>f</var></sub> = 1.20–1.30 tùy vật liệu.</li>
                  <li>Khi tĩnh tải đóng vai trò <strong>có lợi</strong> (chống lật, chống bốc mái): dùng γ<sub><var>f</var></sub> = <strong>0.90</strong>.</li>
                </ul>
              </div>
            </Card>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="var(--accent-primary)" />
              <span>Thuật toán Giảm Hoạt tải theo Xác suất (TCVN 2737:2023)</span>
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Đây là <span className="highlight-text">bước tiến cách mạng</span> của TCVN 2737:2023 so với phiên bản cũ: việc minh định cơ sở toán học xác suất cho phép giảm hoạt tải một cách có kiểm soát, tránh thiết kế quá dư thừa khi tổng hợp tải từ nhiều diện tích sàn hoặc nhiều tầng.
            </p>
            <div className="grid-half" style={{ marginTop: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>Giảm tải theo Diện tích truyền tải (ψ<sub>A</sub>)</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Khi dầm chịu tải từ diện tích mặt sàn lớn A<sub>t</sub>, xác suất đồng thời đạt cực đại trên toàn bộ diện tích giảm dần theo:
                </p>
                <div className="formula-card" style={{ margin: '8px 0' }}>
                  <div className="formula-line" style={{ fontSize: '1rem' }}>
                    ψ<sub>A</sub> = 0.4 + 1/√(<var>A</var><sub>t</sub>)
                  </div>
                  <div className="formula-desc">Khu vực A, B (nhà ở, văn phòng): kích hoạt khi A<sub>t</sub> &gt; A<sub>0</sub></div>
                </div>
                <div className="formula-card" style={{ margin: '8px 0' }}>
                  <div className="formula-line" style={{ fontSize: '1rem' }}>
                    ψ<sub>A</sub> = 0.5 + 1/√(<var>A</var><sub>t</sub>)
                  </div>
                  <div className="formula-desc">Khu vực C, D (hội trường, lớp học): ngưỡng kích hoạt cao hơn do rủi ro tập trung người cao.</div>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>Giảm tải theo Số tầng (ψ<sub>n</sub>)</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Cột và móng chịu tải từ nhiều tầng — xác suất toàn bộ các tầng cùng đạt cực đại hoạt tải đồng thời giảm theo số tầng chịu tải:
                </p>
                <div className="formula-card" style={{ margin: '8px 0' }}>
                  <div className="formula-line" style={{ fontSize: '1rem' }}>
                    ψ<sub><var>n</var></sub> = (0.4 + 4/√<var>n</var>)
                  </div>
                  <div className="formula-desc">Khu vực A, B: giảm dần khi số tầng n tăng. Tối thiểu ψ<sub>n</sub> ≥ 0.6.</div>
                </div>
                <div className="formula-card" style={{ margin: '8px 0' }}>
                  <div className="formula-line" style={{ fontSize: '1rem' }}>
                    ψ<sub><var>n</var></sub> = (0.5 + 5/√<var>n</var>)
                  </div>
                  <div className="formula-desc">Khu vực C, D: hệ số giảm thấp hơn do tính nguy hiểm cao hơn.</div>
                </div>
                <div className="app-box" style={{ marginTop: '12px' }}>
                  <div className="app-box-title">
                    <CheckCircle size={16} />
                    <span>Ứng dụng thực tế</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.6, margin: 0, color: 'var(--text-secondary)' }}>
                    Trong ETABS, khai báo hệ số giảm tải tại mục <strong>Live Load Reduction</strong> theo AT và số tầng. Đây là lý do tại sao tiết diện cột tầng hầm trong các tòa tháp thực tế thường nhỏ hơn nhiều so với tính toán cộng dồn tĩnh học thuần túy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Động đất TCVN 9386:2012 */}
      {activeTab === 'earthquake_tcvn' && (
        <div className="loads-section">
          <div className="grid-half">
            <Card title="Phổ Phản ứng Thiết kế S_d(T) & Gia tốc Nền">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Theo <span className="highlight-text">TCVN 9386:2012</span>, tải trọng động đất không phụ thuộc vào lực đẩy ngoài mà phụ thuộc vào <span className="highlight-text">biên độ gia tốc dao động nền đất (PGA)</span>. Gia tốc nền thiết kế được hiệu chỉnh từ gia tốc tham chiếu:
              </p>
              <div className="formula-card">
                <div className="formula-line">
                  <var>a</var><sub><var>g</var></sub> = γ<sub><var>I</var></sub> × <var>a</var><sub><var>gR</var></sub>
                </div>
                <div className="formula-desc">
                  γ<sub><var>I</var></sub>: Hệ số tầm quan trọng công trình | <var>a</var><sub><var>gR</var></sub>: Đỉnh PGA tham chiếu theo vùng địa chấn
                </div>
              </div>
              <div className="param-table-container">
                <table className="param-table">
                  <thead>
                    <tr>
                      <th>Vùng địa chấn – Khu vực điển hình</th>
                      <th>a<sub>gR</sub> (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="highlight-text">Vùng I – TP.HCM, Cần Thơ, đồng bằng Nam Bộ</td>
                      <td><span className="spec-badge">0.054 – 0.082</span></td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Vùng II – Hà Nội, Đà Nẵng, Nha Trang</td>
                      <td><span className="spec-badge">0.083 – 0.15</span></td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Vùng III – Tây Bắc, Điện Biên, Lai Châu</td>
                      <td><span className="spec-badge">0.15 – 0.25</span></td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Vùng IV – Một số vùng núi Tây Bắc</td>
                      <td><span className="spec-badge">&gt; 0.25</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="alert-yellow" style={{ marginTop: '12px' }}>
                <div className="alert-yellow-title">
                  <ShieldAlert size={18} />
                  <span>Hệ số tầm quan trọng γ<sub>I</sub></span>
                </div>
                <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  <li>Công trình thông thường (nhà ở, văn phòng): <span className="highlight-text">γ<sub>I</sub> = 1.0</span></li>
                  <li>Công trình quan trọng (trường học, trung tâm thương mại lớn): <span className="highlight-text">γ<sub>I</sub> = 1.2</span></li>
                  <li>Công trình thiết yếu (bệnh viện, trạm điện, trạm cứu hỏa): <span className="highlight-text">γ<sub>I</sub> = 1.4</span></li>
                </ul>
              </div>
            </Card>

            <Card title="Hệ số ứng xử q & Triết lý Tiêu tán Năng lượng">
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                Điểm tinh túy nhất của kháng chấn theo TCVN 9386:2012 là <span className="highlight-text">hệ số ứng xử q</span> — cho phép kết cấu thiết kế với nội lực thấp hơn mức đàn hồi thuần túy, đổi lại bằng khả năng biến dạng dẻo có kiểm soát:
              </p>
              <div className="formula-card" style={{ borderLeftColor: '#f59e0b' }}>
                <div className="formula-line">
                  <var>F</var><sub>thiết kế</sub> = <var>F</var><sub>đàn hồi</sub> / <var>q</var>
                </div>
                <div className="formula-desc">
                  Cấu kiện được thiết kế với lực nhỏ hơn q lần — năng lượng động đất dư được tiêu tán qua biến dạng dẻo tại các khớp dẻo (plastic hinges)
                </div>
              </div>
              <div className="param-table-container">
                <table className="param-table">
                  <thead>
                    <tr>
                      <th>Hệ kết cấu</th>
                      <th>Cấp dẻo</th>
                      <th>q</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="highlight-text">Khung BTCT moment thuần</td>
                      <td>DCH (Dẻo cao)</td>
                      <td><span className="spec-badge">4.5 α<sub>u</sub>/α<sub>1</sub></span></td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Khung BTCT moment thuần</td>
                      <td>DCM (Dẻo trung bình)</td>
                      <td><span className="spec-badge">3.0 α<sub>u</sub>/α<sub>1</sub></span></td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Vách cứng BTCT</td>
                      <td>DCM</td>
                      <td><span className="spec-badge">3.0</span></td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Khung thép moment</td>
                      <td>DCH</td>
                      <td><span className="spec-badge">6.5</span></td>
                    </tr>
                    <tr>
                      <td className="highlight-text">Kết cấu không dẻo (Low Ductility)</td>
                      <td>DCL</td>
                      <td><span className="spec-badge">1.5</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginTop: '12px', color: 'var(--text-secondary)' }}>
                ⚠️ Chọn q cao đòi hỏi thiết kế cấu tạo chi tiết nghiêm ngặt: đai dày, neo cốt thép đặc biệt, tỷ lệ cốt thép tối thiểu theo DCM/DCH.
              </p>
            </Card>
          </div>

          <div className="card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--accent-primary)" />
              <span>Hai Phương pháp Xác định Tải trọng Động đất</span>
            </h3>
            <div className="grid-half">
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>Phương pháp 1: Tĩnh lực ngang Tương đương (ELF)</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Áp dụng cho công trình quy mô thấp, mặt bằng đều đặn, không có giật cấp hình học. Lực cắt đáy tổng:
                </p>
                <div className="formula-card" style={{ margin: '8px 0' }}>
                  <div className="formula-line">
                    <var>F</var><sub><var>b</var></sub> = S<sub><var>d</var></sub>(<var>T</var><sub>1</sub>) × <var>m</var> × λ
                  </div>
                  <div className="formula-desc">
                    S<sub>d</sub>(T<sub>1</sub>): Tung độ phổ thiết kế | m: Tổng khối lượng hữu dụng | λ = 0.85 (nếu T<sub>1</sub> ≤ 2T<sub>C</sub> và n ≥ 2)
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  Lực cắt đáy F<sub>b</sub> sau đó được phân bổ tuyến tính lên từng tầng tỷ lệ thuận với tích khối lượng × cao trình tầng.
                </p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>Phương pháp 2: Phân tích Phổ Phản ứng (RSA)</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Bắt buộc cho nhà cao tầng, hệ bất đối xứng, kết cấu có giật cấp hình học. Phân tích tổng hợp theo các quy tắc kết hợp bình phương:
                </p>
                <div className="formula-card" style={{ margin: '8px 0' }}>
                  <div className="formula-line">
                    E<sub>total</sub> = √(∑ E<sub>i</sub>²)
                  </div>
                  <div className="formula-desc">SRSS: Căn bậc hai tổng bình phương — khi các mode dao động đủ xa nhau về tần số</div>
                </div>
                <div className="formula-card" style={{ margin: '8px 0' }}>
                  <div className="formula-line" style={{ fontSize: '0.95rem' }}>
                    E<sub>CQC</sub> = √(∑∑ ρ<sub>ij</sub> E<sub>i</sub> E<sub>j</sub>)
                  </div>
                  <div className="formula-desc">CQC: Complete Quadratic Combination — chính xác hơn khi các mode gần nhau về tần số</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--accent-primary)" />
                Tổ hợp Đặc biệt Kháng chấn (Seismic Combinations)
              </h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                Theo TCVN 9386:2012, tổ hợp tải trọng động đất được thiết lập như tổ hợp đặc biệt trong TCVN 2737:2023. Tác động động đất E<sub>d</sub> được xét theo cả hai phương ngang với nguyên tắc:
              </p>
              <div className="formula-card" style={{ borderLeftColor: '#ef4444' }}>
                <div className="formula-line" style={{ color: '#ef4444' }}>
                  G<sub>k</sub> + ψ<sub>2,i</sub> × Q<sub>k,i</sub> ± A<sub>Ed,x</sub> ± 0.3 × A<sub>Ed,y</sub>
                </div>
                <div className="formula-desc">
                  ψ<sub>2,i</sub>: Hệ số tải trọng tựa thường xuyên — hoạt tải chỉ tính phần dài hạn khi có động đất<br />
                  Ví dụ: ψ<sub>2</sub> = 0.3 (văn phòng) | 0.6 (kho lưu trữ nặng) | 0 (mái không sử dụng)
                </div>
              </div>
              <div className="app-box" style={{ marginTop: '16px' }}>
                <div className="app-box-title">
                  <CheckCircle size={16} />
                  <span>Quy trình phân tích kháng chấn trên ETABS</span>
                </div>
                <ol style={{ paddingLeft: '16px', margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: '8px' }}>Khai báo phổ phản ứng thiết kế S<sub>d</sub>(T) theo vùng địa chấn và loại đất nền (Loại A, B, C, D, E theo TCVN 9386).</li>
                  <li style={{ marginBottom: '8px' }}>Chọn phương pháp phân tích: ELF cho nhà thấp tầng đều đặn, RSA (Modal Spectral Analysis) cho nhà cao tầng.</li>
                  <li style={{ marginBottom: '8px' }}>Nhập hệ số ứng xử q tương ứng với hệ kết cấu và cấp dẻo. ETABS tự động chia phổ cho q.</li>
                  <li style={{ marginBottom: '8px' }}>Tổ hợp 2 phương địa chấn theo quy tắc 100%+30%: xét Ex ± 0.3Ey và 0.3Ex ± Ey.</li>
                  <li>Kiểm tra điều kiện cấu tạo kháng chấn: đai cột vùng tới hạn, tỷ lệ cốt thép dọc tối thiểu/tối đa theo Phụ lục TCVN 9386.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
