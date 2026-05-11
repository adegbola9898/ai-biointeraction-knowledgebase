import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPapers } from "../api/papers";
import type { Paper } from "../types/paper";
import CreatePaperForm from "../components/CreatePaperForm";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPapers() {
      try {
        const data = await getPapers();
        setPapers(data);
      } catch (err) {
        setError("Failed to load papers");
      } finally {
        setLoading(false);
      }
    }

    loadPapers();
  }, []);

  function handlePaperCreated(paper: Paper) {
    setPapers((currentPapers) => [paper, ...currentPapers]);
  }

  return (
    <div>
      <h1>Papers Dashboard</h1>

      <CreatePaperForm onPaperCreated={handlePaperCreated} />

      {loading && <LoadingMessage message="Loading papers..." />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Abstract</th>
            </tr>
          </thead>

          <tbody>
            {papers.map((paper) => (
              <tr key={paper.id}>
                <td>
                  <Link to={`/papers/${paper.id}`}>{paper.id}</Link>
                </td>
                <td>
                  <Link to={`/papers/${paper.id}`}>{paper.title}</Link>
                </td>
                <td>{paper.abstractText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
