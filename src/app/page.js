"use client";
import React, { useState, useEffect } from "react";
import "./page.module.css";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export default function HomePage() {
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
    <>
      <div className="homepage-background">
        {user ? (
          <>
            <div className="text-black">Email: {user.email}</div>
            <div className="text-black">Email: {user.uid}</div>
            <button className="text-black" onClick={handleSignOut}>
              Logout
            </button>
          </>
        ) : (
          <p>Loading user information...</p>
        )}
        <h1>HomePage or Landing Page</h1>
      </div>
      <main>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          venenatis fermentum ipsum. Duis laoreet est est, venenatis ullamcorper
          sem accumsan eu. Donec laoreet erat sapien, et efficitur nulla
          facilisis in. Maecenas vel augue orci. Mauris eu ex porttitor,
          venenatis lorem et, efficitur justo. Cras consectetur a lorem vel
          lobortis. Fusce euismod tortor facilisis, tristique elit vel, commodo
          risus. In in purus lectus. Suspendisse vitae elit fringilla, laoreet
          arcu ac, porttitor diam. Integer velit nulla, dapibus at vulputate et,
          bibendum a odio. Sed consectetur faucibus tortor sit amet rutrum. In
          vel orci bibendum, hendrerit leo at, aliquam ante. Nam sed metus
          euismod, dignissim justo at, rutrum libero. Nunc vitae elit purus.
        </p>
      </main>
    </>
  );
}
