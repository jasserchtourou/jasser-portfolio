import { create } from 'zustand';

export const useStore = create((set) => ({
  selectedNode: null,
  hoveredNode: null,
  selectedEdge: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
  setHoveredNode: (node) => set({ hoveredNode: node }),
  setSelectedEdge: (edge) => set({ selectedEdge: edge }),
  clearSelection: () => set({ selectedNode: null, hoveredNode: null }),
  clearEdgeSelection: () => set({ selectedEdge: null }),
}));

