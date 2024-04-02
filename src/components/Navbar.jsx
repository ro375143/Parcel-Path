import React, { useState } from 'react';
import Link from 'next/link';
import { MenuOutlined } from '@ant-design/icons';
import styles from './Navbar.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/config';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/">ParcelPath Logo</Link>
      </div>
      
      <div className={styles.navLinksContainer}>
        <ul className={isMobileMenuOpen ? styles.navLinksActive : styles.navLinks}>
          {user ? (
            <>
              <li>
                <button onClick={handleLogout} className="text-white bg-blue-600 hover:bg-blue-900 py-2 px-4 rounded">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={() => router.push('/login')} className="text-white bg-blue-600 hover:bg-blue-900 py-2 px-4 rounded">Login</button>
              </li>
              <li>
                <button onClick={() => router.push('/register')} className="text-white bg-blue-600 hover:bg-blue-900 py-2 px-4 rounded">Register</button>
              </li>
            </>
          )}
        </ul>

        <button onClick={toggleMobileMenu} className={styles.mobileMenuButton}>
          <MenuOutlined />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
