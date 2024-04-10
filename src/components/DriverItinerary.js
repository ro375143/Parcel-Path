import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config"; // Ensure this is correctly imported
import { collection, query, where, getDocs } from "firebase/firestore";
import { List, Tabs, Card, Badge, Space, Typography } from "antd";
import moment from "moment";

const { TabPane } = Tabs;
const { Text } = Typography;

const DriverItinerary = ({ driverId }) => {
  const [itineraryPackages, setItineraryPackages] = useState([]);
  const [deliveredPackages, setDeliveredPackages] = useState([]);

  useEffect(() => {
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

      const itinerary = packagesList.filter(
        (pkg) => pkg.status !== "Delivered"
      );
      const delivered = packagesList.filter(
        (pkg) => pkg.status === "Delivered"
      );
      setItineraryPackages(itinerary);
      setDeliveredPackages(delivered);
    };

    if (driverId) {
      fetchDriverPackages();
    }
  }, [driverId]);

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
            {itineraryPackages.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={itineraryPackages}
                renderItem={(item) => (
                  <List.Item>
                    <Card>
                      <Text strong>{item.name}</Text>
                      <p>Delivery Date: {item.deliveryDate}</p>
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
