import { useDataMutation } from "@dhis2/app-service-data";
import {
  Button,
  ButtonStrip,
  CheckboxField,
  colors,
  InputField,
  NoticeBox,
  SingleSelectField,
  SingleSelectOption,
  spacers,
  TextAreaField,
} from "@dhis2/ui";
import React, { useEffect, useMemo, useState } from "react";

const updateTrackedEntityAttributeMutation = {
  resource: "trackedEntityAttributes",
  id: ({ id }) => id,
  type: "update",
  partial: true,
  data: ({ data }) => data,
};

const updateProgramAttributeMutation = {
  resource: "programTrackedEntityAttributes",
  id: ({ id }) => id,
  type: "update",
  partial: true,
  data: ({ data }) => data,
};

const updateTrackedEntityTypeAttributeMutation = {
  resource: "trackedEntityTypeAttributes",
  id: ({ id }) => id,
  type: "update",
  partial: true,
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

export const ProgramAttributeEditorPanel = (props: {
  onClose: () => void;
  onSaved: (programAttribute: any) => void;
  programAttribute?: any | null;
}) => {
  const { onClose, onSaved, programAttribute } = props;
  const [formValues, setFormValues] = useState({
    description: "",
    mandatory: false,
    name: "",
    searchable: false,
    shortName: "",
    valueType: "TEXT",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [saveTrackedEntityAttribute, trackedEntityAttributeState] =
    useDataMutation(updateTrackedEntityAttributeMutation);
  const [saveProgramAttribute, programAttributeState] = useDataMutation(
    updateProgramAttributeMutation
  );
  const [saveTrackedEntityTypeAttribute, trackedEntityTypeAttributeState] =
    useDataMutation(updateTrackedEntityTypeAttributeMutation);

  useEffect(() => {
    setSuccessMessage(null);
    setFormValues({
      description: programAttribute?.description || "",
      mandatory: programAttribute?.mandatory ?? false,
      name: programAttribute?.name || programAttribute?.displayName || "",
      searchable: programAttribute?.searchable ?? false,
      shortName: programAttribute?.shortName || "",
      valueType: programAttribute?.valueType || "TEXT",
    });
  }, [programAttribute]);

  const nameValidationText = useMemo(() => {
    if (!formValues.name.trim()) {
      return "Attribute name is required";
    }

    return undefined;
  }, [formValues.name]);

  if (!programAttribute) {
    return null;
  }

  const isTrackedEntityTypeAttribute =
    programAttribute.attributeContext === "trackedEntityType" ||
    Boolean(programAttribute.trackedEntityTypeAttributeId);
  const contextTitle = isTrackedEntityTypeAttribute
    ? "Tracked entity type attribute configuration"
    : "Program attribute configuration";
  const behaviorTitle = isTrackedEntityTypeAttribute
    ? "Tracked entity type behavior"
    : "Program behavior";
  const successText = isTrackedEntityTypeAttribute
    ? "Tracked entity type attribute configuration updated."
    : "Program attribute configuration updated.";
  const error =
    trackedEntityAttributeState.error ||
    programAttributeState.error ||
    trackedEntityTypeAttributeState.error;
  const loading =
    trackedEntityAttributeState.loading ||
    programAttributeState.loading ||
    trackedEntityTypeAttributeState.loading;

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
          {contextTitle}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {programAttribute.displayName}
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
        {error && (
          <NoticeBox error title="Save failed">
            {error.message || "Unable to update attribute configuration."}
          </NoticeBox>
        )}
        {successMessage && (
          <NoticeBox valid title="Saved">
            {successMessage}
          </NoticeBox>
        )}

        <div
          style={{
            borderBottomStyle: "solid",
            borderBottomWidth: 0.7,
            borderBottomColor: colors.grey300,
            paddingBottom: spacers.dp16,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.grey900,
              marginBottom: spacers.dp12,
            }}
          >
            Attribute details
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacers.dp16,
            }}
          >
            <InputField
              required
              error={Boolean(nameValidationText)}
              inputWidth="100%"
              label="Name"
              validationText={nameValidationText}
              value={formValues.name}
              onChange={({ value }) => {
                setSuccessMessage(null);
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
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  shortName: value || "",
                }));
              }}
            />

            <SingleSelectField
              inputWidth="100%"
              label="Value type"
              selected={formValues.valueType}
              onChange={({ selected }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
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
              value={formValues.description}
              onChange={({ value }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  description: value || "",
                }));
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacers.dp16,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.grey900,
            }}
          >
            {behaviorTitle}
          </div>

          <CheckboxField
            checked={formValues.mandatory}
            label="Mandatory"
            helpText={
              isTrackedEntityTypeAttribute
                ? "Require this attribute when creating the tracked entity instance."
                : "Require this attribute during program enrollment."
            }
            onChange={({ checked }) => {
              setSuccessMessage(null);
              setFormValues((current) => ({
                ...current,
                mandatory: checked,
              }));
            }}
          />

          {!isTrackedEntityTypeAttribute && (
            <CheckboxField
              checked={formValues.searchable}
              label="Searchable"
              helpText="Make this attribute available in search for the program."
              onChange={({ checked }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  searchable: checked,
                }));
              }}
            />
          )}
        </div>
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
            disabled={Boolean(nameValidationText) || loading}
            loading={loading}
            onClick={async () => {
              const trackedEntityAttributePayload = {
                description: formValues.description,
                name: formValues.name.trim(),
                shortName: formValues.shortName.trim(),
                valueType: formValues.valueType,
              };
              const attributeBehaviorPayload = isTrackedEntityTypeAttribute
                ? {
                    mandatory: formValues.mandatory,
                  }
                : {
                    mandatory: formValues.mandatory,
                    searchable: formValues.searchable,
                  };

              try {
                await saveTrackedEntityAttribute({
                  id: programAttribute.id,
                  data: trackedEntityAttributePayload,
                });

                if (isTrackedEntityTypeAttribute) {
                  await saveTrackedEntityTypeAttribute({
                    id: programAttribute.trackedEntityTypeAttributeId,
                    data: attributeBehaviorPayload,
                  });
                } else {
                  await saveProgramAttribute({
                    id: programAttribute.programTrackedEntityAttributeId,
                    data: attributeBehaviorPayload,
                  });
                }

                setSuccessMessage(successText);
                onSaved({
                  ...programAttribute,
                  ...trackedEntityAttributePayload,
                  ...attributeBehaviorPayload,
                  displayName: trackedEntityAttributePayload.name,
                });
              } catch (saveError) {
                setSuccessMessage(null);
              }
            }}
          >
            Save
          </Button>
        </ButtonStrip>
      </div>
    </div>
  );
};
