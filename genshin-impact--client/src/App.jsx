import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/user/Profile";
import Favorites from "./pages/user/Favorites";
import CharacterList from "./pages/characters/CharacterList";
import CharacterDetail from "./pages/characters/CharacterDetail";
import WeaponList from "./pages/weapons/WeaponList";
import WeaponDetail from "./pages/weapons/WeaponDetail";
import RegionList from "./pages/regions/RegionList";
import RegionDetail from "./pages/regions/RegionDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/characters" element={<CharacterList />} />
            <Route path="/characters/:id" element={<CharacterDetail />} />
            <Route path="/weapons" element={<WeaponList />} />
            <Route path="/weapons/:id" element={<WeaponDetail />} />
            <Route path="/regions" element={<RegionList />} />
            <Route path="/regions/:id" element={<RegionDetail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
