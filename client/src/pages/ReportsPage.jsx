import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useDataRefresh } from '../context/DataRefreshContext'; 
import { useRBAC } from '../context/RBACContext';
import { FaChartLine, FaDollarSign, FaBoxes, FaExclamationTriangle, FaTimesCircle, FaCalendarAlt, FaArrowUp, FaArrowDown, FaFileDownload, FaFilter, FaCheckCircle, FaRobot, FaLightbulb, FaExclamationCircle, FaThumbsUp, FaTimes, FaCheck, FaClock } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
};

const formatDecimal = (amount) => {
    if (!amount || isNaN(amount)) return 0;
    return new Intl.NumberFormat('vi-VN').format(amount);
};

const ReportsPage = () => {
    const { token } = useAuth();
    const { shouldRefresh } = useDataRefresh(); 
    const { hasRole } = useRBAC();
    
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ 
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0], 
        end: new Date().toISOString().split('T')[0] 
    });
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [selectedVendor, setSelectedVendor] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [approvalActions, setApprovalActions] = useState({});
    const [kpis, setKpis] = useState({
        turnoverRatio: 0,
        stockHealthScore: 0,
        topVendor: '',
        avgLeadTime: 0,
        vendorPerformance: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, tRes] = await Promise.all([
                axios.get('/api/products', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/transactions', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setProducts(pRes.data.data || []);
            setTransactions(tRes.data.data || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { fetchData(); }, [token, shouldRefresh]);

    const reportData = useMemo(() => {
        let totalInventoryValue = 0;
        let totalStockCount = 0;
        let lowStockItems = [];
        let outOfStockItems = [];

        products.forEach(p => {
            const stock = p.stockQuantity || 0;
            totalInventoryValue += stock * (p.costPrice || 0);
            totalStockCount += stock;
            if (stock === 0) outOfStockItems.push(p);
            else if (stock < (p.minimumStock || 5)) lowStockItems.push(p);
        });

        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        let totalInValue = 0;
        let totalOutValue = 0;
        let vendorMap = {};
        const chartMap = {};

        transactions.forEach(t => {
            const tDate = new Date(t.createdAt);
            if (tDate >= start && tDate <= end) {
                const val = (t.quantity || 0) * (t.price || 0);
                const dateKey = tDate.toLocaleDateString('vi-VN');

                if (!chartMap[dateKey]) chartMap[dateKey] = { name: dateKey, nhập: 0, xuất: 0 };

                if (t.type === 'in' || t.type === 'nhập') {
                    totalInValue += val;
                    chartMap[dateKey].nhập += t.quantity;
                } else {
                    totalOutValue += val;
                    chartMap[dateKey].xuất += t.quantity;
                }

                if (t.product?.supplier?.name) {
                    const vendorName = t.product.supplier.name;
                    if (!vendorMap[vendorName]) {
                        vendorMap[vendorName] = { name: vendorName, value: 0, onTime: 0, total: 0 };
                    }
                    vendorMap[vendorName].value += val;
                    vendorMap[vendorName].total += 1;
                }
            }
        });

        const vendorPerformance = Object.values(vendorMap).sort((a, b) => b.value - a.value);

        const turnoverRatio = totalOutValue > 0 ? Math.round((totalOutValue / totalInventoryValue) * 100) : 0;
        const stockHealthScore = Math.round((1 - (outOfStockItems.length / Math.max(products.length, 1))) * 100);
        const topVendor = vendorPerformance.length > 0 ? vendorPerformance[0].name : 'N/A';
        const avgLeadTime = 10;

        setKpis({
            turnoverRatio,
            stockHealthScore,
            topVendor,
            avgLeadTime,
            vendorPerformance: vendorPerformance.slice(0, 5)
        });

        return {
            totalInventoryValue, totalStockCount, lowStockItems, outOfStockItems,
            totalInValue, totalOutValue,
            chartData: Object.values(chartMap).sort((a,b) => a.name.localeCompare(b.name)),
            vendorPerformance
        };
    }, [products, transactions, dateRange]);

    useEffect(() => {
        if (reportData && reportData.totalStockCount > 0) {
            const aiInsights = {
                warnings: [],
                opportunities: [],
                recommendations: []
            };

            if (reportData.outOfStockItems.length > 0) {
                aiInsights.warnings.push({
                    severity: 'high',
                    message: `${reportData.outOfStockItems.length} sản phẩm đã hết hàng`,
                    impact: '🔴 Nghiêm trọng'
                });
            }

            setAiAnalysis(aiInsights);
        }
    }, [reportData]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const vendorMatch = selectedVendor === "all" || p.supplier?.name === selectedVendor;
            const categoryMatch = selectedCategory === "all" || p.category?.name === selectedCategory;
            return vendorMatch && categoryMatch;
        });
    }, [products, selectedVendor, selectedCategory]);

    const handleApprovalAction = (transactionId, action) => {
        setApprovalActions(prev => ({
            ...prev,
            [transactionId]: { action, timestamp: new Date().toLocaleString('vi-VN') }
        }));
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>⏳ Đang tải dữ liệu...</div>;

    return (
        <div style={{ padding: '2rem 0', background: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, marginBottom: '0.5rem', color: '#1f2937', fontWeight: 'bold' }}>📈 Báo Cáo & Thống Kê</h1>
                        <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: 0 }}>Dashboard quản lý kho hàng và phân tích dữ liệu thời thực</p>
                    </div>
                </div>

                {/* AI INSIGHTS ENGINE - HIỂN THỊ NỘI DỰA TRÊN DỮ LIỆU */}
                <div style={{
                        background: 'linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%)',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '2px solid #c7d2fe',
                        marginBottom: '2.5rem',
                        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.15)',
                        borderLeft: '6px solid #6366f1'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '2.5rem' }}>🤖</div>
                            <div>
                                <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem', fontWeight: 'bold' }}>AI Business Intelligence Engine</h2>
                                <p style={{ margin: '6px 0 0 0', color: '#6b7280', fontSize: '0.95rem' }}>Phân tích thông minh dựa trên dữ liệu kho thời thực</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {/* WARNINGS */}
                            {aiAnalysis && aiAnalysis.warnings.length > 0 && (
                                <div style={{ 
                                    background: 'rgba(255, 255, 255, 0.7)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid #ef4444'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.3rem' }}>⚠️</span>
                                        <h3 style={{ margin: 0, color: '#991b1b', fontSize: '1rem', fontWeight: 'bold' }}>Cảnh báo Quan trọng</h3>
                                    </div>
                                    {aiAnalysis.warnings.map((w, idx) => (
                                        <div key={idx} style={{ marginBottom: idx < aiAnalysis.warnings.length - 1 ? '1rem' : 0 }}>
                                            <p style={{ margin: 0, color: '#dc2626', fontWeight: '600', fontSize: '0.9rem' }}>{w.impact}</p>
                                            <p style={{ margin: '6px 0 0 0', color: '#374151', fontSize: '0.85rem' }}>{w.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* OPPORTUNITIES */}
                            {reportData.totalOutValue > reportData.totalInValue && (
                                <div style={{ 
                                    background: 'rgba(255, 255, 255, 0.7)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid #f59e0b'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.3rem' }}>💡</span>
                                        <h3 style={{ margin: 0, color: '#92400e', fontSize: '1rem', fontWeight: 'bold' }}>Cơ hội Kinh doanh</h3>
                                    </div>
                                    <p style={{ margin: '0 0 6px 0', color: '#f59e0b', fontWeight: '600', fontSize: '0.9rem' }}>📈 Nhu cầu mạnh</p>
                                    <p style={{ margin: 0, color: '#374151', fontSize: '0.85rem' }}>Lượng xuất vượt nhập - Cơ hội tăng giá hoặc nhập thêm hàng phổ biến</p>
                                </div>
                            )}

                            {/* RECOMMENDATIONS */}
                            {reportData.lowStockItems.length > 0 && (
                                <div style={{ 
                                    background: 'rgba(255, 255, 255, 0.7)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid #10b981'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.3rem' }}>✅</span>
                                        <h3 style={{ margin: 0, color: '#065f46', fontSize: '1rem', fontWeight: 'bold' }}>Khuyến nghị Hành động</h3>
                                    </div>
                                    <p style={{ margin: '0 0 6px 0', color: '#059669', fontWeight: '600', fontSize: '0.9rem' }}>📦 Restock ngay</p>
                                    <p style={{ margin: 0, color: '#374151', fontSize: '0.85rem' }}>{reportData.lowStockItems.length} sản phẩm sắp hết - Lên kế hoạch đặt hàng liền</p>
                                </div>
                            )}
                        </div>
                    </div>

                {/* KPI DASHBOARD */}
                <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '1.5rem', color: '#1f2937', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>📊 Executive KPI Dashboard</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ 
                                background: 'white', 
                                padding: '1.5rem', 
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                borderTop: '4px solid #3b82f6'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>📈 Tỷ lệ Luân chuyển</p>
                                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{kpis.turnoverRatio}%</p>
                                    </div>
                                    <FaArrowUp style={{ fontSize: '2rem', color: '#10b981' }} />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '1rem 0 0 0' }}>Hiệu suất tiêu thụ</p>
                            </div>

                            <div style={{ 
                                background: 'white', 
                                padding: '1.5rem', 
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                borderTop: '4px solid #10b981'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>💪 Sức Khỏe Kho</p>
                                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{kpis.stockHealthScore}%</p>
                                    </div>
                                    <FaCheck style={{ fontSize: '2rem', color: '#3b82f6' }} />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '1rem 0 0 0' }}>% sản phẩm sẵn hàng</p>
                            </div>

                            <div style={{ 
                                background: 'white', 
                                padding: '1.5rem', 
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                borderTop: '4px solid #f59e0b'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>⭐ Top NCC</p>
                                        <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1f2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{kpis.topVendor}</p>
                                    </div>
                                    <FaArrowUp style={{ fontSize: '2rem', color: '#f59e0b' }} />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '1rem 0 0 0' }}>Nhà cung cấp hàng đầu</p>
                            </div>

                            <div style={{ 
                                background: 'white', 
                                padding: '1.5rem', 
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                borderTop: '4px solid #ef4444'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', margin: '0 0 8px 0', textTransform: 'uppercase' }}>🚚 Lead Time</p>
                                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{kpis.avgLeadTime}</p>
                                    </div>
                                    <FaClock style={{ fontSize: '2rem', color: '#ef4444' }} />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '1rem 0 0 0' }}>Ngày (trung bình)</p>
                            </div>
                        </div>

                        {/* Biểu đồ NCC */}
                        {kpis.vendorPerformance.length > 0 && (
                            <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ fontSize: '1.1rem', margin: '0 0 1.5rem 0', color: '#1f2937', fontWeight: 'bold' }}>🏆 Hiệu suất Nhà Cung Cấp Top 5</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={kpis.vendorPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `${(value / 1000000).toFixed(1)}M VNĐ`} />
                                        <Bar dataKey="value" fill="#3b82f6" name="Giá trị giao dịch" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                {/* ADVANCED FILTERS */}
                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    marginBottom: '2.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <FaFilter style={{ fontSize: '1.2rem', color: '#374151' }} />
                        <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.05rem' }}>Bộ lọc dữ liệu nâng cao</span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                        {/* Filter by Vendor */}
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>👥 Nhà cung cấp</label>
                            <select 
                                value={selectedVendor} 
                                onChange={(e) => setSelectedVendor(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="all">Tất cả ({products.length})</option>
                                {Array.from(new Set(products.map(p => p.supplier?.name).filter(Boolean))).map(v => {
                                    const count = products.filter(p => p.supplier?.name === v).length;
                                    return <option key={v} value={v}>{v} ({count})</option>;
                                })}
                            </select>
                        </div>

                        {/* Filter by Category */}
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>📦 Loại sản phẩm</label>
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="all">Tất cả ({products.length})</option>
                                {Array.from(new Set(products.map(p => p.category?.name).filter(Boolean))).map(c => {
                                    const count = products.filter(p => p.category?.name === c).length;
                                    return <option key={c} value={c}>{c} ({count})</option>;
                                })}
                            </select>
                        </div>
                    </div>

                    {(selectedVendor !== "all" || selectedCategory !== "all") && (
                        <button 
                            onClick={() => { setSelectedVendor("all"); setSelectedCategory("all"); }}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                background: '#ffffff',
                                color: '#6b7280',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <FaTimes /> Xóa bộ lọc
                        </button>
                    )}
                    
                    <p style={{ margin: '1rem 0 0 0', color: '#6b7280', fontSize: '0.85rem' }}>
                        📊 Đang hiển thị: <strong>{filteredProducts.length} / {products.length}</strong> sản phẩm
                    </p>
                </div>

                {/* FINANCIAL STATISTICS */}
                <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '1.5rem', color: '#1f2937', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>💰 Tài chính Kho hàng</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)' }}>
                        <FaDollarSign style={{ fontSize: '2rem', marginBottom: '12px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>{formatCurrency(reportData.totalInventoryValue)}</div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>Tổng Giá trị Tồn kho</p>
                    </div>
                    <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)' }}>
                        <FaBoxes style={{ fontSize: '2rem', marginBottom: '12px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>{formatDecimal(reportData.totalStockCount)}</div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>Tổng Số lượng Tồn</p>
                    </div>
                    <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)' }}>
                        <FaArrowUp style={{ fontSize: '2rem', marginBottom: '12px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>{formatCurrency(reportData.totalInValue)}</div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>Giá trị Nhập (Kỳ này)</p>
                    </div>
                    <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)' }}>
                        <FaArrowDown style={{ fontSize: '2rem', marginBottom: '12px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>{formatCurrency(reportData.totalOutValue)}</div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>Giá trị Xuất (Kỳ này)</p>
                    </div>
                </div>

                {/* CHARTS */}
                <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '1.5rem', color: '#1f2937', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>📊 Biểu đồ Giao dịch</h2>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Từ:</label>
                        <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                        <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>đến:</label>
                        <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={reportData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="nhập" stroke="#10b981" strokeWidth={3} name="Lượng Nhập" dot={{ fill: '#10b981', r: 4 }} />
                            <Line type="monotone" dataKey="xuất" stroke="#ef4444" strokeWidth={3} name="Lượng Xuất" dot={{ fill: '#ef4444', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* INVENTORY ALERTS */}
                <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '1.5rem', color: '#1f2937', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>⚠️ Cảnh báo Tồn kho</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {/* Low Stock Items */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: '0 0 1.5rem 0', color: '#f59e0b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔶 {reportData.lowStockItems.length} Sản phẩm Tồn kho Thấp
                        </h3>
                        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            {reportData.lowStockItems.length > 0 ? (
                                <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #f3f4f6', background: '#f9fafb' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>Tên Sản phẩm</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>Tồn hiện tại</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>Tối thiểu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.lowStockItems.map(p => (
                                            <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px', color: '#374151' }}>{p.name}</td>
                                                <td style={{ padding: '12px', textAlign: 'right', color: '#f59e0b', fontWeight: 'bold' }}>{p.stockQuantity}</td>
                                                <td style={{ padding: '12px', textAlign: 'right', color: '#6b7280' }}>{p.minimumStock || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>✨ Không có sản phẩm tồn kho thấp!</div>
                            )}
                        </div>
                    </div>

                    {/* Out of Stock Items */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: '0 0 1.5rem 0', color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔴 {reportData.outOfStockItems.length} Sản phẩm Đã hết hàng
                        </h3>
                        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            {reportData.outOfStockItems.length > 0 ? (
                                <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #f3f4f6', background: '#f9fafb' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>Tên Sản phẩm</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>SKU</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem', fontWeight: '600', color: '#6b7280' }}>Giá vốn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.outOfStockItems.map(p => (
                                            <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px', color: '#374151' }}>{p.name}</td>
                                                <td style={{ padding: '12px', textAlign: 'right', color: '#6b7280' }}>{p.sku}</td>
                                                <td style={{ padding: '12px', textAlign: 'right', color: '#374151' }}>{formatCurrency(p.costPrice || 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>✨ Không có sản phẩm nào hết hàng!</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* APPROVAL WORKFLOW */}
                <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '1.5rem', color: '#1f2937', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>🔐 Quy trình Phê duyệt Đơn hàng lớn (10 triệu)</h2>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    {transactions.filter(t => (t.quantity * t.price > 10000000) && !approvalActions[t._id]).length > 0 ? (
                        <div>
                            {transactions.filter(t => (t.quantity * t.price > 10000000) && !approvalActions[t._id]).map((t) => {
                                const totalValue = t.quantity * t.price;
                                return (
                                    <div key={t._id} style={{
                                        background: totalValue > 50000000 ? '#fef2f2' : '#f9fafb',
                                        padding: '1.5rem',
                                        borderRadius: '10px',
                                        border: `2px solid ${totalValue > 50000000 ? '#fecaca' : '#e5e7eb'}`,
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                            <div>
                                                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', margin: '0 0 6px 0', textTransform: 'uppercase' }}>ID Giao dịch</p>
                                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>{t._id?.substring(0, 12)}...</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Sản phẩm</p>
                                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>{t.productName || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Số lượng</p>
                                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>{formatDecimal(t.quantity)} {t.unit || 'cái'}</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#6b7280', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Giá trị</p>
                                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: totalValue > 50000000 ? '#dc2626' : '#059669', margin: 0 }}>{formatCurrency(totalValue)}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                            <button 
                                                onClick={() => handleApprovalAction(t._id, 'approved')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    background: '#10b981',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <FaCheck /> Phê duyệt
                                            </button>
                                            <button 
                                                onClick={() => handleApprovalAction(t._id, 'rejected')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid #ef4444',
                                                    background: '#fff5f5',
                                                    color: '#dc2626',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <FaTimes /> Từ chối
                                            </button>
                                            <span style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                background: totalValue > 50000000 ? '#fee2e2' : '#fef3c7',
                                                color: totalValue > 50000000 ? '#991b1b' : '#92400e'
                                            }}>
                                                {totalValue > 50000000 ? '🔴 Rủi ro cao' : '🟡 Trung bình'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #f0fdf4, #e0f2fe)', borderRadius: '8px' }}>
                            <p style={{ color: '#059669', fontSize: '1.1rem', fontWeight: '600', margin: '0 0 6px 0' }}>✅ Tất cả đơn hàng lớn đã được phê duyệt!</p>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Không có giao dịch nào chờ xử lý</p>
                        </div>
                    )}

                    {/* Processed Transactions */}
                    {Object.entries(approvalActions).length > 0 && (
                        <div style={{ marginTop: '2rem', borderTop: '2px solid #e5e7eb', paddingTop: '1.5rem' }}>
                            <h4 style={{ color: '#059669', marginTop: 0, marginBottom: '1rem', fontWeight: 'bold' }}>✅ Đã xử lý ({Object.keys(approvalActions).length})</h4>
                            {Object.entries(approvalActions).map(([txId, action]) => {
                                const tx = transactions.find(t => t._id === txId);
                                return tx ? (
                                    <div key={txId} style={{
                                        background: action.action === 'approved' ? '#f0fdf4' : '#fef2f2',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        border: `2px solid ${action.action === 'approved' ? '#bbf7d0' : '#fecaca'}`,
                                        borderLeft: `6px solid ${action.action === 'approved' ? '#10b981' : '#ef4444'}`,
                                        marginBottom: '0.75rem'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>{tx.productName}</p>
                                                <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                                                    {action.action === 'approved' ? '✅ Đã phê duyệt' : '❌ Đã từ chối'} - {action.timestamp}
                                                </p>
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937' }}>{formatCurrency(tx.quantity * tx.price)}</span>
                                        </div>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;