import Card from '../components/Card';

export default function RCStructures() {
  return (
    <div>
      <h1 className="page-title">Kết cấu Bê Tông Cốt Thép</h1>
      
      <div className="card" style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>Trạng Thái Giới Hạn (Limit States)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)' }}>TTGH 1 (Sức bền & Khả năng chịu lực)</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Bảo vệ công trình không sụp đổ. Sử dụng Tải trọng tính toán (đã nhân hệ số vượt tải γ &gt; 1.0).</p>
            <ul style={{ color: 'var(--text-secondary)' }}>
              <li>Kiểm tra tiết diện chữ nhật chịu uốn (Tính A<sub>s</sub>, Moment giới hạn).</li>
              <li>Kiểm tra chịu nén lệch tâm (Biểu đồ tương tác N-M).</li>
              <li>Kiểm tra chịu cắt (Thép đai, thép xiên).</li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: 'var(--text-primary)' }}>TTGH 2 (Điều kiện sử dụng bình thường)</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Bảo đảm tiện nghi, không nứt nẻ quá mức. Sử dụng Tải trọng tiêu chuẩn (γ = 1.0).</p>
            <ul style={{ color: 'var(--text-secondary)' }}>
              <li>Kiểm tra Độ võng (Sag/Deflection) so với giới hạn L/250, L/500.</li>
              <li>Kiểm tra Bề rộng vết nứt (a<sub>crc</sub>) ≤ 0.3mm hoặc 0.4mm.</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '24px' }}>Nguyên lý Thiết kế theo Cấu kiện</h2>
      <div className="grid-layout">
        <Card title="Dầm (Beams)">
          <ul>
            <li><strong>Chịu uốn:</strong> Bố trí cốt thép dọc tại thớ căng (thớ dưới ở nhịp, thớ trên ở gối).</li>
            <li><strong>Chịu cắt:</strong> Bố trí cốt thép đai. Khu vực gần gối tựa có lực cắt lớn → đai dày. Khoảng cách đai s ≤ s<sub>max</sub>.</li>
            <li><strong>Giảm độ cứng:</strong> Theo EC8/TCVN 9386, độ cứng dầm chiết giảm còn 0.5 E I<sub>g</sub> khi tính động đất.</li>
          </ul>
        </Card>

        <Card title="Cột (Columns)">
          <ul>
            <li><strong>Chịu nén lệch tâm:</strong> Tính toán biểu đồ tương tác N-M phẳng hoặc xiên.</li>
            <li><strong>Cột khỏe - Dầm yếu:</strong> Khống chế Σ M<sub>Rc</sub> ≥ 1.3 Σ M<sub>Rb</sub> tại nút giao để ép khớp dẻo xuất hiện ở dầm.</li>
            <li><strong>Vùng nguy hiểm (Critical Zone):</strong> Hai đầu cột phải siết chặt đai (s ≤ 100mm) để bó lõi bê tông, cấm nối thép chủ tại đây.</li>
          </ul>
        </Card>

        <Card title="Sàn & Vách (Slabs & Walls)">
          <ul>
            <li><strong>Sàn:</strong> Tính theo bản làm việc 1 phương hoặc 2 phương (tỷ số cạnh ≤ 2). Kiểm tra chọc thủng tại vị trí cột không dầm.</li>
            <li><strong>Vách cứng:</strong> Nhận toàn bộ tải trọng ngang (Gió, Động đất). Bố trí thép biên (Boundary Elements) tại hai mép vách để chịu vùng nén cực đại và kéo dẻo.</li>
            <li><strong>Lõi thang máy:</strong> Lõi hộp hở chịu thêm ứng suất vặn xoắn, cần chú ý cốt thép phân bố màng.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
