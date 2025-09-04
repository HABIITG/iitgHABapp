import axios from "axios";
import { BACKEND_URL } from "./server";

// Get all hostels
export const getAllHostels = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/hostel/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hostels:", error);
    throw error;
  }
};

// Get all hostel names and caterer info
export const getAllHostelNamesAndCaterers = async () => {
  try {
    const response = await axios.post(`${BACKEND_URL}/hostel/gethnc`);
    return response.data;
  } catch (error) {
    console.error("Error fetching hostel names and caterers:", error);
    throw error;
  }
};

// Get hostel by ID with users
export const getHostelById = async (hostelId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/hostel/all/${hostelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hostel ${hostelId}:`, error);
    throw error;
  }
};

// Create new hostel
export const createHostel = async (hostelData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/hostel/create`,
      hostelData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating hostel:", error);
    throw error;
  }
};

// Update hostel
export const updateHostel = async (hostelId, hostelData) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/hostel/update/${hostelId}`,
      hostelData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating hostel ${hostelId}:`, error);
    throw error;
  }
};

// Delete hostel
export const deleteHostel = async (hostelId) => {
  try {
    const response = await axios.delete(
      `${BACKEND_URL}/hostel/delete/${hostelId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting hostel ${hostelId}:`, error);
    throw error;
  }
};
