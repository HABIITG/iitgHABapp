import { useAuth } from "../context/AuthProvider";
import React, { useState, useEffect, useCallback } from "react";
import Menu_content from "../components/Menu_content.jsx";
import axios from "axios";
import { API_BASE_URL } from "../apis"; // Assuming you have a common API base URL defined
import CreateMenuFallback from "../components/CreateMenuFallback.jsx";
import { Menu, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import RequestsContent from "../components/RequestsContent.jsx";

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
  const [currentPage, setCurrentPage] = useState('menu'); // 'menu' or 'requests'
  const { user, logout } = useAuth();
  console.log("here", user);

  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [timings, setTimings] = useState({
    btime_s: '',
    ltime_s: '',
    dtime_s: '',
    btime_e: '',
    ltime_e: '',
    dtime_e: '',
  });

  const isActive = (stime, etime) => {
    const now = new Date();

    const [shours, sminutes] = stime.split(":").map(Number);
    const [ehours, eminutes] = etime.split(":").map(Number);
    const s_time = new Date(now);
    s_time.setHours(shours, sminutes, 0, 0);
    const e_time = new Date(now);
    e_time.setHours(ehours, eminutes, 0, 0);

    console.log(s_time);

    if (now >= s_time && now < e_time) return true;
    else return false;

  }

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

        const timeData = {
          btime_s: '',
          ltime_s: '',
          dtime_s: '',
          btime_e: '',
          ltime_e: '',
          dtime_e: '',
        };

        response.data.forEach((element) => {
          if (element.type === "Breakfast") {
            timeData.btime_s = element.startTime;
            timeData.btime_e = element.endTime;
            element.items.forEach((item) => {
              menuData.breakfast.push({
                id: item._id,
                name: item.name,
                category: item.type,
              });
            });
          } else if (element.type === "Lunch") {
            timeData.ltime_s = element.startTime;
            timeData.ltime_e = element.endTime;
            element.items.forEach((item) => {
              menuData.lunch.push({
                id: item._id,
                name: item.name,
                category: item.type,
              });
            });
          } else if (element.type === "Dinner") {
            timeData.dtime_s = element.startTime;
            timeData.dtime_e = element.endTime;
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
        console.log("timeData", timeData);
        setTimings(timeData);
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


      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setCurrentPage('menu')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${currentPage === 'menu'
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <Menu className="w-4 h-4" />
            Menu Management
          </button>
          <button
            onClick={() => setCurrentPage('requests')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${currentPage === 'requests'
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <Users className="w-4 h-4" />
            Change Requests
            {/* <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {mockRequests.filter(r => r.status === 'pending').length}
            </span> */}
          </button>
        </div>
      </div>


      {currentPage === 'menu' ? (
        // Menu Section
        <div className=" mx-auto">
          {/* Menu Page Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">HMC - Menu page</h1>
              {/* <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {(isActive(timeData.btime_s, timeData.btime_e) || isActive(timeData.ltime_s, timeData.ltime_e) || isActive(timeData.dtime_s, timeData.dtime_e))? 'Active':'Inactive' }
            </span> */}

              {timings.btime_s && timings.btime_e && timings.ltime_s && timings.ltime_e && timings.dtime_s && timings.dtime_e && (
                <>
                    {isActive(timings.btime_s, timings.btime_e) && 
                    (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Breakfast
                      </span>
                    )}
                    {isActive(timings.ltime_s, timings.ltime_e) && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Lunch
                      </span>
                    )}
                    {isActive(timings.dtime_s, timings.dtime_e) && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Dinner
                      </span>
                    )}
                
                
                    {!isActive(timings.btime_s, timings.btime_e) && !isActive(timings.ltime_s, timings.ltime_e)&& !isActive(timings.dtime_s, timings.dtime_e)&&(
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Closed</span>
                    )
                  }
                    
                
                </>
              )}
            </div>
          </div>

          {/* Day Tabs */}
          <div className="bg-white border-b border-gray-200 overflow-x-auto">
            <div className="flex justify-between min-w-full items-center">
              <div>
                {days.map((day, index) => (
                  <button
                    key={day}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap min-w-[120px] ${activeTab === index
                        ? "text-blue-600 border-blue-600 bg-blue-50"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                      }`}
                    onClick={() => setActiveTab(index)}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <button className="mr-5 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium h-8">Download</button>
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
                    timeData={timings}
                    onSuccessfulItemCreation={handleSuccessfulMenuItemCreation}
                    click={handleGoToCreateMenu}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Requests Page Header */}
          <div className="bg-green-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">HMC - Requests Management</h1>
              {/* <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {mockRequests.filter(r => r.status === 'pending').length} Pending
                </span> */}
            </div>
          </div>

          {/* Requests Content */}
          <div className="bg-white min-h-[600px]">
            <RequestsContent hostelId={user._id} />
          </div>
        </>
      )}


    </div>
  );
};

export default Dashboard;
