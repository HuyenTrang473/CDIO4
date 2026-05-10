import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaPlus, FaSearch, FaThLarge, FaList, FaPen, FaTimes, FaBoxOpen, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

// ─── Helpers ────────────────────────────────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatPrice = (num) => {
  if (!num && num !== 0) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

// ─── Main Component ──────────────────────────────────────────────────────────
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Bộ lọc & tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modal tạo / sửa
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = tạo mới
  const [formData, setFormData] = useState(defaultForm());
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch dữ liệu ──────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const headers = getAuthHeaders();
      const [prodRes, catRes, supRes] = await Promise.all([
        axios.get('/api/products', { headers }),
        axios.get('/api/categories', { headers }),
        axios.get('/api/suppliers', { headers }),
      ]);
      setProducts(prodRes.data.data ?? []);
      setCategories(catRes.data.data ?? []);
      setSuppliers(supRes.data.data ?? []);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Lọc & tìm kiếm phía client ─────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      const matchCat =
        !selectedCategory || p.category?._id === selectedCategory || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // ── Thống kê ───────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter((p) => p.stockQuantity <= p.minimumStock && p.stockQuantity > 0).length;
    const outOfStock = products.filter((p) => p.stockQuantity === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.salePrice * p.stockQuantity || 0), 0);
    return { total, lowStock, outOfStock, totalValue };
  }, [products]);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingProduct(null);
    setFormData(defaultForm());
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name ?? '',
      sku: product.sku ?? '',
      description: product.description ?? '',
      costPrice: product.costPrice ?? '',
      salePrice: product.salePrice ?? '',
      unit: product.unit ?? '',
      minimumStock: product.minimumStock ?? 10,
      category: product.category?._id ?? product.category ?? '',
      supplier: product.supplier?._id ?? product.supplier ?? '',
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingProduct(null); };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const headers = getAuthHeaders();
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData, { headers });
      } else {
        await axios.post('/api/products', formData, { headers });
      }
      closeModal();
      fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Lỗi khi lưu sản phẩm.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '40px', backgroundColor: '#FDFCF0', minHeight: '100%' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#A89B8D', margin: 0 }}>KHO PB10</p>
          <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#3D2B1F', margin: '4px 0' }}>Quản lý Sản phẩm</h2>
          <p style={{ fontSize: '13px', color: '#7A6352', maxWidth: '500px', lineHeight: '1.5' }}>
            Theo dõi chính xác bộ sưu tập cà phê thượng hạng. Quản lý từ Arabica Cao nguyên đến Robusta Di sản.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={btnCreateStyle} onClick={openCreate}>
            <FaPlus /> Tạo Sản phẩm
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div style={errorBannerStyle}>⚠️ {error}</div>
      )}

      {/* THỐNG KÊ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <StatItem title="TỔNG SKU" value={loading ? '...' : stats.total} />
        <StatItem title="SẮP HẾT HÀNG" value={loading ? '...' : stats.lowStock} highlight={stats.lowStock > 0} />
        <StatItem title="HẾT HÀNG" value={loading ? '...' : stats.outOfStock} highlight={stats.outOfStock > 0} />
        <StatItem title="GIÁ TRỊ TỒN KHO" value={loading ? '...' : formatPrice(stats.totalValue)} small />
      </div>

      {/* SEARCH & FILTER */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={searchContainerStyle}>
          <FaSearch color="#A89B8D" />
          <input
            type="text"
            placeholder="Tìm theo tên, SKU, mô tả..."
            style={searchInputStyle}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89B8D' }}>
              <FaTimes size={12} />
            </button>
          )}
        </div>

        <select
          style={selectStyle}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Tất cả Danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <div style={viewToggleStyle}>
          <button style={viewMode === 'grid' ? activeViewBtn : viewBtn} onClick={() => setViewMode('grid')}>
            <FaThLarge />
          </button>
          <button style={viewMode === 'list' ? activeViewBtn : viewBtn} onClick={() => setViewMode('list')}>
            <FaList />
          </button>
        </div>

        {(searchQuery || selectedCategory) && (
          <span style={{ fontSize: '12px', color: '#8B5E3C', fontWeight: 'bold' }}>
            {filteredProducts.length} kết quả
          </span>
        )}
      </div>

      {/* PRODUCT LIST */}
      {loading ? (
        <div style={centerStyle}>
          <FaSpinner size={30} color="#A89B8D" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#A89B8D', marginTop: '12px' }}>Đang tải sản phẩm...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={centerStyle}>
          <FaBoxOpen size={40} color="#DDB892" />
          <p style={{ color: '#A89B8D', marginTop: '12px', fontWeight: 'bold' }}>
            {searchQuery || selectedCategory ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có sản phẩm nào. Hãy tạo mới!'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {filteredProducts.map((p) => (
            <ProductCard key={p._id} product={p} onEdit={() => openEdit(p)} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredProducts.map((p) => (
            <ProductRow key={p._id} product={p} onEdit={() => openEdit(p)} />
          ))}
        </div>
      )}

      {/* MODAL TẠO / SỬA */}
      {showModal && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#3D2B1F' }}>
                {editingProduct ? 'Chỉnh sửa Sản phẩm' : 'Tạo Sản phẩm Mới'}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A89B8D' }}>
                <FaTimes size={20} />
              </button>
            </div>

            {formError && <div style={errorBannerStyle}>{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div style={formGridStyle}>
                <FormField label="Tên sản phẩm *" name="name" value={formData.name} onChange={handleFormChange} required />
                <FormField label="Mã SKU *" name="sku" value={formData.sku} onChange={handleFormChange} required />
                <FormField label="Đơn vị tính *" name="unit" value={formData.unit} onChange={handleFormChange} placeholder="vd: kg, bao, thùng" required />
                <FormField label="Tồn kho tối thiểu" name="minimumStock" type="number" value={formData.minimumStock} onChange={handleFormChange} />
                <FormField label="Giá nhập (VND) *" name="costPrice" type="number" value={formData.costPrice} onChange={handleFormChange} required />
                <FormField label="Giá bán (VND) *" name="salePrice" type="number" value={formData.salePrice} onChange={handleFormChange} required />
              </div>

              {/* Danh mục */}
              <div style={fieldWrapStyle}>
                <label style={fieldLabelStyle}>Danh mục</label>
                <select name="category" value={formData.category} onChange={handleFormChange} style={fieldInputStyle}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Nhà cung cấp */}
              <div style={fieldWrapStyle}>
                <label style={fieldLabelStyle}>Nhà cung cấp</label>
                <select name="supplier" value={formData.supplier} onChange={handleFormChange} style={fieldInputStyle}>
                  <option value="">-- Chọn nhà cung cấp --</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Mô tả */}
              <div style={fieldWrapStyle}>
                <label style={fieldLabelStyle}>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  style={{ ...fieldInputStyle, resize: 'vertical' }}
                  placeholder="Mô tả ngắn về sản phẩm..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={closeModal} style={btnCancelStyle}>Hủy</button>
                <button type="submit" disabled={submitting} style={btnSubmitStyle}>
                  {submitting ? 'Đang lưu...' : (editingProduct ? 'Cập nhật' : 'Tạo sản phẩm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function defaultForm() {
  return { name: '', sku: '', description: '', costPrice: '', salePrice: '', unit: '', minimumStock: 10, category: '', supplier: '' };
}

function getStockStatus(p) {
  if (p.stockQuantity === 0) return { label: 'HẾT HÀNG', color: '#C0392B' };
  if (p.stockQuantity <= p.minimumStock) return { label: 'SẮP HẾT', color: '#8B5E3C' };
  return { label: 'CÒN HÀNG', color: '#4A6741' };
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const StatItem = ({ title, value, highlight, small }) => (
  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '4px', border: `1px solid ${highlight ? '#FECDCA' : '#EFE3D5'}`, textAlign: 'left' }}>
    <p style={{ fontSize: '11px', fontWeight: 'bold', color: highlight ? '#C0392B' : '#A89B8D', marginBottom: '8px', letterSpacing: '0.5px' }}>{title}</p>
    <div style={{ fontSize: small ? '20px' : '32px', fontWeight: '900', color: highlight ? '#C0392B' : '#3D2B1F' }}>{value}</div>
  </div>
);

const ProductCard = ({ product: p, onEdit }) => {
  const status = getStockStatus(p);
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #EFE3D5' }}>
      <div style={{ position: 'relative', height: '160px', backgroundColor: '#F5EDE0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FaBoxOpen size={48} color="#DDB892" />
        <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: status.color, color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>
          {status.label}
        </span>
        <span style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', fontSize: '9px', padding: '3px 7px', borderRadius: '4px' }}>
          SKU: {p.sku}
        </span>
      </div>
      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#DDB892', marginBottom: '4px', margin: '0 0 4px 0' }}>
          {p.category?.name ?? 'Chưa phân loại'}
        </p>
        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#3D2B1F', margin: '0 0 14px 0' }}>{p.name}</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <div style={infoTagStyle}>
            <span style={labelStyle}>ĐƠN VỊ</span>
            <span style={valueStyle}>{p.unit}</span>
          </div>
          <div style={infoTagStyle}>
            <span style={labelStyle}>TỒN KHO</span>
            <span style={valueStyle}>{p.stockQuantity ?? 0}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#3D2B1F' }}>{formatPrice(p.salePrice)}</span>
          <button onClick={onEdit} style={editBtnStyle} title="Chỉnh sửa">
            <FaPen size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductRow = ({ product: p, onEdit }) => {
  const status = getStockStatus(p);
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px 20px', border: '1px solid #EFE3D5', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', backgroundColor: '#F5EDE0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FaBoxOpen size={18} color="#DDB892" />
      </div>
      <div style={{ flex: 2 }}>
        <p style={{ margin: 0, fontWeight: '800', color: '#3D2B1F', fontSize: '14px' }}>{p.name}</p>
        <p style={{ margin: 0, fontSize: '11px', color: '#A89B8D' }}>SKU: {p.sku} · {p.category?.name ?? '—'}</p>
      </div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <span style={{ backgroundColor: status.color, color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>{status.label}</span>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#3D2B1F', fontWeight: 'bold' }}>{p.stockQuantity ?? 0} {p.unit}</p>
      </div>
      <div style={{ flex: 1, textAlign: 'right' }}>
        <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#3D2B1F' }}>{formatPrice(p.salePrice)}</p>
        <p style={{ margin: 0, fontSize: '11px', color: '#A89B8D' }}>Nhập: {formatPrice(p.costPrice)}</p>
      </div>
      <button onClick={onEdit} style={editBtnStyle} title="Chỉnh sửa"><FaPen size={12} /></button>
    </div>
  );
};

const FormField = ({ label, name, value, onChange, type = 'text', required, placeholder }) => (
  <div style={fieldWrapStyle}>
    <label style={fieldLabelStyle}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      style={fieldInputStyle}
      min={type === 'number' ? 0 : undefined}
    />
  </div>
);

// ─── Styles ──────────────────────────────────────────────────────────────────
const btnCreateStyle = { backgroundColor: '#3D2B1F', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const searchContainerStyle = { flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#EFE3D5', padding: '0 15px', borderRadius: '8px', gap: '8px' };
const searchInputStyle = { backgroundColor: 'transparent', border: 'none', padding: '12px 0', width: '100%', outline: 'none', color: '#3D2B1F', fontWeight: '500' };
const selectStyle = { padding: '12px', border: 'none', backgroundColor: '#EFE3D5', borderRadius: '8px', fontWeight: 'bold', color: '#3D2B1F', cursor: 'pointer' };
const viewToggleStyle = { display: 'flex', backgroundColor: '#EFE3D5', padding: '4px', borderRadius: '8px' };
const viewBtn = { border: 'none', backgroundColor: 'transparent', padding: '8px 12px', cursor: 'pointer', color: '#A89B8D', borderRadius: '6px' };
const activeViewBtn = { ...viewBtn, backgroundColor: 'white', color: '#3D2B1F', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const infoTagStyle = { backgroundColor: '#FDF7F0', padding: '8px 12px', borderRadius: '4px', flex: 1 };
const labelStyle = { display: 'block', fontSize: '8px', color: '#A89B8D', fontWeight: 'bold', marginBottom: '2px' };
const valueStyle = { fontSize: '11px', fontWeight: 'bold', color: '#3D2B1F' };
const editBtnStyle = { backgroundColor: '#EFE3D5', border: 'none', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3D2B1F', flexShrink: 0 };
const errorBannerStyle = { padding: '12px 16px', backgroundColor: '#fde8e8', color: '#c81e1e', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' };
const centerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', color: '#A89B8D' };
const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalStyle = { backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };
const formGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' };
const fieldWrapStyle = { marginBottom: '16px' };
const fieldLabelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#5C4033', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const fieldInputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #EFE3D5', borderRadius: '8px', fontSize: '13px', color: '#3D2B1F', outline: 'none', boxSizing: 'border-box', backgroundColor: '#FDFCF9' };
const btnCancelStyle = { padding: '10px 20px', border: '1px solid #EFE3D5', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold', color: '#7A6352' };
const btnSubmitStyle = { padding: '10px 24px', border: 'none', borderRadius: '8px', backgroundColor: '#3D2B1F', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };

export default ProductManagement;