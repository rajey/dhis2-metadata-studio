import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "./Studio.css";
import { colors, spacers } from "@dhis2/ui";
import { MetaDataPanel } from "../MetaDataPanel";

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
        {/* <div
          style={{
            marginTop: spacers.dp4,
            borderStyle: "dotted",
            borderWidth: 1,
            fontSize: 8,
            padding: spacers.dp4,
            borderRadius: 2,
            borderColor: colors.grey300,
          }}
        >
          Program description
        </div> */}
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

export const Studio = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
    <div className="studio-container">
      <div
        style={{
          width: 400,
          backgroundColor: colors.white,
          borderRight: "1px solid #ddd",
        }}
      >
        <MetaDataPanel
          onSelect={(selectedResource: any) => {
            console.log("Selected resource:", selectedResource);
          }}
        />
      </div>
      <div className="studio-design-area">
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
      </div>
    </div>
  );
};
