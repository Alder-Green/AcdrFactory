import React, { ReactNode } from 'react';
import Sidebar from './_default'; // Your sidebar component

type LayoutProps = {
  children: ReactNode;
};

const VVBDashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default VVBDashboardLayout;
