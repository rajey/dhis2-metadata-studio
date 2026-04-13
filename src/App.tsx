import "@xyflow/react/dist/style.css";
import React, { FC, useEffect, useMemo, useState } from "react";
import "./App.css";
import { MetaDataPanel, StudioPlaceholder, ToolBar } from "./components";
import { DataSetStudio, ProgramStudio } from "./features";

const MetadataStudioApp: FC = () => {
  const [selectedMetaData, setSelectedMetaData] = useState<any>();
  const [creatingProgram, setCreatingProgram] = useState<any | null>(null);
  const [editingTrackedEntityType, setEditingTrackedEntityType] = useState<
    any | null
  >(null);
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
      editingTrackedEntityType?.programId ||
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
      setEditingTrackedEntityType(null);
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
    editingTrackedEntityType?.id,
    editingTrackedEntityType?.programId,
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
              setEditingTrackedEntityType(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onEditTrackedEntityType={(trackedEntityType) => {
              setEditingTrackedEntityType(trackedEntityType);
              setEditingProgram(null);
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
              setEditingTrackedEntityType(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onEditProgramAttribute={(programAttribute) => {
              setEditingProgramAttribute(programAttribute);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingTrackedEntityType(null);
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
              setEditingTrackedEntityType(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onAddProgramStageDataElement={(programStageDataElementContext) => {
              setAddingProgramStageDataElement(programStageDataElementContext);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setEditingTrackedEntityType(null);
              setAddingProgramStage(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
            }}
            onEditProgramStageDataElement={(programStageDataElement) => {
              setEditingProgramStageDataElement(programStageDataElement);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setEditingTrackedEntityType(null);
              setAddingProgramStageDataElement(null);
              setAddingProgramStage(null);
              setEditingProgramStage(null);
            }}
            onEditProgramStage={(programStage) => {
              setEditingProgramStage(programStage);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setEditingTrackedEntityType(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
            }}
            onRemoveTrackedEntityType={() => {
              setCreatingProgram(null);
              setEditingTrackedEntityType(null);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
              setSelectedMetaData(undefined);
              setProgramRefreshToken((value) => value + 1);
            }}
            onRemoveProgram={() => {
              setCreatingProgram(null);
              setEditingTrackedEntityType(null);
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setAddingProgramStage(null);
              setAddingProgramStageDataElement(null);
              setEditingProgramStageDataElement(null);
              setEditingProgramStage(null);
              setSelectedMetaData(undefined);
              setProgramRefreshToken((value) => value + 1);
            }}
            onRemoveProgramStage={(programStage) => {
              setEditingProgram(null);
              setAddingProgramAttribute(null);
              setEditingProgramAttribute(null);
              setEditingTrackedEntityType(null);
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
        onCreateNew={(programCreateContext: any) => {
          setCreatingProgram(programCreateContext);
          setSelectedMetaData(undefined);
          setEditingTrackedEntityType(null);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
        }}
        onSelect={(selectedMetaData: any) => {
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
          setSelectedMetaData(selectedMetaData);
        }}
        refreshToken={programRefreshToken}
      />
      <div className="studio-design-area">{designArea}</div>
      <ToolBar
        addingProgramAttribute={addingProgramAttribute}
        addingProgramStage={addingProgramStage}
        addingProgramStageDataElement={addingProgramStageDataElement}
        creatingProgram={creatingProgram}
        editingProgram={editingProgram}
        editingProgramAttribute={editingProgramAttribute}
        editingProgramStageDataElement={editingProgramStageDataElement}
        editingProgramStage={editingProgramStage}
        editingTrackedEntityType={editingTrackedEntityType}
        onCloseProgramEditor={() => {
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
        }}
        onProgramAttributeAdded={() => {
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
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
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
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
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
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
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
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
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
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
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
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
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
          setEditingProgramStage(programStage);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setProgramRefreshToken((value) => value + 1);
        }}
        onProgramCreated={(program) => {
          setCreatingProgram(null);
          setEditingTrackedEntityType(null);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setSelectedMetaData({
            id: program.id,
            resource: "programs",
          });
          setProgramRefreshToken((value) => value + 1);
        }}
        onTrackedEntityTypeSaved={(trackedEntityType) => {
          setCreatingProgram(null);
          setEditingTrackedEntityType(trackedEntityType);
          setEditingProgram(null);
          setAddingProgramAttribute(null);
          setEditingProgramAttribute(null);
          setAddingProgramStage(null);
          setAddingProgramStageDataElement(null);
          setEditingProgramStageDataElement(null);
          setEditingProgramStage(null);
          setProgramRefreshToken((value) => value + 1);
        }}
      />
    </>
  );
};

export default MetadataStudioApp;
