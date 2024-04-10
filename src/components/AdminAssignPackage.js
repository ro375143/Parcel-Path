import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config"; // Adjust this import based on your actual Firebase config file
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function AdminAssignPackage() {
  const [drivers, setDrivers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");

  // Fetch unassigned packages
  const fetchPackages = async () => {
    const q = query(
      collection(db, "packages"),
      where("assignedDriverId", "==", null)
    );
    const querySnapshot = await getDocs(q);
    const packagesList = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Document data
    }));
    setPackages(packagesList);
  };

  useEffect(() => {
    // Fetch drivers with role "driver"
    const fetchDrivers = async () => {
      const q = query(collection(db, "users"), where("role", "==", "driver"));
      const querySnapshot = await getDocs(q);
      const driversList = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data(), // Document data, including username
      }));
      setDrivers(driversList);
    };

    fetchDrivers();
    fetchPackages();
  }, []);

  const handleAssignPackage = async () => {
    if (!selectedDriver || !selectedPackage) {
      alert("Please select both a driver and a package."); // Simple validation feedback
      return;
    }
    try {
      await updateDoc(doc(db, "packages", selectedPackage), {
        assignedDriverId: selectedDriver,
        driverAssigned: true,
      });
      alert("Package assigned successfully!"); // Success feedback
      await fetchPackages(); // Refresh the packages list
      setSelectedDriver(""); // Reset selected driver dropdown
      setSelectedPackage(""); // Reset selected package dropdown
    } catch (error) {
      console.error("Error assigning package:", error);
      alert("Failed to assign package."); // Error feedback
    }
  };

  return (
    <div>
      <h2>Assign Package to Driver</h2>
      <select
        onChange={(e) => setSelectedDriver(e.target.value)}
        value={selectedDriver}
      >
        <option value="">Select Driver</option>
        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.username || "Unnamed Driver"}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => setSelectedPackage(e.target.value)}
        value={selectedPackage}
      >
        <option value="">Select Package</option>
        {packages.map((packageItem) => (
          <option key={packageItem.id} value={packageItem.id}>
            {packageItem.name || "Unnamed Package"}
          </option>
        ))}
      </select>
      <button onClick={handleAssignPackage}>Assign Package</button>
    </div>
  );
}
