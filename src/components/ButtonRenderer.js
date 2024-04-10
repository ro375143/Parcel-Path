import React from 'react';
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './grids.css';
const ButtonRenderer = ({ params, onEdit, onDelete }) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        className='action-button'
        type="primary"
        icon={<EditOutlined />}
        onClick={() => onEdit(params.data.id)}
      >
        Edit
      </Button>
      <Button
      className='action-button'
        danger
        icon={<DeleteOutlined />}
        onClick={() => onDelete(params.data.id)}
      >
        Delete
      </Button>
    </div>
  );
};

export default ButtonRenderer;
