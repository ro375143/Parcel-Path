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
      <Link href="/" className={styles.logoLink}>
        <div style={{ width: '300px', height: '90px', overflow: 'hidden' }}>
          <img
            style={{ width: '100%', height: '89%', objectFit: 'cover' }}
            src="https://media.discordapp.net/attachments/1197323344937234464/1225574738068508753/parcel_path_9.png?ex=6621a06b&is=660f2b6b&hm=e1ee65b52c9e507fd5a5de0640e25276c808d8a2d1c165af9add2d0c509987be&=&format=webp&quality=lossless"
            alt="Your Image"
          />
        </div>
      </Link>
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