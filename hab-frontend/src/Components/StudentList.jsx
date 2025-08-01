import React, { useState, useEffect, useMemo } from "react";
import { getStudents } from "../apis/students.js";
import { Table, Input, Spin, Alert, Button } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  NumberOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const StudentList = ({ refreshTrigger }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 25;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch students");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refreshTrigger]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    console.log(students);
    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(query) ||
        student.rollNumber?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  const columns = [
    {
      title: <span>Name</span>,
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (text) => text || "N/A",
    },
    {
      title: <span>Roll Number</span>,
      dataIndex: "rollNumber",
      key: "rollNumber",
      sorter: (a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || ""),
      render: (text) => text || "N/A",
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
      render: (text) => text || "N/A",
    },
    {
      title: <span>Hostel</span>,
      dataIndex: "curr_subscribed_mess_name",
      key: "curr_subscribed_mess_name",
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
      render: (text) => text || "N/A",
    },
  ];

  if (error) {
    return (
      <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          action={
            <Button size="small" danger onClick={fetchStudents}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
          <UserOutlined style={{ marginRight: "8px" }} />
          Students ({filteredStudents.length})
        </h2>

        <Search
          placeholder="Search by name, roll number, or email..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 400 }}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredStudents}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: filteredStudents.length,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} students`,
          onChange: (page) => setCurrentPage(page),
        }}
        onChange={handleTableChange}
        rowKey={(record) => record._id || record.email}
        size="middle"
        scroll={{ x: true }}
        locale={{
          emptyText: searchQuery
            ? "No students found matching your search."
            : "No students found.",
        }}
      />
    </div>
  );
};

export default StudentList;
