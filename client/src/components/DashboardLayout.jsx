import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaBars, FaHome, FaBoxOpen, FaClipboardList, 
  FaUsers, FaSignOutAlt, FaSearch, FaCog, FaUserCircle, FaTag 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userProfile } = useAuth();

  const isDarkMode = userProfile?.theme === 'dark';

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: isDarkMode ? '#0F172A' : '#FDFCF0' }}>
      
      {/* SIDEBAR */}
      <aside style={{
        width: isCollapsed ? '80px' : '260px',
        backgroundColor: isDarkMode ? '#111827' : '#F9F1E7',
        borderRight: '1px solid rgba(61, 43, 31, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!isCollapsed && (
            <div>
              <h1 style={{ fontWeight: 900, fontSize: '18px', color: '#3D2B1F', margin: 0 }}>ADMIN PORTAL</h1>
              <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#A89B8D', margin: 0 }}>ROASTLOGIC SYSTEM</p>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaBars size={18} color="#3D2B1F" />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '0 12px' }}>
          <MenuItem 
            icon={<FaHome />} 
            label="Tổng quan" 
            active={location.pathname.includes('/admin/home')} 
            collapsed={isCollapsed} 
            onClick={() => navigate('/admin/home')} 
          />
          <MenuItem 
            icon={<FaBoxOpen />} 
            label="Sản phẩm" 
            active={location.pathname.includes('/admin/products')} 
            collapsed={isCollapsed} 
            onClick={() => navigate('/admin/products')} 
          />
          <MenuItem 
            icon={<FaUsers />} 
            label="Nhà cung cấp" 
            active={location.pathname.includes('/admin/suppliers')} 
            collapsed={isCollapsed} 
            onClick={() => navigate('/admin/suppliers')} 
          />
          <MenuItem 
            icon={<FaTag />} 
            label="Danh mục" 
            active={location.pathname.includes('/admin/categories')} 
            collapsed={isCollapsed} 
            onClick={() => navigate('/admin/categories')} 
          />
          <MenuItem 
            icon={<FaCog />} 
            label="Cài đặt" 
            active={location.pathname.includes('/admin/settings')} 
            collapsed={isCollapsed} 
            onClick={() => navigate('/admin/settings')} 
          />
        </nav>

        <div style={{ padding: '15px' }}>
          <button 
            onClick={() => setShowLogoutModal(true)} 
            style={{ 
              width: '100%', padding: '12px', backgroundColor: '#3D2B1F', 
              color: 'white', borderRadius: '10px', border: 'none', 
              fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' 
            }}
          >
            <FaSignOutAlt /> {!isCollapsed && " ĐĂNG XUẤT"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ 
        flex: 1, 
        marginLeft: isCollapsed ? '80px' : '260px', 
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <header style={{
          backgroundColor: '#F9F1E7',
          padding: '12px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(61, 43, 31, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '20px', fontSize: '12px', fontWeight: 'bold', color: '#A89B8D' }}>
            <span style={{ color: '#3D2B1F' }}>Hệ thống quản trị kho v1.0</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A89B8D' }} />
              <input type="text" placeholder="Tìm kiếm nhanh..." style={{ backgroundColor: '#F4E9DC', border: 'none', borderRadius: '8px', padding: '8px 12px 8px 35px', width: '200px' }} />
            </div>
            <FaUserCircle size={24} color="#3D2B1F" />
          </div>
        </header>

        <section style={{ padding: '30px', flex: 1 }}>
          {children}
        </section>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', maxWidth: '400px', width: '90%', borderRadius: '16px', padding: '30px', textAlign: 'center' }}>
             <h2 style={{ color: '#3D2B1F', marginTop: 0 }}>Bạn muốn đăng xuất?</h2>
             <p style={{ color: '#70645C', fontSize: '14px' }}>Các thay đổi chưa lưu có thể bị mất.</p>
             <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                <button onClick={confirmLogout} style={{ flex: 1, backgroundColor: '#3D2B1F', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ĐỒNG Ý</button>
                <button onClick={() => setShowLogoutModal(false)} style={{ flex: 1, backgroundColor: '#F4E9DC', color: '#3D2B1F', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>HỦY</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, label, active, collapsed, onClick }) => (
  <div 
    onClick={onClick} 
    style={{
        display: 'flex', alignItems: 'center', padding: '12px', marginBottom: '4px', 
        cursor: 'pointer', borderRadius: '10px', transition: 'all 0.2s',
        backgroundColor: active ? '#3D2B1F' : 'transparent', 
        color: active ? '#FFFFFF' : '#3D2B1F', 
        justifyContent: collapsed ? 'center' : 'flex-start'
    }}
  >
    <span style={{ fontSize: '18px', marginRight: collapsed ? '0' : '15px' }}>{icon}</span>
    {!collapsed && <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{label}</span>}
  </div>
);

export default DashboardLayout;