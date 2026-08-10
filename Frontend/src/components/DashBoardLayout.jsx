import Sidenav from "./Sidenav";
import "./DashboardLayout.css";
import React from "react";

const DashBoardLayout = ({ children }) => {
  return (
    <div className="flex gap-4">
      <Sidenav />
      <div className="layout-main">{children}</div>
    </div>
  );
};

export default DashBoardLayout;
