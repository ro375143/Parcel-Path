"use client";
import styles from "@/app/page.module.css";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import DriverProfile from "@/components/DriverProfile";

const DriverProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        getDoc(userDocRef)
          .then((doc) => {
            if (doc.exists() && doc.data().role === "driver") {
              setUserRole("driver");
            }
          })
          .catch((error) => {
            console.error("Error getting user document:", error);
          });
      }
    });

    return unsubscribe;
  }, []);
  if (!user || userRole !== "driver") {
    // Render message in the center of the screen
    return (
      <div className={styles.centeredMessage}>
        <p>You must be an authenticated driver to access this page!</p>
      </div>
    );
  }
  return (
    <div>
      <h1
        className={styles.pageTitle}
        style={{
          border: "2px solid #154734",
          borderRadius: "10px",
          padding: "10px",
          width: "1000px",
          marginTop: "50px",
          marginLeft: "auto",
          marginBottom: "70px",
          marginRight: "auto",
          backgroundColor: "#154734",
          color: "white", // Adjust the value as needed for a bigger top margin
        }}
      >
        Driver Profile
      </h1>
      <DriverProfile />
    </div>
  );
};

export default DriverProfilePage;
