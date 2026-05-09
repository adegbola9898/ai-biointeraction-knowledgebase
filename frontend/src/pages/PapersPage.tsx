import { useEffect, useState } from "react";
import { getPapers } from "../api/papers";
import type { Paper } from "../types/paper";

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

  if (loading) {
    return <p>Loading papers...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Papers Dashboard</h1>

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
              <td>{paper.id}</td>
              <td>{paper.title}</td>
              <td>{paper.abstractText}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
