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

const updateDataElementMutation = {
  resource: "dataElements",
  id: ({ id }) => id,
  type: "update",
  partial: true,
  data: ({ data }) => data,
};

const updateProgramStageDataElementMutation = {
  resource: "programStageDataElements",
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

export const ProgramStageDataElementEditorPanel = (props: {
  onClose: () => void;
  onSaved: (programStageDataElement: any) => void;
  programStageDataElement?: any | null;
}) => {
  const { onClose, onSaved, programStageDataElement } = props;
  const [formValues, setFormValues] = useState({
    code: "",
    compulsory: false,
    description: "",
    name: "",
    shortName: "",
    valueType: "TEXT",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [saveDataElement, dataElementState] = useDataMutation(
    updateDataElementMutation
  );
  const [saveProgramStageDataElement, programStageDataElementState] =
    useDataMutation(updateProgramStageDataElementMutation);

  useEffect(() => {
    setSuccessMessage(null);
    setFormValues({
      code: programStageDataElement?.code || "",
      compulsory: programStageDataElement?.compulsory ?? false,
      description: programStageDataElement?.description || "",
      name:
        programStageDataElement?.name ||
        programStageDataElement?.displayName ||
        "",
      shortName: programStageDataElement?.shortName || "",
      valueType: programStageDataElement?.valueType || "TEXT",
    });
  }, [programStageDataElement]);

  const nameValidationText = useMemo(() => {
    if (!formValues.name.trim()) {
      return "Data element name is required";
    }

    return undefined;
  }, [formValues.name]);

  if (!programStageDataElement) {
    return null;
  }

  const error = dataElementState.error || programStageDataElementState.error;
  const loading = dataElementState.loading || programStageDataElementState.loading;

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
          Program stage data element
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {programStageDataElement.displayName}
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
            {error.message || "Unable to update data element configuration."}
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
            Data element details
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

            <InputField
              inputWidth="100%"
              label="Code"
              value={formValues.code}
              onChange={({ value }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  code: value || "",
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

        <CheckboxField
          checked={formValues.compulsory}
          label="Compulsory"
          helpText="Require this data element within the stage form."
          onChange={({ checked }) => {
            setSuccessMessage(null);
            setFormValues((current) => ({
              ...current,
              compulsory: checked,
            }));
          }}
        />
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
              const dataElementPayload = {
                code: formValues.code.trim(),
                description: formValues.description,
                name: formValues.name.trim(),
                shortName: formValues.shortName.trim(),
                valueType: formValues.valueType,
              };
              const programStageDataElementPayload = {
                compulsory: formValues.compulsory,
              };

              try {
                await saveDataElement({
                  id: programStageDataElement.id,
                  data: dataElementPayload,
                });
                await saveProgramStageDataElement({
                  id: programStageDataElement.programStageDataElementId,
                  data: programStageDataElementPayload,
                });

                setSuccessMessage("Program stage data element updated.");
                onSaved({
                  ...programStageDataElement,
                  ...dataElementPayload,
                  ...programStageDataElementPayload,
                  displayName: dataElementPayload.name,
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
