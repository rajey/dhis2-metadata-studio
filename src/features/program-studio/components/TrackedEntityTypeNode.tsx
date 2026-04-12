import { colors, elevations, spacers } from "@dhis2/ui";
import { Handle, Position } from "@xyflow/react";
import React, { useMemo } from "react";
import { ProgramAttributeNode } from "./ProgramAttributeNode";

export const TrackedEntityTypeNode = ({ data, isConnectable }) => {
  const {
    displayName,
    onEditProgramAttribute,
    programId,
    trackedEntityTypeAttributes,
  } = data;

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
        <div
          style={{
            fontWeight: "bold",
            fontSize: 10,
            marginBottom: 2,
          }}
        >
          {displayName}
        </div>
      </div>
      {attributes.length > 0 && (
        <ProgramAttributeNode
          hideTitle
          attributes={attributes}
          onEditAttribute={onEditProgramAttribute}
        />
      )}
    </div>
  );
};
