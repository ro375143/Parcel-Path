import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <section className={styles.links}>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </section>
        <section className={styles.socialMedia}>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        </section>
      </div>
      <div className={styles.copyRight}>
        © {new Date().getFullYear()} ParcelPath. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
