import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config"; // Make sure this path is correct for your Firebase config file
import { collection, query, where, getDocs } from "firebase/firestore";

const DriverItinerary = ({ driverId }) => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchDriverPackages = async () => {
      // Query packages collection for packages assigned to the provided driverId
      const q = query(
        collection(db, "packages"),
        where("assignedDriverId", "==", driverId)
      );
      const querySnapshot = await getDocs(q);
      const packagesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPackages(packagesList);
    };

    if (driverId) {
      fetchDriverPackages();
    }
  }, [driverId]); // Re-run this effect if driverId changes

  return (
    <div>
      <h2>Driver Itinerary</h2>
      {packages.length > 0 ? (
        <ul>
          {packages.map((packageItem) => (
            <li key={packageItem.id}>
              {packageItem.name} - Status: {packageItem.status || "Pending"}
              {/* Display more details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No packages assigned.</p>
      )}
    </div>
  );
};

export default DriverItinerary;
