import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Input, Modal, Row, Col } from "antd";
import { db } from "@/app/firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./PackageGrid.module.css";

const CustomerPackagesGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [user, setUser] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    {
      headerName: "Package Name",
      field: "name",
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Tracking Number",
      field: "trackingNumber",
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Description",
      field: "description",
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Package Weight",
      field: "packageWeight",
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Package Dimensions",
      field: "packageDimensions",
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Ship Date",
      field: "shipDate",
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
      cellRenderer: (params) =>
        params.value
          ? new Date(params.value.seconds * 1000).toLocaleDateString()
          : "N/A",
    },
    {
      headerName: "Expected Delivery Date",
      field: "deliveryDate",
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
      cellRenderer: (params) =>
        params.value
          ? new Date(params.value.seconds * 1000).toLocaleDateString()
          : "N/A",
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTrackedPackages(currentUser.uid);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTrackedPackages = async (userId) => {
    if (!userId) return;
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists() && userDoc.data().trackedPackages) {
      const trackedPackages = userDoc.data().trackedPackages;
      const packageQueries = trackedPackages.map((trackingNumber) =>
        query(
          collection(db, "packages"),
          where("trackingNumber", "==", trackingNumber)
        )
      );
      const packageDocs = await Promise.all(packageQueries.map(getDocs));
      const packagesData = packageDocs.flatMap((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setRowData(packagesData);
    } else {
      console.log("No packages tracked");
      setRowData([]);
    }
  };

  const trackPackage = async () => {
    if (!user) return;
    const q = query(
      collection(db, "packages"),
      where("trackingNumber", "==", trackingNumber)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      Modal.error({
        title: "Invalid Tracking Number",
        content: "No package associated with this tracking number.",
      });
    } else {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        trackedPackages: arrayUnion(trackingNumber),
      });

      fetchTrackedPackages(user.uid); // Refresh package grid to show the newly tracked package
      Modal.success({
        title: "Package Found",
        content: "The package has been added to your grid.",
      });
    }
    setIsTrackingModalOpen(false);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    if (value) {
      const filtered = rowData.filter((row) => {
        return Object.keys(row).some((field) => {
          // Check if the field is not null or undefined before calling toString
          return (
            row[field] !== null &&
            row[field] !== undefined &&
            row[field].toString().toLowerCase().includes(value.toLowerCase())
          );
        });
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(rowData);
    }
  };

  return (
    <div className={`ag-theme-alpine ${styles.gridContainer}`}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input.Search
            placeholder="Search packages..."
            onSearch={handleSearch}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col>
          <Button
            className={styles.actionButton}
            type="primary"
            onClick={() => setIsTrackingModalOpen(true)}
          >
            Track Package
          </Button>
        </Col>
      </Row>
      <AgGridReact
        rowData={filteredData}
        columnDefs={columns}
        domLayout="autoHeight"
        rowHeight={40}
        style={{ borderRadius: "10px", overflow: "hidden" }}
      />
      <Modal
        title="Track a Package"
        visible={isTrackingModalOpen}
        onOk={trackPackage}
        onCancel={() => setIsTrackingModalOpen(false)}
        okText="Track"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default CustomerPackagesGrid;
