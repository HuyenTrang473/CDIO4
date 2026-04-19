import React, { useState, useEffect } from 'react';
import { FaServer, FaMicrochip, FaDatabase, FaHdd, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const SystemMonitoringPage = () => {
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 35,
    memoryUsage: 62,
    DatabaseSize: 4.8,
    diskUsage: 48,
    requestsPerMin: 245,
    uptime: '42 ngày 5 giờ'
  });

  const [backups, setBackups] = useState([
    {
      id: 'backup-20250329',
      date: '2025-03-29 02:00',
      size: '2.4 GB',
      status: 'success',
      duration: '45 phút',
      location: 'Cloud Storage (AWS)'
    },
    {
      id: 'backup-20250328',
      date: '2025-03-28 02:00',
      size: '2.3 GB',
      status: 'success',
      duration: '42 phút',
      location: 'Cloud Storage (AWS)'
    },
    {
      id: 'backup-20250327',
      date: '2025-03-27 02:00',
      size: '2.3 GB',
      status: 'success',
      duration: '40 phút',
      location: 'Cloud Storage (AWS)'
    },
    {
      id: 'backup-20250326',
      date: '2025-03-26 02:00',
      size: '2.2 GB',
      status: 'warning',
      duration: '58 phút',
      location: 'Cloud Storage (AWS)'
    }
  ]);

  const [logs, setLogs] = useState([
    { id: 1, time: '2025-03-29 14:35:22', level: 'INFO', message: 'User login successful: admin@warehouse.vn' },
    { id: 2, time: '2025-03-29 14:32:10', level: 'INFO', message: 'Transaction PN-2401001 approved' },
    { id: 3, time: '2025-03-29 14:28:45', level: 'WARNING', message: 'Memory usage above 60%' },
    { id: 4, time: '2025-03-29 14:25:13', level: 'INFO', message: 'Backup completed successfully (2.4 GB)' },
    { id: 5, time: '2025-03-29 14:20:00', level: 'INFO', message: 'Database query optimized: products table' },
    { id: 6, time: '2025-03-29 14:15:30', level: 'ERROR', message: 'Failed login attempt: invalid@example.com' },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpuUsage: Math.min(100, Math.max(20, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.min(100, Math.max(50, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        requestsPerMin: Math.max(100, prev.requestsPerMin + Math.floor((Math.random() - 0.5) * 50))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const triggerManualBackup = () => {
    alert('✅ Backup thủ công đang được thực hiện...\n\nDự kiến hoàn thành trong 45 phút');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const StatCard = ({ icon, label, value, unit, percentage, color }) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `2px solid ${color}`,
      flex: 1,
      minWidth: '200px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '2rem', color }}>
          {icon}
        </div>
        <span style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: '600' }}>
          {label}
        </span>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#1F2937' }}>
          {value}{unit}
        </p>
        <div style={{
          background: '#E5E7EB',
          borderRadius: '8px',
          height: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: color,
            height: '100%',
            width: `${percentage}%`,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>
      <p style={{
        color: percentage > 80 ? '#EF4444' : percentage > 60 ? '#F59E0B' : '#10B981',
        fontSize: '0.875rem',
        margin: 0,
        fontWeight: '600'
      }}>
        {percentage > 80 ? '⚠️ Cao' : percentage > 60 ? '⏳ Bình thường' : '✅ Tốt'}
      </p>
    </div>
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #F97316 0%, #FCD34D 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
          🖥️ Giám Sát & Bảo Trì Hệ Thống
        </h1>
        <p style={{ fontSize: '1rem', margin: 0, opacity: 0.9 }}>
          Trạng thái: <strong>🟢 Hoạt động bình thường</strong> | Uptime: <strong>{systemStats.uptime}</strong>
        </p>
      </div>

      {/* System Stats Cards */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <StatCard
          icon={<FaMicrochip />}
          label="CPU Usage"
          value={systemStats.cpuUsage.toFixed(1)}
          unit="%"
          percentage={systemStats.cpuUsage}
          color="#3B82F6"
        />
        <StatCard
          icon={<FaDatabase />}
          label="Memory"
          value={systemStats.memoryUsage.toFixed(1)}
          unit="%"
          percentage={systemStats.memoryUsage}
          color="#8B5CF6"
        />
        <StatCard
          icon={<FaHdd />}
          label="Database"
          value={systemStats.DatabaseSize}
          unit=" GB"
          percentage={(systemStats.DatabaseSize / 10) * 100}
          color="#EC4899"
        />
        <StatCard
          icon={<FaServer />}
          label="Disk Usage"
          value={systemStats.diskUsage.toFixed(1)}
          unit="%"
          percentage={systemStats.diskUsage}
          color="#F59E0B"
        />
      </div>

      {/* Real-time Monitoring */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginTop: 0, color: '#1F2937' }}>📊 Giám Sát Realtime</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: '#F0F9FF',
            borderRadius: '8px',
            border: '2px solid #3B82F6'
          }}>
            <p style={{ color: '#1E40AF', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
              Requests/Phút
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#3B82F6', margin: 0 }}>
              {Math.floor(systemStats.requestsPerMin)}
            </p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              ⬆️ +12% so với hôm qua
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#F0FDF4',
            borderRadius: '8px',
            border: '2px solid #10B981'
          }}>
            <p style={{ color: '#15803D', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
              API Response Time
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#10B981', margin: 0 }}>
              145ms
            </p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              ✅ Tối ưu
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#FFFBEB',
            borderRadius: '8px',
            border: '2px solid #F59E0B'
          }}>
            <p style={{ color: '#92400E', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
              Active Users
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: '#F59E0B', margin: 0 }}>
              23
            </p>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              👥 Đang kết nối
            </p>
          </div>
        </div>
      </div>

      {/* Backup Section */}
      <div style={{
        marginBottom: '2rem',
        padding: '2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ marginTop: 0, color: '#1F2937' }}>💾 Sao Lưu Dữ Liệu</h2>
          <button
            onClick={triggerManualBackup}
            style={{
              background: '#10B981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🔄 Sao Lưu Ngay
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Thời Gian</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Dung Lượng</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Thời Gian Thực Hiện</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Vị Trí Lưu</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#6B7280' }}>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {backups.map((backup, index) => (
              <tr
                key={backup.id}
                style={{
                  borderBottom: index < backups.length - 1 ? '1px solid #E5E7EB' : 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.closest('tr').style.background = '#FEF7DC'}
                onMouseLeave={(e) => e.target.closest('tr').style.background = 'white'}
              >
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600', color: '#1F2937' }}>{backup.date}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ color: '#6B7280' }}>{backup.size}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ color: '#6B7280' }}>{backup.duration}</div>
                </td>
                <td style={{ padding: '1rem', color: '#6B7280' }}>
                  {backup.location}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    background: backup.status === 'success' ? '#DCFCE7' : '#FEF3C7',
                    color: getStatusColor(backup.status)
                  }}>
                    {backup.status === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    {backup.status === 'success' ? 'Thành công' : 'Cảnh báo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System Logs */}
      <div style={{
        padding: '2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#1F2937' }}>📝 Nhật Ký Hệ Thống</h2>
        <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '0.75rem',
                minWidth: '70px',
                textAlign: 'center',
                background:
                  log.level === 'INFO' ? '#DBEAFE' :
                    log.level === 'WARNING' ? '#FEF3C7' : '#FFECEC',
                color:
                  log.level === 'INFO' ? '#1E40AF' :
                    log.level === 'WARNING' ? '#92400E' : '#991B1B'
              }}>
                {log.level}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>
                  <FaClock style={{ marginRight: '4px' }} />
                  {log.time}
                </p>
                <p style={{ color: '#1F2937', margin: 0 }}>
                  {log.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoringPage;
