import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard.jsx"; // Create this page
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-200">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
export default App;
