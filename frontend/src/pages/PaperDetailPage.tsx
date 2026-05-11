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

      <h2>{paper.title}</h2>

      <p>
        <strong>Paper ID:</strong> {paper.id}
      </p>

      <h3>Abstract</h3>
      <p>{paper.abstractText}</p>

      <h3>AI-Extracted Interactions</h3>

      {graphUpdated && (
        <div>
          <p>Interaction approved successfully.</p>

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
              <div key={interaction.id}>
                <h4>
                  {interaction.proteinA} → {interaction.proteinB}
                </h4>

                <p>
                  <strong>Type:</strong> {interaction.interactionType}
                </p>

                <p>
                  <strong>Status:</strong> {interaction.status}
                </p>

                <p>
                  <strong>Evidence:</strong> {interaction.evidenceText}
                </p>

                {isPending && (
                  <div>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
