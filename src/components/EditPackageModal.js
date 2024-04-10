import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import './grids.css';

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
      className='modal-theme'
      title="Edit Package"
      open={isOpen}
      onOk={handleSave}
      onCancel={onClose}
      okText="Save"
      cancelText="Cancel"
    >
      <Form
        className='package-form'
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
          <Input
          className='package-input'
           />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input
          className='package-input'
           />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select
          className='package-form'
            placeholder="Select a status"
          >
            <Select.Option className='package-form' value="Pending">Pending</Select.Option>
            <Select.Option className='package-form' value="In Transit">In Transit</Select.Option>
            <Select.Option className='package-form' value="Delivered">Delivered</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
        name="customerId"
        label="Customer ID"
        rules={[{ required: true, message: 'Please input the customer ID!' }]}
        >
        <Input 
        className='package-input'
         />
        </Form.Item>
        <Form.Item
        name="trackingNumber"
        label="Tracking Number"
        rules={[{ required: false }]}
        >
        <Input 
        className='package-input'
        disabled />
        </Form.Item>
        <Form.Item
        name="packageWeight"
        label="Package Weight"
        rules={[{ required: true, message: 'Please input the package weight!' }]}
        >
        <InputNumber
        className='package-input'
         min={0} step={0.01} style={{ width: '100%' }} suffix="lbs" />
        </Form.Item>
        <Form.Item
        name="packageDimensions"
        label="Package Dimensions"
        rules={[{ required: true, message: 'Please input the package dimensions!' }]}
        >
        <Input 
        className='package-input'
        placeholder="L x W x H" />
        </Form.Item>
        <Form.Item
        name="shipDate"
        label="Ship Date"
        rules={[{ required: false }]}
        >
        <DatePicker
        className='package-input'
         disabled format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
        name="deliveryDate"
        label="Delivery Date"
        rules={[{ required: false }]}
        >
        <DatePicker
        className='package-input'
         format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPackageModal;
