// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute, AdminRoute, UserRoute } from "./components/RouteGuards";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminDashboard from "./pages/Dashboard"; // Existing admin dashboard
import CharacterStatsForm from "./pages/CharacterStatsForm"; // New component

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import CharacterDetail from "./pages/user/CharacterDetail";
import UserProfile from "./pages/user/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Update the route to use the new CharacterStatsForm component */}
          <Route
            path="/characters/:id/stats"
            element={
              <AdminRoute>
                <CharacterStatsForm />
              </AdminRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />

          <Route
            path="/user/characters/:id"
            element={
              <UserRoute>
                <CharacterDetail />
              </UserRoute>
            }
          />

          <Route
            path="/user/profile"
            element={
              <UserRoute>
                <UserProfile />
              </UserRoute>
            }
          />

          {/* Root Redirects */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
