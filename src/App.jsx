import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Skeleton from './components/Skeleton';
import { AuthProvider } from './context/AuthContext';

// Lazy loading tất cả 10 routes (Home + 7 chuyên đề nền tảng + Calculators + Auth)
const Home = lazy(() => import('./pages/Home'));
const EngineeringFoundations = lazy(() => import('./pages/EngineeringFoundations'));
const LoadsCombinations = lazy(() => import('./pages/LoadsCombinations'));
const RCComponents = lazy(() => import('./pages/RCComponents'));
const SteelComponents = lazy(() => import('./pages/SteelComponents'));
const GlobalStability = lazy(() => import('./pages/GlobalStability'));
const GeotechnicalFoundations = lazy(() => import('./pages/GeotechnicalFoundations'));
const ParametersDefinitions = lazy(() => import('./pages/ParametersDefinitions'));
const InteractiveCalculators = lazy(() => import('./pages/InteractiveCalculators'));
const Auth = lazy(() => import('./pages/Auth'));

function PageFallback() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Skeleton height="38px" width="40%" borderRadius="8px" />
      <Skeleton height="20px" width="70%" borderRadius="6px" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
        <Skeleton height="150px" borderRadius="12px" />
        <Skeleton height="150px" borderRadius="12px" />
        <Skeleton height="150px" borderRadius="12px" />
      </div>
      <Skeleton height="320px" width="100%" borderRadius="12px" style={{ marginTop: '1rem' }} />
    </div>
  );
}

import './styles/index.css';
import './styles/layout.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Theme state: default to 'dark' if no preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'dark';
  });

  // Apply theme to document body and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  // Global Formula Copy functionality
  useEffect(() => {
    const handleCopy = (e) => {
      const btn = e.target.closest('.copy-btn');
      if (!btn) return;
      
      const container = btn.parentElement;
      const clone = container.cloneNode(true);
      const btnClone = clone.querySelector('.copy-btn');
      if (btnClone) btnClone.remove();
      
      let text = clone.innerText.trim();
      text = text.replace(/\n/g, ' '); 
      
      navigator.clipboard.writeText(text);
      
      const svg = btn.querySelector('svg');
      const originalHtml = svg.innerHTML;
      svg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>'; 
      setTimeout(() => {
        svg.innerHTML = originalHtml;
      }, 2000);
    };

    const observer = new MutationObserver(() => {
      const formulas = document.querySelectorAll('div[style*="Cambria Math"]:not(.has-copy-btn), .formula-card:not(.has-copy-btn)');
      formulas.forEach(f => {
        f.classList.add('has-copy-btn');
        if (window.getComputedStyle(f).position === 'static') {
          f.style.position = 'relative';
        }
        
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.title = 'Copy formula';
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        btn.style.cssText = 'position: absolute; top: 4px; right: 4px; background: rgba(128,128,128,0.15); border: 1px solid var(--border-glass); cursor: pointer; color: var(--text-secondary); padding: 4px; border-radius: 4px; opacity: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; z-index: 10;';
        
        f.addEventListener('mouseenter', () => btn.style.opacity = '1');
        f.addEventListener('mouseleave', () => btn.style.opacity = '0');
        
        btn.addEventListener('mouseenter', () => btn.style.color = 'var(--text-primary)');
        btn.addEventListener('mouseleave', () => btn.style.color = 'var(--text-secondary)');
        
        f.appendChild(btn);
      });
    });

    document.addEventListener('click', handleCopy);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('click', handleCopy);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthProvider>
      <Router>
      {theme === 'light' && (
        <div className="bg-animation">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        </div>
      )}
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        {isSidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        <main className="main-content">
          <Header 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            theme={theme}
            toggleTheme={toggleTheme}
          />
          <div className="page-content">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/engineering-foundations" element={<EngineeringFoundations />} />
                <Route path="/loads-combinations" element={<LoadsCombinations />} />
                <Route path="/rc-components" element={<RCComponents />} />
                <Route path="/steel-components" element={<SteelComponents />} />
                <Route path="/global-stability" element={<GlobalStability />} />
                <Route path="/geotechnical-foundations" element={<GeotechnicalFoundations />} />
                <Route path="/parameters" element={<ParametersDefinitions />} />
                <Route path="/calculators" element={<InteractiveCalculators />} />
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </Router>
  </AuthProvider>
  );
}

export default App;
