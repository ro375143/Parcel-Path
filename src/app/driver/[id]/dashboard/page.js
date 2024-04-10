"use client";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import DriverItinerary from "@/components/DriverItinerary";

const DriversPage = () => {
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUserId(user.uid);
        fetchUserRole(user.uid);
      } else {
        // User is signed out
        setIsLoading(false);
      }
    });

    return unsubscribe; // Clean up the subscription on unmount
  }, []);

  const fetchUserRole = async (uid) => {
    setIsLoading(true);
    const userDocRef = doc(db, "users", uid);
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role); // Assuming there's a 'role' field in the user document
      } else {
        console.log("No such user document!");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Driver's Itinerary</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : userRole === "driver" && userId ? (
        <DriverItinerary driverId={userId} />
      ) : (
        <p>You do not have access to this page or you are not signed in.</p>
      )}
    </div>
  );
};

export default DriversPage;

{
  /* {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itinerary.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p><strong>Customer ID:</strong> {item.customerId}</p>
              <p><strong>Delivery Date:</strong> {item.deliveryDate}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Package Dimensions:</strong> {item.packageDimensions}</p>
              <p><strong>Package Weight:</strong> {item.packageWeight} lbs</p>
              <p><strong>Ship Date:</strong> {item.shipDate}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Tracking Number:</strong> {item.trackingNumber}</p>
            </div>
          ))}
        </div>
      )} */
}
