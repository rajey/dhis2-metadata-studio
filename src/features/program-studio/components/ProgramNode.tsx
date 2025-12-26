import { colors, elevations, spacers, Tooltip } from "@dhis2/ui";
import { Handle, Position } from "@xyflow/react";
import React, { BaseSyntheticEvent, useMemo } from "react";
import { ProgramAttributeNode } from "./ProgramAttributeNode";
import { ProgramStageNode } from "./ProgramStageNode";

export const ProgramNode = ({ data, isConnectable }) => {
  const {
    displayName,
    programType,
    programTrackedEntityAttributes,
    programStages,
    trackedEntityType,
  } = data;

  const isTrackerProgram = useMemo(() => {
    return programType === "WITH_REGISTRATION";
  }, [programType]);

  const attributes = useMemo(() => {
    return (programTrackedEntityAttributes || [])
      .map((programTrackedEntityAttribute) => {
        if (
          trackedEntityType.trackedEntityTypeAttributes?.some(
            (trackedEntityTypeAttribute) =>
              trackedEntityTypeAttribute?.trackedEntityAttribute?.id ===
              programTrackedEntityAttribute?.trackedEntityAttribute?.id
          )
        ) {
          return null;
        }
        return programTrackedEntityAttribute.trackedEntityAttribute;
      })
      .filter((attribute) => attribute !== null);
  }, [programTrackedEntityAttributes]);

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
          <Tooltip content={`Edit ${displayName}`} placement="top">
            <button
              className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
              onClick={(event: BaseSyntheticEvent) => {
                event.stopPropagation();
                console.log(event);
              }}
            >
              <img className="h-[8px]" src="./icons/edit.svg" alt="Edit" />
            </button>
          </Tooltip>
        </div>
      </div>

      {attributes.length > 0 && (
        <ProgramAttributeNode attributes={attributes} />
      )}

      <ProgramStageNode
        programType={programType}
        programStages={programStages}
      />
    </div>
  );
};
