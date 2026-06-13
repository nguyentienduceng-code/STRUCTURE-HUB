import { NavLink } from 'react-router-dom';
import { Home, Sliders, Calculator, Map, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import IBeamIcon from './icons/IBeamIcon';
import ConcreteIcon from './icons/ConcreteIcon';
import CompassRulerIcon from './icons/CompassRulerIcon';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { currentUser } = useAuth();
  const navItems = [
    { path: '/', label: 'Trang chủ', icon: <Home size={20} /> },
    { path: '/engineering-foundations', label: '1. Nền tảng Kỹ thuật', icon: <CompassRulerIcon size={20} /> },
    { path: '/parameters', label: '2. Thông số Vật liệu', icon: <Sliders size={20} /> },
    { path: '/loads-combinations', label: '3. Tải trọng & Tổ hợp', icon: <Calculator size={20} /> },
    { path: '/rc-components', label: '4. BTCT Cấu kiện', icon: <ConcreteIcon size={20} /> },
    { path: '/steel-components', label: '5. Cấu kiện Thép', icon: <IBeamIcon size={20} /> },
    { path: '/global-stability', label: '6. Ổn định Tổng thể', icon: <Layers size={20} /> },
    { path: '/geotechnical-foundations', label: '7. Nền móng', icon: <Map size={20} /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '20px' }}>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer Account Section */}
      <div 
        style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid var(--border-glass)', 
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        {currentUser ? (
          <NavLink 
            to="/auth" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              textDecoration: 'none', 
              color: 'var(--text-primary)',
              width: '100%',
              overflow: 'hidden'
            }}
            onClick={() => setIsOpen(false)}
          >
            <div 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'var(--accent-gradient)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                flexShrink: 0
              }}
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.email}
              </span>
            </div>
          </NavLink>
        ) : (
          <NavLink 
            to="/auth" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              textDecoration: 'none', 
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: '600',
              transition: 'color var(--transition)'
            }}
            onClick={() => setIsOpen(false)}
          >
            Đăng nhập hệ thống
          </NavLink>
        )}
      </div>
    </aside>
  );
}
