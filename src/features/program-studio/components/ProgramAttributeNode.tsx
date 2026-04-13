import { useDataMutation } from "@dhis2/app-service-data";
import {
  Button,
  ButtonStrip,
  colors,
  IconDragHandle16,
  IconInfo16,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  NoticeBox,
  spacers,
  Tooltip,
} from "@dhis2/ui";
import React, { BaseSyntheticEvent, useEffect, useMemo, useState } from "react";
import { iconUrl } from "../../../utils/asset";
import { FieldItemNode } from "./FieldItemNode";
import { PaginatedFieldSection } from "./PaginatedFieldSection";

const SEARCH_THRESHOLD = 6;

const updateProgramAttributeSortMutation = {
  resource: "programTrackedEntityAttributes",
  id: ({ id }) => id,
  type: "update",
  partial: true,
  data: ({ data }) => data,
};

const updateTrackedEntityTypeAttributeSortMutation = {
  resource: "trackedEntityTypeAttributes",
  id: ({ id }) => id,
  type: "update",
  partial: true,
  data: ({ data }) => data,
};

const deleteProgramAttributeMutation = {
  resource: "programTrackedEntityAttributes",
  id: ({ id }) => id,
  type: "delete",
};

const deleteTrackedEntityTypeAttributeMutation = {
  resource: "trackedEntityTypeAttributes",
  id: ({ id }) => id,
  type: "delete",
};

const reorderAttributes = (
  attributes: any[],
  sourceId: string,
  targetId: string,
) => {
  const sourceIndex = attributes.findIndex(
    (attribute) => attribute.id === sourceId,
  );
  const targetIndex = attributes.findIndex(
    (attribute) => attribute.id === targetId,
  );

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return attributes;
  }

  const nextAttributes = [...attributes];
  const [movedAttribute] = nextAttributes.splice(sourceIndex, 1);

  nextAttributes.splice(targetIndex, 0, movedAttribute);

  return nextAttributes.map((attribute, index) => ({
    ...attribute,
    sortOrder: index + 1,
  }));
};

const reorderVisibleAttributes = (
  attributes: any[],
  visibleAttributes: any[],
  sourceId: string,
  targetId: string,
) => {
  const reorderedVisibleAttributes = reorderAttributes(
    visibleAttributes,
    sourceId,
    targetId,
  );
  const reorderedVisibleAttributeIds = new Set(
    reorderedVisibleAttributes.map((attribute) => attribute.id),
  );
  let reorderedVisibleIndex = 0;

  return attributes
    .map((attribute) =>
      reorderedVisibleAttributeIds.has(attribute.id)
        ? reorderedVisibleAttributes[reorderedVisibleIndex++]
        : attribute,
    )
    .map((attribute, index) => ({
      ...attribute,
      sortOrder: index + 1,
    }));
};

