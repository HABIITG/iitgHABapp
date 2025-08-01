import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function MessMenu() {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    async function fetchMessMenu() {
      try {
        const res = await axios.post(
          `http://localhost:8000/api/mess/hab-menu/${id}`,
          { day: "Monday" }
        );
        setMenu(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching mess menu:", error);
      }
    }
    fetchMessMenu();
  }, [id]);
  if (!menu || menu.length === 0) {
    return <span>No Menu</span>;
  }
  return (
    <div>
      <h1>Menu</h1>
      {menu.map((menuItem) => (
        <div key={menuItem._id}>
          <div>Day: {menuItem.day}</div>
          <div>Type: {menuItem.type}</div>
          <div>Items: {menuItem.items}</div>
          <br />
        </div>
      ))}
    </div>
  );
}
