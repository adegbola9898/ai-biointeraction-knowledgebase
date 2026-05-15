# Sprint 7C Manual — AI Curation Review Surface

## Goal

Sprint 7C transformed the frontend from a simple dashboard interface into a true AI-assisted scientific review surface.

The goal of this sprint was to expose LLM-generated biological interaction candidates transparently to human reviewers, including:

confidence scores
evidence text
model provenance
validation state
review navigation workflows

The frontend evolved from:

CRUD-style data display

into:

human-in-the-loop scientific curation infrastructure

---

# 1. Starting State

Before Sprint 7C:

The frontend could:

list papers
list interactions
show graph visualization
show paper detail pages

However:

interaction rendering was minimal
AI provenance was hidden
confidence scores were absent
evidence readability was poor
review workflows were unclear
dashboard hierarchy did not reflect the AI workflow

The platform technically supported AI extraction, but the frontend did not yet expose the intelligence and review semantics of the system.

---

# 2. Interaction Type System Upgrade

Updated:

frontend/src/types/interaction.ts

The frontend interaction model was upgraded to include AI extraction metadata.

Added fields:

confidence
extractionModel
extractionMethod
extractionTimestamp
paper

This aligned the frontend type system with the upgraded backend Interaction entity introduced during Sprint 7B.

The frontend now understands:

AI confidence
model provenance
extraction method
timestamped extraction history
source paper linkage

---

# 3. Paper Detail Page Evolution

Updated:

frontend/src/pages/PaperDetailPage.tsx

The paper detail page was transformed into a dedicated AI review surface.

The page now renders:

protein relationships
interaction type
confidence score
evidence text
extraction model
extraction method
extraction timestamp
validation status
approve/reject actions

The page also introduced:

status coloring
interaction review cards
evidence highlighting
button spacing
review-oriented layout structure

This significantly improved scientific readability.

---

# 4. Null-Safe Legacy Compatibility

During frontend rendering, legacy interactions caused runtime failures because older records lacked newly added AI metadata fields.

Examples:

confidence = null
extractionTimestamp = null

Frontend rendering initially failed when calling:

(confidence * 100).toFixed(1)

Sprint 7C introduced defensive rendering helpers:

formatConfidence()
formatTimestamp()

and fallback rendering:

"N/A"

This restored compatibility across:

legacy rule-based interactions
new LLM-enriched interactions

---

# 5. Interaction Review UX Improvements

Sprint 7C introduced several review-oriented UI improvements:

bordered interaction cards
evidence containers
status highlighting
button spacing
improved typography
abstract readability improvements

The page evolved visually from:

raw JSON-like rendering

into:

scientific review-oriented information presentation

This significantly improved:

cognitive scanning
evidence inspection
review clarity
workflow comprehension

---

# 6. Papers Dashboard Transformation

Updated:

frontend/src/pages/PapersPage.tsx

The Papers dashboard evolved from:

simple table listing

into:

AI workflow landing page

The dashboard now explains the platform narrative directly:

Submit paper
→ AI extracts interactions
→ Human validates evidence
→ Graph evolves

Added dashboard sections:

platform overview
workflow explanation
summary statistics
AI extraction entry point
recent paper cards

---

# 7. Dashboard Metrics Added

Sprint 7C introduced live dashboard metrics:

total papers
total interactions
pending reviews
approved interactions

These metrics are computed dynamically from backend API data.

This transformed the frontend into:

operational workflow visibility

instead of:

static data listing

---

# 8. PubMed-Style Scientific Input Support

The frontend was upgraded to support realistic scientific abstract workflows.

Instead of toy examples:

"EGFR interacts with GRB2"

the system now accepts:

multi-sentence PubMed-style abstracts
contextual signaling language
experimental evidence text
therapeutic interpretation language

This validated the frontend against:

realistic scientific review scenarios

rather than:

prototype demo inputs

---

# 9. Recent Papers UX Improvements

Sprint 7C improved recent paper rendering:

paper cards
abstract previews
paper IDs
Open AI Review navigation
recent-first ordering

The dashboard now behaves more like:

scientific review software

instead of:

developer CRUD tooling

---

# 10. Interactions Dashboard Upgrade

Updated:

frontend/src/pages/InteractionsPage.tsx

The interactions page evolved into:

Interactions Review Queue

The page now renders:

source paper title
source paper ID
evidence preview
confidence score
extraction provenance
timestamp
validation status
paper review links

The interactions dashboard now supports two review entry patterns:

paper-first review
interaction-first review

This is an important curation architecture improvement.

---

# 11. AI Provenance Exposure

Sprint 7C fully exposed AI provenance to the user interface.

Visible metadata now includes:

confidence scores
LLM model name
extraction method
timestamped extraction metadata

Example:

gpt-5.4-mini (LLM)

This transformed the platform from:

“AI exists somewhere”

into:

auditable AI-assisted scientific extraction

---

# 12. Browser CORS Issues

Sprint 7C also surfaced new frontend integration behavior.

Vite dynamically shifted ports:

5173
5174
5175

This caused intermittent browser CORS failures.

Updated:

backend-java/src/main/java/com/samyus/biointeraction/config/CorsConfig.java

CORS configuration evolved from:

fixed-port origin allowlist

to:

localhost wildcard origin patterns

using:

allowedOriginPatterns()

This stabilized local frontend development across dynamic Vite ports.

---

# 13. Architectural Outcome After Sprint 7C

Current architecture:

React frontend
↓
Spring Boot backend
↓
FastAPI AI extraction service
↓
OpenAI LLM
↓
AI-generated biological interaction candidates
↓
Human review workflows
↓
Knowledge graph integration

The platform now supports:

AI extraction
provenance rendering
confidence visualization
human validation workflows
interaction review queues
paper-centric review
interaction-centric review

---

# 14. What Sprint 7C Means

Sprint 7C marks the frontend transition from:

full-stack prototype

into:

AI-assisted scientific review infrastructure

The frontend now exposes:

AI claims
evidence grounding
confidence semantics
model provenance
human validation pathways

This is the defining characteristic of:

human-in-the-loop AI systems

---

# 15. Remaining Future Enhancements

Still pending:

interaction filtering
confidence sorting
bulk validation
dark mode
responsive layouts
graph integrity semantics
deduplication handling
canonical evidence aggregation
graph evidence provenance
advanced review UX
search relevance ranking

---

# 16. Interview Talking Point

“I transformed the frontend from a generic dashboard into a human-in-the-loop scientific curation interface that exposes LLM-generated biological interactions together with confidence scores, evidence text, provenance metadata, validation workflows, and graph review pathways.”
