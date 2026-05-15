import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPaperById } from "../api/papers";
import {
  approveInteraction,
  getInteractionsByPaperId,
  rejectInteraction,
} from "../api/interactions";
import type { Paper } from "../types/paper";
import type { Interaction } from "../types/interaction";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

export default function PaperDetailPage() {
  const { id } = useParams();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingInteractionId, setUpdatingInteractionId] = useState("");
  const [graphUpdated, setGraphUpdated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPaperDetail() {
      if (!id) {
        setError("Paper ID missing");
        setLoading(false);
        return;
      }

      try {
        const [paperData, interactionData] = await Promise.all([
          getPaperById(id),
          getInteractionsByPaperId(id),
        ]);

        setPaper(paperData);
        setInteractions(interactionData);
      } catch (err) {
        setError("Failed to load paper detail");
      } finally {
        setLoading(false);
      }
    }

    loadPaperDetail();
  }, [id]);

  async function handleApprove(interactionId: string) {
    try {
      setUpdatingInteractionId(interactionId);
      setError("");

      const updatedInteraction = await approveInteraction(interactionId);

      setInteractions((currentInteractions) =>
        currentInteractions.map((interaction) =>
          interaction.id === interactionId ? updatedInteraction : interaction
        )
      );

      setGraphUpdated(true);
    } catch (err) {
      setError("Failed to approve interaction");
    } finally {
      setUpdatingInteractionId("");
    }
  }

  async function handleReject(interactionId: string) {
    try {
      setUpdatingInteractionId(interactionId);
      setError("");

      const updatedInteraction = await rejectInteraction(interactionId);

      setInteractions((currentInteractions) =>
        currentInteractions.map((interaction) =>
          interaction.id === interactionId ? updatedInteraction : interaction
        )
      );
    } catch (err) {
      setError("Failed to reject interaction");
    } finally {
      setUpdatingInteractionId("");
    }
  }

  function formatConfidence(confidence: number | null | undefined) {
    if (confidence == null) {
      return "N/A";
    }

    return `${(confidence * 100).toFixed(1)}%`;
  }

  function formatTimestamp(timestamp: string | null | undefined) {
    if (!timestamp) {
      return "N/A";
    }

    return new Date(timestamp).toLocaleString();
  }

  function getStatusColor(status: Interaction["status"]) {
    if (status === "APPROVED") {
      return "green";
    }

    if (status === "REJECTED") {
      return "red";
    }

    return "orange";
  }

  if (loading) {
    return <LoadingMessage message="Loading paper detail..." />;
  }

  if (error && !paper) {
    return <ErrorMessage message={error} />;
  }

  if (!paper) {
    return <ErrorMessage message="Paper not found" />;
  }

  return (
    <div>
      <h1>Paper Detail</h1>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <h2>{paper.title}</h2>

        <p>
          <strong>Paper ID:</strong> {paper.id}
        </p>

        <h3>Abstract</h3>
        <p style={{ lineHeight: 1.6 }}>{paper.abstractText}</p>
      </section>

      <h3>AI-Extracted Interactions</h3>

      {graphUpdated && (
        <div
          style={{
            border: "1px solid #b7e4c7",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#f0fff4",
          }}
        >
          <p style={{ marginTop: 0 }}>Interaction approved successfully.</p>
          <Link to="/graph">View Updated Graph</Link>
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {interactions.length === 0 ? (
        <p>No interactions extracted for this paper yet.</p>
      ) : (
        <div>
          {interactions.map((interaction) => {
            const isUpdating = updatingInteractionId === interaction.id;
            const isPending = interaction.status === "PENDING";

            return (
              <article
                key={interaction.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "20px",
                  backgroundColor: "#fafafa",
                }}
              >
                <h4 style={{ marginTop: 0 }}>
                  {interaction.proteinA} → {interaction.proteinB}
                </h4>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: getStatusColor(interaction.status),
                      fontWeight: "bold",
                    }}
                  >
                    {interaction.status}
                  </span>
                </p>

                <p>
                  <strong>Type:</strong> {interaction.interactionType}
                </p>

                <p>
                  <strong>Confidence:</strong>{" "}
                  {formatConfidence(interaction.confidence)}
                </p>

                <div>
                  <strong>Evidence:</strong>

                  <div
                    style={{
                      marginTop: "6px",
                      padding: "10px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "6px",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    {interaction.evidenceText || "N/A"}
                  </div>
                </div>

                <p>
                  <strong>Extraction Model:</strong>{" "}
                  {interaction.extractionModel || "N/A"}
                </p>

                <p>
                  <strong>Extraction Method:</strong>{" "}
                  {interaction.extractionMethod || "N/A"}
                </p>

                <p>
                  <strong>Extraction Timestamp:</strong>{" "}
                  {formatTimestamp(interaction.extractionTimestamp)}
                </p>

                {isPending && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleApprove(interaction.id)}
                    >
                      {isUpdating ? "Approving..." : "Approve"}
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleReject(interaction.id)}
                    >
                      {isUpdating ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
