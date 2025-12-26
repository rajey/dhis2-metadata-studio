import {
  Button,
  colors,
  IconAdd16,
  IconInfo16,
  spacers,
  Tooltip,
} from "@dhis2/ui";
import React, { BaseSyntheticEvent } from "react";
import { FieldItemNode } from "./FieldItemNode";

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
      <div
        style={{
          fontSize: 6,
          paddingLeft: spacers.dp4,
          paddingRight: spacers.dp4,
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: colors.grey200,
          color: colors.grey800,
        }}
      >
        <div className="flex items-center justify-between">
          <div>Attributes</div>
          <Tooltip content="Add attribute" placement="top">
            <button
              className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
              onClick={(event: BaseSyntheticEvent) => {
                event.stopPropagation();
                console.log(event);
              }}
            >
              <img className="h-[10px]" src="./icons/add.svg" alt="Add" />
            </button>
          </Tooltip>
        </div>
        {!hideTitle && (
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
        )}
      </div>

      <div>
        {attributes.map((attribute) => {
          return <FieldItemNode key={attribute.id} field={attribute} />;
        })}
      </div>
    </div>
  );
};
