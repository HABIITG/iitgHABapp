import React from "react";
import { Link } from "react-router-dom";

export default function MessItem({ mess }) {
  return (
    <li>
      <span>{mess.name}</span>
      <br />
      <span>Hostel: {mess.hostelName || "Not Assigned"}</span>
      <br />
      <Link to={`/mess/${mess._id}`}>
            <button>View Mess Details</button>
      </Link>
      <br />
      <button>View Mess Menu</button>
      <br />
      <button>Delete Mess</button>
    </li>
  );
}
