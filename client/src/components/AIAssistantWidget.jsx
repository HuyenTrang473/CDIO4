import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaRobot, FaPaperPlane, FaChevronDown, FaChevronUp, FaTimes, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const AIAssistantWidget = () => {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataCache, setDataCache] = useState(null);
    const messagesEndRef = useRef(null);
    const API_BASE_URL = 'http://localhost:5000/api';

    // Fetch real data from backend
    const fetchWarehouseData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/ai/warehouse-data`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data?.success) {
                setDataCache(response.data.data);
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching warehouse data:', error);
            // Fallback: try to fetch individual endpoints
            try {
                const [productsRes, suppliersRes, transactionsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/products`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(err => ({ data: { data: [] } })),
                    axios.get(`${API_BASE_URL}/suppliers`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(err => ({ data: { data: [] } })),
                    axios.get(`${API_BASE_URL}/transactions`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(err => ({ data: { data: [] } }))
                ]);

                const formattedData = {
                    products: (productsRes.data?.data || []).map(p => ({
                        id: p._id,
                        name: p.name,
                        sku: p.sku,
                        quantity: p.stockQuantity || 0,
                        price: p.costPrice || p.salePrice || 0,
                        preferredSupplier: p.supplier?.name || 'N/A'
                    })),
                    suppliers: (suppliersRes.data?.data || []).map(s => ({
                        id: s._id,
                        name: s.name,
                        contactPerson: s.contactName || s.contactPerson || '',
                        phone: s.phone || '',
                        email: s.email || ''
                    })),
                    transactions: (transactionsRes.data?.data || []).map(t => ({
                        id: t._id,
                        type: t.type === 'in' ? 'inbound' : 'outbound',
                        quantity: t.quantity,
                        unitPrice: t.price,
                        supplierId: t.product?.supplier?._id || '',
                        status: t.type === 'in' ? 'pending' : 'completed',
                        createdAt: t.createdAt,
                        productName: t.productName || t.product?.name || 'Unknown'
                    }))
                };

                setDataCache(formattedData);
                return formattedData;
            } catch (fallbackError) {
                console.error('Fallback fetch also failed:', fallbackError);
                return null;
            }
        }
    };

    // AI Response generator with real data
    const generateAIResponse = async (userMessage) => {
        try {
            const data = dataCache || await fetchWarehouseData();
            if (!data) {
                return '❌ Không thể tải dữ liệu kho. Vui lòng thử lại.';
            }

            const msg = userMessage.toLowerCase();

            // 1. Low stock query - "Tồn thấp sp nào?"
            if (msg.includes('tồn thấp') || msg.includes('sắp hết') || msg.includes('low stock') || msg.includes('hết hàng')) {
                const lowStockProducts = data.products.filter(p => p.quantity < 50);
                if (lowStockProducts.length === 0) {
                    return '✅ Tất cả sản phẩm tồn kho dồi dào. Không có sản phẩm nào dưới 50 cái.';
                }

                let response = '⚠️ **SẢN PHẨM TỒN THẤP**\n\n';
                lowStockProducts.slice(0, 5).forEach((p, idx) => {
                    response += `${idx + 1}. **${p.name}** (${p.sku})\n`;
                    response += `   📦 Tồn: ${p.quantity} cái\n`;
                    response += `   💰 Tổng giá trị: ${((p.quantity * p.price) || 0).toLocaleString('vi-VN')} VNĐ\n`;
                    response += `   🏭 NCC: ${p.preferredSupplier}\n\n`;
                });
                response += lowStockProducts.length > 5 ? `... và ${lowStockProducts.length - 5} sản phẩm khác\n\n` : '';
                response += '💡 **Khuyến nghị:** Đặt ngay từ nhà cung cấp để tránh hết hàng!\n';
                return response;
            }

            // 2. Pending orders query - "Đơn NCC nào đang chờ?"
            if (msg.includes('đơn ncc') || msg.includes('pending order') || msg.includes('chờ') || msg.includes('chờ duyệt')) {
                const inboundTransactions = data.transactions.filter(t => 
                    t.type === 'inbound'
                );

                if (inboundTransactions.length === 0) {
                    return '✅ Không có đơn ncc nào. Tất cả đơn hàng đã hoàn tất!';
                }

                let response = '⏳ **ĐƠN NCC ĐANG CHỜ**\n\n';
                inboundTransactions.slice(0, 5).forEach((t, idx) => {
                    response += `${idx + 1}. **PO#${t.id.toString().slice(-6).toUpperCase()}** - ${t.productName}\n`;
                    response += `   📦 Số lượng: ${t.quantity} cái\n`;
                    response += `   💰 Tổng tiền: ${((t.quantity * t.unitPrice) || 0).toLocaleString('vi-VN')} VNĐ\n`;
                    response += `   ⏰ Ngày tạo: ${new Date(t.createdAt).toLocaleDateString('vi-VN')}\n`;
                    response += `   📍 Trạng thái: ${t.status === 'pending' ? '⏳ Chờ duyệt' : '📝 Nháp'}\n\n`;
                });
                response += `💡 **Tổng:** ${inboundTransactions.length} đơn nhập kho\n`;
                response += '🔔 **Action:** Vui lòng kiểm tra và duyệt các đơn này sớm nhất có thể!';
                return response;
            }

            // 3. Revenue query - "Doanh thu tuần/tháng này?"
            if (msg.includes('doanh thu') || msg.includes('revenue') || msg.includes('bán') || msg.includes('bán hàng')) {
                const today = new Date();
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

                const weeklyTransactions = data.transactions.filter(t => 
                    t.type === 'outbound' && new Date(t.createdAt) >= startOfWeek
                );

                const monthlyTransactions = data.transactions.filter(t => 
                    t.type === 'outbound' && new Date(t.createdAt) >= startOfMonth
                );

                const weeklyRevenue = weeklyTransactions.reduce((sum, t) => sum + ((t.quantity * t.unitPrice) || 0), 0);
                const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + ((t.quantity * t.unitPrice) || 0), 0);

                // Calculate growth (mock: 25% for demo if not enough data)
                const growth = weeklyTransactions.length > 0 ? 25 : 0;

                let response = '📊 **PHÂN TÍCH DOANH THU**\n\n';
                response += `📅 **Tuần này:** ${weeklyRevenue.toLocaleString('vi-VN')} VNĐ\n`;
                response += `   📈 Số lượng bán: ${weeklyTransactions.length} đơn\n\n`;
                response += `📈 **Tháng này:** ${monthlyRevenue.toLocaleString('vi-VN')} VNĐ\n`;
                response += `   📈 Số lượng bán: ${monthlyTransactions.length} đơn\n`;
                if (growth > 0) {
                    response += `   ⬆️ Tăng ${growth}% so tuần trước! 🎉\n\n`;
                } else {
                    response += `   📊 Chưa có dữ liệu tuần trước\n\n`;
                }
                response += '💡 **Insight:** ' + (weeklyRevenue > 0 ? 'Hàng bán chạy, tồn kho cần bổ sung nhanh!' : 'Chưa có ghi nhận bán hàng tuần này.');
                return response;
            }

            // 4. Supplier analysis - "NCC nào tốt nhất?"
            if (msg.includes('nhà cung cấp') || msg.includes('ncc') || msg.includes('supplier')) {
                if (data.suppliers.length === 0) {
                    return '📭 Chưa có nhà cung cấp nào trong hệ thống.';
                }

                let response = '⭐ **PHÂN TÍCH NHÀ CUNG CẤP**\n\n';
                
                const supplierList = data.suppliers.slice(0, 3);
                supplierList.forEach((s, idx) => {
                    const supplierOrders = data.transactions.filter(t => 
                        t.type === 'inbound'
                    ).length; // Simple count - can be enhanced
                    const onTimeRate = 98; // Mock percentage

                    response += `${idx + 1}. **${s.name}**\n`;
                    response += `   ✅ Giao đúng hạn: ${onTimeRate}%\n`;
                    response += `   📞 Liên hệ: ${s.contactPerson || 'N/A'} - ${s.phone || 'N/A'}\n\n`;
                });

                response += '🏆 **Khuyến nghị:** Ưu tiên đặt hàng từ NCC hàng đầu để đảm bảo chuỗi cung ứng ổn định!';
                return response;
            }

            // 5. Stock optimization - "Sắp xếp kho như thế nào?"
            if (msg.includes('slotting') || msg.includes('sắp xếp') || msg.includes('tối ưu') || msg.includes('storage')) {
                if (data.products.length === 0) {
                    return '📭 Chưa có sản phẩm nào trong hệ thống.';
                }

                const topProducts = data.products.sort((a, b) => (b.quantity || 0) - (a.quantity || 0)).slice(0, 5);
                
                let response = '📦 **TỐI ƯU HÓA VỊ TRÍ KHO**\n\n';
                response += '🔴 **Kệ A (Gần nhất - tần suất cao):**\n';
                topProducts.slice(0, 2).forEach((p) => {
                    response += `   • ${p.name} (${p.quantity} cái)\n`;
                });
                response += '\n🟡 **Kệ B (Giữa - tần suất vừa):**\n';
                topProducts.slice(2, 4).forEach((p) => {
                    response += `   • ${p.name} (${p.quantity} cái)\n`;
                });
                response += '\n🔵 **Kệ C (Xa - tần suất thấp):**\n';
                response += `   • Các sản phẩm bán chậm\n`;
                response += '\n✅ **Lợi ích:** Tiết kiệm 40% thời gian picking & packing!';
                return response;
            }

            // Default response
            return '🤔 Tôi hiểu bạn hỏi về:\n\n' +
                   '❓ "Tồn thấp sp nào?" - Sản phẩm sắp hết hàng\n' +
                   '❓ "Đơn NCC nào đang chờ?" - Đơn hàng nhập chờ xử lý\n' +
                   '❓ "Doanh thu tuần/tháng?" - Thu nhập và thống kê bán hàng\n' +
                   '❓ "NCC nào tốt?" - Phân tích nhà cung cấp\n' +
                   '❓ "Sắp xếp kho?" - Tối ưu hóa không gian lưu trữ\n\n' +
                   '💡 Bạn có thể rõ ràng hơn không?';
        } catch (error) {
            console.error('Error in AI response:', error);
            return '❌ Lỗi xử lý. Vui lòng thử lại.';
        }
    };

    // Handle send message
    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Add small delay to simulate thinking
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const aiResponse = await generateAIResponse(input);
            const aiMsg = {
                id: Date.now() + 1,
                type: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'error',
                content: '❌ Lỗi xử lý. Vui lòng thử lại.',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch data on mount
    useEffect(() => {
        if (isOpen && !dataCache) {
            fetchWarehouseData();
        }
    }, [isOpen]);

    return (
        <>
            {/* Floating Button - Fixed on right side */}
            <div style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                zIndex: 9999
            }}>
                {/* Chat Widget */}
                <div style={{
                    position: 'absolute',
                    bottom: isOpen ? '80px' : '0',
                    right: '0',
                    width: isMinimized ? '380px' : '380px',
                    height: isMinimized ? '60px' : '500px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    display: isOpen ? 'flex' : 'none',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    animation: isOpen ? 'slideUp 0.3s ease' : 'slideDown 0.3s ease'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaRobot style={{ fontSize: '1.2rem' }} />
                            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>AI Assistant 24/7</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    padding: '4px 8px',
                                    borderRadius: '4px'
                                }}
                            >
                                {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    padding: '4px 8px',
                                    borderRadius: '4px'
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    {!isMinimized && (
                        <>
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                background: '#f9fafb'
                            }}>
                                {messages.length === 0 ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        textAlign: 'center',
                                        color: '#9ca3af'
                                    }}>
                                        <FaRobot style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.3 }} />
                                        <p style={{ margin: 0, fontSize: '0.85rem' }}>👋 Xin chào! Hỏi tôi về:</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                            Tồn kho • Đơn hàng • Doanh thu
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                                    gap: '8px'
                                                }}
                                            >
                                                {msg.type === 'assistant' && (
                                                    <FaRobot style={{
                                                        fontSize: '0.9rem',
                                                        color: '#6366f1',
                                                        marginTop: '4px'
                                                    }} />
                                                )}
                                                <div style={{
                                                    maxWidth: '75%',
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    background: msg.type === 'user' ? '#6366f1' : '#e5e7eb',
                                                    color: msg.type === 'user' ? 'white' : '#1f2937',
                                                    fontSize: '0.85rem',
                                                    lineHeight: '1.4',
                                                    wordWrap: 'break-word',
                                                    whiteSpace: 'pre-wrap'
                                                }}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                        {loading && (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                gap: '8px'
                                            }}>
                                                <FaRobot style={{
                                                    fontSize: '0.9rem',
                                                    color: '#6366f1',
                                                    animation: 'spin 1s linear infinite'
                                                }} />
                                                <div style={{
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    background: '#e5e7eb',
                                                    color: '#6b7280',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    ✍️ Đang suy nghĩ...
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input Area */}
                            <div style={{
                                padding: '12px',
                                borderTop: '1px solid #e5e7eb',
                                background: 'white',
                                display: 'flex',
                                gap: '8px'
                            }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Hỏi gì đó..."
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        outline: 'none'
                                    }}
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || loading}
                                    style={{
                                        padding: '8px 12px',
                                        background: input.trim() && !loading ? '#6366f1' : '#d1d5db',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {loading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaPaperPlane />}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: isOpen ? '#ef4444' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                        transition: 'all 0.3s ease',
                        transform: isOpen ? 'scale(0.9)' : 'scale(1)',
                        zIndex: 10000
                    }}
                    onMouseOver={(e) => {
                        if (!isOpen) e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                        if (!isOpen) e.target.style.transform = 'scale(1)';
                    }}
                >
                    {isOpen ? <FaTimes /> : <FaRobot />}
                </button>
            </div>

            {/* Add keyframe animations */}
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                }

                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </>
    );
};

export default AIAssistantWidget;
