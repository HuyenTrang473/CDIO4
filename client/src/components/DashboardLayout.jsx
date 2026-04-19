import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDataRefresh } from '../context/DataRefreshContext'; // Quan trọng để nhảy số thực tế
import axios from 'axios';
import {
    FaCoffee, FaHome, FaBox, FaUsers, FaArrowUp, FaArrowDown,
    FaFileAlt, FaRobot, FaUser, FaSignOutAlt, FaBars, FaTimes,
    FaDatabase, FaMoneyBillWave, FaChartLine, FaExclamationCircle, FaCheckCircle, FaServer, FaBuilding, FaUserTie
} from 'react-icons/fa';
import AIAssistantWidget from './AIAssistantWidget';
import UserProfileModal from './UserProfileModal';

const interFont = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
`;

const DashboardLayout = ({ children }) => {
    const { userName, logout, token } = useAuth();
    const { refreshKey } = useDataRefresh(); // Lắng nghe sự thay đổi dữ liệu toàn hệ thống
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // States cho dữ liệu thực tế
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showQuickStats, setShowQuickStats] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [navStats, setNavStats] = useState({
        totalStock: 0,
        totalRevenue: 0,
        todayIn: 0,
        todayOut: 0
    });

    // 1. FETCH DỮ LIỆU THỰC TẾ TỪ BACKEND
    useEffect(() => {
        const fetchNavStats = async () => {
            try {
                // Gọi API dashboard đã tạo ở server
                const res = await axios.get('/api/dashboard/kpi', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    const { totalWeight, totalValue, todayIn, todayOut } = res.data.data;
                    setNavStats({
                        totalStock: totalWeight || 0,
                        totalRevenue: (totalValue / 1000000).toFixed(1) || 0, // Quy đổi sang triệu (Mtr)
                        todayIn: todayIn || 0,
                        todayOut: todayOut || 0
                    });
                }
            } catch (err) {
                console.error("Lỗi cập nhật KPI thực tế:", err);
            }
        };

        if (token) fetchNavStats();
    }, [token, location.pathname, refreshKey]); // Tự động load lại khi đổi trang hoặc có giao dịch mới

    // 2. XỬ LÝ ĐÓNG DROPDOWN KHI CLICK NGOÀI
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowQuickStats(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { path: '/', label: 'Trang chủ', icon: <FaHome /> },
        { path: '/products', label: 'Sản phẩm', icon: <FaBox /> },
        { path: '/suppliers', label: 'Nhà cung cấp', icon: <FaUsers /> },
        { path: '/transactions/inbound', label: 'Nhập kho', icon: <FaArrowUp /> },
        { path: '/transactions/outbound', label: 'Xuất kho', icon: <FaArrowDown /> },
        { path: '/reports', label: 'Báo cáo', icon: <FaFileAlt /> },
        { path: '/reports/export', label: 'Xuất Excel', icon: <FaFileAlt /> },
        { path: '/ai', label: 'AI', icon: <FaRobot /> },
        { path: '/admin/approvals', label: 'Phê Duyệt', icon: <FaCheckCircle /> },
        { path: '/admin/users', label: 'Quản Lý User', icon: <FaUser /> },
        { path: '/admin/monitoring', label: 'Giám Sát', icon: <FaServer /> },
        { path: '/supplier/portal', label: 'NCC Portal', icon: <FaBuilding /> }
    ];

    return (
        <>
            <style>{interFont}</style>
            <div style={{ minHeight: '100vh', backgroundColor: '#FEF3C7' }}>
                
                {/* --- THANH NAVBAR --- */}
                <nav style={styles.navbar}>
                    {/* Logo & Tên hệ thống */}
                    <div style={styles.logo} onClick={() => navigate('/')}>
                        <FaCoffee style={{ fontSize: '1.8rem' }} />
                        <span style={{ display: window.innerWidth < 1024 ? 'none' : 'block' }}>Kho Cà Phê</span>
                    </div>

                    {/* 🚀 CHỨC NĂNG GIÁM SÁT KPI NHANH (GIỮA NAV) */}
                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <button 
                            onClick={() => setShowQuickStats(!showQuickStats)}
                            style={{
                                ...styles.kpiToggle,
                                borderColor: navStats.totalStock > 150 ? '#ef4444' : '#D97706',
                                boxShadow: showQuickStats ? '0 0 15px rgba(217, 119, 6, 0.2)' : 'none'
                            }}
                        >
                            <div style={styles.kpiItem}>
                                <FaDatabase style={{ color: '#D97706' }} />
                                <span>{navStats.totalStock} Tấn</span>
                            </div>
                            <div style={styles.divider}></div>
                            <div style={styles.kpiItem}>
                                <FaMoneyBillWave style={{ color: '#10B981' }} />
                                <span>{navStats.totalRevenue} M</span>
                            </div>
                            <FaChartLine style={{ marginLeft: '5px', color: '#92400E', fontSize: '0.8rem' }} />
                        </button>

                        {/* Bảng chi tiết Dropdown */}
                        {showQuickStats && (
                            <div style={styles.dropdown}>
                                <h4 style={styles.dropdownTitle}>Giám sát thời gian thực</h4>
                                <div style={styles.dropdownRow}>
                                    <span>Nhập hôm nay:</span>
                                    <b style={{ color: '#10B981' }}>+{navStats.todayIn}t</b>
                                </div>
                                <div style={styles.dropdownRow}>
                                    <span>Xuất hôm nay:</span>
                                    <b style={{ color: '#ef4444' }}>-{navStats.todayOut}t</b>
                                </div>
                                
                                {navStats.totalStock > 150 && (
                                    <div style={styles.warningBox}>
                                        <FaExclamationCircle /> Cảnh báo: Kho sắp đầy!
                                    </div>
                                )}

                                <button 
                                    onClick={() => {navigate('/reports'); setShowQuickStats(false)}} 
                                    style={styles.viewMoreBtn}
                                >
                                    Xem chi tiết báo cáo
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Menu Điều hướng Desktop */}
                    <div style={styles.navLinks}>
                        {navItems.map(item => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                style={{
                                    ...styles.navButton,
                                    backgroundColor: location.pathname === item.path ? '#D97706' : 'transparent',
                                    color: location.pathname === item.path ? 'white' : '#4b5563'
                                }}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Khu vực Người dùng */}
                    <div style={styles.userArea}>
                        <div style={{...styles.userBadge, cursor: 'pointer'}} onClick={() => setShowProfileModal(true)}>
                            <FaUser /> <span>{userName || 'Owner'}</span>
                        </div>
                        <button 
                            onClick={() => navigate('/vendor/login')} 
                            style={{
                                ...styles.logoutBtn,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white'
                            }} 
                            title="Vendor Portal"
                        >
                            <FaUserTie />
                        </button>
                        <button onClick={logout} style={styles.logoutBtn} title="Đăng xuất">
                            <FaSignOutAlt />
                        </button>
                    </div>
                </nav>

                {/* User Profile Modal */}
                <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

                {/* --- NỘI DUNG CHÍNH --- */}
                <div style={styles.mainContainer}>
                    <main>{children}</main>
                </div>

                {/* Widget AI nổi */}
                <AIAssistantWidget />
            </div>
        </>
    );
};

// --- HỆ THỐNG STYLES ---
const styles = {
    navbar: {
        position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'white',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '0 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        height: '75px', width: '100%', boxSizing: 'border-box'
    },
    logo: {
        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem',
        fontWeight: '800', color: '#D97706', cursor: 'pointer'
    },
    kpiToggle: {
        display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#FFFBEB',
        padding: '8px 16px', borderRadius: '15px', border: '2px solid',
        cursor: 'pointer', outline: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    kpiItem: {
        display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem',
        fontWeight: '700', color: '#92400E'
    },
    divider: { width: '1px', height: '18px', backgroundColor: '#FDE68A' },
    dropdown: {
        position: 'absolute', top: '65px', left: '50%', transform: 'translateX(-50%)',
        width: '240px', backgroundColor: 'white', borderRadius: '14px', padding: '18px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '1px solid #e5e7eb',
        animation: 'fadeIn 0.2s ease-out'
    },
    dropdownTitle: { margin: '0 0 15px 0', fontSize: '0.95rem', color: '#92400E', borderBottom: '1.5px solid #f3f4f6', paddingBottom: '8px' },
    dropdownRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px' },
    warningBox: { display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '8px', padding: '5px', backgroundColor: '#fee2e2', borderRadius: '5px' },
    viewMoreBtn: {
        width: '100%', padding: '10px', marginTop: '12px', backgroundColor: '#D97706',
        color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600'
    },
    navLinks: { display: 'flex', gap: '0.6rem', alignItems: 'center' },
    navButton: {
        padding: '10px 14px', border: 'none', borderRadius: '10px', cursor: 'pointer',
        fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', transition: 'all 0.2s'
    },
    userArea: { display: 'flex', alignItems: 'center', gap: '12px' },
    userBadge: {
        display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#92400E',
        color: 'white', padding: '8px 14px', borderRadius: '25px', fontSize: '0.8rem', fontWeight: '500'
    },
    logoutBtn: {
        padding: '10px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none',
        borderRadius: '10px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', transition: '0.2s'
    },
    mainContainer: { width: '100%', padding: '2rem', boxSizing: 'border-box' }
};

export default DashboardLayout;