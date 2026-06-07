import Card from '../components/Card';
import { BookOpen, FileText, Globe, User } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <h1 className="page-title">Cẩm nang Kỹ sư Kết cấu</h1>
      
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)', border: '1px solid rgba(102,126,234,0.3)', boxShadow: '0 0 30px rgba(102,126,234,0.15)' }}>
        <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '2rem' }}>✨</span>
          <span className="gradient-text">Chào mừng bạn đến với Hệ thống Tổng hợp Kiến thức</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Hệ thống này được xây dựng nhằm mục đích cung cấp một bộ bách khoa toàn thư số hóa về thiết kế kết cấu, 
          hỗ trợ tra cứu nhanh chóng các tiêu chuẩn (TCVN, ASCE, AISC, Eurocode) và các công thức kỹ thuật chuyên sâu.
        </p>
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Biên soạn & Tổng hợp:</span>
          <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            Nguyễn Tiến Đức
          </span>
        </div>
      </div>

      <div className="grid-layout">
        <Card title={<><BookOpen size={20} /> Tiêu chuẩn TCVN Mới</>}>
          <ul>
            <li><strong>TCVN 2737:2023:</strong> Tải trọng và tác động (Cập nhật Gió giật 3s).</li>
            <li><strong>TCVN 5575:2024:</strong> Thiết kế Kết cấu Thép.</li>
            <li><strong>TCVN 5574:2018:</strong> Thiết kế Bê tông cốt thép.</li>
            <li><strong>TCVN 9386:2012:</strong> Thiết kế công trình chịu động đất.</li>
            <li><strong>TCVN 10304:2025:</strong> Thiết kế Móng cọc (Tiêu chuẩn mới).</li>
          </ul>
        </Card>

        <Card title={<><Globe size={20} /> Tiêu chuẩn Quốc tế (Tham chiếu)</>}>
          <ul>
            <li><strong>ASCE 7-10:</strong> Nền tảng của Tải trọng Gió & Động đất mới.</li>
            <li><strong>AISC 360-10:</strong> Tiêu chuẩn Mỹ về kết cấu thép (ASD/LRFD).</li>
            <li><strong>MBMA 2012:</strong> Hiệp hội nhà thép tiền chế (Giới hạn độ võng H/60).</li>
            <li><strong>Eurocode 2 & 8:</strong> Tiêu chuẩn Châu Âu về Bê tông và Kháng chấn.</li>
          </ul>
        </Card>

        <Card title={<><User size={20} /> Bài viết bởi Nguyễn Tiến Đức</>}>
          <ul style={{ lineHeight: '1.7' }}>
            <li><strong>Nghiên cứu chuyên sâu về tải trọng và tổ hợp tải trọng</strong> theo tiêu chuẩn TCVN 2737.</li>
            <li><strong>Tổng hợp cơ sở Sức bền Vật liệu</strong> và đặc trưng hình học tiết diện.</li>
            <li><strong>So sánh và quy đổi tiêu chuẩn vật liệu</strong> TCVN và Hoa Kỳ (ACI/AISC).</li>
            <li><strong>Cơ sở địa kỹ thuật nền móng</strong> và thiết kế móng nông, móng cọc sâu.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
