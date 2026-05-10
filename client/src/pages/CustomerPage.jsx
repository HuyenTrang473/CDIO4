import React, { useState } from 'react';
import { FaUserPlus, FaFileExport, FaSortAmountDown, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const CustomerPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[1]); // Mặc định chọn khách hàng thứ 2 như trong ảnh

  return (
    <div style={{ display: 'flex', backgroundColor: '#FDFCF0', minHeight: '100%' }}>
      {/* --- NỘI DUNG CHÍNH BÊN TRÁI --- */}
      <div style={{ flex: 1, padding: '40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#8B5E3C', letterSpacing: '1px', margin: 0 }}>QUẢN LÝ QUAN HỆ</p>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#3D2B1F', margin: '8px 0' }}>Danh mục khách hàng &<br/>Đối tác</h2>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={btnGhostStyle}><FaFileExport /> Xuất dữ liệu</button>
            <button style={btnPrimaryStyle}><FaUserPlus /> Thêm khách hàng mới</button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <StatCard title="TỔNG SỐ KHÁCH HÀNG" value="1,284" trend="+12% tháng này" />
          <StatCard title="ĐỐI TÁC THU MUA CHIẾN LƯỢC" value="42" trend="ỔN ĐỊNH" />
          <StatCard title="TỔNG DOANH THU KỲ VỌNG" value="4.2B" unit="VND" trend="Q4 Outlook" />
        </div>

        {/* Tabs & Sort */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid rgba(61, 43, 31, 0.1)', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '30px' }}>
            <span style={activeTabStyle}>Tất cả</span>
            <span style={tabStyle}>Khách hàng thân thiết</span>
            <span style={tabStyle}>Đối tác thu mua</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#3D2B1F', fontWeight: 'bold' }}>
            <FaSortAmountDown /> Sắp xếp: Mới nhất
          </div>
        </div>

        {/* Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#A89B8D', fontSize: '10px', letterSpacing: '1px' }}>
              <th style={{ padding: '15px 10px' }}>THÔNG TIN ĐỐI TÁC</th>
              <th style={{ padding: '15px 10px' }}>PHÂN LOẠI</th>
              <th style={{ padding: '15px 10px' }}>LẦN MUA CUỐI</th>
              <th style={{ padding: '15px 10px' }}>TỔNG GIAO DỊCH</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr 
                key={index} 
                onClick={() => setSelectedCustomer(customer)}
                style={{ 
                  borderBottom: '1px solid rgba(61, 43, 31, 0.05)', 
                  cursor: 'pointer',
                  backgroundColor: selectedCustomer?.name === customer.name ? '#F9F1E7' : 'transparent' 
                }}
              >
                <td style={{ padding: '20px 10px' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#EFE3D5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#3D2B1F' }}>
                      {customer.logoText}
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', color: '#3D2B1F', fontSize: '14px' }}>{customer.name}</div>
                      <div style={{ fontSize: '11px', color: '#A89B8D' }}>{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 10px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B5E3C', display: 'block' }}>{customer.type}</span>
                </td>
                <td style={{ padding: '20px 10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3D2B1F' }}>{customer.lastDate}</div>
                  <div style={{ fontSize: '10px', color: '#A89B8D' }}>{customer.lastSku}</div>
                </td>
                <td style={{ padding: '20px 10px', fontWeight: '800', color: '#3D2B1F' }}>{customer.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- SIDE PANEL CHI TIẾT BÊN PHẢI --- */}
      <div style={{ 
        width: '380px', 
        backgroundColor: '#F9F1E7', 
        borderLeft: '1px solid rgba(61, 43, 31, 0.1)', 
        padding: '40px 30px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {selectedCustomer && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: 'white', borderRadius: '20px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                ☕
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#3D2B1F', margin: '0 0 5px 0' }}>{selectedCustomer.name}</h3>
              <p style={{ fontSize: '12px', color: '#7A6352', margin: 0 }}>Đối tác chiến lược khu vực miền Trung</p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h4 style={sectionTitleStyle}>THÔNG TIN LIÊN HỆ</h4>
              <ContactItem icon={<FaUserPlus />} text="Nguyễn Văn An (Giám đốc)" />
              <ContactItem icon={<FaPhoneAlt />} text="+84 902 334 112" />
              <ContactItem icon={<FaMapMarkerAlt />} text="242 Lê Lợi, Quận 1, TP.HCM" />
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={sectionTitleStyle}>LỊCH SỬ GIAO DỊCH (GẦN ĐÂY)</h4>
              <HistoryItem title="Gói Arabica Thượng Hạng" desc="15/08/2023 • 500kg" />
              <HistoryItem title="Giao hàng Coffee Roaster 2" desc="02/08/2023 • 200kg" />
              <HistoryItem title="Thanh toán dư nợ Q2" desc="28/07/2023" isPayment />
              
              <p style={{ color: '#3D2B1F', fontWeight: 'bold', fontSize: '11px', textAlign: 'center', cursor: 'pointer', marginTop: '20px' }}>XEM TOÀN BỘ</p>
            </div>

            <button style={{ ...btnPrimaryStyle, width: '100%', marginTop: 'auto' }}>GỬI THÔNG BÁO</button>
          </>
        )}
      </div>
    </div>
  );
};

