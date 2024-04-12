import React from "react";
import FeedbackGrid from "@/components/FeedbackGrid";

const FeedbackQueue = () => {
  return (
    <div style={{ padding: "10px", margin: "5px" }}>
      <h1 style={{ margin: "0", padding: "1rem", fontSize: "1rem" }}>
        FEEDBACK QUEUE
      </h1>
      <FeedbackGrid />
    </div>
  );
};

export default FeedbackQueue;
