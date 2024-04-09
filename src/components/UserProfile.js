"use client";
import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Input } from "antd";
import { auth, db } from "@/app/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const UserProfile = (props) => {
  const [form] = Form.useForm();
  const [inputEnabled, setInput] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // const defaultUser = {
  //   userName: "test_customer@test.com",
  //   password: "test123",
  // };

  const collectionsName = ["admins", "drivers", "customers"]

  async function getData (cName) {
    const uRef = doc(db, cName, auth.currentUser.uid);
    const dSnap = await getDoc(uRef)
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
          address: data.address,
          email: auth.currentUser.email,
          type: collectionsName[i],
          phone: data.phoneNo
        });
        return;
      }
    }
    // console.log("UID is :" + auth.currentUser.uid);
    // const userRef = doc(db, "ff", auth.currentUser.uid);
    // console.log("User Reference is : " + userRef);
    // const documentSnapshot = await getDoc(userRef);
    // console.log(
    //   "documentSnapshot is : " +
    //     JSON.stringify(documentSnapshot.data())
    // );

    // setUserInfo({
    //   firstName: "Dhana",
    //   lastName: "Neo",
    //   address: "email",
    // })
  };

  // const signInWithEmailAndPasswordFirebase = async (email, password) => {
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     // router.route('/admin/id/profile')
  //     // setUser(auth.currentUser)
  //     userDatafromDB();
  //   } catch (error) {
  //     console.error("Error signing in:", error.message);
  //     throw error;
  //   }
  // };

  // const loadDefaultUser = async () => {
  //   signInWithEmailAndPasswordFirebase(
  //     defaultUser.userName,
  //     defaultUser.password
  //   );
  //   console.log(
  //     "CURRENT USER FROM DEFAULT is: " + JSON.stringify(auth.currentUser)
  //   );
  // };

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        address: userInfo.address,
        email: userInfo.email,
        type: userInfo.type,
        phone: userInfo.phone
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

    await updateDoc(doc(db, userInfo.type, auth.currentUser.uid), {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      address: userInfo.address,
      phoneNo: userInfo.phone
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

  function handlePhoneChange(ev) {
    setUserInfo({ ...userInfo, phone: ev.target.value });
  }

  const cancelEditMode = () => {
    setInput(true);
    console.log("submit user clicked " + inputEnabled);
  };

  if (!userInfo) {
    if (!auth.currentUser) {
      console.log("THERE IS NO USER");
      //loadDefaultUser();
    } else {
      console.log("There is a user.. Loading the info now")
      userDatafromDB();
    }
  }
  // if (!userInfo) {
  //   loadDefaultUser();
  //   console.log("THERE IS NO USER");
  // }

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
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input disabled={inputEnabled} onChange={handleAddressChange} />
        </Form.Item>
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
        >
          <Input disabled={inputEnabled} onChange={handlePhoneChange}/>
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
