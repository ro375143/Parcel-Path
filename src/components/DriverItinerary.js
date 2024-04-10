"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  List,
  Tabs,
  Card,
  Badge,
  Space,
  Typography,
  Button,
  Modal,
} from "antd";
import moment from "moment";
import { QRScanner, Scanner } from "@yudiel/react-qr-scanner";

const { TabPane } = Tabs;
const { Text } = Typography;

const DriverItinerary = ({ driverId }) => {
  const [itineraryPackages, setItineraryPackages] = useState([]);
  const [deliveredPackages, setDeliveredPackages] = useState([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    fetchDriverPackages();
  }, [driverId]);

  const fetchDriverPackages = async () => {
    const q = query(
      collection(db, "packages"),
      where("assignedDriverId", "==", driverId)
    );
    const querySnapshot = await getDocs(q);
    const packagesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      deliveryDate: doc.data().deliveryDate
        ? moment(doc.data().deliveryDate.toDate()).format("MMMM Do YYYY")
        : "No date",
    }));

    const itinerary = packagesList.filter((pkg) => pkg.status !== "Delivered");
    const delivered = packagesList.filter((pkg) => pkg.status === "Delivered");
    setItineraryPackages(itinerary);
    setDeliveredPackages(delivered);
  };

  const handleScan = async (data) => {
    if (data) {
      const scannedPackage = itineraryPackages.find(
        (pkg) => pkg.trackingNumber === data
      );
      if (scannedPackage) {
        await updateDoc(doc(db, "packages", scannedPackage.id), {
          status: "Delivered",
        });
        fetchDriverPackages();
        setIsScannerOpen(false);
        alert(`Package ${scannedPackage.name} delivered!`);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <Card
      style={{
        backgroundColor: "#f0f2f5",
        margin: "20px",
        borderRadius: "8px",
      }}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ display: "flex", width: "100%" }}
      >
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Itinerary" key="1">
            <Button type="primary" onClick={() => setIsScannerOpen(true)}>
              Scan QR Code
            </Button>
            {isScannerOpen && (
              <Modal
                title="Scan QR Code"
                visible={isScannerOpen}
                onOk={() => setIsScannerOpen(false)}
                onCancel={() => setIsScannerOpen(false)}
                footer={null}
              >
                <Scanner
                  onResult={(result, error) => {
                    if (!!result) {
                      handleScan(result?.text);
                    }
                    if (!!error) {
                      console.info(error);
                    }
                  }}
                  style={{ width: "100%" }}
                />
              </Modal>
            )}
            {itineraryPackages.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={itineraryPackages}
                renderItem={(item) => (
                  <List.Item>
                    <Card>
                      <Text strong>{item.name}</Text>
                      <p>Delivery Date: {item.deliveryDate}</p>
                      <p>
                        Ship Date:{" "}
                        {item.shipDate
                          ? moment(item.shipDate.toDate()).format(
                              "MMMM Do YYYY"
                            )
                          : "No date"}
                      </p>
                      <p>Tracking Number: {item.trackingNumber}</p>
                      <Badge
                        status="processing"
                        text={`Status: ${item.status || "Pending"}`}
                      />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Text>No upcoming packages.</Text>
            )}
          </TabPane>
          <TabPane tab="Delivered" key="2">
            {deliveredPackages.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={deliveredPackages}
                renderItem={(item) => (
                  <List.Item>
                    <Card>
                      <Text strong>{item.name}</Text>
                      <p>Delivery Date: {item.deliveryDate}</p>
                      {/* Display ship date and tracking number for delivered packages */}
                      <p>
                        Ship Date:{" "}
                        {item.shipDate
                          ? moment(item.shipDate.toDate()).format(
                              "MMMM Do YYYY"
                            )
                          : "No date"}
                      </p>
                      <p>Tracking Number: {item.trackingNumber}</p>
                      <Badge status="success" text="Status: Delivered" />
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <Text>No delivered packages.</Text>
            )}
          </TabPane>
        </Tabs>
      </Space>
    </Card>
  );
};

export default DriverItinerary;
