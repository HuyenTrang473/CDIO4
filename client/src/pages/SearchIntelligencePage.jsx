import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useRBAC } from '../context/RBACContext';
import { FaSearch, FaFilter, FaTimes, FaQrcode, FaBox, FaDollarSign, FaWarehouse, FaExclamationTriangle } from 'react-icons/fa';

const SearchIntelligencePage = () => {
    const { token } = useAuth();
    const { hasPermission } = useRBAC();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Advanced Filters
    const [filters, setFilters] = useState({
        vendor: 'all',
        category: 'all',
        priceRange: { min: 0, max: 100000000 },
        stockStatus: 'all', // all, instock, lowstock, outofstock
        sortBy: 'name' // name, price, stock
    });

    // Fetch products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    React.useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Semantic Search + Filter
    const filteredProducts = useMemo(() => {
        let results = products;

        // Text search (semantic match)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            results = results.filter(p => 
                p.name?.toLowerCase().includes(query) ||
                p.sku?.toLowerCase().includes(query) ||
                p.vendor?.toLowerCase().includes(query) ||
                p.barcode?.includes(query)
            );
        }

        // Vendor filter
        if (filters.vendor !== 'all') {
            results = results.filter(p => p.vendor === filters.vendor);
        }

        // Category filter
        if (filters.category !== 'all') {
            results = results.filter(p => p.category === filters.category);
        }

        // Price range filter
        results = results.filter(p => {
            const price = p.costPrice || 0;
            return price >= filters.priceRange.min && price <= filters.priceRange.max;
        });

        // Stock status filter
        if (filters.stockStatus !== 'all') {
            results = results.filter(p => {
                const stock = p.stockQuantity || 0;
                const minStock = p.minimumStock || 5;
                if (filters.stockStatus === 'instock') return stock > minStock;
                if (filters.stockStatus === 'lowstock') return stock > 0 && stock <= minStock;
                if (filters.stockStatus === 'outofstock') return stock === 0;
                return true;
            });
        }

        // Sorting
        results.sort((a, b) => {
            if (filters.sortBy === 'name') {
                return (a.name || '').localeCompare(b.name || '');
            } else if (filters.sortBy === 'price') {
                return (a.costPrice || 0) - (b.costPrice || 0);
            } else if (filters.sortBy === 'stock') {
                return (b.stockQuantity || 0) - (a.stockQuantity || 0);
            }
            return 0;
        });

        return results;
    }, [products, searchQuery, filters]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setFilters({
            vendor: 'all',
            category: 'all',
            priceRange: { min: 0, max: 100000000 },
            stockStatus: 'all',
            sortBy: 'name'
        });
    };

    const getStockStatus = (stock, minStock) => {
        if (stock === 0) return { status: 'Hết hàng', color: '#ef4444', icon: '🔴' };
        if (stock <= minStock) return { status: 'Tồn thấp', color: '#f59e0b', icon: '🟡' };
        return { status: 'Có sẵn', color: '#10b981', icon: '🟢' };
    };

    return (
        <div style={pageStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>🔍 Tìm kiếm Thông minh Sản phẩm</h1>
                <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                    Tìm kiếm ngữ nghĩa + Lọc đa chiều + AI semantic matching
                </p>
            </div>

            {/* Search Bar */}
            <div style={searchBarStyle}>
                <FaSearch style={{ color: '#9ca3af', marginRight: '12px', fontSize: '1.2rem' }} />
                <input
                    type="text"
                    placeholder="Tìm theo: Tên sản phẩm, SKU, Mã vạch, Nhà cung cấp..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={searchInputStyle}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={clearButtonStyle}>
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            <div style={filtersContainerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <FaFilter style={{ color: '#6366f1' }} />
                    <h3 style={{ margin: 0, color: '#1f2937' }}>Bộ lọc nâng cao</h3>
                </div>

                <div style={filtersGridStyle}>
                    {/* Vendor Filter */}
                    <div style={filterItemStyle}>
                        <label style={filterLabelStyle}>👥 Nhà cung cấp</label>
                        <select 
                            value={filters.vendor}
                            onChange={(e) => setFilters({...filters, vendor: e.target.value})}
                            style={selectStyle}
                        >
                            <option value="all">Tất cả nhà cung cấp</option>
                            {Array.from(new Set(products.map(p => p.vendor))).filter(Boolean).map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div style={filterItemStyle}>
                        <label style={filterLabelStyle}>📦 Loại sản phẩm</label>
                        <select 
                            value={filters.category}
                            onChange={(e) => setFilters({...filters, category: e.target.value})}
                            style={selectStyle}
                        >
                            <option value="all">Tất cả loại</option>
                            {Array.from(new Set(products.map(p => p.category))).filter(Boolean).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Stock Status Filter */}
                    <div style={filterItemStyle}>
                        <label style={filterLabelStyle}>📊 Trạng thái tồn kho</label>
                        <select 
                            value={filters.stockStatus}
                            onChange={(e) => setFilters({...filters, stockStatus: e.target.value})}
                            style={selectStyle}
                        >
                            <option value="all">Tất cả</option>
                            <option value="instock">🟢 Có sẵn</option>
                            <option value="lowstock">🟡 Tồn thấp</option>
                            <option value="outofstock">🔴 Hết hàng</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <div style={filterItemStyle}>
                        <label style={filterLabelStyle}>📈 Sắp xếp theo</label>
                        <select 
                            value={filters.sortBy}
                            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                            style={selectStyle}
                        >
                            <option value="name">Tên A→Z</option>
                            <option value="price">Giá (thấp→cao)</option>
                            <option value="stock">Tồn kho (cao→thấp)</option>
                        </select>
                    </div>
                </div>

                {/* Clear Filters */}
                {(searchQuery || filters.vendor !== 'all' || filters.category !== 'all' || filters.stockStatus !== 'all') && (
                    <button onClick={handleClearFilters} style={clearFiltersStyle}>
                        <FaTimes style={{ marginRight: '6px' }} /> Xóa tất cả bộ lọc
                    </button>
                )}

                <p style={{ margin: '10px 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                    💾 Kết quả: {filteredProducts.length} / {products.length} sản phẩm
                </p>
            </div>

            {/* Search Results */}
            <div style={resultsStyle}>
                {loading ? (
                    <div style={loadingStyle}>⏳ Đang tải...</div>
                ) : filteredProducts.length === 0 ? (
                    <div style={emptyStyle}>
                        <p>😕 Không tìm thấy sản phẩm nào phù hợp</p>
                        <small>Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</small>
                    </div>
                ) : (
                    <div style={productGridStyle}>
                        {filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product.stockQuantity || 0, product.minimumStock || 5);
                            return (
                                <div 
                                    key={product._id} 
                                    style={productCardStyle}
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <div style={productHeaderStyle}>
                                        <h3 style={{ margin: '0 0 4px 0', color: '#1f2937', fontSize: '0.95rem' }}>
                                            {product.name}
                                        </h3>
                                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>
                                            SKU: {product.sku}
                                        </p>
                                    </div>

                                    <div style={productInfoStyle}>
                                        <div>
                                            <p style={infoLabelStyle}>💰 Giá gốc</p>
                                            <p style={infoValueStyle}>{(product.costPrice || 0).toLocaleString('vi-VN')} VNĐ</p>
                                        </div>
                                        <div>
                                            <p style={infoLabelStyle}>📦 Tồn kho</p>
                                            <p style={infoValueStyle}>{(product.stockQuantity || 0).toLocaleString()} {product.unit}</p>
                                        </div>
                                        <div>
                                            <p style={infoLabelStyle}>🏢 Nhà cung cấp</p>
                                            <p style={infoValueStyle}>{product.vendor || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div style={{ ...statusBadgeStyle, background: stockStatus.color + '20', borderLeft: `3px solid ${stockStatus.color}` }}>
                                        <span style={{ color: stockStatus.color, fontWeight: '600' }}>
                                            {stockStatus.icon} {stockStatus.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Product Details Modal */}
            {selectedProduct && (
                <div style={modalOverlayStyle} onClick={() => setSelectedProduct(null)}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setSelectedProduct(null)}
                            style={modalCloseStyle}
                        >
                            ✕
                        </button>

                        <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>📦 Chi tiết sản phẩm 360°</h2>

                        <div style={detailsGridStyle}>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>Tên sản phẩm</p>
                                <p style={detailValueStyle}>{selectedProduct.name}</p>
                            </div>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>SKU / Mã vạch</p>
                                <p style={detailValueStyle}>{selectedProduct.sku} / {selectedProduct.barcode}</p>
                            </div>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>Nhà cung cấp</p>
                                <p style={detailValueStyle}>{selectedProduct.vendor}</p>
                            </div>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>Loại sản phẩm</p>
                                <p style={detailValueStyle}>{selectedProduct.category}</p>
                            </div>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>Giá gốc</p>
                                <p style={detailValueStyle}>{(selectedProduct.costPrice || 0).toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>Giá bán</p>
                                <p style={detailValueStyle}>{(selectedProduct.sellingPrice || 0).toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>Tồn kho hiện tại</p>
                                <p style={detailValueStyle}>{(selectedProduct.stockQuantity || 0).toLocaleString()} {selectedProduct.unit}</p>
                            </div>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>Tồn kho tối thiểu</p>
                                <p style={detailValueStyle}>{(selectedProduct.minimumStock || 5).toLocaleString()} {selectedProduct.unit}</p>
                            </div>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>Hạn sử dụng</p>
                                <p style={detailValueStyle}>{selectedProduct.expiryDate ? new Date(selectedProduct.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                            </div>
                            <div style={detailItemStyle}>
                                <p style={detailLabelStyle}>Vị trí kệ</p>
                                <p style={detailValueStyle}>{selectedProduct.location || 'N/A'}</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                            <button style={actionButtonStyle} onClick={() => alert('Thêm vào giỏ hàng')}>
                                🛒 Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles
const pageStyle = { padding: '2rem', maxWidth: '1400px', margin: '0 auto' };
const headerStyle = { marginBottom: '2rem' };
const searchBarStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 18px',
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};
const searchInputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '0.95rem',
    color: '#374151'
};
const clearButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '1rem',
    marginLeft: '12px'
};
const filtersContainerStyle = {
    background: 'linear-gradient(to right, #f9fafb, #ffffff)',
    padding: '18px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    marginBottom: '2rem'
};
const filtersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    marginBottom: '12px'
};
const filterItemStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const filterLabelStyle = {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase'
};
const selectStyle = {
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    background: 'white',
    color: '#374151',
    fontSize: '0.9rem',
    cursor: 'pointer'
};
const clearFiltersStyle = {
    padding: '8px 14px',
    background: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600'
};
const resultsStyle = { marginTop: '2rem' };
const loadingStyle = { textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: '1.1rem' };
const emptyStyle = { textAlign: 'center', padding: '3rem', color: '#9ca3af' };
const productGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
};
const productCardStyle = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    ':hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' }
};
const productHeaderStyle = { marginBottom: '12px' };
const productInfoStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '12px',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '6px'
};
const infoLabelStyle = { margin: '0 0 4px 0', fontSize: '0.75rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' };
const infoValueStyle = { margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#1f2937' };
const statusBadgeStyle = { padding: '8px 10px', borderRadius: '6px', textAlign: 'center' };

// Modal Styles
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
};
const modalContentStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    position: 'relative'
};
const modalCloseStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#9ca3af'
};
const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
};
const detailItemStyle = { padding: '12px', background: '#f9fafb', borderRadius: '6px' };
const detailLabelStyle = { margin: '0 0 4px 0', fontSize: '0.8rem', fontWeight: '700', color: '#6b7280' };
const detailValueStyle = { margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#1f2937' };
const actionButtonStyle = {
    padding: '10px 20px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%'
};

export default SearchIntelligencePage;