export const ProgramAttributeNode = (props: {
  hideTitle?: boolean;
  onAddAttribute?: () => void;
  onEditAttribute?: (attribute: any) => void;
  attributes: any[];
}) => {
  const { hideTitle, onAddAttribute, attributes, onEditAttribute } = props;
  const [orderedAttributes, setOrderedAttributes] = useState(attributes);
  const [draggedAttributeId, setDraggedAttributeId] = useState<string | null>(
    null,
  );
  const [dropTargetAttributeId, setDropTargetAttributeId] = useState<
    string | null
  >(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [pendingRemovalAttribute, setPendingRemovalAttribute] = useState<any | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updateProgramAttributeSortOrder] = useDataMutation(
    updateProgramAttributeSortMutation,
  );
  const [updateTrackedEntityTypeAttributeSortOrder] = useDataMutation(
    updateTrackedEntityTypeAttributeSortMutation,
  );
  const [deleteProgramAttribute] = useDataMutation(deleteProgramAttributeMutation);
  const [deleteTrackedEntityTypeAttribute] = useDataMutation(
    deleteTrackedEntityTypeAttributeMutation,
  );

  useEffect(() => {
    setOrderedAttributes(attributes);
    setDropTargetAttributeId(null);
    setOrderError(null);
  }, [attributes]);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const shouldShowSearch = orderedAttributes.length > SEARCH_THRESHOLD;
  const filteredAttributes = useMemo(() => {
    if (!normalizedSearchTerm) {
      return orderedAttributes;
    }

    return orderedAttributes.filter((attribute) =>
      `${attribute?.displayName || ""} ${attribute?.shortName || ""} ${
        attribute?.code || ""
      }`
        .toLowerCase()
        .includes(normalizedSearchTerm),
    );
  }, [normalizedSearchTerm, orderedAttributes]);
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filteredAttributes.length / pageSize));
  const paginatedAttributes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredAttributes.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredAttributes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSearchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const isEditableProgramAttributeList = Boolean(onEditAttribute);
  const isTrackedEntityTypeAttributeList = useMemo(() => {
    return orderedAttributes.some(
      (attribute) => attribute?.trackedEntityTypeAttributeId,
    );
  }, [orderedAttributes]);
  const dragHint = useMemo(() => {
    if (!isEditableProgramAttributeList || paginatedAttributes.length < 2) {
      return null;
    }

    return "Drag rows on this page to reorder attributes";
  }, [isEditableProgramAttributeList, paginatedAttributes.length]);

  const removeAttribute = async (field) => {
    const previousAttributes = orderedAttributes;
    const nextAttributes = orderedAttributes
      .filter((orderedAttribute) => orderedAttribute.id !== field.id)
      .map((orderedAttribute, index) => ({
        ...orderedAttribute,
        sortOrder: index + 1,
      }));

    setOrderError(null);
    setOrderedAttributes(nextAttributes);

    try {
      if (isTrackedEntityTypeAttributeList) {
        await deleteTrackedEntityTypeAttribute({
          id: field.trackedEntityTypeAttributeId,
        });
        await Promise.all(
          nextAttributes.map((nextAttribute) =>
            updateTrackedEntityTypeAttributeSortOrder({
              id: nextAttribute.trackedEntityTypeAttributeId,
              data: {
                sortOrder: nextAttribute.sortOrder,
              },
            }),
          ),
        );
      } else {
        await deleteProgramAttribute({
          id: field.programTrackedEntityAttributeId,
        });
        await Promise.all(
          nextAttributes.map((nextAttribute) =>
            updateProgramAttributeSortOrder({
              id: nextAttribute.programTrackedEntityAttributeId,
              data: {
                sortOrder: nextAttribute.sortOrder,
              },
            }),
          ),
        );
      }
    } catch (error) {
      setOrderedAttributes(previousAttributes);
      setOrderError("The attribute could not be removed. Try again.");
    }
  };

  if (!isEditableProgramAttributeList) {
    return (
      <div
        style={{
          borderBottomStyle: "solid",
          borderBottomWidth: 0.7,
          borderBottomColor: colors.grey300,
        }}
      >
        <PaginatedFieldSection
          addTooltip="Add attribute"
          description={
            !hideTitle ? (
              <div
                style={{
                  fontSize: 6,
                  fontStyle: "italic",
                  color: colors.grey600,
                  marginTop: spacers.dp4,
                  display: "flex",
                  alignItems: "center",
                  gap: spacers.dp4,
                }}
              >
                <IconInfo16 />
                <span>
                  Inherited attributes are hidden and can be viewed under
                  tracked entity type node
                </span>
              </div>
            ) : undefined
          }
          emptyMessage="No attributes assigned"
          fields={orderedAttributes}
          pageSize={4}
          resetKey={orderedAttributes.map((attribute) => attribute.id).join(",")}
          searchPlaceholder="Search attributes"
          showAddAction={false}
          title="Attributes"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        borderBottomStyle: "solid",
        borderBottomWidth: 0.7,
        borderBottomColor: colors.grey300,
      }}
    >
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
          <div>Attributes</div>
          {onAddAttribute && (
            <Tooltip content="Add attribute" placement="top">
              <button
                className="p-[1px] border-none bg-transparent flex items-center hover:bg-gray-200 cursor-pointer rounded-sm"
                onClick={(event: BaseSyntheticEvent) => {
                  event.stopPropagation();
                  onAddAttribute();
                }}
              >
                <img className="h-[10px]" src={iconUrl("add.svg")} alt="Add" />
              </button>
            </Tooltip>
          )}
        </div>
        {!hideTitle && (
          <div
            style={{
              fontSize: 6,
              fontStyle: "italic",
              color: colors.grey600,
              marginTop: spacers.dp4,
              display: "flex",
              alignItems: "center",
              gap: spacers.dp4,
            }}
          >
            <IconInfo16 />
            <span>
              Edit attribute details from the row action. Drag rows to reorder
              them.
            </span>
          </div>
        )}
        <div
          style={{
            fontSize: 6,
            color: colors.grey700,
            marginTop: 2,
          }}
        >
          {orderedAttributes.length} assigned
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
            placeholder="Search attributes"
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
          <NoticeBox error title="Unable to reorder attributes">
            {orderError}
          </NoticeBox>
        </div>
      )}

      <div className="nodrag nopan" style={{ backgroundColor: colors.white }}>
        {filteredAttributes.length > 0 ? (
          <>
            {paginatedAttributes.map((attribute) => (
              <div
                key={attribute.id}
                className="nodrag nopan"
                onDragEnd={() => {
                  setDraggedAttributeId(null);
                  setDropTargetAttributeId(null);
                }}
                onDragOver={(event) => {
                  if (draggedAttributeId) {
                    event.preventDefault();
                    if (draggedAttributeId !== attribute.id) {
                      setDropTargetAttributeId(attribute.id);
                    }
                  }
                }}
                onDragLeave={() => {
                  if (dropTargetAttributeId === attribute.id) {
                    setDropTargetAttributeId(null);
                  }
                }}
                onDrop={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  if (!draggedAttributeId || draggedAttributeId === attribute.id) {
                    setDraggedAttributeId(null);
                    return;
                  }

                  const previousAttributes = orderedAttributes;
                  const nextAttributes = reorderVisibleAttributes(
                    orderedAttributes,
                    paginatedAttributes,
                    draggedAttributeId,
                    attribute.id,
                  );

                  setDraggedAttributeId(null);
                  setDropTargetAttributeId(null);
                  setOrderError(null);
                  setOrderedAttributes(nextAttributes);

                  try {
                    await Promise.all(
                      nextAttributes.map((nextAttribute) => {
                        if (isTrackedEntityTypeAttributeList) {
                          return updateTrackedEntityTypeAttributeSortOrder({
                            id: nextAttribute.trackedEntityTypeAttributeId,
                            data: {
                              sortOrder: nextAttribute.sortOrder,
                            },
                          });
                        }

                        return updateProgramAttributeSortOrder({
                          id: nextAttribute.programTrackedEntityAttributeId,
                          data: {
                            sortOrder: nextAttribute.sortOrder,
                          },
                        });
                      }),
                    );
                  } catch (error) {
                    setOrderedAttributes(previousAttributes);
                    setOrderError(
                      "The new attribute order could not be saved. Try again.",
                    );
                  }
                }}
                style={{
                  borderTopStyle: "solid",
                  borderTopColor:
                    dropTargetAttributeId === attribute.id
                      ? colors.blue400
                      : "transparent",
                  borderTopWidth: 1,
                  opacity:
                    draggedAttributeId === attribute.id &&
                    paginatedAttributes.length > 1
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
                    draggable={paginatedAttributes.length > 1}
                    onDragStart={(event) => {
                      event.stopPropagation();
                      setDraggedAttributeId(attribute.id);
                      setDropTargetAttributeId(null);
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
                        paginatedAttributes.length > 1 ? "grab" : "default",
                      borderTopStyle: "solid",
                      borderTopColor: colors.green100,
                      borderTopWidth: 0.6,
                      paddingTop: spacers.dp4,
                      paddingBottom: spacers.dp4,
                      backgroundColor:
                        draggedAttributeId === attribute.id
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
                        height: 6,
                      }}
                    >
                      <IconDragHandle16 />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <FieldItemNode
                      field={attribute}
                      onEdit={onEditAttribute}
                      onRemove={(field) => {
                        setPendingRemovalAttribute(field);
                      }}
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
            {normalizedSearchTerm ? "No matching results" : "No attributes assigned"}
          </div>
        )}
      </div>
      {pendingRemovalAttribute && (
        <Modal
          small
          onClose={() => {
            setPendingRemovalAttribute(null);
          }}
        >
          <ModalTitle>Remove attribute</ModalTitle>
          <ModalContent>
            Remove {pendingRemovalAttribute.displayName} from this{" "}
            {isTrackedEntityTypeAttributeList
              ? "tracked entity type"
              : "program"}
            ?
          </ModalContent>
          <ModalActions>
            <ButtonStrip end>
              <Button
                secondary
                onClick={() => {
                  setPendingRemovalAttribute(null);
                }}
              >
                Cancel
              </Button>
              <Button
                destructive
                onClick={async () => {
                  const attributeToRemove = pendingRemovalAttribute;

                  setPendingRemovalAttribute(null);
                  await removeAttribute(attributeToRemove);
                }}
              >
                Remove
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};
