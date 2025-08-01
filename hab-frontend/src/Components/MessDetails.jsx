import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function MessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  //console.log("Mess ID from URL:", id);
  const [mess, setMess] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    async function fetchMess() {
      try {
        const res = await axios.get(`http://localhost:8000/api/mess/${id}`);
        setMess(res.data);
      } catch (error) {
        console.error("Error fetching mess:", error);
      }
    }

    fetchMess();
  }, [id]);

  useEffect(() => {
    async function fetchHostels() {
      try {
        const res = await axios.get("http://localhost:8000/api/hostel/all");
        const hostels = res.data;
        setHostels(hostels.filter((hostel) => hostel.messId === null));
      } catch (error) {
        console.error("Error fetching hostels :", error);
      }
    }
    fetchHostels();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/mess/delete/${id}`
      );
      if (res.status === 200) {
        alert("Mess deleted successfully");
        navigate("/caterers/");
      }
    } catch (error) {
      console.error("Error deleting mess:", error);
      alert("Failed to delete mess");
    }
  };

  const handleHostelChange = async () => {
    console.log(mess.hostelId);
    if (!mess.hostelId) {
      try {
        console.log(hostelId);
        const res = await axios.post(
          `http://localhost:8000/api/mess/reassign/${id}`,
          {
            hostelId: hostelId,
          }
        );
        if (res.status === 200) {
          alert("Hostel assigned successfully");
          navigate(0);
        }
      } catch (error) {
        console.error("Error assigning ", error);
        alert("Failed to assign hostel");
      }
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8000/api/mess/change-hostel/${id}`,
          {
            hostelId: hostelId,
            oldHostelId: mess.hostelId,
          }
        );
        if (res.status === 200) {
          alert("Hostel assigned successfully");
          navigate(0);
        }
      } catch (error) {
        console.error("Error assigning ", error);
        alert("Failed to assign hostel");
      }
    }
  };

  const handleMenu = () => {
    navigate(`/mess/menu/${id}`);
  };

  const handleGoBack = () => {
    navigate("/caterers/");
  };

  const hostelPage = () => {
    if (mess.hostelId) {
      navigate(`/hostel/${mess.hostelId}`);
    }
  };

  if (!mess) {
    return <div className="p-6 text-gray-600">Failed to load Caterer</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex  items-center justify-between mb-6">
        <button
          onClick={handleGoBack}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-md shadow text-lg"
        >
          Go Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{mess.name}</h1>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md shadow text-lg "
        >
          Delete Mess
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="text-lg text-gray-700">
            <span>
              Hostel : {!mess.hostelId ? "No hostel assigned" : mess.hostelName}
            </span>
            {mess.hostelId && (
              <button
                onClick={hostelPage}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-md shadow text-lg ml-6"
              >
                View Hostel
              </button>
            )}
          </div>
          <div className="space-y-2">
            <label className=" text-gray-700 text-lg">
              {!mess.hostelId ? "Assign Hostel" : "Change Hostel"}
            </label>
            <div className="flex gap-4">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={hostelId}
                onChange={(e) => setHostelId(e.target.value)}
              >
                <option value="">Choose a New Hostel</option>
                {hostels.map((hostel) => (
                  <option key={hostel._id} value={hostel._id}>
                    {hostel.hostel_name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleHostelChange}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-md shadow text-lg"
              >
                {!mess.hostelId ? "Assign" : "Change"}
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={handleMenu}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-md shadow text-lg"
            >
              View Menu
            </button>
          </div>
          <div className="text-lg text-gray-700">
            <span>Rating: {mess.rating}</span>
          </div>
          <div className="text-lg text-gray-700">
            <span>Ranking: {mess.ranking}</span>
          </div>
          <div className="text-lg text-gray-700">
            <span>Complaints: {mess.complaints}</span>
          </div>
          <div className="text-lg text-gray-700">
            <span>Statistics:</span>
          </div>
        </div>
        <div className="md:self-start md:mt-0 mt-6 flex flex-col items-center mr-10">
          <div className="text-lg font-medium text-gray-700 mb-2">QR Code</div>
          <img
            src={mess.qr_img}
            alt="QR Code"
            className="w-50 h-50 border-grey-700 rounded shadow"
          />
          <a
            href={mess.qr_img}
            download={`QR_${mess.name}`}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded-md shadow text-lg mt-5"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
