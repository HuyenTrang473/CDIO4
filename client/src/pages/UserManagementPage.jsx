import React, { useState, useEffect } from 'react';
import { FaUser, FaTrash, FaPlus, FaEdit, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Nhân viên',
    phone: '',
    department: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const roles = ['Quản trị viên', 'Trưởng kho', 'Nhân viên kho', 'Nhà cung cấp', 'Chủ doanh nghiệp'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Mock data - In thực tế sẽ gọi API
      const mockUsers = [
        { _id: '1', name: 'Nguyễn Văn Admin', email: 'admin@warehouse.vn', role: 'Quản trị viên', phone: '0988123456', department: 'IT', createdAt: '2025-01-15' },
        { _id: '2', name: 'Trần Thị Kho', email: 'kho@warehouse.vn', role: 'Trưởng kho', phone: '0912345678', department: 'Kho hàng', createdAt: '2025-02-01' },
        { _id: '3', name: 'Lê Văn Nhân', email: 'nhan@warehouse.vn', role: 'Nhân viên kho', phone: '0876543210', department: 'Kho hàng', createdAt: '2025-02-05' },
        { _id: '4', name: 'Ông Hòa NCC', email: 'honcc@supplier.vn', role: 'Nhà cung cấp', phone: '0901234567', department: 'Cung cấp', createdAt: '2025-02-10' },
        { _id: '5', name: 'Phạm Minh Chủ', email: 'owner@warehouse.vn', role: 'Chủ doanh nghiệp', phone: '0987654321', department: 'Ban lãnh đạo', createdAt: '2025-01-01' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Lỗi tải người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      setUsers(users.map(u => u._id === editingId ? { ...u, ...formData } : u));
      alert('✅ Cập nhật người dùng thành công!');
    } else {
      // Add new
      const newUser = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      alert('✅ Thêm người dùng mới thành công!');
    }
    resetForm();
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      department: user.department
    });
    setEditingId(user._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(u => u._id !== id));
      alert('✅ Xóa người dùng thành công!');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'Nhân viên', phone: '', department: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937' }}>
          👥 Quản Lý Tài Khoản Người Dùng
        </h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{
            background: '#F97316',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaPlus /> {showForm ? 'Hủy' : 'Thêm Người Dùng'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#1F2937', fontSize: '1.5rem' }}>
            {editingId ? '✏️ Chỉnh Sửa Người Dùng' : '➕ Thêm Người Dùng Mới'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Tên Người Dùng
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="nguyen@warehouse.vn"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Vai Trò
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Điện Thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="0123456789"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Phòng Ban
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Kho hàng, IT, etc."
                />
              </div>
            </div>
            <button
              type="submit"
              style={{
                marginTop: '1.5rem',
                background: '#10B981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {editingId ? '💾 Lưu Thay Đổi' : '✅ Thêm Mới'}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <FaSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#9CA3AF' }} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #F97316 0%, #FCD34D 100%)', color: 'white' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Tên</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Vai Trò</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Điện Thoại</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Phòng Ban</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                style={{
                  borderBottom: index < filteredUsers.length - 1 ? '1px solid #E5E7EB' : 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.closest('tr').style.background = '#FEF7DC'}
                onMouseLeave={(e) => e.target.closest('tr').style.background = 'white'}
              >
                <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                <td style={{ padding: '1rem', color: '#6B7280' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: '#DBEAFE',
                    color: '#1E40AF',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#6B7280' }}>{user.phone}</td>
                <td style={{ padding: '1rem', color: '#6B7280' }}>{user.department}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      background: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaEdit className="text-sm" /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaTrash className="text-sm" /> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#DBEAFE', borderRadius: '12px', textAlign: 'center' }}>
        <p style={{ color: '#1E40AF', fontWeight: '600', margin: 0 }}>
          📊 Tổng số người dùng: <strong>{users.length}</strong>
        </p>
      </div>
    </div>
  );
};

export default UserManagementPage;
