// Glavna aplikacija - definisanje svih ruta
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import ChatPage from "./pages/chat/ChatPage";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
// TODO: Dodaj rutu za profil kada implementiraš ProfilePage

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />
      <Route path="/404" element={<NotFoundStranica />} />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <ChatPage />
          </ProtectedRoute>
        }
      />
      {/* Preusmerava na login kao default rutu */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/* Catch-all ruta za nepostojeće stranice */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;