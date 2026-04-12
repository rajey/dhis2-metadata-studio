import { colors, elevations, spacers } from "@dhis2/ui";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import { ProgramStageItemNode } from "./ProgramStageItemNode";

export const ProgramStageNode = ({ data, isConnectable }) => {
  const { displayName, programDisplayName, programType } = data;
  const isEventProgramSummary =
    programType === "WITHOUT_REGISTRATION" && Boolean(programDisplayName);
  const headerBorderColor = isEventProgramSummary
    ? colors.teal300
    : colors.blue300;
  const headerBackgroundColor = isEventProgramSummary
    ? colors.teal100
    : colors.blue100;
  const titleColor = isEventProgramSummary ? colors.teal900 : colors.blue900;

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderStyle: "solid",
        boxShadow: elevations.e400,
        borderWidth: 1,
        borderColor: headerBorderColor,
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
    </div>
  );
};
