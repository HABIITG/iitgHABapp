import { useAuth } from "../context/AuthProvider";
import React, { useState, useEffect, useCallback } from "react";
import Menu_content from "../components/Menu_content.jsx";
import axios from "axios";
import { API_BASE_URL } from "../apis"; // Assuming you have a common API base URL defined
import CreateMenuFallback from "../components/CreateMenuFallback.jsx";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const Dashboard = () => {
  const [menuId, setMenuId] = useState(null);
  const { user, logout } = useAuth();
  console.log("here", user);

  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [activeTab, setActiveTab] = useState(() => {
    let initialDay = new Date().getDay();
    return initialDay === 0 ? 6 : initialDay - 1;
  });
  const [isLoading, setIsLoading] = useState(true);

  console.log("User:", user);

  // if(user === null) {
  //   console.log("User is null");
  // }
  // else {
  //   console.log("User is not null");
  // }

  const fetchMess = useCallback(async () => {
    console.log("Fetching mess for user:", user.messId);
    if (!user?.messId) {
      console.log("User or Mess ID not available, skipping fetchMess.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log(
        `Fetching menu for Mess ID: ${user.messId}, Day: ${days[activeTab]}`
      );
      const response = await axios.post(
        `${API_BASE_URL}/mess/menu/admin/${user.messId._id}`,
        { day: days[activeTab] }, // Data for the request body
        { withCredentials: true } // Axios option for cookies/credentials
      );

      if (response.data === "DoesntExist") {
        console.log("No menu exists for this day. Showing CreateMenuFallback.");
        setShowCreateMenu(true);
        setCurrentMenu({ breakfast: [], lunch: [], dinner: [] });
      } else {
        console.log("Menu found for", days[activeTab], response.data);
        setShowCreateMenu(false);

        const menuData = {
          breakfast: [],
          lunch: [],
          dinner: [],
          id: response.data._id, // Store the menu ID for later use
        };

        response.data.forEach((element) => {
          if (element.type === "Breakfast") {
            element.items.forEach((item) => {
              menuData.breakfast.push({
                id: item._id,
                name: item.name,
                category: item.type,
              });
            });
          } else if (element.type === "Lunch") {
            element.items.forEach((item) => {
              menuData.lunch.push({
                id: item._id,
                name: item.name,
                category: item.type,
              });
            });
          } else if (element.type === "Dinner") {
            element.items.forEach((item) => {
              menuData.dinner.push({
                id: item._id,
                name: item.name,
                category: item.type,
              });
            });
          }
        });

        console.log("Setting menu for", days[activeTab], menuData);
        setCurrentMenu(menuData);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      setShowCreateMenu(true);
      setCurrentMenu({ breakfast: [], lunch: [], dinner: [] });
    } finally {
      setIsLoading(false);
    }
  }, [user?.messId, activeTab]);

  useEffect(() => {
    fetchMess();
  }, [fetchMess]);

  const handleSuccessfulMenuCreation = () => {
    console.log(
      "CreateMenuFallback signaled success. Re-fetching menu data..."
    );
    setShowCreateMenu(false);
    fetchMess();
  };

  const handleSuccessfulMenuItemCreation = () => {
    console.log(
      "CreateMenuFallback signaled success. Re-fetching menu data..."
    );
    fetchMess();
  };

  const handleGoToCreateMenu = () => {
    setShowCreateMenu(true);
  };

  return (
    <div className="min-w-7xl bg-gray-50">
      {/* Main Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex justify-between items-center mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <h2 className="text-lg text-gray-600">{user.hostel_name}</h2>
          </div>
          <button
            onClick={() => logout()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Menu Section */}
      <div className=" mx-auto">
        {/* Menu Page Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">HMC - Menu page</h1>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="bg-white border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-0 min-w-full">
            {days.map((day, index) => (
              <button
                key={day}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap min-w-[120px] ${
                  activeTab === index
                    ? "text-blue-600 border-blue-500 bg-blue-50"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab(index)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white min-h-[600px]">
          {/* Current Day Header */}
          <div className="text-center py-6 border-b border-gray-100">
            <h2 className="text-3xl font-bold text-blue-600">
              {days[activeTab]} Menu
            </h2>
          </div>

          {/* Conditional Content Rendering */}
          {showCreateMenu ? (
            <div className="p-6">
              <CreateMenuFallback
                onSuccessfulCreation={handleSuccessfulMenuCreation}
              />
            </div>
          ) : (
            <div>
              {/* Loading State */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600 text-lg">
                    Loading menu...
                  </span>
                </div>
              ) : (
                <Menu_content
                  key={activeTab}
                  day={days[activeTab]}
                  breakfast={currentMenu.breakfast}
                  lunch={currentMenu.lunch}
                  dinner={currentMenu.dinner}
                  messId={user.messId._id}
                  onSuccessfulItemCreation={handleSuccessfulMenuItemCreation}
                  click={handleGoToCreateMenu}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
