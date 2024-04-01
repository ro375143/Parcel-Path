import React, { useState } from 'react';
import Link from 'next/link';
import { MenuOutlined } from '@ant-design/icons';
import styles from './Navbar.module.css';

const navLinks = [
  { name: 'Shipping', path: '/shipping' },
  { name: 'Tracking', path: '/tracking' },
  { name: 'Support', path: '/support' },
];

const authLinks = [
  { name: 'Account', path: '/account' },
  { name: 'Logout', path: '/logout' },
];

const guestLinks = [
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' },
];

const Navbar = ({ isLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // function to dynamically render links based on isLoggedIn
  const renderLinks = (links) => links.map((link, index) => (
    <li key={index}>
      <Link href={link.path}>{link.name}</Link>
    </li>
  ));

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logoLink}>ParcelPath Logo</Link>
      </div>
      
      <div className={styles.navLinksContainer}>
        <ul className={isMobileMenuOpen ? styles.navLinksActive : styles.navLinks}>
          {renderLinks(navLinks)}
          {isLoggedIn ? renderLinks(authLinks) : renderLinks(guestLinks)}
        </ul>
        <button onClick={toggleMobileMenu} className={styles.mobileMenuButton}>
          <MenuOutlined />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;