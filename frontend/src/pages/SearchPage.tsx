import { useState } from "react";
import { searchKnowledgebase } from "../api/search";
import type { SearchHit } from "../types/search";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await searchKnowledgebase(query);

      setResults(response.hits.hits);
    } catch (err) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Search Dashboard</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search biointeraction knowledgebase"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {loading && (
        <LoadingMessage message="Searching knowledgebase..." />
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      <ul>
        {results.map((result) => (
          <li key={result._id}>
            <strong>{result._source.type}</strong>

            <pre>
              {JSON.stringify(result._source, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
