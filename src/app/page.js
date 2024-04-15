'use client'
import React from 'react';
import styles from './page.module.css'; // Import CSS module
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.slogan}>Parcel Path, a business tool for the future.</h1>
        <div className={styles.pitch}>
          <p className={styles.pitchText}>Bringing ease and accessibility to monitoring your packages.</p>
        </div>
        <div className={styles.line}>
          <p className={styles.lineText}>Check out our comprehensive suite of delivery solutions designed to streamline the shipping process, all from the comfort of your home.</p>
        </div>
        <button onClick={() => router.push("/tracking")} className={styles.trackPackageButton}>TRACK YOUR PACKAGES FOR FREE, FOREVER!</button> {/* Corrected className */}
        <div className={styles.businessInfo}>
          <p>Are you a small business? We support you! Register your business for FREE today!</p>
          <button onClick={() => router.push("/register/admin")} className={styles.registerBusinessButton}>REGISTER MY BUSINESS NOW</button> {/* Corrected className */}
        </div>
      </div>
    </div>
  );
};
