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

export const getAllHostelMessInfo = async () => {
  try {
    const response = await axios.post(`${BACKEND_URL}/mess/all`);
    return (response.data);
  }
  catch (error) {
    console.error("Error fetching hostel and mess data", error);
    throw error;
  }
};
export const getAllHostelsWithMess = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/hostel/allhostel`);
    console.log(response)
    const hostels = response.data;
    return hostels;
  } catch (error) {
    console.error("Error fetching hostels:", error);
    throw error;
  }
};