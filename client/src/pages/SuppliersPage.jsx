import React from 'react';
import { 
    FaThLarge, FaWarehouse, FaCogs, FaCoffee, FaClipboardList, 
    FaTruck, FaUsers, FaChartBar, FaBrain, FaPlus, FaSearch, 
    FaBell, FaCog, FaMapMarkerAlt, FaStar, FaPhoneAlt, FaEnvelope 
} from 'react-icons/fa';

const SuppliersPage = () => {
    return (
        <div style={styles.container}>
            {/* 1. SIDEBAR DỌC (Giữ nguyên từ HomePage) */}
            <aside style={styles.sidebar}>
                <div style={styles.brandSection}>
                    <h2 style={styles.brandTitle}>Admin Portal</h2>
                    <p style={styles.brandSub}>EDITORIAL ESTATE</p>
                </div>
                <nav style={styles.navMenu}>
                    <NavItem icon={<FaThLarge />} label="Tổng quan" />
                    <NavItem icon={<FaWarehouse />} label="Kho hàng" />
                    <NavItem icon={<FaCogs />} label="Chế biến" />
                    <NavItem icon={<FaCoffee />} label="Sản phẩm" />
                    <NavItem icon={<FaClipboardList />} label="Đơn hàng" />
                    <NavItem icon={<FaTruck />} label="Nhà cung cấp" active />
                    <NavItem icon={<FaUsers />} label="Khách hàng" />
                    <NavItem icon={<FaChartBar />} label="Báo cáo" />
                    <NavItem icon={<FaBrain />} label="AI Insights" />
                </nav>
                <button style={styles.newShipmentBtn}><FaPlus /> NEW SHIPMENT</button>
            </aside>

            {/* 2. MAIN CONTENT */}
            <main style={styles.mainArea}>
                {/* Header Navigation */}
                <header style={styles.topHeader}>
                    <div style={styles.breadcrumb}>
                        <span>Logistics</span>
                        <span>Inventory</span>
                        <span style={styles.breadcrumbActive}>Sourcing</span>
                        <span>Analytics</span>
                    </div>
                    <div style={styles.headerRight}>
                        <FaBell style={styles.headerIcon} />
                        <FaCog style={styles.headerIcon} />
                        <div style={styles.userAvatar}></div>
                    </div>
                </header>

                <div style={styles.contentPadding}>
                    {/* Title Section */}
                    <div style={styles.titleRow}>
                        <div>
                            <p style={styles.upperTitle}>CUNG ỨNG THƯỢNG HẠNG</p>
                            <h1 style={styles.mainTitle}>Đối tác Cung ứng</h1>
                            <p style={styles.subDescription}>
                                Quản lý mạng lưới các đồn điền và đại lý chiến lược, đảm bảo nguồn cung cà phê bền vững.
                            </p>
                        </div>
                        <button style={styles.addSupplierBtn}>
                            <FaPlus /> Thêm mới nhà cung cấp
                        </button>
                    </div>

                    {/* Top Stats & Map Row */}
                    <div style={styles.mapGrid}>
                        <div style={styles.mapContainer}>
                            <div style={styles.mapOverlay}>
                                <h4 style={{margin: 0, fontSize: '14px'}}>Mạng lưới Vùng Nguyên Liệu</h4>
                                <p style={{fontSize: '11px', opacity: 0.8}}>Hiển thị 12 đồn điền đang hoạt động tại Tây Nguyên.</p>
                            </div>
                            {/* Placeholder cho Map thực tế */}
                            <div style={styles.mapPlaceholder}></div>
                        </div>
                        
                        <div style={styles.kpiColumn}>
                            <div style={styles.kpiCard}>
                                <p style={styles.kpiLabel}>TỔNG SẢN LƯỢNG THÁNG</p>
                                <h2 style={styles.kpiValue}>12,450 <span style={{fontSize: '16px'}}>Tấn</span></h2>
                                <p style={styles.kpiTrend}>+8.2% vs Tháng trước</p>
                            </div>
                            <div style={{...styles.kpiCard, backgroundColor: '#3D2B1F', color: '#FFF'}}>
                                <p style={{...styles.kpiLabel, color: '#A89B8D'}}>ĐỘ TIN CẬY TRUNG BÌNH</p>
                                <h2 style={{...styles.kpiValue, color: '#FFF'}}>98.4%</h2>
                                <div style={{display: 'flex', gap: '4px', color: '#D97706'}}>
                                    {[1,2,3,4].map(i => <FaStar key={i}/>)}<FaStar style={{opacity: 0.5}}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div style={styles.filterBar}>
                        <div style={styles.filterTabs}>
                            <span style={styles.tabActive}>Tất cả</span>
                            <span style={styles.tab}>Đồn điền</span>
                            <span style={styles.tab}>Đại lý</span>
                            <span style={styles.tab}>Ưu tiên cao</span>
                        </div>
                        <div style={styles.searchBox}>
                            <FaSearch color="#A89B8D" />
                            <input type="text" placeholder="Tìm kiếm đối tác..." style={styles.searchInput} />
                        </div>
                    </div>

                    {/* Supplier Cards Grid */}
                    <div style={styles.cardGrid}>
                        <SupplierCard 
                            name="Đồn điền Arabica Cầu Đất" 
                            location="TP. ĐÀ LẠT, LÂM ĐỒNG" 
                            output="850 Tấn" 
                            rating="4.9"
                            status="ĐANG HỢP TÁC"
                            statusColor="#4F7942"
                            image="https://via.placeholder.com/60"
                        />
                        <SupplierCard 
                            name="Đại lý Robusta Buôn Ma Thuột" 
                            location="TP. BUÔN MA THUỘT, ĐẮK LẮK" 
                            output="1,200 Tấn" 
                            rating="4.2"
                            status="CẦN KIỂM TRA"
                            statusColor="#D97706"
                            image="https://via.placeholder.com/60"
                            contactIcon={<FaEnvelope />}
                        />
                        <SupplierCard 
                            name="Trang trại hữu cơ Gia Lai" 
                            location="CHƯ SÊ, GIA LAI" 
                            output="450 Tấn" 
                            rating="5.0"
                            status="ĐANG HỢP TÁC"
                            statusColor="#4F7942"
                            image="https://via.placeholder.com/60"
                        />
                        {/* Empty "Add New" Card */}
                        <div style={styles.addCard}>
                            <div style={styles.addCircle}><FaPlus /></div>
                            <h4 style={{margin: '15px 0 5px 0'}}>Đăng ký đối tác mới</h4>
                            <p style={{fontSize: '12px', color: '#A89B8D'}}>Mở rộng mạng lưới cung ứng của bạn ngay.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Component con cho Thẻ Nhà Cung Cấp
const SupplierCard = ({ name, location, output, rating, status, statusColor, image, contactIcon }) => (
    <div style={styles.sCard}>
        <div style={styles.cardHeader}>
            <img src={image} alt={name} style={styles.cardImg} />
            <span style={{...styles.statusBadge, backgroundColor: `${statusColor}22`, color: statusColor}}>{status}</span>
        </div>
        <h3 style={styles.cardName}>{name}</h3>
        <p style={styles.cardLoc}><FaMapMarkerAlt /> {location}</p>
        
        <div style={styles.cardStats}>
            <div style={styles.cardStatItem}>
                <p style={styles.statLabel}>SẢN LƯỢNG THÁNG</p>
                <p style={styles.statVal}>{output}</p>
            </div>
            <div style={styles.cardStatItem}>
                <p style={styles.statLabel}>XẾP HẠNG</p>
                <p style={styles.statVal}>{rating} <FaStar size={10} color="#D97706" /></p>
            </div>
        </div>
        <div style={styles.cardFooter}>
            <div style={styles.contactBtn}>
                {contactIcon || <FaPhoneAlt />} <span style={{marginLeft: '8px'}}>09xx.xxx.xxx</span>
            </div>
            <div style={styles.arrowCircle}>→</div>
        </div>
    </div>
);

const NavItem = ({ icon, label, active }) => (
    <div style={{...styles.navLink, backgroundColor: active ? '#3D2B1F' : 'transparent', color: active ? '#FFF' : '#3D2B1F'}}>
        {icon} <span style={{marginLeft: '12px'}}>{label}</span>
    </div>
);

const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F9F1E7', fontFamily: 'Inter, sans-serif' },
    sidebar: { width: '260px', borderRight: '1px solid #E5D5C5', padding: '40px 20px', display: 'flex', flexDirection: 'column' },
    brandSection: { marginBottom: '40px' },
    brandTitle: { fontSize: '20px', fontWeight: '900', color: '#3D2B1F', margin: 0 },
    brandSub: { fontSize: '10px', letterSpacing: '2px', color: '#A89B8D' },
    navMenu: { flex: 1 },
    navLink: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', fontSize: '14px', fontWeight: '500' },
    newShipmentBtn: { backgroundColor: '#3D2B1F', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
    mainArea: { flex: 1, display: 'flex', flexDirection: 'column' },
    topHeader: { height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid #E5D5C5' },
    breadcrumb: { display: 'flex', gap: '24px', fontSize: '14px', color: '#A89B8D' },
    breadcrumbActive: { color: '#4F7942', fontWeight: '700', borderBottom: '2px solid #4F7942', paddingBottom: '23px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
    headerIcon: { fontSize: '18px', color: '#3D2B1F' },
    userAvatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3D2B1F' },
    contentPadding: { padding: '30px 40px' },
    titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' },
    upperTitle: { fontSize: '11px', fontWeight: '700', color: '#A89B8D', letterSpacing: '1px', margin: 0 },
    mainTitle: { fontSize: '36px', fontWeight: '800', color: '#3D2B1F', margin: '5px 0' },
    subDescription: { fontSize: '14px', color: '#777', maxWidth: '500px', margin: 0 },
    addSupplierBtn: { backgroundColor: '#3D2B1F', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    mapGrid: { display: 'flex', gap: '20px', marginBottom: '40px' },
    mapContainer: { flex: 2, height: '300px', borderRadius: '15px', position: 'relative', overflow: 'hidden', border: '1px solid #E5D5C5' },
    mapOverlay: { position: 'absolute', top: '20px', left: '20px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '15px', borderRadius: '8px', zIndex: 1, border: '1px solid #E5D5C5' },
    mapPlaceholder: { width: '100%', height: '100%', backgroundColor: '#E0D5C5' }, // Nơi nhúng Google Maps
    kpiColumn: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
    kpiCard: { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
    kpiLabel: { fontSize: '10px', fontWeight: '700', color: '#A89B8D', margin: '0 0 10px 0' },
    kpiValue: { fontSize: '28px', fontWeight: '800', color: '#3D2B1F', margin: '0 0 5px 0' },
    kpiTrend: { fontSize: '12px', color: '#4F7942', margin: 0 },
    filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    filterTabs: { display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '600', color: '#3D2B1F' },
    tabActive: { backgroundColor: '#E5D5C5', padding: '6px 12px', borderRadius: '6px' },
    tab: { color: '#A89B8D', cursor: 'pointer' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#E5D5C5', padding: '8px 16px', borderRadius: '8px', gap: '10px' },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '200px' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    sCard: { backgroundColor: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', position: 'relative' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' },
    cardImg: { width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' },
    statusBadge: { fontSize: '9px', fontWeight: '800', padding: '4px 8px', borderRadius: '4px' },
    cardName: { fontSize: '18px', fontWeight: '700', color: '#3D2B1F', margin: '0 0 5px 0' },
    cardLoc: { fontSize: '11px', color: '#A89B8D', display: 'flex', alignItems: 'center', gap: '6px' },
    cardStats: { display: 'flex', gap: '20px', margin: '20px 0', padding: '15px 0', borderTop: '1px solid #F1F1F1', borderBottom: '1px solid #F1F1F1' },
    statLabel: { fontSize: '9px', color: '#A89B8D', margin: 0 },
    statVal: { fontSize: '15px', fontWeight: '700', color: '#3D2B1F', margin: 0 },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    contactBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#F9F1E7', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', color: '#3D2B1F', fontWeight: '600' },
    arrowCircle: { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #E5D5C5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D2B1F' },
    addCard: { border: '2px dashed #E5D5C5', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '250px' },
    addCircle: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#E5D5C5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D2B1F' }
};

export default SuppliersPage;