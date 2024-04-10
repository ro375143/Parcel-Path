"use client";
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
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
import './grids.css';
import { saveAs } from 'file-saver';
import { json2csv } from 'json-2-csv';
import moment from "moment";

const PackagesGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // New state for create modal visibility
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  

  const columns = [
    { headerName: "ID", field: "id", flex: 1 },
    { headerName: "Package Name", field: "name", flex: 1 },
    { headerName: "Description", field: "description", flex: 1 },
    { headerName: "Status", field: "status", flex: 1 },
    { headerName: "Tracking Number", field: "trackingNumber", flex: 1 },
    { headerName: "Package Weight", field: "packageWeight", flex: 1 },
    { headerName: "Package Dimensions", field: "packageDimensions", flex: 1 },
    {
      headerName: "Ship Date",
      field: "shipDate",
      cellRenderer: (params) => {
        const date = params.value?.toDate ? params.value.toDate() : null;
        return date ? dayjs(date).format("MM-DD-YYYY") : ""; // Using dayjs for formatting
      },
      flex: 1,
    },
    {
      headerName: "Delivery Date",
      field: "deliveryDate",
      cellRenderer: (params) => {
        const date = params.value?.toDate ? params.value.toDate() : null;
        return date ? dayjs(date).format("MM-DD-YYYY") : "";
      },
      flex: 1,
    },

    {
      headerName: "Actions",
      field: "id",
      cellRenderer: (params) => (
        <ButtonRenderer
          params={params}
          onEdit={editPackage}
          onDelete={deletePackage}
        />
      ),
      flex: 1,
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
    console.log("Fetching packages...");
    try {
      const querySnapshot = await getDocs(collection(db, "packages"));
      const packagesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Packages fetched:", packagesArray);
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
          return row[field].toString().toLowerCase().includes(value.toLowerCase());
        });
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(rowData);
    }
  }

  const exportData  = async () => {
    const querySnapshot = await getDocs(collection(db, "packages"));
    const packagesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        shipDate: item.shipDate?.toDate ? moment(item.shipDate.toDate()).format("MM-DD-YYYY") : '',
        deliveryDate: item.deliveryDate?.toDate ? moment(item.deliveryDate.toDate()).format("MM-DD-YYYY") : '',
      };
    }
    );
    const csv = await json2csv(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'packages.csv');
  }

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
        <Input.Search className='search-input' placeholder="Search packages..." onSearch={handleSearch} value={searchValue} onChange={(e) => handleSearch(e.target.value)} />
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Add Package
          </Button>
        </Col>
        <Col>
          <Button className='action-button' type="primary" onClick={exportData} style={{margin: '20px', justifyContent: 'left', display: 'flex'}}
          >
            Export Data
          </Button>
        </Col>
      </Row>
      <div className="ag-theme-alpine" style={{ width: "100%" }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columns}
          domLayout="autoHeight"
          rowHeight={40}
          style={{ borderRadius: '10px', overflow: 'hidden' }}
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
