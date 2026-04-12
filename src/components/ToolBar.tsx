import { colors, elevations } from "@dhis2/ui";
import React from "react";
import { ProgramAttributeEditorPanel } from "../features/program-studio/components/ProgramAttributeEditorPanel";
import { ProgramEditorPanel } from "../features/program-studio/components/ProgramEditorPanel";
import { ProgramStageDataElementEditorPanel } from "../features/program-studio/components/ProgramStageDataElementEditorPanel";
import { ProgramStageEditorPanel } from "../features/program-studio/components/ProgramStageEditorPanel";

export const ToolBar = (props: {
  editingProgram?: any | null;
  editingProgramAttribute?: any | null;
  editingProgramStageDataElement?: any | null;
  editingProgramStage?: any | null;
  onCloseProgramEditor: () => void;
  onProgramAttributeSaved: (programAttribute: any) => void;
  onProgramSaved: (program: any) => void;
  onProgramStageDataElementSaved: (programStageDataElement: any) => void;
  onProgramStageSaved: (programStage: any) => void;
}) => {
  const {
    editingProgram,
    editingProgramAttribute,
    editingProgramStageDataElement,
    editingProgramStage,
    onCloseProgramEditor,
    onProgramAttributeSaved,
    onProgramSaved,
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
      {editingProgramAttribute ? (
        <ProgramAttributeEditorPanel
          programAttribute={editingProgramAttribute}
          onClose={onCloseProgramEditor}
          onSaved={onProgramAttributeSaved}
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
