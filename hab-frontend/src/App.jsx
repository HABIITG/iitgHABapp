import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Hostels from "./pages/Hostels";
import Caterers from "./pages/Caterers";
import Students from "./pages/Students";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/hostels" element={<Hostels />} />
                    <Route path="/caterers" element={<Caterers />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
