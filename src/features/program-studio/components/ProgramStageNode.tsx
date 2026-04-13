import {
  Button,
  ButtonStrip,
  colors,
  elevations,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  spacers,
  Tooltip,
} from "@dhis2/ui";
import { IconDelete16 } from "@dhis2/ui-icons";
import { useDataMutation } from "@dhis2/app-service-data";
import { Handle, Position } from "@xyflow/react";
import React, { BaseSyntheticEvent, useState } from "react";
import { iconUrl } from "../../../utils/asset";
import { ProgramStageItemNode } from "./ProgramStageItemNode";

const deleteProgramStageMutation = {
  resource: "programStages",
  id: ({ id }) => id,
  type: "delete",
};

const deleteProgramMutation = {
  resource: "programs",
  id: ({ id }) => id,
  type: "delete",
};

export const ProgramStageNode = ({ data, isConnectable, selected }) => {
  const {
    displayName,
    isFocused,
    onEditProgram,
    onEditProgramStage,
    onInspectNode,
    onRemoveProgram,
    onRemoveProgramStage,
    program,
    programDisplayName,
    programType,
  } = data;
  const [pendingRemoval, setPendingRemoval] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [deleteProgramStage, { loading: removingProgramStage }] =
    useDataMutation(deleteProgramStageMutation);
  const [deleteProgram, { loading: removingProgram }] =
    useDataMutation(deleteProgramMutation);
  const isEventProgramSummary =
    programType === "WITHOUT_REGISTRATION" && Boolean(programDisplayName);
  const headerBorderColor = isEventProgramSummary
    ? colors.teal300
    : colors.blue300;
  const headerBackgroundColor = isEventProgramSummary
    ? colors.teal100
    : colors.blue100;
  const titleColor = isEventProgramSummary ? colors.teal900 : colors.blue900;
  const programStageCount = (program?.programStages || []).length;
  const removing = removingProgramStage || removingProgram;
  const isSelected = selected || isFocused;

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderStyle: "solid",
        boxShadow: elevations.e400,
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? titleColor : headerBorderColor,
        borderRadius: 2,
        outline: isSelected ? `2px solid ${headerBorderColor}` : "none",
        outlineOffset: 2,
        width: 160,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <div
        style={{
          padding: spacers.dp4,
          borderBottomStyle: "solid",
          borderBottomWidth: 0.7,
          borderBottomColor: colors.grey300,
          backgroundColor: headerBackgroundColor,
        }}
      >
        <div
          style={{
            color: "gray",
            fontSize: 5,
          }}
        >
          {isEventProgramSummary ? "Event program" : "Program stage"}
        </div>
        <div className="flex items-center justify-between">
          <div
            style={{
              fontWeight: "bold",
              fontSize: 10,
              marginBottom: 2,
              color: titleColor,
            }}
          >
            {isEventProgramSummary ? programDisplayName : displayName}
          </div>
          <div className="flex items-center gap-1">
            {isEventProgramSummary && (
              <Tooltip content={`Edit ${programDisplayName}`} placement="top">
                <button
                  className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
                  onClick={(event: BaseSyntheticEvent) => {
                    event.stopPropagation();
                    onInspectNode?.();
                    onEditProgram?.(program);
                  }}
                >
                  <img className="h-[8px]" src={iconUrl("edit.svg")} alt="Edit" />
                </button>
              </Tooltip>
            )}
            <Tooltip content={`Edit ${displayName}`} placement="top">
              <button
                className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  onInspectNode?.();
                  onEditProgramStage?.(data);
                }}
              >
                <img className="h-[8px]" src={iconUrl("edit.svg")} alt="Edit" />
              </button>
            </Tooltip>
            <Tooltip
              content={
                isEventProgramSummary
                  ? `Delete ${programDisplayName}`
                  : `Remove ${displayName}`
              }
              placement="top"
            >
              <button
                className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  onInspectNode?.();
                  setRemoveError(null);
                  setPendingRemoval(true);
                }}
              >
                <span
                  aria-label="Remove"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.grey700,
                  }}
                >
                  <IconDelete16 />
                </span>
              </button>
            </Tooltip>
          </div>
        </div>
        {isEventProgramSummary && (
          <div
            style={{
              fontSize: 6,
              color: colors.teal800,
            }}
          >
            Stage: {displayName}
          </div>
        )}
      </div>
      <ProgramStageItemNode hideTitle programStage={data} />
      {pendingRemoval && (
        <Modal
          small
          onClose={() => {
            setPendingRemoval(false);
          }}
        >
          <ModalTitle>
            {isEventProgramSummary ? "Delete program" : "Remove program stage"}
          </ModalTitle>
          <ModalContent>
            {isEventProgramSummary
              ? `Delete ${programDisplayName || program?.displayName || "this program"} and its ${programStageCount} associated ${programStageCount === 1 ? "stage" : "stages"}?`
              : `Remove ${displayName} from ${programDisplayName || program?.displayName || "this program"}?`}
            {removeError && (
              <div
                style={{
                  marginTop: spacers.dp12,
                  color: colors.red700,
                  fontSize: 12,
                }}
              >
                {removeError}
              </div>
            )}
          </ModalContent>
          <ModalActions>
            <ButtonStrip end>
              <Button
                secondary
                disabled={removing}
                onClick={() => {
                  setPendingRemoval(false);
                }}
              >
                Cancel
              </Button>
              <Button
                destructive
                loading={removing}
                onClick={async () => {
                  setRemoveError(null);

                  try {
                    if (isEventProgramSummary) {
                      for (const programStage of program?.programStages || []) {
                        await deleteProgramStage({ id: programStage.id });
                      }
                      await deleteProgram({ id: program?.id });
                      onRemoveProgram?.(program);
                    } else {
                      await deleteProgramStage({ id: data.id });
                      onRemoveProgramStage?.(data);
                    }
                    setPendingRemoval(false);
                  } catch (error) {
                    setRemoveError(
                      isEventProgramSummary
                        ? "The program could not be deleted with its stages. Try again."
                        : "The program stage could not be removed. Try again.",
                    );
                  }
                }}
              >
                {isEventProgramSummary ? "Delete program" : "Remove"}
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};
