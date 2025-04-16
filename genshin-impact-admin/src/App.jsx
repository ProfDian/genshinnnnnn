import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CharacterList from "./pages/Characters/CharacterList";
import CharacterForm from "./pages/Characters/CharacterForm";
import CharacterDetail from "./pages/Characters/CharacterDetail";
import WeaponDetail from "./pages/Weapons/WeaponDetail";
import WeaponList from "./pages/Weapons/WeaponList";
import WeaponForm from "./pages/Weapons/WeaponForm";
import RegionList from "./pages/Regions/RegionList";
import RegionForm from "./pages/Regions/RegionForm";
import RegionAreaTrash from "./pages/Regions/Region AreaTrash";
import UserList from "./pages/Users/UserList";
import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Main App
const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Character Routes */}
        <Route
          path="/characters"
          element={
            <ProtectedRoute>
              <CharacterList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/characters/create"
          element={
            <ProtectedRoute>
              <CharacterForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/characters/:id"
          element={
            <ProtectedRoute>
              <CharacterDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/characters/edit/:id"
          element={
            <ProtectedRoute>
              <CharacterForm />
            </ProtectedRoute>
          }
        />
        {/* Weapon Routes */}
        <Route
          path="/weapons"
          element={
            <ProtectedRoute>
              <WeaponList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weapons/create"
          element={
            <ProtectedRoute>
              <WeaponForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weapons/edit/:id"
          element={
            <ProtectedRoute>
              <WeaponForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weapons/:id"
          element={
            <ProtectedRoute>
              <WeaponDetail />
            </ProtectedRoute>
          }
        />
        {/* Region Routes */}
        <Route
          path="/regions"
          element={
            <ProtectedRoute>
              <RegionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/regions/create"
          element={
            <ProtectedRoute>
              <RegionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/regions/edit/:id"
          element={
            <ProtectedRoute>
              <RegionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/regions/trash"
          element={
            <ProtectedRoute>
              <RegionAreaTrash />
            </ProtectedRoute>
          }
        />
        {/* User Routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
