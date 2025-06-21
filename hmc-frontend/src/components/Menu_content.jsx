import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import '../index.css';
import CreateMenu from "./CreateMenuFallback";
function Menu_content(props) {
  const { user} = useAuth();
  const [menuData, setMenuData] = useState({
    breakfast: props.breakfast || [],
    lunch: props.lunch || [],
    dinner: props.dinner || [],
  });
  const messId = user.messId; 
  console.log(menuData);
  const empty={
    breakfast:[],lunch:[],dinner:[]
  };
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
      const response = await axios.post(`http://localhost:8000/api/mess/menu/item/create`, {
        menuId: itemData.id,
        name: itemData.name,
        type: itemData.category,
        meal:itemData.section,
        day:props.day,
        messId:messId // Breakfast, Lunch, or Dinner
      }, {
        withCredentials: true,
      });
      
      console.log("Item created successfully:", response.data);
      if(props.onSuccessfulItemCreation){
        props.onSuccessfulItemCreation();
      }
      return response.data; // Return the created item with server-generated ID
    } catch (error) {
      console.error("Error creating menu item:", error);
      throw error;
    }
  };

  // Function to update existing item via API
  const updateMenuItem = async (messId, itemData) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/mess/menu/modify/${messId}`, {
        _Id: itemData.id,
        name: itemData.name,
      }, {
        withCredentials: true,
      });
      
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
      console.log("id ",itemData.id);
      const response=await axios.delete('http://localhost:8000/api/mess/menu/item/delete', {
        data: {
          _Id: itemData.id
        },
        withCredentials: true,
      });

    
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
      id: Date.now(), // Temporary ID until server responds
      name: "New Item",
      category: category,
      section: section,
      isNew: true,
    };

    setMenuData((prev) => ({
      ...prev,
      [section.toLowerCase()]: [...prev[section.toLowerCase()], newItem],
    }));

    // Start editing the new item immediately
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
        // Create new item
        const itemData = {
          id:Date.now(),
          name: editValue,
          category: item.category,
          section: section,
        };
        
        const createdItem = await createMenuItem(itemData);
        
        // Update local state with the server response (which should include the real ID)
        setMenuData((prev) => ({
          ...prev,
          [section.toLowerCase()]: prev[section.toLowerCase()].map((prevItem) =>
            prevItem.id === editingItem
              ? { 
                  ...createdItem, 
                  id: createdItem._id || createdItem.id, // Use server ID
                  name: editValue,
                  isNew: false 
                }
              : prevItem
          ),
        }));
      } else {
        // Update existing item
        
        const itemData = {
          id: item.id,
          name: editValue,
          category: item.category,
        };
        
        await updateMenuItem(messId, itemData);
        
        // Update local state
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
      // Handle error - maybe show a toast notification
      alert("Error saving item. Please try again.");
      console.error("Save error:", error);
    }
  };

  // Function to cancel edit
  const handleCancelEdit = (section) => {
    // If it was a new item, remove it
    const itemToCancel = menuData[section.toLowerCase()].find(
      (item) => item.id === editingItem
    );
    if (itemToCancel && itemToCancel.isNew) {
      handleDelete(editingItem, section, true); // Pass true to skip API call
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
      // Only call API if it's not a new item and we're not skipping the API call
      if (!item.isNew && !skipApiCall) {
        const itemData = {
          id: item.id,
          name: editValue,
          category: item.category,
        };
        await deleteMenuItem(itemData);
      }

      // Update local state
      setMenuData((prev) => ({
        ...prev,
        [section.toLowerCase()]: prev[section.toLowerCase()].filter(
          (item) => item.id !== itemId
        ),
      }));

      setShowDropdown(null);
    } catch (error) {
      // Handle error - maybe show a toast notification
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

    // Initialize all categories for this section
    allCategories[sectionTitle].forEach((category) => {
      grouped[category] = [];
    });

    // Add items to their respective categories
    items.forEach((item) => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      }
    });

    return grouped;
  };

  const renderMenuSection = (title, items) => {
    const groupedItems = groupItemsByCategory(items, title);

    return (
      
      <div className="menu-section" id={title}>
        <h2>{props.day} Menu</h2>
        <h3 className="section-title">{title}</h3>
        <div className="menu-items">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="menu-category">
              <span className="item-category">
                {category + "  "}
                <button
                  className="add-button"
                  onClick={() => handleAddItem(title, category)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="darkgreen"
                    className="bi bi-plus-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                  </svg>
                </button>
              </span>

              {categoryItems.map((item) => (
                <div key={item.id} className="menu-item">
                  {editingItem === item.id ? (
                    <div className="edit-input-container">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="edit-input"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(title);
                          } else if (e.key === "Escape") {
                            handleCancelEdit(title);
                          }
                        }}
                        autoFocus
                      />
                      <div className="edit-buttons">
                        <button
                          className="save-btn"
                          onClick={() => handleSaveEdit(title)}
                        >
                          ✓
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelEdit(title)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="item-name">{item.name}</span>
                      <div className="more-container">
                        <span
                          onClick={() => handleMoreClick(item.id)}
                          className="more"
                        >
                          ⋯
                        </span>
                        {showDropdown === item.id && (
                          <div className="dropdown-menu">
                            <button
                              className="dropdown-item edit-option"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="dropdown-item delete-option"
                              onClick={() => handleDelete(item.id, title)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="menu-content">
      {renderMenuSection("Breakfast", menuData.breakfast)}
      {renderMenuSection("Lunch", menuData.lunch)}
      {renderMenuSection("Dinner", menuData.dinner)}
    </div>
  );
}

export default Menu_content;