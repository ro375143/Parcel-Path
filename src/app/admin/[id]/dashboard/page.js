"use client";
import React, { useEffect } from "react";
import PackagesGrid from "@/components/PackageGrid";
import CreatePackage from "@/components/CreatePackage";
import styles from "@/app/page.module.css";

const AdminDashboard = () => {
  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  return (
    <>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      <div className={styles.dashboardContainer}>
        <PackagesGrid />
        <CreatePackage />
      </div>
    </>
  );
};

export default AdminDashboard;
