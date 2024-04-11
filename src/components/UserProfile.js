"use client";
import { auth, db } from "@/app/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input
} from 'antd';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const UserProfile = () => {
  const [form] = Form.useForm();
  const [inputEnabled, setInput] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const collectionsName = ["admins", "drivers", "customers"];

  async function getData(cName) {
    const uRef = doc(db, cName, auth.currentUser.uid);
    const dSnap = await getDoc(uRef);
    if (dSnap.data()) {
      return dSnap.data();
    }
    return null;
  }

  const userDatafromDB = async () => {
    let data = null;
    for (let i = 0; i < collectionsName.length; i++) {
      data = await getData(collectionsName[i]);
      if (data != null) {
        console.log("Data is " + JSON.stringify(data));
        setUserInfo({
          firstName: data.firstName,
          lastName: data.lastName,
          city: data.city,
          state: data.state,
          street: data.street,
          zipCode: data.zipCode,
          email: auth.currentUser.email,
          type: collectionsName[i],
          phone: data.phoneNo,
        });
        return;
      }
    }
  };

  useEffect(() => {
    if (userInfo && form) {
      form.setFieldsValue({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        address: userInfo.street + ", " + userInfo.city +  ", " + userInfo.state + ", " + userInfo.zipCode, //createAddressString(userInfo.st, userInfo.city, userInfo.state, userInfo.zipCode),
        city: userInfo.city,
        state: userInfo.state, 
        street: userInfo.street,
        zipCode: userInfo.zipCode,
        email: userInfo.email,
        type: userInfo.type,
        phone: userInfo.phone,
      });
    }
  }, [userInfo, form]);

  const editUser = () => {
    setInput(false);
  };

  const submitUser = async () => {
    setInput(true);

    await updateDoc(doc(db, userInfo.type, auth.currentUser.uid), {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      city: userInfo.city,
      state: userInfo.state, 
      street: userInfo.street,
      zipCode: userInfo.zipCode,
      phoneNo: userInfo.phone,
    });
  };

  // Input change handlers
  function handleFirstNameChange(ev) {
    setUserInfo({ ...userInfo, firstName: ev.target.value });
  }

  function handleLastNameChange(ev) {
    setUserInfo({ ...userInfo, lastName: ev.target.value });
  }

  function handlePhoneChange(ev) {
    setUserInfo({ ...userInfo, phone: ev.target.value });
  }

  const cancelEditMode = () => {
    setInput(true);
  };

  if (!userInfo) {
    if (!auth.currentUser) {
      console.log("THERE IS NO USER");
    } else {
      console.log("There is a user.. Loading the info now");
      userDatafromDB();
    }
  }

  return (
    <>
      <div style={{ background: '#e6f7ff', padding: '20px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff', textAlign: 'center' }}>Profile Page</h1>
      </div>
      <div>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input disabled={inputEnabled} onChange={handleFirstNameChange} />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input disabled={inputEnabled} onChange={handleLastNameChange} />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input disabled={true} />
        </Form.Item>
        {inputEnabled? (
          <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input disabled={inputEnabled} />
        </Form.Item>
        ): (
          <>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please input your City!" }]}
          >
            <Input onChange={(ev) => {setUserInfo({ ...userInfo, city: ev.target.value })}} />
          </Form.Item>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: "Please input your State!" }]}
          >
            <Input onChange={(ev) => {setUserInfo({ ...userInfo, state: ev.target.value })}} />
          </Form.Item>
          <Form.Item
            name="street"
            label="Street"
            rules={[{ required: true, message: "Please input your Street!" }]}
          >
            <Input onChange={(ev) => {setUserInfo({ ...userInfo, street: ev.target.value })}} />
          </Form.Item>
          <Form.Item
            name="zipCode"
            label="Zip Code"
            rules={[{ required: true, message: "Please input your ZipCode!" }]}
          >
            <Input onChange={(ev) => {setUserInfo({ ...userInfo, zipCode: ev.target.value })}} />
          </Form.Item>
        </>
        )}
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Type of user!" }]}
        >
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Phone Number!" }]}
          style={{ marginBottom: '20px', padding: '10px' }} // Added padding for Phone Number
        >
          <Input disabled={inputEnabled} onChange={handlePhoneChange} />
        </Form.Item>
        {inputEnabled ? (
          <Button onClick={editUser} disabled={!inputEnabled} class>
            Edit User
          </Button>
        ) : (
          <>
            <Button onClick={submitUser} disabled={inputEnabled}>
              Submit
            </Button>
            <Button onClick={cancelEditMode} disabled={inputEnabled}>
              Cancel
            </Button>
          </>
        )}
      </Form>
      </div>
    </>
  );
};

export default UserProfile;
