import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
//import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");

  useEffect(() => {
    async function fetchHostels() {
      try {
        await axios
          .get("http://localhost:8000/api/hostel/all", {
            withCredentials: true,
          })
          .then((res) => setHostels(res.data));
      } catch (error) {
        console.error("Error fetching hostels:", error);
      }
    }
    fetchHostels();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-evenly bg-white rounded-2xl p-6 sm:p-8 gap-4 w-full max-w-lg shadow-md">
        <p className="text-2xl sm:text-3xl font-semibold">HMC Login Page</p>

        <select
          className="border border-gray-300 p-2 rounded-md w-full"
          value={selectedHostel}
          onChange={(e) => setSelectedHostel(e.target.value)}
        >
          <option value="">Select Your Hostel</option>
          {hostels.map((hostel) => (
            <option key={hostel._id} value={hostel.hostel_name}>
              {hostel.hostel_name}
            </option>
          ))}
        </select>

        <input
          placeholder="Password"
          className="border border-gray-300 rounded-md p-2 w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className={`w-full py-2 px-4 rounded font-bold transition ${
            selectedHostel && password
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedHostel || !password}
          onClick={() => login(selectedHostel, password)}
        >
          Login
        </button>
      </div>
    </div>
  );
}
