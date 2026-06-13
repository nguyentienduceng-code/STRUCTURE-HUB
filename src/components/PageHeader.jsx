import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PageHeader({ 
  title, 
  breadcrumbText, 
  descriptionTitle, 
  descriptionIcon: Icon, 
  description 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="page-header-container">
      <h1 className="page-title">{title}</h1>
      
      <div className="breadcrumb" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '-16px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Trang chủ</a>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{breadcrumbText || title}</span>
      </div>

      <div className="card page-description-card" style={{ 
        marginBottom: '32px', 
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(102,126,234,0.1) 100%)', 
        border: '1px solid rgba(139,92,246,0.3)', 
        boxShadow: '0 0 30px rgba(139,92,246,0.15)',
        position: 'relative'
      }}>
        <h2 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {Icon && <Icon size={24} color="var(--accent-primary)" />}
          <span className="gradient-text">{descriptionTitle}</span>
        </h2>
        
        <div style={{ position: 'relative' }}>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.05rem', 
            lineHeight: 1.6, 
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: isExpanded ? 'unset' : '3',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {description}
          </p>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '12px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {isExpanded ? (
              <>Thu gọn <ChevronUp size={16} /></>
            ) : (
              <>Xem thêm <ChevronDown size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
