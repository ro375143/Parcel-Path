"use client";
import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Input } from "antd";
import { auth, db } from "@/app/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "@/app/firebase/config";

const UserProfile = (props) => {
  const [form] = Form.useForm();
  const [inputEnabled, setInput] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const defaultUser = {
    userName: "testing@testing.com",
    password: "123456",
  };

  const userDatafromDB = async () => {
    console.log("UID is :" + auth.currentUser.uid);
    const userRef = doc(db, "user", auth.currentUser.uid);
    console.log("User Reference is : " + userRef);
    const documentSnapshot = await getDoc(userRef);
    console.log(
      "documentSnapshot is : " +
        JSON.stringify(documentSnapshot._document.data.value.mapValue.fields)
    );
    setUserInfo({
      firstName:
        documentSnapshot._document.data.value.mapValue.fields.firstName
          .stringValue,
      lastName:
        documentSnapshot._document.data.value.mapValue.fields.lastName
          .stringValue,
      address:
        documentSnapshot._document.data.value.mapValue.fields.email.stringValue,
    });

    // setUserInfo({
    //   firstName: "Dhana",
    //   lastName: "Neo",
    //   address: "email",
    // })
  };

  const signInWithEmailAndPasswordFirebase = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // router.route('/admin/id/profile')
      // setUser(auth.currentUser)
      userDatafromDB();
    } catch (error) {
      console.error("Error signing in:", error.message);
      throw error;
    }
  };

  const loadDefaultUser = async () => {
    signInWithEmailAndPasswordFirebase(
      defaultUser.userName,
      defaultUser.password
    );
    console.log(
      "CURRENT USER FROM DEFAULT is: " + JSON.stringify(auth.currentUser)
    );
  };

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        address: userInfo.address,
      });
    }
  });

  const editUser = () => {
    setInput(false);
    console.log("edit user clicked " + inputEnabled);
  };

  const submitUser = async () => {
    setInput(true);
    console.log("submit user clicked " + inputEnabled);

    //TODO make sure that the doc gets updated
    await updateDoc(doc(db, "user", auth.currentUser.uid), {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      address: userInfo.address,
    });
  };

  //input change handlers
  function handleFirstNameChange(ev) {
    setUserInfo({ ...userInfo, firstName: ev.target.value });
  }

  function handleLastNameChange(ev) {
    setUserInfo({ ...userInfo, lastName: ev.target.value });
  }

  function handleAddressChange(ev) {
    setUserInfo({ ...userInfo, address: ev.target.value });
  }

  const cancelEditMode = () => {
    setInput(true);
    console.log("submit user clicked " + inputEnabled);
  };

  if (!userInfo) {
    loadDefaultUser();
    console.log("THERE IS NO USER");
  }

  return (
    <div>
      <div
        style={{
          fontWeight: "bold",
          color: "blue",
          fontSize: 25,
          flex: true,
          margin: 15,
        }}
      >
        PROFILE PAGE
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: "",
          description: "",
          status: "",
        }}
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
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input disabled={inputEnabled} onChange={handleAddressChange} />
        </Form.Item>
        {inputEnabled ? (
          <Button onClick={editUser} disabled={!inputEnabled}>
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
  );
};

export default UserProfile;
