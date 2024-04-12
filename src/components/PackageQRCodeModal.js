import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config"; // Adjust this import based on your file structure
import { Modal, Button, List } from "antd";
import QRCode from "qrcode.react";

const PackageQRCodeModal = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      const querySnapshot = await getDocs(collection(db, "packages"));
      const packagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPackages(packagesData);
    };

    fetchPackages();
  }, []);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPackage(null); // Reset selected package on modal close
  };

  return (
    <div>
      <Button type="primary" onClick={handleOpenModal}>
        Select Package
      </Button>
      <Modal
        title={selectedPackage ? "Package QR Code" : "Select a Package"}
        visible={isModalVisible}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedPackage ? (
          <QRCode value={selectedPackage.trackingNumber} />
        ) : (
          <List
            dataSource={packages}
            renderItem={(pkg) => (
              <List.Item
                key={pkg.id}
                actions={[
                  <Button key="select" onClick={() => handleSelectPackage(pkg)}>
                    Select
                  </Button>,
                ]}
              >
                {pkg.name}
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default PackageQRCodeModal;
