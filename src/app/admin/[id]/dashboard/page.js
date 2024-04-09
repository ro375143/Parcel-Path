import React from "react";
import PackagesGrid from "@/components/PackageGrid";
import CreatePackage from "@/components/CreatePackage";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Packages</h1>
      <PackagesGrid />
      <CreatePackage />
    </div>
  );
};

export default AdminDashboard;
