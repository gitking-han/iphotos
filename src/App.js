import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhotoState from './context/PhotoState';
import Sidebar from './components/sidebar';
import Gallery from './components/gallery';
import Upload from './components/upload';
import About from './components/about';
import Login from './components/login';
import Signup from './components/signup';
import './App.css';
import './sidebar.css';
import '@coreui/icons/css/all.min.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <PhotoState>
      <Router>
        <div className='container-fluid'>
          {/* Mobile Toggle Button */}
        <button className="btn btn-primary m-2 d-md-none" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        {/* Sidebar with responsive class */}
        <div className={`sidebar-wrapper ${sidebarOpen ? 'active' : ''} d-md-block`}>
          <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="sidebar-overlay d-md-none" onClick={handleCloseSidebar}></div>
        )}

        {/* Main Content */}
        <div className="flex-grow-1 content">
          <Routes>
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/" element={<About />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
        </div>
      </Router>
    </PhotoState>
  );
}
export default App;