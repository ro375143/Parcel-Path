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
import axios from "axios";

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

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
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
        setUpdateModalVisible(true); // Set updateModalVisible to true
      } else {
        message.error("Package not found in itinerary.");
      }
      setScanResult("");
    }
  };

  const openScanner = () => setIsScannerOpen(true);
  const closeScanner = () => setIsScannerOpen(false);

  async function addressToCoordinates(address) {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        throw new Error("No results found for the address.");
      }
    } catch (error) {
      throw new Error("Error geocoding address: " + error.message);
    }
  }

  const handleUpdateModalOk = async () => {
    // Only validate location if status is "Delivered"
    if (status === "Delivered") {
      try {
        const deliveryAddress = selectedPackage.recipientAddress;
        const { latitude: deliveryLat, longitude: deliveryLon } =
          await addressToCoordinates(deliveryAddress);
        console.log(deliveryLon);
        const distanceToDeliveryAddress = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          deliveryLat,
          deliveryLon
        );

        if (distanceToDeliveryAddress <= 2.5) {
          // Assuming 2.5 km (2500 meters) tolerance for verification
          await updateDoc(doc(db, "packages", selectedPackage.id), {
            status,
            location: arrayUnion({
              status: status,
              geopoint: new GeoPoint(latitude, longitude),
              timeStamp: timestamp,
            }),
          });
          message.success(`Package ${selectedPackage.name} updated!`);
          setUpdateModalVisible(false);
          fetchDriverPackages();
        } else {
          console.log(distanceToDeliveryAddress);
          message.error(
            "Location verification failed. Please check the delivery address."
          );
        }
      } catch (error) {
        console.error(error);
        message.error("Error verifying location. Please try again later.");
      }
    } else {
      // Update package status without location verification for statuses other than "Delivered"
      await updateDoc(doc(db, "packages", selectedPackage.id), {
        status,
        location: arrayUnion({
          status: status,
          geopoint: new GeoPoint(latitude, longitude),
          timeStamp: timestamp,
        }),
      });
      message.success(`Package ${selectedPackage.name} updated!`);
      setUpdateModalVisible(false);
      fetchDriverPackages();
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
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
                      <p>Recipient Name: {item.recipientName}</p>{" "}
                      <p>
                        Destination:{" "}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.recipientAddress)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.recipientAddress}
                        </a>
                      </p>
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
                      <p>Recipient Name: {item.recipientName}</p>
                      <p>Destination Address: {item.recipientAddress}</p>
                      <p>Delivery Date: {item.deliveryDate}</p>
                      <p>
                        Ship Date:
                        {item.shipDate
                          ? moment(item.shipDate.toDate()).format(
                              "MMMM Do YYYY"
                            )
                          : "No date"}
                      </p>
                      <p>Tracking Number: {item.trackingNumber}</p>{" "}
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
