import { Query, useDataMutation, useDataQuery } from "@dhis2/app-service-data";
import {
  Button,
  ButtonStrip,
  colors,
  InputField,
  NoticeBox,
  SingleSelectField,
  SingleSelectOption,
  spacers,
  TextAreaField,
} from "@dhis2/ui";
import React, { useMemo, useState } from "react";

const SEARCH_THRESHOLD = 6;

const trackedEntityAttributesQuery: Query = {
  results: {
    resource: "trackedEntityAttributes",
    params: {
      fields: [
        "id",
        "displayName",
        "name",
        "shortName",
        "code",
        "valueType",
        "unique",
        "optionSetValue",
      ],
      paging: false,
    },
  },
};

const createTrackedEntityAttributeMutation = {
  resource: "trackedEntityAttributes",
  type: "create",
  data: ({ data }) => data,
};

const createProgramAttributeMutation = {
  resource: "programTrackedEntityAttributes",
  type: "create",
  data: ({ data }) => data,
};

const createTrackedEntityTypeAttributeMutation = {
  resource: "trackedEntityTypeAttributes",
  type: "create",
  data: ({ data }) => data,
};

const VALUE_TYPE_OPTIONS = [
  "TEXT",
  "LONG_TEXT",
  "LETTER",
  "INTEGER",
  "NUMBER",
  "INTEGER_POSITIVE",
  "INTEGER_ZERO_OR_POSITIVE",
  "INTEGER_NEGATIVE",
  "PERCENTAGE",
  "UNIT_INTERVAL",
  "DATE",
  "DATETIME",
  "TIME",
  "BOOLEAN",
  "COORDINATE",
  "FILE_RESOURCE",
  "IMAGE",
  "URL",
].map((valueType) => ({
  label: valueType.replaceAll("_", " "),
  value: valueType,
}));

const extractCreatedId = (response: any) => {
  return (
    response?.response?.uid ||
    response?.uid ||
    response?.response?.response?.uid ||
    null
  );
};

const normalizeTrackedEntityAttributes = (results: any) => {
  if (Array.isArray(results)) {
    return results;
  }

  if (Array.isArray(results?.trackedEntityAttributes)) {
    return results.trackedEntityAttributes;
  }

  return [];
};

