import { Query, useDataQuery } from "@dhis2/app-service-data";
import {
  Center,
  CheckboxField,
  CircularLoader,
  colors,
  elevations,
  Layer,
  spacers,
} from "@dhis2/ui";
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
const PROGRAM_BRANCH_GAP = 140;

const PROGRAM_FIELDS = [
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
];

const programQuery: Query = {
  results: {
    resource: "programs",
    id: ({ programId }) => programId,
    params: {
      fields: PROGRAM_FIELDS,
    },
  },
};

const associatedProgramsQuery: Query = {
  results: {
    resource: "programs",
    params: ({ trackedEntityTypeId }) => ({
      fields: PROGRAM_FIELDS,
      filter: trackedEntityTypeId
        ? [`trackedEntityType.id:eq:${trackedEntityTypeId}`]
        : ["id:eq:__none__"],
      paging: false,
    }),
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
  const [showAssociatedPrograms, setShowAssociatedPrograms] = useState(false);

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
  const primaryProgram = data?.results;
  const trackedEntityTypeId = primaryProgram?.trackedEntityType?.id;
  const {
    loading: loadingAssociatedPrograms,
    data: associatedProgramsData,
    refetch: refetchAssociatedPrograms,
  } = useDataQuery(associatedProgramsQuery, {
    variables: {
      trackedEntityTypeId,
    },
  });

  const associatedPrograms = (associatedProgramsData?.results?.programs || [])
    .filter((associatedProgram) => associatedProgram.id !== primaryProgram?.id)
    .sort((left, right) =>
      (left.displayName || "").localeCompare(right.displayName || ""),
    );
  const canShowAssociatedPrograms =
    Boolean(trackedEntityTypeId) && associatedPrograms.length > 0;

  const buildFlow = (
    program,
    relatedPrograms = [],
  ): { nodes: Node[]; edges: Edge[] } => {
    const nextNodes: Node[] = [];
    const nextEdges: Edge[] = [];
    const programsToRender = [program, ...relatedPrograms];
    const branchLayouts = programsToRender.map((branchProgram, index) => {
      const branchProgramStages = [...(branchProgram.programStages || [])];
      const isBranchTrackerProgram =
        branchProgram.programType === "WITH_REGISTRATION";
      const stageSlots = Math.max(
        branchProgramStages.length + (isBranchTrackerProgram ? 1 : 0),
        1,
      );
      const branchTopY =
        index === 0
          ? 0
          : programsToRender
              .slice(0, index)
              .reduce((totalHeight, previousProgram) => {
                const previousStageSlots = Math.max(
                  (previousProgram.programStages || []).length +
                    (previousProgram.programType === "WITH_REGISTRATION" ? 1 : 0),
                  1,
                );

                return (
                  totalHeight +
                  previousStageSlots * PROGRAM_STAGE_VERTICAL_GAP +
                  PROGRAM_BRANCH_GAP
                );
              }, 0);
      const branchProgramY =
        branchTopY +
        (branchProgramStages.length > 0
          ? ((branchProgramStages.length - 1) * PROGRAM_STAGE_VERTICAL_GAP) / 2
          : 0);

      return {
        branchTopY,
        isBranchTrackerProgram,
        program: branchProgram,
        programY: branchProgramY,
        stageSlots,
        stages: branchProgramStages,
      };
    });

    const trackedEntityTypeY =
      branchLayouts.length > 0
        ? (branchLayouts[0].programY +
            branchLayouts[branchLayouts.length - 1].programY) /
          2
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
        position: { x: 0, y: trackedEntityTypeY },
        selected: focusedNodeId === program.trackedEntityType.id,
        type: "trackedEntityTypeNode",
      });
    }

    branchLayouts.forEach(
      ({ branchTopY, isBranchTrackerProgram, program: branchProgram, programY, stages }) => {
        const showProgramNode = isBranchTrackerProgram;
        const stageNodeX = showProgramNode ? PROGRAM_STAGE_NODE_X : PROGRAM_NODE_X;

        if (program.trackedEntityType && showProgramNode) {
          nextEdges.push({
            id: `${program.trackedEntityType.id}-${branchProgram.id}`,
            source: program.trackedEntityType.id,
            target: branchProgram.id,
          });
        }

        if (showProgramNode) {
          nextNodes.push({
            id: branchProgram.id,
            data: {
              ...branchProgram,
              isFocused: focusedNodeId === branchProgram.id,
              onAddProgramAttribute,
              onEditProgram,
              onEditProgramAttribute,
              onInspectNode: () => {
                setFocusedNodeId(branchProgram.id);
                onInspectNode?.({
                  data: branchProgram,
                  kind: "program",
                });
              },
              onRemoveProgram,
            },
            position: { x: PROGRAM_NODE_X, y: programY },
            selected: focusedNodeId === branchProgram.id,
            type: "programNode",
          });
        }

        stages.forEach((programStage, index) => {
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
                    program: branchProgram,
                    programDisplayName: branchProgram.displayName,
                    programType: branchProgram.programType,
                  },
                  kind: "programStage",
                });
              },
              onRemoveProgram,
              onRemoveProgramStage,
              program: branchProgram,
              programDisplayName: branchProgram.displayName,
              programType: branchProgram.programType,
            },
            position: {
              x: stageNodeX,
              y: branchTopY + index * PROGRAM_STAGE_VERTICAL_GAP,
            },
            selected: focusedNodeId === stageNodeId,
            type: "programStageNode",
          });

          if (showProgramNode) {
            nextEdges.push({
              id: `${branchProgram.id}-${programStage.id}`,
              source: branchProgram.id,
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

        if (isBranchTrackerProgram || stages.length === 0) {
          const placeholderNodeId = `program-stage-placeholder-${branchProgram.id}`;

          nextNodes.push({
            id: placeholderNodeId,
            data: {
              displayName: "Add program stage",
              onAddProgramStage,
              programDisplayName: branchProgram.displayName,
              programId: branchProgram.id,
            },
            position: {
              x: stageNodeX,
              y: branchTopY + stages.length * PROGRAM_STAGE_VERTICAL_GAP,
            },
            type: "programStagePlaceholderNode",
          });

          if (showProgramNode) {
            nextEdges.push({
              id: `${branchProgram.id}-${placeholderNodeId}`,
              source: branchProgram.id,
              target: placeholderNodeId,
              style: {
                strokeDasharray: "4 4",
              },
            });
          }
        }
      },
    );

    return { nodes: nextNodes, edges: nextEdges };
  };

  useEffect(() => {
    if (!loading) {
      refetch({ programId });
    }
  }, [loading, programId, refetch, refreshToken]);

  useEffect(() => {
    if (trackedEntityTypeId) {
      refetchAssociatedPrograms({ trackedEntityTypeId });
      return;
    }

    setShowAssociatedPrograms(false);
  }, [refetchAssociatedPrograms, trackedEntityTypeId, refreshToken]);

  useEffect(() => {
    if (data?.results) {
      const nextFlow = buildFlow(
        data.results,
        showAssociatedPrograms ? associatedPrograms : [],
      );

      setNodes(nextFlow.nodes);
      setEdges(nextFlow.edges);
    }
  }, [associatedProgramsData, data, focusedNodeId, showAssociatedPrograms]);

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
    <div
      style={{
        height: "100%",
        position: "relative",
      }}
    >
      {loading && (
        <Layer level={3000} translucent>
          <Center>
            <CircularLoader />
          </Center>
        </Layer>
      )}
      {trackedEntityTypeId && canShowAssociatedPrograms && (
        <div
          style={{
            position: "absolute",
            top: spacers.dp16,
            right: spacers.dp16,
            zIndex: 5,
            width: 240,
            padding: spacers.dp12,
            borderRadius: 6,
            backgroundColor: colors.white,
            boxShadow: elevations.e100,
            border: `1px solid ${colors.grey300}`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: colors.grey900,
              marginBottom: spacers.dp4,
            }}
          >
            Related programs
          </div>
          <div
            style={{
              fontSize: 12,
              color: colors.grey700,
              marginBottom: spacers.dp8,
            }}
          >
            Show {associatedPrograms.length} other program
            {associatedPrograms.length === 1 ? "" : "s"} that use the same tracked
            entity type.
          </div>
          <CheckboxField
            checked={showAssociatedPrograms}
            label="Display associated programs"
            onChange={({ checked }) => {
              setShowAssociatedPrograms(checked);
            }}
          />
        </div>
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
    </div>
  );
};
