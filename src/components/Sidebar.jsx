import { NavLink } from 'react-router-dom';
import { Home, Box, Calculator, Building2, AlignVerticalSpaceAround, Settings, Layers, User as UserIcon } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, currentUser }) {
  const navItems = [
    { path: '/', label: 'Trang chủ', icon: <Home size={20} /> },
    { path: '/engineering-foundations', label: '1. Nền tảng Kỹ thuật', icon: <Box size={20} /> },
    { path: '/parameters', label: '2. Thông số Vật liệu', icon: <Box size={20} /> },
    { path: '/loads-combinations', label: '3. Tải trọng & Tổ hợp', icon: <Calculator size={20} /> },
    { path: '/rc-components', label: '4. BTCT Cấu kiện', icon: <Building2 size={20} /> },
    { path: '/steel-components', label: '5. Cấu kiện Thép', icon: <AlignVerticalSpaceAround size={20} /> },
    { path: '/global-stability', label: '6. Ổn định Tổng thể', icon: <Settings size={20} /> },
    { path: '/geotechnical-foundations', label: '7. Nền móng', icon: <Layers size={20} /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <div className="sidebar-header gradient-text" style={{ padding: '24px', fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-glass)' }}>
          Structural Hub
        </div>
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
            to="/parameters" 
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
              {currentUser.name.charAt(0).toUpperCase()}
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
              padding: '6px 0',
              width: '100%'
            }}
            onClick={() => setIsOpen(false)}
          >
            <div 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px dashed var(--border-glass)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <UserIcon size={16} />
            </div>
            <span>Đăng nhập hệ thống</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
}
