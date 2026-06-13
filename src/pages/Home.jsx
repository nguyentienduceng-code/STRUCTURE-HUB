import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Map, Mail, Phone, User,  Sliders, Activity, Layers, Search } from 'lucide-react';

import IBeamIcon from '../components/icons/IBeamIcon';
import ConcreteIcon from '../components/icons/ConcreteIcon';
import CompassRulerIcon from '../components/icons/CompassRulerIcon';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const searchIndex = [
    { title: 'Nền tảng Sức bền vật liệu', path: '/engineering-foundations' },
    { title: 'Mô men quán tính & tiết diện', path: '/engineering-foundations' },
    { title: 'Vòng tròn Mohr & Ứng suất', path: '/engineering-foundations' },
    { title: 'Tải trọng & Tổ hợp (TCVN 2737)', path: '/loads-combinations' },
    { title: 'Cấu kiện Bê tông cốt thép', path: '/rc-components' },
    { title: 'Cấu kiện Thép', path: '/steel-components' },
    { title: 'Ổn định tổng thể', path: '/global-stability' },
    { title: '7. Nền móng', path: '/geotechnical-foundations' },
    { title: '2. Thông số Vật liệu', path: '/parameters' },
  ];

  useEffect(() => {
    function handleSearchOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleSearchOutside);
    return () => document.removeEventListener('mousedown', handleSearchOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchIndex.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  };

  return (
    <div className="home-container">
      <section className="hero-section" style={{
        backgroundImage: 'linear-gradient(rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.9)), url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 20px',
        borderRadius: '24px',
        textAlign: 'center',
        border: '1px solid rgba(102,126,234,0.15)',
        marginBottom: '60px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 style={{ 
          fontSize: '3.2rem', 
          fontWeight: '800', 
          marginBottom: '20px',
          background: 'linear-gradient(to right, #818cf8, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '1.2'
        }}>
          Structural Knowledge Hub
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '800px',
          margin: '0 auto 40px auto',
          fontWeight: '400',
          lineHeight: '1.6'
        }}>
          Thu hẹp khoảng cách giữa lý thuyết tiêu chuẩn và giải pháp thực tế.
        </p>

        {/* Prominent Search Bar */}
        <div ref={searchRef} style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
            padding: '8px 24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }} className="hero-search-wrapper">
            <Search size={24} color="rgba(255,255,255,0.6)" style={{ marginRight: '16px' }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm công thức, tiêu chuẩn, khái niệm..." 
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => { if(searchQuery.trim()) setShowSearch(true); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.1rem',
                width: '100%',
                outline: 'none',
                padding: '8px 0'
              }}
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '16px',
              background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '16px',
              boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(var(--glass-blur))', padding: '12px',
              zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left'
            }}>
              {searchResults.map((result, index) => (
                <Link 
                  key={index} to={result.path}
                  onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                  style={{
                    padding: '12px 16px', borderRadius: '12px', color: 'var(--text-primary)',
                    fontSize: '1rem', textDecoration: 'none', display: 'block', transition: 'background 0.2s',
                    background: 'var(--bg-glass)'
                  }}
                  className="search-result-item"
                >
                  {result.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      
      {/* Chapters Grid Section */}
      <section className="chapters-grid" style={{ marginBottom: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {[
          { title: "1. Nền tảng Kỹ thuật", path: "/engineering-foundations", icon: CompassRulerIcon, desc: "Cơ sở sức bền và đặc trưng vật liệu." },
          { title: "2. Thông số Vật liệu", path: "/parameters", icon: Sliders, desc: "Hệ tọa độ, bậc tự do và thuộc tính." },
          { title: "3. Tải trọng & Tổ hợp", path: "/loads-combinations", icon: Activity, desc: "TCVN 2737:2023, ASCE 7-10." },
          { title: "4. BTCT Cấu kiện", path: "/rc-components", icon: ConcreteIcon, desc: "Thiết kế Dầm, Cột, Sàn, Vách." },
          { title: "5. Cấu kiện Thép", path: "/steel-components", icon: IBeamIcon, desc: "Thiết kế cấu kiện Thép cơ bản." },
          { title: "6. Ổn định Tổng thể", path: "/global-stability", icon: Layers, desc: "P-Delta, Chống lật, Chuyển vị." },
          { title: "7. Nền móng", path: "/geotechnical-foundations", icon: Map, desc: "Thiết kế Móng, Cọc và Sức chịu tải." }
        ].map((chapter, index) => (
          <Link to={chapter.path} key={index} className="chapter-card" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            borderRadius: '20px',
            padding: '24px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px',
            transition: 'all 0.3s ease',
            color: 'var(--text-primary)' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '16px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}>
              <chapter.icon size={28} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', fontWeight: '700' }}>{chapter.title}</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {chapter.desc}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* About Section */}
      <section className="about-section" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glass)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <BookOpen size={24} color="var(--accent-primary)" />
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Structural Knowledge Hub: Làm chủ tư duy, Dẫn dắt giải pháp kỹ thuật</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          <p>
            Để một dự án thành công, kỹ sư kết cấu không chỉ cần tính toán đúng, mà còn cần tư duy hệ thống để quản lý và triển khai hồ sơ hiệu quả. Hub được định hình là "trợ lý đắc lực" giúp bạn hệ thống hóa toàn bộ chuỗi kiến thức: từ nền tảng cơ học, cập nhật tiêu chuẩn mới, đến kỹ năng kiểm soát và đánh giá mô hình.
          </p>
          <p>
            Dù bạn đang trực tiếp triển khai thiết kế hay đảm nhận vai trò quản lý, Hub sẽ cung cấp những kinh nghiệm thực tế để bạn đưa ra quyết định kỹ thuật chuẩn xác và nhanh chóng nhất.
          </p>
        </div>
      </section>

      {/* Author Section */}
      <section id="author" style={{ 
        marginTop: '60px', 
        padding: '24px 40px', 
        background: 'var(--bg-card)', 
        borderRadius: '24px', 
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-soft)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            border: '2px solid var(--bg-primary)',
            flexShrink: 0
          }}>
            <User size={28} color="#fff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Nguyễn Tiến Đức
            </h2>
            <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--accent-primary)', letterSpacing: '0.02em' }}>
              Engineer Manager - Structural
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="mailto:nguyentienduc.e@gmail.com" style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
            padding: '10px 20px', borderRadius: '30px', color: 'var(--text-primary)',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600', transition: 'all 0.3s ease'
          }} className="author-link">
            <Mail size={18} color="var(--accent-primary)" /> Email
          </a>
          <a href="tel:0981019694" style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
            padding: '10px 20px', borderRadius: '30px', color: 'var(--text-primary)',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600', transition: 'all 0.3s ease'
          }} className="author-link">
            <Phone size={18} color="var(--accent-primary)" /> Hotline
          </a>
          <a href="https://zalo.me/0981019694" target="_blank" rel="noopener noreferrer" style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(0, 104, 255, 0.1)', border: '1px solid rgba(0, 104, 255, 0.3)',
            padding: '10px 20px', borderRadius: '30px', color: '#0068ff',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600', transition: 'all 0.3s ease'
          }} className="author-link-zalo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.384 10.32c-.084-5.268-4.344-9.396-9.66-9.396-5.46 0-9.84 4.164-9.84 9.396 0 2.58.984 4.908 2.628 6.648L3.3 22.032c-.156.348-.024.78.3.936.12.06.252.084.384.084.216 0 .432-.084.588-.228l4.332-3.888c1.032.288 2.136.444 3.276.444 1.404 0 2.748-.288 3.96-.804l.144-.06.144.06c1.212.516 2.556.804 3.96.804 5.46 0 9.84-4.164 9.84-9.396 0-5.232-4.38-9.396-9.84-9.396zM11.724 17.52c-4.488 0-8.16-3.444-8.16-7.716 0-4.272 3.672-7.716 8.16-7.716 4.488 0 8.16 3.444 8.16 7.716 0 4.272-3.672 7.716-8.16 7.716z" />
              <path d="M14.652 8.76H8.784c-.468 0-.84.372-.84.84s.372.84.84.84h4.152l-4.752 4.092c-.228.192-.36.48-.36.78 0 .468.372.84.84.84h5.868c.468 0 .84-.372.84-.84s-.372-.84-.84-.84H10.536l4.752-4.092c.228-.192.36-.48.36-.78 0-.468-.372-.84-.84-.84z" />
            </svg>
            Zalo
          </a>
          <a href="https://www.facebook.com/nguyen.tien.uc.749949" target="_blank" rel="noopener noreferrer" style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'rgba(24, 119, 242, 0.1)', border: '1px solid rgba(24, 119, 242, 0.3)',
            padding: '10px 20px', borderRadius: '30px', color: '#1877F2',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600', transition: 'all 0.3s ease'
          }} className="author-link-fb">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg> Facebook
          </a>

        </div>
      </section>
    </div>
  );
}
