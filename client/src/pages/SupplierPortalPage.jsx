import React, { useState } from 'react';
import { FaCheckCircle, FaClock, FaStar, FaHistory, FaUpload, FaTabletAlt } from 'react-icons/fa';

const SupplierPortalPage = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders, scorecard, history, sync
  const [supplier] = useState({
    name: 'Ông Hòa Coffee',
    email: 'honcc@supplier.vn',
    phone: '0901234567',
    ranking: 1,
    score: 95,
    since: '2024-01-15'
  });

  const [orders, setOrders] = useState([
    {
      id: 'PN-2401001',
      product: 'Robusta Sàng 5',
      quantity: 1000,
      unit: 'kg',
      value: 85000000,
      status: 'pending',
      deadline: '2025-04-05',
      notes: 'Chất lượng tốt'
    },
    {
      id: 'PN-2401002',
      product: 'Robusta Specialty',
      quantity: 500,
      unit: 'kg',
      value: 95000000,
      status: 'confirmed',
      deadline: '2025-04-10',
      confirmedTime: '2025-03-28 10:30'
    },
    {
      id: 'PN-2401003',
      product: 'Robusta Grade A',
      quantity: 800,
      unit: 'kg',
      value: 72000000,
      status: 'delivered',
      deadline: '2025-03-20',
      completedTime: '2025-03-19 14:30'
    }
  ]);

  const [scorecard] = useState({
    deliveryRate: 98,
    qualityScore: 95,
    responseTime: 92,
    documentation: 94,
    priceCompetitiveness: 88,
    overall: 95
  });

  const [history] = useState([
    { date: '2025-03-29', type: 'Order Placed', description: 'PN-2401001 - Robusta Sàng 5', quantity: '1000kg' },
    { date: '2025-03-28', type: 'Confirmed', description: 'PN-2401002 - Delivery by 10/4', quantity: '500kg' },
    { date: '2025-03-27', type: 'Delivered', description: 'PN-2401003 - Grade A received', quantity: '800kg' },
    { date: '2025-03-20', type: 'Invoice Issued', description: 'Invoice #INV-2025-089', quantity: '72M' },
    { date: '2025-02-15', type: 'EDI Sync', description: 'Catalog updated - 45 SKUs', quantity: 'N/A' },
  ]);

  const handleConfirmOrder = (orderId) => {
    setOrders(orders.map(o =>
      o.id === orderId
        ? { ...o, status: 'confirmed', confirmedTime: new Date().toLocaleString('vi-VN') }
        : o
    ));
    alert('✅ Xác nhận đơn hàng thành công!');
  };

  const handleEdiBrowse = () => {
    alert('📤 Chọn file Excel (.xlsx) chứa catalog cà phê của bạn\n\nVí dụ columns: Mã SP, Tên SP, Giá, Số lượng khả dụng');
  };

  const ScoreBar = ({ label, score, color }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: '600', color: '#374151' }}>{label}</span>
        <span style={{ fontWeight: '700', fontSize: '1.1rem', color }}>{score}/100</span>
      </div>
      <div style={{
        background: '#E5E7EB',
        borderRadius: '8px',
        height: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: color,
          height: '100%',
          width: `${score}%`,
          transition: 'width 0.3s ease'
        }}></div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #F97316 0%, #FCD34D 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 1rem 0' }}>
          🤝 Cổng Thông Tin Nhà Cung Cấp
        </h1>
        <p style={{ fontSize: '1rem', margin: 0 }}>
          <strong>{supplier.name}</strong> | {supplier.email} | {supplier.phone}
        </p>
        <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
          🏆 Xếp hạng: <strong>Top {supplier.ranking}</strong> | ⭐ Điểm: <strong>{supplier.score}/100</strong> | Từ: <strong>{supplier.since}</strong>
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #E5E7EB',
        flexWrap: 'wrap'
      }}>
        {[
          { value: 'orders', label: '📦 Xác Nhận Đơn Hàng', icon: <FaCheckCircle /> },
          { value: 'scorecard', label: '⭐ Bảng Xếp Hạng', icon: <FaStar /> },
          { value: 'history', label: '📋 Lịch Sử Chuyến Hàng', icon: <FaHistory /> },
          { value: 'sync', label: '🔄 Đồng Bộ EDI', icon: <FaUpload /> }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: activeTab === tab.value ? '#F97316' : 'transparent',
              color: activeTab === tab.value ? 'white' : '#6B7280',
              cursor: 'pointer',
              fontWeight: activeTab === tab.value ? '600' : '500',
              borderBottom: activeTab === tab.value ? '3px solid #F97316' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              fontSize: '0.95rem'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 style={{ color: '#1F2937', marginTop: 0 }}>📦 Xác Nhận Đơn Hàng Chờ Giao</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: order.status === 'pending' ? '2px solid #F59E0B' : '2px solid #10B981'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.5rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: '2rem' }}>
                      {order.status === 'pending' ? '⏳' : order.status === 'confirmed' ? '✅' : '📦'}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#F97316', margin: '0 0 0.5rem 0' }}>
                      {order.id}
                    </p>
                    <p style={{ color: '#1F2937', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                      {order.product}
                    </p>
                    <p style={{ color: '#6B7280', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                      🎯 Số lượng: <strong>{order.quantity} {order.unit}</strong> | 📅 Hạn giao: <strong>{order.deadline}</strong>
                    </p>
                    {order.notes && (
                      <p style={{ color: '#6B7280', margin: 0, fontSize: '0.9rem' }}>
                        📝 Ghi chú: {order.notes}
                      </p>
                    )}
                    {order.confirmedTime && (
                      <p style={{ color: '#10B981', margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
                        ✅ Xác nhận lúc: {order.confirmedTime}
                      </p>
                    )}
                    {order.completedTime && (
                      <p style={{ color: '#10B981', margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
                        📦 Giao hàng lúc: {order.completedTime}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#F97316', margin: 0 }}>
                      {(order.value / 1000000).toFixed(1)}M
                    </p>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        style={{
                          marginTop: '1rem',
                          background: '#10B981',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                      >
                        ✅ Xác Nhận Giao Hàng
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <p style={{ marginTop: '1rem', color: '#10B981', fontWeight: '600', fontSize: '0.9rem' }}>
                        ✅ Đã xác nhận
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scorecard Tab */}
      {activeTab === 'scorecard' && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1F2937', marginTop: 0 }}>⭐ Bảng Xếp Hạng Nhà Cung Cấp</h2>

          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #F97316 0%, #FCD34D 100%)',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>Điểm Tổng Hợp</p>
            <p style={{ fontSize: '4rem', fontWeight: '900', margin: '0.5rem 0', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
              {scorecard.overall}
            </p>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>🏆 Xếp hạng: <strong>Top 1</strong></p>
          </div>

          <div>
            <ScoreBar label="📦 Tỷ Lệ Giao Hàng Đúng Hạn" score={scorecard.deliveryRate} color="#10B981" />
            <ScoreBar label="⭐ Chất Lượng Sản Phẩm" score={scorecard.qualityScore} color="#3B82F6" />
            <ScoreBar label="⚡ Thời Gian Phản Hồi" score={scorecard.responseTime} color="#8B5CF6" />
            <ScoreBar label="📋 Hoàn Chỉnh Tài Liệu" score={scorecard.documentation} color="#EC4899" />
            <ScoreBar label="💰 Tính Cạnh Tranh Giá" score={scorecard.priceCompetitiveness} color="#F59E0B" />
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#15803D', margin: 0, fontWeight: '600' }}>
              🎯 Bạn là nhà cung cấp hàng đầu! Hãy tiếp tục duy trì chất lượng dịch vụ.
            </p>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1F2937', marginTop: 0 }}>📋 Lịch Sử Chuyến Hàng (3 Tháng)</h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Ngày</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Loại</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Mô Tả</th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#6B7280' }}>Số Lượng</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #E5E7EB',
                      background: idx % 2 === 0 ? 'white' : '#F9FAFB'
                    }}
                  >
                    <td style={{ padding: '1rem', color: '#6B7280', fontWeight: '500' }}>{item.date}</td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1F2937' }}>{item.type}</td>
                    <td style={{ padding: '1rem', color: '#6B7280' }}>{item.description}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#F97316' }}>
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#F0F9FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#1E40AF', fontSize: '0.9rem', margin: 0 }}>
              📊 Xem hóa đơn chi tiết và tracking vận chuyển từ các chuyến hàng trên.
            </p>
          </div>
        </div>
      )}

      {/* EDI Sync Tab */}
      {activeTab === 'sync' && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1F2937', marginTop: 0 }}>🔄 Đồng Bộ Dữ Liệu EDI</h2>

          <div style={{
            padding: '2rem',
            background: '#FEF7DC',
            borderRadius: '12px',
            border: '2px dashed #F97316',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📤</div>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#92400E', margin: '0 0 1rem 0' }}>
              Upload Catalog Cà Phê (Excel)
            </p>
            <p style={{ color: '#6B7280', margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>
              File Excel (.xlsx) với columns: Mã SP, Tên SP, Giá (đ/kg), Số lượng khả dụng (kg)
            </p>
            <button
              onClick={handleEdiBrowse}
              style={{
                background: '#F97316',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaUpload /> Chọn File
            </button>
          </div>

          <h3 style={{ color: '#1F2937', marginTop: '2rem' }}>📋 Lần Đồng Bộ Gần Đây</h3>
          <div style={{
            display: 'grid',
            gap: '1rem'
          }}>
            {[
              { date: '2025-03-29 14:30', status: 'Thành công', skus: 45, records: 12500 },
              { date: '2025-03-25 10:15', status: 'Thành công', skus: 43, records: 12300 },
              { date: '2025-03-21 08:00', status: 'Thành công', skus: 42, records: 12100 },
            ].map((sync, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ fontWeight: '600', color: '#1F2937', margin: 0 }}>
                    📤 {sync.date}
                  </p>
                  <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    {sync.skus} SKU • {sync.records} records
                  </p>
                </div>
                <div style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  ✅ {sync.status}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#F0FDF4',
            border: '1px solid #BBEF63',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#15803D', margin: 0, fontWeight: '600' }}>
              ✅ Đồng bộ EDI thành công! Catalog cà phê của bạn đã được cập nhật vào hệ thống.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPortalPage;
