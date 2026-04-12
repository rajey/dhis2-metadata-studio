import { colors, spacers, Tooltip } from "@dhis2/ui";
import React, { BaseSyntheticEvent, useState } from "react";
import { iconUrl } from "../../../utils/asset";
import { FieldItemNode } from "./FieldItemNode";

export const ProgramStageItemNode = (props: {
  hideTitle?: boolean;
  programStage: any;
}) => {
  const { hideTitle, programStage } = props;
  const [isListOpened, setIsListOpened] = useState(hideTitle);
  return (
    <div
      key={programStage.id}
      style={{
        borderTopStyle: "solid",
        borderTopWidth: 0.7,
        borderTopColor: colors.teal200,
        cursor: "pointer",
      }}
    >
      {!hideTitle && (
        <div
          style={{
            fontSize: 6,
            fontWeight: 400,
            padding: spacers.dp4,
            backgroundColor: colors.teal100,
            color: colors.teal900,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() => setIsListOpened(!isListOpened)}
        >
          <div>{programStage.displayName}</div>
          <div className="flex items-center gap-1">
            {programStage.repeatable && (
              <Tooltip content="This is repeatable stage" placement="top">
                <img
                  style={{
                    height: 6,
                  }}
                  src={iconUrl("repeatable.svg")}
                  alt="Repeatable"
                />
              </Tooltip>
            )}
            <Tooltip
              content={`Edit ${programStage.displayName}`}
              placement="top"
            >
              <button
                className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  console.log(event);
                }}
              >
                <img className="h-[8px]" src={iconUrl("edit.svg")} alt="Edit" />
              </button>
            </Tooltip>
          </div>
        </div>
      )}
      {isListOpened && (
        <div>
          <div
            className="flex items-center justify-between"
            style={{
              paddingLeft: spacers.dp4,
              paddingRight: spacers.dp4,
              paddingTop: 2,
              paddingBottom: 2,
              backgroundColor: colors.grey200,
              fontSize: 6,
              color: colors.grey800,
            }}
          >
            <div>Data elements</div>
            <Tooltip content="Add data element" placement="top">
              <button
                className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  console.log(event);
                }}
              >
                <img className="h-[10px]" src={iconUrl("add.svg")} alt="Add" />
              </button>
            </Tooltip>
          </div>
          {(programStage.programStageDataElements || []).map(
            (programStageDataElement) => {
              return (
                <FieldItemNode
                  key={programStageDataElement.dataElement?.id}
                  field={programStageDataElement.dataElement}
                />
              );
            }
          )}
        </div>
      )}
    </div>
  );
};
