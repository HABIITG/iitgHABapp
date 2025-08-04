import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Caterers() {
  const [messes, setMesses] = useState([]);
  const navigate = useNavigate();
  const [error] = useState(false);

  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await axios.post("https://hab.codingclub.in/api/mess/all");
        setMesses(res.data);
      } catch (error) {
        console.error("Error fetching messes:", error);
      }
    };
    fetchMesses();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Heading Bar */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-800">
            Caterer Management
          </h1>
          <button
            onClick={() => navigate("/create-mess")}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md shadow text-xl"
          >
            + Add Caterer
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white mt-6 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b bg-gray-50 text-gray-600 ">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-xl">
                  Caterer Name
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-xl">
                  Hostel Name
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {error ? (
                <tr>
                  <td
                    colSpan="2"
                    className="text-center px-6 py-4 text-red-500"
                  >
                    Failed to fetch caterers.
                  </td>
                </tr>
              ) : messes.length === 0 ? (
                <tr>
                  <td
                    colSpan="2"
                    className="text-center px-6 py-6 text-gray-400 text-sm"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400 animate-ping"></div>
                    </div>
                    No caterers found.
                  </td>
                </tr>
              ) : (
                messes.map((mess, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/mess/${mess._id}`)}
                  >
                    <td className="px-6 py-4 font-medium">{mess.name}</td>
                    <td className="px-6 py-4">
                      {!mess.hostelName || mess.hostelName === "Unknown"
                        ? "No hostel assigned"
                        : mess.hostelName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
