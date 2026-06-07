import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import EngineeringFoundations from './pages/EngineeringFoundations';
import LoadsCombinations from './pages/LoadsCombinations';
import RCComponents from './pages/RCComponents';
import SteelComponents from './pages/SteelComponents';
import GlobalStability from './pages/GlobalStability';
import GeotechnicalFoundations from './pages/GeotechnicalFoundations';
import ParametersDefinitions from './pages/ParametersDefinitions';

import './styles/index.css';
import './styles/layout.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="bg-animation">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        {isSidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        <main className="main-content">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/engineering-foundations" element={<EngineeringFoundations />} />
              <Route path="/loads-combinations" element={<LoadsCombinations />} />
              <Route path="/rc-components" element={<RCComponents />} />
              <Route path="/steel-components" element={<SteelComponents />} />
              <Route path="/global-stability" element={<GlobalStability />} />
              <Route path="/geotechnical-foundations" element={<GeotechnicalFoundations />} />
              <Route path="/parameters" element={<ParametersDefinitions />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
