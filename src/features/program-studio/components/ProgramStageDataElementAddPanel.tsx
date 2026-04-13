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

const dataElementsQuery: Query = {
  results: {
    resource: "dataElements",
    params: {
      fields: [
        "id",
        "displayName",
        "name",
        "shortName",
        "code",
        "valueType",
        "optionSetValue",
      ],
      paging: false,
    },
  },
};

const createDataElementMutation = {
  resource: "dataElements",
  type: "create",
  data: ({ data }) => data,
};

const createProgramStageDataElementMutation = {
  resource: "programStageDataElements",
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

const normalizeDataElements = (results: any) => {
  if (Array.isArray(results)) {
    return results;
  }

  if (Array.isArray(results?.dataElements)) {
    return results.dataElements;
  }

  return [];
};

export const ProgramStageDataElementAddPanel = (props: {
  onAdded: () => void;
  onClose: () => void;
  programStageDataElementContext?: any | null;
}) => {
  const { onAdded, onClose, programStageDataElementContext } = props;
  const [mode, setMode] = useState<"select" | "create">("select");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataElementIds, setSelectedDataElementIds] = useState<
    string[]
  >([]);
  const [createValues, setCreateValues] = useState({
    code: "",
    description: "",
    name: "",
    shortName: "",
    valueType: "TEXT",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const { data, error, loading } = useDataQuery(dataElementsQuery);
  const [createDataElement, createDataElementState] = useDataMutation(
    createDataElementMutation,
  );
  const [createProgramStageDataElement, createProgramStageDataElementState] =
    useDataMutation(createProgramStageDataElementMutation);

  const existingDataElementIds = useMemo(() => {
    return new Set(programStageDataElementContext?.existingDataElementIds || []);
  }, [programStageDataElementContext?.existingDataElementIds]);

  const listedDataElements = useMemo(() => {
    const dataElements = normalizeDataElements(data?.results);

    return dataElements
      .slice()
      .sort((left, right) =>
        (left.displayName || left.name || "").localeCompare(
          right.displayName || right.name || "",
        ),
      );
  }, [data?.results]);

  const filteredDataElements = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return listedDataElements.filter((dataElement) => {
        if (!normalizedSearchTerm) {
          return true;
        }

        return `${dataElement?.displayName || ""} ${
          dataElement?.shortName || ""
        } ${dataElement?.code || ""}`
          .toLowerCase()
          .includes(normalizedSearchTerm);
      });
  }, [listedDataElements, searchTerm]);

  const selectableFilteredDataElements = useMemo(() => {
    return filteredDataElements.filter(
      (dataElement) => !existingDataElementIds.has(dataElement.id),
    );
  }, [existingDataElementIds, filteredDataElements]);

  const lockedFilteredDataElements =
    filteredDataElements.length - selectableFilteredDataElements.length;

  const shouldShowSearch =
    listedDataElements.length > SEARCH_THRESHOLD || Boolean(searchTerm.trim());

  const saveError =
    localError ||
    createDataElementState.error?.message ||
    createProgramStageDataElementState.error?.message ||
    error?.message ||
    null;
  const isSaving =
    loading ||
    createDataElementState.loading ||
    createProgramStageDataElementState.loading;
  const nameValidationText = useMemo(() => {
    if (!createValues.name.trim()) {
      return "Data element name is required";
    }

    return undefined;
  }, [createValues.name]);

  if (!programStageDataElementContext) {
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
          Add stage data element
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {programStageDataElementContext.programStageDisplayName}
        </div>
        <div
          style={{
            fontSize: 12,
            color: colors.grey700,
            marginTop: spacers.dp4,
          }}
        >
          {programStageDataElementContext.programDisplayName}
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
          <NoticeBox error title="Unable to add data element">
            {saveError}
          </NoticeBox>
        )}

        {mode === "select" ? (
          <>
            {shouldShowSearch && (
              <InputField
                inputWidth="100%"
                label="Search existing data elements"
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
              {selectableFilteredDataElements.length} selectable
              {lockedFilteredDataElements > 0
                ? ` • ${lockedFilteredDataElements} locked`
                : ""}
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
              {filteredDataElements.length > 0 ? (
                filteredDataElements.map((dataElement) => {
                  const isSelected = selectedDataElementIds.includes(
                    dataElement.id,
                  );
                  const isLocked = existingDataElementIds.has(dataElement.id);

                  return (
                    <label
                      key={dataElement.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: spacers.dp8,
                        padding: spacers.dp8,
                        borderTopStyle: "solid",
                        borderTopWidth: 0.7,
                        borderTopColor: colors.grey300,
                        cursor: isLocked ? "not-allowed" : "pointer",
                        opacity: isLocked ? 0.75 : 1,
                        backgroundColor: isLocked ? colors.grey100 : colors.white,
                      }}
                    >
                      <input
                        checked={isSelected || isLocked}
                        disabled={isLocked}
                        type="checkbox"
                        onChange={(event) => {
                          const { checked } = event.target;

                          setSelectedDataElementIds((current) =>
                            checked
                              ? [...current, dataElement.id]
                              : current.filter((id) => id !== dataElement.id),
                          );
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center justify-between gap-2">
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: colors.grey900,
                            }}
                          >
                            {dataElement.displayName}
                          </div>
                          {isLocked && (
                            <span
                              style={{
                                fontSize: 10,
                                padding: `2px ${spacers.dp4}px`,
                                borderRadius: 10,
                                backgroundColor: colors.green100,
                                color: colors.green900,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Added
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: colors.grey700,
                            marginTop: 2,
                          }}
                        >
                          {dataElement.valueType}
                          {dataElement.code ? ` • ${dataElement.code}` : ""}
                        </div>
                      </div>
                    </label>
                  );
                })
              ) : searchTerm.trim() ? (
                <div
                  style={{
                    padding: spacers.dp12,
                    fontSize: 12,
                    color: colors.grey700,
                  }}
                >
                  No matching data elements.
                </div>
              ) : (
                <div
                  style={{
                    padding: spacers.dp12,
                    fontSize: 12,
                    color: colors.grey700,
                  }}
                >
                  No data elements found. Create a new one to add it directly to
                  the stage.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NoticeBox title="New data elements are added immediately">
              After saving, the new data element is automatically attached to
              this program stage.
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
              disabled={selectedDataElementIds.length === 0 || isSaving}
              loading={isSaving}
              onClick={async () => {
                setLocalError(null);

                try {
                  await Promise.all(
                    selectedDataElementIds.map((dataElementId, index) =>
                      createProgramStageDataElement({
                        data: {
                          compulsory: false,
                          dataElement: { id: dataElementId },
                          programStage: {
                            id: programStageDataElementContext.programStageId,
                          },
                          sortOrder:
                            (programStageDataElementContext.existingDataElementCount ||
                              0) +
                            index +
                            1,
                        },
                      }),
                    ),
                  );

                  onAdded();
                } catch (saveError) {
                  setLocalError(
                    "The selected data elements could not be added. Try again.",
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
                  const dataElementPayload = {
                    code: createValues.code.trim() || undefined,
                    description: createValues.description,
                    name: createValues.name.trim(),
                    shortName:
                      createValues.shortName.trim() || createValues.name.trim(),
                    valueType: createValues.valueType,
                  };
                  const createResponse = await createDataElement({
                    data: dataElementPayload,
                  });
                  const createdDataElementId = extractCreatedId(createResponse);

                  if (!createdDataElementId) {
                    throw new Error(
                      "The created data element id was not returned.",
                    );
                  }

                  await createProgramStageDataElement({
                    data: {
                      compulsory: false,
                      dataElement: { id: createdDataElementId },
                      programStage: {
                        id: programStageDataElementContext.programStageId,
                      },
                      sortOrder:
                        (programStageDataElementContext.existingDataElementCount ||
                          0) + 1,
                    },
                  });

                  onAdded();
                } catch (saveError) {
                  setLocalError(
                    saveError instanceof Error
                      ? saveError.message
                      : "The new data element could not be created and added.",
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
