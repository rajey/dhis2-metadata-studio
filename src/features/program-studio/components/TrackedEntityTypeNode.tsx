import {
  Query,
  useDataMutation,
  useDataQuery,
} from "@dhis2/app-service-data";
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

const trackedEntityTypeProgramsQuery: Query = {
  results: {
    resource: "programs",
    params: ({ trackedEntityTypeId }) => ({
      fields: ["id", "displayName"],
      filter: [`trackedEntityType.id:eq:${trackedEntityTypeId}`],
      paging: false,
    }),
  },
};

const deleteProgramMutation = {
  resource: "programs",
  id: ({ id }) => id,
  type: "delete",
};

const deleteTrackedEntityTypeMutation = {
  resource: "trackedEntityTypes",
  id: ({ id }) => id,
  type: "delete",
};

const normalizePrograms = (results: any) => {
  if (Array.isArray(results)) {
    return results;
  }

  if (Array.isArray(results?.programs)) {
    return results.programs;
  }

  return [];
};

export const TrackedEntityTypeNode = ({ data, isConnectable }) => {
  const {
    displayName,
    onAddProgramAttribute,
    onEditProgramAttribute,
    onEditTrackedEntityType,
    onRemoveTrackedEntityType,
    programDisplayName,
    programId,
    trackedEntityTypeAttributes,
    id,
  } = data;
  const [pendingRemoval, setPendingRemoval] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const { data: referencedProgramsData, loading: loadingReferencedPrograms } =
    useDataQuery(trackedEntityTypeProgramsQuery, {
      variables: {
        trackedEntityTypeId: id,
      },
    });
  const [deleteProgram, { loading: removingProgram }] =
    useDataMutation(deleteProgramMutation);
  const [deleteTrackedEntityType, { loading: removingTrackedEntityType }] =
    useDataMutation(deleteTrackedEntityTypeMutation);

  const attributes = useMemo(() => {
    return (trackedEntityTypeAttributes || [])
      .slice()
      .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0))
      .map((trackedEntityTypeAttribute, index) => ({
        ...trackedEntityTypeAttribute.trackedEntityAttribute,
        attributeContext: "trackedEntityType",
        mandatory: trackedEntityTypeAttribute.mandatory ?? false,
        programId,
        sortOrder: trackedEntityTypeAttribute.sortOrder ?? index + 1,
        trackedEntityTypeAttributeId: trackedEntityTypeAttribute.id,
        trackedEntityTypeDisplayName: displayName,
      }));
  }, [displayName, programId, trackedEntityTypeAttributes]);

  const referencedPrograms = useMemo(
    () => normalizePrograms(referencedProgramsData?.results),
    [referencedProgramsData],
  );
  const referencedProgramCount = referencedPrograms.length;
  const canRemoveTrackedEntityType =
    !loadingReferencedPrograms && referencedProgramCount <= 1;
  const removeTooltipText = loadingReferencedPrograms
    ? "Checking program usage"
    : referencedProgramCount > 1
      ? `Used by ${referencedProgramCount} programs`
      : `Delete ${displayName} and ${programDisplayName || "the linked program"}`;

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderStyle: "solid",
        boxShadow: elevations.e400,
        borderWidth: 1,
        borderColor: colors.yellow300,
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
          backgroundColor: colors.yellow100,
        }}
      >
        <div
          style={{
            color: "gray",
            fontSize: 5,
          }}
        >
          Tracked entity type
        </div>
        <div className="flex items-center justify-between">
          <div
            style={{
              fontWeight: "bold",
              fontSize: 10,
              marginBottom: 2,
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
                  onEditTrackedEntityType?.(data);
                }}
              >
                <img className="h-[8px]" src={iconUrl("edit.svg")} alt="Edit" />
              </button>
            </Tooltip>
            <Tooltip content={removeTooltipText} placement="top">
              <button
                className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canRemoveTrackedEntityType}
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  if (!canRemoveTrackedEntityType) {
                    return;
                  }
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
      </div>
      {(attributes.length > 0 || onAddProgramAttribute) && (
        <ProgramAttributeNode
          hideTitle
          attributes={attributes}
          onAddAttribute={() => {
            onAddProgramAttribute?.({
              attributeContext: "trackedEntityType",
              existingAttributeCount: (trackedEntityTypeAttributes || []).length,
              existingAttributeIds: (trackedEntityTypeAttributes || []).map(
                (trackedEntityTypeAttribute) =>
                  trackedEntityTypeAttribute?.trackedEntityAttribute?.id,
              ),
              programId,
              trackedEntityTypeDisplayName: displayName,
              trackedEntityTypeId: id,
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
          <ModalTitle>Delete tracked entity type</ModalTitle>
          <ModalContent>
            Delete {displayName} and the linked program {programDisplayName || ""}?
            <div
              style={{
                marginTop: spacers.dp8,
                color: colors.grey700,
                fontSize: 12,
              }}
            >
              This tracked entity type is assigned to one program, so both records
              will be removed together.
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
                disabled={removingProgram || removingTrackedEntityType}
                onClick={() => {
                  setPendingRemoval(false);
                }}
              >
                Cancel
              </Button>
              <Button
                destructive
                loading={removingProgram || removingTrackedEntityType}
                onClick={async () => {
                  setRemoveError(null);

                  try {
                    await deleteProgram({ id: programId });
                    await deleteTrackedEntityType({ id });
                    setPendingRemoval(false);
                    onRemoveTrackedEntityType?.(data);
                  } catch (error) {
                    setRemoveError(
                      "The tracked entity type could not be removed with its program. Try again.",
                    );
                  }
                }}
              >
                Delete both
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};
