import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import {
  Center,
  CircularLoader,
  colors,
  Layer,
  LinearLoader,
  spacers,
  elevations,
  Menu,
  MenuItem,
  IconInfo16,
} from "@dhis2/ui";
import { Query, useDataQuery } from "@dhis2/app-service-data";
import { startCase } from "lodash";
import "./ProgramDesign.css";

const ProgramAttributeNode = (props: {
  hideTitle?: boolean;
  attributes: any[];
}) => {
  const { hideTitle, attributes } = props;
  return (
    <div
      style={{
        borderBottomStyle: "solid",
        borderBottomWidth: 0.7,
        borderBottomColor: colors.grey300,
      }}
    >
      {!hideTitle && (
        <div
          style={{
            fontSize: 6,
            padding: spacers.dp4,
            backgroundColor: colors.grey200,
            color: colors.grey800,
          }}
        >
          <div>Attributes</div>
          <div
            style={{
              fontSize: 6,
              fontStyle: "italic",
              color: colors.grey600,
              marginTop: spacers.dp4,
              display: "flex",
              alignItems: "center",
              gap: spacers.dp4,
            }}
          >
            <IconInfo16 />
            <span>
              Inherited attributes are hidden and can be viewed under tracked
              entity type node
            </span>
          </div>
        </div>
      )}
      <ul>
        {attributes.map((attribute) => {
          return (
            <li
              key={attribute.id}
              style={{
                borderTopStyle: "solid",
                borderTopColor: colors.green100,
                borderTopWidth: 0.6,
                padding: spacers.dp4,
                fontSize: 6,
              }}
            >
              {attribute.displayName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ProgramStageNode = ({ programType, programStages }) => {
  const isTrackerProgram = useMemo(() => {
    return programType === "WITH_REGISTRATION";
  }, [programType]);
  return (
    <div>
      {isTrackerProgram && (
        <div
          style={{
            padding: spacers.dp4,
            backgroundColor: colors.grey200,
            fontSize: 6,
            color: colors.grey800,
          }}
        >
          Stages
        </div>
      )}
      {programStages.map((programStage) => {
        return (
          <div key={programStage.id} style={{}}>
            {isTrackerProgram && (
              <div
                style={{
                  fontSize: 6,
                  fontWeight: 500,
                  padding: spacers.dp4,
                  backgroundColor: colors.teal100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>{programStage.displayName}</div>
                {programStage.repeatable && (
                  <div
                    style={{
                      fontWeight: 400,
                      color: colors.grey600,
                      fontSize: 5,
                    }}
                  >
                    Repeatable
                  </div>
                )}
              </div>
            )}
            <ul>
              {(programStage.programStageDataElements || []).map(
                (programStageDataElement) => {
                  return (
                    <li
                      key={programStageDataElement.dataElement?.id}
                      style={{
                        borderTopStyle: "solid",
                        borderTopColor: colors.green100,
                        borderTopWidth: 0.6,
                        padding: spacers.dp4,
                        fontSize: 6,
                      }}
                    >
                      {programStageDataElement.dataElement?.displayName}
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

const TrackedEntityTypeNode = ({ data, isConnectable }) => {
  const { displayName, trackedEntityTypeAttributes } = data;

  const attributes = useMemo(() => {
    return (trackedEntityTypeAttributes || []).map(
      (trackedEntityTypeAttribute) =>
        trackedEntityTypeAttribute.trackedEntityAttribute
    );
  }, [trackedEntityTypeAttributes]);

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderStyle: "solid",
        boxShadow: elevations.e400,
        borderWidth: 1,
        borderColor: colors.yellow300,
        borderRadius: 2,
        width: 160,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <div
        style={{
          padding: spacers.dp4,
          borderBottomStyle: "solid",
          borderBottomWidth: 0.7,
          borderBottomColor: colors.grey300,
          backgroundColor: colors.yellow100,
        }}
      >
        <div
          style={{
            color: "gray",
            fontSize: 5,
          }}
        >
          Tracked entity type
        </div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 10,
            marginBottom: 2,
          }}
        >
          {displayName}
        </div>
      </div>

      {attributes.length > 0 && (
        <ProgramAttributeNode hideTitle attributes={attributes} />
      )}
    </div>
  );
};

const ProgramNode = ({ data, isConnectable }) => {
  const {
    displayName,
    programType,
    programTrackedEntityAttributes,
    programStages,
    trackedEntityType,
  } = data;

  const isTrackerProgram = useMemo(() => {
    return programType === "WITH_REGISTRATION";
  }, [programType]);

  const attributes = useMemo(() => {
    return (programTrackedEntityAttributes || [])
      .map((programTrackedEntityAttribute) => {
        if (
          trackedEntityType.trackedEntityTypeAttributes?.some(
            (trackedEntityTypeAttribute) =>
              trackedEntityTypeAttribute?.trackedEntityAttribute?.id ===
              programTrackedEntityAttribute?.trackedEntityAttribute?.id
          )
        ) {
          return null;
        }
        return programTrackedEntityAttribute.trackedEntityAttribute;
      })
      .filter((attribute) => attribute !== null);
  }, [programTrackedEntityAttributes]);

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderStyle: "solid",
        boxShadow: elevations.e400,
        borderWidth: 1,
        borderColor: colors.teal500,
        borderRadius: 2,
        width: 160,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <div
        style={{
          padding: spacers.dp4,
          borderBottomStyle: "solid",
          borderBottomWidth: 0.7,
          borderBottomColor: colors.grey300,
          backgroundColor: colors.teal100,
        }}
      >
        <div
          style={{
            color: "gray",
            fontSize: 5,
          }}
        >
          {isTrackerProgram ? "Tracker Program" : "Event Program"}
        </div>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 10,
            marginBottom: 2,
          }}
        >
          {displayName}
        </div>
      </div>

      {attributes.length > 0 && (
        <ProgramAttributeNode attributes={attributes} />
      )}

      <ProgramStageNode
        programType={programType}
        programStages={programStages}
      />
    </div>
  );
};

const programQuery: Query = {
  results: {
    resource: "programs",
    id: ({ programId }) => programId,
    params: {
      fields: [
        "id",
        "programType",
        "displayName",
        "trackedEntityType[*,trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName,shortName,valueType]]]",
        "programStages[id,displayName,shortName,repeatable,programStageDataElements[dataElement[id,code,displayName,shortName,valueType]]]",
        "programTrackedEntityAttributes[trackedEntityAttribute[id,shortName,displayName,valueType]]",
      ],
    },
  },
};

export const ProgramDesign = (props: { programId: string }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const { programId } = props;

  const { loading, data, error, refetch } = useDataQuery(programQuery, {
    variables: {
      programId,
    },
  });

  useEffect(() => {
    if (!loading) {
      refetch({ programId });
    }
  }, [programId]);

  useEffect(() => {
    if (data?.results) {
      const {
        id,
        displayName,
        trackedEntityType,
        programTrackedEntityAttributes,
      } = data.results as any;

      let nodes = [];
      let edges = [];

      if (trackedEntityType) {
        // Set tracked entity type node
        nodes = [
          ...nodes,
          {
            id: trackedEntityType.id,
            data: trackedEntityType,
            position: { x: 0, y: 0 },
            type: "trackedEntityTypeNode",
          },
        ];

        // Set edges from tracked entity type to program
        edges = [
          ...edges,
          {
            id: `${trackedEntityType.id}-${id}`,
            source: trackedEntityType.id,
            target: id,
          },
        ];
      }

      // Set program node
      nodes = [
        ...nodes,
        {
          id,
          data: data.results,
          position: { x: 150, y: 100 },
          type: "programNode",
        },
      ];

      setNodes(nodes);
      setEdges(edges);
    }
  }, [data]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <>
      {loading && (
        <Layer level={3000} translucent>
          <Center>
            <CircularLoader />
          </Center>
        </Layer>
      )}
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          nodeTypes={{
            programNode: ProgramNode,
            trackedEntityTypeNode: TrackedEntityTypeNode,
          }}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </>
  );
};
