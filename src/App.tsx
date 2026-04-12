import "@xyflow/react/dist/style.css";
import React, { FC, useEffect, useMemo, useState } from "react";
import "./App.css";
import { MetaDataPanel, StudioPlaceholder, ToolBar } from "./components";
import { DataSetStudio, ProgramStudio } from "./features";

const MetadataStudioApp: FC = () => {
  const [selectedMetaData, setSelectedMetaData] = useState<any>();
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [editingProgramAttribute, setEditingProgramAttribute] = useState<
    any | null
  >(null);
  const [editingProgramStageDataElement, setEditingProgramStageDataElement] =
    useState<any | null>(null);
  const [editingProgramStage, setEditingProgramStage] = useState<any | null>(
    null
  );
  const [programRefreshToken, setProgramRefreshToken] = useState(0);

  useEffect(() => {
    const editingProgramId =
      editingProgram?.id ||
      editingProgramStage?.program?.id ||
      editingProgramStageDataElement?.programId ||
      editingProgramAttribute?.programId ||
      null;

    if (
      !selectedMetaData ||
      selectedMetaData.resource !== "programs" ||
      (editingProgramId && selectedMetaData.id !== editingProgramId)
    ) {
      setEditingProgram(null);
      setEditingProgramAttribute(null);
      setEditingProgramStageDataElement(null);
      setEditingProgramStage(null);
    }
  }, [
    editingProgram?.id,
    editingProgramAttribute?.id,
    editingProgramAttribute?.programId,
    editingProgramStageDataElement?.id,
    editingProgramStageDataElement?.programId,
    editingProgramStage?.id,
    editingProgramStage?.program?.id,
    selectedMetaData,
  ]);

  const designArea = useMemo(() => {
    if (!selectedMetaData) {
      return <StudioPlaceholder />;
    }
    switch (selectedMetaData.resource) {
      case "programs":
        return (
          <ProgramStudio
            onEditProgram={(program) => {
              setEditingProgram(program);
              setEditingProgramAttribute(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onEditProgramAttribute={(programAttribute) => {
              setEditingProgramAttribute(programAttribute);
              setEditingProgram(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onEditProgramStageDataElement={(programStageDataElement) => {
              setEditingProgramStageDataElement(programStageDataElement);
              setEditingProgram(null);
              setEditingProgramAttribute(null);
              setEditingProgramStage(null);
            }}
            onEditProgramStage={(programStage) => {
              setEditingProgramStage(programStage);
              setEditingProgram(null);
              setEditingProgramAttribute(null);
              setEditingProgramStageDataElement(null);
            }}
            programId={selectedMetaData.id}
            refreshToken={programRefreshToken}
          />
        );
      case "dataSets":
        return <DataSetStudio />;
      default:
        return <></>;
    }
  }, [programRefreshToken, selectedMetaData]);

  return (
    <>
      <MetaDataPanel
        onSelect={(selectedMetaData: any) => {
          setSelectedMetaData(selectedMetaData);
        }}
      />
      <div className="studio-design-area">{designArea}</div>
      <ToolBar
        editingProgram={editingProgram}
        editingProgramAttribute={editingProgramAttribute}
        editingProgramStageDataElement={editingProgramStageDataElement}
        editingProgramStage={editingProgramStage}
        onCloseProgramEditor={() => {
          setEditingProgram(null);
          setEditingProgramAttribute(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
        }}
        onProgramSaved={(program) => {
          setEditingProgram(program);
          setEditingProgramAttribute(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramAttributeSaved={(programAttribute) => {
          setEditingProgramAttribute(programAttribute);
          setEditingProgram(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramStageDataElementSaved={(programStageDataElement) => {
          setEditingProgramStageDataElement(programStageDataElement);
          setEditingProgram(null);
          setEditingProgramAttribute(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramStageSaved={(programStage) => {
          setEditingProgramStage(programStage);
          setEditingProgram(null);
          setEditingProgramAttribute(null);
          setEditingProgramStageDataElement(null);
          setProgramRefreshToken((value) => value + 1);
        }}
      />
    </>
  );
};

export default MetadataStudioApp;
