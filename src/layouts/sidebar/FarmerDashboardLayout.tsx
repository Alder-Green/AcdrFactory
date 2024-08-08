import React, { ReactNode } from 'react';
import Sidebar from './sidebar'; // Your sidebar component

type LayoutProps = {
  children: ReactNode;
};

const FarmerDashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default FarmerDashboardLayout;
