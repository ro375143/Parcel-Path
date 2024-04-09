import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Shipping", path: "/shipping" },
  { name: "Tracking", path: "/tracking" },
  { name: "Support", path: "/support" },
];

const authLinks = [
  { name: "Account", path: "/account" },
  { name: "Logout", path: "/logout" },
];

const guestLinks = [
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [uid, setUid] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const uid = user.uid.slice(0, 5);
        setUid(uid);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserRole(userDocSnap.data().role);
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const renderLinks = (links) =>
    links.map((link, index) => (
      <li key={index}>
        {link.name === "Logout" ? (
          <button onClick={link.onClick} className={styles.customLogoutButton}>
            {link.name}
          </button>
        ) : (
          <Link href={link.path}>{link.name}</Link>
        )}
      </li>
    ));

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/" passHref>
          <div style={{ width: "300px", height: "90px", overflow: "hidden" }}>
            <img
              style={{ width: "100%", height: "89%", objectFit: "cover" }}
              src="your-image-url-here"
              alt="Your Image"
            />
          </div>
        </Link>
      </div>
      <div className={styles.navLinksContainer}>
        <ul
          className={isMobileMenuOpen ? styles.navLinksActive : styles.navLinks}
        >
          {renderLinks(navLinks)}
          {isAuthenticated ? (
            <>{renderLinks(authLinks)}</>
          ) : (
            renderLinks(guestLinks)
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
