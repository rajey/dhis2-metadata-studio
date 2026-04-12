import { colors, spacers, Tooltip } from "@dhis2/ui";
import React, {
  BaseSyntheticEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { iconUrl } from "../../../utils/asset";
import { FieldItemNode } from "./FieldItemNode";

const SEARCH_THRESHOLD = 6;

export const PaginatedFieldSection = (props: {
  addTooltip: string;
  countLabel?: string;
  description?: ReactNode;
  emptyMessage: string;
  fields: any[];
  pageSize?: number;
  resetKey?: string;
  searchPlaceholder: string;
  title: string;
}) => {
  const {
    addTooltip,
    countLabel = "assigned",
    description,
    emptyMessage,
    fields,
    pageSize = 5,
    resetKey,
    searchPlaceholder,
    title,
  } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const shouldShowSearch = fields.length > SEARCH_THRESHOLD;
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredFields = useMemo(() => {
    if (!normalizedSearchTerm) {
      return fields;
    }

    return fields.filter((field) =>
      `${field?.displayName || ""} ${field?.shortName || ""} ${
        field?.code || ""
      }`
        .toLowerCase()
        .includes(normalizedSearchTerm)
    );
  }, [fields, normalizedSearchTerm]);
  const totalPages = Math.max(1, Math.ceil(filteredFields.length / pageSize));
  const paginatedFields = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredFields.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredFields, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSearchTerm, resetKey]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      <div
        style={{
          paddingLeft: spacers.dp4,
          paddingRight: spacers.dp4,
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: colors.grey200,
          color: colors.grey800,
        }}
      >
        <div className="flex items-center justify-between">
          <div
            style={{
              fontSize: 6,
            }}
          >
            {title}
          </div>
          <Tooltip content={addTooltip} placement="top">
            <button
              className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
              onClick={(event: BaseSyntheticEvent) => {
                event.stopPropagation();
                console.log(title);
              }}
            >
              <img className="h-[10px]" src={iconUrl("add.svg")} alt="Add" />
            </button>
          </Tooltip>
        </div>
        {description}
        <div
          style={{
            fontSize: 6,
            color: colors.grey700,
            marginTop: 2,
          }}
        >
          {fields.length} {countLabel}
        </div>
      </div>
      {shouldShowSearch && (
        <div
          style={{
            padding: spacers.dp4,
            borderTopStyle: "solid",
            borderTopWidth: 0.6,
            borderTopColor: colors.grey300,
            backgroundColor: colors.white,
          }}
        >
          <input
            value={searchTerm}
            placeholder={searchPlaceholder}
            onChange={(event) => {
              event.stopPropagation();
              setSearchTerm(event.target.value);
            }}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              fontSize: 6,
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 6,
              paddingRight: 6,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.grey400,
              borderRadius: 2,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      )}
      {filteredFields.length > 0 ? (
        <div style={{ backgroundColor: colors.white }}>
          {paginatedFields.map((field) => {
            return <FieldItemNode key={field?.id} field={field} />;
          })}
          {totalPages > 1 && (
            <div
              style={{
                padding: spacers.dp4,
                borderTopStyle: "solid",
                borderTopWidth: 0.6,
                borderTopColor: colors.grey300,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: spacers.dp4,
                fontSize: 6,
                color: colors.grey800,
              }}
            >
              <button
                className="border-none bg-transparent cursor-pointer"
                disabled={currentPage === 1}
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  setCurrentPage((page) => Math.max(1, page - 1));
                }}
                style={{
                  padding: 0,
                  color: currentPage === 1 ? colors.grey500 : colors.blue700,
                }}
              >
                Previous
              </button>
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <button
                className="border-none bg-transparent cursor-pointer"
                disabled={currentPage === totalPages}
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  setCurrentPage((page) => Math.min(totalPages, page + 1));
                }}
                style={{
                  padding: 0,
                  color:
                    currentPage === totalPages ? colors.grey500 : colors.blue700,
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            padding: spacers.dp4,
            fontSize: 6,
            color: colors.grey700,
            borderTopStyle: "solid",
            borderTopWidth: 0.6,
            borderTopColor: colors.grey300,
            backgroundColor: colors.white,
          }}
        >
          {normalizedSearchTerm ? "No matching results" : emptyMessage}
        </div>
      )}
    </div>
  );
};
