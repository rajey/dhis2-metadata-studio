import { colors, IconAdd24, spacers } from "@dhis2/ui";
import { Handle, Position } from "@xyflow/react";
import React, { BaseSyntheticEvent } from "react";

export const ProgramStagePlaceholderNode = ({ data, isConnectable }) => {
  return (
    <div
      style={{
        width: 160,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: colors.blue300,
        borderRadius: 2,
        backgroundColor: colors.blue050,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <button
        className="w-full border-none bg-transparent cursor-pointer"
        style={{
          padding: spacers.dp8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: spacers.dp4,
          color: colors.blue700,
        }}
        onClick={(event: BaseSyntheticEvent) => {
          event.stopPropagation();
          console.log("Add program stage", data?.programId);
        }}
      >
        <IconAdd24 />
        <span
          style={{
            fontSize: 8,
            fontWeight: 500,
          }}
        >
          {data?.displayName || "Add program stage"}
        </span>
      </button>
    </div>
  );
};
