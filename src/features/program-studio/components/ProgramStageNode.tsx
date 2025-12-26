import { colors, spacers, Tooltip } from "@dhis2/ui";
import React, { BaseSyntheticEvent, useMemo } from "react";
import { ProgramStageItemNode } from "./ProgramStageItemNode";

export const ProgramStageNode = ({ programType, programStages }) => {
  const isTrackerProgram = useMemo(() => {
    return programType === "WITH_REGISTRATION";
  }, [programType]);
  return (
    <div>
      {isTrackerProgram && (
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
          <div>Program stages</div>
          <Tooltip content="Add program stage" placement="top">
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
      )}
      {programStages.map((programStage) => {
        return (
          <ProgramStageItemNode
            key={programStage.id}
            hideTitle={!isTrackerProgram}
            programStage={programStage}
          />
        );
      })}
    </div>
  );
};
