import "@xyflow/react/dist/style.css";
import React, { FC, useMemo, useState } from "react";
import "./App.css";
import { MetaDataPanel, StudioPlaceholder, ToolBar } from "./components";
import { DataSetStudio, ProgramStudio } from "./features";

const MetadataStudioApp: FC = () => {
  const [selectedMetaData, setSelectedMetaData] = useState<any>();

  const designArea = useMemo(() => {
    if (!selectedMetaData) {
      return <StudioPlaceholder />;
    }
    switch (selectedMetaData.resource) {
      case "programs":
        return <ProgramStudio programId={selectedMetaData.id} />;
      case "dataSets":
        return <DataSetStudio />;
      default:
        return <></>;
    }
  }, [selectedMetaData]);

  return (
    <>
      <MetaDataPanel
        onSelect={(selectedMetaData: any) => {
          setSelectedMetaData(selectedMetaData);
        }}
      />
      <div className="studio-design-area">{designArea}</div>
      <ToolBar />
    </>
  );
};

export default MetadataStudioApp;
