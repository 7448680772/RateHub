import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageStores from './pages/admin/ManageStores';
import StoreList from './pages/user/StoreList';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import UpdatePassword from './pages/user/UpdatePassword';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute role="admin"><ManageStores /></ProtectedRoute>
          } />

          <Route path="/stores" element={
            <ProtectedRoute role="user"><StoreList /></ProtectedRoute>
          } />
          <Route path="/owner/dashboard" element={
            <ProtectedRoute role="store_owner"><OwnerDashboard /></ProtectedRoute>
          } />
          <Route path="/update-password" element={
            <ProtectedRoute><UpdatePassword /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}