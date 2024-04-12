import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from "next/navigation"; // Assuming next/navigation is correct for your setup
import { doc, getDoc } from "firebase/firestore";
import { message } from "antd";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Begin loading
      if (user) {
        setIsAuthenticated(true);
        setUid(user.uid);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists() && docSnap.data().role) {
            setUserRole(docSnap.data().role);
          } else {
            console.error("User document does not exist or role is missing.");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
        setLoading(false); // End loading after fetching role
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUid(null);
        setLoading(false); // End loading after fetching role

      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success("Sign Out Successful!", 10); // Display the success message
      setIsAuthenticated(false);
      setUserRole(null);
      setUid(null);
      router.push("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  if (loading) {
    // Return a loading indicator, or null if you prefer not to show anything
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  const roleBasedLinks = {
    customer: [
      { name: "Dashboard", path: `/user/${uid}/dashboard` },
      { name: "Feedback", path: `/user/${uid}/feedback` },
      { name: "Profile", path: `/user/${uid}/profile` },
      { name: "Tracking", path: `/user/${uid}/tracking` },
    ],
    driver: [
      { name: "Dashboard", path: `/driver/${uid}/dashboard` },
      { name: "Feedback", path: `/driver/${uid}/feedback` },
      { name: "Profile", path: `/driver/${uid}/profile` },
    ],
    admin: [
      { name: "Dashboard", path: `/admin/${uid}/dashboard` },
      { name: "Feedback", path: `/admin/${uid}/feedback` },
      { name: "Profile", path: `/admin/${uid}/profile` },
    ],
  };

  const logoutLink = { name: "Logout", onClick: handleLogout };

  const unauthenticatedLinks = [
    { name: "Track", path: "/tracking" },
    { name: "Register", path: "/register" },
    { name: "Login", path: "/login" },
  ];

  const renderLinks = (links) =>
    links.map((link, index) => (
      <li key={index}>
        {link.name === "Logout" ? (
          <button onClick={link.onClick} className={styles.customLogoutButton}>
            {link.name}
          </button>
        ) : (
          <Link href={link.path} key={index} legacyBehavior>
            {link.name}
          </Link>
        )}
      </li>
    ));

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const getLinksForRole = () => {
    if (loading) return []; // Optionally, handle loading state separately
    if (!isAuthenticated) return unauthenticatedLinks;
    if (!userRole) {
      console.error("User role not yet loaded or undefined.");
      return [];
  }
    const roleLinks = roleBasedLinks[userRole];
    if (!roleLinks) {
      console.error("Unrecognized role or role not yet loaded:", userRole);
      return []; // Optionally, return a default set of links or empty array
    }
    return [...roleLinks, logoutLink];
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/" passHref>
          <div style={{ width: "300px", height: "90px", overflow: "hidden" }}>
            <img
              style={{ width: "100%", height: "89%", objectFit: "cover" }}
              src="https://media.discordapp.net/attachments/1197323344937234464/1225574738068508753/parcel_path_9.png?ex=6621a06b&is=660f2b6b&hm=e1ee65b52c9e507fd5a5de0640e25276c808d8a2d1c165af9add2d0c509987be&=&format=webp&quality=lossless"
              alt="Your Logo"
            />
          </div>
        </Link>
      </div>
      <div className={styles.navLinksContainer}>
        <ul
          className={isMobileMenuOpen ? styles.navLinksActive : styles.navLinks}
        >
          {renderLinks(getLinksForRole())}
        </ul>
        <button onClick={toggleMobileMenu} className={styles.mobileMenuButton}>
          <MenuOutlined />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