export const ProgramAttributeAddPanel = (props: {
  onAdded: () => void;
  onClose: () => void;
  programAttributeContext?: any | null;
}) => {
  const { onAdded, onClose, programAttributeContext } = props;
  const [mode, setMode] = useState<"select" | "create">("select");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>(
    [],
  );
  const [createValues, setCreateValues] = useState({
    code: "",
    description: "",
    name: "",
    shortName: "",
    valueType: "TEXT",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const { data, error, loading } = useDataQuery(trackedEntityAttributesQuery);
  const [createTrackedEntityAttribute, createTrackedEntityAttributeState] =
    useDataMutation(createTrackedEntityAttributeMutation);
  const [createProgramAttribute, createProgramAttributeState] = useDataMutation(
    createProgramAttributeMutation,
  );
  const [createTrackedEntityTypeAttribute, createTrackedEntityTypeAttributeState] =
    useDataMutation(createTrackedEntityTypeAttributeMutation);
  const isTrackedEntityTypeContext =
    programAttributeContext?.attributeContext === "trackedEntityType" ||
    Boolean(programAttributeContext?.trackedEntityTypeId);

  const excludedAttributeIds = useMemo(() => {
    return new Set([
      ...(programAttributeContext?.existingAttributeIds || []),
      ...(!isTrackedEntityTypeContext
        ? programAttributeContext?.inheritedAttributeIds || []
        : []),
    ]);
  }, [
    isTrackedEntityTypeContext,
    programAttributeContext?.existingAttributeIds,
    programAttributeContext?.inheritedAttributeIds,
  ]);

  const availableAttributes = useMemo(() => {
    const trackedEntityAttributes = normalizeTrackedEntityAttributes(
      data?.results,
    );

    return trackedEntityAttributes
      .filter((attribute) => !excludedAttributeIds.has(attribute.id))
      .slice()
      .sort((left, right) =>
        (left.displayName || left.name || "").localeCompare(
          right.displayName || right.name || "",
        ),
      );
  }, [data?.results, excludedAttributeIds]);

  const filteredAvailableAttributes = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return availableAttributes
      .filter((attribute) => {
        if (!normalizedSearchTerm) {
          return true;
        }

        return `${attribute?.displayName || ""} ${attribute?.shortName || ""} ${
          attribute?.code || ""
        }`
          .toLowerCase()
          .includes(normalizedSearchTerm);
      });
  }, [availableAttributes, searchTerm]);

  const shouldShowSearch =
    availableAttributes.length > SEARCH_THRESHOLD || Boolean(searchTerm.trim());

  const saveError =
    localError ||
    createTrackedEntityAttributeState.error?.message ||
    createProgramAttributeState.error?.message ||
    createTrackedEntityTypeAttributeState.error?.message ||
    error?.message ||
    null;
  const isSaving =
    loading ||
    createTrackedEntityAttributeState.loading ||
    createProgramAttributeState.loading ||
    createTrackedEntityTypeAttributeState.loading;
  const nameValidationText = useMemo(() => {
    if (!createValues.name.trim()) {
      return "Attribute name is required";
    }

    return undefined;
  }, [createValues.name]);

  if (!programAttributeContext) {
    return null;
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: spacers.dp16,
          borderBottomStyle: "solid",
          borderBottomWidth: 0.7,
          borderBottomColor: colors.grey400,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: colors.grey700,
          }}
        >
          {isTrackedEntityTypeContext
            ? "Add tracked entity type attribute"
            : "Add program attribute"}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {isTrackedEntityTypeContext
            ? programAttributeContext.trackedEntityTypeDisplayName
            : programAttributeContext.programDisplayName}
        </div>
        <div
          style={{
            display: "flex",
            gap: spacers.dp8,
            marginTop: spacers.dp12,
          }}
        >
          <button
            className="border-none cursor-pointer"
            onClick={() => {
              setLocalError(null);
              setMode("select");
            }}
            style={{
              padding: `${spacers.dp4}px ${spacers.dp8}px`,
              borderRadius: 4,
              backgroundColor:
                mode === "select" ? colors.blue600 : colors.grey200,
              color: mode === "select" ? colors.white : colors.grey900,
            }}
          >
            Select existing
          </button>
          <button
            className="border-none cursor-pointer"
            onClick={() => {
              setLocalError(null);
              setMode("create");
            }}
            style={{
              padding: `${spacers.dp4}px ${spacers.dp8}px`,
              borderRadius: 4,
              backgroundColor:
                mode === "create" ? colors.blue600 : colors.grey200,
              color: mode === "create" ? colors.white : colors.grey900,
            }}
          >
            Create new
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: spacers.dp16,
          display: "flex",
          flexDirection: "column",
          gap: spacers.dp16,
        }}
      >
        {saveError && (
          <NoticeBox error title="Unable to add attribute">
            {saveError}
          </NoticeBox>
        )}

        {mode === "select" ? (
          <>
            {shouldShowSearch && (
              <InputField
                inputWidth="100%"
                label="Search existing attributes"
                value={searchTerm}
                onChange={({ value }) => setSearchTerm(value || "")}
              />
            )}

            <div
              style={{
                fontSize: 12,
                color: colors.grey700,
              }}
            >
              {filteredAvailableAttributes.length} available
            </div>

            <div
              style={{
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: colors.grey300,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {filteredAvailableAttributes.length > 0 ? (
                filteredAvailableAttributes.map((attribute) => {
                  const isSelected = selectedAttributeIds.includes(attribute.id);

                  return (
                    <label
                      key={attribute.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: spacers.dp8,
                        padding: spacers.dp8,
                        borderTopStyle: "solid",
                        borderTopWidth: 0.7,
                        borderTopColor: colors.grey300,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        checked={isSelected}
                        type="checkbox"
                        onChange={(event) => {
                          const { checked } = event.target;

                          setSelectedAttributeIds((current) =>
                            checked
                              ? [...current, attribute.id]
                              : current.filter((id) => id !== attribute.id),
                          );
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: colors.grey900,
                          }}
                        >
                          {attribute.displayName}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: colors.grey700,
                            marginTop: 2,
                          }}
                        >
                          {attribute.valueType}
                          {attribute.code ? ` • ${attribute.code}` : ""}
                        </div>
                      </div>
                    </label>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: spacers.dp12,
                    fontSize: 12,
                    color: colors.grey700,
                  }}
                >
                  No available tracked entity attributes. Create a new one to
                  add it directly to the program.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NoticeBox title="New attributes are added immediately">
              After saving, the new tracked entity attribute is automatically
              attached to this program.
            </NoticeBox>
            <InputField
              required
              error={Boolean(nameValidationText)}
              inputWidth="100%"
              label="Name"
              validationText={nameValidationText}
              value={createValues.name}
              onChange={({ value }) => {
                setLocalError(null);
                setCreateValues((current) => ({
                  ...current,
                  name: value || "",
                }));
              }}
            />
            <InputField
              inputWidth="100%"
              label="Short name"
              value={createValues.shortName}
              onChange={({ value }) => {
                setLocalError(null);
                setCreateValues((current) => ({
                  ...current,
                  shortName: value || "",
                }));
              }}
            />
            <InputField
              inputWidth="100%"
              label="Code"
              value={createValues.code}
              onChange={({ value }) => {
                setLocalError(null);
                setCreateValues((current) => ({
                  ...current,
                  code: value || "",
                }));
              }}
            />
            <SingleSelectField
              inputWidth="100%"
              label="Value type"
              selected={createValues.valueType}
              onChange={({ selected }) => {
                setLocalError(null);
                setCreateValues((current) => ({
                  ...current,
                  valueType: selected,
                }));
              }}
            >
              {VALUE_TYPE_OPTIONS.map((option) => (
                <SingleSelectOption
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </SingleSelectField>
            <TextAreaField
              autoGrow
              inputWidth="100%"
              label="Description"
              rows={4}
              value={createValues.description}
              onChange={({ value }) => {
                setLocalError(null);
                setCreateValues((current) => ({
                  ...current,
                  description: value || "",
                }));
              }}
            />
          </>
        )}
      </div>

      <div
        style={{
          padding: spacers.dp16,
          borderTopStyle: "solid",
          borderTopWidth: 0.7,
          borderTopColor: colors.grey400,
        }}
      >
        <ButtonStrip end>
          <Button disabled={isSaving} secondary onClick={onClose}>
            Close
          </Button>
          {mode === "select" ? (
            <Button
              primary
              disabled={selectedAttributeIds.length === 0 || isSaving}
              loading={isSaving}
              onClick={async () => {
                setLocalError(null);

                try {
                  await Promise.all(
                    selectedAttributeIds.map((attributeId, index) =>
                      isTrackedEntityTypeContext
                        ? createTrackedEntityTypeAttribute({
                            data: {
                              mandatory: false,
                              sortOrder:
                                (programAttributeContext.existingAttributeCount ||
                                  0) +
                                index +
                                1,
                              trackedEntityAttribute: { id: attributeId },
                              trackedEntityType: {
                                id: programAttributeContext.trackedEntityTypeId,
                              },
                            },
                          })
                        : createProgramAttribute({
                            data: {
                              mandatory: false,
                              program: { id: programAttributeContext.programId },
                              searchable: false,
                              sortOrder:
                                (programAttributeContext.existingAttributeCount ||
                                  0) +
                                index +
                                1,
                              trackedEntityAttribute: { id: attributeId },
                            },
                          }),
                    ),
                  );

                  onAdded();
                } catch (saveError) {
                  setLocalError(
                    isTrackedEntityTypeContext
                      ? "The selected attributes could not be added to the tracked entity type. Try again."
                      : "The selected attributes could not be added. Try again.",
                  );
                }
              }}
            >
              Add selected
            </Button>
          ) : (
            <Button
              primary
              disabled={Boolean(nameValidationText) || isSaving}
              loading={isSaving}
              onClick={async () => {
                setLocalError(null);

                try {
                  const trackedEntityAttributePayload = {
                    code: createValues.code.trim() || undefined,
                    description: createValues.description,
                    name: createValues.name.trim(),
                    shortName:
                      createValues.shortName.trim() || createValues.name.trim(),
                    valueType: createValues.valueType,
                  };
                  const createResponse = await createTrackedEntityAttribute({
                    data: trackedEntityAttributePayload,
                  });
                  const createdAttributeId = extractCreatedId(createResponse);

                  if (!createdAttributeId) {
                    throw new Error("The created attribute id was not returned.");
                  }

                  if (isTrackedEntityTypeContext) {
                    await createTrackedEntityTypeAttribute({
                      data: {
                        mandatory: false,
                        sortOrder:
                          (programAttributeContext.existingAttributeCount || 0) +
                          1,
                        trackedEntityAttribute: { id: createdAttributeId },
                        trackedEntityType: {
                          id: programAttributeContext.trackedEntityTypeId,
                        },
                      },
                    });
                  } else {
                    await createProgramAttribute({
                      data: {
                        mandatory: false,
                        program: { id: programAttributeContext.programId },
                        searchable: false,
                        sortOrder:
                          (programAttributeContext.existingAttributeCount || 0) +
                          1,
                        trackedEntityAttribute: { id: createdAttributeId },
                      },
                    });
                  }

                  onAdded();
                } catch (saveError) {
                  setLocalError(
                    saveError instanceof Error
                      ? saveError.message
                      : isTrackedEntityTypeContext
                        ? "The new attribute could not be created and added to the tracked entity type."
                        : "The new attribute could not be created and added.",
                  );
                }
              }}
            >
              Create and add
            </Button>
          )}
        </ButtonStrip>
      </div>
    </div>
  );
};
