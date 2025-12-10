import {
  DropdownButton,
  FlyoutMenu,
  IconAdd24,
  Input,
  Menu,
  MenuItem,
  spacers,
} from "@dhis2/ui";
import React from "react";
import { MetaDataGroup } from "./components";
import "./MetaDataPanel.css";

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
  onSelect: (props: { id: string; resource: string }) => void;
}) => {
  const { onSelect } = props;
  return (
    <>
      <div
        style={{
          padding: spacers.dp16,
        }}
      >
        <DropdownButton
          primary
          component={
            <FlyoutMenu>
              <MenuItem label="Tracker Program" />
              <MenuItem label="Event Program" />
              <MenuItem label="Data set" />
            </FlyoutMenu>
          }
          icon={<IconAdd24 />}
          name="buttonName"
          value="buttonValue"
        >
          Create metadata
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
            label="Programs"
            query={programQuery}
            onSelect={(props: any) => {
              onSelect(props);
            }}
          />
          <MetaDataGroup
            label="Data sets"
            query={dataSetQuery}
            onSelect={(props: any) => {
              onSelect(props);
            }}
          />
        </Menu>
      </div>
    </>
  );
};
