import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const EditPackageModal = ({ isOpen, onClose, packageData, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (packageData) {
      // set form values when packageData changes
      form.setFieldsValue({
        name: packageData.name,
        description: packageData.description,
        status: packageData.status,
      });
    }
  }, [packageData, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(packageData.id, values);
        onClose();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Edit Package"
      open={isOpen}
      onOk={handleSave}
      onCancel={onClose}
      okText="Save"
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: '',
          description: '',
          status: '',
        }}
      >
        <Form.Item
          name="name"
          label="Package Name"
          rules={[{ required: true, message: 'Please input the package name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="In Transit">In Transit</Select.Option>
            <Select.Option value="Delivered">Delivered</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPackageModal;
