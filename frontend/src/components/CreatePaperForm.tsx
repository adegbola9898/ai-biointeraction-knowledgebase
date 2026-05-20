import { useState } from "react";
import { createPaper } from "../api/papers";
import type { Paper } from "../types/paper";
import ErrorMessage from "./ErrorMessage";
import LoadingMessage from "./LoadingMessage";

interface CreatePaperFormProps {
  onPaperCreated: (paper: Paper) => void;
}

export default function CreatePaperForm({ onPaperCreated }: CreatePaperFormProps) {
  const [title, setTitle] = useState("");
  const [abstractText, setAbstractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //const [successMessage, setSuccessMessage] = useState("");
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim() || !abstractText.trim()) {
      setError("Title and abstract are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const createdPaper = await createPaper({
        title,
        abstractText,
      });

      setTitle("");
      setAbstractText("");
      onPaperCreated(createdPaper);
    } catch (err) {
      setError("Failed to create paper");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit Paper</h2>

      <div>
        <label htmlFor="paper-title">Title</label>
        <input
          id="paper-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter paper title"
        />
      </div>

      <div>
        <label htmlFor="paper-abstract">Abstract</label>
        <textarea
          id="paper-abstract"
          value={abstractText}
          onChange={(event) => setAbstractText(event.target.value)}
          placeholder="Enter paper abstract"
          rows={6}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Paper"}
      </button>

      {loading && <LoadingMessage message="Creating paper and triggering AI extraction..." />}
      {error && <ErrorMessage message={error} />}
    </form>
  );
}
