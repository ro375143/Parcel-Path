"use client";
import PackagesGrid from "@/components/PackageGrid";
import CreatePackage from "@/components/CreatePackage";
import styles from "@/app/page.module.css";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchUserRole(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []); // Ensure useEffect is called unconditionally at the top level

  const fetchUserRole = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserRole(userData.role || "");
      } else {
        console.log("No such user document!");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  if (!user || userRole !== "admin") {
    return (
      <div className={styles.centeredMessage}>
        <p>You must be an authenticated admin to access this page!</p>
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
          marginBottom: "1px",
          marginRight: "auto",
          backgroundColor: "#154734",
          color: "white", // Adjust the value as needed for a bigger top margin
        }}
      >
        Admin Dashboard
      </h1>
      <div className={styles.dashboardContainer}>
        <PackagesGrid />
        <CreatePackage />
      </div>
    </div>
  );
};

export default AdminDashboard;
