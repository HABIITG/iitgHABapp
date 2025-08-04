import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HostelForm() {
  const server = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const [hostelName, setHostelName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [messId, setMessId] = useState("");
  const [unassignedMess, setUnassignedMess] = useState([]);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");

  const uploadHandle = async (e) => {
    e.preventDefault();
    setError(null);

    const hostelData = {
      hostel_name: hostelName,
      current_cap: Number(capacity),
      password,
    };

    try {
      const response = await fetch(`${server}/api/hostel/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hostelData),
      });

      if (!response.ok) throw new Error("Failed to create hostel");

      navigate("/hostels");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Something went wrong while uploading.");
    }
  };

  useEffect(() => {
    const fetchUnassignedMess = async () => {
      try {
        const response = await fetch(`${server}/api/mess/unassigned`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUnassignedMess(data);

        setMessId(data.length > 0 ? data[0]._id : "");
      } catch (error) {
        console.error("Failed to fetch unassigned mess:", error);
        setError("Failed to load mess caterers.");
      }
    };

    fetchUnassignedMess();
  }, [server]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={uploadHandle}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800">Add New Hostel</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Hostel Name
          </label>
          <input
            type="text"
            value={hostelName}
            onChange={(e) => setHostelName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Capacity
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mess Caterer
          </label>
          <select
            value={messId}
            onChange={(e) => setMessId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {unassignedMess.map((mess) => (
              <option key={mess._id} value={mess._id}>
                {mess.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Create Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
