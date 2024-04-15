import React, { useState } from "react";
import { Input, Button, Modal } from "antd";
import { db } from "@/app/firebase/config"; // Adjust this path as necessary
import { collection, query, where, getDocs } from "firebase/firestore";

const GuestPackageTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packageInfo, setPackageInfo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleTrack = async () => {
    const q = query(
      collection(db, "packages"),
      where("trackingNumber", "==", trackingNumber)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const packageData = querySnapshot.docs.map((doc) => doc.data())[0]; // Assuming one package per tracking number
      setPackageInfo(packageData);
      setIsModalVisible(true);
    } else {
      Modal.error({
        title: "No Package Found",
        content:
          "The tracking number you entered does not correspond to any known package.",
      });
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTrackingNumber(""); // Reset tracking number input
  };

  return (
    <div style={{ padding: 20 }}>
      <Input
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        placeholder="Enter tracking number"
        style={{ width: 300, marginRight: 8 }}
      />
      <Button type="primary" onClick={handleTrack}>
        Track Package
      </Button>

      <Modal
        title="Package Information"
        visible={isModalVisible}
        onOk={closeModal}
        onCancel={closeModal}
        footer={[
          <Button key="back" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        {packageInfo ? (
          <ul>
            <li>
              <strong>Status:</strong> {packageInfo.status}
            </li>
            <li>
              <strong>Weight:</strong> {packageInfo.packageWeight}
            </li>
            <li>
              <strong>Dimensions:</strong> {packageInfo.packageDimensions}
            </li>
            <li>
              <strong>Ship Date:</strong>{" "}
              {new Date(
                packageInfo.shipDate.seconds * 1000
              ).toLocaleDateString()}
            </li>
            <li>
              <strong>Expected Delivery:</strong>{" "}
              {new Date(
                packageInfo.deliveryDate.seconds * 1000
              ).toLocaleDateString()}
            </li>
          </ul>
        ) : (
          <p>No details available.</p>
        )}
      </Modal>
    </div>
  );
};

export default GuestPackageTracking;
