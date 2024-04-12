"use client";
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./PackageGrid.module.css";
import { db } from "@/app/firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import EditPackageModal from "./EditPackageModal";
import CreatePackageModal from "./CreatePackage";
import ButtonRenderer from "./ButtonRenderer";
import { Button, Input, Row, Col, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { saveAs } from "file-saver";
import { json2csv } from "json-2-csv";
import moment from "moment";
import AdminAssignPackage from "@/components/AdminAssignPackage";
import PackageQRCodeModal from "@/components/PackageQRCodeModal";

const PackagesGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // New state for create modal visibility
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    { headerName: "ID", field: "id", flex: 1, minWidth: 100, maxWidth: 300 },
    {
      headerName: "Package Name",
      field: "name",
      flex: 1,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Description",
      field: "description",
      flex: 1,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Tracking Number",
      field: "trackingNumber",
      flex: 1,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Assigned Driver ID",
      field: "assignedDriverId",
      flex: 1,
      minWidth: 100,
      maxWidth: 300,
      cellRenderer: (params) => params.value ?? "Not Assigned",
    },
    {
      headerName: "Package Weight",
      field: "packageWeight",
      flex: 1,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Package Dimensions",
      field: "packageDimensions",
      flex: 1,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Ship Date",
      field: "shipDate",
      flex: 1,
      minWidth: 100,
      maxWidth: 300,
      cellRenderer: (params) => {
        const date = params.value?.toDate ? params.value.toDate() : null;
        return date ? dayjs(date).format("MM-DD-YYYY") : "";
      },
    },
    {
      headerName: "Delivery Date",
      field: "deliveryDate",
      flex: 1,
      minWidth: 100,
      maxWidth: 300,
      cellRenderer: (params) => {
        const date = params.value?.toDate ? params.value.toDate() : null;
        return date ? dayjs(date).format("MM-DD-YYYY") : "";
      },
    },
    {
      headerName: "Actions",
      field: "id",
      flex: 1,
      minWidth: 210, // Specific width for actions column
      maxWidth: 210,
      pinned: "right",
      lockedPinned: true,
      suppressMovable: true,
      cellRenderer: (params) => (
        <ButtonRenderer
          params={params}
          onEdit={editPackage}
          onDelete={deletePackage}
        />
      ),
    },
  ];

  const editPackage = (id) => {
    const packageData = rowData.find((p) => p.id === id);
    openEditModal(packageData);
  };

  const deletePackage = async (id) => {
    Modal.confirm({
      title: "Are you sure delete this package?",
      content: "This action cannot be undone",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No, cancel",
      onOk: async () => {
        await deletePackageFromFirestore(id);
      },
      onCancel() {
        console.log("Cancel delete");
      },
    });
  };

  const deletePackageFromFirestore = async (id) => {
    await deleteDoc(doc(db, "packages", id));
    fetchPackages();
  };

  const openEditModal = (packageData) => {
    setCurrentPackage(packageData);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentPackage(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    fetchPackages(); // Optionally fetch packages again to reflect the newly added package
  };

  const savePackage = async (id, updatedData) => {
    const dataWithFirestoreTimestamp = {
      ...updatedData,
      // Convert Moment.js dates to Firestore Timestamps
      shipDate: updatedData.shipDate
        ? Timestamp.fromDate(new Date(updatedData.shipDate))
        : null,
      deliveryDate: updatedData.deliveryDate
        ? Timestamp.fromDate(new Date(updatedData.deliveryDate))
        : null,
      packageWeight:
        typeof updatedData.packageWeight === "number"
          ? updatedData.packageWeight
          : parseFloat(updatedData.packageWeight),
    };

    const packageRef = doc(db, "packages", id);
    try {
      await updateDoc(packageRef, dataWithFirestoreTimestamp);
      console.log("Package updated successfully");
      fetchPackages();
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "packages"));
      const packagesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRowData(packagesArray);
      setFilteredData(packagesArray); // Make sure to set filteredData as well
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
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

  const exportData = async () => {
    const querySnapshot = await getDocs(collection(db, "packages"));
    const packagesArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const csvData = packagesArray.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        status: item.status,
        customerId: item.customerId,
        trackingNumber: item.trackingNumber,
        packageWeight: item.packageWeight,
        packageDimensions: item.packageDimensions,
        shipDate: item.shipDate?.toDate
          ? moment(item.shipDate.toDate()).format("MM-DD-YYYY")
          : "",
        deliveryDate: item.deliveryDate?.toDate
          ? moment(item.deliveryDate.toDate()).format("MM-DD-YYYY")
          : "",
      };
    });
    const csv = await json2csv(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "packages.csv");
  };

  return (
    <div className={`ag-theme-alpine ${styles.gridContainer}`}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input.Search
            className="search-input"
            placeholder="Search packages..."
            onSearch={handleSearch}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            className={styles.actionButton}
          >
            Add Package
          </Button>
        </Col>
        <Col>
          <Button
            className={styles.actionButton}
            type="primary"
            onClick={exportData}
          >
            Export Data
          </Button>
        </Col>
        <Col>
          <AdminAssignPackage className={styles.actionButton} />
        </Col>
        <Col>
          <PackageQRCodeModal />
        </Col>
      </Row>
      <div>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columns}
          domLayout="autoHeight"
          rowHeight={40}
          enableRangeSelection={true}
          style={{ borderRadius: "10px", overflow: "hidden" }}
        />
      </div>
      {isEditModalOpen && currentPackage && (
        <EditPackageModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          packageData={currentPackage}
          onSave={savePackage}
        />
      )}
      {isCreateModalOpen && (
        <CreatePackageModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
        />
      )}
    </div>
  );
};

export default PackagesGrid;
