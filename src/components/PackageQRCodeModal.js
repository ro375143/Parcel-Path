import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config"; // Adjust this import based on your file structure
import { Modal, Select } from "antd";
import QRCode from "qrcode.react";

const { Option } = Select;

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

  const handleSelectChange = (value) => {
    setSelectedPackage(packages.find((pkg) => pkg.id === value));
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  return (
    <div>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a package"
        optionFilterProp="children"
        onChange={handleSelectChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {packages.map((pkg) => (
          <Option key={pkg.id} value={pkg.id}>
            {pkg.name}
          </Option>
        ))}
      </Select>
      <Modal
        title="Package QR Code"
        visible={isModalVisible}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
      >
        {selectedPackage && <QRCode value={selectedPackage.trackingNumber} />}
      </Modal>
    </div>
  );
};

export default PackageQRCodeModal;
