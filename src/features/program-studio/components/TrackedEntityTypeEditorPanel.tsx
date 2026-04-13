import { useDataMutation } from "@dhis2/app-service-data";
import {
  Button,
  ButtonStrip,
  colors,
  InputField,
  NoticeBox,
  spacers,
  TextAreaField,
} from "@dhis2/ui";
import React, { useEffect, useMemo, useState } from "react";

const updateTrackedEntityTypeMutation = {
  resource: "trackedEntityTypes",
  id: ({ id }) => id,
  type: "update",
  partial: true,
  data: ({ data }) => data,
};

export const TrackedEntityTypeEditorPanel = (props: {
  onClose: () => void;
  onSaved: (trackedEntityType: any) => void;
  trackedEntityType?: any | null;
}) => {
  const { onClose, onSaved, trackedEntityType } = props;
  const [formValues, setFormValues] = useState({
    description: "",
    name: "",
    shortName: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saveTrackedEntityType, { error, loading }] = useDataMutation(
    updateTrackedEntityTypeMutation,
  );

  useEffect(() => {
    setSuccessMessage(null);
    setFormValues({
      description: trackedEntityType?.description || "",
      name: trackedEntityType?.name || trackedEntityType?.displayName || "",
      shortName: trackedEntityType?.shortName || "",
    });
  }, [trackedEntityType]);

  const nameValidationText = useMemo(() => {
    if (!formValues.name.trim()) {
      return "Tracked entity type name is required";
    }

    return undefined;
  }, [formValues.name]);

  if (!trackedEntityType) {
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
          Tracked entity type
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {trackedEntityType.displayName}
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
            {error.message || "Unable to update tracked entity type."}
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
                shortName:
                  formValues.shortName.trim() || trackedEntityType.shortName || "",
              };

              try {
                await saveTrackedEntityType({
                  data: payload,
                  id: trackedEntityType.id,
                });

                setSuccessMessage("Tracked entity type updated.");
                onSaved({
                  ...trackedEntityType,
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
