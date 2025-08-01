import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllHostelList() {
  const navigate = useNavigate();
  const server = import.meta.env.VITE_SERVER_URL;

  const [hostelList, setHostelList] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(server + '/api/hostel/gethnc',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) throw new Error('Fetch failed');
        const data = await response.json();
        setHostelList(data);
      } catch (err) {
        setError(true);
        console.error('Failed to fetch hostel data:', err);
      }
    };
    fetchData();
  }, [server]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Heading Bar */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800">Hostel Management</h1>
          <button
            onClick={() => navigate('/create-hostel')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
            + Add Hostel
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white mt-6 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Hostel Name</th>
                <th className="px-6 py-3 text-sm font-semibold">Caterer Name</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {error ? (
                <tr>
                  <td colSpan="2" className="text-center px-6 py-4 text-red-500">
                    Failed to fetch hostels.
                  </td>
                </tr>
              ) : hostelList.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center px-6 py-6 text-gray-400 text-sm">
                    <div className="flex justify-center mb-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400 animate-ping"></div>
                    </div>
                    No hostels found.
                  </td>
                </tr>
              ) : (
                hostelList.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/hostel/${item._id}`)}>
                    <td className="px-6 py-4 font-medium">{item.hostel_name}</td>
                    <td className="px-6 py-4">{item.messId?.name || 'No caterer assigned'}</td>
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
