import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Modal, Select, Button, message } from "antd"; // Import the message component

export default function AdminAssignPackage() {
  const [drivers, setDrivers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(undefined);
  const [selectedPackage, setSelectedPackage] = useState(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchDrivers = async () => {
    const q = query(collection(db, "users"), where("role", "==", "driver"));
    const querySnapshot = await getDocs(q);
    setDrivers(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const fetchPackages = async () => {
    const q = query(
      collection(db, "packages"),
      where("assignedDriverId", "==", null)
    );
    const querySnapshot = await getDocs(q);
    setPackages(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  useEffect(() => {
    fetchDrivers();
    fetchPackages();
  }, []); // removed [fetchDrivers, fetchPackages] causing infinite reads in db

  const handleAssignPackage = async () => {
    if (!selectedDriver || !selectedPackage) {
      message.error("Please select both a driver and a package."); // Using Ant Design's message for feedback
      return;
    }
    try {
      await updateDoc(doc(db, "packages", selectedPackage), {
        assignedDriverId: selectedDriver,
        driverAssigned: true,
      });
      message.success("Package assigned successfully!"); // Using Ant Design's message for success feedback
      await fetchPackages(); // Refresh the packages list
      setSelectedDriver(undefined); // Reset selected driver dropdown
      setSelectedPackage(undefined); // Reset selected package dropdown
      setIsModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error assigning package:", error);
      message.error("Failed to assign package."); // Using Ant Design's message for error feedback
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Assign Package to Driver
      </Button>
      <Modal
        title="Assign Package to Driver"
        visible={isModalVisible}
        onOk={handleAssignPackage}
        onCancel={handleCancel}
        okText="Assign"
        cancelText="Cancel"
      >
        <Select
          placeholder="Select Driver"
          onChange={(value) => setSelectedDriver(value)}
          value={selectedDriver}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          {drivers.map((driver) => (
            <Select.Option key={driver.id} value={driver.id}>
              {driver.username || "Unnamed Driver"}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Select Package"
          onChange={(value) => setSelectedPackage(value)}
          value={selectedPackage}
          style={{ width: "100%" }}
        >
          {packages.map((packageItem) => (
            <Select.Option key={packageItem.id} value={packageItem.id}>
              {packageItem.name || "Unnamed Package"}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
}
