import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaperById } from "../api/papers";
import type { Paper } from "../types/paper";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

export default function PaperDetailPage() {
  const { id } = useParams();

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPaper() {
      if (!id) {
        setError("Paper ID missing");
        setLoading(false);
        return;
      }

      try {
        const data = await getPaperById(id);
        setPaper(data);
      } catch (err) {
        setError("Failed to load paper");
      } finally {
        setLoading(false);
      }
    }

    loadPaper();
  }, [id]);

  if (loading) {
    return <LoadingMessage message="Loading paper..." />;
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
    </div>
  );
}
