import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaFilter } from 'react-icons/fa';

const TransactionApprovalPage = () => {
  const [filteredStatus, setFilteredStatus] = useState('pending');
  const [selectedTx, setSelectedTx] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [transactions, setTransactions] = useState([
    {
      id: 'PN-2401001',
      supplier: 'Ông Hòa Coffee',
      product: 'Robusta Sàng 5',
      quantity: 1000,
      unit: 'kg',
      value: 85000000,
      status: 'pending',
      date: '2025-03-29',
      notes: 'Chất lượng tốt, giá cạnh tranh'
    },
    {
      id: 'XX-2501045',
      supplier: 'Khách hàng A',
      product: 'Arabica Cầu Đất (Rang xay)',
      quantity: 500,
      unit: 'kg',
      value: 125000000,
      status: 'pending',
      date: '2025-03-28',
      notes: 'Đơn hàng lớn từ customer công nghiệp'
    },
    {
      id: 'PN-2301012',
      supplier: 'Ông Minh NCC',
      product: 'Robusta Culi',
      quantity: 800,
      unit: 'kg',
      value: 72000000,
      status: 'approved',
      date: '2025-03-27',
      approvedBy: 'Chủ DN',
      approvedAt: '2025-03-28 14:30'
    },
    {
      id: 'XX-2301050',
      supplier: 'Khách hàng B',
      product: 'Arabica Moka (Rang)',
      quantity: 300,
      unit: 'kg',
      value: 75000000,
      status: 'rejected',
      date: '2025-03-26',
      rejectedBy: 'Chủ DN',
      rejectedAt: '2025-03-27 10:15',
      rejectionReason: 'Giá quá cao, ngoài ngân sách'
    },
    {
      id: 'PN-2201008',
      supplier: 'NCC Quốc tế',
      product: 'Robusta Specialty',
      quantity: 500,
      unit: 'kg',
      value: 95000000,
      status: 'pending',
      date: '2025-03-25',
      notes: 'Hàng nhập khẩu, hạn giao 5 ngày'
    }
  ]);

  const handleApprove = (txId) => {
    setTransactions(transactions.map(tx =>
      tx.id === txId
        ? {
          ...tx,
          status: 'approved',
          approvedBy: 'Chủ DN',
          approvedAt: new Date().toLocaleString('vi-VN')
        }
        : tx
    ));
    setSelectedTx(null);
    alert('✅ Phê duyệt giao dịch thành công!');
  };

  const handleReject = (txId) => {
    if (!rejectionReason.trim()) {
      alert('⚠️ Vui lòng nhập lý do từ chối!');
      return;
    }
    setTransactions(transactions.map(tx =>
      tx.id === txId
        ? {
          ...tx,
          status: 'rejected',
          rejectedBy: 'Chủ DN',
          rejectedAt: new Date().toLocaleString('vi-VN'),
          rejectionReason
        }
        : tx
    ));
    setSelectedTx(null);
    setRejectionReason('');
    alert('✅ Từ chối giao dịch thành công!');
  };

  const filteredTransactions = transactions.filter(tx => tx.status === filteredStatus);
  const pendingTotal = transactions
    .filter(tx => tx.status === 'pending')
    .reduce((sum, tx) => sum + tx.value, 0);

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
          ✅ Phê Duyệt Giao Dịch Lớn ( 10 triệu)
        </h1>
        <p style={{ fontSize: '1.1rem', margin: 0 }}>
          💰 Chờ duyệt: <strong>{pendingTotal.toLocaleString('vi-VN')} đ</strong>
          <span style={{ marginLeft: '2rem' }}>
            📊 Số lượng: <strong>{transactions.filter(tx => tx.status === 'pending').length} giao dịch</strong>
          </span>
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[
          { value: 'pending', label: '⏳ Chờ Duyệt', color: '#F59E0B' },
          { value: 'approved', label: '✅ Đã Duyệt', color: '#10B981' },
          { value: 'rejected', label: '❌ Từ Chối', color: '#EF4444' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilteredStatus(tab.value)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              background: filteredStatus === tab.value ? tab.color : '#E5E7EB',
              color: filteredStatus === tab.value ? 'white' : '#374151',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #F97316 0%, #FCD34D 100%)',
                color: 'white'
              }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Mã Giao Dịch</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Bên Liên Quan</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Sản Phẩm</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>Giá Trị</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Trạng Thái</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, idx) => (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: idx < filteredTransactions.length - 1 ? '1px solid #E5E7EB' : 'none',
                    background: selectedTx?.id === tx.id ? '#FEF3C7' : 'white',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => tx.status === 'pending' && (e.target.closest('tr').style.background = '#FEF7DC')}
                  onMouseLeave={(e) => !(selectedTx?.id === tx.id) && (e.target.closest('tr').style.background = 'white')}
                >
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#F97316' }}>{tx.id}</td>
                  <td style={{ padding: '1rem' }}>{tx.supplier}</td>
                  <td style={{ padding: '1rem' }}>
                    {tx.product}<br />
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {tx.quantity} {tx.unit}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#F97316' }}>
                    {(tx.value / 1000000).toFixed(1)}tr
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      background: tx.status === 'pending' ? '#FEF3C7' :
                        tx.status === 'approved' ? '#DCFCE7' : '#FFECEC',
                      color: tx.status === 'pending' ? '#D97706' :
                        tx.status === 'approved' ? '#15803D' : '#991B1B'
                    }}>
                      {tx.status === 'pending' ? '⏳ Chờ Duyệt' :
                        tx.status === 'approved' ? '✅ Đã Duyệt' : '❌ Từ Chối'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => setSelectedTx(selectedTx?.id === tx.id ? null : tx)}
                      style={{
                        background: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      {selectedTx?.id === tx.id ? '▼ Ẩn' : '▶ Xem'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>Không có giao dịch {filteredStatus === 'pending' ? 'chờ duyệt' : filteredStatus === 'approved' ? 'đã duyệt' : 'bị từ chối'} nào</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          background: '#FFFBEB',
          borderRadius: '12px',
          border: '2px solid #FCD34D'
        }}>
          <h2 style={{ color: '#92400E', marginTop: 0 }}>📋 Chi Tiết Giao Dịch {selectedTx.id}</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div>
              <p style={{ color: '#6B7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Bên Liên Quan</p>
              <p style={{ fontWeight: '600', margin: 0, fontSize: '1.1rem' }}>{selectedTx.supplier}</p>
            </div>
            <div>
              <p style={{ color: '#6B7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Sản Phẩm</p>
              <p style={{ fontWeight: '600', margin: 0, fontSize: '1.1rem' }}>{selectedTx.product}</p>
            </div>
            <div>
              <p style={{ color: '#6B7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Số Lượng</p>
              <p style={{ fontWeight: '600', margin: 0, fontSize: '1.1rem' }}>{selectedTx.quantity} {selectedTx.unit}</p>
            </div>
            <div>
              <p style={{ color: '#6B7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Giá Trị</p>
              <p style={{ fontWeight: '600', margin: 0, fontSize: '1.3rem', color: '#F97316' }}>
                {(selectedTx.value / 1000000).toFixed(1)} triệu đ
              </p>
            </div>
            <div>
              <p style={{ color: '#6B7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Ngày Tạo</p>
              <p style={{ fontWeight: '600', margin: 0, fontSize: '1.1rem' }}>{selectedTx.date}</p>
            </div>
          </div>

          {selectedTx.notes && (
            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
              <p style={{ color: '#6B7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Ghi Chú</p>
              <p style={{ margin: 0 }}>{selectedTx.notes}</p>
            </div>
          )}

          {/* Status Info */}
          {selectedTx.status === 'approved' && (
            <div style={{ marginBottom: '2rem', padding: '1rem', background: '#DCFCE7', borderRadius: '8px', border: '1px solid #86EFAC' }}>
              <p style={{ color: '#15803D', margin: 0, fontWeight: '600' }}>
                ✅ Đã phê duyệt bởi <strong>{selectedTx.approvedBy}</strong> vào <strong>{selectedTx.approvedAt}</strong>
              </p>
            </div>
          )}

          {selectedTx.status === 'rejected' && (
            <div style={{ marginBottom: '2rem', padding: '1rem', background: '#FFECEC', borderRadius: '8px', border: '1px solid #FECACA' }}>
              <p style={{ color: '#991B1B', margin: 0, fontWeight: '600' }}>
                ❌ Từ chối bởi <strong>{selectedTx.rejectedBy}</strong> vào <strong>{selectedTx.rejectedAt}</strong>
              </p>
              <p style={{ color: '#991B1B', margin: '0.5rem 0 0 0' }}>
                Lý do: {selectedTx.rejectionReason}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {selectedTx.status === 'pending' && (
            <div style={{
              padding: '2rem',
              background: 'white',
              borderRadius: '8px',
              marginTop: '2rem'
            }}>
              <h3 style={{ marginTop: 0, color: '#1F2937' }}>🔔 Quyết định phê duyệt</h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  onClick={() => handleApprove(selectedTx.id)}
                  style={{
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginRight: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaCheckCircle /> Phê Duyệt
                </button>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Từ Chối (nhập lý do nếu cần):
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ví dụ: Giá quá cao, không phù hợp ngân sách..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: '80px'
                  }}
                />
                <button
                  onClick={() => handleReject(selectedTx.id)}
                  style={{
                    background: '#EF4444',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaTimesCircle /> Từ Chối
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionApprovalPage;
