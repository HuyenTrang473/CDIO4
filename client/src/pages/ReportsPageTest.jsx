import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ReportsPageTest = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('🔍 Token:', token);
                console.log('🔍 Fetching /api/products...');
                
                const pRes = await axios.get('/api/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Products response:', pRes.data);
                setProducts(pRes.data.data || []);

                const tRes = await axios.get('/api/transactions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Transactions response:', tRes.data);
                setTransactions(tRes.data.data || []);

                setLoading(false);
            } catch (err) {
                console.error('❌ Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>🧪 ReportsPage Test</h1>
            
            {loading && <p style={{color: '#0099ff'}}>⏳ Loading...</p>}
            {error && <p style={{color: '#ff0000'}}>❌ Error: {error}</p>}

            <div style={{ marginTop: '1rem' }}>
                <h2>📦 Products ({products.length})</h2>
                <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', maxHeight: '300px', overflow: 'auto' }}>
                    {JSON.stringify(products.slice(0, 3), null, 2)}
                </pre>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <h2>📊 Transactions ({transactions.length})</h2>
                <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', maxHeight: '300px', overflow: 'auto' }}>
                    {JSON.stringify(transactions.slice(0, 3), null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default ReportsPageTest;
