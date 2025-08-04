import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

function Menu_content(props) {
  const { user } = useAuth();
  const [menuData, setMenuData] = useState({
    breakfast: props.breakfast || [],
    lunch: props.lunch || [],
    dinner: props.dinner || [],
  });
  const messId = user.messId;
  console.log(menuData);

  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);

  // Update menuData when props change
  useEffect(() => {
    setMenuData({
      breakfast: props.breakfast || [],
      lunch: props.lunch || [],
      dinner: props.dinner || [],
    });
  }, [props.breakfast, props.lunch, props.dinner]);

  // Define all possible categories for each meal
  const allCategories = {
    Breakfast: ["Dish", "Breads and Rice", "Others"],
    Lunch: ["Dish", "Breads and Rice", "Others"],
    Dinner: ["Dish", "Breads and Rice", "Others"],
  };

  // Function to create new item via API
  const createMenuItem = async (itemData) => {
    try {
      console.log(props.menuId);
      console.log("Creating item with data:", itemData);
      const response = await axios.post(
        `https://hab.codingclub.in/api/mess/menu/item/create`,
        {
          menuId: props.menuId, // Use the menuId from props
          name: itemData.name,
          type: itemData.category,
          meal: itemData.section,
          day: props.day,
          messId: messId,
        },
        {
          withCredentials: true,
        }

      );

      console.log("Item created successfully:", response.data);
      if (props.onSuccessfulItemCreation) {
        props.onSuccessfulItemCreation();
      }
      return response.data;
    } catch (error) {
      console.error("Error creating menu item:", error);
      throw error;
    }
  };

  // Function to update existing item via API
  const updateMenuItem = async (messId, itemData) => {
    try {
      const response = await axios.post(
        `https://hab.codingclub.in/api/mess/menu/modify/${messId}`,
        {
          _Id: itemData.id,
          name: itemData.name,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Item updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  };

  // Function to delete item via API
  const deleteMenuItem = async (itemData) => {
    try {
      console.log("id ", itemData.id);
      const response = await axios.delete(
        "https://hab.codingclub.in/api/mess/menu/item/delete",
        {
          data: {
            _Id: itemData.id,
          },
          withCredentials: true,
        }
      );

      console.log("Item deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  };

  // Function to add new item to a category
  const handleAddItem = (section, category) => {
    const newItem = {
      id: Date.now(),
      name: "New Item",
      category: category,
      section: section,
      isNew: true,
    };

    setMenuData((prev) => ({
      ...prev,
      [section.toLowerCase()]: [...prev[section.toLowerCase()], newItem],
    }));

    setEditingItem(newItem.id);
    setEditValue("New Item");
  };

  // Function to handle edit
  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditValue(item.name);
    setShowDropdown(null);
  };

  // Function to save edited item
  const handleSaveEdit = async (section) => {
    const item = menuData[section.toLowerCase()].find(
      (item) => item.id === editingItem
    );

    if (!item) return;

    try {
      if (item.isNew) {
        const itemData = {
          id: Date.now(),
          name: editValue,
          category: item.category,
          section: section,
        };

        const createdItem = await createMenuItem(itemData);

        setMenuData((prev) => ({
          ...prev,
          [section.toLowerCase()]: prev[section.toLowerCase()].map((prevItem) =>
            prevItem.id === editingItem
              ? {
                  ...createdItem,
                  id: createdItem._id || createdItem.id,
                  name: editValue,
                  isNew: false,
                }
              : prevItem
          ),
        }));
      } else {
        const itemData = {
          id: item.id,
          name: editValue,
          category: item.category,
        };

        await updateMenuItem(messId, itemData);

        setMenuData((prev) => ({
          ...prev,
          [section.toLowerCase()]: prev[section.toLowerCase()].map((prevItem) =>
            prevItem.id === editingItem
              ? { ...prevItem, name: editValue }
              : prevItem
          ),
        }));
      }

      setEditingItem(null);
      setEditValue("");
    } catch (error) {
      alert("Error saving item. Please try again.");
      console.error("Save error:", error);
    }
  };

  // Function to cancel edit
  const handleCancelEdit = (section) => {
    const itemToCancel = menuData[section.toLowerCase()].find(
      (item) => item.id === editingItem
    );
    if (itemToCancel && itemToCancel.isNew) {
      handleDelete(editingItem, section, true);
    }
    setEditingItem(null);
    setEditValue("");
  };

  // Function to delete item
  const handleDelete = async (itemId, section, skipApiCall = false) => {
    const item = menuData[section.toLowerCase()].find(
      (item) => item.id === itemId
    );

    if (!item) return;

    try {
      if (!item.isNew && !skipApiCall) {
        const itemData = {
          id: item.id,
          name: editValue,
          category: item.category,
        };
        await deleteMenuItem(itemData);
      }

      setMenuData((prev) => ({
        ...prev,
        [section.toLowerCase()]: prev[section.toLowerCase()].filter(
          (item) => item.id !== itemId
        ),
      }));

      setShowDropdown(null);
    } catch (error) {
      alert("Error deleting item. Please try again.");
      console.error("Delete error:", error);
    }
  };

  // Function to toggle dropdown
  const handleMoreClick = (itemId) => {
    setShowDropdown(showDropdown === itemId ? null : itemId);
  };

  // Group items by category, ensuring all categories are present
  const groupItemsByCategory = (items, sectionTitle) => {
    const grouped = {};

    allCategories[sectionTitle].forEach((category) => {
      grouped[category] = [];
    });

    items.forEach((item) => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      }
    });

    return grouped;
  };

  const getSectionColors = (title) => {
    switch (title) {
      case "Breakfast":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          title: "text-orange-800",
          accent: "text-orange-600",
        };
      case "Lunch":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          title: "text-yellow-800",
          accent: "text-yellow-600",
        };
      case "Dinner":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          title: "text-purple-800",
          accent: "text-purple-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          title: "text-gray-800",
          accent: "text-gray-600",
        };
    }
  };

  const renderMenuSection = (title, items) => {
    const groupedItems = groupItemsByCategory(items, title);
    const colors = getSectionColors(title);

    return (
      <div className="mb-8">
        <div className={`${colors.bg} ${colors.border} border rounded-lg p-6`}>
          <h3
            className={`${colors.title} text-2xl font-bold mb-6 text-center border-b ${colors.border} pb-2`}
          >
            {title}
          </h3>

          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div
                key={category}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className={`${colors.accent} text-lg font-semibold`}>
                    {category}
                  </span>
                  <button
                    className="flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition-colors duration-200"
                    onClick={() => handleAddItem(title, category)}
                    title="Add new item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-200 transition-colors duration-200"
                    >
                      {editingItem === item.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEdit(title);
                              } else if (e.key === "Escape") {
                                handleCancelEdit(title);
                              }
                            }}
                            autoFocus
                          />
                          <div className="flex space-x-1">
                            <button
                              className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                              onClick={() => handleSaveEdit(title)}
                              title="Save"
                            >
                              ✓
                            </button>
                            <button
                              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                              onClick={() => handleCancelEdit(title)}
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-medium flex-1">
                            {item.name}
                          </span>
                          <div className="relative">
                            <button
                              onClick={() => handleMoreClick(item.id)}
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                              title="More options"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                              </svg>
                            </button>
                            {showDropdown === item.id && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden min-w-[100px]">
                                <button
                                  className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                                  onClick={() => handleEdit(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                                  onClick={() => handleDelete(item.id, title)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {categoryItems.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No items in this category yet
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {renderMenuSection("Breakfast", menuData.breakfast)}
        </div>
        <div className="lg:col-span-1">
          {renderMenuSection("Lunch", menuData.lunch)}
        </div>
        <div className="lg:col-span-1">
          {renderMenuSection("Dinner", menuData.dinner)}
        </div>
      </div>
    </div>
  );
}

export default Menu_content;
