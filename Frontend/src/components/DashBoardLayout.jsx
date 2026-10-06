import Sidenav from "./Sidenav";
import "./DashboardLayout.css";
import React, { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { useRecoilCallback } from "recoil";
import {
  cutDataState,
  unitDataState,
  attributeDataState,
  attributeValueDataState,
  transportDataState,
  paymentModeState,
  supplierpaymentDataState,
  customerpaymentDataState,
  customerledgerDataState,
  supplierledgerDataState,
  qualityDataState,
  designDataState,
  feeltypeDataState,
  finishtypeDataState,
  weaveDataState,
  widthDataState,
} from "../store";

const DashBoardLayout = ({ children }) => {
  const prewarmMasterData = useRecoilCallback(({ snapshot }) => () => {
    const atomsToPrewarm = [
      cutDataState,
      unitDataState,
      attributeDataState,
      attributeValueDataState,
      transportDataState,
      paymentModeState,
      supplierpaymentDataState,
      customerpaymentDataState,
      customerledgerDataState,
      supplierledgerDataState,
      qualityDataState,
      designDataState,
      feeltypeDataState,
      finishtypeDataState,
      weaveDataState,
      widthDataState,
    ];
    atomsToPrewarm.forEach((atom) => {
      snapshot.getPromise(atom).catch(() => {});
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      prewarmMasterData();
    }, 150);
    return () => clearTimeout(timer);
  }, [prewarmMasterData]);

  return (
    <div className="flex gap-4">
      <Sidenav />
      <div className="layout-main">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[70vh]">
              <Spinner size="lg" color="primary" label="Loading..." />
            </div>
          }
        >
          {children || <Outlet />}
        </Suspense>
      </div>
    </div>
  );
};

export default DashBoardLayout;

