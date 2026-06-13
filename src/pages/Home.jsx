import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Map, Mail, Phone, User, Award, Sliders, Activity, Layers, Search } from 'lucide-react';

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
    { title: 'Nền móng & Địa kỹ thuật', path: '/geotechnical-foundations' },
    { title: 'Thông số Vật liệu', path: '/parameters' },
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
          { title: "2. Khai báo Tham số", path: "/parameters", icon: Sliders, desc: "Hệ tọa độ, bậc tự do và thuộc tính." },
          { title: "3. Tải trọng & Tổ hợp", path: "/loads-combinations", icon: Activity, desc: "TCVN 2737:2023, ASCE 7-10." },
          { title: "4. BTCT Cấu kiện", path: "/rc-components", icon: ConcreteIcon, desc: "Thiết kế Dầm, Cột, Sàn, Vách." },
          { title: "5. Cấu kiện Thép", path: "/steel-components", icon: IBeamIcon, desc: "Thiết kế cấu kiện Thép cơ bản." },
          { title: "6. Ổn định Tổng thể", path: "/global-stability", icon: Layers, desc: "P-Delta, Chống lật, Chuyển vị." },
          { title: "7. Cơ sở Địa kỹ thuật", path: "/geotechnical-foundations", icon: Map, desc: "Thiết kế Móng, Cọc và Sức chịu tải." }
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
            color: 'var(--text-primary)',
          }}>
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
        padding: '30px', 
        background: 'var(--bg-card)', 
        borderRadius: '24px', 
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-soft)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          Nguyễn Tiến Đức
        </h2>
        <p style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
          Engineer Manager - Structural
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="mailto:contact@example.com" style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
            padding: '8px 16px', borderRadius: '20px', color: 'var(--text-secondary)',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'all 0.2s ease'
          }} className="author-link">
            <Mail size={16} /> Email Góp ý
          </a>
          <a href="#" style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', 
            background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
            padding: '8px 16px', borderRadius: '20px', color: 'var(--text-secondary)',
            textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'all 0.2s ease'
          }} className="author-link">
            <Phone size={16} /> Liên hệ (SĐT)
          </a>
        </div>
      </section>
    </div>
  );
}
