# Rebuild Log

## Sprint 1 — Initial Project Structure

### Date
2026-05-02

### What did we run?

```bash
mkdir frontend backend-java ai-service-python infra docs
touch README.md docker-compose.yml .gitignore
git add .
git commit -m "Sprint 1: initial project structure"
git push
tree -L 2
What did we observe?

The repository now contains the initial project structure:

ai-biointeraction-knowledgebase/
├── LICENSE
├── README.md
├── ai-service-python/
├── backend-java/
├── docker-compose.yml
├── docs/
├── frontend/
└── infra/

Git commit and push were successful.

What does it imply about the system?

The project now has a modular foundation suitable for a full-stack bioinformatics platform.

The structure separates major system responsibilities:

frontend/ — user interface
backend-java/ — Spring Boot backend API
ai-service-python/ — FastAPI AI extraction service
infra/ — deployment and infrastructure configuration
docs/ — architecture, rebuild notes, and project documentation

This supports a microservices-style architecture where each component can be developed, tested, containerised, and deployed independently.

What remains unknown?

The folders are currently placeholders. The actual application services have not yet been initialized.

Unknowns include:

Final API contract
Database schema
Service communication pattern
Docker Compose configuration
AI extraction approach
Frontend framework setup
What’s next?

Next steps:

Write the project README
Add system architecture documentation
Define initial data models
Initialize the Spring Boot backend
Initialize the FastAPI AI service
Add basic Docker Compose services
What to say in interview

“I structured the repository to reflect a modular microservices architecture, separating concerns across frontend, backend, and AI services. This gives the project a clean foundation where each service can evolve independently while still supporting an integrated biocuration workflow.”

## Sprint 1 — Architecture and Data Model Design

### What did we run?

Created:
- docs/architecture.md
- docs/data_model.md

### What did we observe?

The system now has a clearly defined structure and data representation before implementation.

### What does it imply about the system?

The system is designed before being built, reducing ambiguity and enabling structured development.

### What remains unknown?

- Exact API endpoints
- Implementation details
- AI extraction accuracy

### What’s next?

- Initialize Spring Boot backend
- Define REST API endpoints
- Begin database implementation

### What to say in interview

“I defined the system architecture and data model upfront to ensure clarity around how data flows through the system and how biological interactions are represented.”

## Sprint 2 — Spring Boot Backend Initialization

### What did we run?

Initialized a Spring Boot backend with Maven, Java 21, Spring Web, JPA, PostgreSQL, Validation, and Lombok.

### What did we observe?

The first run failed because `javac` was missing. The Java runtime was installed, but the full JDK compiler was not available.

After installing the full OpenJDK 21 JDK, the project compiled successfully.

The second issue was Spring Boot trying to configure a PostgreSQL datasource before database settings existed. We temporarily disabled datasource and JPA auto-configuration so the backend could start cleanly.

The backend successfully started on port 8080.

### What does it imply about the system?

The Java backend foundation is now functional. The system has a working API service layer ready for REST endpoint development.

### What remains unknown?

- PostgreSQL connection configuration
- Database schema
- Entity definitions
- API endpoint implementation
- Backend-to-AI service communication

### What’s next?

- Add a basic health endpoint
- Create the first domain model: Paper
- Implement the first `/papers` API

### What to say in interview

“I initialized the Spring Boot backend and resolved environment and datasource configuration issues. This gave the project a working Java API foundation before introducing database persistence.”

## Sprint 2 — Backend Health Endpoint

### What did we run?

Created a Spring Boot REST controller:

- `HealthController.java`
- Endpoint: `GET /health`

Tested with:

```bash
curl http://localhost:8080/health
What did we observe?

The first /health request returned 404 Not Found because the controller file had not been created inside the backend-java source tree.

After creating the controller under:

backend-java/src/main/java/com/samyus/biointeraction/controller/

the endpoint returned:

{"service":"biointeraction-backend","status":"UP"}
What does it imply about the system?

The backend is now exposing a working REST endpoint. This confirms that Spring Boot routing and controller discovery are working correctly.

What remains unknown?
Database-backed endpoints
Domain models
Persistence layer
API validation
Error handling
What’s next?
Create the Paper domain model
Add request/response DTOs
Implement an in-memory /papers endpoint before connecting PostgreSQL
What to say in interview

“I added a simple health endpoint to verify that the backend service was running correctly and that Spring Boot was discovering REST controllers before adding database-dependent features.”


## Sprint 2 — Paper API (In-Memory)

### What did we run?

Implemented:

- `Paper` domain model
- `PaperController` with:
  - `POST /papers`
  - `GET /papers`

Tested using curl:

- Created a paper via POST request
- Retrieved papers via GET request

### What did we observe?

The API successfully:

- Accepted JSON input
- Generated a unique ID for each paper
- Stored papers in memory
- Returned stored data via GET endpoint

Example response:

