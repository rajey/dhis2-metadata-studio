import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import React, { use, useCallback, useEffect, useState } from "react";
import {
  Center,
  CircularLoader,
  colors,
  Layer,
  LinearLoader,
  spacers,
} from "@dhis2/ui";
import { Query, useDataQuery } from "@dhis2/app-service-data";

const ProgramNode = () => {
  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderStyle: "solid",
        borderWidth: 0.7,
        borderColor: colors.grey400,
        borderRadius: 1,
        width: 160,
      }}
    >
      <div
        style={{
          padding: spacers.dp4,
          borderBottomStyle: "solid",
          borderBottomWidth: 0.7,
          borderBottomColor: colors.grey300,
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: 10,
            marginBottom: 2,
          }}
        >
          Program name
        </div>
        <div
          style={{
            color: "gray",
            fontSize: 8,
          }}
        >
          Tracked entity type
        </div>
      </div>

      <div
        style={{
          padding: spacers.dp4,
          borderBottomStyle: "solid",
          borderBottomWidth: 0.7,
          borderBottomColor: colors.grey300,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            marginBottom: spacers.dp4,
          }}
        >
          Attributes
        </div>
        <ul>
          <li
            style={{
              borderStyle: "solid",
              borderColor: colors.teal200,
              borderWidth: 0.5,
              borderRadius: 1,
              padding: 4,
              fontSize: 6,
              marginBottom: 2,
            }}
          >
            Name
          </li>
          <li
            style={{
              borderStyle: "solid",
              borderColor: colors.teal200,
              borderWidth: 0.5,
              borderRadius: 1,
              padding: 4,
              fontSize: 6,
              marginBottom: 2,
            }}
          >
            Sex
          </li>
          <li
            style={{
              borderStyle: "solid",
              borderColor: colors.teal200,
              borderWidth: 0.5,
              borderRadius: 1,
              padding: 4,
              fontSize: 6,
              marginBottom: 2,
            }}
          >
            Date of birth
          </li>
        </ul>
      </div>

      <div style={{ padding: spacers.dp4 }}>
        <div
          style={{
            fontSize: 8,
            fontWeight: "bold",
            marginTop: spacers.dp4,
            marginBottom: spacers.dp8,
          }}
        >
          Stages
        </div>
        <div style={{}}>
          <div
            style={{
              fontSize: 7,
              fontWeight: 500,
              marginBottom: spacers.dp4,
            }}
          >
            Medication (Repeatable)
          </div>
          <ul>
            <li
              style={{
                borderStyle: "solid",
                borderColor: colors.teal200,
                borderWidth: 0.5,
                borderRadius: 1,
                padding: 4,
                fontSize: 6,
                marginBottom: 2,
              }}
            >
              Date of medication
            </li>
            <li
              style={{
                borderStyle: "solid",
                borderColor: colors.teal200,
                borderWidth: 0.5,
                borderRadius: 1,
                padding: 4,
                fontSize: 6,
                marginBottom: 2,
              }}
            >
              Type of medication
            </li>
            <li
              style={{
                borderStyle: "solid",
                borderColor: colors.teal200,
                borderWidth: 0.5,
                borderRadius: 1,
                padding: 4,
                fontSize: 6,
                marginBottom: 2,
              }}
            >
              Dosage
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const initialNodes = [
  {
    id: "n1",
    data: { label: "Node 1" },
    position: { x: 0, y: 0 },
    type: "programNode",
  },
  {
    id: "n2",
    data: { label: "Node 2" },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

const programQuery: Query = {
  results: {
    resource: "programs",
    id: ({ programId }) => programId,
    params: {
      fields: [
        "id",
        "displayName",
        "trackedEntityType[*]",
        "programStages[id,displayName,repeatable,programStageDataElements[dataElement[id,displayName]]]",
        "programTrackedEntityAttributes[trackedEntityAttribute[id,displayName]]",
      ],
    },
  },
};

export const ProgramDesign = (props: { programId: string }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const { programId } = props;

  const { loading, data, error, refetch } = useDataQuery(programQuery, {
    variables: {
      programId,
    },
  });

  useEffect(() => {
    if (!loading) {
      refetch({ id: programId });
    }
  }, [programId]);

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
      <ReactFlow
        nodes={nodes}
        nodeTypes={{
          programNode: ProgramNode,
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
    </>
  );
};
