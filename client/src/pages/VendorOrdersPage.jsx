import React, { useState } from 'react';
import { FaSearch, FaDownload, FaPrint, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const VendorOrdersPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [orders] = useState([
    {
      id: 'PO-240401',
      product: 'Robusta Sàng 5',
      quantity: 1000,
      unit: 'kg',
      value: 85000000,
      status: 'pending',
      createdDate: '2025-03-15',
      dueDate: '2025-04-05',
      notes: 'Chất lượng tốt'
    },
    {
      id: 'PO-240402',
      product: 'Robusta Specialty',
      quantity: 500,
      unit: 'kg',
      value: 95000000,
      status: 'processing',
      createdDate: '2025-03-20',
      dueDate: '2025-04-10',
      notes: 'Priority delivery'
    },
    {
      id: 'PO-240403',
      product: 'Robusta Grade A',
      quantity: 800,
      unit: 'kg',
      value: 72000000,
      status: 'pending',
      createdDate: '2025-03-22',
      dueDate: '2025-04-15',
      notes: 'Standard terms'
    },
    {
      id: 'PO-240301',
      product: 'Arabica Cầu Đất',
      quantity: 300,
      unit: 'kg',
      value: 75000000,
      status: 'completed',
      createdDate: '2025-02-28',
      dueDate: '2025-03-25',
      completedDate: '2025-03-24',
      notes: 'Delivered on time'
    },
    {
      id: 'PO-240302',
      product: 'Robusta Culi',
      quantity: 600,
      unit: 'kg',
      value: 54000000,
      status: 'completed',
      createdDate: '2025-02-25',
      dueDate: '2025-03-20',
      completedDate: '2025-03-20',
      notes: 'Quality approved'
    },
    {
      id: 'PO-240201',
      product: 'Robusta Sàng 3',
      quantity: 1200,
      unit: 'kg',
      value: 96000000,
      status: 'cancelled',
      createdDate: '2025-02-10',
      dueDate: '2025-03-10',
      cancelledDate: '2025-02-15',
      reason: 'Customer request'
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#92400E', icon: '⏳' };
      case 'processing': return { bg: '#DBEAFE', text: '#1E40AF', icon: '⚙️' };
      case 'completed': return { bg: '#DCFCE7', text: '#15803D', icon: '✅' };
      case 'cancelled': return { bg: '#FFECEC', text: '#991B1B', icon: '❌' };
      default: return { bg: '#F3F4F6', text: '#6B7280', icon: '❓' };
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Chờ Xác Nhận',
      'processing': 'Đang Xử Lý',
      'completed': 'Đã Hoàn Thành',
      'cancelled': 'Đã Hủy'
    };
    return labels[status] || status;
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
          📋 Danh Sách Đơn Hàng (PO)
        </h1>
        <p style={{ opacity: 0.9, margin: 0 }}>
          Quản lý tất cả các purchase orders của bạn
        </p>
      </div>

      {/* Filter & Search */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
            🔍 Tìm Kiếm PO
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã PO hoặc sản phẩm..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
            📊 Lọc Theo Trạng Thái
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            <option value="all">Tất Cả Trạng Thái</option>
            <option value="pending">⏳ Chờ Xác Nhận</option>
            <option value="processing">⚙️ Đang Xử Lý</option>
            <option value="completed">✅ Đã Hoàn Thành</option>
            <option value="cancelled">❌ Đã Hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Mã PO</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Sản Phẩm</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>Số Lượng</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>Giá Trị</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Ngày Tạo</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Hạn Giao</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Trạng Thái</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => {
                const statusColor = getStatusColor(order.status);
                return (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: '1px solid #E5E7EB',
                      background: idx % 2 === 0 ? '#F9FAFB' : 'white'
                    }}
                  >
                    <td style={{ padding: '1rem', fontWeight: '700', color: '#667eea' }}>
                      {order.id}
                    </td>
                    <td style={{ padding: '1rem', color: '#1F2937' }}>
                      {order.product}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#6B7280' }}>
                      {order.quantity} {order.unit}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#667eea' }}>
                      {(order.value / 1000000).toFixed(1)}M
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6B7280' }}>
                      {order.createdDate}
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
                        background: statusColor.bg,
                        color: statusColor.text
                      }}>
                        {statusColor.icon} {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        style={{
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          marginRight: '6px',
                          fontWeight: '600'
                        }}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            <p style={{ fontSize: '1rem', margin: 0 }}>
              Không tìm thấy đơn hàng phù hợp
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: '#F0F4FF',
        borderRadius: '8px',
        border: '1px solid #DBEAFE'
      }}>
        <p style={{
          color: '#4C1D95',
          fontWeight: '600',
          margin: '0 0 0.5rem 0'
        }}>
          📊 Tổng Kết
        </p>
        <p style={{
          color: '#4C1D95',
          margin: 0,
          fontSize: '0.9rem'
        }}>
          Hiển thị <strong>{filteredOrders.length}</strong> / <strong>{orders.length}</strong> đơn hàng
          {filterStatus !== 'all' && ` (${getStatusLabel(filterStatus).toLowerCase()})`}
        </p>
      </div>
    </div>
  );
};

export default VendorOrdersPage;
