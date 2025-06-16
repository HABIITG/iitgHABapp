import React, { useState } from "react";
import Papa from "papaparse";
import { createUser } from "../apis/students.js";

const Students = () => {
  const [csvData, setCsvData] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setCsvData(results.data);
      },
    });
  };

  const handleSubmit = async () => {
    if (csvData.length === 0) {
      alert("Please upload a valid CSV first.");
      return;
    }
    console.log(csvData);

    setUploading(true);
    let createdCount = 0;
    const hostelId = "685035ff1a90f4fcf1b1988a";

    for (let row of csvData) {
      try {
        const payload = {
          name: row["Name"],
          rollNumber: row["Roll Number"],
          email: row["IITG Email"],
          hostel: hostelId,
        };
        await createUser(payload);
        createdCount++;
      } catch (err) {
        console.error(`Failed to create user: ${row["Name"]}`, err);
      }
    }

    setUploading(false);
    alert(`${createdCount} users created successfully.`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Upload Student CSV
        </h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:border-0
            file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200"
        />

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded"
        >
          {uploading ? "Creating Users..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Students;
