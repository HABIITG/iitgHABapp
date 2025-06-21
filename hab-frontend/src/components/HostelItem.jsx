import React from 'react';

export default function HostelItem({ hostelName, messCatererName }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800">{hostelName}</h2>
      <p className="text-sm text-gray-500">{messCatererName || "Mess not allotted"}</p>
    </div>
  );
}
