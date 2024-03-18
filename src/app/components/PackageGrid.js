'use client';
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import EditPackageModal from './EditPackageModal';
import ButtonRenderer from './ButtonRenderer';
import { Button, Input, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const PackagesGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);

  const columns = [
    { headerName: "ID", field: "id", flex: 1 },
    { headerName: "Package Name", field: "name", flex: 1 },
    { headerName: "Description", field: "description", flex: 1 },
    { headerName: "Status", field: "status", flex: 1},
    { headerName: "Customer Id", field: "customerId", flex: 1},
    { headerName: "Tracking Number", field: "trackingNumber", flex: 1},
    { headerName: "Package Weight (lbs)", field: "packageWeight", flex: 1},
    { headerName: "Package Dimensions (ft)", field: "packageDimensions", flex: 1},
    {
      headerName: "Ship Date", 
      field: "shipDate",
      cellRenderer: (params) => {
        const date = params.value?.toDate ? params.value.toDate() : null;
        return date ? date.toLocaleDateString() : '';
      },
      flex: 1
    },
    
    { headerName: "Delivery Date", field: "deliveryDate",
    cellRenderer: (params) => {
      const date = params.value?.toDate ? params.value.toDate() : null;
      return date ? date.toLocaleDateString() : '';
    },
    flex: 1},
    // add other fields
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
      flex: 1

    }    
  ];

  const editPackage = (id) => {
    const packageData = rowData.find(p => p.id === id);
    openEditModal(packageData);
  };

  const deletePackage = async (id) => {
    if (confirm('Are you sure you want to delete this package?')) {
      await deletePackageFromFirestore(id);
    }
  };

  const updatePackageInFirestore = async (id, newData) => {
    const packageRef = doc(db, "packages", id);
    await updateDoc(packageRef, newData);
    refreshData();
  };

  const deletePackageFromFirestore = async (id) => {
    await deleteDoc(doc(db, "packages", id));
    refreshData();
  };
  
  const openEditModal = (packageData) => {
    setCurrentPackage(packageData);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentPackage(null);
  };

  const savePackage = async (id, updatedData) => {
    const packageRef = doc(db, "packages", id);
    await updateDoc(packageRef, updatedData);
    fetchPackages();
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const querySnapshot = await getDocs(collection(db, "packages"));
    const packagesArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRowData(packagesArray);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input.Search placeholder="Search packages..." onSearch={value => console.log(value)} enterButton />
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log('Add new package')}>
            Add Package
          </Button>
        </Col>
      </Row>
      <div className="ag-theme-alpine" style={{ width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          domLayout='autoHeight'
        />
      </div>
      {isModalOpen && currentPackage && (
        <EditPackageModal
          isOpen={isModalOpen}
          onClose={closeEditModal}
          packageData={currentPackage}
          onSave={savePackage}
        />
      )}
    </div>
  );
};

export default PackagesGrid;
