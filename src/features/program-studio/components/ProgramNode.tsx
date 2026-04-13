import { useDataMutation } from "@dhis2/app-service-data";
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
import { Handle, Position } from "@xyflow/react";
import React, { BaseSyntheticEvent, useMemo, useState } from "react";
import { iconUrl } from "../../../utils/asset";
import { ProgramAttributeNode } from "./ProgramAttributeNode";

const deleteProgramMutation = {
  resource: "programs",
  id: ({ id }) => id,
  type: "delete",
};

const deleteProgramStageMutation = {
  resource: "programStages",
  id: ({ id }) => id,
  type: "delete",
};

export const ProgramNode = ({ data, isConnectable }) => {
  const {
    displayName,
    onAddProgramAttribute,
    onEditProgramAttribute,
    onEditProgram,
    onRemoveProgram,
    programStages,
    programType,
    programTrackedEntityAttributes,
    trackedEntityType,
  } = data;
  const [pendingRemoval, setPendingRemoval] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [deleteProgram, { loading: removingProgram }] =
    useDataMutation(deleteProgramMutation);
  const [deleteProgramStage, { loading: removingProgramStage }] =
    useDataMutation(deleteProgramStageMutation);

  const isTrackerProgram = useMemo(() => {
    return programType === "WITH_REGISTRATION";
  }, [programType]);

  const attributes = useMemo(() => {
    return (programTrackedEntityAttributes || [])
      .slice()
      .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0))
      .map((programTrackedEntityAttribute) => {
        if (
          trackedEntityType?.trackedEntityTypeAttributes?.some(
            (trackedEntityTypeAttribute) =>
              trackedEntityTypeAttribute?.trackedEntityAttribute?.id ===
              programTrackedEntityAttribute?.trackedEntityAttribute?.id,
          )
        ) {
          return null;
        }
        return {
          ...programTrackedEntityAttribute.trackedEntityAttribute,
          description: programTrackedEntityAttribute.trackedEntityAttribute
            .description,
          mandatory: programTrackedEntityAttribute.mandatory,
          programId: data.id,
          programTrackedEntityAttributeId: programTrackedEntityAttribute.id,
          searchable: programTrackedEntityAttribute.searchable,
          sortOrder: programTrackedEntityAttribute.sortOrder ?? 1,
        };
      })
      .filter((attribute) => attribute !== null);
  }, [data.id, programTrackedEntityAttributes, trackedEntityType]);

  const programStageCount = (programStages || []).length;
  const removing = removingProgram || removingProgramStage;

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderStyle: "solid",
        boxShadow: elevations.e400,
        borderWidth: 1,
        borderColor: colors.teal500,
        borderRadius: 2,
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
          backgroundColor: colors.teal100,
        }}
      >
        <div
          style={{
            color: "gray",
            fontSize: 5,
          }}
        >
          {isTrackerProgram ? "Tracker Program" : "Event Program"}
        </div>
        <div className="flex items-center justify-between">
          <div
            className="font-medium"
            style={{
              fontSize: 10,
            }}
          >
            {displayName}
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content={`Edit ${displayName}`} placement="top">
              <button
                className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  onEditProgram?.(data);
                }}
              >
                <img className="h-[8px]" src={iconUrl("edit.svg")} alt="Edit" />
              </button>
            </Tooltip>
            <Tooltip content={`Delete ${displayName}`} placement="top">
              <button
                className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  setRemoveError(null);
                  setPendingRemoval(true);
                }}
              >
                <span
                  aria-label="Delete"
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
      </div>

      {(attributes.length > 0 || onAddProgramAttribute) && (
        <ProgramAttributeNode
          attributes={attributes}
          onAddAttribute={() => {
            onAddProgramAttribute?.({
              existingAttributeCount: (programTrackedEntityAttributes || [])
                .length,
              existingAttributeIds: (programTrackedEntityAttributes || []).map(
                (programTrackedEntityAttribute) =>
                  programTrackedEntityAttribute?.trackedEntityAttribute?.id,
              ),
              inheritedAttributeIds: (
                trackedEntityType?.trackedEntityTypeAttributes || []
              ).map(
                (trackedEntityTypeAttribute) =>
                  trackedEntityTypeAttribute?.trackedEntityAttribute?.id,
              ),
              programDisplayName: displayName,
              programId: data.id,
            });
          }}
          onEditAttribute={onEditProgramAttribute}
        />
      )}
      {pendingRemoval && (
        <Modal
          small
          onClose={() => {
            setPendingRemoval(false);
          }}
        >
          <ModalTitle>Delete program</ModalTitle>
          <ModalContent>
            Delete {displayName} and its {programStageCount} associated{" "}
            {programStageCount === 1 ? "stage" : "stages"}?
            <div
              style={{
                marginTop: spacers.dp8,
                color: colors.grey700,
                fontSize: 12,
              }}
            >
              This removes the program structure from the studio. The tracked
              entity type is not deleted here.
            </div>
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
                    for (const programStage of programStages || []) {
                      await deleteProgramStage({ id: programStage.id });
                    }

                    await deleteProgram({ id: data.id });
                    setPendingRemoval(false);
                    onRemoveProgram?.(data);
                  } catch (error) {
                    setRemoveError(
                      "The program could not be deleted with its stages. Try again.",
                    );
                  }
                }}
              >
                Delete program
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};
