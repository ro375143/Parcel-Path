"use client";
import React from "react";

import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Checkbox,
} from "antd";
import { db, auth } from "@/app/firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  getDoc,
  getDocs,
  GeoPoint,
  where,
  query,
} from "firebase/firestore";

const CreatePackageModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const axios = require("axios");
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

  async function addressToCoordinates(address) {
    console.log(address);
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    console.log(apiUrl);
    console.log(apiKey);
    try {
      const response = await axios.get(apiUrl);
      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        throw new Error("No results found for the address.");
      }
    } catch (error) {
      throw new Error("Error geocoding address: " + error.message);
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let assignedDriverId = null;
      let driverAssigned = false;

      // Check if the auto-assign driver option is checked
      if (values.autoAssignDriver) {
        // Fetch all drivers
        const driverQuery = query(
          collection(db, "users"),
          where("role", "==", "driver")
        );
        const driversSnapshot = await getDocs(driverQuery);
        const drivers = driversSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (drivers.length > 0) {
          const randomIndex = Math.floor(Math.random() * drivers.length);
          assignedDriverId = drivers[randomIndex].id;
          driverAssigned = true;
        } else {
          throw new Error("No drivers available for assignment.");
        }
      }

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const { street, city, state } = userDoc.data().address;
      const address = `${street}, ${city}, ${state}, USA`;
      const coordinates = await addressToCoordinates(address);
      const geopoint = new GeoPoint(
        coordinates.latitude,
        coordinates.longitude
      );
      const deliveryDate = values.deliveryDate
        ? Timestamp.fromDate(values.deliveryDate.toDate())
        : null;
      const packageWeightNumber = parseFloat(values.packageWeight);
      const trackingNumber = `PKG-${Date.now()}-${generateRandomString()}`;

      // Assemble the package data
      const packageData = {
        ...values,
        packageWeight: packageWeightNumber,
        deliveryDate,
        shipDate: serverTimestamp(),
        trackingNumber,
        driverAssigned,
        assignedDriverId,
        adminId: auth.currentUser.uid,
        location: [
          { status: values.status, geopoint, timeStamp: new Date().toString() },
        ],
      };

      // Add the package to the database
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
          name="recipent-name"
          label="Recipient's Name"
          rules={[
            { required: true, message: "Please input the recipient's name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="recipient-address"
          label="Recipient's Address"
          rules={[
            { required: true, message: "Please input the recipicent address!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="recipientPhoneNumber"
          label="Recipient's Phone Number"
          rules={[
            { required: true, message: "Please input the phone number!" },
          ]}
        >
          <Input />
        </Form.Item>
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
            <Select.Option value="Delayed">Delayed</Select.Option>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="In Transit">In Transit</Select.Option>
            <Select.Option value="Delivered">Delivered</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="autoAssignDriver"
          valuePropName="checked" // Ensures the form field is controlled by the checkbox's checked state
        >
          <Checkbox>Auto-assign driver</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePackageModal;
