import React from "react";
import { colors } from "@dhis2/ui";

export const StudioPlaceholder = () => {
  return (
    <div
      style={{
        display: "flex",
        color: colors.grey600,
        backgroundColor: colors.teal100,
        height: "calc(100vh - 50px)",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
      }}
    >
      Select a program or data set from the left panel to start designing.
    </div>
  );
};
