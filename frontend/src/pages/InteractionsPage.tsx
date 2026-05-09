import { useEffect, useState } from "react";
import { getInteractions } from "../api/interactions";
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

  if (loading) {
    return <p>Loading interactions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Interactions Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Protein A</th>
            <th>Protein B</th>
            <th>Interaction Type</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {interactions.map((interaction) => (
            <tr key={interaction.id}>
              <td>{interaction.id}</td>
              <td>{interaction.proteinA}</td>
              <td>{interaction.proteinB}</td>
              <td>{interaction.interactionType}</td>
              <td>{interaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
