import React from "react";
import { colors, elevations } from "@dhis2/ui";

export const ToolBar = () => {
  return (
    <div
      className="fixed right-0 bottom-0 top-12 w-60"
      style={{
        boxShadow: elevations.e100,
        backgroundColor: colors.white,
        borderLeftStyle: "solid",
        borderLeftWidth: 0.7,
        borderLeftColor: colors.grey500,
      }}
    >
      Toolbar area
    </div>
  );
};
