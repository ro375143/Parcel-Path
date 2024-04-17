import React from "react";
import { Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ButtonRenderer = ({
  params,
  onEdit,
  onDelete,
  userRole,
  viewLocation,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => onEdit(params.data.id)}
        style={{
          backgroundColor: "#154734",
          borderColor: "#154734",
          top: "2px",
        }}
      >
        Edit
      </Button>
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={() => onDelete(params.data.id)}
        style={{ top: "2px" }}
      >
        Delete
      </Button>
      {(userRole === "customer" || userRole === "admin") && (
        <Button
          onClick={() => viewLocation(params.data)}
          className="action-button"
          type="primary"
          style={{ bottom: "3px", width: "60px" }}
        >
          Track
        </Button>
      )}
    </div>
  );
};

export default ButtonRenderer;
