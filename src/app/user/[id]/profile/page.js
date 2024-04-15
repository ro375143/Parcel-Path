"use client";
import UserProfile from "@/components/UserProfile";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import styles from "@/app/page.module.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Fetch user role from Firestore directly by referencing the user's document
        const userDocRef = doc(db, "users", user.uid); // Create reference to user document
        getDoc(userDocRef)
          .then((doc) => {
            if (doc.exists() && doc.data().role === "customer") {
              setUserRole("customer");
            }
          })
          .catch((error) => {
            console.error("Error getting user document:", error);
          });
      }
    });

    return unsubscribe;
  }, []);
  if (!user || userRole !== "customer") {
    // Render message in the center of the screen
    return (
      <div className={styles.centeredMessage}>
        <p>You must be an authenticated customer to access this page!</p>
      </div>
    );
  }
  return (
    <div>
      <h1
        className={styles.pageTitle}
        style={{
          border: "2px solid #345454",
          borderRadius: "10px",
          padding: "10px",
          width: "1000px",
          marginTop: "50px",
          marginLeft: "auto",
          marginBottom: "1px",
          marginRight: "auto",
          backgroundColor: "#154734",
          color: "white", // Adjust the value as needed for a bigger top margin
        }}
      >
        User Profile
      </h1>
      <UserProfile></UserProfile>
    </div>
  );
};

export default Profile;
