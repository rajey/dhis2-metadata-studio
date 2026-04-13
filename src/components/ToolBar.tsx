import { colors, elevations } from "@dhis2/ui";
import React from "react";
import { ProgramAttributeAddPanel } from "../features/program-studio/components/ProgramAttributeAddPanel";
import { ProgramAttributeEditorPanel } from "../features/program-studio/components/ProgramAttributeEditorPanel";
import { ProgramCreatePanel } from "../features/program-studio/components/ProgramCreatePanel";
import { ProgramEditorPanel } from "../features/program-studio/components/ProgramEditorPanel";
import { ProgramStageAddPanel } from "../features/program-studio/components/ProgramStageAddPanel";
import { ProgramStageDataElementAddPanel } from "../features/program-studio/components/ProgramStageDataElementAddPanel";
import { ProgramStageDataElementEditorPanel } from "../features/program-studio/components/ProgramStageDataElementEditorPanel";
import { ProgramStageEditorPanel } from "../features/program-studio/components/ProgramStageEditorPanel";
import { TrackedEntityTypeEditorPanel } from "../features/program-studio/components/TrackedEntityTypeEditorPanel";

export const ToolBar = (props: {
  addingProgramAttribute?: any | null;
  addingProgramStage?: any | null;
  addingProgramStageDataElement?: any | null;
  creatingProgram?: any | null;
  editingProgram?: any | null;
  editingProgramAttribute?: any | null;
  editingProgramStageDataElement?: any | null;
  editingProgramStage?: any | null;
  editingTrackedEntityType?: any | null;
  onCloseProgramEditor: () => void;
  onProgramAttributeAdded: () => void;
  onProgramAttributeSaved: (programAttribute: any) => void;
  onProgramCreated: (program: any) => void;
  onProgramSaved: (program: any) => void;
  onProgramStageAdded: () => void;
  onProgramStageDataElementAdded: () => void;
  onProgramStageDataElementSaved: (programStageDataElement: any) => void;
  onProgramStageSaved: (programStage: any) => void;
  onTrackedEntityTypeSaved: (trackedEntityType: any) => void;
}) => {
  const {
    addingProgramAttribute,
    addingProgramStage,
    addingProgramStageDataElement,
    creatingProgram,
    editingProgram,
    editingProgramAttribute,
    editingProgramStageDataElement,
    editingProgramStage,
    editingTrackedEntityType,
    onCloseProgramEditor,
    onProgramAttributeAdded,
    onProgramAttributeSaved,
    onProgramCreated,
    onProgramSaved,
    onProgramStageAdded,
    onProgramStageDataElementAdded,
    onProgramStageDataElementSaved,
    onProgramStageSaved,
    onTrackedEntityTypeSaved,
  } = props;

  return (
    <div
      className="fixed right-0 bottom-0 top-12 w-80"
      style={{
        boxShadow: elevations.e100,
        backgroundColor: colors.white,
        borderLeftStyle: "solid",
        borderLeftWidth: 0.7,
        borderLeftColor: colors.grey500,
      }}
    >
      {creatingProgram ? (
        <ProgramCreatePanel
          onClose={onCloseProgramEditor}
          onCreated={onProgramCreated}
          programCreateContext={creatingProgram}
        />
      ) : addingProgramAttribute ? (
        <ProgramAttributeAddPanel
          programAttributeContext={addingProgramAttribute}
          onClose={onCloseProgramEditor}
          onAdded={onProgramAttributeAdded}
        />
      ) : addingProgramStage ? (
        <ProgramStageAddPanel
          onClose={onCloseProgramEditor}
          onAdded={onProgramStageAdded}
          programStageContext={addingProgramStage}
        />
      ) : editingProgramAttribute ? (
        <ProgramAttributeEditorPanel
          programAttribute={editingProgramAttribute}
          onClose={onCloseProgramEditor}
          onSaved={onProgramAttributeSaved}
        />
      ) : addingProgramStageDataElement ? (
        <ProgramStageDataElementAddPanel
          programStageDataElementContext={addingProgramStageDataElement}
          onClose={onCloseProgramEditor}
          onAdded={onProgramStageDataElementAdded}
        />
      ) : editingProgramStageDataElement ? (
        <ProgramStageDataElementEditorPanel
          programStageDataElement={editingProgramStageDataElement}
          onClose={onCloseProgramEditor}
          onSaved={onProgramStageDataElementSaved}
        />
      ) : editingProgramStage ? (
        <ProgramStageEditorPanel
          programStage={editingProgramStage}
          onClose={onCloseProgramEditor}
          onSaved={onProgramStageSaved}
        />
      ) : editingTrackedEntityType ? (
        <TrackedEntityTypeEditorPanel
          onClose={onCloseProgramEditor}
          onSaved={onTrackedEntityTypeSaved}
          trackedEntityType={editingTrackedEntityType}
        />
      ) : (
        <ProgramEditorPanel
          program={editingProgram}
          onClose={onCloseProgramEditor}
          onSaved={onProgramSaved}
        />
      )}
    </div>
  );
};
