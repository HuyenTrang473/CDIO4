import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaMoon, FaSun, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { userProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('userTheme') === 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('userLanguage') || 'vi');
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || 'Người dùng',
    email: userProfile?.email || 'user@estate.vn',
    phone: userProfile?.phone || '0123456789',
    address: userProfile?.address || '',
    role: userProfile?.role || 'staff',
    workPlace: userProfile?.workPlace || 'Trụ sở',
    notifications: { email: true, system: true, lowStock: false },
    aiEnabled: userProfile?.aiEnabled || true
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData(prev => ({
        ...prev,
        name: userProfile.name || prev.name,
        email: userProfile.email || prev.email,
        phone: userProfile.phone || prev.phone,
        address: userProfile.address || prev.address,
        role: userProfile.role || prev.role,
        notifications: userProfile.notifications || prev.notifications,
        aiEnabled: userProfile.aiEnabled !== undefined ? userProfile.aiEnabled : prev.aiEnabled
      }));
    }
  }, [userProfile]);

  // Translations
  const translations = {
    vi: {
      settings: 'Cài đặt',
      manageAccount: 'Quản lý cài đặt tài khoản',
      updateInfo: 'Cập nhật thông tin cá nhân, bảo mật và tùy chọn giao diện.',
      profile: 'Thông tin cá nhân',
      security: 'Bảo mật',
      notifications: 'Thông báo',
      preferences: 'Tùy chọn',
      name: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      address: 'Địa chỉ thường trú',
      workplace: 'Vị trí công tác',
      role: 'Vị trí',
      currentPassword: 'Mật khẩu hiện tại',
      newPassword: 'Mật khẩu mới',
      confirmPassword: 'Xác nhận mật khẩu',
      updatePassword: 'Cập nhật mật khẩu',
      enableEmail: 'Email thông báo',
      enableSystem: 'Thông báo hệ thống',
      enableLowStock: 'Cảnh báo hàng sắp hết',
      theme: 'Giao diện',
      lightMode: 'Chế độ sáng',
      darkMode: 'Chế độ tối',
      language: 'Ngôn ngữ',
      vietnamese: 'Tiếng Việt',
      english: 'English',
      aiEnabled: 'Bật AI Insights',
      save: 'Lưu thay đổi',
      saved: 'Đã lưu thành công!',
      required: 'Trường này là bắt buộc',
      invalidEmail: 'Email không hợp lệ',
      invalidPhone: 'Số điện thoại không hợp lệ'
    },
    en: {
      settings: 'Settings',
      manageAccount: 'Manage Account Settings',
      updateInfo: 'Update personal information, security, and interface preferences.',
      profile: 'Personal Information',
      security: 'Security',
      notifications: 'Notifications',
      preferences: 'Preferences',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      address: 'Address',
      workplace: 'Workplace',
      role: 'Position',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      updatePassword: 'Update Password',
      enableEmail: 'Email Notifications',
      enableSystem: 'System Notifications',
      enableLowStock: 'Low Stock Alerts',
      theme: 'Interface',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      language: 'Language',
      vietnamese: 'Tiếng Việt',
      english: 'English',
      aiEnabled: 'Enable AI Insights',
      save: 'Save Changes',
      saved: 'Saved successfully!',
      required: 'This field is required',
      invalidEmail: 'Invalid email',
      invalidPhone: 'Invalid phone number'
    }
  };

  const t = translations[language];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleThemeChange = (isDark) => {
    setIsDarkMode(isDark);
    localStorage.setItem('userTheme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    setSaved(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('userLanguage', lang);
    setSaved(false);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveProfile = () => {
    // Validation
    if (!profileData.name.trim()) {
      alert(t.required);
      return;
    }
    if (!validateEmail(profileData.email)) {
      alert(t.invalidEmail);
      return;
    }
    if (profileData.phone && !validatePhone(profileData.phone)) {
      alert(t.invalidPhone);
      return;
    }

    updateProfile({
      ...profileData,
      theme: isDarkMode ? 'dark' : 'light',
      language: language
    });
    showToast('Cài đặt đã được lưu thành công!');
    setTimeout(() => setSaved(false), 3000);
  };

  const renderTabContent = () => {
    const bgColor = isDarkMode ? '#2a2a2a' : '#FEF9F2';
    const textColor = isDarkMode ? '#e0e0e0' : '#3D2B1F';
    const borderColor = isDarkMode ? '#444' : '#F1E9DE';
    const inputBg = isDarkMode ? '#333' : '#FDF8F1';
    
    if (activeTab === 'Security') {
      return (
        <section style={{
          backgroundColor: bgColor,
          borderRadius: '25px',
          padding: '32px',
          border: `1px solid ${borderColor}`,
          color: textColor
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔒 {t.security}
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase' }}>
                {t.currentPassword}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    backgroundColor: inputBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '14px',
                    color: textColor,
                    outline: 'none'
                  }}
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
                    color: isDarkMode ? '#aaa' : '#A68B6D',
                    fontSize: '16px'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase' }}>
                {t.newPassword}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  backgroundColor: inputBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  color: textColor,
                  outline: 'none'
                }}
              />
            </div>
            <button
              style={{
                backgroundColor: '#3D2B1F',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              {t.updatePassword}
            </button>
          </div>
        </section>
      );
    }

    if (activeTab === 'Notifications') {
      return (
        <section style={{
          backgroundColor: bgColor,
          borderRadius: '25px',
          padding: '32px',
          border: `1px solid ${borderColor}`,
          color: textColor
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 {t.notifications}
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { key: 'email', label: t.enableEmail },
              { key: 'system', label: t.enableSystem },
              { key: 'lowStock', label: t.enableLowStock }
            ].map(item => (
              <label
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: isDarkMode ? '#333' : '#white',
                  borderRadius: '16px',
                  border: `1px solid ${borderColor}`,
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '14px', color: textColor }}>{item.label}</span>
                <input
                  type="checkbox"
                  checked={profileData.notifications[item.key]}
                  onChange={() =>
                    setProfileData(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, [item.key]: !prev.notifications[item.key] }
                    }))
                  }
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                />
              </label>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === 'Preferences') {
      return (
        <section style={{
          backgroundColor: bgColor,
          borderRadius: '25px',
          padding: '32px',
          border: `1px solid ${borderColor}`,
          color: textColor
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚙️ {t.preferences}
          </h3>
          <div style={{ display: 'grid', gap: '32px' }}>
            {/* Theme */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
                {t.theme}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => handleThemeChange(false)}
                  style={{
                    borderRadius: '12px',
                    padding: '16px',
                    border: !isDarkMode ? '2px solid #3D2B1F' : `1px solid ${borderColor}`,
                    backgroundColor: !isDarkMode ? '#fff' : inputBg,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: textColor,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  <FaSun /> {t.lightMode}
                </button>
                <button
                  onClick={() => handleThemeChange(true)}
                  style={{
                    borderRadius: '12px',
                    padding: '16px',
                    border: isDarkMode ? '2px solid #3D2B1F' : `1px solid ${borderColor}`,
                    backgroundColor: isDarkMode ? '#fff' : inputBg,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: isDarkMode ? '#3D2B1F' : textColor,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  <FaMoon /> {t.darkMode}
                </button>
              </div>
            </div>

            {/* Language */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
                <FaGlobe style={{ marginRight: '8px' }} /> {t.language}
              </label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: inputBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '14px',
                  color: textColor,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="vi">{t.vietnamese}</option>
                <option value="en">{t.english}</option>
              </select>
            </div>

            {/* AI Toggle */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
                🤖 AI Insights
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: isDarkMode ? '#333' : '#white',
                  borderRadius: '16px',
                  border: `1px solid ${borderColor}`,
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '14px', color: textColor }}>{t.aiEnabled}</span>
                <input
                  type="checkbox"
                  checked={profileData.aiEnabled}
                  onChange={() =>
                    setProfileData(prev => ({
                      ...prev,
                      aiEnabled: !prev.aiEnabled
                    }))
                  }
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                />
              </label>
            </div>
          </div>
        </section>
      );
    }

    // Profile tab
    return (
      <section style={{
        backgroundColor: bgColor,
        borderRadius: '25px',
        padding: '32px',
        border: `1px solid ${borderColor}`,
        color: textColor
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          👤 {t.profile}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase' }}>
              {t.name} *
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{
                width: '100%',
                backgroundColor: inputBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                color: textColor,
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
            />
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase' }}>
              {t.email} *
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                backgroundColor: inputBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                color: textColor,
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase' }}>
              {t.phone}
            </label>
            <input
              type="text"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+84 901 234 567"
              style={{
                width: '100%',
                backgroundColor: inputBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                color: textColor,
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase' }}>
              {t.role}
            </label>
            <input
              type="text"
              value={profileData.role}
              readOnly
              style={{
                width: '100%',
                backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                color: isDarkMode ? '#999' : '#A68B6D',
                outline: 'none'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gap: '8px', marginBottom: '24px' }}>
          <label style={{ fontSize: '10px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase' }}>
            {t.address}
          </label>
          <input
            type="text"
            value={profileData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="123 Đường, Quận 1, TP HCM"
            style={{
              width: '100%',
              backgroundColor: inputBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '12px',
              fontSize: '14px',
              color: textColor,
              outline: 'none'
            }}
          />
        </div>
        {saved && (
          <div style={{
            backgroundColor: '#E8F5E9',
            color: '#2E7D32',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ✓ {t.saved}
          </div>
        )}
        <button
          onClick={handleSaveProfile}
          style={{
            backgroundColor: '#3D2B1F',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {t.save}
        </button>
      </section>
    );
  };

  const bgColor = isDarkMode ? '#1a1a1a' : '#F8F3EC';
  const textColor = isDarkMode ? '#e0e0e0' : '#3D2B1F';
  const borderColor = isDarkMode ? '#444' : '#EEDDC8';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      color: textColor,
      padding: '32px 24px',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '32px' }}>
        <header>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#A68B6D', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
            {t.settings}
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '12px 0 8px 0' }}>
            {t.manageAccount}
          </h1>
          <p style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#7A6352', maxWidth: '500px', margin: 0, lineHeight: '1.6' }}>
            {t.updateInfo}
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
          {/* Sidebar */}
          <aside style={{ display: 'grid', gap: '8px' }}>
            {['Profile', 'Security', 'Notifications', 'Preferences'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  textAlign: 'left',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: activeTab === tab ? `2px solid #3D2B1F` : `1px solid ${borderColor}`,
                  backgroundColor: activeTab === tab ? '#fff' : 'transparent',
                  color: activeTab === tab ? '#3D2B1F' : textColor,
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {tab === 'Profile' ? '👤 ' : tab === 'Security' ? '🔒 ' : tab === 'Notifications' ? '🔔 ' : '⚙️ '}
                {tab}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main>
            {renderTabContent()}
          </main>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4A6741',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;