POST:
```json
{
  "id": "...",
  "title": "TP53 interaction study",
  "abstractText": "TP53 interacts with MDM2"
}

GET:

[
  {
    "id": "...",
    "title": "TP53 interaction study",
    "abstractText": "TP53 interacts with MDM2"
  }
]
What does it imply about the system?

The backend can now ingest and expose paper data, representing the first step in the biocuration workflow.

This establishes the entry point for literature before AI-based interaction extraction.

What remains unknown?
Persistent storage (PostgreSQL)
Validation logic
AI extraction integration
Error handling and edge cases
What’s next?
Introduce DTOs (request/response separation)
Add validation
Prepare for database integration
What to say in interview

“I implemented the first domain API for papers, starting with an in-memory model to validate the ingestion workflow before introducing database persistence. This allowed me to focus on API design and data flow early.”

## Sprint 2 — Paper DTO and Validation

### What did we run?

Added a `CreatePaperRequest` DTO with validation rules:

- `title` must not be blank
- `abstractText` must not be blank

Updated `PaperController` to accept a validated request body instead of a raw map.

### What did we observe?

A valid request successfully created a paper.

An invalid request with empty fields returned:

```json
{
  "status": 400,
  "error": "Bad Request",
  "path": "/papers"
}
What does it imply about the system?

The API now has a clearer request contract and rejects invalid paper submissions before they enter the workflow.

What remains unknown?
Custom validation error response format
Persistent storage
Service layer separation
PostgreSQL integration
What’s next?
Add a service layer for paper business logic
Move in-memory storage out of the controller
Prepare for PostgreSQL persistence
What to say in interview

“I added DTO-based validation so the API enforces a clear contract at the boundary. This prevents invalid literature records from entering the curation workflow.”


## Sprint 2 — Paper Service Layer

### What did we run?

Refactored the Paper API so the controller delegates business logic to `PaperService`.

Implemented:

- `PaperService`
- Constructor injection into `PaperController`
- In-memory paper storage moved from controller to service

### What did we observe?

The API behavior remained the same:

- `POST /papers` created a paper
- `GET /papers` returned stored papers

### What does it imply about the system?

The backend now has a cleaner production-style structure:

```text
Controller → Service → Storage

This prepares the system for replacing in-memory storage with a repository and PostgreSQL.

What remains unknown?
PostgreSQL persistence
Repository layer
Entity mapping
Database migrations
What’s next?
Add PostgreSQL via Docker Compose
Re-enable datasource configuration
Convert Paper into a JPA entity
Add PaperRepository
What to say in interview

“I refactored the backend to use a service layer so controllers stay thin and business logic sits in a dedicated component. This prepares the codebase for adding persistence without changing the API contract.”


🎤 Interview line

“I introduced PostgreSQL using Docker and configured Spring Boot to manage schema updates automatically using JPA.”

🧠 What just happened (important learning)

You hit a real-world integration issue:

“Application configured correctly, infrastructure missing”

This is exactly the kind of thing backend engineers debug daily.

🎤 Interview-level explanation

You can now say:

“When integrating PostgreSQL, I encountered a connection failure because the database container wasn’t running. I verified the infrastructure layer using Docker and resolved it before continuing backend integration.”

That’s very strong signal.


🧠 What you’ve achieved

You now have:

Spring Boot API + PostgreSQL (Docker) working together

That’s already above average interview level.

🎤 Interview-level explanation

Say this:

“I containerised PostgreSQL using Docker and configured Spring Boot to connect via JDBC. After resolving initial connection issues, I verified the integration through successful datasource initialization.”

That’s clean, confident, and technical.

## Sprint 2 — PostgreSQL Persistence for Papers

### What did we run?

Added PostgreSQL using Docker Compose and configured Spring Boot JDBC/JPA settings.

Converted `Paper` into a JPA entity, added `PaperRepository`, and updated `PaperService` to persist records through PostgreSQL.

### What did we observe?

PostgreSQL started successfully in Docker.

Spring Boot connected to the database through HikariCP.

Hibernate created the `papers` table and inserted paper records successfully.

### What does it imply about the system?

The backend now has real persistence. Paper ingestion data is stored in PostgreSQL instead of memory.

### What remains unknown?

- Full schema for interactions and curation tasks
- Migration strategy
- Relationship mapping between papers and interactions
- Production database configuration

### What’s next?

- Add `Interaction` model
- Link interactions to papers
- Build the first curation workflow fields

### What to say in interview

“I replaced in-memory storage with PostgreSQL-backed persistence using JPA repositories. This moved the backend from a prototype API to a real persistence layer.”


🧠 Why this matters (very important)

You just modeled:

Paper → Interaction → (status: pending/approved/rejected)

That is literally the biocuration pipeline core.

🎤 Interview line

“I modeled interactions as first-class entities linked to papers, including a status field to support human validation workflows.”


## Sprint 2 — Interaction API

### What did we run?

Added the interaction domain layer:

- `Interaction` JPA entity
- `InteractionRepository`
- `InteractionService`
- `CreateInteractionRequest` DTO
- `InteractionController`

Implemented endpoints:

- `POST /interactions`
- `GET /interactions`

### What did we observe?

The first `/interactions` request returned `404` because `InteractionController.java` had not been created under the backend source tree.

After adding the controller and restarting the backend, interaction creation worked successfully.

The API created an interaction linked to an existing paper and returned it with:

```json
"status": "PENDING"
What does it imply about the system?

