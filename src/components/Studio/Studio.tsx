import { colors, spacers } from "@dhis2/ui";
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
            height: "calc(100vh - 50px)",
            alignItems: "center",
            justifyContent: "center",
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
    <div className="studio-container">
      <div
        style={{
          width: 400,
          backgroundColor: colors.white,
          borderRight: "1px solid #ddd",
        }}
      >
        <MetaDataPanel
          onSelect={(selectedMetaData: any) => {
            setSelectedMetaData(selectedMetaData);
          }}
        />
      </div>
      <div className="studio-design-area">{designArea}</div>
    </div>
  );
};
