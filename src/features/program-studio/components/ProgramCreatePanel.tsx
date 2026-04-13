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
import React, { useEffect, useMemo, useState } from "react";

const trackedEntityTypeQuery: Query = {
  results: {
    resource: "trackedEntityTypes",
    params: {
      fields: ["id", "displayName", "name", "shortName", "description"],
      paging: false,
    },
  },
};

const createProgramMutation = {
  resource: "programs",
  type: "create",
  data: ({ data }) => data,
};

const createTrackedEntityTypeMutation = {
  resource: "trackedEntityTypes",
  type: "create",
  data: ({ data }) => data,
};

const createProgramStageMutation = {
  resource: "programStages",
  type: "create",
  data: ({ data }) => data,
};

const TRACKED_ENTITY_TYPE_MODE_OPTIONS = [
  {
    label: "Select existing",
    value: "existing",
  },
  {
    label: "Create new",
    value: "create",
  },
];

const extractCreatedId = (response: any) =>
  response?.response?.uid ||
  response?.uid ||
  response?.response?.response?.uid ||
  null;

const normalizeTrackedEntityTypes = (results: any) => {
  if (Array.isArray(results)) {
    return results;
  }

  if (Array.isArray(results?.trackedEntityTypes)) {
    return results.trackedEntityTypes;
  }

  return [];
};

