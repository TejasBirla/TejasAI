import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminProjects from "./pages/AdminProjects";
import AdminAddProject from "./pages/AdminAddProjects";
import AdminEditProject from "./pages/AdminEditProjects";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects/add"
        element={
          <ProtectedRoute>
            <AdminAddProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects/edit/:id"
        element={
          <ProtectedRoute>
            <AdminEditProject />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
