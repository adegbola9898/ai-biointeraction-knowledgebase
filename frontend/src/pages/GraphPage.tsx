import { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { getInteractionGraph } from "../api/graph";
import type { InteractionGraph } from "../types/graph";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";

export default function GraphPage() {
  const [graph, setGraph] = useState<InteractionGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGraph() {
      try {
        const data = await getInteractionGraph();
        setGraph(data);
      } catch (err) {
        setError("Failed to load graph");
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, []);

  if (loading) {
    return <LoadingMessage message="Loading interaction graph..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const elements = [
    ...(graph?.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
      },
    })) ?? []),

    ...(graph?.edges.map((edge) => ({
      data: {
        source: edge.source,
        target: edge.target,
        label: edge.type,
      },
    })) ?? []),
  ];

  return (
    <div>
      <h1>Graph Dashboard</h1>

      <CytoscapeComponent
        elements={elements}
        style={{
          width: "100%",
          height: "600px",
        }}
        layout={{
          name: "cose",
        }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
            },
          },
          {
            selector: "edge",
            style: {
              label: "data(label)",
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
            },
          },
        ]}
      />
    </div>
  );
}
