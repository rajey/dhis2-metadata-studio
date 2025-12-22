import { Query, useDataQuery } from "@dhis2/app-service-data";
import { Center, CircularLoader, Layer } from "@dhis2/ui";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import "./ProgramDesign.css";
import { ProgramNode } from "./ProgramNode";
import { TrackedEntityTypeNode } from "./TrackedEntityTypeNode";

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
        "programStages[id,displayName,shortName,repeatable,programStageDataElements[dataElement[id,code,displayName,shortName,valueType,optionSetValue]]]",
        "programTrackedEntityAttributes[trackedEntityAttribute[id,shortName,displayName,valueType,unique,optionSetValue]]",
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
          position: { x: 200, y: 50 },
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
