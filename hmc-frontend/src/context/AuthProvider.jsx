import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../apis"; // Assuming you have a common API base URL defined

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true); // Initial state is true

  const navigate = useNavigate();
  const logoutTimerRef = useRef(null);

  // Derived state: isAuthenticated
  const isAuthenticated = !!user && !!token; // Both user and token must be present for true authentication

  console.log(
    "AuthProvider Render - token:",
    token,
    "user:",
    user,
    "isLoading:",
    isLoading,
    "isAuthenticated:",
    isAuthenticated
  );

  const login = async (hostel_name, password) => {
    setIsLoading(true); // Set loading true during login process
    console.log("Login function called. Setting isLoading to true.");
    try {
      console.log("Attempting login for:", hostel_name);
      const res = await axios.post(
        `${API_BASE_URL}/hostel/login`,
        {
          hostel_name,
          password,
        }
      );

      const newToken = res.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken); // This will trigger the useEffect below

      // Set default header for Axios immediately for this session
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      // console.log("bugCheck", res.data.hostel);

      // Assuming login also returns user data (hostel data)
      setUser(res.data.hostel);
      console.log("Login successful! Token and user set.", res.data.hostel);
      navigate("/dashboard");
      // REMOVE OR COMMENT OUT THIS LINE:
      // navigate("/dashboard");
      // Let ProtectedRoute handle navigation based on the isAuthenticated state update.
      // If you navigate here, it bypasses the ProtectedRoute's logic and can cause
      // a redirect back if the state hasn't fully propagated on the new route render.
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Login failed");
      // Ensure state is clean on failure
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setIsLoading(false); // Login process complete
      console.log("Login function finished. Setting isLoading to false.");
    }
  };

  const logout = (reason = null) => {
    console.log("Logout function called. Reason:", reason);
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    if (reason) {
      alert(`${reason}. Please log in again.`);
    }

    navigate("/login");
  };

  const getData = async (currentAuthToken) => {
    console.log(
      "getData function called with token:",
      currentAuthToken ? "present" : "absent"
    );
    if (!currentAuthToken) {
      setUser(null);
      return;
    }
    try {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${currentAuthToken}`;
      const res = await axios.get(`${API_BASE_URL}/hostel/get`);
      
      console.log(res.data.hostel);

      setUser(res.data.hostel);
      console.log("getData successful. User set.");
    } catch (err) {
      console.error("Error fetching user data in getData:", err);
      // If fetching user data fails with an existing token, it's likely expired or invalid
      logout("Session has expired or is invalid during data refresh");
    }
  };

  // --- Primary useEffect for initial authentication check and token changes ---
  useEffect(() => {
    console.log("useEffect (initial load/token change) triggered.");
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      console.log(
        "Initial Auth Check: storedToken from localStorage:",
        storedToken ? "found" : "not found"
      );

      if (!storedToken) {
        setToken(null);
        setUser(null);
        setIsLoading(false); // No token, no loading needed for auth check
        console.log("No stored token. Setting isLoading to false. State:", {
          token: null,
          user: null,
          isLoading: false,
        });
        return;
      }

      // If token exists, set default Axios header immediately
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

      try {
        const decoded = jwtDecode(storedToken);
        const expire = decoded.exp * 1000 - Date.now();
        console.log("Token decoded. Expires in:", expire, "ms");

        if (expire < 1000) {
          // Check for near-expiry
          console.log(
            "Token expired or close to expiry on load. Calling logout."
          );
          logout("Session has expired");
          return;
        }

        // Only set token state if it's different (to avoid unnecessary re-renders)
        if (token !== storedToken) {
          setToken(storedToken);
        }

        // Fetch user data after verifying token validity
        await getData(storedToken); // Pass the storedToken directly
        console.log("getData completed after initial token check.");

        // Set auto-logout timer
        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
        }
        logoutTimerRef.current = setTimeout(() => {
          console.log("Auto-logout triggered by timer.");
          logout("Session has expired");
        }, expire);
        console.log("Auto-logout timer set for:", expire, "ms.");
      } catch (error) {
        console.error(
          "Error during initial auth check or token decode:",
          error
        );
        logout("Invalid Session during initial check"); // Force logout
      } finally {
        setIsLoading(false); // Authentication check and data fetch complete
        console.log("Initial Auth Check finished. Setting isLoading to false.");
      }
    };

    initializeAuth();

    // Cleanup function for useEffect to clear the timeout
    return () => {
      console.log("useEffect cleanup: Clearing logout timer.");
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []); // Empty dependency array: runs only once on mount

  // This useEffect ensures Axios header is always updated if token state changes
  // (e.g., after login or logout within the app that directly modifies 'token' state)
  // This is good practice to keep headers in sync.
  useEffect(() => {
    console.log(
      "Token state change useEffect triggered. Current token:",
      token ? "present" : "absent"
    );
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Value provided by the context
  const authContextValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading, // EXPOSE isLoading here
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}{" "}
      {/* Always render children, ProtectedRoute will handle loading/redirect */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
