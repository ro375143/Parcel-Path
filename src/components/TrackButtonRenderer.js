import React from "react";
import { Button } from "antd";

const TrackButtonRenderer = ({ userRole }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      {userRole === "customer" && (
        <Button
          className="action-button"
          type="primary"
          style={{ bottom: "2px" }}
        >
          Track Package
        </Button>
      )}
    </div>
  );
};

export default TrackButtonRenderer;
