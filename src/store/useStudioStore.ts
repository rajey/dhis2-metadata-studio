import { Edge, Node } from "@xyflow/react";
import { create } from "zustand";

export type SelectedMetaData = { id: string; resource: string } | null;
type Updater<T> = T[] | ((previous: T[]) => T[]);

interface StudioState {
  selectedMetaData: SelectedMetaData;
  setSelectedMetaData: (selection: SelectedMetaData) => void;
  clearSelectedMetaData: () => void;
  activeProgramId: string | null;
  nodes: Node[];
  edges: Edge[];
  setProgramDesign: (payload: {
    programId: string | null;
    nodes: Node[];
    edges: Edge[];
  }) => void;
  updateNodes: (updater: Updater<Node>) => void;
  updateEdges: (updater: Updater<Edge>) => void;
  resetProgramDesign: () => void;
}

const resolveUpdate = <T,>(updater: Updater<T>, current: T[]) =>
  typeof updater === "function"
    ? (updater as (previous: T[]) => T[])(current)
    : updater;

export const useStudioStore = create<StudioState>((set) => ({
  selectedMetaData: null,
  setSelectedMetaData: (selectedMetaData) => set({ selectedMetaData }),
  clearSelectedMetaData: () => set({ selectedMetaData: null }),
  activeProgramId: null,
  nodes: [],
  edges: [],
  setProgramDesign: ({ programId, nodes, edges }) =>
    set({
      activeProgramId: programId,
      nodes,
      edges,
    }),
  updateNodes: (updater) =>
    set((state) => ({
      nodes: resolveUpdate(updater, state.nodes),
    })),
  updateEdges: (updater) =>
    set((state) => ({
      edges: resolveUpdate(updater, state.edges),
    })),
  resetProgramDesign: () =>
    set({
      activeProgramId: null,
      nodes: [],
      edges: [],
    }),
}));
