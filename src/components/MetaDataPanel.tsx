import {
  colors,
  DropdownButton,
  FlyoutMenu,
  IconAdd24,
  Input,
  Menu,
  MenuItem,
  spacers,
} from "@dhis2/ui";
import React from "react";
import { MetaDataGroup } from "./MetaDataGroup";

const programQuery = {
  results: {
    resource: "programs",
    params: {
      paging: false,
      fields: ["id", "displayName"],
    },
  },
};

const dataSetQuery = {
  results: {
    resource: "dataSets",
    params: {
      paging: false,
      fields: ["id", "displayName"],
    },
  },
};

export const MetaDataPanel = (props: {
  onCreateNew?: (props: {
    programType: "WITH_REGISTRATION" | "WITHOUT_REGISTRATION";
    resource: "programs";
  }) => void;
  onSelect: (props: { id: string; resource: string }) => void;
  refreshToken?: number;
}) => {
  const { onCreateNew, onSelect, refreshToken } = props;
  return (
    <div
      className="fixed left-0 top-12 w-72 h-100 bg-white"
      style={{
        borderRightStyle: "solid",
        borderRightWidth: 0.7,
        borderRightColor: colors.grey500,
      }}
    >
      <div
        style={{
          padding: spacers.dp16,
        }}
      >
        <DropdownButton
          primary
          component={
            <FlyoutMenu>
              <MenuItem
                label="Tracker Program"
                onClick={() => {
                  onCreateNew?.({
                    programType: "WITH_REGISTRATION",
                    resource: "programs",
                  });
                }}
              />
              <MenuItem
                label="Event Program"
                onClick={() => {
                  onCreateNew?.({
                    programType: "WITHOUT_REGISTRATION",
                    resource: "programs",
                  });
                }}
              />
              <MenuItem disabled label="Data set" />
            </FlyoutMenu>
          }
          icon={<IconAdd24 />}
          name="buttonName"
          value="buttonValue"
        >
          Create new
        </DropdownButton>
        <div style={{ marginTop: spacers.dp16 }}>
          <Input onChange={() => {}} placeholder="Search" />
        </div>
      </div>
      <div
        style={{
          height: "calc(100vh - 150px)",
          overflowY: "auto",
          paddingBottom: spacers.dp24,
        }}
      >
        <Menu>
          <MetaDataGroup
            key={`programs-${refreshToken || 0}`}
            label="Programs"
            query={programQuery}
            onSelect={(props: any) => {
              onSelect(props);
            }}
          />
          <MetaDataGroup
            key={`data-sets-${refreshToken || 0}`}
            label="Data sets"
            query={dataSetQuery}
            onSelect={(props: any) => {
              onSelect(props);
            }}
          />
        </Menu>
      </div>
    </div>
  );
};
