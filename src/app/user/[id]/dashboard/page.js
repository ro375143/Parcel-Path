"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import these
import { auth, db } from "@/app/firebase/config"; // Ensure you have db imported

const UserDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user details from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            // Combine auth user details with Firestore data
            const userDetails = {
              uid: currentUser.uid,
              email: currentUser.email,
              ...docSnap.data(), // Spread Firestore document data (includes role)
            };
            setUser(userDetails);
          } else {
            console.error("No such document!");
            setUser(null);
            router.push("/login");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error (e.g., permission issues, network errors)
        }
      } else {
        setUser(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = () => {
    firebaseSignOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        console.error("Sign Out Error", error);
      });
  };

  return (
    <div>
      <h1>User Dashboard Page</h1>
      {user ? (
        <>
          <div>Email: {user.email}</div>
          <div>UID: {user.uid}</div>
          <div>Role: {user.role}</div>
          <button onClick={handleSignOut}>Logout</button>
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default UserDashboard;
