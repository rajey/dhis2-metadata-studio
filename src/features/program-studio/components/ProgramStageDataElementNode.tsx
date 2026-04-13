import { useDataMutation } from "@dhis2/app-service-data";
import {
  colors,
  IconDragHandle16,
  NoticeBox,
  spacers,
  Tooltip,
} from "@dhis2/ui";
import React, { BaseSyntheticEvent, useEffect, useMemo, useState } from "react";
import { iconUrl } from "../../../utils/asset";
import { FieldItemNode } from "./FieldItemNode";

const SEARCH_THRESHOLD = 6;

const updateProgramStageDataElementSortMutation = {
  resource: "programStageDataElements",
  id: ({ id }) => id,
  type: "update",
  partial: true,
  data: ({ data }) => data,
};

const reorderDataElements = (
  dataElements: any[],
  sourceId: string,
  targetId: string
) => {
  const sourceIndex = dataElements.findIndex(
    (dataElement) => dataElement.id === sourceId
  );
  const targetIndex = dataElements.findIndex(
    (dataElement) => dataElement.id === targetId
  );

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return dataElements;
  }

  const nextDataElements = [...dataElements];
  const [movedDataElement] = nextDataElements.splice(sourceIndex, 1);

  nextDataElements.splice(targetIndex, 0, movedDataElement);

  return nextDataElements.map((dataElement, index) => ({
    ...dataElement,
    sortOrder: index + 1,
  }));
};

const reorderVisibleDataElements = (
  dataElements: any[],
  visibleDataElements: any[],
  sourceId: string,
  targetId: string,
) => {
  const reorderedVisibleDataElements = reorderDataElements(
    visibleDataElements,
    sourceId,
    targetId,
  );
  const reorderedVisibleDataElementIds = new Set(
    reorderedVisibleDataElements.map((dataElement) => dataElement.id),
  );
  let reorderedVisibleIndex = 0;

  return dataElements
    .map((dataElement) =>
      reorderedVisibleDataElementIds.has(dataElement.id)
        ? reorderedVisibleDataElements[reorderedVisibleIndex++]
        : dataElement,
    )
    .map((dataElement, index) => ({
      ...dataElement,
      sortOrder: index + 1,
    }));
};

