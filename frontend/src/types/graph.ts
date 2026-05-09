export interface GraphNode {
  id: string;
  label: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
}

export interface InteractionGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
