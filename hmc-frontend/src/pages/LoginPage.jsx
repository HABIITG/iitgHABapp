import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");

  useEffect(() => {
    async function fetchHostels() {
      try {
        await axios
          .get("http://localhost:3000/api/hostel/all", {
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
    <div className="flex flex-col items-center justify-evenly bg-white rounded-2xl p-8 gap-4 h-1/2 w-1/3">
      <p className="text-4xl">HMC Login Page</p>
      <select
        className="border border-gray-300 p-2 rounded-md"
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
        className="border border-gray-300 rounded-md p-2 mb-4"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className={
          selectedHostel && password
            ? "bg-blue-500 hover:bg-blue-700 text-white font-bold w-1/2 py-2 px-4 rounded"
            : "bg-gray-300 text-gray-500 font-bold w-1/2 py-2 px-4 rounded"
        }
        disabled={!selectedHostel || !password}
        onClick={() => login(selectedHostel, password)}
      >
        Login
      </button>
    </div>
  );
}