The system now supports the core biological relationship model:

Paper → Interaction

Interactions are stored in PostgreSQL, linked to papers, and initialized as pending curation candidates.

What remains unknown?
Curation status update workflow
Approval/rejection endpoints
Better error handling for missing papers
Response DTOs to avoid nested entity exposure
What’s next?
Add curation endpoints to approve or reject interactions
Improve error handling
Prepare for AI-generated candidate interactions
What to say in interview

“I added interactions as first-class biological entities linked to papers, with a pending status by default. This creates the foundation for a human-in-the-loop curation workflow.”


## Sprint 2 — Interaction Curation Workflow

### What did we run?

Added support for updating interaction curation status.

Implemented:

- `UpdateInteractionStatusRequest`
- `PATCH /interactions/{id}/status`
- status update logic in `InteractionService`
- `setStatus` method on `Interaction`

### What did we observe?

An interaction initially stored as `PENDING` was successfully updated to `APPROVED`.

A failed request occurred when using the placeholder `YOUR_ID` instead of a real interaction ID. Retrying with the actual UUID resolved the issue.

### What does it imply about the system?

The backend now supports a human-in-the-loop curation workflow where candidate interactions can be approved or rejected.

### What remains unknown?

- Custom error handling for missing IDs
- Curator identity tracking
- Timestamped curation decisions
- Separate `CurationTask` entity

### What’s next?

- Add better error handling
- Add AI extraction service using FastAPI
- Connect paper ingestion to candidate interaction generation

### What to say in interview

“I implemented the curation workflow by allowing extracted interactions to move from pending to approved or rejected. This mirrors the human validation step used in biological knowledgebase curation.”

## Sprint 3 — FastAPI AI Extraction Service

### What did we run?

Created a Python FastAPI service under `ai-service-python`.

Implemented:

- `POST /extract`
- request body with input text
- mock extraction logic for EGFR-GRB2 interactions

### What did we observe?

Initial package installation failed because the WSL Python environment is externally managed.

We resolved this by creating a virtual environment with `python3 -m venv .venv`, activating it, and installing dependencies locally.

The AI service successfully returned a structured candidate interaction from input text.

### What does it imply about the system?

The project now has a separate AI extraction microservice that can transform literature text into structured biological interaction candidates.

### What remains unknown?

- Java backend integration
- More general extraction rules
- Error handling
- Docker setup for the AI service

### What’s next?

- Call the FastAPI service from Spring Boot
- Automatically create candidate interactions from paper abstracts
- Add Docker support for the AI service

### What to say in interview

“I implemented the AI extraction layer as a separate FastAPI microservice. Even though the initial extraction is rule-based, the service boundary allows the model to be upgraded later without changing the Java backend.”

## Sprint 3 — Backend to AI Service Integration

### What did we run?

Added an `AiExtractionClient` in the Spring Boot backend and updated `PaperService` so that creating a paper calls the FastAPI extraction service.

### What did we observe?

Creating a paper with abstract text automatically triggered AI extraction.

The extracted EGFR-GRB2 interaction was stored in PostgreSQL with status `PENDING`.

### What does it imply about the system?

The project now has an end-to-end pipeline:

```text
Paper ingestion → AI extraction → candidate interaction storage → curation workflow
What remains unknown?
Failure handling when the AI service is unavailable
More general extraction rules
Response DTOs for cleaner API output
Docker Compose support for running both backend and AI service
What’s next?
Add error handling for AI service failures
Improve API responses
Containerise the AI service
What to say in interview

“When a paper is ingested, the Java backend calls a FastAPI microservice to extract candidate interactions, which are automatically stored as pending curation items.”


## Sprint 3 — AI Extraction Failure Handling

### What did we run?

Updated `PaperService` so AI extraction runs inside a try/catch block after paper persistence.

### What did we observe?

When the AI service was running, creating a paper also created a pending interaction.

When the AI service was stopped, paper creation still succeeded.

### What does it imply about the system?

Paper ingestion is now resilient to AI service outages. The AI service can fail without breaking the core literature ingestion workflow.

### What remains unknown?

- Structured logging
- Retry strategy
- User-facing warning when extraction fails
- Async processing with queues

### What’s next?

- Start Sprint 4 database enhancements
- Add Neo4j for graph-style interaction representation

### What to say in interview

“I made the AI integration fault-tolerant by ensuring paper ingestion succeeds even if the extraction service is unavailable. This keeps the core workflow reliable while treating AI extraction as an enhancement layer.”

