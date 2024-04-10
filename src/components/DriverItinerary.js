import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config"; // Ensure this is correctly imported
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { List, Tabs } from "antd";
import moment from "moment";

const { TabPane } = Tabs;

const DriverItinerary = ({ driverId }) => {
  const [itineraryPackages, setItineraryPackages] = useState([]);
  const [deliveredPackages, setDeliveredPackages] = useState([]);

  useEffect(() => {
    const fetchDriverPackages = async () => {
      console.log("Fetching packages for driver ID:", driverId);
      const q = query(
        collection(db, "packages"),
        where("assignedDriverId", "==", driverId)
        //orderBy("deliveryDate") // Assures oldest delivery dates are first
      );
      const querySnapshot = await getDocs(q);
      const packagesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Use Moment.js for formatting
        deliveryDate: doc.data().deliveryDate
          ? moment(doc.data().deliveryDate.toDate()).format("MMMM Do YYYY")
          : "No date",
      }));
      console.log("Fetched packages:", packagesList);

      // Separate packages into itinerary and delivered based on their status
      const itinerary = packagesList.filter(
        (pkg) => pkg.status !== "Delivered"
      );
      const delivered = packagesList.filter(
        (pkg) => pkg.status === "Delivered"
      );
      console.log("Itinerary packages:", itinerary);
      console.log("Delivered packages:", delivered);
      setItineraryPackages(itinerary);
      setDeliveredPackages(delivered);
    };

    if (driverId) {
      fetchDriverPackages();
    }
  }, [driverId]);

  return (
    <div>
      <h2>Driver Itinerary</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Itinerary" key="1">
          {itineraryPackages.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={itineraryPackages}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`Delivery Date: ${
                      item.deliveryDate
                    } - Status: ${item.status || "Pending"}`}
                  />
                  {/* Additional details can be added here */}
                </List.Item>
              )}
            />
          ) : (
            <p>No upcoming packages.</p>
          )}
        </TabPane>
        <TabPane tab="Delivered" key="2">
          {deliveredPackages.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={deliveredPackages}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`Delivery Date: ${item.deliveryDate} - Status: Delivered`}
                  />
                  {/* Additional details for delivered packages can be added here */}
                </List.Item>
              )}
            />
          ) : (
            <p>No delivered packages.</p>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DriverItinerary;
