"use client";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import DriverItinerary from "@/components/DriverItinerary";
import styles from "@/app/page.module.css";

const DriversPage = () => {
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUserId(user.uid);
        fetchUserRole(user.uid);
      } else {
        // User is signed out
        setIsLoading(false);
      }
    });

    return unsubscribe; // Clean up the subscription on unmount
  }, []);

  const fetchUserRole = async (uid) => {
    setIsLoading(true);
    const userDocRef = doc(db, "users", uid);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role); // Assuming there's a 'role' field in the user document
      } else {
        console.log("No such user document!");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Driver Dashboard</h1>
      <div className={`ag-theme-alpine ${styles.dashboardContainer}`}>
        {isLoading ? (
          <p>Loading...</p>
        ) : userRole === "driver" && userId ? (
          <DriverItinerary driverId={userId} />
        ) : (
          <p>You do not have access to this page or you are not signed in.</p>
        )}
      </div>
    </div>
  );
};

export default DriversPage;
