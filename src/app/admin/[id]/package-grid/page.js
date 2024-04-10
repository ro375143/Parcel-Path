import React from 'react';
import PackagesGrid from '@/components/PackageGrid';

const AdminPackageGrid = () => {
  return (
    <div style={{padding: '10px', margin: '5px'}}>
      <h1 style={{margin: '0', fontSize: '1rem'}}>PACKAGES</h1>
      <PackagesGrid />
    </div>
  );
}

export default AdminPackageGrid;