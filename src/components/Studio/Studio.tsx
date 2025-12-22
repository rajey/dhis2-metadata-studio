import { colors, elevations, spacers } from "@dhis2/ui";
import React, { useMemo, useState } from "react";
import { MetaDataPanel } from "../MetaDataPanel";
import { DataSetDesign, ProgramDesign } from "./components";
import "./Studio.css";

export const Studio = () => {
  const [selectedMetaData, setSelectedMetaData] = useState<any>();

  const designArea = useMemo(() => {
    if (!selectedMetaData) {
      return (
        <div
          style={{
            display: "flex",
            color: colors.grey600,
            backgroundColor: colors.teal100,
            height: "calc(100vh - 50px)",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          Select a program or data set from the left panel to start designing.
        </div>
      );
    }

    switch (selectedMetaData.resource) {
      case "programs":
        return <ProgramDesign programId={selectedMetaData.id} />;
      case "dataSets":
        return <DataSetDesign />;
      default:
        return <></>;
    }
  }, [selectedMetaData]);

  return (
    <div>
      <div
        className="fixed left-0 top-12 w-72 h-100 bg-white"
        style={{
          borderRightStyle: "solid",
          borderRightWidth: 0.7,
          borderRightColor: colors.grey500,
        }}
      >
        <MetaDataPanel
          onSelect={(selectedMetaData: any) => {
            setSelectedMetaData(selectedMetaData);
          }}
        />
      </div>
      <div className="studio-design-area">{designArea}</div>
      <div
        className="fixed right-0 bottom-0 top-12 w-60"
        style={{
          boxShadow: elevations.e100,
          backgroundColor: colors.white,
          borderLeftStyle: "solid",
          borderLeftWidth: 0.7,
          borderLeftColor: colors.grey500,
        }}
      >
        Toolbar area
      </div>
    </div>
  );
};
