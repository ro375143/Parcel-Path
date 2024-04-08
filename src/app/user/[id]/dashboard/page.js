"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

const UserDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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
          <button onClick={handleSignOut}>Logout</button>
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default UserDashboard;
