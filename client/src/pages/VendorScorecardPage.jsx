import React, { useState } from 'react';
import { FaStar, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa';

const VendorScorecardPage = () => {
  const [scorecard] = useState({
    otd: 98,
    quality: 95,
    responsiveness: 94,
    documentation: 92,
    priceCompetitiveness: 88,
    overall: 95,
    ranking: 1,
    totalSuppliers: 187
  });

  const [monthlyPerformance] = useState([
    { month: 'Jan', otd: 96, quality: 93 },
    { month: 'Feb', otd: 97, quality: 94 },
    { month: 'Mar', otd: 98, quality: 95 }
  ]);

  const [benchmarks] = useState([
    { name: 'Top Performers Avg', otd: 97, quality: 94 },
    { name: 'Market Avg', otd: 82, quality: 78 }
  ]);

  const ScoreBar = ({ label, score, icon, color }) => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: '#1F2937' }}>
          {icon} {label}
        </span>
        <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1F2937' }}>
          {score}/100
        </span>
      </div>
      <div style={{
        background: '#E5E7EB',
        borderRadius: '12px',
        height: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: color,
          height: '100%',
          width: `${score}%`,
          transition: 'width 0.3s ease',
          borderRadius: '12px'
        }}></div>
      </div>
    </div>
  );

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
          ⭐ Vendor Scorecard
        </h1>
        <p style={{ opacity: 0.9, margin: 0 }}>
          Bảng xếp hạng hiệu suất cung cấp toàn diện
        </p>
      </div>

      {/* Overall Score */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '2rem',
        textAlign: 'center',
        borderTop: '8px solid #667eea'
      }}>
        <p style={{ color: '#6B7280', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
          Điểm Tổng Hợp
        </p>
        <p style={{
          fontSize: '5rem',
          fontWeight: '900',
          color: '#667eea',
          margin: '0 0 0.5rem 0',
          textShadow: '0 2px 4px rgba(102, 126, 234, 0.2)'
        }}>
          {scorecard.overall}
        </p>
        <p style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          color: '#10B981',
          margin: '0 0 1.5rem 0'
        }}>
          🏆 Ranking: Top {scorecard.ranking} / {scorecard.totalSuppliers} NCC
        </p>
        <p style={{
          color: '#6B7280',
          fontSize: '0.9rem',
          margin: 0
        }}>
          Bạn là nhà cung cấp hàng đầu!
        </p>
      </div>

      {/* Detailed Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Left: Scores */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginTop: 0, color: '#1F2937', fontSize: '1.2rem', marginBottom: '2rem' }}>
            📊 Chi Tiết Thành Phần
          </h2>

          <ScoreBar label="Giao Hàng Đúng Hạn (OTD)" score={scorecard.otd} icon="📦" color="#10B981" />
          <ScoreBar label="Chất Lượng Sản Phẩm" score={scorecard.quality} icon="✨" color="#3B82F6" />
          <ScoreBar label="Phản Hồi Nhanh" score={scorecard.responsiveness} icon="⚡" color="#8B5CF6" />
          <ScoreBar label="Hoàn Chỉnh Tài Liệu" score={scorecard.documentation} icon="📝" color="#EC4899" />
          <ScoreBar label="Giá Cạnh Tranh" score={scorecard.priceCompetitiveness} icon="💰" color="#F59E0B" />
        </div>

        {/* Right: Comparison */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginTop: 0, color: '#1F2937', fontSize: '1.2rem', marginBottom: '2rem' }}>
            🎯 So Sánh Thị Trường
          </h2>

          {benchmarks.map((bench) => (
            <div key={bench.name} style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
              <p style={{ fontWeight: '700', color: '#1F2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                {bench.name}
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem',
                  marginBottom: '0.35rem'
                }}>
                  <span>OTD</span>
                  <span style={{ fontWeight: '700', color: '#10B981' }}>{bench.otd}%</span>
                </div>
                <div style={{
                  background: '#E5E7EB',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: '#10B981',
                    height: '100%',
                    width: `${bench.otd}%`
                  }}></div>
                </div>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem',
                  marginBottom: '0.35rem'
                }}>
                  <span>Quality</span>
                  <span style={{ fontWeight: '700', color: '#3B82F6' }}>{bench.quality}%</span>
                </div>
                <div style={{
                  background: '#E5E7EB',
                  borderRadius: '8px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: '#3B82F6',
                    height: '100%',
                    width: `${bench.quality}%`
                  }}></div>
                </div>
              </div>
            </div>
          ))}

          <div style={{
            padding: '1rem',
            background: '#F0FDF4',
            border: '1px solid #BBEF63',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#15803D', fontWeight: '600', margin: 0 }}>
              ✅ Bạn vượt trội hơn tất cả các tiêu chuẩn thị trường!
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginTop: 0, color: '#1F2937', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          📈 Xu Hướng 3 Tháng
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#6B7280' }}>Tháng</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#6B7280' }}>OTD</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#6B7280' }}>Quality</th>
              </tr>
            </thead>
            <tbody>
              {monthlyPerformance.map((month) => (
                <tr key={month.month} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#1F2937' }}>
                    {month.month}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '700',
                      color: '#10B981'
                    }}>
                      {month.otd}% <FaArrowUp style={{ fontSize: '0.8rem' }} />
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '700',
                      color: '#3B82F6'
                    }}>
                      {month.quality}% <FaArrowUp style={{ fontSize: '0.8rem' }} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Badges */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ marginTop: 0, color: '#1F2937', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          🏆 Huy Hiệu Thành Tích
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { icon: '⭐', title: 'Nhà cung cấp hàng đầu', color: '#FFD700' },
            { icon: '📦', title: 'Giao hàng đúng lúc', color: '#10B981' },
            { icon: '✨', title: 'Chất lượng xuất sắc', color: '#3B82F6' },
            { icon: '⚡', title: 'Phản hồi nhanh', color: '#8B5CF6' }
          ].map((badge) => (
            <div
              key={badge.title}
              style={{
                padding: '1.5rem',
                border: `2px solid ${badge.color}`,
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '0.75rem'
              }}>
                {badge.icon}
              </div>
              <p style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                {badge.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorScorecardPage;
