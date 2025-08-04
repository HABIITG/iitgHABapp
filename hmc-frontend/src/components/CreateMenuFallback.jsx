import React, { useState } from "react";
import axios from "axios"; // Assuming you'll make an API call
// Corrected import path for AuthProvider - assuming a common src/context/AuthProvider structure
import { useAuth } from "../context/AuthProvider"; // Adjust this path based on your actual project structure
import { API_BASE_URL } from "../apis"; // Assuming you have a common API base URL defined
// This section simulates a separate CSS file for styling
// In a real project, this would be a .css file imported, e.g., import './MenuForm.css';
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .menu-form-container {
    font-family: 'Inter', sans-serif;
    background-color: #f0f4f8; /* Light background */
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    max-width: 500px;
    margin: 2rem auto;
    border: 1px solid #e2e8f0;
    color: #334155; /* Darker text */
  }

  .form-title {
    font-size: 1.875rem; /* 30px */
    font-weight: 700;
    color: #1a202c; /* Very dark blue */
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #4a5568; /* Medium dark blue */
  }

  .form-input,
  .form-select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #cbd5e0; /* Light border */
    border-radius: 8px;
    font-size: 1rem;
    color: #2d3748; /* Darker input text */
    background-color: #ffffff;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: #4299e1; /* Blue on focus */
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); /* Soft blue shadow */
  }

  .form-checkbox-group {
    display: flex;
    align-items: center;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }

  .form-checkbox {
    margin-right: 0.75rem;
    transform: scale(1.2); /* Slightly larger checkbox */
  }

  .submit-button {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background-image: linear-gradient(to right, #4299e1, #63b3ed); /* Blue gradient */
    color: white;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.125rem;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 10px rgba(66, 153, 225, 0.3);
  }

  .submit-button:hover {
    background-image: linear-gradient(to right, #3182ce, #4299e1); /* Darker blue on hover */
    box-shadow: 0 6px 15px rgba(66, 153, 225, 0.4);
    transform: translateY(-2px);
  }

  .submit-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(66, 153, 225, 0.3);
  }
`;

// CreateMenuFallback component receives onSuccessfulCreation prop
function CreateMenuFallback({ onSuccessfulCreation }) {
  const { user } = useAuth();
  const [day, setDay] = useState("");
  const [BisGala, setBIsGala] = useState(false);
  const [BstartTime, setBStartTime] = useState("");
  const [BendTime, setBEndTime] = useState("");
  const [LstartTime, setLStartTime] = useState("");
  const [LendTime, setLEndTime] = useState("");
  const [LisGala, setLIsGala] = useState(false);
  const [DstartTime, setDStartTime] = useState("");
  const [DendTime, setDEndTime] = useState("");
  const [DisGala, setDIsGala] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const formData = {
      messId: user?.messId,
      day: day,
      BstartTime: BstartTime,
      BendTime: BendTime,
      BisGala: BisGala,
      LstartTime: LstartTime,
      LendTime: LendTime,
      LisGala: LisGala,
      DstartTime: DstartTime,
      DendTime: DendTime,
      DisGala: DisGala,
      items: [],
    };

    console.log("Attempting to create menu with data:", formData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/mess/menu/create`,
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Menu creation successful:", response.data);
      setSuccessMessage("Menu created successfully!");

      if (onSuccessfulCreation) {
        onSuccessfulCreation();
      }

      // Reset form
      setBIsGala(false);
      setDay("");
      setBStartTime("");
      setBEndTime("");
      setLIsGala(false);
      setLStartTime("");
      setLEndTime("");
      setDIsGala(false);
      setDStartTime("");
      setDEndTime("");
    } catch (err) {
      console.error(
        "Error creating menu:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.message ||
          "Failed to create menu. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold text-center">
          Create New Menu for a Day
        </h2>
      </div>

      {/* Form Container */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Day Selection */}
          <div className="space-y-2">
            <label
              htmlFor="day"
              className="block text-sm font-semibold text-gray-700"
            >
              Day of the Week
            </label>
            <select
              id="day"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">Select a day</option>
              {daysOfWeek.map((dayOption) => (
                <option key={dayOption} value={dayOption}>
                  {dayOption}
                </option>
              ))}
            </select>
          </div>

          {/* Breakfast Section */}
          <div className="bg-orange-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-orange-800 border-b border-orange-200 pb-2">
              🌅 Breakfast
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={BstartTime}
                  onChange={(e) => setBStartTime(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={BendTime}
                  onChange={(e) => setBEndTime(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="breakfast-gala"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={BisGala}
                onChange={(e) => setBIsGala(e.target.checked)}
                disabled={isSubmitting}
              />
              <label
                htmlFor="breakfast-gala"
                className="text-sm font-medium text-gray-700"
              >
                Is this a Gala Menu?
              </label>
            </div>
          </div>

          {/* Lunch Section */}
          <div className="bg-yellow-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-yellow-800 border-b border-yellow-200 pb-2">
              ☀️ Lunch
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={LstartTime}
                  onChange={(e) => setLStartTime(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={LendTime}
                  onChange={(e) => setLEndTime(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="lunch-gala"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={LisGala}
                onChange={(e) => setLIsGala(e.target.checked)}
                disabled={isSubmitting}
              />
              <label
                htmlFor="lunch-gala"
                className="text-sm font-medium text-gray-700"
              >
                Is this a Gala Menu?
              </label>
            </div>
          </div>

          {/* Dinner Section */}
          <div className="bg-purple-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-purple-800 border-b border-purple-200 pb-2">
              🌙 Dinner
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={DstartTime}
                  onChange={(e) => setDStartTime(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={DendTime}
                  onChange={(e) => setDEndTime(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="dinner-gala"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={DisGala}
                onChange={(e) => setDIsGala(e.target.checked)}
                disabled={isSubmitting}
              />
              <label
                htmlFor="dinner-gala"
                className="text-sm font-medium text-gray-700"
              >
                Is this a Gala Menu?
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Menu...</span>
              </div>
            ) : (
              "Add Menu"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMenuFallback;
