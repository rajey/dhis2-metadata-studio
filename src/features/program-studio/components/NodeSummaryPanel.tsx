import { Query, useDataQuery } from "@dhis2/app-service-data";
import { colors, spacers } from "@dhis2/ui";
import React, { useMemo } from "react";

const trackedEntityTypeProgramsQuery: Query = {
  results: {
    resource: "programs",
    params: ({ trackedEntityTypeId }) => ({
      fields: ["id", "displayName"],
      filter: [`trackedEntityType.id:eq:${trackedEntityTypeId}`],
      paging: false,
    }),
  },
};

const relationshipTypesQuery: Query = {
  results: {
    resource: "relationshipTypes",
    params: {
      fields: [
        "id",
        "name",
        "displayName",
        "fromConstraint[relationshipEntity,program[id],programStage[id],trackedEntityType[id]]",
        "toConstraint[relationshipEntity,program[id],programStage[id],trackedEntityType[id]]",
      ],
      paging: false,
    },
  },
};

const normalizePrograms = (results: any) => {
  if (Array.isArray(results)) {
    return results;
  }

  if (Array.isArray(results?.programs)) {
    return results.programs;
  }

  return [];
};

const normalizeRelationshipTypes = (results: any) => {
  if (Array.isArray(results)) {
    return results;
  }

  if (Array.isArray(results?.relationshipTypes)) {
    return results.relationshipTypes;
  }

  return [];
};

const getRelationshipTypeDisplayName = (relationshipType: any) =>
  relationshipType?.displayName || relationshipType?.name || "Unnamed relationship";

const matchesRelationshipConstraint = (
  constraint: any,
  context: {
    programId?: string;
    programStageIds?: string[];
    trackedEntityTypeId?: string;
  },
) => {
  if (!constraint) {
    return false;
  }

  if (context.programId && constraint?.program?.id === context.programId) {
    return true;
  }

  if (
    context.trackedEntityTypeId &&
    constraint?.trackedEntityType?.id === context.trackedEntityTypeId
  ) {
    return true;
  }

  if (
    context.programStageIds?.length &&
    constraint?.programStage?.id &&
    context.programStageIds.includes(constraint.programStage.id)
  ) {
    return true;
  }

  return false;
};

const filterRelationshipTypes = (
  relationshipTypes: any[],
  context: {
    programId?: string;
    programStageIds?: string[];
    trackedEntityTypeId?: string;
  },
) =>
  relationshipTypes.filter((relationshipType) =>
    matchesRelationshipConstraint(relationshipType?.fromConstraint, context) ||
    matchesRelationshipConstraint(relationshipType?.toConstraint, context),
  );

const Section = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: spacers.dp8,
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: colors.grey900,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const MetricGrid = ({ metrics }: { metrics: { label: string; value: string | number }[] }) => (
  <div
    style={{
      display: "grid",
      gap: spacers.dp8,
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    }}
  >
    {metrics.map((metric) => (
      <div
        key={metric.label}
        style={{
          border: `1px solid ${colors.grey300}`,
          borderRadius: 4,
          padding: spacers.dp8,
          backgroundColor: colors.grey100,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: colors.grey700,
          }}
        >
          {metric.label}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.grey900,
            marginTop: spacers.dp4,
          }}
        >
          {metric.value}
        </div>
      </div>
    ))}
  </div>
);

const SummaryList = ({
  emptyLabel,
  items,
}: {
  emptyLabel: string;
  items: string[];
}) => (
  <div
    style={{
      border: `1px solid ${colors.grey300}`,
      borderRadius: 4,
      overflow: "hidden",
    }}
  >
    {items.length === 0 ? (
      <div
        style={{
          padding: spacers.dp8,
          fontSize: 12,
          color: colors.grey700,
        }}
      >
        {emptyLabel}
      </div>
    ) : (
      items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          style={{
            padding: spacers.dp8,
            fontSize: 12,
            color: colors.grey900,
            borderTop: index === 0 ? "none" : `1px solid ${colors.grey300}`,
          }}
        >
          {item}
        </div>
      ))
    )}
  </div>
);

const PanelShell = ({
  children,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  subtitle: string;
  title: string;
}) => (
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
        {subtitle}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: colors.grey900,
          marginTop: spacers.dp4,
        }}
      >
        {title}
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
      {children}
    </div>
  </div>
);

