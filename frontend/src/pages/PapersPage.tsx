import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPapers } from "../api/papers";
import { getInteractions } from "../api/interactions";
import type { Paper } from "../types/paper";
import type { Interaction } from "../types/interaction";
import CreatePaperForm from "../components/CreatePaperForm";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [paperData, interactionData] = await Promise.all([
          getPapers(),
          getInteractions(),
        ]);

        setPapers(paperData);
        setInteractions(interactionData);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function handlePaperCreated(paper: Paper) {
    setPapers((currentPapers) => [paper, ...currentPapers]);
  }

  function getAbstractPreview(abstractText: string) {
    if (!abstractText) {
      return "No abstract provided.";
    }

    if (abstractText.length <= 320) {
      return abstractText;
    }

    return `${abstractText.slice(0, 320)}...`;
  }

  const sortedPapers = useMemo(() => {
    return [...papers].reverse();
  }, [papers]);

  const pendingInteractions = interactions.filter(
    (interaction) => interaction.status === "PENDING"
  );

  const approvedInteractions = interactions.filter(
    (interaction) => interaction.status === "APPROVED"
  );

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
        <h1>AI-Assisted Biointeraction Knowledgebase</h1>

        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            maxWidth: "1000px",
          }}
        >
          Submit a scientific paper abstract, allow the AI extraction service to
          identify candidate biological interactions, then review and validate
          evidence-backed relationships before they are added to the knowledge
          graph.
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
            <strong>Total Papers</strong>

            <div style={statNumberStyle}>{papers.length}</div>
          </div>

          <div style={statCardStyle}>
            <strong>Total Interactions</strong>

            <div style={statNumberStyle}>{interactions.length}</div>
          </div>

          <div style={statCardStyle}>
            <strong>Pending Reviews</strong>

            <div style={statNumberStyle}>
              {pendingInteractions.length}
            </div>
          </div>

          <div style={statCardStyle}>
            <strong>Approved</strong>

            <div style={statNumberStyle}>
              {approvedInteractions.length}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "28px",
          backgroundColor: "#fff",
        }}
      >
        <h2>Run AI Extraction</h2>

        <p
          style={{
            lineHeight: 1.7,
            maxWidth: "1000px",
          }}
        >
          Paste a PubMed-style scientific abstract below. The backend will
          persist the paper, call the FastAPI LLM extraction service, generate
          candidate protein interactions, assign confidence scores, and create
          pending review records for scientific validation.
        </p>

        <CreatePaperForm onPaperCreated={handlePaperCreated} />
      </section>

      <section>
        <h2>Recent Papers</h2>

        {loading && <LoadingMessage message="Loading papers..." />}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && sortedPapers.length === 0 && (
          <p>No papers submitted yet.</p>
        )}

        {!loading && !error && sortedPapers.length > 0 && (
          <div>
            {sortedPapers.map((paper) => (
              <article
                key={paper.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "18px",
                  marginBottom: "18px",
                  backgroundColor: "#fff",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "10px",
                  }}
                >
                  {paper.title}
                </h3>

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#555",
                    wordBreak: "break-all",
                  }}
                >
                  <strong>Paper ID:</strong> {paper.id}
                </p>

                <p
                  style={{
                    lineHeight: 1.7,
                    marginTop: "14px",
                    marginBottom: "16px",
                  }}
                >
                  {getAbstractPreview(paper.abstractText)}
                </p>

                <Link to={`/papers/${paper.id}`}>
                  Open AI Review
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const statCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "12px",
  minWidth: "150px",
  backgroundColor: "#fff",
};

const statNumberStyle = {
  fontSize: "1.7rem",
  fontWeight: "bold",
  marginTop: "6px",
};
