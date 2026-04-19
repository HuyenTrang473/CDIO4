import React, { useState } from 'react';
import { FaFileExcel, FaFilePdf, FaFilter, FaCalendarAlt, FaDownload } from 'react-icons/fa';

const ReportExportPage = () => {
  const [filters, setFilters] = useState({
    dateFrom: '2025-01-01',
    dateTo: '2025-03-29',
    reportType: 'kpi',
    supplier: 'all',
    status: 'all'
  });

  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    { value: 'kpi', label: '📊 Dashboard KPI (Revenue, Stock, etc.)' },
    { value: 'inventory', label: '📦 Inventory Report' },
    { value: 'transactions', label: '💳 Transaction History' },
    { value: 'suppliers', label: '🤝 Supplier Performance' },
    { value: 'financial', label: '💰 Financial Summary' },
    { value: 'audit', label: '📋 Audit Trail' }
  ];

  const suppliers = [
    { value: 'all', label: 'Tất Cả Nhà Cung Cấp' },
    { value: 'hoa', label: 'Ông Hòa Coffee' },
    { value: 'minh', label: 'Ông Minh NCC' },
    { value: 'intl', label: 'NCC Quốc tế' }
  ];

  const handleExport = async (format) => {
    if (!filters.dateFrom || !filters.dateTo) {
      alert('⚠️ Vui lòng chọn khoảng thời gian!');
      return;
    }

    setIsExporting(true);

    // Simulate export process
    setTimeout(() => {
      const filename = `Report_${filters.reportType}_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      alert(`✅ ${format === 'excel' ? '✏️ Excel' : '📄 PDF'} đã được tạo!\n\nFile: ${filename}\n\nĐang tải xuống...`);
      setIsExporting(false);

      // Simulate file download by creating a blob
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;base64,SGVsbG8gV29ybGQh`);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  const PreviewData = ({ type }) => {
    const sampleData = {
      kpi: [
        ['Chỉ Số', 'Giá Trị', 'So Với Tháng Trước'],
        ['Tổng Tồn Kho (tấn)', '128', '↑ 15%'],
        ['Doanh Thu (triệu đ)', '791', '↑ 22%'],
        ['Giao Dịch Nhập', '3.5', '↓ 5%'],
        ['Giao Dịch Xuất', '2.3', '↑ 10%']
      ],
      inventory: [
        ['Mã SP', 'Sản Phẩm', 'Tòn Kho', 'Vị Trí Kệ', 'Giá Trị'],
        ['SP001', 'Robusta Sàng 5', '1500kg', 'A2', '127.5M'],
        ['SP002', 'Arabica Cầu Đất', '800kg', 'B1', '120M'],
        ['SP003', 'Robusta Culi', '650kg', 'A1', '58.5M'],
      ],
      transactions: [
        ['Mã GD', 'Loại', 'Sản Phẩm', 'Số Lượng', 'Giá Trị', 'Ngày'],
        ['PN-001', 'Nhập', 'Robusta', '1000kg', '85M', '29/03/2025'],
        ['XX-001', 'Xuất', 'Arabica', '200kg', '50M', '29/03/2025'],
        ['PN-002', 'Nhập', 'Robusta', '800kg', '72M', '28/03/2025'],
      ]
    };

    const data = sampleData[type] || sampleData.kpi;

    return (
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1rem',
        fontSize: '0.875rem'
      }}>
        <thead>
          <tr style={{ background: '#F3F4F6' }}>
            {data[0].map((header, idx) => (
              <th
                key={idx}
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  borderBottom: '2px solid #D1D5DB'
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIdx) => (
            <tr
              key={rowIdx}
              style={{
                borderBottom: '1px solid #E5E7EB',
                background: rowIdx % 2 === 0 ? 'white' : '#F9FAFB'
              }}
            >
              {row.map((cell, colIdx) => (
                <td key={colIdx} style={{ padding: '0.75rem', color: '#374151' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
          📊 Xuất Báo Cáo Chiến Lược
        </h1>
        <p style={{ fontSize: '1rem', margin: '0.5rem 0 0 0', opacity: 0.9 }}>
          Tạo, lọc và xuất dữ liệu sang Excel/PDF
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Side - Filters */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaFilter /> Cấu Hình Báo Cáo
          </h2>

          {/* Report Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              📋 Loại Báo Cáo
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              <FaCalendarAlt style={{ marginRight: '6px' }} />
              Từ Ngày
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              Đến Ngày
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Supplier Filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              🤝 Nhà Cung Cấp
            </label>
            <select
              value={filters.supplier}
              onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              {suppliers.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
              ✅ Trạng Thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value='all'>Tất Cả Trạng Thái</option>
              <option value='approved'>Đã Duyệt</option>
              <option value='pending'>Chờ Duyệt</option>
              <option value='rejected'>Từ Chối</option>
            </select>
          </div>

          {/* Export Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              style={{
                background: '#10B981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isExporting ? 0.6 : 1
              }}
            >
              <FaFileExcel /> {isExporting ? '⏳ Đang Xuất...' : '📥 Xuất Excel'}
            </button>

            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              style={{
                background: '#EF4444',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isExporting ? 0.6 : 1
              }}
            >
              <FaFilePdf /> {isExporting ? '⏳ Đang Xuất...' : '📥 Xuất PDF'}
            </button>
          </div>

          {/* Stats */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#F0F9FF',
            borderRadius: '8px',
            border: '1px solid #BFDBFE'
          }}>
            <p style={{ color: '#1E40AF', fontSize: '0.875rem', margin: 0 }}>
              ℹ️ <strong>Lưu Ý:</strong> Báo cáo sẽ bao gồm dữ liệu từ {filters.dateFrom} đến {filters.dateTo}
            </p>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <h2 style={{ marginTop: 0, color: '#1F2937' }}>
            👀 Xem Trước
          </h2>

          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {reportTypes.find(t => t.value === filters.reportType)?.label}
          </p>

          <PreviewData type={filters.reportType} />

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#FEFCE8',
            borderRadius: '8px',
            border: '1px solid #FCD34D'
          }}>
            <p style={{ color: '#92400E', fontSize: '0.875rem', margin: 0 }}>
              👆 Dữ liệu trên chỉ là mẫu. Dữ liệu thực tế sẽ được tạo dựa trên bộ lọc của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div style={{
        marginTop: '2rem',
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#1F2937' }}>📑 Báo Cáo Được Tạo Gần Đây</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            {
              name: 'KPI_March_2025.xlsx',
              date: '2025-03-29',
              size: '245 KB',
              icon: <FaFileExcel />
            },
            {
              name: 'Inventory_Report.xlsx',
              date: '2025-03-28',
              size: '412 KB',
              icon: <FaFileExcel />
            },
            {
              name: 'Financial_Summary.pdf',
              date: '2025-03-27',
              size: '1.2 MB',
              icon: <FaFilePdf />
            },
            {
              name: 'Supplier_Performance.xlsx',
              date: '2025-03-26',
              size: '356 KB',
              icon: <FaFileExcel />
            }
          ].map((file, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '1.5rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.closest('div').style.background = '#FEF7DC';
                e.target.closest('div').style.borderColor = '#F97316';
              }}
              onMouseLeave={(e) => {
                e.target.closest('div').style.background = 'white';
                e.target.closest('div').style.borderColor = '#E5E7EB';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: file.icon.props.style?.color || '#F97316' }}>
                {file.icon}
              </div>
              <p style={{ fontWeight: '600', color: '#1F2937', margin: '0 0 0.5rem 0' }}>
                {file.name}
              </p>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                {file.date} • {file.size}
              </p>
              <button
                style={{
                  background: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <FaDownload /> Tải Xuống
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportExportPage;
