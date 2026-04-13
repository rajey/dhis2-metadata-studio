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
        "name",
        "programType",
        "displayName",
        "shortName",
        "description",
        "displayIncidentDate",
        "enrollmentDateLabel",
        "incidentDateLabel",
        "onlyEnrollOnce",
        "programRules[id,name,displayName]",
        "selectEnrollmentDatesInFuture",
        "selectIncidentDatesInFuture",
        "useFirstStageDuringRegistration",
        "trackedEntityType[*,trackedEntityTypeAttributes[id,mandatory,sortOrder,trackedEntityAttribute[id,name,displayName,description,shortName,code,valueType,unique,optionSetValue]]]",
        "programStages[id,name,displayName,description,shortName,repeatable,programStageDataElements[id,compulsory,sortOrder,dataElement[id,name,code,displayName,description,shortName,valueType,optionSetValue]]]",
        "programTrackedEntityAttributes[id,mandatory,searchable,sortOrder,trackedEntityAttribute[id,name,displayName,description,shortName,code,valueType,unique,optionSetValue]]",
      ],
    },
  },
};

export const ProgramStudio = (props: {
  onAddProgramAttribute?: (programAttributeContext: any) => void;
  onAddProgramStage?: (programStageContext: any) => void;
  onAddProgramStageDataElement?: (programStageDataElementContext: any) => void;
  onEditProgram?: (program: any) => void;
  onEditProgramAttribute?: (programAttribute: any) => void;
  onEditProgramStageDataElement?: (programStageDataElement: any) => void;
  onEditProgramStage?: (programStage: any) => void;
  onEditTrackedEntityType?: (trackedEntityType: any) => void;
  onInspectNode?: (nodeSummary: any | null) => void;
  onRemoveProgram?: (program: any) => void;
  onRemoveTrackedEntityType?: (trackedEntityType: any) => void;
  onRemoveProgramStage?: (programStage: any) => void;
  programId: string;
  refreshToken?: number;
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  const {
    onAddProgramAttribute,
    onAddProgramStage,
    onAddProgramStageDataElement,
    onEditProgram,
    onEditProgramAttribute,
    onEditProgramStageDataElement,
    onEditProgramStage,
    onEditTrackedEntityType,
    onInspectNode,
    onRemoveProgram,
    onRemoveTrackedEntityType,
    onRemoveProgramStage,
    programId,
    refreshToken,
  } = props;

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
        data: {
          ...program.trackedEntityType,
          isFocused: focusedNodeId === program.trackedEntityType.id,
          onAddProgramAttribute,
          onEditProgramAttribute,
          onEditTrackedEntityType,
          onInspectNode: () => {
            setFocusedNodeId(program.trackedEntityType.id);
            onInspectNode?.({
              data: {
                ...program.trackedEntityType,
                programDisplayName: program.displayName,
                programId: program.id,
              },
              kind: "trackedEntityType",
            });
          },
          onRemoveTrackedEntityType,
          programDisplayName: program.displayName,
          programId: program.id,
        },
        position: { x: 0, y: programY },
        selected: focusedNodeId === program.trackedEntityType.id,
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
        data: {
          ...program,
          isFocused: focusedNodeId === program.id,
          onAddProgramAttribute,
          onEditProgram,
          onEditProgramAttribute,
          onInspectNode: () => {
            setFocusedNodeId(program.id);
            onInspectNode?.({
              data: program,
              kind: "program",
            });
          },
          onRemoveProgram,
        },
        position: { x: PROGRAM_NODE_X, y: programY },
        selected: focusedNodeId === program.id,
        type: "programNode",
      });
    }

    programStages.forEach((programStage, index) => {
      const stageNodeId = `program-stage-${programStage.id}`;

      nextNodes.push({
        id: stageNodeId,
        data: {
          ...programStage,
          isFocused: focusedNodeId === stageNodeId,
          onAddProgramStageDataElement,
          onEditProgram,
          onEditProgramStageDataElement,
          onEditProgramStage,
          onInspectNode: () => {
            setFocusedNodeId(stageNodeId);
            onInspectNode?.({
              data: {
                ...programStage,
                program,
                programDisplayName: program.displayName,
                programType: program.programType,
              },
              kind: "programStage",
            });
          },
          onRemoveProgram,
          onRemoveProgramStage,
          program,
          programDisplayName: program.displayName,
          programType: program.programType,
        },
        position: { x: stageNodeX, y: index * PROGRAM_STAGE_VERTICAL_GAP },
        selected: focusedNodeId === stageNodeId,
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

    if (isTrackerProgram || programStages.length === 0) {
      const placeholderNodeId = `program-stage-placeholder-${program.id}`;

      nextNodes.push({
        id: placeholderNodeId,
        data: {
          displayName: "Add program stage",
          onAddProgramStage,
          programDisplayName: program.displayName,
          programId: program.id,
        },
        position: {
          x: stageNodeX,
          y: programStages.length * PROGRAM_STAGE_VERTICAL_GAP,
        },
        type: "programStagePlaceholderNode",
      });

      if (showProgramNode) {
        nextEdges.push({
          id: `${program.id}-${placeholderNodeId}`,
          source: program.id,
          target: placeholderNodeId,
          style: {
            strokeDasharray: "4 4",
          },
        });
      }
    }

    return { nodes: nextNodes, edges: nextEdges };
  };

  useEffect(() => {
    if (!loading) {
      refetch({ programId });
    }
  }, [loading, programId, refetch, refreshToken]);

  useEffect(() => {
    if (data?.results) {
      const nextFlow = buildFlow(data.results);

      setNodes(nextFlow.nodes);
      setEdges(nextFlow.edges);
    }
  }, [data, focusedNodeId]);

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
  const onNodeClick = useCallback(
    (_event, node) => {
      if (node.type === "programStagePlaceholderNode") {
        return;
      }

      setFocusedNodeId(node.id);

      if (node.type === "programNode") {
        onInspectNode?.({
          data: node.data,
          kind: "program",
        });
        return;
      }

      if (node.type === "trackedEntityTypeNode") {
        onInspectNode?.({
          data: node.data,
          kind: "trackedEntityType",
        });
        return;
      }

      if (node.type === "programStageNode") {
        onInspectNode?.({
          data: node.data,
          kind: "programStage",
        });
      }
    },
    [onInspectNode],
  );
  const onPaneClick = useCallback(() => {
    setFocusedNodeId(null);
    onInspectNode?.(null);
  }, [onInspectNode]);

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
          onNodeClick={onNodeClick}
          onEdgesChange={onEdgesChange}
          onPaneClick={onPaneClick}
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