export const ProgramStageDataElementNode = (props: {
  dataElements: any[];
  onAddDataElement?: () => void;
  onEditDataElement?: (dataElement: any) => void;
}) => {
  const { dataElements, onAddDataElement, onEditDataElement } = props;
  const [orderedDataElements, setOrderedDataElements] = useState(dataElements);
  const [draggedDataElementId, setDraggedDataElementId] = useState<
    string | null
  >(null);
  const [dropTargetDataElementId, setDropTargetDataElementId] = useState<
    string | null
  >(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updateProgramStageDataElementSortOrder] = useDataMutation(
    updateProgramStageDataElementSortMutation
  );

  useEffect(() => {
    setOrderedDataElements(dataElements);
    setDropTargetDataElementId(null);
    setOrderError(null);
  }, [dataElements]);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const shouldShowSearch = orderedDataElements.length > SEARCH_THRESHOLD;
  const filteredDataElements = useMemo(() => {
    if (!normalizedSearchTerm) {
      return orderedDataElements;
    }

    return orderedDataElements.filter((dataElement) =>
      `${dataElement?.displayName || ""} ${dataElement?.shortName || ""} ${
        dataElement?.code || ""
      }`
        .toLowerCase()
        .includes(normalizedSearchTerm),
    );
  }, [normalizedSearchTerm, orderedDataElements]);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredDataElements.length / pageSize));
  const paginatedDataElements = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredDataElements.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredDataElements]);

  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSearchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const dragHint = useMemo(() => {
    if (!onEditDataElement || paginatedDataElements.length < 2) {
      return null;
    }

    return "Drag rows on this page to reorder data elements";
  }, [onEditDataElement, paginatedDataElements.length]);

  return (
    <div>
      <div
        style={{
          fontSize: 6,
          paddingLeft: spacers.dp4,
          paddingRight: spacers.dp4,
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: colors.grey200,
          color: colors.grey800,
        }}
      >
        <div className="flex items-center justify-between">
          <div>Data elements</div>
          {onAddDataElement && (
            <Tooltip content="Add data element" placement="top">
              <button
                className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  onAddDataElement();
                }}
              >
                <img className="h-[10px]" src={iconUrl("add.svg")} alt="Add" />
              </button>
            </Tooltip>
          )}
        </div>
        <div
          style={{
            fontSize: 6,
            color: colors.grey700,
            marginTop: 2,
          }}
        >
          {orderedDataElements.length} assigned
        </div>
        {dragHint && (
          <div
            style={{
              fontSize: 6,
              color: colors.grey700,
              marginTop: 2,
            }}
          >
            {dragHint}
          </div>
        )}
      </div>

      {shouldShowSearch && (
        <div
          className="nodrag nopan"
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
            placeholder="Search data elements"
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

      {orderError && (
        <div style={{ padding: spacers.dp4 }}>
          <NoticeBox error title="Unable to reorder data elements">
            {orderError}
          </NoticeBox>
        </div>
      )}

      <div className="nodrag nopan" style={{ backgroundColor: colors.white }}>
        {filteredDataElements.length > 0 ? (
          <>
            {paginatedDataElements.map((dataElement) => (
              <div
                key={dataElement.id}
                className="nodrag nopan"
                onDragEnd={() => {
                  setDraggedDataElementId(null);
                  setDropTargetDataElementId(null);
                }}
                onDragOver={(event) => {
                  if (draggedDataElementId) {
                    event.preventDefault();
                    if (draggedDataElementId !== dataElement.id) {
                      setDropTargetDataElementId(dataElement.id);
                    }
                  }
                }}
                onDragLeave={() => {
                  if (dropTargetDataElementId === dataElement.id) {
                    setDropTargetDataElementId(null);
                  }
                }}
                onDrop={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  if (
                    !draggedDataElementId ||
                    draggedDataElementId === dataElement.id
                  ) {
                    setDraggedDataElementId(null);
                    return;
                  }

                  const previousDataElements = orderedDataElements;
                  const nextDataElements = reorderVisibleDataElements(
                    orderedDataElements,
                    paginatedDataElements,
                    draggedDataElementId,
                    dataElement.id,
                  );

                  setDraggedDataElementId(null);
                  setDropTargetDataElementId(null);
                  setOrderError(null);
                  setOrderedDataElements(nextDataElements);

                  try {
                    await Promise.all(
                      nextDataElements.map((nextDataElement) =>
                        updateProgramStageDataElementSortOrder({
                          id: nextDataElement.programStageDataElementId,
                          data: {
                            sortOrder: nextDataElement.sortOrder,
                          },
                        }),
                      ),
                    );
                  } catch (error) {
                    setOrderedDataElements(previousDataElements);
                    setOrderError(
                      "The new data element order could not be saved. Try again.",
                    );
                  }
                }}
                style={{
                  borderTopStyle: "solid",
                  borderTopColor:
                    dropTargetDataElementId === dataElement.id
                      ? colors.blue400
                      : "transparent",
                  borderTopWidth: 1,
                  opacity:
                    draggedDataElementId === dataElement.id &&
                    paginatedDataElements.length > 1
                      ? 0.6
                      : 1,
                }}
              >
                <div
                  className="nodrag nopan"
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <div
                    className="nodrag nopan"
                    draggable={paginatedDataElements.length > 1}
                    onDragStart={(event) => {
                      event.stopPropagation();
                      setDraggedDataElementId(dataElement.id);
                      setDropTargetDataElementId(null);
                      if (event.dataTransfer) {
                        event.dataTransfer.effectAllowed = "move";
                      }
                    }}
                    style={{
                      width: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor:
                        paginatedDataElements.length > 1 ? "grab" : "default",
                      borderTopStyle: "solid",
                      borderTopColor: colors.green100,
                      borderTopWidth: 0.6,
                      paddingTop: spacers.dp4,
                      paddingBottom: spacers.dp4,
                      backgroundColor:
                        draggedDataElementId === dataElement.id
                          ? colors.grey200
                          : colors.white,
                    }}
                    title="Drag to reorder"
                  >
                    <div
                      style={{
                        color: colors.grey700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconDragHandle16 />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <FieldItemNode
                      field={dataElement}
                      onEdit={onEditDataElement}
                    />
                  </div>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <div
                className="nodrag nopan"
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
                    color:
                      currentPage === 1 ? colors.grey500 : colors.blue700,
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
                      currentPage === totalPages
                        ? colors.grey500
                        : colors.blue700,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
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
            {normalizedSearchTerm
              ? "No matching results"
              : "No data elements assigned"}
          </div>
        )}
      </div>
    </div>
  );
};
