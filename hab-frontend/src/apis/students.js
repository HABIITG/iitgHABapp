import axios from "axios";
import { BACKEND_URL } from "./server";

export const getStudents = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/students`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  const response = await fetch(`${BACKEND_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Error creating user: ${response.status}`);
  }

  return response.json();
};