// --- DỮ LIỆU GIẢ LẬP ---
const customers = [
  { name: "Bean & Brew Network", email: "contact@beanbrew.vn", logoText: "BN", type: "ĐỐI TÁC THU MUA", lastDate: "12 Th08 2023", lastSku: "SKU: CF-DARK-02", total: "842.000.000đ" },
  { name: "Urban Roastery Co.", email: "info@urbanroast.com", logoText: "UR", type: "THÂN THIẾT (VIP)", lastDate: "Hôm qua", lastSku: "SKU: CF-ARAB-09", total: "1.250.000.000đ" },
  { name: "Highland Export Group", email: "logistics@highland.vn", logoText: "HL", type: "KHÁCH LẺ TIỀM NĂNG", lastDate: "05 Th07 2023", lastSku: "SKU: CF-ROB-15", total: "45.500.000đ" },
];

// --- COMPONENTS PHỤ ---
const StatCard = ({ title, value, trend, unit }) => (
  <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
    <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#A89B8D', marginBottom: '10px' }}>{title}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
      <span style={{ fontSize: '28px', fontWeight: '900', color: '#3D2B1F' }}>{value}</span>
      {unit && <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#3D2B1F' }}>{unit}</span>}
      <span style={{ fontSize: '10px', color: '#4A6741', marginLeft: 'auto', fontWeight: 'bold' }}>{trend}</span>
    </div>
  </div>
);

const ContactItem = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', color: '#3D2B1F', fontSize: '13px' }}>
    <span style={{ color: '#A89B8D' }}>{icon}</span>
    <span>{text}</span>
  </div>
);

const HistoryItem = ({ title, desc, isPayment }) => (
  <div style={{ marginBottom: '20px' }}>
    <p style={{ fontSize: '13px', fontWeight: 'bold', color: isPayment ? '#4A6741' : '#3D2B1F', margin: '0 0 4px 0' }}>{title}</p>
    <p style={{ fontSize: '11px', color: '#A89B8D', margin: 0 }}>{desc}</p>
  </div>
);

// --- STYLES ---
const btnPrimaryStyle = { backgroundColor: '#3D2B1F', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const btnGhostStyle = { backgroundColor: 'transparent', color: '#3D2B1F', border: '1px solid rgba(61, 43, 31, 0.2)', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const tabStyle = { fontSize: '13px', color: '#A89B8D', fontWeight: 'bold', cursor: 'pointer' };
const activeTabStyle = { fontSize: '13px', color: '#3D2B1F', fontWeight: '900', borderBottom: '2px solid #3D2B1F', paddingBottom: '14px', cursor: 'pointer' };
const sectionTitleStyle = { fontSize: '10px', fontWeight: 'bold', color: '#A89B8D', letterSpacing: '1px', marginBottom: '20px', borderBottom: '1px solid rgba(61, 43, 31, 0.05)', paddingBottom: '10px' };

export default CustomerPage;