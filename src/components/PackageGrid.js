"use client";
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./PackageGrid.module.css";
import { db, auth } from "@/app/firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
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
import { onAuthStateChanged } from "firebase/auth";
import {
  GoogleMap,
  LoadScript,
  Polyline,
  Marker,
} from "@react-google-maps/api";

const PackagesGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // New state for create modal visibility
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userRole, setRole] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

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
      minWidth: 260, // Specific width for actions column
      maxWidth: 260,
      pinned: "right",
      lockedPinned: true,
      suppressMovable: true,
      cellRenderer: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ButtonRenderer
            params={params}
            onEdit={editPackage}
            onDelete={deletePackage}
            userRole={userRole}
            viewLocation={viewLocation}
          />
        </div>
      ),
    },
  ];
  const viewLocation = async (rowData) => {
    try {
      const packageDocRef = doc(db, "packages", rowData.id);
      const packageDocSnap = await getDoc(packageDocRef);

      if (packageDocSnap.exists()) {
        const location = packageDocSnap.data().location;

        const cityStatePromises = location.map((loc) =>
          getCityState(loc.geopoint?.latitude, loc.geopoint?.longitude)
        );

        Promise.all(cityStatePromises)
          .then((cityStateArray) => {
            const locationDataWithCityState = location.map((loc, index) => ({
              ...loc,
              cityState: cityStateArray[index],
            }));
            setLocationData(locationDataWithCityState);
          })
          .catch((error) => {
            console.error("Error fetching city and state information:", error);
            setLocationData(null);
          });

        setIsLocationModalOpen(true);
      } else {
        console.log("Package document does not exist");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };
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
  const fetchRole = async (userId) => {
    const uid = userId.uid;
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      setRole(userDoc.data().role);
    }
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
  function getCityState(lat, lng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const components = data.results[0].address_components;
          const city = components.find((component) =>
            component.types.includes("locality")
          );

          const state = components.find((component) =>
            component.types.includes("administrative_area_level_1")
          );

          if (city && state) {
            return `${city.long_name}, ${state.short_name}`;
          } else {
            return null;
          }
        } else {
          console.error("Unable to retrieve city and state information.");
          return null;
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return null;
      });
  }
  useEffect(() => {
    fetchPackages();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchRole(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (locationData) {
      locationData.forEach((location) => {
        getCityState(location.geopoint?.latitude, location.geopoint?.longitude);
      });
    }
  }, [locationData]);

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
    <div>
      <div className={`ag-theme-alpine ${styles.gridContainer}`}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Input.Search
              className={styles.searchButton} // Apply the same class as buttons
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
      <Modal
        title={
          <div
            style={{
              backgroundColor: "#154734",
              color: "white",
              padding: "10px 15px",
              borderRadius: "15px",
            }}
          >
            TRACKING PACKAGE
          </div>
        }
        open={isLocationModalOpen}
        onCancel={() => setIsLocationModalOpen(false)}
        footer={null}
        width={800} // Adjust width to fit the map
        closeIcon={
          <span
            style={{
              backgroundColor: "white",
              borderRadius: "2%",
              position: "relative",
              top: "13px",
              borderRadius: "12px",
              padding: "1px 13.5px",
              right: "20px",
            }}
          >
            X
          </span>
        }
      >
        {locationData && (
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <ul>
                {locationData.map((location, index) => (
                  <li key={index}>
                    <strong>
                      Timestamp: {new Date(location.timeStamp).toLocaleString()}
                    </strong>
                    <p>
                      Latitude: {location.geopoint.latitude.toFixed(7)},
                      Longitude: {location.geopoint.longitude.toFixed(7)}
                    </p>
                    {location.cityState && (
                      <p>City, State: {location.cityState}</p>
                    )}
                    <p>Status: {location.status}</p>
                  </li>
                ))}
              </ul>
            </Col>
            <Col span={12}>
              <LoadScript googleMapsApiKey={apiKey}>
                <div style={{ borderRadius: "10px", overflow: "hidden" }}>
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    center={
                      locationData.length > 0
                        ? {
                            lat: locationData[locationData.length - 1].geopoint
                              .latitude,
                            lng: locationData[locationData.length - 1].geopoint
                              .longitude,
                          }
                        : { lat: 0, lng: 0 }
                    }
                    zoom={10}
                  >
                    <Polyline
                      path={locationData.map((loc) => ({
                        lat: loc.geopoint.latitude,
                        lng: loc.geopoint.longitude,
                      }))}
                      options={{
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#FF0000",
                        fillOpacity: 0.35,
                      }}
                    />
                    {locationData && (
                      <Marker
                        position={{
                          lat: locationData[locationData.length - 1].geopoint
                            .latitude,
                          lng: locationData[locationData.length - 1].geopoint
                            .longitude,
                        }}
                      />
                    )}
                  </GoogleMap>
                </div>
              </LoadScript>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default PackagesGrid;
