import { Query, useDataQuery } from "@dhis2/app-service-data";
import { Center, CircularLoader, Layer } from "@dhis2/ui";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import {
  ProgramNode,
  ProgramStageNode,
  ProgramStagePlaceholderNode,
  TrackedEntityTypeNode,
} from "../components";

const nodeTypes = {
  programNode: ProgramNode,
  programStageNode: ProgramStageNode,
  programStagePlaceholderNode: ProgramStagePlaceholderNode,
  trackedEntityTypeNode: TrackedEntityTypeNode,
};

const PROGRAM_NODE_X = 260;
const PROGRAM_STAGE_NODE_X = 560;
const PROGRAM_STAGE_VERTICAL_GAP = 220;

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

export const ProgramStudio = (props: { programId: string }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { programId } = props;

  const { loading, data, error, refetch } = useDataQuery(programQuery, {
    variables: {
      programId,
    },
  });

  const buildFlow = (program): { nodes: Node[]; edges: Edge[] } => {
    const nextNodes: Node[] = [];
    const nextEdges: Edge[] = [];
    const programStages = [...(program.programStages || [])];
    const isTrackerProgram = program.programType === "WITH_REGISTRATION";
    const showProgramNode = isTrackerProgram;
    const stageNodeX = showProgramNode ? PROGRAM_STAGE_NODE_X : PROGRAM_NODE_X;
    const programY =
      programStages.length > 0
        ? ((programStages.length - 1) * PROGRAM_STAGE_VERTICAL_GAP) / 2
        : 0;

    if (program.trackedEntityType) {
      nextNodes.push({
        id: program.trackedEntityType.id,
        data: program.trackedEntityType,
        position: { x: 0, y: programY },
        type: "trackedEntityTypeNode",
      });

      if (showProgramNode) {
        nextEdges.push({
          id: `${program.trackedEntityType.id}-${program.id}`,
          source: program.trackedEntityType.id,
          target: program.id,
        });
      }
    }

    if (showProgramNode) {
      nextNodes.push({
        id: program.id,
        data: program,
        position: { x: PROGRAM_NODE_X, y: programY },
        type: "programNode",
      });
    }

    programStages.forEach((programStage, index) => {
      const stageNodeId = `program-stage-${programStage.id}`;

      nextNodes.push({
        id: stageNodeId,
        data: {
          ...programStage,
          programDisplayName: program.displayName,
          programType: program.programType,
        },
        position: { x: stageNodeX, y: index * PROGRAM_STAGE_VERTICAL_GAP },
        type: "programStageNode",
      });

      if (showProgramNode) {
        nextEdges.push({
          id: `${program.id}-${programStage.id}`,
          source: program.id,
          target: stageNodeId,
        });
      } else if (program.trackedEntityType) {
        nextEdges.push({
          id: `${program.trackedEntityType.id}-${programStage.id}`,
          source: program.trackedEntityType.id,
          target: stageNodeId,
        });
      }
    });

    if (isTrackerProgram) {
      const placeholderNodeId = `program-stage-placeholder-${program.id}`;

      nextNodes.push({
        id: placeholderNodeId,
        data: {
          displayName: "Add program stage",
          programId: program.id,
        },
        position: {
          x: stageNodeX,
          y: programStages.length * PROGRAM_STAGE_VERTICAL_GAP,
        },
        type: "programStagePlaceholderNode",
      });

      nextEdges.push({
        id: `${program.id}-${placeholderNodeId}`,
        source: program.id,
        target: placeholderNodeId,
        style: {
          strokeDasharray: "4 4",
        },
      });
    }

    return { nodes: nextNodes, edges: nextEdges };
  };

  useEffect(() => {
    if (!loading) {
      refetch({ programId });
    }
  }, [loading, programId, refetch]);

  useEffect(() => {
    if (data?.results) {
      const nextFlow = buildFlow(data.results);

      setNodes(nextFlow.nodes);
      setEdges(nextFlow.edges);
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
          nodeTypes={nodeTypes}
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
