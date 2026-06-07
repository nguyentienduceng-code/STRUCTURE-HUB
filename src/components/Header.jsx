import { Search, Bell, Menu } from 'lucide-react';

export default function Header({ toggleSidebar }) {
  return (
    <header className="header">
      <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle Navigation">
        <Menu size={24} color="var(--text-primary)" />
      </button>

      <div className="search-bar">
        <Search size={18} color="var(--text-secondary)" />
        <input type="text" placeholder="Tìm kiếm tiêu chuẩn, công thức..." />
      </div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Bell size={20} color="var(--text-secondary)" />
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: 'var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-primary)' }}></span>
        </div>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', boxShadow: '0 0 15px rgba(102,126,234,0.4)' }}></div>
      </div>
    </header>
  );
}
