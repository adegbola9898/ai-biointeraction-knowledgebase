import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getInteractions } from "../api/interactions";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import type { Interaction } from "../types/interaction";

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInteractions() {
      try {
        const data = await getInteractions();
        setInteractions(data);
      } catch (err) {
        setError("Failed to load interactions");
      } finally {
        setLoading(false);
      }
    }

    loadInteractions();
  }, []);

  const sortedInteractions = useMemo(() => {
    return [...interactions].reverse();
  }, [interactions]);

  const pendingCount = interactions.filter(
    (interaction) => interaction.status === "PENDING"
  ).length;

  const approvedCount = interactions.filter(
    (interaction) => interaction.status === "APPROVED"
  ).length;

  const rejectedCount = interactions.filter(
    (interaction) => interaction.status === "REJECTED"
  ).length;

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

  function getEvidencePreview(evidenceText: string | null | undefined) {
    if (!evidenceText) {
      return "No evidence text available.";
    }

    if (evidenceText.length <= 220) {
      return evidenceText;
    }

    return `${evidenceText.slice(0, 220)}...`;
  }

  if (loading) {
    return <LoadingMessage message="Loading interactions..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "24px",
          backgroundColor: "#fafafa",
        }}
      >
        <h1>Interactions Review Queue</h1>

        <p style={{ lineHeight: 1.7, maxWidth: "1000px" }}>
          Review AI-extracted biological interactions with their evidence,
          confidence scores, source papers, model provenance, and validation
          status.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "18px",
          }}
        >
          <div style={statCardStyle}>
            <strong>Total</strong>
            <div style={statNumberStyle}>{interactions.length}</div>
          </div>

          <div style={statCardStyle}>
            <strong>Pending</strong>
            <div style={statNumberStyle}>{pendingCount}</div>
          </div>

          <div style={statCardStyle}>
            <strong>Approved</strong>
            <div style={statNumberStyle}>{approvedCount}</div>
          </div>

          <div style={statCardStyle}>
            <strong>Rejected</strong>
            <div style={statNumberStyle}>{rejectedCount}</div>
          </div>
        </div>
      </section>

      {sortedInteractions.length === 0 ? (
        <p>No interactions extracted yet.</p>
      ) : (
        <div>
          {sortedInteractions.map((interaction) => (
            <article
              key={interaction.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "18px",
                marginBottom: "18px",
                backgroundColor: "#fff",
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                {interaction.proteinA} → {interaction.proteinB}
              </h2>

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
                  {getEvidencePreview(interaction.evidenceText)}
                </div>
              </div>

              <p>
                <strong>Source Paper:</strong>{" "}
                {interaction.paper?.title || "N/A"}
              </p>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#555",
                  wordBreak: "break-all",
                }}
              >
                <strong>Paper ID:</strong> {interaction.paper?.id || "N/A"}
              </p>

              <p>
                <strong>Extraction:</strong>{" "}
                {interaction.extractionModel || "N/A"} (
                {interaction.extractionMethod || "N/A"})
              </p>

              <p>
                <strong>Extracted At:</strong>{" "}
                {formatTimestamp(interaction.extractionTimestamp)}
              </p>

              {interaction.paper?.id && (
                <Link to={`/papers/${interaction.paper.id}`}>
                  Open Paper Review
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const statCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "12px",
  minWidth: "130px",
  backgroundColor: "#fff",
};

const statNumberStyle = {
  fontSize: "1.7rem",
  fontWeight: "bold",
  marginTop: "6px",
};
