import Card from '../components/Card';

export default function Foundations() {
  return (
    <div>
      <h1 className="page-title">Nền Móng & Tương Tác Đất Nền</h1>
      
      <div className="card" style={{ marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>Vai trò của Nền Móng</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Tiếp nhận toàn bộ tải trọng từ Cột/Vách truyền xuống và phân tán an toàn vào tầng đất tốt. Nếu đất nền lún không đều hoặc trượt, toàn bộ cấu kiện bên trên sẽ bị xé nát.</p>
      </div>

      <div className="grid-layout">
        <Card title="Sức Chịu Tải & Hệ Số An Toàn">
          <ul>
            <li><strong>Sức chịu tải theo vật liệu cọc:</strong> Tính uốn dọc khi thi công (μ = 1) và khi làm việc (μ = 0.5).</li>
            <li><strong>Sức chịu tải đất nền (Q<sub>a</sub> = Q<sub>u</sub> / k<sub>tc</sub>):</strong> Hệ số an toàn k<sub>tc</sub> không cào bằng mà phụ thuộc vào Số lượng cọc trong đài. Đài càng nhiều cọc, k<sub>tc</sub> càng giảm (rủi ro thấp hơn).</li>
            <li><strong>Ma sát âm (Negative Skin Friction):</strong> Cực kỳ nguy hiểm khi đắp đất bù nền khu vực có lớp bùn yếu. Đất lún tỳ vào cọc sinh lực dọc bổ sung, có thể gãy cọc.</li>
          </ul>
        </Card>

        <Card title="Kiểm tra Lún & Chọc thủng">
          <ul>
            <li><strong>Độ lún tuyệt đối:</strong> Thường khống chế S ≤ 8cm (công trình dân dụng). Tính bằng mô hình "Móng khối quy ước".</li>
            <li><strong>Độ lún lệch (Differential Settlement):</strong> Chênh lệch lún giữa 2 cột gần nhau ≤ 0.002L. Đây là nguyên nhân số 1 làm nứt tường xây.</li>
            <li><strong>Chọc thủng đài (Punching Shear):</strong> Lực chọc thủng từ cột xuyên qua đài cọc. Mũi chọc thủng mở xiên góc 45 độ. Cần đảm bảo bề dày đai móng đủ lớn.</li>
          </ul>
        </Card>

        <Card title="Tường Chắn & Tầng Hầm">
          <ul>
            <li><strong>Áp lực đất chủ động (Active):</strong> Đất có xu hướng trượt ra ngoài, đẩy vào tường chắn (Rankine/Coulomb).</li>
            <li><strong>Áp lực đất bị động (Passive):</strong> Tường chắn bị ép vào đất nền, đất có sức phản kháng khổng lồ. Tuy nhiên, tiêu chuẩn khuyến cáo cẩn thận khi huy động 100% áp lực bị động vì cần chuyển vị rất lớn để kích hoạt.</li>
            <li><strong>Áp lực nước bồi (Hydrostatic):</strong> Mực nước ngầm dâng cao gây áp lực đẩy ngang và đẩy nổi (Uplift) dưới đáy hầm. Tải đẩy nổi có thể làm "nổi" cả tòa nhà nếu không có cọc neo.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
