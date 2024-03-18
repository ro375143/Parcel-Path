import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';

const EditPackageModal = ({ isOpen, onClose, packageData, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (packageData) {
      // set form values when packageData changes
      form.setFieldsValue({
        name: packageData.name,
        description: packageData.description,
        status: packageData.status,
        customerId: packageData.customerId,
        trackingNumber: packageData.trackingNumber,
        packageWeight: packageData.packageWeight ? packageData.packageWeight : 0,
        packageDimensions: packageData.packageDimensions ? packageData.packageDimensions : '',
        shipDate: packageData.shipDate ? moment(packageData.shipDate.toDate()) : null,
        deliveryDate: packageData.deliveryDate ? moment(packageData.deliveryDate.toDate()) : null,
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
        <Form.Item
        name="customerId"
        label="Customer ID"
        rules={[{ required: true, message: 'Please input the customer ID!' }]}
        >
        <Input />
        </Form.Item>
        <Form.Item
        name="trackingNumber"
        label="Tracking Number"
        rules={[{ required: false }]}
        >
        <Input disabled />
        </Form.Item>
        <Form.Item
        name="packageWeight"
        label="Package Weight"
        rules={[{ required: true, message: 'Please input the package weight!' }]}
        >
        <InputNumber min={0} step={0.01} style={{ width: '100%' }} suffix="lbs" />
        </Form.Item>
        <Form.Item
        name="packageDimensions"
        label="Package Dimensions"
        rules={[{ required: true, message: 'Please input the package dimensions!' }]}
        >
        <Input placeholder="L x W x H" />
        </Form.Item>
        <Form.Item
        name="shipDate"
        label="Ship Date"
        rules={[{ required: false }]}
        >
        <DatePicker disabled format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
        name="deliveryDate"
        label="Delivery Date"
        rules={[{ required: false }]}
        >
        <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPackageModal;
