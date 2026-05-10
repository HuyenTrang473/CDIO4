import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DataRefreshProvider } from './context/DataRefreshContext';
import { RBACProvider } from './context/RBACContext';

// Pages & Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
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
import SupplierDashboard from './pages/SupplierDashboard';
import SettingsPage from './pages/SettingsPage';
import CustomerDashboard from './pages/CustomerDashboard';
import LogoutSuccess from './pages/LogoutSuccess';
import ProcessingPage from './pages/ProcessingPage';
import DashboardLayout from './components/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';

/** 
 * Component bảo vệ Route theo vai trò (Role-Based Access Control)
 * Giúp chặn truy cập trái phép và đẩy người dùng về đúng vị trí
 */
const RoleProtectedRoute = ({ children, allowedRole }) => {
    const { isAuthenticated, userRole, loading } = useAuth();
    
    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="text-lg">Loading...</div></div>; // Chờ AuthContext xác định xong trạng thái

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // if (userRole !== allowedRole) {
    //     // Nếu vào sai khu vực (ví dụ Customer vào trang Admin), đẩy về gốc để điều phối lại
    //     return <Navigate to="/" replace />;
    // }

    return children;
};

/** 
 * Wrapper cho khu vực Admin/Staff
 * Sử dụng DashboardLayout chung và các Provider hỗ trợ dữ liệu
 */
const AdminLayoutWrapper = () => (
    <ErrorBoundary>
        <RBACProvider>
            <DataRefreshProvider>
                <DashboardLayout>
                    <Routes>
                        <Route path="home" element={<HomePage />} /> 
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="suppliers" element={<SuppliersPage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route path="transactions/inbound" element={<TransactionsPage />} />
                        <Route path="transactions/outbound" element={<TransactionsPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="search" element={<SearchIntelligencePage />} />
                        <Route path="ai" element={<AIAssistantPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="users" element={<UserManagementPage />} />
                        <Route path="approvals" element={<TransactionApprovalPage />} />
                        <Route path="monitoring" element={<SystemMonitoringPage />} />
                        <Route path="reports/export" element={<ReportExportPage />} />
                        {/* Mặc định của admin là trang home */}
                        <Route path="*" element={<Navigate to="home" replace />} />
                    </Routes>
                </DashboardLayout>
            </DataRefreshProvider>
        </RBACProvider>
    </ErrorBoundary>
);

function App() {
    const { isAuthenticated, userRole, loading } = useAuth(); 

    // Ngăn chặn render App khi chưa load xong Auth (Fix lỗi Throttling Navigation)
    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="text-lg">Loading...</div></div>; 

    return (
        <Routes>
            {/* 1. PUBLIC ROUTES */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/logout-success" element={<LogoutSuccess />} />
            <Route path="/processing" element={<ProcessingPage />} />

            {/* 2. ROOT DISPATCHER (Trạm điều hướng trung tâm) */}
            <Route 
                path="/" 
                element={
                    !isAuthenticated ? <Navigate to="/login" replace /> : 
                    userRole === 'supplier' ? <Navigate to="/supplier/dashboard" replace /> : 
                    userRole === 'customer' ? <Navigate to="/customer/dashboard" replace /> : 
                    <Navigate to="/admin/home" replace />
                } 
            />

            {/* 3. SUPPLIER AREA */}
            <Route 
                path="/supplier/*" 
                element={
                    <RoleProtectedRoute allowedRole="supplier">
                        <Routes>
                            <Route path="dashboard" element={<SupplierDashboard />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </RoleProtectedRoute>
                } 
            />

            {/* 4. CUSTOMER AREA */}
            <Route 
                path="/customer/*" 
                element={
                    <RoleProtectedRoute allowedRole="customer">
                        <Routes>
                            <Route path="dashboard" element={<CustomerDashboard />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </RoleProtectedRoute>
                } 
            />

            {/* 5. ADMIN/STAFF AREA */}
            <Route 
                path="/admin/*" 
                element={
                    <RoleProtectedRoute allowedRole="staff">
                        <AdminLayoutWrapper />
                    </RoleProtectedRoute>
                } 
            />

            {/* 6. CATCH ALL - Chống trang trắng */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;