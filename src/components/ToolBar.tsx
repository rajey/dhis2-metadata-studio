import { colors, elevations } from "@dhis2/ui";
import React from "react";
import { ProgramAttributeAddPanel } from "../features/program-studio/components/ProgramAttributeAddPanel";
import { ProgramAttributeEditorPanel } from "../features/program-studio/components/ProgramAttributeEditorPanel";
import { ProgramEditorPanel } from "../features/program-studio/components/ProgramEditorPanel";
import { ProgramStageDataElementAddPanel } from "../features/program-studio/components/ProgramStageDataElementAddPanel";
import { ProgramStageDataElementEditorPanel } from "../features/program-studio/components/ProgramStageDataElementEditorPanel";
import { ProgramStageEditorPanel } from "../features/program-studio/components/ProgramStageEditorPanel";

export const ToolBar = (props: {
  addingProgramAttribute?: any | null;
  addingProgramStageDataElement?: any | null;
  editingProgram?: any | null;
  editingProgramAttribute?: any | null;
  editingProgramStageDataElement?: any | null;
  editingProgramStage?: any | null;
  onCloseProgramEditor: () => void;
  onProgramAttributeAdded: () => void;
  onProgramAttributeSaved: (programAttribute: any) => void;
  onProgramSaved: (program: any) => void;
  onProgramStageDataElementAdded: () => void;
  onProgramStageDataElementSaved: (programStageDataElement: any) => void;
  onProgramStageSaved: (programStage: any) => void;
}) => {
  const {
    addingProgramAttribute,
    addingProgramStageDataElement,
    editingProgram,
    editingProgramAttribute,
    editingProgramStageDataElement,
    editingProgramStage,
    onCloseProgramEditor,
    onProgramAttributeAdded,
    onProgramAttributeSaved,
    onProgramSaved,
    onProgramStageDataElementAdded,
    onProgramStageDataElementSaved,
    onProgramStageSaved,
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
      {addingProgramAttribute ? (
        <ProgramAttributeAddPanel
          programAttributeContext={addingProgramAttribute}
          onClose={onCloseProgramEditor}
          onAdded={onProgramAttributeAdded}
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
