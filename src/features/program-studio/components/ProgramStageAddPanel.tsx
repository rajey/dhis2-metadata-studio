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
import React, { useMemo, useState } from "react";

const createProgramStageMutation = {
  resource: "programStages",
  type: "create",
  data: ({ data }) => data,
};

export const ProgramStageAddPanel = (props: {
  onAdded: () => void;
  onClose: () => void;
  programStageContext?: any | null;
}) => {
  const { onAdded, onClose, programStageContext } = props;
  const [formValues, setFormValues] = useState({
    description: "",
    name: "",
    repeatable: false,
    shortName: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [createProgramStage, { error, loading }] = useDataMutation(
    createProgramStageMutation,
  );

  const nameValidationText = useMemo(() => {
    if (!formValues.name.trim()) {
      return "Program stage name is required";
    }

    return undefined;
  }, [formValues.name]);

  if (!programStageContext) {
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
          Add program stage
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {programStageContext.programDisplayName}
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
        {(localError || error) && (
          <NoticeBox error title="Create failed">
            {localError || error?.message || "Unable to create program stage."}
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

        <CheckboxField
          checked={formValues.repeatable}
          label="Repeatable stage"
          helpText="Allow this stage to be completed more than once."
          onChange={({ checked }) => {
            setLocalError(null);
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
            setLocalError(null);
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
              setLocalError(null);

              try {
                await createProgramStage({
                  data: {
                    description: formValues.description,
                    name: formValues.name.trim(),
                    program: { id: programStageContext.programId },
                    repeatable: formValues.repeatable,
                    shortName:
                      formValues.shortName.trim() || formValues.name.trim(),
                  },
                });

                onAdded();
              } catch (saveError) {
                setLocalError("The new program stage could not be created.");
              }
            }}
          >
            Create stage
          </Button>
        </ButtonStrip>
      </div>
    </div>
  );
};
