import Card from '../components/Card';

export default function SteelStructures() {
  return (
    <div>
      <h1 className="page-title">Kết cấu Thép</h1>
      <div className="breadcrumb" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '-16px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Trang chủ</a>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Kết cấu Thép</span>
      </div>

      
      <div className="card" style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>Phân loại Tiết diện (Section Classification)</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Theo AISC 360, tiết diện được chia làm 3 loại dựa trên tỷ số độ mảnh của bản bụng (h<sub>w</sub>/t<sub>w</sub>) và bản cánh (b<sub>f</sub>/t<sub>f</sub>). Theo TCVN 5575:2024, nó quyết định xem tiết diện có phải tính theo <em>"Tiết diện có hiệu"</em> hay không.</p>
        <ul style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
          <li><strong>Đặc chắc (Compact):</strong> Cánh/Bụng rất dày, có thể phát triển hoàn toàn khớp dẻo trước khi oằn cục bộ.</li>
          <li><strong>Không đặc chắc (Non-compact):</strong> Chảy dẻo thớ ngoài cùng nhưng oằn cục bộ trước khi thành khớp dẻo.</li>
          <li><strong>Mảnh (Slender):</strong> Oằn cục bộ ngay từ trong miền đàn hồi. TCVN 5575 bắt buộc tính giảm diện tích (A<sub>eff</sub>).</li>
        </ul>
      </div>

      <div className="grid-layout">
        <Card title="Kiểm tra Bền & Ổn định (Strength & Stability)">
          <ul>
            <li><strong>Chịu kéo dọc trục:</strong> N / A<sub>n</sub> ≤ f<sub>y</sub> γ<sub>c</sub>. Kiểm tra đứt gãy tại tiết diện rỗng (nơi có lỗ bu lông).</li>
            <li><strong>Chịu nén dọc trục:</strong> Yếu tố nguy hiểm nhất là <em>Mất ổn định tổng thể</em>. Phải tính hệ số uốn dọc φ phụ thuộc độ mảnh λ = l<sub>0</sub> / i.</li>
            <li><strong>Chịu uốn (Dầm):</strong> Kiểm tra mất ổn định xoắn ngang (Lateral Torsional Buckling - LTB). Cần có hệ giằng cánh nén (fly braces).</li>
            <li><strong>Hệ số γ<sub>s</sub>:</strong> Theo TCVN mới, hệ số an toàn ổn định tổng thể hệ khung γ<sub>s</sub> = 1.3.</li>
          </ul>
        </Card>

        <Card title="Liên kết Hàn (Welded Connections)">
          <ul>
            <li><strong>Đường hàn đối đầu (Butt Weld):</strong> Xuyên thấu hoàn toàn (CJP) hoặc một phần (PJP). Cường độ tương đương thép cơ bản nếu siêu âm đạt chuẩn.</li>
            <li><strong>Đường hàn góc (Fillet Weld):</strong> Tính toán phá hoại cắt qua tiết diện cổ họng 0.7 h<sub>f</sub>. Chiều cao đường hàn h<sub>f</sub> không được quá dày (gây nứt nhiệt) hoặc quá mỏng (không ngấu).</li>
          </ul>
        </Card>

        <Card title="Liên kết Bu lông (Bolted Connections)">
          <ul>
            <li><strong>Bu lông thường (Grade 4.6, 5.6):</strong> Chỉ dùng cho cấu kiện phụ (xà gồ, giằng tường). Chịu cắt qua thân và ép mặt.</li>
            <li><strong>Bu lông Cường độ cao (Grade 8.8, 10.9):</strong> Dùng cho khung chính. Nút bích (End-plate) chịu nhổ dập, lực căng trước (Pre-tension) tạo ma sát để truyền lực cắt (Friction-type).</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