export const ProgramCreatePanel = (props: {
  onClose: () => void;
  onCreated: (program: any) => void;
  programCreateContext?: {
    programType: "WITH_REGISTRATION" | "WITHOUT_REGISTRATION";
    resource: "programs";
  } | null;
}) => {
  const { onClose, onCreated, programCreateContext } = props;
  const [formValues, setFormValues] = useState({
    description: "",
    name: "",
    shortName: "",
    trackedEntityTypeDescription: "",
    trackedEntityTypeMode: "existing",
    trackedEntityTypeName: "",
    trackedEntityTypeShortName: "",
    trackedEntityTypeId: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const { data, error: trackedEntityTypeError } =
    useDataQuery(trackedEntityTypeQuery);
  const [createProgram, createProgramState] = useDataMutation(
    createProgramMutation,
  );
  const [createTrackedEntityType, createTrackedEntityTypeState] =
    useDataMutation(createTrackedEntityTypeMutation);
  const [createProgramStage, createProgramStageState] = useDataMutation(
    createProgramStageMutation,
  );

  const isTrackerProgram =
    programCreateContext?.programType === "WITH_REGISTRATION";
  const trackedEntityTypes = useMemo(
    () => normalizeTrackedEntityTypes(data?.results),
    [data],
  );
  const hasTrackedEntityTypes = trackedEntityTypes.length > 0;
  const creatingProgram = createProgramState.loading;
  const creatingTrackedEntityType = createTrackedEntityTypeState.loading;
  const creatingProgramStage = createProgramStageState.loading;
  const loading =
    creatingProgram || creatingTrackedEntityType || creatingProgramStage;

  useEffect(() => {
    if (!isTrackerProgram) {
      return;
    }

    if (!hasTrackedEntityTypes && formValues.trackedEntityTypeMode !== "create") {
      setFormValues((current) => ({
        ...current,
        trackedEntityTypeMode: "create",
      }));
    }
  }, [
    formValues.trackedEntityTypeMode,
    hasTrackedEntityTypes,
    isTrackerProgram,
  ]);

  useEffect(() => {
    setLocalError(null);
    setFormValues({
      description: "",
      name: "",
      shortName: "",
      trackedEntityTypeDescription: "",
      trackedEntityTypeId: "",
      trackedEntityTypeMode: "existing",
      trackedEntityTypeName: "",
      trackedEntityTypeShortName: "",
    });
  }, [programCreateContext?.programType]);

  const nameValidationText = useMemo(() => {
    if (!formValues.name.trim()) {
      return "Program name is required";
    }

    return undefined;
  }, [formValues.name]);

  const trackedEntityTypeValidationText = useMemo(() => {
    if (!isTrackerProgram) {
      return undefined;
    }

    if (
      formValues.trackedEntityTypeMode === "existing" &&
      !formValues.trackedEntityTypeId
    ) {
      return "Select a tracked entity type";
    }

    if (
      formValues.trackedEntityTypeMode === "create" &&
      !formValues.trackedEntityTypeName.trim()
    ) {
      return "Tracked entity type name is required";
    }

    return undefined;
  }, [
    formValues.trackedEntityTypeId,
    formValues.trackedEntityTypeMode,
    formValues.trackedEntityTypeName,
    isTrackerProgram,
  ]);

  const panelTitle = isTrackerProgram
    ? "Create tracker program"
    : "Create event program";
  const panelDescription = isTrackerProgram
    ? "Choose an existing tracked entity type or create one before the program is created."
    : "Event programs can be created directly and start with a single event stage.";

  if (!programCreateContext) {
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
          New program
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {panelTitle}
        </div>
        <div
          style={{
            fontSize: 12,
            color: colors.grey700,
            marginTop: spacers.dp8,
          }}
        >
          {panelDescription}
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
        {(localError ||
          trackedEntityTypeError ||
          createProgramState.error ||
          createTrackedEntityTypeState.error ||
          createProgramStageState.error) && (
          <NoticeBox error title="Create failed">
            {localError ||
              trackedEntityTypeError?.message ||
              createProgramState.error?.message ||
              createTrackedEntityTypeState.error?.message ||
              createProgramStageState.error?.message ||
              "Unable to create the program."}
          </NoticeBox>
        )}

        <InputField
          required
          error={Boolean(nameValidationText)}
          inputWidth="100%"
          label="Name"
          validationText={nameValidationText}
          value={formValues.name}
          onChange={({ value }) => {
            setLocalError(null);
            setFormValues((current) => ({
              ...current,
              name: value || "",
            }));
          }}
        />

        <InputField
          inputWidth="100%"
          label="Short name"
          value={formValues.shortName}
          onChange={({ value }) => {
            setLocalError(null);
            setFormValues((current) => ({
              ...current,
              shortName: value || "",
            }));
          }}
        />

        <TextAreaField
          autoGrow
          inputWidth="100%"
          label="Description"
          rows={4}
          value={formValues.description}
          onChange={({ value }) => {
            setLocalError(null);
            setFormValues((current) => ({
              ...current,
              description: value || "",
            }));
          }}
        />

        {isTrackerProgram && (
          <div
            style={{
              borderTopStyle: "solid",
              borderTopWidth: 0.7,
              borderTopColor: colors.grey300,
              paddingTop: spacers.dp16,
              display: "flex",
              flexDirection: "column",
              gap: spacers.dp16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.grey900,
                }}
              >
                Tracked entity type
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.grey700,
                  marginTop: spacers.dp4,
                }}
              >
                The tracker program must be attached to a tracked entity type.
              </div>
            </div>

            <SingleSelectField
              inputWidth="100%"
              label="Setup"
              selected={formValues.trackedEntityTypeMode}
              onChange={({ selected }) => {
                setLocalError(null);
                setFormValues((current) => ({
                  ...current,
                  trackedEntityTypeId: "",
                  trackedEntityTypeMode: selected,
                }));
              }}
            >
              {TRACKED_ENTITY_TYPE_MODE_OPTIONS.map((option) => (
                <SingleSelectOption
                  key={option.value}
                  disabled={
                    option.value === "existing" && !hasTrackedEntityTypes
                  }
                  label={option.label}
                  value={option.value}
                />
              ))}
            </SingleSelectField>

            {formValues.trackedEntityTypeMode === "existing" ? (
              <>
                {!hasTrackedEntityTypes && (
                  <NoticeBox title="No tracked entity types found">
                    Create a tracked entity type first to continue.
                  </NoticeBox>
                )}

                <SingleSelectField
                  clearable
                  disabled={!hasTrackedEntityTypes}
                  error={Boolean(trackedEntityTypeValidationText)}
                  inputWidth="100%"
                  label="Tracked entity type"
                  placeholder="Select a tracked entity type"
                  selected={formValues.trackedEntityTypeId}
                  validationText={trackedEntityTypeValidationText}
                  onChange={({ selected }) => {
                    setLocalError(null);
                    setFormValues((current) => ({
                      ...current,
                      trackedEntityTypeId: selected,
                    }));
                  }}
                >
                  {trackedEntityTypes.map((trackedEntityType: any) => (
                    <SingleSelectOption
                      key={trackedEntityType.id}
                      label={
                        trackedEntityType.displayName || trackedEntityType.name
                      }
                      value={trackedEntityType.id}
                    />
                  ))}
                </SingleSelectField>
              </>
            ) : (
              <>
                <InputField
                  required
                  error={Boolean(trackedEntityTypeValidationText)}
                  inputWidth="100%"
                  label="Tracked entity type name"
                  validationText={trackedEntityTypeValidationText}
                  value={formValues.trackedEntityTypeName}
                  onChange={({ value }) => {
                    setLocalError(null);
                    setFormValues((current) => ({
                      ...current,
                      trackedEntityTypeName: value || "",
                    }));
                  }}
                />

                <InputField
                  inputWidth="100%"
                  label="Tracked entity type short name"
                  value={formValues.trackedEntityTypeShortName}
                  onChange={({ value }) => {
                    setLocalError(null);
                    setFormValues((current) => ({
                      ...current,
                      trackedEntityTypeShortName: value || "",
                    }));
                  }}
                />

                <TextAreaField
                  autoGrow
                  inputWidth="100%"
                  label="Tracked entity type description"
                  rows={3}
                  value={formValues.trackedEntityTypeDescription}
                  onChange={({ value }) => {
                    setLocalError(null);
                    setFormValues((current) => ({
                      ...current,
                      trackedEntityTypeDescription: value || "",
                    }));
                  }}
                />
              </>
            )}
          </div>
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
          <Button disabled={loading} secondary onClick={onClose}>
            Close
          </Button>
          <Button
            primary
            disabled={
              Boolean(nameValidationText) ||
              Boolean(trackedEntityTypeValidationText) ||
              loading
            }
            loading={loading}
            onClick={async () => {
              setLocalError(null);

              try {
                let trackedEntityTypeId = formValues.trackedEntityTypeId;

                if (isTrackerProgram && formValues.trackedEntityTypeMode === "create") {
                  const trackedEntityTypeResponse = await createTrackedEntityType({
                    data: {
                      description: formValues.trackedEntityTypeDescription,
                      name: formValues.trackedEntityTypeName.trim(),
                      shortName:
                        formValues.trackedEntityTypeShortName.trim() ||
                        formValues.trackedEntityTypeName.trim(),
                    },
                  });

                  trackedEntityTypeId =
                    extractCreatedId(trackedEntityTypeResponse) || "";
                }

                const programResponse = await createProgram({
                  data: {
                    description: formValues.description,
                    name: formValues.name.trim(),
                    programType: programCreateContext.programType,
                    shortName: formValues.shortName.trim() || formValues.name.trim(),
                    ...(isTrackerProgram
                      ? {
                          trackedEntityType: {
                            id: trackedEntityTypeId,
                          },
                        }
                      : {}),
                  },
                });

                const programId = extractCreatedId(programResponse);

                if (!programId) {
                  throw new Error("Missing program id");
                }

                if (!isTrackerProgram) {
                  await createProgramStage({
                    data: {
                      description: "",
                      name: formValues.name.trim(),
                      program: { id: programId },
                      repeatable: false,
                      shortName:
                        formValues.shortName.trim() || formValues.name.trim(),
                    },
                  });
                }

                onCreated({
                  displayName: formValues.name.trim(),
                  id: programId,
                  name: formValues.name.trim(),
                  programType: programCreateContext.programType,
                });
              } catch (saveError) {
                setLocalError("The program could not be created. Try again.");
              }
            }}
          >
            Create program
          </Button>
        </ButtonStrip>
      </div>
    </div>
  );
};
