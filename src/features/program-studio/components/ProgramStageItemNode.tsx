import { colors, spacers, Tooltip } from "@dhis2/ui";
import React, { BaseSyntheticEvent, useMemo, useState } from "react";
import { iconUrl } from "../../../utils/asset";
import { PaginatedFieldSection } from "./PaginatedFieldSection";

export const ProgramStageItemNode = (props: {
  defaultExpanded?: boolean;
  hideTitle?: boolean;
  programStage: any;
}) => {
  const { defaultExpanded, hideTitle, programStage } = props;
  const [isListOpened, setIsListOpened] = useState(
    defaultExpanded ?? hideTitle
  );
  const dataElements = useMemo(() => {
    return (programStage.programStageDataElements || []).map(
      (programStageDataElement) => programStageDataElement.dataElement
    );
  }, [programStage.programStageDataElements]);

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
        <PaginatedFieldSection
          addTooltip="Add data element"
          emptyMessage="No data elements assigned"
          fields={dataElements}
          pageSize={4}
          resetKey={programStage.id}
          searchPlaceholder="Search data elements"
          title="Data elements"
        />
      )}
    </div>
  );
};
