import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config"; // Adjust this import based on your file structure
import { Modal, Button, List } from "antd";
import QRCode from "qrcode.react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

  const downloadQRCodeAsPDF = () => {
    const input = document.getElementById("qrCode"); // Ensure your QR code has this ID
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${selectedPackage?.trackingNumber || 'package'}-qr-code.pdf`);
    }).catch(err => {
        console.error('Failed to download PDF:', err);
    });
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
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
          selectedPackage && (
            <Button key="download" type="primary" onClick={downloadQRCodeAsPDF}>
              Download QR Code as PDF
            </Button>
          ),
        ]}
      >
        {selectedPackage ? (
          <div id="qrCode" style={{ textAlign: 'center' }}>
            <QRCode value={selectedPackage.trackingNumber} />
          </div>
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
