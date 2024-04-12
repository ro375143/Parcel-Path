import React from 'react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const FeedbackButtonRenderer = ({ data, onFeedback }) => {
  return (
    <Button
      type="primary"
      icon={<EditOutlined />}
      onClick={() => onFeedback(data)}
    >
      Feedback
    </Button>
  );
};

export default FeedbackButtonRenderer;
