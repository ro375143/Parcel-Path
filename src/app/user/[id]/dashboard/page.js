"use client";
import CustomerPackagesGrid from "@/components/CustomerPackageGrid";
import React, { useEffect } from "react";
import styles from "@/app/page.module.css";

const UserDashboard = () => {
  useEffect(() => {
    document.title = "Customer Dashboard";
  }, []);

  return (
    <>
      <h1 className={styles.pageTitle}>Package Dashboard</h1>
      <div className={styles.dashboardContainer}>
        <CustomerPackagesGrid />
      </div>
    </>
  );
};

export default UserDashboard;