const TrackedEntityTypeSummary = ({ data }: { data: any }) => {
  const { data: referencedProgramsData } = useDataQuery(
    trackedEntityTypeProgramsQuery,
    {
      variables: {
        trackedEntityTypeId: data.id,
      },
    },
  );
  const referencedPrograms = useMemo(
    () => normalizePrograms(referencedProgramsData?.results),
    [referencedProgramsData],
  );
  const attributes = useMemo(
    () =>
      (data.trackedEntityTypeAttributes || [])
        .slice()
        .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0)),
    [data.trackedEntityTypeAttributes],
  );

  return (
    <PanelShell subtitle="Tracked entity type summary" title={data.displayName}>
      <Section title="Details">
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Short name: {data.shortName || "Not set"}
        </div>
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Description: {data.description || "No description"}
        </div>
      </Section>

      <Section title="Metrics">
        <MetricGrid
          metrics={[
            {
              label: "Programs",
              value: referencedPrograms.length,
            },
            {
              label: "Attributes",
              value: attributes.length,
            },
            {
              label: "Mandatory attributes",
              value: attributes.filter((attribute) => attribute.mandatory).length,
            },
            {
              label: "Optional attributes",
              value: attributes.filter((attribute) => !attribute.mandatory).length,
            },
          ]}
        />
      </Section>

      <Section title="Associated programs">
        <SummaryList
          emptyLabel="No programs found for this tracked entity type."
          items={referencedPrograms.map((program) => program.displayName)}
        />
      </Section>

      <Section title="Attributes">
        <SummaryList
          emptyLabel="No tracked entity attributes assigned."
          items={attributes.map(
            (attribute) =>
              attribute?.trackedEntityAttribute?.displayName ||
              attribute?.trackedEntityAttribute?.name,
          )}
        />
      </Section>
    </PanelShell>
  );
};

const ProgramSummary = ({ data }: { data: any }) => {
  const { data: relationshipTypesData } = useDataQuery(relationshipTypesQuery);
  const directAttributes = data.programTrackedEntityAttributes || [];
  const inheritedAttributes = data.trackedEntityType?.trackedEntityTypeAttributes || [];
  const programStages = data.programStages || [];
  const totalDataElements = programStages.reduce(
    (count, programStage) =>
      count + ((programStage.programStageDataElements || []).length || 0),
    0,
  );
  const relationshipTypes = useMemo(
    () =>
      normalizeRelationshipTypes(relationshipTypesData?.results),
    [relationshipTypesData],
  );
  const relatedRelationshipTypes = useMemo(
    () =>
      filterRelationshipTypes(relationshipTypes, {
        programId: data.id,
        programStageIds: programStages.map((programStage) => programStage.id),
        trackedEntityTypeId: data.trackedEntityType?.id,
      }),
    [data.id, data.trackedEntityType?.id, programStages, relationshipTypes],
  );

  return (
    <PanelShell subtitle="Program summary" title={data.displayName}>
      <Section title="Details">
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Type:{" "}
          {data.programType === "WITH_REGISTRATION"
            ? "Tracker program"
            : "Event program"}
        </div>
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Short name: {data.shortName || "Not set"}
        </div>
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Description: {data.description || "No description"}
        </div>
        {data.trackedEntityType && (
          <div style={{ fontSize: 12, color: colors.grey800 }}>
            Tracked entity type: {data.trackedEntityType.displayName}
          </div>
        )}
      </Section>

      <Section title="Metrics">
        <MetricGrid
          metrics={[
            {
              label: "Stages",
              value: programStages.length,
            },
            {
              label: "Direct attributes",
              value: directAttributes.length,
            },
            {
              label: "Inherited attributes",
              value: inheritedAttributes.length,
            },
            {
              label: "Program rules",
              value: (data.programRules || []).length,
            },
            {
              label: "Relationships",
              value: relatedRelationshipTypes.length,
            },
            {
              label: "Data elements",
              value: totalDataElements,
            },
            {
              label: "Repeatable stages",
              value: programStages.filter((programStage) => programStage.repeatable)
                .length,
            },
          ]}
        />
      </Section>

      <Section title="Program stages">
        <SummaryList
          emptyLabel="No program stages assigned."
          items={programStages.map(
            (programStage) => programStage.displayName || programStage.name,
          )}
        />
      </Section>

      <Section title="Attributes">
        <SummaryList
          emptyLabel="No direct program attributes assigned."
          items={directAttributes.map(
            (attribute) =>
              attribute?.trackedEntityAttribute?.displayName ||
              attribute?.trackedEntityAttribute?.name,
          )}
        />
      </Section>

      <Section title="Rules and relationships">
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Program rules configured: {(data.programRules || []).length}
        </div>
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Relationship types linked: {relatedRelationshipTypes.length}
        </div>
        <SummaryList
          emptyLabel="No relationship types linked to this program context."
          items={relatedRelationshipTypes.map(getRelationshipTypeDisplayName)}
        />
      </Section>
    </PanelShell>
  );
};

