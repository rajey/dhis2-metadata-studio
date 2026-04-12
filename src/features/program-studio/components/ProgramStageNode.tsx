import { colors, elevations, spacers } from "@dhis2/ui";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import { ProgramStageItemNode } from "./ProgramStageItemNode";

export const ProgramStageNode = ({ data, isConnectable }) => {
  const { displayName } = data;

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderStyle: "solid",
        boxShadow: elevations.e400,
        borderWidth: 1,
        borderColor: colors.blue300,
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
          backgroundColor: colors.blue100,
        }}
      >
        <div
          style={{
            color: "gray",
            fontSize: 5,
          }}
        >
          Program stage
        </div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 10,
            marginBottom: 2,
            color: colors.blue900,
          }}
        >
          {displayName}
        </div>
      </div>
      <ProgramStageItemNode hideTitle programStage={data} />
    </div>
  );
};
