import { colors, IconInfo16, spacers } from "@dhis2/ui";
import React from "react";
import { PaginatedFieldSection } from "./PaginatedFieldSection";

export const ProgramAttributeNode = (props: {
  hideTitle?: boolean;
  attributes: any[];
}) => {
  const { hideTitle, attributes } = props;
  return (
    <div
      style={{
        borderBottomStyle: "solid",
        borderBottomWidth: 0.7,
        borderBottomColor: colors.grey300,
      }}
    >
      <PaginatedFieldSection
        addTooltip="Add attribute"
        description={
          !hideTitle ? (
            <div
              style={{
                fontSize: 6,
                fontStyle: "italic",
                color: colors.grey600,
                marginTop: spacers.dp4,
                display: "flex",
                alignItems: "center",
                gap: spacers.dp4,
              }}
            >
              <IconInfo16 />
              <span>
                Inherited attributes are hidden and can be viewed under tracked
                entity type node
              </span>
            </div>
          ) : undefined
        }
        emptyMessage="No attributes assigned"
        fields={attributes}
        pageSize={4}
        searchPlaceholder="Search attributes"
        title="Attributes"
      />
    </div>
  );
};
