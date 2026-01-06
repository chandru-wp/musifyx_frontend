import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserHome from "./pages/UserHome";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import SongDetail from "./pages/SongDetail";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Layout from "./components/Layout";

function ProtectedRoute({ children, allowedRoles }) {
  const { role } = useContext(AuthContext);

  if (!role) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Layout>{children}</Layout>;
}

function RoutesWrapper() {
  const { role } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={role ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={role ? <Navigate to="/" replace /> : <Register />} />

      <Route path="/" element={
        <ProtectedRoute>
          <UserHome />
        </ProtectedRoute>
      } />

      <Route path="/search" element={
        <ProtectedRoute>
          <Search />
        </ProtectedRoute>
      } />

      <Route path="/song/:id" element={
        <ProtectedRoute>
          <SongDetail />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <UserManagement />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { PlayerProvider } from "./context/PlayerContext";

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <RoutesWrapper />
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
}
