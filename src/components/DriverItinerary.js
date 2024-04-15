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
  GeoPoint,
  arrayUnion,
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
  Input,
  message,
  Select,
} from "antd";
import moment from "moment";
import { QrScanner } from "@yudiel/react-qr-scanner";

const { TabPane } = Tabs;
const { Text } = Typography;
const { Option } = Select;

const DriverItinerary = ({ driverId }) => {
  const [itineraryPackages, setItineraryPackages] = useState([]);
  const [deliveredPackages, setDeliveredPackages] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [timestamp, setTimestamp] = useState(new Date().toString());
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");

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

  const handleFormSubmit = async () => {
    const scannedPackage = itineraryPackages.find(
      (pkg) => pkg.trackingNumber === trackingNumber
    );
    if (scannedPackage) {
      setSelectedPackage(scannedPackage);
      setIsFormOpen(false);
      setUpdateModalVisible(true);
    } else {
      message.error("Package not found in itinerary.");
    }
    setTrackingNumber("");
  };

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setUpdateModalVisible(true); // Move modal open call here after position is set
      },
      (error) => {
        console.error("Error getting current position:", error);
        message.error(
          "Failed to get current position. Please ensure location services are enabled."
        );
      }
    );
  };

  const handleScan = (value) => {
    if (value && !scanResult.length) {
      setScanResult(value);
      setIsScannerOpen(false);
      const scannedPackage = itineraryPackages.find(
        (pkg) => pkg.trackingNumber === value
      );
      if (scannedPackage) {
        setSelectedPackage(scannedPackage);
        getCurrentPosition(); // Fetch current position right here
      } else {
        message.error("Package not found in itinerary.");
      }
    }
  };

  const openScanner = () => setIsScannerOpen(true);
  const closeScanner = () => setIsScannerOpen(false);

  const geopoint = new GeoPoint(latitude, longitude);
  const handleUpdateModalOk = async () => {
    await updateDoc(doc(db, "packages", selectedPackage.id), {
      status,
      location: arrayUnion({ geopoint, timeStamp: timestamp }),
    });
    message.success(`Package ${selectedPackage.name} updated!`);
    setUpdateModalVisible(false);
    fetchDriverPackages();
  };

  useEffect(() => {
    getCurrentPosition();
    setTimestamp(new Date().toString()); // Set timestamp to current date and time
  }, []);

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
            <Button type="primary" onClick={openScanner}>
              Scan QR Code
            </Button>
            {isScannerOpen && (
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
                        Ship Date:
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
                      <p>
                        Ship Date:
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

      <Modal
        title="Update Package"
        visible={updateModalVisible}
        onOk={handleUpdateModalOk}
        onCancel={() => setUpdateModalVisible(false)}
      >
        <Select
          placeholder="Select Status"
          style={{ width: "100%", marginBottom: "12px" }}
          value={status}
          onChange={(value) => setStatus(value)}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Delayed">Delayed</Option>
          <Option value="In Transit">In Transit</Option>
          <Option value="Out for Delivery">Out for Delivery</Option>
          <Option value="Delivered">Delivered</Option>
        </Select>
        <Input
          placeholder="Latitude"
          value={latitude}
          readOnly
          style={{ marginBottom: "12px" }}
        />
        <Input
          placeholder="Longitude"
          value={longitude}
          readOnly
          style={{ marginBottom: "12px" }}
        />
        <Input
          placeholder="Timestamp"
          value={timestamp}
          readOnly
          style={{ marginBottom: "12px" }}
        />
      </Modal>
    </Card>
  );
};

export default DriverItinerary;
