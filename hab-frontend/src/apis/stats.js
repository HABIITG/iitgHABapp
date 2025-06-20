import axios from "axios";
import { BACKEND_URL } from "./server";

export const getStatsByDate = async (date) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/logs/get/${date}`);
    return (response.data);
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

export const getAllHostelMessInfo = async () => {
  try {
    const response = await axios.post(`${BACKEND_URL}/mess/all`);
    return (response.data);
  }
  catch (error) {
    console.error("Error fetching hostel and mess data", error);
    throw error;
  }
}