"use client";
import React, { useState } from "react";
import { db } from "@/app/firebase/config"; // Adjust this path to your Firebase config file
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreatePackage = () => {
  const [formData, setFormData] = useState({
    customerId: "CUST2024B456",
    description: "",
    name: "",
    packageDimensions: "",
    packageWeight: "",
    status: "Delivered",
  });

  // Handle form data change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const packageWeightNumber = parseFloat(formData.packageWeight);

    // Generate the unique code to use as the tracking number
    const trackingNumber = `PKG-${Date.now()}-${formData.customerId}`;

    // Combine form data with other fields
    const packageData = {
      ...formData,
      packageWeight: packageWeightNumber,
      deliveryDate: serverTimestamp(), // Adjust according to your needs
      shipDate: serverTimestamp(), // Adjust according to your needs
      trackingNumber, // Use generated unique code as tracking number
    };

    try {
      await addDoc(collection(db, "packages"), packageData);
      alert("Package created successfully!");
      // Optionally reset form or redirect user
    } catch (error) {
      console.error("Error creating package:", error);
      alert("Failed to create package.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for the package information */}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Package Name"
        required
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="text"
        name="packageDimensions"
        value={formData.packageDimensions}
        onChange={handleChange}
        placeholder="Dimensions (L x W x H)"
        required
      />
      <input
        type="number"
        name="packageWeight"
        value={formData.packageWeight}
        onChange={handleChange}
        placeholder="Weight"
        required
      />
      {/* The tracking number is now automatically generated */}
      {/* Submit button */}
      <button type="submit">Create Package</button>
    </form>
  );
};

export default CreatePackage;
