import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Sun, Moon, LogIn, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

export default function Header({ toggleSidebar, theme, toggleTheme, currentUser, onLogout }) {
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

  // Get user initial for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <header className="header">
      <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle Navigation">
        <Menu size={24} color="var(--text-primary)" />
      </button>

      <div className="search-bar">
        <Search size={18} color="var(--text-secondary)" />
        <input type="text" placeholder="Tìm kiếm tiêu chuẩn, công thức..." />
      </div>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button 
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            color: 'var(--text-secondary)',
            transition: 'background var(--transition)'
          }}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%' }}>
          <Bell size={20} color="var(--text-secondary)" />
          <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: 'var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-primary)' }}></span>
        </div>

        {/* Auth profile avatar or login button */}
        {currentUser ? (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                padding: '4px 8px',
                borderRadius: '20px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'all 0.2s ease'
              }}
              className="user-profile-toggle"
            >
              <div 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-gradient)', 
                  boxShadow: '0 0 10px rgba(102,126,234,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
              >
                {getInitial(currentUser.name)}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="header-username">
                {currentUser.name.split(' ').pop()}
              </span>
              <ChevronDown size={14} color="var(--text-secondary)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {dropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '220px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-glow)',
                  backdropFilter: 'blur(var(--glass-blur))',
                  padding: '12px 8px',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ padding: '8px 12px 10px 12px', borderBottom: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    {currentUser.email}
                  </div>
                </div>

                <Link 
                  to="/parameters" 
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.88rem',
                    transition: 'all 0.2s ease',
                    marginTop: '6px'
                  }}
                  className="dropdown-item"
                >
                  <UserIcon size={16} />
                  <span>Trang cá nhân</span>
                </Link>

                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                    navigate('/');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: 'var(--red)',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s ease'
                  }}
                  className="dropdown-item-logout"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/auth"
            style={{
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            className="header-login-btn"
          >
            <LogIn size={16} />
            <span>Đăng nhập</span>
          </Link>
        )}
      </div>
      
      <style>{`
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary) !important;
        }
        .dropdown-item-logout:hover {
          background: rgba(239, 68, 68, 0.08);
        }
        .header-login-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(79, 70, 229, 0.35);
        }
        @media (max-width: 480px) {
          .header-username {
            display: none;
          }
          .user-profile-toggle {
            padding: 4px;
          }
        }
      `}</style>
    </header>
  );
}
