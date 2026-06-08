import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Skeleton from '../components/Skeleton';
import ProgressBar from '../components/ProgressBar';
import { 
  BookOpen, 
  ShieldAlert, 
  Layers, 
  Crosshair, 
  Sliders, 
  Calculator, 
  Activity, 
  Hammer, 
  Shuffle
} from 'lucide-react';

export default function SteelComponents() {
  const [activeTab, setActiveTab] = useState('tcvn');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading data when tab changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderSkeletons = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' }}>
      <ProgressBar isLoading={true} />
      <div className="sub-grid">
        <Skeleton height="300px" borderRadius="12px" />
        <Skeleton height="300px" borderRadius="12px" />
      </div>
      <Skeleton height="400px" borderRadius="12px" />
    </div>
  );

  return (
    <div>
      <style>{`
        .tab-nav {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
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
          gap: 8px;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all var(--transition);
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
        .steel-section {
          animation: fadeIn 0.4s ease-out;
        }
        .sub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .bullet-list {
          padding-left: 20px;
          margin: 0;
        }
        .bullet-list li {
          margin-bottom: 12px;
          line-height: 1.6;
        }
        @media (max-width: 900px) {
          .sub-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .tab-btn {
            padding: 7px 12px;
            font-size: 0.8rem;
            gap: 5px;
          }
        }
      `}</style>

      <h1 className="page-title">Cấu kiện Thép</h1>

      <div className="card" style={{ marginBottom: '32px', background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)', border: '1px solid rgba(102,126,234,0.3)', boxShadow: '0 0 30px rgba(102,126,234,0.15)' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={24} color="var(--accent-primary)" />
          <span className="gradient-text">Nguyên lý Thiết kế & Sức kháng Cấu kiện Thép</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Kết cấu thép chịu nén và uốn cực tốt nhưng nhạy cảm với hiện tượng mất ổn định tổng thể và cục bộ do tính thanh mảnh cao. Việc tính toán đòi hỏi kiểm soát ứng suất dẻo sau mất ổn định và sức kháng giới hạn của cấu kiện và liên kết.
        </p>
      </div>

      {/* Tab Navigations */}
      <div className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'tcvn' ? 'active' : ''}`}
          onClick={() => setActiveTab('tcvn')}
        >
          <Calculator size={18} />
          <span>4.1. Tiêu chuẩn Việt Nam TCVN 5575:2024</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'aisc' ? 'active' : ''}`}
          onClick={() => setActiveTab('aisc')}
        >
          <Crosshair size={18} />
          <span>4.2. Tiêu chuẩn Mỹ AISC 360-10</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          <Shuffle size={18} />
          <span>So Sánh Triết Lý TCVN vs AISC</span>
        </button>
      </div>

      {/* Tab Content Rendering */}
      {isLoading ? renderSkeletons() : (
        <>
          {/* Tab Content: TCVN 5575:2024 */}
          {activeTab === 'tcvn' && (
        <div className="steel-section">
          <div className="sub-grid" style={{ marginBottom: '24px' }}>
            <Card title="Phân nhóm Kết cấu & Chọn Vật liệu (Mục 4.3.1)">
              <ul className="bullet-list">
                <li>
                  <strong>Nhóm 1 (Tải trọng động cực nặng):</strong> Kết cấu chịu tác dụng trực tiếp của tải trọng động lực liên tục (dầm cầu trục chế độ công tác nặng, giàn khẩu độ lớn). Sử dụng thép dẻo dai cao mác <strong>S235, S275, S355</strong> (không dùng S450).
                </li>
                <li>
                  <strong>Nhóm 2 (Chịu kéo/động lực nhẹ):</strong> Các cấu kiện chịu kéo chính hoặc chịu tải trọng động lực thông thường (thanh giàn chịu kéo, dầm cầu trục nhẹ). Khuyên dùng <strong>S275, S355, S450</strong> (không khuyên dùng S235).
                </li>
                <li>
                  <strong>Nhóm 3 (Cấu kiện chịu nén tĩnh):</strong> Các cấu kiện chịu lực tĩnh, chủ yếu chịu nén như cột nhà xưởng, thanh nén của giàn. Thường chọn <strong>S235, S275</strong>.
                </li>
                <li>
                  <strong>Nhóm 4 (Cấu kiện phụ):</strong> Xà gồ, thanh giằng, sàn thao tác, cầu thang phụ. Chỉ sử dụng thép mác thấp <strong>S235</strong> để tối ưu kinh tế.
                </li>
              </ul>
            </Card>

            <Card title="Phân cấp Tiết diện theo Biến dạng Dẻo (Mục 4.2.7)">
              <ul className="bullet-list">
                <li>
                  <strong>Cấp 1 (Đàn hồi hoàn toàn):</strong> Tiết diện làm việc hoàn toàn trong giới hạn đàn hồi (<var>&sigma;</var> &le; <var>f<sub>yd</sub></var>). Bắt buộc áp dụng cho dầm cầu trục chế độ làm việc nặng, dầm tổ hợp từ hai loại thép khác nhau, cấu kiện chịu mỏi cao.
                </li>
                <li>
                  <strong>Cấp 2 (Đàn dẻo hạn chế):</strong> Cho phép xuất hiện biến dạng dẻo cục bộ tại thớ biên ngoài cùng của tiết diện dưới tác dụng của tải trọng tính toán.
                </li>
                <li>
                  <strong>Cấp 3 (Dẻo hoàn toàn / Khớp dẻo):</strong> Cho phép hình thành khớp dẻo hoàn toàn trên toàn bộ tiết diện. Áp dụng cho dầm liên tục chịu tải tĩnh khi tính toán phân bổ lại nội lực nhằm tối ưu hóa kết cấu dầm.
                </li>
              </ul>
            </Card>
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--accent-primary)" />
              <span>Tính toán Cường độ Cấu kiện theo TCVN 5575:2024</span>
            </h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '16px' }}>
                Cường độ tính toán vật liệu thép được giảm trừ thông qua hệ số độ tin cậy vật liệu &gamma;<sub>m</sub> (thường là 1.05 cho thép cán nóng tiêu chuẩn): <strong><var>f<sub>yd</sub></var> = <span className="fraction"><span className="numerator"><var>f<sub>y</sub></var></span><span className="denominator">&gamma;<sub>m</sub></span></span></strong>.
              </p>
              
              <div className="sub-grid">
                <div>
                  <strong>Chịu Nén/Kéo lệch tâm đồng thời (Mục 9.1.1):</strong>
                  <p>Khi cấu kiện chịu đồng thời lực dọc <var>N</var>, mô-men uốn <var>M<sub>x</sub></var>, <var>M<sub>y</sub></var> và lực xoắn sinh ra Bi-moment <var>B</var> (đặc biệt quan trọng với dầm chữ I, H hở):</p>
                  <div className="formula-block">
                    <span className="fraction"><span className="numerator"><var>N</var></span><span className="denominator"><var>A<sub>n</sub></var> &bull; <var>f<sub>yd</sub></var> &bull; &gamma;<sub>c</sub></span></span> + 
                    <span className="fraction"><span className="numerator"><var>M<sub>x</sub></var></span><span className="denominator"><var>W<sub>xn</sub></var> &bull; <var>f<sub>yd</sub></var> &bull; &gamma;<sub>c</sub></span></span> + 
                    <span className="fraction"><span className="numerator"><var>M<sub>y</sub></var></span><span className="denominator"><var>W<sub>yn</sub></var> &bull; <var>f<sub>yd</sub></var> &bull; &gamma;<sub>c</sub></span></span> + 
                    <span className="fraction"><span className="numerator"><var>B</var></span><span className="denominator"><var>W<sub>&omega;n</sub></var> &bull; <var>f<sub>yd</sub></var> &bull; &gamma;<sub>c</sub></span></span> &le; 1.0
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    *Chú ý: Bỏ qua ảnh hưởng của Bi-moment xoắn quạt (<var>B</var>) khi cấu kiện chịu xoắn có thể dẫn đến kết quả tính toán thiếu an toàn nghiêm trọng.
                  </span>
                </div>
                <div>
                  <strong>Chịu Cắt (Mục 8.2.1):</strong>
                  <p>Ứng suất cắt danh định tại tiết diện chịu lực cắt <var>V</var>:</p>
                  <div className="formula-block">
                    &tau; = <span className="fraction"><span className="numerator"><var>V</var> &bull; <var>S</var></span><span className="denominator"><var>I</var> &bull; <var>t<sub>w</sub></var></span></span> &le; <var>f<sub>v</sub></var> &bull; &gamma;<sub>c</sub>
                  </div>
                  <p>Trong đó cường độ tính toán chịu cắt của thép cán xác định bằng:</p>
                  <div className="formula-block">
                    <var>f<sub>v</sub></var> = 0.58 &bull; <span className="fraction"><span className="numerator"><var>f<sub>y</sub></var></span><span className="denominator">&gamma;<sub>m</sub></span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={20} color="var(--accent-primary)" />
              <span>Tính toán Ổn định Tổng thể & Cục bộ</span>
            </h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <div className="sub-grid">
                <div>
                  <strong>Ổn định chịu Nén đúng tâm (Mục 7.1.2.1):</strong>
                  <div className="formula-block">
                    <span className="fraction"><span className="numerator"><var>N</var></span><span className="denominator">&phi; &bull; <var>A</var></span></span> &le; <var>f<sub>yd</sub></var> &bull; &gamma;<sub>c</sub>
                  </div>
                  <p>Hệ số uốn dọc &phi; &le; 1.0 được xác định dựa trên độ mảnh quy đổi <span style={{ textDecoration: 'overline' }}>&lambda;</span> = &lambda; &bull; &radic;(<span className="fraction"><span className="numerator"><var>f<sub>yd</sub></var></span><span className="denominator"><var>E</var></span></span>) và loại tiết diện (a, b, c) với các hệ số tương ứng:</p>
                  <div className="spec-table-container" style={{ marginTop: '12px' }}>
                    <table className="spec-table">
                      <thead>
                        <tr>
                          <th>Loại tiết diện</th>
                          <th>Hệ số α</th>
                          <th>Hệ số β</th>
                          <th>Mô tả</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Đường cong a</strong></td>
                          <td>0.03</td>
                          <td>0.06</td>
                          <td>Ống tròn đặc, tiết diện hộp kín cán nóng.</td>
                        </tr>
                        <tr>
                          <td><strong>Đường cong b</strong></td>
                          <td>0.04</td>
                          <td>0.09</td>
                          <td>Tiết diện chữ I cán nóng quanh trục cứng x-x.</td>
                        </tr>
                        <tr>
                          <td><strong>Đường cong c</strong></td>
                          <td>0.04</td>
                          <td>0.14</td>
                          <td>Tiết diện hàn tổ hợp hoặc quanh trục yếu y-y.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <strong>Ổn định cục bộ bản cánh & bản bụng (Mục 8.3 & 8.5):</strong>
                  <p>Để đảm bảo cấu kiện không bị oằn cục bộ trước khi oằn tổng thể, TCVN khống chế độ mảnh của các tấm độc lập:</p>
                  <ul className="bullet-list" style={{ marginTop: '8px' }}>
                    <li>
                      <strong>Bản cánh nén nhô ra:</strong> Giới hạn tỷ lệ bề rộng phần nhô ra trên chiều dày bản cánh: 
                      <div className="formula-block">
                        <span className="fraction"><span className="numerator"><var>b<sub>ef</sub></var></span><span className="denominator"><var>t<sub>f</sub></var></span></span> &le; 0.35 &bull; &radic;(<span className="fraction"><span className="numerator"><var>E</var></span><span className="denominator"><var>f<sub>yd</sub></var></span></span>)
                      </div>
                    </li>
                    <li>
                      <strong>Bản bụng dầm chịu uốn:</strong> Giới hạn tỷ lệ chiều cao trên chiều dày bản bụng <var>h<sub>w</sub></var>/<var>t<sub>w</sub></var>. Nếu độ mảnh bản bụng vượt quá 3.2 &bull; &radic;(<span className="fraction"><span className="numerator"><var>E</var></span><span className="denominator"><var>f<sub>yd</sub></var></span></span>), bắt buộc phải bố trí sườn tăng cứng ngang với khoảng cách sườn <var>a</var> &le; 2 &bull; <var>h<sub>w</sub></var>.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Hammer size={20} color="var(--accent-primary)" />
              <span>Thiết kế Liên kết Kết cấu Thép theo TCVN</span>
            </h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <div className="sub-grid">
                <div>
                  <strong>Liên kết Hàn góc (Mục 14.9):</strong>
                  <p>Đường hàn góc được tính toán sức kháng cắt theo hai tiết diện phá hoại nguy hiểm:</p>
                  <ul className="bullet-list" style={{ marginTop: '8px' }}>
                    <li>
                      *Phá hoại dọc theo kim loại góc hàn (Tiết diện 1):*
                      <div className="formula-block">
                        &tau;<sub>f</sub> = <span className="fraction"><span className="numerator"><var>N</var></span><span className="denominator">&beta;<sub>f</sub> &bull; <var>k<sub>f</sub></var> &bull; <var>L<sub>w</sub></var></span></span> &le; <var>f<sub>wf</sub></var> &bull; &gamma;<sub>c</sub> &bull; &gamma;<sub>wf</sub>
                      </div>
                      Trong đó: <var>f<sub>wf</sub></var> = 0.55 &bull; <span className="fraction"><span className="numerator"><var>f<sub>wun</sub></var></span><span className="denominator">&gamma;<sub>wm</sub></span></span> (với &gamma;<sub>wm</sub> = 1.25 khi thép có giới hạn bền nhỏ).
                    </li>
                    <li>
                      *Phá hoại trên biên nóng chảy thép cơ bản (Tiết diện 2):*
                      <div className="formula-block">
                        &tau;<sub>z</sub> = <span className="fraction"><span className="numerator"><var>N</var></span><span className="denominator">&beta;<sub>z</sub> &bull; <var>k<sub>f</sub></var> &bull; <var>L<sub>w</sub></var></span></span> &le; <var>f<sub>wz</sub></var> &bull; &gamma;<sub>c</sub> &bull; &gamma;<sub>wz</sub>
                      </div>
                      Trong đó: <var>f<sub>wz</sub></var> = 0.45 &bull; <var>f<sub>ud</sub></var>.
                    </li>
                  </ul>
                </div>
                <div>
                  <strong>Liên kết Bu lông (Mục 14.9):</strong>
                  <p>Sức kháng tính toán của một bu lông thường (ép mặt & cắt) được xác định bằng giá trị nhỏ nhất trong các trạng thái giới hạn:</p>
                  <ul className="bullet-list" style={{ marginTop: '8px' }}>
                    <li>
                      *Chịu cắt thân bu lông:*
                      <div className="formula-block">
                        <var>N<sub>vb</sub></var> = <var>f<sub>vb</sub></var> &bull; <var>A</var> &bull; <var>k<sub>r</sub></var> &bull; <var>n<sub>s</sub></var>
                      </div>
                      (<var>n<sub>s</sub></var>: số mặt cắt cắt qua thân, <var>A</var>: diện tích thân bu lông).
                    </li>
                    <li>
                      *Ép mặt bản thép liên kết:*
                      <div className="formula-block">
                        <var>N<sub>cb</sub></var> = <var>f<sub>cb</sub></var> &bull; <var>d</var> &bull; &sum;<var>t</var> &bull; &gamma;<sub>b</sub>
                      </div>
                      (<var>d</var>: đường kính bu lông, &sum;<var>t</var>: chiều dày nhỏ nhất của các bản thép truyền lực cùng hướng).
                    </li>
                    <li>
                      *Chịu kéo bu lông:*
                      <div className="formula-block">
                        <var>N<sub>tb</sub></var> = <var>f<sub>tb</sub></var> &bull; <var>A<sub>n</sub></var>
                      </div>
                      (<var>A<sub>n</sub></var>: diện tích thực tiết diện ren bu lông).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: AISC 360-10 */}
      {activeTab === 'aisc' && (
        <div className="steel-section">
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crosshair size={20} color="var(--accent-primary)" />
              <span>Học thuyết LRFD và ASD trong AISC 360-10</span>
            </h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <p>
                AISC 360-10 cho phép kỹ sư lựa chọn độc lập một trong hai phương pháp luận thiết kế chính:
              </p>
              <div className="sub-grid" style={{ marginTop: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--accent-primary)' }}>LRFD (Load & Resistance Factor Design):</strong>
                  <p style={{ marginTop: '8px' }}>Thiết kế theo hệ số tải trọng và sức kháng. Sức kháng thiết kế lớn hơn nội lực yêu cầu do tổ hợp tải trọng có hệ số.</p>
                  <div className="formula-block">
                    <var>R<sub>u</sub></var> &le; &phi; &bull; <var>R<sub>n</sub></var>
                  </div>
                  <p style={{ fontSize: '0.9rem' }}>Với &phi; là hệ số sức kháng (giảm sức bền để an toàn, &phi; &lt; 1.0).</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '8px' }}>
                  <strong style={{ color: 'var(--amber)' }}>ASD (Allowable Strength Design):</strong>
                  <p style={{ marginTop: '8px' }}>Thiết kế theo sức kháng cho phép. Sức kháng cho phép bằng sức kháng danh định chia cho hệ số an toàn lớn hơn 1.</p>
                  <div className="formula-block">
                    <var>R<sub>a</sub></var> &le; <span className="fraction"><span className="numerator"><var>R<sub>n</sub></var></span><span className="denominator">&Omega;</span></span>
                  </div>
                  <p style={{ fontSize: '0.9rem' }}>Với &Omega; là hệ số an toàn thiết kế (&Omega; &gt; 1.0).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-layout">
            <Card title="Cấu kiện Chịu Kéo (Chương D)">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px' }}>
                Sức kháng kéo thiết kế <var>P<sub>n</sub></var> được xác định dựa trên hai trạng thái giới hạn phá hoại:
              </p>
              <ul className="bullet-list">
                <li>
                  <strong>Chảy dẻo trên tiết diện nguyên:</strong> Ngăn chặn biến dạng chảy dẻo kéo dài quá mức dọc chiều dài cấu kiện:
                  <div className="formula-block">
                    <var>P<sub>n</sub></var> = <var>F<sub>y</sub></var> &bull; <var>A<sub>g</sub></var>
                  </div>
                  LRFD: &phi; = 0.90 | ASD: &Omega; = 1.67.
                </li>
                <li>
                  <strong>Đứt gãy liên kết trên tiết diện thực:</strong> Phá hủy đứt gãy giòn qua các lỗ bu lông liên kết:
                  <div className="formula-block">
                    <var>P<sub>n</sub></var> = <var>F<sub>u</sub></var> &bull; <var>A<sub>e</sub></var>
                  </div>
                  LRFD: &phi; = 0.75 | ASD: &Omega; = 2.00.<br />
                  Trong đó diện tích hiệu dụng <var>A<sub>e</sub></var> = <var>U</var> &bull; <var>A<sub>n</sub></var> (với <var>U</var> là hệ số trượt trễ shear lag, phản ánh hiệu ứng truyền lực không đều qua mối nối).
                </li>
              </ul>
            </Card>

            <Card title="Cấu kiện Chịu Nén (Chương E)">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px' }}>
                Sức kháng nén danh định chống uốn dọc uốn xoắn: <var>P<sub>n</sub></var> = <var>F<sub>cr</sub></var> &bull; <var>A<sub>g</sub></var>. Ứng suất uốn dọc giới hạn <var>F<sub>cr</sub></var> tính theo độ mảnh dọc trục <var>KL</var>/<var>r</var>:
              </p>
              <ul className="bullet-list">
                <li>
                  <strong>Uốn dọc không đàn hồi (Khi <span className="fraction"><span className="numerator"><var>KL</var></span><span className="denominator"><var>r</var></span></span> &le; 4.71 &bull; &radic;(<span className="fraction"><span className="numerator"><var>E</var></span><span className="denominator"><var>F<sub>y</sub></var></span></span>)):</strong>
                  <div className="formula-block">
                    <var>F<sub>cr</sub></var> = [0.658<sup><span className="fraction"><span className="numerator"><var>F<sub>y</sub></var></span><span className="denominator"><var>F<sub>e</sub></var></span></span></sup>] &bull; <var>F<sub>y</sub></var>
                  </div>
                  (Cột có xu hướng bị nén chảy dẻo kết hợp oằn uốn dọc).
                </li>
                <li>
                  <strong>Uốn dọc đàn hồi Euler (Khi <span className="fraction"><span className="numerator"><var>KL</var></span><span className="denominator"><var>r</var></span></span> &gt; 4.71 &bull; &radic;(<span className="fraction"><span className="numerator"><var>E</var></span><span className="denominator"><var>F<sub>y</sub></var></span></span>)):</strong>
                  <div className="formula-block">
                    <var>F<sub>cr</sub></var> = 0.877 &bull; <var>F<sub>e</sub></var>
                  </div>
                  Với ứng suất uốn dọc đàn hồi Euler:
                  <div className="formula-block">
                    <var>F<sub>e</sub></var> = <span className="fraction"><span className="numerator">&pi;&sup2; &bull; <var>E</var></span><span className="denominator">(<span className="fraction"><span className="numerator"><var>KL</var></span><span className="denominator"><var>r</var></span></span>)&sup2;</span></span>
                  </div>
                  LRFD: &phi;<sub>c</sub> = 0.90 | ASD: &Omega;<sub>c</sub> = 1.67.
                </li>
              </ul>
            </Card>
          </div>

          <div className="sub-grid" style={{ marginTop: '24px' }}>
            <Card title="Cấu kiện Chịu Uốn (Chương F)">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px' }}>
                Khác biệt lớn nhất với TCVN là việc AISC phân loại độ mảnh của tiết diện làm 3 nhóm để tính sức kháng uốn <var>M<sub>n</sub></var>:
              </p>
              <ul className="bullet-list">
                <li>
                  <strong>Tiết diện Đặc chắc (Compact):</strong> Có độ mảnh &lambda; &le; &lambda;<sub>p</sub>. Đạt mô-men dẻo tối đa <var>M<sub>n</sub></var> = <var>M<sub>p</sub></var> = <var>F<sub>y</sub></var> &bull; <var>Z<sub>x</sub></var> mà không lo mất ổn định cục bộ.
                </li>
                <li>
                  <strong>Tiết diện Không đặc chắc (Non-compact):</strong> &lambda;<sub>p</sub> &lt; &lambda; &le; &lambda;<sub>r</sub>. Cấu kiện mất ổn định cục bộ trong miền đàn dẻo trước khi đạt mô-men dẻo. Sức kháng uốn giảm.
                </li>
                <li>
                  <strong>Tiết diện Mảnh (Slender):</strong> &lambda; &gt; &lambda;<sub>r</sub>. Mất ổn định cục bộ đàn hồi xảy ra từ sớm, sức kháng uốn <var>M<sub>n</sub></var> bị suy giảm mạnh.
                </li>
                <li>
                  <strong>Mất ổn định ngoài mặt phẳng (LTB):</strong> Phụ thuộc chiều dài tự do của cánh chịu nén không được giằng <var>L<sub>b</sub></var>:
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    <li>- <var>L<sub>b</sub></var> &le; <var>L<sub>p</sub></var>: Không xảy ra LTB, dầm đạt <var>M<sub>p</sub></var>.</li>
                    <li>- <var>L<sub>p</sub></var> &lt; <var>L<sub>b</sub></var> &le; <var>L<sub>r</sub></var>: Mất ổn định LTB không đàn hồi.</li>
                    <li>- <var>L<sub>b</sub></var> &gt; <var>L<sub>r</sub></var>: Mất ổn định LTB đàn hồi hoàn toàn.</li>
                  </ul>
                </li>
              </ul>
            </Card>

            <Card title="Cấu kiện Chịu uốn nén đồng thời (Chương H)">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px' }}>
                Sự làm việc đồng thời của lực dọc yêu cầu <var>P<sub>r</sub></var> và mô-men yêu cầu <var>M<sub>rx</sub></var>, <var>M<sub>ry</sub></var> (Beam-Columns) được kiểm tra qua hai phương trình tương tác liên tục:
              </p>
              <ul className="bullet-list">
                <li>
                  <strong>Khi lực dọc lớn (khi <span className="fraction"><span className="numerator"><var>P<sub>r</sub></var></span><span className="denominator"><var>P<sub>c</sub></var></span></span> &ge; 0.2):</strong>
                  <div className="formula-block">
                    <span className="fraction"><span className="numerator"><var>P<sub>r</sub></var></span><span className="denominator"><var>P<sub>c</sub></var></span></span> + <span className="fraction"><span className="numerator">8</span><span className="denominator">9</span></span> &bull; (<span className="fraction"><span className="numerator"><var>M<sub>rx</sub></var></span><span className="denominator"><var>M<sub>cx</sub></var></span></span> + <span className="fraction"><span className="numerator"><var>M<sub>ry</sub></var></span><span className="denominator"><var>M<sub>cy</sub></var></span></span>) &le; 1.0
                  </div>
                </li>
                <li>
                  <strong>Khi lực dọc nhỏ (khi <span className="fraction"><span className="numerator"><var>P<sub>r</sub></var></span><span className="denominator"><var>P<sub>c</sub></var></span></span> &lt; 0.2):</strong>
                  <div className="formula-block">
                    <span className="fraction"><span className="numerator"><var>P<sub>r</sub></var></span><span className="denominator">2 &bull; <var>P<sub>c</sub></var></span></span> + (<span className="fraction"><span className="numerator"><var>M<sub>rx</sub></var></span><span className="denominator"><var>M<sub>cx</sub></var></span></span> + <span className="fraction"><span className="numerator"><var>M<sub>ry</sub></var></span><span className="denominator"><var>M<sub>cy</sub></var></span></span>) &le; 1.0
                  </div>
                </li>
                <li>
                  *Lưu ý:* <var>P<sub>c</sub></var> và <var>M<sub>c</sub></var> lần lượt là sức kháng thiết kế kéo/nén và uốn theo LRFD (&phi;&bull;<var>R<sub>n</sub></var>) hoặc ASD (<span className="fraction"><span className="numerator"><var>R<sub>n</sub></var></span><span className="denominator">&Omega;</span></span>).
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Tab Content: Comparison */}
      {activeTab === 'compare' && (
        <div className="steel-section">
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shuffle size={20} color="var(--accent-primary)" />
              <span>Đối chiếu chi tiết hai tiêu chuẩn thiết kế</span>
            </h2>
            <div className="spec-table-container">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Tiêu chí so sánh</th>
                    <th>Tiêu chuẩn Việt Nam TCVN 5575:2024</th>
                    <th>Tiêu chuẩn Mỹ AISC 360-10</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Trường phái thiết kế</strong></td>
                    <td>Gốc từ tiêu chuẩn SNiP (Liên Xô/Nga cũ). Đồng bộ với SP 16.13330.</td>
                    <td>Trường phái Mỹ (AISC), sử dụng phổ biến toàn cầu cho nhà công nghiệp và cao tầng.</td>
                  </tr>
                  <tr>
                    <td><strong>Phương pháp tính toán</strong></td>
                    <td>Trạng thái giới hạn (TTGH). Phân tách rõ rệt TTGH1 (ULS) và TTGH2 (SLS).</td>
                    <td>Tích hợp cả hai phương pháp LRFD (Hệ số tải trọng và sức kháng) và ASD (Ứng suất cho phép).</td>
                  </tr>
                  <tr>
                    <td><strong>Hệ số an toàn vật liệu</strong></td>
                    <td>Chia cường độ chảy <var>f<sub>y</sub></var> cho hệ số tin cậy vật liệu &gamma;<sub>m</sub> (thường bằng 1.05 - 1.10).</td>
                    <td>Nhân sức kháng danh định với hệ số giảm &phi; (thường bằng 0.90 cho kéo, nén, uốn; 0.75 cho đứt gãy).</td>
                  </tr>
                  <tr>
                    <td><strong>Xử lý mất ổn định cục bộ</strong></td>
                    <td>Khống chế nghiêm ngặt độ mảnh tối đa. Không cho phép bản nén mất ổn định trước khi chảy dẻo (Bảo thủ).</td>
                    <td>Cho phép oằn cục bộ xảy ra trước. Phân loại cấu kiện (Đặc chắc, Không đặc chắc, Mảnh) để giảm trừ sức kháng tương ứng.</td>
                  </tr>
                  <tr>
                    <td><strong>Mất ổn định LTB</strong></td>
                    <td>Tính toán thông qua hệ số ổn định uốn dọc khi uốn &phi;<sub>b</sub> tra bảng phức tạp.</td>
                    <td>Phân chia rõ rệt thành 3 vùng theo chiều dài không được giằng <var>L<sub>b</sub></var>: không xảy ra LTB, LTB không đàn hồi, LTB đàn hồi.</td>
                  </tr>
                  <tr>
                    <td><strong>Độ mảnh giới hạn [&lambda;]</strong></td>
                    <td>Quy định giới hạn [&lambda;] khá thấp (nghiêm ngặt hơn về độ cứng của cột và thanh giàn).</td>
                    <td>Quy định mang tính khuyến nghị nhiều hơn (ví dụ khuyến nghị <span className="fraction"><span className="numerator"><var>KL</var></span><span className="denominator"><var>r</var></span></span> &le; 200 cho nén và &le; 300 cho kéo).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Warning Box */}
      <div className="alert-box" style={{ marginTop: '32px' }}>
        <div className="alert-box-title">
          <ShieldAlert size={18} />
          <span>BẢN CHẤT KHÁC BIỆT VỀ KINH TẾ VÀ AN TOÀN</span>
        </div>
        <div className="alert-box-content">
          TCVN 5575 đặt nặng yêu cầu về độ cứng kết cấu và ngăn chặn oằn cục bộ, dẫn đến khối lượng thép thiết kế có xu hướng nặng hơn. Trái lại, AISC 360-10 tận dụng tối đa khả năng chịu lực sau mất ổn định (Post-buckling strength) của bản thép mảnh, tạo ra các thiết kế kết cấu thép tiền chế (PEB) rất nhẹ và tối ưu hóa chi phí đầu tư.
        </div>
      </div>
    </div>
  );
}
