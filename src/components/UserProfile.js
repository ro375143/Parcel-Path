"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { db } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "@/app/firebase/config";

const UserProfile = () => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  // Watch for authentication state changes and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch user data from Firestore
  const fetchUserData = async (userId) => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      form.setFieldsValue({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        username: data.username,
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
      });
    } else {
      message.error("User data not found.");
    }
  };

  // Handle form submission for updates
  const handleUpdate = async (values) => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const updatedValues = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      username: values.username,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
      },
    };
    try {
      await updateDoc(userRef, updatedValues);
      message.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      message.error("Failed to update profile.");
      console.error("Update error:", error);
    }
  };

  return (
    <Card title="User Profile" bordered={false} style={{ maxWidth: 600, margin: "20px auto" }}>
      <Form form={form} layout="vertical" onFinish={handleUpdate} autoComplete="off">
      <Form.Item
    name="firstName"
    label="First Name"
    rules={[
      { required: true, message: 'Please input your first name!' },
      { pattern: /^[A-Za-z]+$/, message: 'First name must be letters only!' }
    ]}
  >
    <Input disabled={!editing} />
  </Form.Item>
  <Form.Item
    name="lastName"
    label="Last Name"
    rules={[
      { required: true, message: 'Please input your last name!' },
      { pattern: /^[A-Za-z]+$/, message: 'Last name must be letters only!' }
    ]}
  >
    <Input disabled={!editing} />
  </Form.Item>
  <Form.Item
    name="email"
    label="Email"
    rules={[
      { required: true, message: 'Please input your email!' },
      { type: 'email', message: 'Please enter a valid email!' }
    ]}
  >
    <Input disabled={!editing} />
  </Form.Item>
  <Form.Item
    name="phoneNumber"
    label="Phone Number"
    rules={[
      { required: true, message: 'Please input your phone number!' },
      { pattern: /^\d{10}$/, message: 'Phone number must be 10 digits!' }
    ]}
  >
    <Input disabled={!editing} />
  </Form.Item>

        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="street" label="Street" rules={[{ required: true }]}>
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item
    name="zipCode"
    label="Zip Code"
    rules={[
      { required: true, message: 'Please input your zip code!' },
      { pattern: /^\d{5}$/, message: 'Zip code must be 5 digits!' }
    ]}
  >
    <Input disabled={!editing} />
  </Form.Item>
        {editing ? (
          <>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </Form>
    </Card>
  );
};

export default UserProfile;
