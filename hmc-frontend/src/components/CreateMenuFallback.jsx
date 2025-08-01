import React, { useState } from 'react';
import axios from 'axios'; // Assuming you'll make an API call
// Corrected import path for AuthProvider - assuming a common src/context/AuthProvider structure
import { useAuth } from '../context/AuthProvider'; // Adjust this path based on your actual project structure

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
  const { user } = useAuth(); // Assuming you need user.messId here for the API call
  const [menuType, setMenuType] = useState('');
  const [day, setDay] = useState('');
  const [BisGala, setBIsGala] = useState(false);
  const [BstartTime, setBStartTime] = useState('');
  const [BendTime, setBEndTime] = useState('');
  const [LstartTime, setLStartTime] = useState('');
  const [LendTime, setLEndTime] = useState('');
  const [LisGala, setLIsGala] = useState(false);
  const [DstartTime, setDStartTime] = useState('');
  const [DendTime, setDEndTime] = useState('');
const [DisGala, setDIsGala] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const menuTypes = ["Breakfast", "Lunch", "Dinner"];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const formData = {
      messId: user?.messId, // Include messId from context
      day: day,
      BstartTime: BstartTime,
      BendTime: BendTime,
      BisGala: BisGala,
      LstartTime: LstartTime,
      LendTime: LendTime,
      LisGala: LisGala,
      DstartTime: DstartTime,
      DendTime: DendTime,
      DisGala: DisGala, // This 'type' refers to Breakfast/Lunch/Dinner
      items: [] // Assuming you'll add item IDs here later or in a separate form
    };

    console.log('Attempting to create menu with data:', formData);

    try {
      // Replace with your actual API endpoint for creating a menu
      const response = await axios.post('http://localhost:8000/api/mess/menu/create', formData, {
        withCredentials: true,
      });

      console.log('Menu creation successful:', response.data);
      setSuccessMessage("Menu created successfully!");

      // Call the callback function passed from Dashboard
      // This will trigger Dashboard to hide this form and re-fetch the menu
      if (onSuccessfulCreation) {
        onSuccessfulCreation();
      }

      // Optionally reset form fields after successful submission
      
      setBIsGala(false);
      setDay('');
      setBStartTime('');
      setBEndTime('');
      setMenuType('');
      setLIsGala(false);
      setLStartTime('');
      setLEndTime('');
      setMenuType('');
      setDIsGala(false);
      setDStartTime('');
      setDEndTime('');

    } catch (err) {
      console.error('Error creating menu:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to create menu. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style> {/* Injects the simulated CSS */}
      <div className="menu-form-container">
        <h2 className="form-title">Create New Menu for a Day</h2>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}

          

          <div className="form-group">
            <p>Breakfast</p>
            <label htmlFor="day" className="form-label">Day of the Week</label>
            <select
              id="day"
              className="form-select"
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

          <div className="form-group">
            <label htmlFor="startTime" className="form-label">Start Time</label>
            <input
              type="time"
              id="startTime"
              className="form-input"
              value={BstartTime}
              onChange={(e) => setBStartTime(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime" className="form-label">End Time</label>
            <input
              type="time"
              id="endTime"
              className="form-input"
              value={BendTime}
              onChange={(e) => setBEndTime(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-checkbox-group">
            <input
              type="checkbox"
              id="isGala"
              className="form-checkbox"
              checked={BisGala}
              onChange={(e) => setBIsGala(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="isGala" className="form-label" style={{ marginBottom: 0 }}>Is this a Gala Menu?</label>
          </div>
              <div className="form-group">
            <p>Lunch</p>
            
          </div>

          <div className="form-group">
            <label htmlFor="startTime" className="form-label">Start Time</label>
            <input
              type="time"
              id="startTime"
              className="form-input"
              value={LstartTime}
              onChange={(e) => setLStartTime(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime" className="form-label">End Time</label>
            <input
              type="time"
              id="endTime"
              className="form-input"
              value={LendTime}
              onChange={(e) => setLEndTime(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-checkbox-group">
            <input
              type="checkbox"
              id="isGala"
              className="form-checkbox"
              checked={LisGala}
              onChange={(e) => setLIsGala(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="isGala" className="form-label" style={{ marginBottom: 0 }}>Is this a Gala Menu?</label>
          </div>
          <div className="form-group">
            <p>Dinner</p>
            
          </div>

          <div className="form-group">
            <label htmlFor="startTime" className="form-label">Start Time</label>
            <input
              type="time"
              id="startTime"
              className="form-input"
              value={DstartTime}
              onChange={(e) => setDStartTime(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime" className="form-label">End Time</label>
            <input
              type="time"
              id="endTime"
              className="form-input"
              value={DendTime}
              onChange={(e) => setDEndTime(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-checkbox-group">
            <input
              type="checkbox"
              id="isGala"
              className="form-checkbox"
              checked={DisGala}
              onChange={(e) => setDIsGala(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="isGala" className="form-label" style={{ marginBottom: 0 }}>Is this a Gala Menu?</label>
          </div>
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Menu...' : 'Add Menu'}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateMenuFallback;
