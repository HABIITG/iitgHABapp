import { useAuth } from "../context/AuthProvider";
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import "../index.css";
import Menu_content from "../components/Menu_content.jsx";
// import menuData from "../menu.js"; // This import seems unused/redundant now
import axios from "axios";
import CreateMenuFallback from "../components/CreateMenuFallback.jsx"; // Renamed to match your usage

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  //if (loading) return <div>Loading...</div>;
  console.log("here", user);

  // Use useState for controlling the view (show CreateMenuFallback or Menu_content)
  const [showCreateMenu, setShowCreateMenu] = useState(false); // true to show form, false to show content
  const [currentMenu, setCurrentMenu] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize activeTab based on current day, ensuring it's 0-6 (Monday=0, Sunday=6)
    let initialDay = new Date().getDay(); // Sunday - Saturday : 0 - 6
    return initialDay === 0 ? 6 : initialDay - 1; // Convert to Monday=0, Sunday=6
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback to memoize fetchMess, preventing unnecessary re-creations
  const fetchMess = useCallback(async () => {
    if (!user?.messId) {
      console.log("User or Mess ID not available, skipping fetchMess.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log(`Fetching menu for Mess ID: ${user.messId}, Day: ${days[activeTab]}`);
      const response = await axios.post(`http://localhost:8000/api/mess/menu/admin/${user.messId}`,
        { day: days[activeTab] }, // Data for the request body
        { withCredentials: true } // Axios option for cookies/credentials
      );

      // Check if the response indicates no menu exists for the day
      if (response.data === "DoesntExist") {
        console.log("No menu exists for this day. Showing CreateMenuFallback.");
        setShowCreateMenu(true); // Show the creation form
        setCurrentMenu({ breakfast: [], lunch: [], dinner: [] }); // Clear previous menu data
      } else {
        console.log("Menu found for", days[activeTab], response.data);
        setShowCreateMenu(false); // Show the menu content

        const menuData = {
          breakfast: [],
          lunch: [],
          dinner: [],
        };

        // Assuming response.data is an array of menu items
        response.data.forEach(element => {
          if (element.type === 'Breakfast') {
            element.items.forEach(item => {
              menuData.breakfast.push({
                id: item._id,
                name: item.name,
                category: item.type // This refers to the Item's type (Dish, Breads, Others)
              });
            });
          } else if (element.type === 'Lunch') {
            element.items.forEach(item => {
              menuData.lunch.push({
                id: item._id,
                name: item.name,
                category: item.type
              });
            });
          } else if (element.type === 'Dinner') {
            element.items.forEach(item => {
              menuData.dinner.push({
                id: item._id,
                name: item.name,
                category: item.type
              });
            });
          }
        });

        console.log("Setting menu for", days[activeTab], menuData);
        setCurrentMenu(menuData);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      // If there's an error, it might mean the menu doesn't exist or a server issue
      // You might want to default to showing the create menu form or an error message
      setShowCreateMenu(true); // Default to showing create menu on error
      setCurrentMenu({ breakfast: [], lunch: [], dinner: [] }); // Clear menu data
    } finally {
      setIsLoading(false);
    }
  }, [user?.messId, activeTab]); // Dependencies for useCallback

  // Effect to call fetchMess when activeTab or user.messId changes
  useEffect(() => {
    fetchMess();
  }, [fetchMess]); // Depend on the memoized fetchMess function


  // Function to be passed to CreateMenuFallback
  // This is called when CreateMenuFallback successfully creates a menu
  const handleSuccessfulMenuCreation = () => {
    console.log("CreateMenuFallback signaled success. Re-fetching menu data...");
    setShowCreateMenu(false); // Hide the creation form
    fetchMess(); // Re-fetch data to display the newly created menu
  };
  const handleSuccessfulMenuItemCreation=()=>{
    console.log("CreateMenuFallback signaled success. Re-fetching menu data...");
    fetchMess();
  }
  // Function to explicitly go to the CreateMenuFallback form (e.g., from a "Modify" button)
  const handleGoToCreateMenu = () => {
    setShowCreateMenu(true);
    // Optionally clear currentMenu or set a loading state here if the form takes over
  };



  return (
    <div>
      <h1>Dashboard</h1>
      <h2>{user.hostel_name}</h2>
      <button onClick={() => logout()}>Logout</button>


      <div className="menu-page">
        <div className="header">
          <h1>HMC - Menu page</h1>
        </div>

        <div className="tabs-container">
          {days.map((day, index) => (
            <button
              key={day}
              className={`tab ${activeTab === index ? "active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {day}
            </button>
          ))}
        </div>
        <h2>{days[activeTab]} Menu</h2>

        {/* Conditional Rendering based on showCreateMenu state */}
        {showCreateMenu ? (
          // Pass the callback function to CreateMenuFallback
          <CreateMenuFallback onSuccessfulCreation={handleSuccessfulMenuCreation} />
        ) : (
          <>
            <div className="day-header">
              <h2>{days[activeTab]} Menu</h2>
              {isLoading && <p>Loading menu...</p>}
            </div>
            {!isLoading && (
              <Menu_content
                key={activeTab}
                day={days[activeTab]}
                breakfast={currentMenu.breakfast}
                lunch={currentMenu.lunch}
                dinner={currentMenu.dinner}
                messId={user?.messId}
                onSuccessfulItemCreation={handleSuccessfulMenuItemCreation}
                click={handleGoToCreateMenu} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;