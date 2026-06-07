import { NavLink } from 'react-router-dom';
import { Home, Box, Calculator, Building2, AlignVerticalSpaceAround, Settings, Layers } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
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
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
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
    </aside>
  );
}
