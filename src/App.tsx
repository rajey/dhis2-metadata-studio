import { useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import React, { FC } from "react";
import "./App.module.css";
import "./styles/tailwind.css";
import "@xyflow/react/dist/style.css";
import { Studio } from "./components";

const MyApp: FC = () => {
  return <Studio />;
};

export default MyApp;
