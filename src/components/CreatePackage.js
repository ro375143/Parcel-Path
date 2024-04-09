"use client";
import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import { db } from "@/app/firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const CreatePackageModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();

  const generateRandomString = (length = 6) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const packageWeightNumber = parseFloat(values.packageWeight);
      const randomChars = generateRandomString(); // Generates a random 6-character string
      const trackingNumber = `PKG-${Date.now()}-${randomChars}`;

      const deliveryDate = values.deliveryDate
        ? Timestamp.fromDate(values.deliveryDate.toDate()) // Convert moment object to Date then to Firestore Timestamp
        : null;

      const packageData = {
        ...values,
        packageWeight: packageWeightNumber,
        deliveryDate,
        shipDate: serverTimestamp(),
        trackingNumber,
      };

      await addDoc(collection(db, "packages"), packageData);
      message.success("Package created successfully!");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error creating package:", error);
      message.error("Failed to create package.");
    }
  };

  return (
    <Modal
      title="Create New Package"
      open={isOpen}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText="Create"
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: "Pending", // Default status
        }}
      >
        <Form.Item
          name="name"
          label="Package Name"
          rules={[
            { required: true, message: "Please input the package name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="packageDimensions"
          label="Package Dimensions"
          rules={[
            { required: true, message: "Please input the package dimensions!" },
          ]}
        >
          <Input placeholder="L x W x H" />
        </Form.Item>
        <Form.Item
          name="packageWeight"
          label="Package Weight"
          rules={[
            { required: true, message: "Please input the package weight!" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="deliveryDate"
          label="Delivery Date"
          rules={[
            { required: true, message: "Please select a delivery date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select a status!" }]}
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

export default CreatePackageModal;
