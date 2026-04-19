import React, { useState } from 'react';
import { FaClipboardList, FaStar, FaTruck, FaCheckCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const vendorName = localStorage.getItem('vendorName') || 'Vendor';

  const [stats] = useState({
    activePOs: 3,
    pendingDelivery: 2,
    completedOrders: 48,
    thisMonthRevenue: 450,
    otdRate: 98,
    qualityScore: 95,
    ranking: 1
  });

  const [pendingOrders] = useState([
    {
      id: 'PO-240401',
      product: 'Robusta Sàng 5',
      quantity: 1000,
      unit: 'kg',
      value: 85,
      dueDate: '2025-04-05',
      status: 'pending'
    },
    {
      id: 'PO-240402',
      product: 'Robusta Specialty',
      quantity: 500,
      unit: 'kg',
      value: 95,
      dueDate: '2025-04-10',
      status: 'processing'
    },
    {
      id: 'PO-240403',
      product: 'Robusta Grade A',
      quantity: 800,
      unit: 'kg',
      value: 72,
      dueDate: '2025-04-15',
      status: 'pending'
    }
  ]);

  const StatCard = ({ icon, label, value, unit, color }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: `2px solid ${color}`,
      flex: 1,
      minWidth: '150px'
    }}>
      <div style={{
        fontSize: '2rem',
        color,
        marginBottom: '0.5rem'
      }}>
        {icon}
      </div>
      <p style={{ color: '#6B7280', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>
        {label}
      </p>
      <p style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: '#1F2937' }}>
        {value}<span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginLeft: '4px' }}>{unit}</span>
      </p>
    </div>
  );

  return (
    <div>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
          👋 Chào mừng, {vendorName}!
        </h1>
        <p style={{ opacity: 0.9, margin: 0 }}>
          Quản lý đơn hàng, deliveries và performance metrics của bạn từ đây
        </p>
      </div>

      {/* KPI Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard icon={<FaClipboardList />} label="PO Hoạt Động" value={stats.activePOs} unit="" color="#3B82F6" />
        <StatCard icon={<FaTruck />} label="Chờ Giao" value={stats.pendingDelivery} unit="" color="#F59E0B" />
        <StatCard icon={<FaCheckCircle />} label="Đã Hoàn" value={stats.completedOrders} unit="" color="#10B981" />
        <StatCard icon={<FaStar />} label="Doanh Thu" value={stats.thisMonthRevenue} unit="M" color="#8B5CF6" />
      </div>

      {/* Performance */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Quick Stats */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginTop: 0, color: '#1F2937', fontSize: '1.2rem' }}>
            📊 Hiệu Suất Tháng Này
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>OTD (On-Time Delivery)</span>
              <span style={{ fontWeight: '800', color: '#10B981', fontSize: '1.1rem' }}>{stats.otdRate}%</span>
            </div>
            <div style={{
              background: '#E5E7EB',
              borderRadius: '8px',
              height: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#10B981',
                height: '100%',
                width: `${stats.otdRate}%`,
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Quality Score</span>
              <span style={{ fontWeight: '800', color: '#3B82F6', fontSize: '1.1rem' }}>{stats.qualityScore}%</span>
            </div>
            <div style={{
              background: '#E5E7EB',
              borderRadius: '8px',
              height: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#3B82F6',
                height: '100%',
                width: `${stats.qualityScore}%`,
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#F0F4FF',
            borderRadius: '8px',
            border: '2px solid #C7D2FE',
            textAlign: 'center'
          }}>
            <p style={{ color: '#4C1D95', fontWeight: '700', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>
              🏆 Ranking: Top {stats.ranking}
            </p>
            <p style={{ color: '#4C1D95', fontSize: '0.85rem', margin: 0 }}>
              Bạn là nhà cung cấp hàng đầu!
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2 style={{ marginTop: 0, color: '#1F2937', fontSize: '1.2rem' }}>
            🚀 Hành Động Nhanh
          </h2>

          <button
            onClick={() => navigate('/vendor/orders')}
            style={{
              padding: '1.2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span>📋 Xem {stats.activePOs} PO Hoạt Động</span>
            <FaArrowRight />
          </button>

          <button
            onClick={() => navigate('/vendor/deliveries')}
            style={{
              padding: '1.2rem',
              background: '#F59E0B',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span>📤 Upload Delivery Notes</span>
            <FaArrowRight />
          </button>

          <button
            onClick={() => navigate('/vendor/scorecard')}
            style={{
              padding: '1.2rem',
              background: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span>⭐ Xem Scorecard Chi Tiết</span>
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Recent POs */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ marginTop: 0, color: '#1F2937', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          📦 Đơn Hàng Chờ Xử Lý
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Mã PO</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Sản Phẩm</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#6B7280' }}>Số Lượng</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#6B7280' }}>Giá Trị</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#6B7280' }}>Hạn Giao</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#6B7280' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: '1px solid #F3F4F6',
                    background: idx % 2 === 0 ? '#F9FAFB' : 'white'
                  }}
                >
                  <td style={{ padding: '1rem', fontWeight: '700', color: '#667eea' }}>{order.id}</td>
                  <td style={{ padding: '1rem', color: '#1F2937' }}>{order.product}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#6B7280' }}>
                    {order.quantity} {order.unit}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#667eea' }}>
                    {order.value}M
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6B7280' }}>
                    {order.dueDate}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: order.status === 'pending' ? '#FEF3C7' : '#DBEAFE',
                      color: order.status === 'pending' ? '#92400E' : '#1E40AF'
                    }}>
                      {order.status === 'pending' ? '⏳ Chờ' : '⚙️ Xử Lý'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => navigate('/vendor/orders')}
          style={{
            marginTop: '1.5rem',
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Xem Tất Cả Đơn Hàng
        </button>
      </div>
    </div>
  );
};

export default VendorDashboard;
