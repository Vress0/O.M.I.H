import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: '首頁', icon: '🏠' },
    { path: '/symptoms', label: '症狀輸入', icon: '🩺' },
    { path: '/assistant', label: 'AI 小助理', icon: '🤖' },
    { path: '/constitution', label: '體質測驗', icon: '🧘' },
    { path: '/doctors', label: '醫師推薦', icon: '👨‍⚕️' },
    { path: '/knowledge', label: '知識庫', icon: '📚' }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo 區域 */}
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🏥</span>
            <span className="brand-text">O.M.I.H</span>
            <span className="brand-subtitle">中醫智慧健康平台</span>
          </Link>
        </div>

        {/* 桌面版導航選單 */}
        <div className="nav-menu">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 用戶選單區域 */}
        <div className="nav-user">
          <div className="user-profile">
            <span className="user-icon">👤</span>
            <span className="user-text">訪客</span>
          </div>
        </div>

        {/* 手機版選單按鈕 */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* 手機版選單 */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-text">{item.label}</span>
            </Link>
          ))}
          
          <div className="mobile-user-section">
            <div className="mobile-user-profile">
              <span className="mobile-user-icon">👤</span>
              <span className="mobile-user-text">訪客模式</span>
            </div>
          </div>
        </div>
      </div>

      {/* 手機版選單背景遮罩 */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default NavBar;