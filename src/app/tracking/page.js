"use client"
import React from "react";
import GuestPackageTracking from "@/components/GuestTracking";
import { useRouter } from "next/navigation";
import { Button, Typography } from 'antd';
import styles from './GuestTracking.module.css'; // Make sure this path is correct

const GuestTracking = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Typography.Title level={2} className={styles.title}>
        Please enter your tracking number:
      </Typography.Title>

      <GuestPackageTracking />
      
      <div className={styles.signUp}>
        <Typography.Paragraph className={styles.signUpText}>
          If you'd like to keep track of all your tracked packages, consider signing up:
        </Typography.Paragraph>
        <Button type="primary" onClick={() => router.push("/register/user")}>
          REGISTER NOW
        </Button>
      </div>
    </div>
  );
};

export default GuestTracking;
