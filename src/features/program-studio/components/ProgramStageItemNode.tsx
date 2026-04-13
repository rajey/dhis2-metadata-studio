import { colors, spacers, Tooltip } from "@dhis2/ui";
import React, { BaseSyntheticEvent, useMemo, useState } from "react";
import { iconUrl } from "../../../utils/asset";
import { ProgramStageDataElementNode } from "./ProgramStageDataElementNode";

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
    return (programStage.programStageDataElements || [])
      .slice()
      .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0))
      .map((programStageDataElement) => ({
        ...programStageDataElement.dataElement,
        compulsory: programStageDataElement.compulsory ?? false,
        programId: programStage.program?.id,
        programStageDataElementId: programStageDataElement.id,
        programStageId: programStage.id,
        sortOrder: programStageDataElement.sortOrder ?? 1,
      }));
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
        <ProgramStageDataElementNode
          dataElements={dataElements}
          onAddDataElement={() => {
            programStage.onAddProgramStageDataElement?.({
              existingDataElementCount: (
                programStage.programStageDataElements || []
              ).length,
              existingDataElementIds: (
                programStage.programStageDataElements || []
              ).map(
                (programStageDataElement) =>
                  programStageDataElement?.dataElement?.id,
              ),
              programDisplayName: programStage.programDisplayName,
              programId: programStage.program?.id,
              programStageDisplayName: programStage.displayName,
              programStageId: programStage.id,
            });
          }}
          onEditDataElement={programStage.onEditProgramStageDataElement}
        />
      )}
    </div>
  );
};
