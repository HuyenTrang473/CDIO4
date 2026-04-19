import React, { useState } from 'react';
import { FaUpload, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaSync, FaEdit, FaTrash } from 'react-icons/fa';

const VendorDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([
    { id: 'DLV-240401', poId: 'PO-240401', product: 'Robusta Sàng 5', quantity: 1000, unit: 'kg', status: 'pending', uploadDate: null, syncStatus: 'pending', createdAt: '2025-03-25' },
    { id: 'DLV-240402', poId: 'PO-240402', product: 'Specialty Arabica', quantity: 500, unit: 'kg', status: 'uploaded', uploadDate: '2025-03-28', syncStatus: 'synced', createdAt: '2025-03-20' },
    { id: 'DLV-240403', poId: 'PO-240403', product: 'Grade A Coffee', quantity: 800, unit: 'kg', status: 'uploaded', uploadDate: '2025-03-27', syncStatus: 'synced', createdAt: '2025-03-22' },
    { id: 'DLV-240404', poId: 'PO-240401', product: 'Robusta Sàng 5', quantity: 1000, unit: 'kg', status: 'uploaded', uploadDate: '2025-03-23', syncStatus: 'syncing', createdAt: '2025-03-18' },
    { id: 'DLV-240405', poId: 'PO-240402', product: 'Specialty Arabica', quantity: 500, unit: 'kg', status: 'failed', uploadDate: '2025-03-21', syncStatus: 'failed', createdAt: '2025-03-15' }
  ]);

  const [file, setFile] = useState(null);
  const [selectedPO, setSelectedPO] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (validTypes.includes(selectedFile.type) && selectedFile.size <= 10 * 1024 * 1024) {
        setFile(selectedFile);
        setUploadMessage('');
      } else {
        setUploadMessage('❌ File không hợp lệ. Chỉ chấp nhận PDF, CSV, Excel (tối đa 10MB)');
        setFile(null);
      }
    }
  };

  const handleUpload = () => {
    if (!file || !selectedPO) {
      setUploadMessage('❌ Vui lòng chọn PO và file trước khi upload');
      return;
    }

    // Simulate upload
    setUploadMessage('⏳ Đang upload...');
    setTimeout(() => {
      const newDelivery = {
        id: `DLV-${Date.now()}`,
        poId: selectedPO,
        product: 'Sample Product',
        quantity: 1000,
        unit: 'kg',
        status: 'uploaded',
        uploadDate: new Date().toISOString().split('T')[0],
        syncStatus: 'synced',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setDeliveries([newDelivery, ...deliveries]);
      setUploadMessage('✅ Upload thành công và đã auto-sync với hệ thống!');
      setFile(null);
      setSelectedPO('');
    }, 1500);
  };

  const handleDeleteDelivery = (id) => {
    if (window.confirm('Xóa delivery note này?')) {
      setDeliveries(deliveries.filter(d => d.id !== id));
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaHourglassHalf style={{ color: '#F59E0B' }} />;
      case 'uploaded': return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'failed': return <FaTimesCircle style={{ color: '#EF4444' }} />;
      default: return null;
    }
  };

  const getSyncIcon = (syncStatus) => {
    switch(syncStatus) {
      case 'synced': return '✅ Đã Sync';
      case 'syncing': return '⟳ Đang Sync...';
      case 'failed': return '❌ Sync Thất Bại';
      case 'pending': return '⏳ Chờ Sync';
      default: return syncStatus;
    }
  };

  const pendingCount = deliveries.filter(d => d.status === 'pending').length;
  const uploadedCount = deliveries.filter(d => d.status === 'uploaded').length;
  const failedCount = deliveries.filter(d => d.status === 'failed').length;

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
          📦 Giao Hàng & EDI Auto-Sync
        </h1>
        <p style={{ opacity: 0.9, margin: 0 }}>
          Quản lý delivery notes và tự động đồng bộ với hệ thống kho
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderLeft: '4px solid #F59E0B'
        }}>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Chờ Upload</p>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: '#F59E0B', margin: 0 }}>{pendingCount}</p>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderLeft: '4px solid #10B981'
        }}>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Đã Upload</p>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: '#10B981', margin: 0 }}>{uploadedCount}</p>
        </div>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderLeft: '4px solid #EF4444'
        }}>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Lỗi Upload</p>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: '#EF4444', margin: 0 }}>{failedCount}</p>
        </div>
      </div>

      {/* Upload Form */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '2rem',
        borderTop: '4px solid #667eea'
      }}>
        <h2 style={{ marginTop: 0, color: '#1F2937', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
          📤 Upload Delivery Note
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* PO Selector */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '0.5rem'
            }}>
              Chọn Purchase Order *
            </label>
            <select
              value={selectedPO}
              onChange={(e) => setSelectedPO(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Chọn PO --</option>
              <option value="PO-240401">PO-240401 (Robusta Sàng 5)</option>
              <option value="PO-240402">PO-240402 (Specialty Arabica)</option>
              <option value="PO-240403">PO-240403 (Grade A Coffee)</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '0.5rem'
            }}>
              Tải File Delivery Note *
            </label>
            <input
              type="file"
              accept=".pdf,.csv,.xlsx"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            />
            <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0.25rem 0 0 0' }}>
              PDF, CSV, Excel (tối đa 10MB)
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          <FaUpload /> {file ? 'Upload Now' : 'Chọn File & Upload'}
        </button>

        {file && (
          <p style={{
            marginTop: '1rem',
            color: '#10B981',
            fontWeight: '600',
            fontSize: '0.95rem'
          }}>
            ✓ File: {file.name}
          </p>
        )}

        {uploadMessage && (
          <p style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: uploadMessage.startsWith('✅') ? '#F0FDF4' : uploadMessage.startsWith('❌') ? '#FEF2F2' : '#FEF3C7',
            border: `1px solid ${uploadMessage.startsWith('✅') ? '#BBEF63' : uploadMessage.startsWith('❌') ? '#FECACA' : '#FCD34D'}`,
            borderRadius: '8px',
            color: uploadMessage.startsWith('✅') ? '#15803D' : uploadMessage.startsWith('❌') ? '#BE123C' : '#92400E',
            fontWeight: '600'
          }}>
            {uploadMessage}
          </p>
        )}
      </div>

      {/* Auto-Sync Status */}
      <div style={{
        background: '#F0F9FF',
        border: '2px solid #3B82F6',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <FaSync style={{ fontSize: '1.5rem', color: '#3B82F6' }} />
          <div>
            <h3 style={{ margin: 0, color: '#1F2937', fontSize: '1.1rem' }}>
              EDI Auto-Sync Status
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6B7280', fontSize: '0.9rem' }}>
              Delivery notes sẽ tự động đồng bộ với hệ thống kho sau khi upload
            </p>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#374151'
        }}>
          <p style={{ margin: '0.5rem 0' }}>
            ✓ <strong>Auto-Sync Enabled</strong> - Quy trình tự động khởi chạy lúc 09:00 và 16:00 hàng ngày
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            ✓ <strong>Last Sync:</strong> 2025-03-29 14:35 UTC+7
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            ✓ <strong>Next Sync:</strong> 2025-03-30 09:00 UTC+7
          </p>
        </div>
      </div>

      {/* Delivery History */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ marginTop: 0, color: '#1F2937', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
          📊 Lịch Sử Giao Hàng
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '900px'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#6B7280', fontSize: '0.9rem' }}>Delivery ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#6B7280', fontSize: '0.9rem' }}>PO ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700', color: '#6B7280', fontSize: '0.9rem' }}>Product</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#6B7280', fontSize: '0.9rem' }}>Quantity</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#6B7280', fontSize: '0.9rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#6B7280', fontSize: '0.9rem' }}>Sync Status</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#6B7280', fontSize: '0.9rem' }}>Upload Date</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: '#6B7280', fontSize: '0.9rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  style={{
                    borderBottom: '1px solid #F3F4F6',
                    backgroundColor: delivery.status === 'failed' ? '#FEF2F2' : 'white'
                  }}
                >
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1F2937' }}>
                    {delivery.id}
                  </td>
                  <td style={{ padding: '1rem', color: '#1F2937' }}>
                    {delivery.poId}
                  </td>
                  <td style={{ padding: '1rem', color: '#1F2937' }}>
                    {delivery.product}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#1F2937' }}>
                    {delivery.quantity} {delivery.unit}
                  </td>
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    {getStatusIcon(delivery.status)}
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: delivery.status === 'pending' ? '#F59E0B' : delivery.status === 'uploaded' ? '#10B981' : '#EF4444'
                    }}>
                      {delivery.status === 'pending' ? 'Chờ' : delivery.status === 'uploaded' ? 'Đã Upload' : 'Lỗi'}
                    </span>
                  </td>
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: delivery.syncStatus === 'synced' ? '#10B981' : delivery.syncStatus === 'syncing' ? '#3B82F6' : delivery.syncStatus === 'pending' ? '#F59E0B' : '#EF4444'
                  }}>
                    {getSyncIcon(delivery.syncStatus)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6B7280', fontSize: '0.9rem' }}>
                    {delivery.uploadDate || '-'}
                  </td>
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        color: '#3B82F6',
                        padding: '0.25rem'
                      }}
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleDeleteDelivery(delivery.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        color: '#EF4444',
                        padding: '0.25rem'
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDeliveriesPage;
