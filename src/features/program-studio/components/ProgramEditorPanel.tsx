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

const updateProgramMutation = {
  resource: "programs",
  id: ({ id }) => id,
  type: "update",
  partial: true,
  data: ({ data }) => data,
};

const PROGRAM_TYPE_OPTIONS = [
  {
    label: "Tracker program",
    value: "WITH_REGISTRATION",
  },
  {
    label: "Event program",
    value: "WITHOUT_REGISTRATION",
  },
];

export const ProgramEditorPanel = (props: {
  onClose: () => void;
  onSaved: (program: any) => void;
  program?: any | null;
}) => {
  const { onClose, onSaved, program } = props;
  const [formValues, setFormValues] = useState({
    description: "",
    displayIncidentDate: true,
    enrollmentDateLabel: "",
    incidentDateLabel: "",
    name: "",
    onlyEnrollOnce: false,
    programType: "WITH_REGISTRATION",
    selectEnrollmentDatesInFuture: false,
    selectIncidentDatesInFuture: false,
    shortName: "",
    useFirstStageDuringRegistration: false,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [saveProgram, { error, loading }] = useDataMutation(updateProgramMutation);

  useEffect(() => {
    setSuccessMessage(null);
    setFormValues({
      description: program?.description || "",
      displayIncidentDate: program?.displayIncidentDate ?? true,
      enrollmentDateLabel: program?.enrollmentDateLabel || "",
      incidentDateLabel: program?.incidentDateLabel || "",
      name: program?.name || program?.displayName || "",
      onlyEnrollOnce: program?.onlyEnrollOnce ?? false,
      programType: program?.programType || "WITH_REGISTRATION",
      selectEnrollmentDatesInFuture:
        program?.selectEnrollmentDatesInFuture ?? false,
      selectIncidentDatesInFuture: program?.selectIncidentDatesInFuture ?? false,
      shortName: program?.shortName || "",
      useFirstStageDuringRegistration:
        program?.useFirstStageDuringRegistration ?? false,
    });
  }, [program]);

  const nameValidationText = useMemo(() => {
    if (!formValues.name.trim()) {
      return "Program name is required";
    }

    return undefined;
  }, [formValues.name]);
  const isTrackerProgram = formValues.programType === "WITH_REGISTRATION";

  if (!program) {
    return (
      <div
        style={{
          padding: spacers.dp16,
          color: colors.grey700,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: spacers.dp8,
          }}
        >
          Toolbar
        </div>
        <div style={{ fontSize: 14 }}>
          Select a program edit action to configure metadata here.
        </div>
      </div>
    );
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
          Program configuration
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {program.displayName}
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
            {error.message || "Unable to update program configuration."}
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

        <SingleSelectField
          inputWidth="100%"
          label="Program type"
          selected={formValues.programType}
          onChange={({ selected }) => {
            setSuccessMessage(null);
            setFormValues((current) => ({
              ...current,
              programType: selected,
            }));
          }}
        >
          {PROGRAM_TYPE_OPTIONS.map((option) => (
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
                Enrollment information
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: colors.grey700,
                  marginTop: spacers.dp4,
                }}
              >
                Configure the tracker enrollment experience.
              </div>
            </div>

            <CheckboxField
              checked={formValues.onlyEnrollOnce}
              label="Only enroll once"
              helpText="Prevent multiple enrollments of the same tracked entity in this program."
              onChange={({ checked }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  onlyEnrollOnce: checked,
                }));
              }}
            />

            <CheckboxField
              checked={formValues.useFirstStageDuringRegistration}
              label="Use first stage during registration"
              helpText="Capture the first stage immediately as part of registration."
              onChange={({ checked }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  useFirstStageDuringRegistration: checked,
                }));
              }}
            />

            <CheckboxField
              checked={formValues.selectEnrollmentDatesInFuture}
              label="Allow future enrollment dates"
              onChange={({ checked }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  selectEnrollmentDatesInFuture: checked,
                }));
              }}
            />

            <InputField
              inputWidth="100%"
              label="Enrollment date label"
              value={formValues.enrollmentDateLabel}
              onChange={({ value }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  enrollmentDateLabel: value || "",
                }));
              }}
            />

            <CheckboxField
              checked={formValues.displayIncidentDate}
              label="Show incident date"
              helpText="Enable a separate incident date in enrollment forms."
              onChange={({ checked }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  displayIncidentDate: checked,
                }));
              }}
            />

            <CheckboxField
              checked={formValues.selectIncidentDatesInFuture}
              disabled={!formValues.displayIncidentDate}
              label="Allow future incident dates"
              onChange={({ checked }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  selectIncidentDatesInFuture: checked,
                }));
              }}
            />

            <InputField
              disabled={!formValues.displayIncidentDate}
              inputWidth="100%"
              label="Incident date label"
              value={formValues.incidentDateLabel}
              onChange={({ value }) => {
                setSuccessMessage(null);
                setFormValues((current) => ({
                  ...current,
                  incidentDateLabel: value || "",
                }));
              }}
            />
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
            disabled={Boolean(nameValidationText) || loading}
            loading={loading}
            onClick={async () => {
              const payload = {
                description: formValues.description,
                displayIncidentDate: formValues.displayIncidentDate,
                enrollmentDateLabel: formValues.enrollmentDateLabel.trim(),
                incidentDateLabel: formValues.incidentDateLabel.trim(),
                name: formValues.name.trim(),
                onlyEnrollOnce: formValues.onlyEnrollOnce,
                programType: formValues.programType,
                selectEnrollmentDatesInFuture:
                  formValues.selectEnrollmentDatesInFuture,
                selectIncidentDatesInFuture:
                  formValues.selectIncidentDatesInFuture,
                shortName:
                  formValues.shortName.trim() || program.shortName || "",
                useFirstStageDuringRegistration:
                  formValues.useFirstStageDuringRegistration,
              };

              try {
                await saveProgram({
                  id: program.id,
                  data: payload,
                });

                setSuccessMessage("Program configuration updated.");
                onSaved({
                  ...program,
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
