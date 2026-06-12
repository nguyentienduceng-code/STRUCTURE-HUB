import { BookOpen, Map, Mail, Phone, User, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero-section" style={{
        backgroundImage: 'linear-gradient(rgba(10, 14, 26, 0.75), rgba(10, 14, 26, 0.85)), url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
        borderRadius: '16px',
        textAlign: 'center',
        border: '1px solid rgba(102,126,234,0.3)',
        marginBottom: '40px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 style={{ 
          fontSize: '2.8rem', 
          fontWeight: '800', 
          marginBottom: '16px',
          background: 'linear-gradient(to right, #818cf8, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          lineHeight: '1.2'
        }}>
          Structural Knowledge Hub – Nơi Tri Thức Kết Cấu Được Hệ Thống Hóa
        </h1>
        <p style={{ 
          fontSize: '1.15rem', 
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '800px',
          margin: '0 auto',
          fontWeight: '400',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
          Thu hẹp khoảng cách giữa lý thuyết tiêu chuẩn và giải pháp thực tế.
        </p>
      </section>

      {/* Overview Section */}
      <section className="overview-section" style={{ marginBottom: '40px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '1.5rem' }}>
            <BookOpen size={24} color="var(--accent-primary)" />
            Giới thiệu tổng quan
          </h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '16px' }}>
              Chào mừng bạn đến với <strong>Structural Knowledge Hub</strong>, không gian số chuyên sâu dành riêng cho những ai đam mê và đang hoạt động trong lĩnh vực Kỹ thuật Kết cấu.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Trong kỷ nguyên số hóa ngành xây dựng, việc tiếp cận thông tin không còn là thách thức, nhưng làm sao để chắt lọc, hệ thống hóa và ứng dụng hiệu quả những khối lượng kiến thức khổng lồ ấy lại là một câu chuyện khác. Hub này được ra đời với sứ mệnh trở thành một cuốn <em>"sổ tay điện tử"</em> toàn diện – nơi chia sẻ từ các cập nhật tiêu chuẩn thiết kế mới nhất, quy trình tối ưu hóa mô hình hóa học (ETABS, SAP2000, SAFE, AutoCAD, Revit), cho đến những bài học kinh nghiệm thực tế.
            </p>
            <p>
              Trang web này được thiết kế để giúp bạn tối ưu hóa thời gian và nâng cao độ chính xác trong từng bài toán tính toán.
            </p>
          </div>
        </div>
      </section>

      {/* Author & Contact Section */}
      <section className="contact-section">
        <div className="card" style={{ 
          padding: '32px',
          background: 'var(--bg-secondary)',
          borderLeft: '4px solid var(--accent-primary)'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontSize: '1.5rem' }}>
            <User size={24} color="var(--accent-primary)" />
            Tác giả & Liên hệ
          </h2>
          
          <div className="sub-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ background: 'rgba(102,126,234,0.1)', padding: '12px', borderRadius: '50%' }}>
                <Award size={24} color="var(--accent-primary)" />
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Biên soạn bởi</p>
                <p style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)' }}>Nguyễn Tiến Đức</p>
                <p style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', marginTop: '4px' }}>Engineer Manager-Structural</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
              <a href="mailto:nguyentienduc.e@gmail.com" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', 
                textDecoration: 'none', color: 'var(--text-secondary)',
                padding: '12px 16px', background: 'var(--bg-card)', 
                borderRadius: '8px', border: '1px solid var(--border-glass)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <Mail size={18} color="var(--accent-primary)" />
                <span>nguyentienduc.e@gmail.com</span>
              </a>

              <a href="tel:0981019694" style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', 
                textDecoration: 'none', color: 'var(--text-secondary)',
                padding: '12px 16px', background: 'var(--bg-card)', 
                borderRadius: '8px', border: '1px solid var(--border-glass)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <Phone size={18} color="var(--accent-primary)" />
                <span>0981019694</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