const ProgramStageSummary = ({ data }: { data: any }) => {
  const { data: relationshipTypesData } = useDataQuery(relationshipTypesQuery);
  const dataElements = useMemo(
    () =>
      (data.programStageDataElements || [])
        .slice()
        .sort((left, right) => (left.sortOrder || 0) - (right.sortOrder || 0)),
    [data.programStageDataElements],
  );
  const compulsoryCount = dataElements.filter(
    (dataElement) => dataElement.compulsory,
  ).length;
  const relationshipTypes = useMemo(
    () =>
      normalizeRelationshipTypes(relationshipTypesData?.results),
    [relationshipTypesData],
  );
  const relatedRelationshipTypes = useMemo(
    () =>
      filterRelationshipTypes(relationshipTypes, {
        programId: data.program?.id,
        programStageIds: [data.id],
        trackedEntityTypeId: data.program?.trackedEntityType?.id,
      }),
    [data.id, data.program?.id, data.program?.trackedEntityType?.id, relationshipTypes],
  );

  return (
    <PanelShell subtitle="Program stage summary" title={data.displayName}>
      <Section title="Details">
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Program: {data.programDisplayName || data.program?.displayName || "Unknown"}
        </div>
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Short name: {data.shortName || "Not set"}
        </div>
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Repeatable: {data.repeatable ? "Yes" : "No"}
        </div>
        <div style={{ fontSize: 12, color: colors.grey800 }}>
          Description: {data.description || "No description"}
        </div>
      </Section>

      <Section title="Metrics">
        <MetricGrid
          metrics={[
            {
              label: "Data elements",
              value: dataElements.length,
            },
            {
              label: "Compulsory",
              value: compulsoryCount,
            },
            {
              label: "Optional",
              value: dataElements.length - compulsoryCount,
            },
            {
              label: "Option sets",
              value: dataElements.filter((dataElement) => dataElement.dataElement?.optionSetValue)
                .length,
            },
            {
              label: "Relationships",
              value: relatedRelationshipTypes.length,
            },
          ]}
        />
      </Section>

      <Section title="Data elements">
        <SummaryList
          emptyLabel="No data elements assigned."
          items={dataElements.map((dataElement) => {
            const displayName =
              dataElement?.dataElement?.displayName || dataElement?.dataElement?.name;
            return dataElement.compulsory
              ? `${displayName} (Compulsory)`
              : displayName;
          })}
        />
      </Section>

      <Section title="Relationships">
        <SummaryList
          emptyLabel="No relationship types linked to this stage context."
          items={relatedRelationshipTypes.map(getRelationshipTypeDisplayName)}
        />
      </Section>
    </PanelShell>
  );
};

export const NodeSummaryPanel = (props: {
  nodeSummary?: { data: any; kind: "program" | "programStage" | "trackedEntityType" } | null;
}) => {
  const { nodeSummary } = props;

  if (!nodeSummary) {
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
          Click a node to inspect its summary, or use an action to edit metadata.
        </div>
      </div>
    );
  }

  if (nodeSummary.kind === "trackedEntityType") {
    return <TrackedEntityTypeSummary data={nodeSummary.data} />;
  }

  if (nodeSummary.kind === "programStage") {
    return <ProgramStageSummary data={nodeSummary.data} />;
  }

  return <ProgramSummary data={nodeSummary.data} />;
};
