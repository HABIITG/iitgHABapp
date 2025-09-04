import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Typography, Input, Space } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

export default function AllHostelList() {
  const navigate = useNavigate();
  const server = import.meta.env.VITE_SERVER_URL;

  const [hostelList, setHostelList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(server + "/api/hostel/gethnc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();

        // Transform data for Ant Design Table
        const transformedData = data.map((item, index) => ({
          key: item._id || index,
          _id: item._id,
          hostel_name: item.hostel_name,
          caterer_name: item.messId?.name || "No caterer assigned",
          user_count: item.user_count || 0,
        }));

        setHostelList(transformedData);
        setFilteredData(transformedData);
      } catch (err) {
        console.error("Failed to fetch hostel data:", err);
        setHostelList([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [server]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(hostelList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = hostelList.filter(
        (item) =>
          item.hostel_name.toLowerCase().includes(query) ||
          item.caterer_name.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
  }, [hostelList, searchQuery]);

  const columns = [
    {
      title: "Hostel Name",
      dataIndex: "hostel_name",
      key: "hostel_name",
      sorter: (a, b) => a.hostel_name.localeCompare(b.hostel_name),
      render: (text) => <span style={{ fontWeight: "medium" }}>{text}</span>,
    },
    {
      title: "Caterer Name",
      dataIndex: "caterer_name",
      key: "caterer_name",
      sorter: (a, b) => a.caterer_name.localeCompare(b.caterer_name),
      render: (text) => (
        <span
          style={{ color: text === "No caterer assigned" ? "#8c8c8c" : "#000" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Number of Users",
      dataIndex: "user_count",
      key: "user_count",
      sorter: (a, b) => a.user_count - b.user_count,
      render: (count) => (
        <span
          style={{
            fontWeight: "medium",
            color: count > 0 ? "#52c41a" : "#8c8c8c",
            backgroundColor: count > 0 ? "#f6ffed" : "#f5f5f5",
            padding: "4px 8px",
            borderRadius: "4px",
            border: count > 0 ? "1px solid #b7eb8f" : "1px solid #d9d9d9",
          }}
        >
          {count} {count === 1 ? "user" : "users"}
        </span>
      ),
    },
  ];
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleRowClick = (record) => {
    navigate(`/hostel/${record._id}`);
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Hostel Management
          </Title>

          <Space>
            <Search
              placeholder="Search hostels or caterers..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{ width: 300 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate("/create-hostel")}
            >
              Add Hostel
            </Button>
          </Space>
        </div>

        {/* Table */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "16px",
          }}
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            pagination={false}
            size="middle"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            })}
            locale={{
              emptyText: searchQuery
                ? "No hostels found matching your search."
                : "No hostels found.",
            }}
          />
        </div>
      </div>
    </div>
  );
}
