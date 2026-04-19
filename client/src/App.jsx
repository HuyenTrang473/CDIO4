// client/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DataRefreshProvider } from './context/DataRefreshContext';
import { RBACProvider } from './context/RBACContext';

// Component Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage'; 
import ProductsPage from './pages/ProductsPage';
import TransactionsPage from './pages/TransactionsPage'; 
import ReportsPage from './pages/ReportsPage';
import SuppliersPage from './pages/SuppliersPage';
import CategoriesPage from './pages/CategoriesPage';
import SearchIntelligencePage from './pages/SearchIntelligencePage';
import AIAssistantPage from './pages/AIAssistantPage';
import UserManagementPage from './pages/UserManagementPage';
import TransactionApprovalPage from './pages/TransactionApprovalPage';
import SystemMonitoringPage from './pages/SystemMonitoringPage';
import ReportExportPage from './pages/ReportExportPage';
import SupplierPortalPage from './pages/SupplierPortalPage';

// Vendor Portal Pages
import VendorLoginPage from './pages/VendorLoginPage';
import VendorDashboard from './pages/VendorDashboard';
import VendorOrdersPage from './pages/VendorOrdersPage';
import VendorDeliveriesPage from './pages/VendorDeliveriesPage';
import VendorScorecardPage from './pages/VendorScorecardPage';

// Component Layout
import DashboardLayout from './components/DashboardLayout';
import VendorLayout from './components/VendorLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Component Bảo vệ Route
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Vendor Protected Route
const VendorProtectedRoute = ({ children }) => {
    const isVendor = localStorage.getItem('isVendor') === 'true';
    const vendorToken = localStorage.getItem('vendorToken');
    return isVendor && vendorToken ? children : <Navigate to="/vendor/login" replace />;
};

const VendorLayoutWrapper = () => {
    const location = useLocation();
    
    return (
        <ErrorBoundary>
            <VendorLayout key={location.pathname}>
                <Routes>
                    <Route path="/dashboard" element={<VendorDashboard />} />
                    <Route path="/orders" element={<VendorOrdersPage />} />
                    <Route path="/deliveries" element={<VendorDeliveriesPage />} />
                    <Route path="/scorecard" element={<VendorScorecardPage />} />
                    <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
                </Routes>
            </VendorLayout>
        </ErrorBoundary>
    );
};

const LayoutWrapper = () => {
    const location = useLocation();
    
    return (
        <ErrorBoundary>
            <DashboardLayout key={location.pathname}>
                <Routes>
                
                {/* Trang chính Dashboard */}
                <Route path="/" element={<HomePage />} /> 
                
                {/* Trang Quản lý Sản phẩm */}
                <Route path="/products" element={<ProductsPage />} />
                
                {/* Trang Quản lý Nhà cung cấp */}
                <Route path="/suppliers" element={<SuppliersPage />} /> {/* <--- BỔ SUNG ROUTE NHÀ CUNG CẤP */}
                
                <Route path="categories" element={<CategoriesPage />} />
                
                {/* Trang Giao dịch (Nhập/Xuất kho) - Dùng tham số động */}
                <Route path="/transactions/:type" element={<TransactionsPage />} />
                
                {/* Trang Báo cáo */}
                <Route path="/reports" element={<ReportsPage />} />

                {/* Trang Test Báo cáo */}
                {/* <Route path="/reports-test" element={<ReportsPageTest />} /> */}

                {/* Trang Search Intelligence */}
                <Route path="/search" element={<SearchIntelligencePage />} />

                {/* Trang AI Assistant */}
                <Route path="/ai" element={<AIAssistantPage />} />

                {/* ===== ADMIN PAGES (UC12-14, UC19) ===== */}
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/approvals" element={<TransactionApprovalPage />} />
                <Route path="/admin/monitoring" element={<SystemMonitoringPage />} />
                <Route path="/reports/export" element={<ReportExportPage />} />

                {/* ===== SUPPLIER PORTAL (UC15-18) ===== */}
                <Route path="/supplier/portal" element={<SupplierPortalPage />} />

                {/* Xử lý 404 */}
                <Route path="*" element={<div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1 style={{color: '#ef4444'}}>404</h1>
                    <p>Trang bạn tìm kiếm không tồn tại trong khu vực quản trị.</p>
                </div>} />
            </Routes>
        </DashboardLayout>
        </ErrorBoundary>
    );
};


function App() {
    const { isAuthenticated } = useAuth(); 

    return (
        <RBACProvider>
            <DataRefreshProvider>
            <Routes>
                
                {/* ===== VENDOR PORTAL ROUTES ===== */}
                <Route 
                    path="/vendor/login" 
                    element={
                        localStorage.getItem('isVendor') === 'true' ? 
                        <Navigate to="/vendor/dashboard" replace /> : 
                        <VendorLoginPage />
                    } 
                />
                
                <Route 
                    path="/vendor/*" 
                    element={
                        <VendorProtectedRoute>
                            <VendorLayoutWrapper />
                        </VendorProtectedRoute>
                    }
                />
                
                {/* ===== A. Public Routes (Login & Register) ===== */}
                <Route 
                    path="/login" 
                    element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} 
                />
                <Route 
                    path="/register" 
                    element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />} 
                />
                
                {/* ===== B. Protected Routes (Tất cả khu vực Dashboard) ===== */}
                <Route 
                    path="/*" 
                    element={
                        <ProtectedRoute>
                            <LayoutWrapper />
                        </ProtectedRoute>
                    }
                />
                
            </Routes>
            </DataRefreshProvider>
        </RBACProvider>
    );
}

export default App;