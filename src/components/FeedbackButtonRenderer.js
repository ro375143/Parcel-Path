import React from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

const FeedbackButtonRenderer = ({ data, onFeedback }) => {
  const handleButtonClick = () => {
    onFeedback(data);
  };
  return (
    <>
      {!data.isFeedback ? ( // Check if isFeedback is false
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleButtonClick}
          style={{ bottom: "2px" }}
        >
          Give Feedback
        </Button>
      ) : (
        <Button disabled style={{ bottom: "2px" }}>
          Feedback Given
        </Button> // Disable the button if isFeedback is true
      )}
    </>
  );
};

export default FeedbackButtonRenderer;
