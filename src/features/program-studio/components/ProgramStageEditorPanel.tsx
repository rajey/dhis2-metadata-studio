import { useDataMutation } from "@dhis2/app-service-data";
import {
  Button,
  ButtonStrip,
  CheckboxField,
  colors,
  InputField,
  NoticeBox,
  spacers,
  TextAreaField,
} from "@dhis2/ui";
import React, { useEffect, useMemo, useState } from "react";

const updateProgramStageMutation = {
  resource: "programStages",
  id: ({ id }) => id,
  type: "update",
  partial: true,
  data: ({ data }) => data,
};

export const ProgramStageEditorPanel = (props: {
  onClose: () => void;
  onSaved: (programStage: any) => void;
  programStage?: any | null;
}) => {
  const { onClose, onSaved, programStage } = props;
  const [formValues, setFormValues] = useState({
    description: "",
    name: "",
    repeatable: false,
    shortName: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [saveProgramStage, { error, loading }] = useDataMutation(
    updateProgramStageMutation
  );

  useEffect(() => {
    setSuccessMessage(null);
    setFormValues({
      description: programStage?.description || "",
      name: programStage?.name || programStage?.displayName || "",
      repeatable: programStage?.repeatable ?? false,
      shortName: programStage?.shortName || "",
    });
  }, [programStage]);

  const nameValidationText = useMemo(() => {
    if (!formValues.name.trim()) {
      return "Program stage name is required";
    }

    return undefined;
  }, [formValues.name]);

  if (!programStage) {
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
          Program stage configuration
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {programStage.displayName}
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
            {error.message || "Unable to update program stage configuration."}
          </NoticeBox>
        )}
        {successMessage && (
          <NoticeBox valid title="Saved">
            {successMessage}
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

        <CheckboxField
          checked={formValues.repeatable}
          label="Repeatable stage"
          helpText="Allow this stage to be completed more than once."
          onChange={({ checked }) => {
            setSuccessMessage(null);
            setFormValues((current) => ({
              ...current,
              repeatable: checked,
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
            setSuccessMessage(null);
            setFormValues((current) => ({
              ...current,
              description: value || "",
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
              const payload = {
                description: formValues.description,
                name: formValues.name.trim(),
                repeatable: formValues.repeatable,
                shortName:
                  formValues.shortName.trim() || programStage.shortName || "",
              };

              try {
                await saveProgramStage({
                  id: programStage.id,
                  data: payload,
                });

                setSuccessMessage("Program stage configuration updated.");
                onSaved({
                  ...programStage,
                  ...payload,
                  displayName: payload.name,
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
