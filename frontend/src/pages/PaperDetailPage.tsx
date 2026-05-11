import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaperById } from "../api/papers";
import { getInteractionsByPaperId } from "../api/interactions";
import type { Paper } from "../types/paper";
import type { Interaction } from "../types/interaction";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

export default function PaperDetailPage() {
  const { id } = useParams();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <LoadingMessage message="Loading paper detail..." />;
  }

  if (error) {
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

      {interactions.length === 0 ? (
        <p>No interactions extracted for this paper yet.</p>
      ) : (
        <div>
          {interactions.map((interaction) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
