import axios from "axios";
import { BACKEND_URL } from "./server";

export const getStatsByDate = async (date, messId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/logs/get/${date}`, {
      params: messId ? { messId } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

export const getAllHostels = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/hostel/allHostels`);
    const hostels = response.data.hostels;
    return hostels;
  } catch (error) {
    console.error("Error fetching hostels:", error);
    throw error;
  }
};
