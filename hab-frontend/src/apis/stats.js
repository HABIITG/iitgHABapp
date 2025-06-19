import axios from "axios";
import { BACKEND_URL } from "./server";

export const getStatsByDate = async (date) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/logs/get/${date}`);
    return (response.data) ;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};