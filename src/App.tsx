import { useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import React, { FC } from "react";
import "./App.module.css";
import "@xyflow/react/dist/style.css";
import { Studio } from "./components";

interface QueryResults {
  me: {
    name: string;
  };
}

const query = {
  me: {
    resource: "me",
  },
};

const MyApp: FC = () => {
  const { error, loading, data } = useDataQuery<QueryResults>(query);

  if (error) {
    return <span>{i18n.t("ERROR")}</span>;
  }

  if (loading) {
    return <span>{i18n.t("Loading...")}</span>;
  }

  return <Studio />;
};

export default MyApp;
