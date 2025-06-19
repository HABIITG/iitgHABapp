import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const login = async (hostel_name, password) => {
    try {
      const res = await axios.post("http://localhost:3000/api/hostel/login", {
        hostel_name,
        password,
      });

      localStorage.setItem("token", res.data.token); // Save JWT
      setToken(res.data.token);
      setUser(res.data.hostel); // Save hostel in context
      navigate("/dashboard"); // Navigate to protected route
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const logout = (reason = null) => {
    localStorage.removeItem("token");
    setUser(null);
    setToken("");

    if (!reason) {
      alert(`${reason}. Please log in again.`);
    }

    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Token expiry
    const decoded = jwtDecode(token);
    const expire = decoded.exp * 1000 - Date.now();
    if (expire < 0) {
      logout("Session has expired");
      return;
    }

    // Auto-logout on expiry
    const timeout = setTimeout(() => {
      logout("Session has expired");
    }, expire);

    const getData = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`http://localhost:3000/api/hostel/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.hostel);
      } catch (err) {
        console.log(err);
        logout("Invalid Session");
      }
    };

    getData().finally(() => setLoading(false)); // Refresh data

    return () => clearTimeout(timeout); // Cleanup
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, loading, token, login, logout, isAuthenticated: !!user }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
