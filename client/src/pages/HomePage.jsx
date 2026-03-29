import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    FaCoffee, FaWarehouse, FaChartLine, FaArrowUp, FaArrowDown,
    FaPlus, FaMinus, FaChartBar, FaRobot, FaExclamationTriangle,
    FaShoppingCart, FaTruck, FaClock, FaUser, FaSignOutAlt,
    FaBars, FaTimes, FaHome, FaBox, FaUsers, FaExchangeAlt, FaFileAlt,
    FaRocket, FaMobileAlt, FaStar, FaLeaf, FaPlane, FaBuilding,
    FaFacebook, FaPhone, FaChevronRight, FaChevronLeft
} from 'react-icons/fa';

// Import Google Fonts (Inter)
const interFont = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
`;

// Main HomePage Component
const HomePage = () => {
    const { userName, logout } = useAuth();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [kpiData, setKpiData] = useState({
        totalStock: 128,
        totalRevenue: 791000000,
        todayInbound: 3.5,
        todayOutbound: 2.3
    });
    const [recentTransactions, setRecentTransactions] = useState([
        { id: 'PN-001', product: 'Robusta Sàng 5', type: 'Nhập', quantity: '1000kg', value: '85tr', time: 'Hôm nay' },
        { id: 'XX-001', product: 'Arabica Cầu Đất', type: 'Xuất', quantity: '200kg', value: '50tr', time: 'Hôm nay' },
        { id: 'PN-002', product: 'Robusta Culi', type: 'Nhập', quantity: '800kg', value: '72tr', time: 'Hôm qua' },
        { id: 'XX-002', product: 'Cà phê Rang Xay', type: 'Xuất', quantity: '150kg', value: '30tr', time: 'Hôm qua' },
        { id: 'PN-003', product: 'Arabica Moka', type: 'Nhập', quantity: '300kg', value: '45tr', time: '2 ngày' }
    ]);

    // AI Features Carousel
    const aiFeatures = [
        { icon: <FaRobot />, title: "🤖 AI cảnh báo", desc: "Arabica sắp hết! Đặt hàng ngay" },
        { icon: <FaMobileAlt />, title: "📱 Mobile PWA", desc: "Quản lý mọi lúc mọi nơi" },
        { icon: <FaRocket />, title: "⚡ Phê duyệt 1-click", desc: "Xuất hàng siêu tốc" }
    ];

    // Quick actions
    const quickActions = [
        { label: '➕ Nhập Robusta', icon: <FaPlus />, path: '/transactions/inbound', color: '#F97316' },
        { label: '➖ Xuất Arabica', icon: <FaMinus />, path: '/transactions/outbound', color: '#F97316' },
        { label: '📊 Dashboard', icon: <FaChartBar />, path: '/reports', color: '#F97316' },
        { label: '💬 Chat AI', icon: <FaRobot />, path: '/ai', color: '#F97316' }
    ];

    // Navigation items
    const navItems = [
        { label: 'Trang chủ', path: '/', icon: <FaHome /> },
        { label: 'Sản phẩm', path: '/products', icon: <FaBox /> },
        { label: 'Giao dịch', path: '/transactions', icon: <FaExchangeAlt /> },
        { label: 'Báo cáo', path: '/reports', icon: <FaFileAlt /> },
        { label: 'AI', path: '/ai', icon: <FaRobot /> }
    ];

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format number with unit
    const formatNumber = (num, unit = '') => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M${unit}`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(0)}K${unit}`;
        }
        return `${num}${unit}`;
    };

    // Auto slide carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % aiFeatures.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {/* Inject Google Fonts */}
            <style>{interFont}</style>

            <div style={{
                fontFamily: 'Inter, sans-serif',
                minHeight: '100vh',
                backgroundColor: '#FEF7DC',
                color: '#1F2937'
            }}>

                {/* 1. NAVBAR TOP */}

                {/* 2. HERO SECTION */}
                <section style={{
                    position: 'relative',
                    height: '600px',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1559056199-641a0ac8b55e?fit=crop&w=1200&h=600")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    overflow: 'hidden'
                }}>
                    {/* Gradient Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.85) 0%, rgba(252, 211, 77, 0.9) 100%)'
                    }}></div>

                    {/* Content */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        maxWidth: '800px',
                        padding: '2rem'
                    }}>
                        <h1 style={{
                            fontSize: '3.5rem',
                            fontWeight: '800',
                            marginBottom: '1rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            lineHeight: '1.1'
                        }}>
                            KHO CAFE THÔNG MINH<br />
                            <span style={{ color: '#FCD34D' }}>BUÔN MÊ THUỘT</span>
                        </h1>
                        <p style={{
                            fontSize: '1.3rem',
                            marginBottom: '2rem',
                            opacity: 0.95,
                            lineHeight: '1.6'
                        }}>
                            AI cảnh báo tồn kho • Dashboard realtime<br />
                            Mobile PWA • Tiết kiệm 400tr/năm
                        </p>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/products')}
                                style={{
                                    background: '#F97316',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    borderRadius: '50px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                <FaRocket />
                                🚀 Bắt đầu
                            </button>
                            <button
                                onClick={() => navigate('/reports')}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    border: '2px solid white',
                                    padding: '1rem 2rem',
                                    borderRadius: '50px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                            >
                                <FaMobileAlt />
                                📱 Demo Mobile
                            </button>
                        </div>
                    </div>
                </section>

                {/* 3. GIá»šI THIá»†U CÃ€ PHÃŠ */}
                <section style={{ padding: '4rem 2rem', background: 'white' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#1F2937',
                            marginBottom: '3rem'
                        }}>
                            🌟 CÀ PHÊ ĐẮK LẮK CHẤT LƯỢNG CAO
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: '2rem'
                        }}>
                            {/* Card 1 */}
                            <div style={{
                                background: 'white',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                border: '1px solid #F3F4F6'
                            }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-10px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    height: '200px',
                                    backgroundImage: 'url("https://images.unsplash.com/photo-1509042239860-f550ce710b93?fit=crop&w=400&h=200")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}></div>
                                <div style={{ padding: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: '#F97316',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <FaLeaf />
                                        CÀ PHÊ ĐẮK LẮK
                                    </h3>
                                    <p style={{
                                        color: '#6B7280',
                                        lineHeight: '1.6',
                                        fontSize: '1rem'
                                    }}>
                                        #1 Robusta thế giới từ vùng đất đỏ bazan<br />
                                        Hương vị đậm đà, chất lượng vượt trội
                                    </p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div style={{
                                background: 'white',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                border: '1px solid #F3F4F6'
                            }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-10px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    height: '200px',
                                    backgroundImage: 'url("https://images.unsplash.com/photo-1559056199-641a0ac8b55e?fit=crop&w=400&h=200")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}></div>
                                <div style={{ padding: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: '#F97316',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <FaPlane />
                                        XUẤT KHẨU NHẬT/ĐƯỢC
                                    </h3>
                                    <p style={{
                                        color: '#6B7280',
                                        lineHeight: '1.6',
                                        fontSize: '1rem'
                                    }}>
                                        Giá FOB 120k/kg<br />
                                        Xuất khẩu trực tiếp đến thị trường quốc tế
                                    </p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div style={{
                                background: 'white',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                border: '1px solid #F3F4F6'
                            }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-10px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    height: '200px',
                                    backgroundImage: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?fit=crop&w=400&h=200")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}></div>
                                <div style={{ padding: '2rem' }}>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        color: '#F97316',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <FaBuilding />
                                        KHO 500 TẤN
                                    </h3>
                                    <p style={{
                                        color: '#6B7280',
                                        lineHeight: '1.6',
                                        fontSize: '1rem'
                                    }}>
                                        Buôn Ma Thuột<br />
                                        Kho bãi hiện đại, bảo quản chuyên nghiệp
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. KPI LIVE */}
                <section style={{
                    padding: '4rem 2rem',
                    background: 'linear-gradient(135deg, #F97316 0%, #FCD34D 100%)'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: '3rem',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            ☕ TINH HOA CÀ PHÊ VIỆT
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {[
                                {
                                    title: 'Hương Vị Robusta',
                                    img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=500&auto=format&fit=crop',
                                    desc: 'Đậm đà, mạnh mẽ từ thủ phủ Buôn Ma Thuột.'
                                },
                                {
                                    title: 'Tuyệt Phẩm Arabica',
                                    img: 'https://images.unsplash.com/photo-1506372023823-741c83b836fe?q=80&w=500&auto=format&fit=crop',
                                    desc: 'Hương thơm thanh tao, vị chua nhẹ từ Cầu Đất.'
                                },
                                {
                                    title: 'Nghệ Thuật Rang Xay',
                                    img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=500&auto=format&fit=crop',
                                    desc: 'Giữ trọn linh hồn hạt cà phê qua từng nhiệt độ.'
                                }
                            ].map((item, index) => {
                                return (
                                    <div key={index} style={{
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '25px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                            <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: '700' }}>
                                                {item.title}
                                            </h3>
                                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: '1.4', margin: 0 }}>
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 5. AI FEATURES CAROUSEL */}
                <section style={{ padding: '4rem 2rem', background: 'white' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#1F2937',
                            marginBottom: '3rem'
                        }}>
                            🤖 TÍNH NĂNG AI THÔNG MINH
                        </h2>

                        <div style={{
                            position: 'relative',
                            height: '300px',
                            overflow: 'hidden',
                            borderRadius: '20px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                        }}>
                            {aiFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: `linear-gradient(135deg, ${index === 0 ? '#F97316' : index === 1 ? '#FCD34D' : '#10B981'} 0%, #FEF7DC 100%)`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '2rem',
                                        transform: `translateX(${(index - currentSlide) * 100}%)`,
                                        transition: 'transform 0.5s ease',
                                        opacity: index === currentSlide ? 1 : 0.7
                                    }}
                                >
                                    <div style={{
                                        fontSize: '4rem',
                                        marginBottom: '1rem',
                                        opacity: 0.9
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.8rem',
                                        fontWeight: '700',
                                        color: '#1F2937',
                                        marginBottom: '1rem'
                                    }}>
                                        {feature.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '1.2rem',
                                        color: '#6B7280',
                                        textAlign: 'center',
                                        lineHeight: '1.6'
                                    }}>
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}

                            {/* Navigation Dots */}
                            <div style={{
                                position: 'absolute',
                                bottom: '1rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                {aiFeatures.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            background: index === currentSlide ? '#F97316' : '#D1D5DB',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s ease'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. QUICK ACTIONS */}
                <section style={{ padding: '4rem 2rem', background: '#FEF7DC' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#1F2937',
                            marginBottom: '3rem'
                        }}>
                            ⚡ HÀNH ĐỘNG NHANH
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '2rem'
                        }}>
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(action.path)}
                                    style={{
                                        background: 'white',
                                        border: 'none',
                                        borderRadius: '20px',
                                        padding: '2rem',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s ease',

                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-8px)';
                                        e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                                        e.target.style.borderColor = '#F97316';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                                        e.target.style.borderColor = 'transparent';
                                    }}
                                >
                                    <div style={{
                                        fontSize: '3rem',
                                        marginBottom: '1rem',
                                        color: '#F97316'
                                    }}>
                                        {action.icon}
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: '600',
                                        color: '#1F2937',
                                        margin: 0
                                    }}>
                                        {action.label}
                                    </h3>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. RECENT ACTIVITY */}
                <section style={{ padding: '4rem 2rem', background: 'white' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#1F2937',
                            marginBottom: '3rem'
                        }}>
                            📋 HOẠT ĐỘNG GẦN ĐÂY
                        </h2>

                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            border: '1px solid #F3F4F6'
                        }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}>
                                <thead>
                                    <tr style={{
                                        background: 'linear-gradient(135deg, #F97316 0%, #FCD34D 100%)',
                                        color: 'white'
                                    }}>
                                        <th style={{ padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '600' }}>Mã GD</th>
                                        <th style={{ padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '600' }}>Sản phẩm</th>
                                        <th style={{ padding: '1.5rem 1rem', textAlign: 'left', fontWeight: '600' }}>Loại</th>
                                        <th style={{ padding: '1.5rem 1rem', textAlign: 'right', fontWeight: '600' }}>Số lượng</th>
                                        <th style={{ padding: '1.5rem 1rem', textAlign: 'right', fontWeight: '600' }}>Giá trị</th>
                                        <th style={{ padding: '1.5rem 1rem', textAlign: 'center', fontWeight: '600' }}>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map((tx, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                borderBottom: index < recentTransactions.length - 1 ? '1px solid #F3F4F6' : 'none',
                                                transition: 'background 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.closest('tr').style.background = '#FEF7DC'}
                                            onMouseLeave={(e) => e.target.closest('tr').style.background = 'white'}
                                        >
                                            <td style={{ padding: '1.2rem 1rem', fontWeight: '600', color: '#F97316' }}>{tx.id}</td>
                                            <td style={{ padding: '1.2rem 1rem', color: '#1F2937' }}>{tx.product}</td>
                                            <td style={{ padding: '1.2rem 1rem' }}>
                                                <span style={{
                                                    background: tx.type === 'Nháº­p' ? '#10B981' : '#EF4444',
                                                    color: 'white',
                                                    padding: '0.3rem 0.8rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600'
                                                }}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem 1rem', textAlign: 'right', fontWeight: '600' }}>{tx.quantity}</td>
                                            <td style={{ padding: '1.2rem 1rem', textAlign: 'right', fontWeight: '600', color: '#F97316' }}>{tx.value}</td>
                                            <td style={{ padding: '1.2rem 1rem', textAlign: 'center', color: '#6B7280' }}>{tx.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 8. FOOTER */}
                <footer style={{
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                    color: 'white',
                    padding: '3rem 2rem 2rem',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            color: '#F97316'
                        }}>
                            <FaCoffee style={{ fontSize: '2.5rem' }} />
                            <span>Kho CAFE AI</span>
                        </div>

                        <p style={{
                            fontSize: '1.1rem',
                            opacity: 0.9,
                            marginBottom: '2rem',
                            lineHeight: '1.6'
                        }}>
                            © 2026 Kho CAFE AI - Buôn Ma Thuột<br />
                            Quản lý kho thông minh cho ngành cà phê Việt Nam
                        </p>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2rem',
                            marginBottom: '2rem'
                        }}>
                            <a href="#" style={{
                                color: 'white',
                                fontSize: '1.5rem',
                                transition: 'color 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.color = '#F97316'}
                                onMouseLeave={(e) => e.target.style.color = 'white'}
                            >
                                <FaFacebook />
                            </a>
                            <a href="#" style={{
                                color: 'white',
                                fontSize: '1.5rem',
                                transition: 'color 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.target.style.color = '#F97316'}
                                onMouseLeave={(e) => e.target.style.color = 'white'}
                            >
                                <FaPhone />
                            </a>
                        </div>

                        <div style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            paddingTop: '2rem',
                            fontSize: '0.9rem',
                            opacity: 0.7
                        }}>
                            Hotline: 1900 XXX XXX | Email: info@khoceai.vn
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
};

export default HomePage;
