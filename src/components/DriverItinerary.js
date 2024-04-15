import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { ToastContainer, toast } from "react-toastify";
import { Tabs, Card, List, Modal, Button } from "antd";

const { TabPane } = Tabs;

export default function PackageScanner({ driverId }) {
  const [packageData, setPackageData] = useState([]);
  const [deliveredPackages, setDeliveredPackages] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "packages"),
      where("assignedDriverId", "==", driverId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allPackages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPackageData(allPackages.filter((pkg) => pkg.status !== "Delivered"));
      setDeliveredPackages(
        allPackages.filter((pkg) => pkg.status === "Delivered")
      );
    });
    return () => unsubscribe();
  }, [driverId]);

  const handleScan = (value) => {
    if (value && !scanResult.length) {
      setScanResult(value);
      const foundPackage = packageData.find(
        (pkg) => pkg.trackingNumber === value
      );
      if (foundPackage) {
        updateDoc(doc(db, "packages", foundPackage.id), { status: "Delivered" })
          .then(() => {
            toast.success("Package delivered successfully!");
            setScanResult("");
            setIsScannerOpen(false);
          })
          .catch((error) => {
            toast.error("Failed to update package status.");
            console.error("Error updating package:", error);
          });
      } else {
        toast.error("Invalid QR Code for package.");
      }
    }
  };

  const openScanner = () => setIsScannerOpen(true);
  const closeScanner = () => setIsScannerOpen(false);

  return (
    <Card style={{ margin: "16px", borderRadius: "8px" }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Itinerary" key="1">
          <List
            dataSource={packageData}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.name}>
                  <p>{item.description}</p>
                  <p>Status: {item.status}</p>
                  <p>Tracking Number: {item.trackingNumber}</p>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab="Delivered" key="2">
          <List
            dataSource={deliveredPackages}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.name}>
                  <p>{item.description}</p>
                  <p>Status: {item.status}</p>
                  <p>Tracking Number: {item.trackingNumber}</p>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
      <Button type="primary" onClick={openScanner}>
        Scan QR Code
      </Button>
      <Modal
        title="Scan QR Code"
        open={isScannerOpen}
        onCancel={closeScanner}
        footer={null}
      >
        <QrScanner
          onDecode={handleScan}
          onError={(error) => console.log(error?.message)}
          style={{ width: "100%" }}
        />
      </Modal>
      <ToastContainer
        style={{ width: "300px" }}
        toastStyle={{
          minHeight: "40px",
          fontSize: "14px",
        }}
      />
    </Card>
  );
}
