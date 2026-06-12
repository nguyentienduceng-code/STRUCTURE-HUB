import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CollapsibleSection({ title, children, defaultOpen = false, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-card">
      <button 
        className={`collapsible-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="collapsible-title">
          {Icon && <Icon size={20} className="collapsible-icon" />}
          <h3>{title}</h3>
        </div>
        <div className={`chevron-container ${isOpen ? 'open' : ''}`}>
          <ChevronDown size={24} className="collapsible-chevron" />
        </div>
      </button>
      
      <div className={`collapsible-content-wrapper ${isOpen ? 'open' : ''}`}>
        <div className="collapsible-content-inner">
          <div className="card-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
