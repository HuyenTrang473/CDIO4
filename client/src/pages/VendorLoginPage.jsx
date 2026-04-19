import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCoffee, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaSuperpowers } from 'react-icons/fa';

const VendorLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('honcc@supplier.vn');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVendorLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Vendor login validation (mock)
      if (!email || !password) {
        setError('⚠️ Vui lòng nhập email và mật khẩu');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('⚠️ Email không hợp lệ');
        setLoading(false);
        return;
      }

      // Mock vendor data
      const vendorData = {
        id: 'vendor-001',
        name: 'Ông Hòa Coffee',
        email: email,
        role: 'vendor',
        avatar: '☕',
        token: 'vendor-jwt-token-' + Date.now()
      };

      // Store in localStorage (vendor mode)
      localStorage.setItem('vendorToken', vendorData.token);
      localStorage.setItem('vendorEmail', email);
      localStorage.setItem('vendorName', vendorData.name);
      localStorage.setItem('vendorRole', 'vendor');
      localStorage.setItem('isVendor', 'true');

      // Redirect to vendor dashboard
      navigate('/vendor/dashboard', { replace: true });
    } catch (err) {
      setError('❌ Login thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '450px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3.5rem',
            marginBottom: '1rem',
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '20px',
            borderRadius: '50%'
          }}>
            <FaSuperpowers />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
            Vendor Portal
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: 0 }}>
            Nền tảng quản lý đơn hàng cho nhà cung cấp
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '2.5rem' }}>
          <form onSubmit={handleVendorLogin}>
            {/* Error Message */}
            {error && (
              <div style={{
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                <FaEnvelope style={{ marginRight: '6px' }} />
                Email Nhà Cung Cấp
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="vendor@supplier.vn"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                <FaLock style={{ marginRight: '6px' }} />
                Mật Khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    paddingRight: '45px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280',
                    fontSize: '1.1rem'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng Nhập Vendor
                  <FaArrowRight style={{ fontSize: '0.9rem' }} />
                </>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#F0F4FF',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#4C1D95'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
              🔓 Demo Vendors:
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li>honcc@supplier.vn / password123</li>
              <li>minh@supplier.vn / password123</li>
              <li>international@supplier.vn / password123</li>
            </ul>
          </div>

          {/* Switch to Customer */}
          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            borderTop: '1px solid #E5E7EB',
            paddingTop: '1.5rem'
          }}>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
              Bạn là khách hàng?
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#F3F4F6';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
              }}
            >
              Đăng Nhập Khách Hàng
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VendorLoginPage;
