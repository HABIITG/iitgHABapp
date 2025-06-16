// Students.jsx (Main Component)
import React, { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateUsers from "../components/CreateUsers";
import StudentList from "../components/StudentList";

const Students = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleUsersCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            background: "#fff",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            Student Management
          </h1>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={showModal}
            style={{
              borderRadius: "6px",
              height: "40px",
              fontWeight: "500",
            }}
          >
            Add Students
          </Button>
        </div>

        <StudentList refreshTrigger={refreshTrigger} />

        <Modal
          title={
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              <PlusOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
              Upload Student CSV
            </div>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
          centered
          destroyOnClose={true}
        >
          <CreateUsers onUsersCreated={handleUsersCreated} />
        </Modal>
      </div>
    </div>
  );
};

export default Students;
