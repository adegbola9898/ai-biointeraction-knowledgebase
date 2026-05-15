# Sprint 7B Manual — Spring Boot ↔ FastAPI LLM Integration

## Goal

Sprint 7B transformed the backend from a local/mock extraction workflow into a fully connected AI-powered orchestration system.

The architecture evolved into:

React frontend
→ Spring Boot backend
→ FastAPI AI service
→ OpenAI LLM
→ structured biological interaction extraction

The objective of Sprint 7B was to:

* connect Spring Boot to the FastAPI extraction service
* persist AI-generated biological interactions
* store extraction provenance metadata
* support realistic scientific abstracts
* establish an auditable AI curation pipeline

---

# 1. Starting State

Before Sprint 7B:

Spring Boot used:

AiExtractionClient.callExtractionService(String text)

which called:

POST /extract

with:

{
"text": "EGFR interacts with GRB2"
}

The FastAPI service had already been upgraded during Sprint 7A to:

POST /extract/interactions

with:

{
"title": "...",
"abstractText": "..."
}

This caused a contract mismatch between Spring Boot and FastAPI.

---

# 2. AI Client Upgrade

Updated:

backend-java/src/main/java/com/samyus/biointeraction/ai/AiExtractionClient.java

Old contract:

public Map callExtractionService(String text)

New contract:

public Map callExtractionService(String title, String abstractText)

The REST request was upgraded from:

{
"text": "..."
}

to:

{
"title": "...",
"abstractText": "..."
}

The endpoint was also updated:

http://localhost:8000/extract
→
http://localhost:8000/extract/interactions

This aligned Spring Boot with the new FastAPI extraction API.

---

# 3. PaperService Integration Upgrade

Updated:

backend-java/src/main/java/com/samyus/biointeraction/service/PaperService.java

Old behavior:

POST /papers
→ save paper only

New behavior:

POST /papers
→ save paper
→ call FastAPI extraction service
→ receive LLM-generated interactions
→ persist interactions automatically

The backend now orchestrates:

paper persistence
AI extraction
interaction persistence
search indexing

inside one workflow.

---

# 4. End-to-End AI Extraction Validation

Validated:

POST /papers

using:

{
"title": "EGFR signaling study",
"abstractText": "EGFR interacts with GRB2 during signaling."
}

Observed successful pipeline:

Spring Boot
→ FastAPI
→ OpenAI
→ interaction extraction
→ interaction persistence

Persisted interaction:

proteinA: EGFR
proteinB: GRB2
interactionType: interacts_with
status: PENDING

This validated the first real LLM-powered backend extraction workflow.

---

# 5. Interaction Model Evolution

Sprint 7B upgraded the Interaction entity from a simple biological relationship model into an auditable AI extraction record.

Updated:

backend-java/src/main/java/com/samyus/biointeraction/model/Interaction.java

Added fields:

confidence
extractionModel
extractionMethod
extractionTimestamp

This introduced:

AI provenance tracking
confidence scoring
model auditability
workflow traceability

The Interaction entity now stores:

biological relationship
evidence text
confidence score
AI provider/model
extraction method
timestamp
human validation status

---

# 6. Manual Workflow Metadata

The manual interaction creation path was also upgraded.

Updated:

backend-java/src/main/java/com/samyus/biointeraction/service/InteractionService.java

Manual interactions now store:

confidence = 1.0
extractionModel = "manual"
extractionMethod = "MANUAL"

This preserves provenance consistency across both:

human-created interactions
LLM-generated interactions

---

# 7. Realistic Scientific Abstract Testing

The system moved from toy examples into PubMed-style scientific text.

Submitted abstract:

"EGFR-mediated signaling dynamics in epithelial carcinoma cells"

This abstract contained:

multiple biological entities
contextual signaling language
experimental evidence phrasing
long-form scientific prose

---

# 8. Database Schema Limitation Discovery

The realistic abstract exposed a PostgreSQL schema limitation.

Error observed:

ERROR: value too long for type character varying(255)

Cause:

papers.abstract_text
was still stored as:

VARCHAR(255)

This was sufficient for toy inputs but failed for real scientific abstracts.

---

# 9. Abstract Storage Upgrade

Updated:

backend-java/src/main/java/com/samyus/biointeraction/model/Paper.java

Added:

@Column(columnDefinition = "TEXT")

However, Hibernate did not automatically migrate the existing PostgreSQL column type.

Manual PostgreSQL migration was required.

Executed:

ALTER TABLE papers
ALTER COLUMN abstract_text TYPE TEXT;

This upgraded the database to support realistic scientific documents.

---

# 10. Long-Form AI Extraction Validation

After schema migration, the realistic abstract persisted successfully.

Validated:

curl http://localhost:8080/interactions/paper/{paperId}

Observed multiple LLM-generated interactions:

Interaction 1:
proteinA: EGFR
proteinB: GRB2
interactionType: binds
confidence: 0.99

Interaction 2:
proteinA: EGFR
proteinB: GRB2
interactionType: promotes recruitment of
confidence: 0.97

Both interactions included:

evidenceText
extractionModel
extractionMethod
extractionTimestamp
status

This confirmed:

real biological extraction semantics
multi-interaction extraction
context-sensitive relationship inference
auditable AI provenance persistence

---

# 11. Infrastructure Observations

Sprint 7B also clarified current runtime architecture.

docker compose up -d

currently starts only infrastructure services:

PostgreSQL
Elasticsearch
Neo4j

Spring Boot still runs separately through:

./mvnw spring-boot:run

FastAPI still runs separately through:

uvicorn app.main:app --reload --port 8000

This is an important future consideration for:

containerization
orchestration
production deployment
cloud reproducibility

---

# 12. Security & Environment Handling

Environment variables are now provider-driven.

Current AI configuration:

OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini
AI_PROVIDER=openai

This ensures:

provider abstraction
model configurability
future provider switching

A previous accidental secret exposure also reinforced:

.gitignore hygiene
environment isolation
credential management practices

---

# 13. Current Architecture After Sprint 7B

React frontend
↓
Spring Boot backend
↓
FastAPI AI service
↓
OpenAI LLM
↓
Structured biological interaction extraction

The platform now supports:

real AI extraction
persistent provenance
human validation workflows
graph integration foundations
scientific auditability

---

# 14. What Does Sprint 7B Mean Architecturally?

Sprint 7B marks the transition from:

AI-themed workflow prototype

into:

LLM-powered scientific curation infrastructure

The system is no longer:

hardcoded
rule-based
demo-oriented

It now performs:

real biological extraction
confidence scoring
contextual relationship inference
evidence-grounded AI curation

---

# 15. Remaining Future Enhancements

Still pending:

frontend provenance rendering
confidence visualization
dynamic provider metadata propagation
Flyway/Liquibase schema migrations
interaction deduplication semantics
canonical graph evidence aggregation
production observability
retry handling
cost controls
prompt versioning

---

# 16. Interview Talking Point

“I upgraded the platform from a rule-based extraction prototype into a real LLM-powered biological curation system by integrating Spring Boot orchestration with a FastAPI AI service backed by OpenAI. The workflow now persists AI-generated interactions together with confidence scores, evidence text, model provenance, extraction timestamps, and human validation states, creating an auditable scientific extraction pipeline.”
