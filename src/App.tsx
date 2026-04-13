import "@xyflow/react/dist/style.css";
import React, { FC, useEffect, useMemo, useState } from "react";
import "./App.css";
import { MetaDataPanel, StudioPlaceholder, ToolBar } from "./components";
import { DataSetStudio, ProgramStudio } from "./features";

const MetadataStudioApp: FC = () => {
  const [selectedMetaData, setSelectedMetaData] = useState<any>();
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [addingProgramAttribute, setAddingProgramAttribute] = useState<
    any | null
  >(null);
  const [editingProgramAttribute, setEditingProgramAttribute] = useState<
    any | null
  >(null);
  const [addingProgramStageDataElement, setAddingProgramStageDataElement] =
    useState<any | null>(null);
  const [editingProgramStageDataElement, setEditingProgramStageDataElement] =
    useState<any | null>(null);
  const [addingProgramStage, setAddingProgramStage] = useState<any | null>(
    null,
  );
  const [editingProgramStage, setEditingProgramStage] = useState<any | null>(
    null
  );
  const [programRefreshToken, setProgramRefreshToken] = useState(0);

  useEffect(() => {
    const editingProgramId =
      editingProgram?.id ||
      addingProgramAttribute?.programId ||
      addingProgramStage?.programId ||
      editingProgramStage?.program?.id ||
      addingProgramStageDataElement?.programId ||
      editingProgramStageDataElement?.programId ||
      editingProgramAttribute?.programId ||
      null;

    if (
      !selectedMetaData ||
      selectedMetaData.resource !== "programs" ||
      (editingProgramId && selectedMetaData.id !== editingProgramId)
    ) {
      setEditingProgram(null);
      setAddingProgramAttribute(null);
      setEditingProgramAttribute(null);
      setAddingProgramStageDataElement(null);
      setEditingProgramStageDataElement(null);
      setAddingProgramStage(null);
      setEditingProgramStage(null);
    }
  }, [
    addingProgramAttribute?.programId,
    addingProgramStage?.programId,
    addingProgramStageDataElement?.programId,
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
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onAddProgramAttribute={(programAttributeContext) => {
              setAddingProgramAttribute(programAttributeContext);
              setEditingProgram(null);
              setEditingProgramAttribute(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onEditProgramAttribute={(programAttribute) => {
              setEditingProgramAttribute(programAttribute);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onAddProgramStage={(programStageContext) => {
              setAddingProgramStage(programStageContext);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onAddProgramStageDataElement={(programStageDataElementContext) => {
              setAddingProgramStageDataElement(programStageDataElementContext);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setAddingProgramStage(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onEditProgramStageDataElement={(programStageDataElement) => {
              setEditingProgramStageDataElement(programStageDataElement);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setAddingProgramStageDataElement(null);
              setAddingProgramStage(null);
              setEditingProgramStage(null);
            }}
            onEditProgramStage={(programStage) => {
              setEditingProgramStage(programStage);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
            }}
            onRemoveProgramStage={(programStage) => {
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              if (editingProgramStage?.id === programStage?.id) {
                setEditingProgramStage(null);
              }
              setProgramRefreshToken((value) => value + 1);
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
        addingProgramAttribute={addingProgramAttribute}
        addingProgramStage={addingProgramStage}
        addingProgramStageDataElement={addingProgramStageDataElement}
        editingProgram={editingProgram}
        editingProgramAttribute={editingProgramAttribute}
        editingProgramStageDataElement={editingProgramStageDataElement}
        editingProgramStage={editingProgramStage}
        onCloseProgramEditor={() => {
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
        }}
        onProgramAttributeAdded={() => {
          setAddingProgramAttribute(null);
          setEditingProgram(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramSaved={(program) => {
          setEditingProgram(program);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramAttributeSaved={(programAttribute) => {
          setEditingProgramAttribute(programAttribute);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramStageAdded={() => {
          setAddingProgramStage(null);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramStageDataElementAdded={() => {
          setAddingProgramStageDataElement(null);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramStageDataElementSaved={(programStageDataElement) => {
          setEditingProgramStageDataElement(programStageDataElement);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramStageSaved={(programStage) => {
          setEditingProgramStage(programStage);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setProgramRefreshToken((value) => value + 1);
        }}
      />
    </>
  );
};

export default MetadataStudioApp;
