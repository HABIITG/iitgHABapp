import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function HostelPage() {
  const { hostelId } = useParams();
  const navigate = useNavigate();

  const [unassignedMess, setUnassignedMess] = useState([]);
  const [selectedMess, setSelectedMess] = useState('');
  const [hostel, setHostel] = useState(null);
  const [messDetails, setMessDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnassignedMess = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/mess/unassigned`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setUnassignedMess(data);
      } catch (err) {
        console.error('Error fetching unassigned mess:', err);
        setError('Could not load mess data.');
      }
    };

    fetchUnassignedMess();
  }, []);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/hostel/all/${hostelId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setHostel(data.hostel);

        if (data.hostel.messId) {
          const messRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/mess/${data.hostel.messId._id}`);
          const messData = await messRes.json();
          setMessDetails(messData);
          console.log('Mess Details:', messData);
        }
      } catch (err) {
        console.error('Error fetching hostel:', err);
        setError('Could not load hostel data.');
      }
    };

    fetchHostel();
  }, [hostelId]);

  const handleCatererChange = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/mess/reassign/${selectedMess}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostelId: hostelId,
          oldMessId: hostel?.messId?._id,
        }),
      });

      if (!res.ok) throw new Error('Failed to reassign caterer');
      window.location.reload();
    } catch (err) {
      console.error('Reassign error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/hostel/delete/${hostelId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Deletion failed');

      const messUnassigned = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/mess/unassign/${messDetails._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!messUnassigned.ok) throw new Error('Failed to unassign mess');
      navigate('/hostels');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (!hostel) {
    return <div className="p-6 text-gray-600">Loading hostel...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{hostel.hostel_name}</h1>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
          >
            Delete Hostel
          </button>
        </div>

        {/* Grid Layout for Users + Mess */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Users Table */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Users ({hostel.users?.length || 0})
            </h2>
            {hostel.users?.length > 0 ? (
              <div className="overflow-x-auto rounded shadow-sm border">
                <table className="min-w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Degree</th>
                      <th className="px-4 py-2">Roll No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostel.users.map((user, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{user.user.name}</td>
                        <td className="px-4 py-2">{user.user.degree}</td>
                        <td className="px-4 py-2">{user.user.rollNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No users assigned.</p>
            )}
          </div>

          {/* Mess Details */}
          {messDetails && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Caterer Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Name:</span>
                  <span className="text-gray-900">{messDetails.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Rating:</span>
                  <span className="text-yellow-600 font-semibold">{messDetails.rating?.toFixed(1) || '0.0'} / 5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Ranking:</span>
                  <span className="text-gray-900">{messDetails.ranking || 'Not Ranked'}</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-medium text-gray-700 mb-2">Feedbacks</h3>
                {messDetails.complaints?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {messDetails.complaints.map((fb, idx) => (
                      <li key={idx}>{fb}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No feedbacks available.</p>
                )}
              </div>

              {/* Caterer Change */}
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-1">Change Caterer</label>
                <div className="flex gap-3">
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedMess}
                    onChange={(e) => setSelectedMess(e.target.value)}
                  >
                    <option value="">-- Choose a new caterer --</option>
                    {unassignedMess.map((mess) => (
                      <option key={mess._id} value={mess._id}>
                        {mess.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleCatererChange}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No Mess Assigned */}
          {!messDetails && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-
50 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">No Caterer Assigned</h2>
              <p className="text-gray-600">This hostel currently has no caterer assigned.</p>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-1">Assign a Caterer</label>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedMess}
                  onChange={(e) => setSelectedMess(e.target.value)}
                >
                  <option value="">-- Choose a caterer --</option>
                  {unassignedMess.map((mess) => (
                    <option key={mess._id} value={mess._id}>
                      {mess.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCatererChange}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow mt-2"
                >
                  Assign
                </button>
              </div>
          
            </div>
          )}
        </div>

        {error && <div className="text-red-500">{error}</div>}
        </div>
      </div>
      );
}
