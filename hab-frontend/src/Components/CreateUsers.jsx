// CreateUsers.jsx
import React, { useState } from "react";
import Papa from "papaparse";
import { createUser } from "../apis/students.js";
import {
  Upload,
  Button,
  Progress,
  message,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const CreateUsers = ({ onUsersCreated }) => {
  const [csvData, setCsvData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setCsvData(results.data);
        message.success(`${results.data.length} records loaded from CSV`);
      },
      error: function (error) {
        message.error("Failed to parse CSV file");
        console.error("CSV parsing error:", error);
      },
    });

    return false;
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/Template - Sheet1.csv";
    link.download = "Template - Sheet1.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Template CSV downloaded successfully!");
  };

  const handleSubmit = async () => {
    if (csvData.length === 0) {
      message.warning("Please upload a valid CSV first.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    let createdCount = 0;
    const hostelId = "68552a3a491f1303d2c4dbc9"; //To be modified...

    const totalRecords = csvData.length;

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      try {
        const payload = {
          name: row["Name"],
          rollNumber: row["Roll Number"],
          email: row["IITG Email"],
          hostel: hostelId,
        };
        await createUser(payload);
        createdCount++;
      } catch (err) {
        console.error(`Failed to create user: ${row["Name"]}`, err);
      }

      setUploadProgress(Math.round(((i + 1) / totalRecords) * 100));
    }

    setUploading(false);
    setUploadProgress(0);

    if (createdCount === totalRecords) {
      message.success(`All ${createdCount} users created successfully!`);
    } else {
      message.warning(
        `${createdCount} out of ${totalRecords} users created successfully`
      );
    }

    setCsvData([]);

    if (onUsersCreated) {
      onUsersCreated();
    }
  };

  const uploadProps = {
    beforeUpload: handleFileUpload,
    accept: ".csv",
    multiple: false,
    showUploadList: false,
  };

  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ marginBottom: "24px" }}>
        <Paragraph style={{ margin: 0, color: "#666" }}>
          Upload a CSV file with student data.
        </Paragraph>
      </div>

      <Row gutter={12} className="justify-center">
        <Col span={11}>
          <Button
            icon={<DownloadOutlined />}
            size="large"
            block
            onClick={handleDownloadTemplate}
            style={{
              height: "50px",
              borderStyle: "dashed",
              borderWidth: "2px",
              borderColor: "#52c41a",
              color: "#52c41a",
            }}
          >
            <div>
              <div>Download Template</div>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                CSV template file
              </Text>
            </div>
          </Button>
        </Col>
        <Col span={12}>
          <Upload {...uploadProps}>
            <Button
              icon={<UploadOutlined />}
              size="large"
              block
              style={{
                height: "50px",
                borderStyle: "dashed",
                borderWidth: "2px",
                borderColor: "#108ee9",
                color: "#108ee9",
              }}
            >
              <div>
                <div>Click to select CSV file</div>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Supports .csv files only
                </Text>
              </div>
            </Button>
          </Upload>
        </Col>
      </Row>

      {csvData.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CheckCircleOutlined
            style={{ color: "#52c41a", marginRight: "8px" }}
          />
          <Text style={{ color: "#389e0d" }}>
            <strong>{csvData.length}</strong> records loaded and ready to upload
          </Text>
        </div>
      )}

      {uploading && (
        <div style={{ marginTop: "16px" }}>
          <Text style={{ display: "block", marginBottom: "8px" }}>
            Creating users... ({uploadProgress}%)
          </Text>
          <Progress
            percent={uploadProgress}
            status="active"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
        </div>
      )}

      <Divider />

      <Button
        type="primary"
        size="large"
        block
        onClick={handleSubmit}
        loading={uploading}
        disabled={csvData.length === 0}
        style={{
          height: "45px",
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        {uploading
          ? `Creating Users... (${uploadProgress}%)`
          : `Create ${csvData.length} Users`}
      </Button>
    </div>
  );
};

export default CreateUsers;
