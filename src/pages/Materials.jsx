import Card from '../components/Card';

export default function Materials() {
  return (
    <div>
      <h1 className="page-title">Cơ sở Vật liệu Xây dựng</h1>
      <div className="breadcrumb" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '-16px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Trang chủ</a>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Cơ sở Vật liệu Xây dựng</span>
      </div>

      
      <div className="grid-layout">
        <Card title="1. Bê tông (Concrete)">
          <ul>
            <li><strong>Đặc trưng:</strong> Vật liệu giòn, chịu nén cực tốt nhưng chịu kéo rất kém (R<sub>bt</sub> ≈ 1/10 R<sub>b</sub>).</li>
            <li><strong>Cấp độ bền (B):</strong> Đặc trưng bởi cường độ chịu nén mẫu lập phương (MPa). Ví dụ: B20, B25, B30. B thay thế cho hệ "Mác" (M) cũ.</li>
            <li><strong>Mô đun đàn hồi (E):</strong> E<sub>b</sub> ≈ 27,000 → 32,500 MPa (Tăng dần theo cấp độ bền).</li>
            <li><strong>Hệ số Poisson (ν):</strong> Khoảng 0.2.</li>
            <li><strong>Hệ số giãn nở nhiệt (α):</strong> ≈ 1 × 10<sup>-5</sup> /°C.</li>
            <li><strong>Hệ số độ tin cậy (γ<sub>m</sub>):</strong> Chịu nén γ<sub>b</sub> = 1.3; Chịu kéo γ<sub>bt</sub> = 1.5.</li>
          </ul>
        </Card>

        <Card title="2. Cốt thép (Rebar)">
          <ul>
            <li><strong>Đặc trưng:</strong> Vật liệu dẻo, chịu kéo và nén đều tốt, bù đắp yếu điểm của bê tông.</li>
            <li><strong>Mác thép (CB):</strong> Dựa vào giới hạn chảy. Ví dụ: CB300-V, CB400-V, CB500-V.</li>
            <li><strong>Cường độ tính toán (R<sub>s</sub>):</strong> R<sub>s</sub> = R<sub>sn</sub> / γ<sub>s</sub>. (Ví dụ CB400 có R<sub>s</sub> ≈ 350 MPa).</li>
            <li><strong>Mô đun đàn hồi (E):</strong> E<sub>s</sub> = 2 × 10<sup>5</sup> MPa.</li>
            <li><strong>Hệ số an toàn (γ<sub>s</sub>):</strong> Khoảng 1.15 (rất an toàn so với bê tông vì thép sản xuất công nghiệp).</li>
          </ul>
        </Card>

        <Card title="3. Thép hình (Structural Steel)">
          <ul>
            <li><strong>Đặc trưng:</strong> Cường độ rất cao, trọng lượng nhẹ, thi công nhanh. Rất dễ mất ổn định (Buckling).</li>
            <li><strong>Mác thép (TCVN/JIS/ASTM):</strong> SS400, Q345, A36, Gr.50. Đặc trưng bởi Giới hạn chảy (f<sub>y</sub>) và Giới hạn đứt (f<sub>u</sub>).</li>
            <li><strong>Hệ số độ tin cậy (γ<sub>m</sub>):</strong> Giao động từ 1.05 → 1.10 theo TCVN 5575:2024 mới nhất.</li>
            <li><strong>Hệ số Poisson (ν):</strong> Khoảng 0.3 trong miền đàn hồi, tiến tới 0.5 trong miền dẻo.</li>
            <li><strong>Mô đun trượt (G):</strong> G = E / [2(1+ν)] ≈ 7.9 × 10<sup>4</sup> MPa.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
