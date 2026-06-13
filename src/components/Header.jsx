import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Sun, Moon, LogIn, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './icons/Logo';

export default function Header({ toggleSidebar, theme, toggleTheme }) {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

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
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
      
      {/* Left: Mobile Toggle & Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle Navigation">
          <Menu size={24} color="var(--text-primary)" />
        </button>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ 
            background: 'var(--accent-gradient)', 
            padding: '6px', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Logo size={24} color="#fff" />
          </div>
          <span style={{ 
            fontWeight: '800', 
            fontSize: '1.25rem',
            background: 'linear-gradient(to right, var(--text-primary), var(--text-muted))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            display: 'none' /* hidden on very small screens, visible otherwise via css, handled inline for now */
          }} className="hide-on-mobile">Structural Hub</span>
        </Link>
      </div>

      {/* Center: Global Navbar Links */}
      <nav className="global-navbar" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Trang chủ</Link>
        <Link to="/engineering-foundations" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Danh mục</Link>
        <a href="#author" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Tác giả</a>
      </nav>

      {/* Right: Search, Theme, Notifications, Auth */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        
        {/* Compact Search */}
        <div className="search-bar compact-search" ref={searchRef} style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => { if(searchQuery.trim()) setShowSearch(true); }}
            style={{ width: '180px' }}
          />
          {showSearch && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: '-100px', width: '300px', marginTop: '8px',
              background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px',
              boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(var(--glass-blur))', padding: '8px',
              zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '4px'
            }}>
              {searchResults.map((result, index) => (
                <Link 
                  key={index} to={result.path}
                  onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                  style={{
                    padding: '10px 12px', borderRadius: '8px', color: 'var(--text-primary)',
                    fontSize: '0.9rem', textDecoration: 'none', display: 'block', transition: 'background 0.2s'
                  }}
                  className="search-result-item"
                >
                  {result.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '50%', color: 'var(--text-secondary)', transition: 'background var(--transition)' }} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%' }}>
          <Bell size={20} color="var(--text-secondary)" />
          <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: 'var(--red)', borderRadius: '50%', border: '2px solid var(--bg-secondary)' }}></span>
        </div>

        {currentUser ? (
          <div className="user-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
            <button 
              className="user-avatar-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)', padding: '4px 12px 4px 4px',
                borderRadius: '30px', cursor: 'pointer', transition: 'all var(--transition)'
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 'bold', fontSize: '14px'
              }}>
                {getInitial(currentUser.name)}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hide-on-mobile">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown size={16} color="var(--text-secondary)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-menu" style={{
                position: 'absolute', top: '100%', right: '0', marginTop: '10px',
                width: '240px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                borderRadius: '16px', boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(var(--glass-blur))',
                padding: '8px', zIndex: 100, animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{ padding: '12px', borderBottom: '1px solid var(--border-glass)', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px', wordBreak: 'break-all' }}>{currentUser.email}</div>
                </div>
                <button 
                  onClick={() => { setDropdownOpen(false); navigate('/auth'); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'background 0.2s' }}
                  className="dropdown-item"
                >
                  <UserIcon size={18} /> Hồ sơ của tôi
                </button>
                <button 
                  onClick={() => { setDropdownOpen(false); logout(); navigate('/'); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: '8px', color: 'var(--red)', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', transition: 'background 0.2s' }}
                  className="dropdown-item"
                >
                  <LogOut size={18} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/auth" 
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)',
              color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px',
              fontWeight: '600', fontSize: '0.9rem', transition: 'background var(--transition)',
              border: 'none', cursor: 'pointer'
            }}
          >
            <LogIn size={18} />
            <span className="hide-on-mobile">Đăng nhập</span>
          </Link>
        )}
      </div>
    </header>
  );
}
