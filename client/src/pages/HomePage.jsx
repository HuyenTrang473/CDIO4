import React, { useState, useEffect, useCallback } from 'react';
import { FaChartLine, FaClipboardList, FaBoxes, FaSyncAlt, FaTruck } from 'react-icons/fa';
import axios from 'axios';

// Format số: 850000000 → "850.0M" hoặc "4.2B"
const formatValue = (num) => {
  if (num === null || num === undefined) return '—';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return String(num);
};

const HomePage = () => {
  const [kpi, setKpi] = useState(null);           // { totalWeight, totalValue, todayIn, todayOut }
  const [supplierCount, setSupplierCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [kpiRes, suppliersRes] = await Promise.all([
        axios.get('/api/dashboard/kpi', { headers }),
        axios.get('/api/suppliers', { headers }),
      ]);

      if (kpiRes.data.success) setKpi(kpiRes.data.data);
      if (suppliersRes.data.success) {
        // API có thể trả về mảng hoặc object có data
        const suppliers = suppliersRes.data.data;
        setSupplierCount(Array.isArray(suppliers) ? suppliers.length : suppliers?.length ?? 0);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Tổng giao dịch hôm nay = nhập + xuất
  const totalTransactions = kpi
    ? (parseFloat(kpi.todayIn) + parseFloat(kpi.todayOut)).toFixed(1) + 'T'
    : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Tiêu đề trang */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: 'bold', color: '#A68B6D', margin: 0 }}>
            Dashboard Overview
          </p>
          <h1 style={{ marginTop: '8px', fontSize: '36px', fontWeight: 900, color: '#3D2B1F', margin: '8px 0' }}>
            Quản lý Warehouse
          </h1>
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#7A6352', maxWidth: '600px', lineHeight: '1.6' }}>
            Theo dõi lưu lượng hàng hóa, tối ưu hóa quy trình nhập kho và kiểm soát doanh thu thời gian thực.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            borderRadius: '20px', backgroundColor: '#F8F1E6', border: 'none',
            padding: '10px 20px', fontSize: '11px', fontWeight: 'bold',
            color: '#8D6D4D', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s'
          }}
        >
          <FaSyncAlt style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          LÀM MỚI
        </button>
      </header>

      {/* Error banner */}
      {error && (
        <div style={{ padding: '12px 20px', backgroundColor: '#fde8e8', color: '#c81e1e', borderRadius: '12px', fontSize: '13px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Grid 3 cột cho Stats */}
      <section style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <InfoCard
          icon={<FaClipboardList />}
          title="Giao dịch hôm nay"
          value={loading ? '...' : totalTransactions}
          subtitle={`Nhập: ${kpi?.todayIn ?? '—'}T / Xuất: ${kpi?.todayOut ?? '—'}T`}
          loading={loading}
        />
        <InfoCard
          icon={<FaChartLine />}
          title="Giá trị kho"
          value={loading ? '...' : formatValue(kpi?.totalValue)}
          subtitle="Tổng giá trị hàng tồn kho"
          loading={loading}
        />
        <InfoCard
          icon={<FaBoxes />}
          title="Hàng tồn"
          value={loading ? '...' : (kpi ? kpi.totalWeight + 'T' : '—')}
          subtitle="Tổng trọng lượng tồn kho"
          loading={loading}
        />
      </section>

      {/* Khu vực Biểu đồ & Thông tin phụ */}
      <section style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{
          flex: 2,
          minWidth: '600px',
          borderRadius: '32px',
          backgroundColor: 'white',
          padding: '32px',
          border: '1px solid #F1E9DE',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', color: '#A68B6D', margin: 0 }}>Phân tích hoạt động</p>
              <h2 style={{ marginTop: '4px', fontSize: '24px', fontWeight: 'bold', color: '#3D2B1F', margin: 0 }}>Hiệu suất vận hành</h2>
            </div>
          </div>

          <div style={{
            height: '300px', borderRadius: '24px', backgroundColor: '#FDFCF7',
            border: '2px dashed #EADBC4', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: '#A68B6D', gap: '12px'
          }}>
            <FaSyncAlt size={24} />
            <p style={{ fontSize: '12px', fontWeight: '500' }}>Biểu đồ sẽ được tích hợp ở bước tiếp theo</p>
            {kpi && (
              <div style={{ fontSize: '11px', color: '#8D6D4D', textAlign: 'center', lineHeight: '1.8' }}>
                📦 Nhập hôm nay: <b>{kpi.todayIn}T</b> &nbsp;|&nbsp; 🚚 Xuất hôm nay: <b>{kpi.todayOut}T</b>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
          <SummaryCard
            icon={<FaTruck />}
            title="Nhà cung cấp"
            value={loading ? '...' : (supplierCount ?? '—')}
            detail="Đã kết nối trực tiếp"
            loading={loading}
          />
          <SummaryCard
            title="Nhân sự"
            value="—"
            detail="Chưa có API nhân sự"
            loading={false}
          />
        </div>
      </section>

      {/* CSS animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// --- Sub-components ---

const InfoCard = ({ icon, title, value, subtitle, loading }) => (
  <div style={{
    flex: 1, minWidth: '280px', borderRadius: '32px', border: '1px solid #EFE2D1',
    backgroundColor: 'white', padding: '28px', boxShadow: '0 4px 10px rgba(0,0,0,0.01)',
    opacity: loading ? 0.7 : 1, transition: 'opacity 0.3s'
  }}>
    <div style={{
      height: '56px', width: '56px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', borderRadius: '16px', backgroundColor: '#F5EEE6', color: '#8D6D4D', fontSize: '20px'
    }}>
      {icon}
    </div>
    <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#A68B6D', margin: '24px 0 8px 0' }}>{title}</p>
    <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#3D2B1F', margin: '0 0 16px 0' }}>{value}</h3>
    <div style={{ display: 'inline-block', borderRadius: '20px', backgroundColor: '#F0F7ED', padding: '4px 12px', fontSize: '10px', fontWeight: 'bold', color: '#4A6741' }}>
      {subtitle}
    </div>
  </div>
);

const SummaryCard = ({ icon, title, value, detail, loading }) => (
  <div style={{
    borderRadius: '32px', border: '1px solid #EFE2D1', backgroundColor: 'white', padding: '32px', flex: 1,
    opacity: loading ? 0.7 : 1, transition: 'opacity 0.3s'
  }}>
    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#A68B6D', textTransform: 'uppercase', margin: 0 }}>{title}</p>
    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <h3 style={{ fontSize: '40px', fontWeight: '900', color: '#3D2B1F', margin: 0 }}>{value}</h3>
      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#4A6741' }}>ACTIVE</span>
    </div>
    <p style={{ marginTop: '16px', fontSize: '12px', color: '#7A6352', fontStyle: 'italic', opacity: 0.8, margin: 0 }}>{detail}</p>
  </div>
);

export default HomePage;