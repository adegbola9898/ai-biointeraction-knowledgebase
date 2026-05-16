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

🧠 What you just built
Relational DB → validated data → Graph DB

That’s multi-database architecture.

🎤 Interview line (VERY strong)

“I used PostgreSQL for transactional storage and Neo4j to represent approved biological interactions as a graph, enabling relationship-based queries.”


🎤 Interview understanding

You can now say:

“When an interaction is approved, I propagate it into Neo4j to build a graph representation of biological relationships.”


🧠 Why this happened (important)

This is a classic integration mistake:

Use class ❌ before defining it
🎤 Interview-level explanation

You can say:

“I encountered a compilation failure due to a missing Neo4j client class and resolved it by correctly structuring the graph integration layer.”


## Sprint 4 — Neo4j Graph Integration

### What did we run?

Added Neo4j to Docker Compose and integrated the Java backend with Neo4j using the Neo4j Java Driver.

Updated the approval workflow so that approved interactions are also written to Neo4j as graph relationships.

### What did we observe?

Neo4j initially failed to start because the password was too short. After updating the password to meet Neo4j requirements, the container started successfully.

Approving an interaction updated PostgreSQL and created graph data in Neo4j.

### What does it imply about the system?

The system now uses PostgreSQL for transactional storage and Neo4j for graph representation of approved biological interactions.

### What remains unknown?

- How graph data should be queried through the API
- Whether rejected interactions should be removed from Neo4j
- Graph sync consistency strategy
- Full graph visualization frontend

### What’s next?

- Add a backend endpoint for approved interaction graph data
- Add Elasticsearch for search
- Later connect graph data to frontend visualization

### What to say in interview

“I extended the system with Neo4j so approved interactions are represented as protein interaction graphs. PostgreSQL remains the source of curated records, while Neo4j supports relationship-oriented querying.”


Great. Sprint 4 Neo4j is done.

Next best step: add an API endpoint to expose graph-ready data before Elasticsearch.

This gives you something useful for the future frontend graph visualization:

GET /graph/interactions

Interview line:

“After syncing approved interactions to Neo4j, I exposed graph-style interaction data through the backend so the frontend can visualize protein networks.”


## Sprint 4 — Graph Interactions API

### What did we run?

Added `GET /graph/interactions` to expose approved Neo4j interaction data as graph-ready JSON.

### What did we observe?

The endpoint returned nodes and edges:

```json
{
  "nodes": [
    {"id": "GRB2", "label": "GRB2"},
    {"id": "EGFR", "label": "EGFR"}
  ],
  "edges": [
    {"source": "EGFR", "target": "GRB2", "type": "INTERACTS_WITH"}
  ]
}
What does it imply about the system?

The backend can now provide graph data suitable for frontend network visualization.

What remains unknown?
Frontend graph library integration
Filtering graph data
Larger graph performance
Relationship metadata
What’s next?
Add Elasticsearch for search
Later use this endpoint for graph visualization
What to say in interview

“I exposed Neo4j interaction data through a graph-ready API endpoint, returning nodes and edges that can be consumed by a frontend visualization library.”


## Sprint 4 — Elasticsearch Search Integration

### What did we run?

Added Elasticsearch to Docker Compose and integrated Spring Boot with Elasticsearch using HTTP requests.

Implemented:

- indexing papers
- indexing interactions
- `GET /search?q=...`

### What did we observe?

Creating a paper indexed both the paper and extracted interaction.

Searching for `EGFR` returned both matching document types:

- paper
- interaction

### What does it imply about the system?

The system now supports full-text-style retrieval across literature records and molecular interactions.

### What remains unknown?

- Search result DTO cleanup
- Ranking tuning
- Reindexing existing database records
- Production Elasticsearch configuration

### What’s next?

- Add Redis caching
- Add frontend dashboard

### What to say in interview

“I added Elasticsearch so papers and extracted interactions are indexed for keyword search. This gives the platform a search layer separate from PostgreSQL’s transactional storage.”



## Sprint 5A — Frontend Environment Setup

### What did we run?

Attempted to initialize a Vite React TypeScript frontend:

```bash
npm create vite@latest . -- --template react-ts
What did we observe?

Frontend initialization failed due to a Node.js runtime compatibility issue.

The default Ubuntu package manager installed:

Node.js v18.19.1
npm 9.2.0

However, the latest Vite scaffolding tooling required:

Node.js ^20.19.0 || >=22.12.0

The initialization process failed with:

SyntaxError:
The requested module 'node:util'
does not provide an export named 'styleText'
What does it imply about the system?

Modern frontend tooling ecosystems evolve faster than default Linux distribution package repositories.

Using Ubuntu’s default Node.js packages introduced compatibility issues with current frontend tooling.

Resolution

Removed Ubuntu-managed Node.js/npm packages and installed a modern Node.js runtime using NodeSource:

sudo apt remove -y nodejs npm

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

sudo apt install -y nodejs

Validated installation:

node -v
# v22.22.2

npm -v
# 10.9.7
What remains unknown?
Vite initialization success
Frontend dependency installation
Local development server validation
What’s next?
Initialize React + TypeScript frontend
Install frontend dependencies
Validate Vite development server startup
Interview Talking Point

“I resolved frontend tooling compatibility issues by upgrading the Node.js runtime to a version compatible with the modern Vite ecosystem rather than relying on outdated distro-managed packages.”


## Sprint 5A — React + TypeScript Frontend Initialization

### What did we run?

Initialized a Vite React TypeScript frontend inside the existing `frontend/` directory:

```bash
npm create vite@latest . -- --template react-ts

The Vite scaffolding process:

generated React + TypeScript project structure
installed frontend dependencies
automatically started the development server
What did we observe?

Frontend initialization completed successfully.

Vite development server started successfully:

VITE v8.0.11 ready

Local:
http://localhost:5173/

Installed dependencies included:

React
React DOM
TypeScript
Vite
What does it imply about the system?

The platform now contains a dedicated typed frontend application capable of consuming backend APIs and supporting future dashboard visualization features.

The frontend environment is now operational for:

API integration
routing
graph visualization
search interfaces
dashboard rendering
What remains unknown?
browser rendering validation
frontend-to-backend API connectivity
routing structure
state management approach
Cytoscape integration
What’s next?
Validate browser rendering
Inspect generated project structure
Add routing support
Establish frontend architecture conventions
Configure API communication layer
Interview Talking Point

“I extended the platform with a React and TypeScript frontend initialized using Vite to provide a typed client layer for interacting with backend biointeraction APIs.”


## Sprint 5A — Typed API Layer Foundation

### What did we implement?

Established the initial typed frontend API communication layer.

Added:

- centralized Axios client
- environment-based API configuration
- typed Paper model
- typed Interaction model
- reusable API request functions

Created:

```text
src/api/client.ts
src/api/papers.ts
src/api/interactions.ts
src/types/paper.ts
src/types/interaction.ts
Environment Configuration

Added frontend environment configuration support:

.env.example

Configured:

VITE_API_BASE_URL=http://localhost:8080
What did we observe?

Frontend TypeScript compilation and production build completed successfully after introducing typed API modules.

Validated with:

npm run build

Build completed successfully using:

Vite
React
TypeScript
Axios
Additional Engineering Observation

Initially attempted to create frontend source files from the repository root instead of the frontend project root.

This produced:

No such file or directory

The issue was caused by executing commands from:

~/ai-biointeraction-knowledgebase

instead of:

~/ai-biointeraction-knowledgebase/frontend
What does it imply about the system?

The project is now operating as a multi-service repository with distinct execution contexts:

backend-java/
ai-service-python/
frontend/

This requires careful path and working-directory awareness during development workflows.

Security / Reproducibility Improvement

Detected that .env had accidentally been committed to Git.

Resolved by:

adding .env to .gitignore
removing tracked .env from Git history moving forward
preserving .env.example for reproducible onboarding
What remains unknown?
live backend API connectivity
frontend routing structure
dashboard rendering
React component hierarchy
search integration
graph visualization integration
What’s next?
Add React Router configuration
Create dashboard pages
Connect frontend to live backend endpoints
Render backend data in the UI
Interview Talking Point

“I established a typed frontend API layer with reusable Axios clients, environment-based configuration, and TypeScript domain models while ensuring reproducible environment configuration and clean Git hygiene.”

## Sprint 5A — Frontend Routing Foundation

### What did we implement?

Established the frontend routing and page architecture using React Router.

Created:

```text
src/routes/AppRoutes.tsx

Added page-level dashboard placeholders:

src/pages/PapersPage.tsx
src/pages/InteractionsPage.tsx
src/pages/SearchPage.tsx
src/pages/GraphPage.tsx

Updated:

src/App.tsx
src/main.tsx
What did we observe?

Successfully integrated React Router into the frontend application.

Configured routes:

/papers
/interactions
/search
/graph

Validated:

navigation rendering
route switching
page rendering
TypeScript compilation
Vite production build
Validation

Validated production build successfully:

npm run build

Validated browser navigation successfully through the Vite development server.

What does it imply about the system?

The frontend now has a scalable page-oriented application structure capable of supporting:

dashboard rendering
API-backed pages
graph visualization pages
search workflows
future authenticated navigation
Additional Engineering Observation

The frontend application is transitioning from scaffold-generated starter content into domain-oriented application architecture.

Routing separation now exists independently from component rendering logic.

What remains unknown?
live backend API rendering
loading/error handling patterns
reusable UI components
graph visualization integration
search result normalization
What’s next?
Connect Papers dashboard to live backend APIs
Render backend paper data dynamically
Add loading/error state handling
Establish reusable dashboard components
Interview Talking Point

“I established scalable frontend routing architecture using React Router to separate dashboard domains into independently navigable frontend modules.”



## Infrastructure observation

docker compose up -d only starts infrastructure containers:

PostgreSQL
Elasticsearch
Neo4j

NOT:

Spring Boot backend

Meaning our current architecture is:

dockerized infrastructure
+
locally executed backend application

That absolutely should be documented because cloud deployment strategy will eventually need:

backend containerization
compose/service orchestration
environment standardization
Hibernate observation

We also surfaced useful production warnings:

PostgreSQLDialect does not need to be specified explicitly

and:

spring.jpa.open-in-view is enabled by default



Should Docker Compose eventually start the backend too?

Yes — probably.

For a mature reproducible platform, the eventual ideal state is usually:

docker compose up

starts:

PostgreSQL
Spring Boot backend
FastAPI AI service
Elasticsearch
Neo4j
maybe frontend later

That gives:
- reproducibility
- onboarding simplicity
- environment consistency
- CI/CD friendliness
- cloud portability

BUT—

you are also correct that:

```text
reproducibility/containerization
≠
CI/CD

They are related, but different layers.

Current State (Totally Fine)

Right now your architecture is effectively:

dockerized infrastructure
+
locally executed application services

This is VERY common during active development because:

hot reload is easier
debugging is easier
iteration is faster
container rebuild loops are avoided

So your current approach is actually reasonable for this phase.

Likely Future Evolution

Later you will probably evolve toward:

Phase 1 — Current
infra in Docker
apps local
Phase 2
backend containerized
infra containerized
frontend local
Phase 3
full stack containerized
Phase 4
CI/CD pipelines
deployment automation
cloud orchestration
Frontend Containerization?

Probably later, yes.

But not urgent now.

During active frontend development:

npm run dev

is usually preferable because:

hot reload
debugging
rapid iteration

Later:

production frontend build
Nginx/static hosting
Vercel/Netlify
Docker image
Kubernetes/etc



## Sprint 5B — Live Papers Dashboard Integration

### What did we implement?

Connected the React frontend Papers dashboard to the live Spring Boot backend API.

Updated:

```text
frontend/src/pages/PapersPage.tsx

The frontend now:

fetches live paper records from /papers
renders backend data dynamically
displays loading and error states
renders data in a tabular dashboard view
What did we observe?

Initial frontend API requests failed despite the backend endpoint functioning correctly through curl.

Frontend displayed:

Failed to load papers

Backend endpoint validation succeeded independently:

curl http://localhost:8080/papers

This indicated:

backend availability was functional
frontend API integration path existed
browser-based requests were being blocked
Root Cause

The issue was caused by Cross-Origin Resource Sharing (CORS) restrictions.

The frontend application was served from:

http://localhost:5173

while the backend API was served from:

http://localhost:8080

Browser security policies blocked cross-origin frontend requests.

Resolution

Added a global Spring Boot CORS configuration:

backend-java/src/main/java/com/samyus/biointeraction/config/CorsConfig.java

Configured allowed origins:

http://localhost:5173

Allowed methods:

GET
POST
PATCH
PUT
DELETE
OPTIONS
Validation

Validated frontend-to-backend integration successfully.

The frontend dashboard now renders live PostgreSQL-backed paper data through the Spring Boot API.

Validated:

React frontend
→ Axios API client
→ Spring Boot backend
→ PostgreSQL persistence
→ Browser rendering

Rendered live paper records including:

EGFR study
EGFR signaling
AI extraction test papers
Additional Infrastructure Observation

Current architecture behavior:

docker compose up -d

starts infrastructure services only:

PostgreSQL
Elasticsearch
Neo4j

The Spring Boot backend currently runs separately through:

./mvnw spring-boot:run

This is an important future deployment consideration for:

backend containerization
orchestration
cloud deployment reproducibility
Additional Backend Observations

Spring Boot startup surfaced production-hardening warnings:

PostgreSQLDialect does not need to be specified explicitly

and:

spring.jpa.open-in-view is enabled by default

These represent future backend cleanup and optimization opportunities.

What does it imply about the system?

The platform now supports true full-stack data flow:

persisted backend data
→ REST API exposure
→ frontend API consumption
→ browser visualization

The project has transitioned from isolated backend/frontend components into an integrated application platform.

What remains unknown?
interaction dashboard rendering
search integration
graph visualization rendering
reusable UI component strategy
frontend styling system
deployment integration
What’s next?
Connect interactions dashboard
Add reusable dashboard table components
Add search integration
Improve frontend styling/layout
Begin graph visualization integration
Interview Talking Point

“I integrated the React frontend with live Spring Boot APIs and resolved real-world CORS issues to enable full-stack rendering of PostgreSQL-backed biological interaction data.”


## Sprint 5B — Live Interactions Dashboard Integration

### What did we implement?

Connected the React Interactions dashboard to the live Spring Boot backend API.

Updated:

```text
frontend/src/pages/InteractionsPage.tsx

The dashboard now renders:

interaction ID
protein A
protein B
interaction type
curation status
What did we observe?

The frontend successfully fetched and rendered persisted interaction records from:

GET /interactions

Validated interaction statuses included:

PENDING
APPROVED
What does it imply about the system?

The frontend now exposes the AI-assisted curation workflow to users by displaying extracted biological interactions and their review status.

What remains unknown?
frontend status update controls
reusable table components
filtering by status
visual styling for curation state
What’s next?
Add curation controls for approving/rejecting interactions
Improve dashboard layout and readability
Add reusable loading/error/table patterns
Interview Talking Point

“I connected the frontend interaction dashboard to live backend APIs so AI-generated molecular interactions and curation statuses are visible through the user interface.”

## Sprint 5B — Reusable Frontend Status Components

### What did we implement?

Introduced reusable frontend UI components for shared loading and error state rendering.

Created:

```text
frontend/src/components/LoadingMessage.tsx
frontend/src/components/ErrorMessage.tsx

Refactored:

frontend/src/pages/PapersPage.tsx
frontend/src/pages/InteractionsPage.tsx
What did we observe?

Both dashboard pages previously duplicated:

loading state rendering
error state rendering

The duplication was small initially, but would become increasingly difficult to maintain as additional pages and API integrations were added.

Resolution

Centralized shared UI state rendering into reusable React components.

The dashboard pages now reuse:

LoadingMessage
ErrorMessage

instead of implementing inline loading/error rendering independently.

Validation

Validated successfully with:

npm run build

Confirmed:

TypeScript compilation passed
frontend production build succeeded
browser rendering behavior remained unchanged
What does it imply about the system?

The frontend architecture is beginning to transition from feature-level implementation into reusable component-oriented design.

This establishes an initial pattern for:

shared UI behavior
reusable dashboard components
frontend maintainability
scalable page development
Additional Engineering Observation

Refactoring was performed incrementally without changing backend integration behavior.

This reduced duplication while preserving:

API behavior
routing behavior
dashboard rendering functionality
What remains unknown?
reusable table component strategy
frontend styling system
pagination/filtering patterns
graph visualization component structure
What’s next?
Create reusable dashboard table components
Improve dashboard styling/layout
Begin search integration
Add interaction curation controls
Interview Talking Point

“I refactored duplicated frontend loading and error handling into reusable React components to improve maintainability as the dashboard architecture expanded.”

## Sprint 5C — Frontend Search Integration

### What did we implement?

Connected the React frontend search interface to the backend Elasticsearch-powered search API.

Created:

```text
frontend/src/types/search.ts
frontend/src/api/search.ts

Updated:

frontend/src/pages/SearchPage.tsx

The frontend search interface now:

accepts user search queries
calls the backend /search endpoint
renders Elasticsearch-backed search results dynamically
displays loading and error states
What did we observe?

Initial search requests failed with:

500 Internal Server Error

Backend stack traces revealed:

index_not_found_exception
no such index [biointeraction-docs]
Root Cause

Elasticsearch itself was operational, but no search index had yet been created.

Validated:

curl http://localhost:9200

returned healthy Elasticsearch cluster information.

However:

curl "http://localhost:9200/_cat/indices?v"

returned no indices.

Additional Architectural Observation

The platform currently separates:

PostgreSQL persistence
≠
Elasticsearch indexing

Existing PostgreSQL records were not automatically backfilled into Elasticsearch.

Search indexing only occurred when new records were created through application workflows.

Resolution

Created a new paper through:

POST /papers

This triggered:

searchClient.indexPaper(...)

which automatically created the Elasticsearch index:

biointeraction-docs

Search functionality then began operating successfully.

Validation

Validated successfully:

POST /papers
→ PostgreSQL persistence
→ Elasticsearch indexing
→ /search?q=AKT1
→ frontend search rendering

Frontend search results successfully rendered:

AKT1 signaling study

including indexed abstract data from Elasticsearch.

What does it imply about the system?

The platform now supports interactive search workflows across indexed biological knowledge.

The frontend is now connected to:

React frontend
→ Spring Boot search API
→ Elasticsearch
→ indexed biological documents
Additional Engineering Observation

The platform currently lacks:

automatic Elasticsearch backfill
reindexing jobs
index bootstrap initialization

These represent future search reliability and operational improvements.

What remains unknown?
interaction search rendering
structured result cards
search filtering
search ranking tuning
graph-search integration
What’s next?
Improve search result presentation
Separate paper vs interaction rendering
Add graph visualization integration
Add interaction approval controls
Interview Talking Point

“I integrated the frontend search experience with Elasticsearch-backed APIs and debugged real distributed-system indexing issues involving missing search indices and persistence/search synchronization.”

## Sprint 5D — Graph Visualization Dependency and API Foundation

### What did we implement?

Prepared the frontend for graph visualization by installing Cytoscape dependencies and adding typed graph API access.

Installed:

```text
cytoscape
react-cytoscapejs

Created:

frontend/src/types/graph.ts
frontend/src/api/graph.ts
What did we observe?

The backend graph endpoint was already live:

curl http://localhost:8080/graph/interactions

It returned graph-ready data:

{
  "nodes": [
    {"id": "GRB2", "label": "GRB2"},
    {"id": "EGFR", "label": "EGFR"}
  ],
  "edges": [
    {"source": "EGFR", "type": "INTERACTS_WITH", "target": "GRB2"}
  ]
}
Validation

Validated frontend build successfully:

npm run build
What does it imply about the system?

The frontend is now prepared to consume Neo4j-backed graph data and render biological interaction networks visually.

What remains unknown?
Cytoscape component rendering
graph layout configuration
graph styling
node/edge interaction behavior
What’s next?
Create Cytoscape graph component
Render backend graph data in the Graph dashboard
Validate browser visualization
Interview Talking Point

“I prepared the frontend graph layer by installing Cytoscape and adding typed API access to backend graph-ready Neo4j interaction data.”

## Sprint 5D — Cytoscape Graph Visualization Integration

### What did we implement?

Integrated Cytoscape graph visualization into the React frontend dashboard.

Updated:

```text
frontend/src/pages/GraphPage.tsx

Installed:

cytoscape
react-cytoscapejs
@types/react-cytoscapejs

The frontend graph dashboard now:

fetches graph data from /graph/interactions
transforms backend graph data into Cytoscape elements
renders biological interaction networks visually
displays nodes and interaction edges dynamically
What did we observe?

The backend graph endpoint returned graph-ready Neo4j-backed interaction data:

{
  "nodes": [
    {"id": "GRB2", "label": "GRB2"},
    {"id": "EGFR", "label": "EGFR"}
  ],
  "edges": [
    {
      "source": "EGFR",
      "target": "GRB2",
      "type": "INTERACTS_WITH"
    }
  ]
}
Integration Challenges
TypeScript Declaration Issue

Initial build failed because:

react-cytoscapejs

did not include bundled TypeScript declarations.

Resolution:

npm install -D @types/react-cytoscapejs
Cytoscape Style Typing Issue

TypeScript validation rejected camelCase Cytoscape style properties:

curveStyle
targetArrowShape

Resolution:
converted Cytoscape stylesheet keys to their expected hyphenated form:

curve-style
target-arrow-shape
Validation

Validated successfully with:

npm run build

Browser validation confirmed:

graph rendering
node labels
interaction edge rendering
Cytoscape layout execution

Rendered graph included:

EGFR
GRB2
INTERACTS_WITH
Additional Engineering Observation

Frontend production build surfaced a bundle-size warning after adding Cytoscape:

Some chunks are larger than 500 kB after minification

This indicates future optimization opportunities involving:

code splitting
lazy loading
graph-page chunk isolation
What does it imply about the system?

The platform now supports end-to-end graph visualization:

Neo4j graph data
→ Spring Boot graph API
→ React frontend
→ Cytoscape rendering
→ interactive biological network visualization

The application has transitioned beyond traditional CRUD interfaces into visual biointeraction exploration.

What remains unknown?
advanced graph styling
zoom/pan controls
graph filtering
node selection interactions
large-graph performance
graph search integration
What’s next?
Improve graph styling/layout
Add graph interactivity
Add interaction approval controls
Improve dashboard styling system
Begin deployment preparation
Interview Talking Point

“I integrated Cytoscape-based graph visualization into the React frontend to render Neo4j-backed biological interaction networks and resolved real-world TypeScript and visualization library integration issues.”

## Runtime Environment Snapshot

Validated working environment before switching machines:

- Node.js: v22.22.2
- npm: 10.9.7
- Java: 21
- Docker Compose infrastructure:
  - PostgreSQL 15
  - Elasticsearch 8.13.4
  - Neo4j 5

Frontend runtime reproducibility support added via:

```text
frontend/.nvmrc

## Runtime Environment Snapshot

Validated working development environment before multi-machine continuation:

```text
Node.js        v22.22.2
npm            10.9.7
Java           21.0.10
Docker         29.4.3
Docker Compose v5.1.3
Python         3.12.3
Git            2.43.0

Dockerized infrastructure validated:

PostgreSQL 15
Elasticsearch 8.13.4
Neo4j 5

Frontend runtime reproducibility support added via:

frontend/.nvmrc

Current canonical workflow direction:

paper ingestion
→ AI extraction
→ human validation
→ graph evolution
→ searchable biological knowledge

Next planned milestone:

EPIC 6 — Paper Ingestion to Curation Workflow

Then finalize:

```bash id="jlwmhr"
echo "22" > frontend/.nvmrc


## Sprint 6A — Frontend Paper Ingestion Workflow

### What did we implement?

Added a frontend paper ingestion workflow.

Created:

```text
frontend/src/components/CreatePaperForm.tsx

Updated:

frontend/src/api/papers.ts
frontend/src/pages/PapersPage.tsx

The frontend now allows users to submit:

paper title
paper abstract
What did we observe?

Submitting a paper from the React frontend successfully called:

POST /papers

The created paper appeared immediately in the Papers dashboard.

Validation

Submitted:

Title:
Frontend ingestion test

Abstract:
EGFR interacts with GRB2 during signaling.

The frontend rendered the newly created paper in the table.

Backend validation confirmed the paper was persisted and AI extraction created a pending interaction:

EGFR → GRB2
status: PENDING
What does it imply about the system?

The platform workflow now begins correctly with paper ingestion.

Validated flow:

Frontend form
→ Spring Boot POST /papers
→ PostgreSQL paper persistence
→ AI extraction trigger
→ pending interaction creation

This establishes the first step of the final demo workflow.

What remains unknown?
paper detail page
displaying AI extraction results directly after submission
approve/reject controls
graph refresh after approval
What’s next?
Add interaction approval/rejection controls
Refresh interactions after paper creation
Create paper detail page
Connect approval to graph update
Interview Talking Point

“I added a paper ingestion workflow where users submit a title and abstract from the frontend, triggering backend persistence and AI-generated pending biological interactions.”



## Sprint 6B.1 — Backend Paper Detail Endpoint

### What did we implement?

Added a backend endpoint for retrieving a single paper by ID.

Updated:

```text
backend-java/src/main/java/com/samyus/biointeraction/service/PaperService.java
backend-java/src/main/java/com/samyus/biointeraction/controller/PaperController.java

Added:

GET /papers/{id}
What did we observe?

Previously, paper detail lookup returned:

404 Not Found

because the backend only supported:

GET /papers
POST /papers
Validation

Validated backend tests successfully:

./mvnw test

Validated endpoint manually:

curl http://localhost:8080/papers/3fc40b0c-f877-4ee8-a69c-fafec42309b4

Response:

{
  "title": "Frontend ingestion test",
  "abstractText": "EGFR interacts with GRB2 during signaling.",
  "id": "3fc40b0c-f877-4ee8-a69c-fafec42309b4"
}
What does it imply about the system?

The backend now supports paper-specific detail views, which are required for a proper AI curation review surface.

This enables the next frontend workflow:

Papers dashboard
→ click paper
→ /papers/:id detail page
→ review AI-extracted interactions
What remains unknown?
frontend paper detail page
paper-specific interaction retrieval
AI extraction display on detail page
approval/rejection controls
What’s next?
Add frontend getPaperById() API function
Add /papers/:id React route
Create PaperDetailPage
Link papers table rows to detail pages
Interview Talking Point

“I extended the backend with a paper detail endpoint to support paper-centered AI curation workflows and enable frontend review pages for extracted biological interactions.”


## Sprint 6B.2 — Frontend Paper Detail Page

### What did we implement?

Added a frontend paper detail workflow.

Updated:

```text
frontend/src/api/papers.ts
frontend/src/routes/AppRoutes.tsx
frontend/src/pages/PapersPage.tsx

Created:

frontend/src/pages/PaperDetailPage.tsx
What did we observe?

The Papers dashboard now links each paper ID and title to a dynamic detail page:

/papers/:id
Validation

Validated frontend production build:

npm run build

Validated browser navigation:

/papers
→ click paper
→ /papers/3fc40b0c-f877-4ee8-a69c-fafec42309b4

The detail page successfully rendered:

paper title
paper ID
abstract
What does it imply about the system?

The frontend now has the foundation for a paper-centered curation screen.

This enables the next workflow stage:

Paper detail
→ AI-extracted interactions
→ human approval/rejection
→ graph update
What remains unknown?
paper-specific interaction filtering
interaction review panel
approve/reject controls
graph refresh after validation
What’s next?
Fetch interactions linked to the current paper
Display AI-extracted pending interactions on the paper detail page
Add curation controls
Interview Talking Point

“I added dynamic paper detail pages so the frontend can support paper-centered AI curation workflows instead of only dashboard-level data browsing.”

## Sprint 6B.3 — Frontend Interaction Type Contract Fix

### What did we fix?

Updated the frontend `Interaction` TypeScript type to match the backend interaction response.

Updated:

```text
frontend/src/types/interaction.ts

Added missing fields:

evidenceText
paper

Preserved the stricter interaction status union:

PENDING | APPROVED | REJECTED
Why was this needed?

PaperDetailPage renders AI-extracted interaction evidence using:

interaction.evidenceText

The backend already returns evidenceText, but the frontend type did not define it, causing TypeScript build failure.

Validation

Validated frontend production build:

npm run build

Result:

✓ built successfully
What does it imply?

The frontend interaction model is now aligned with the backend API contract, enabling paper-specific AI extraction review rendering on the paper detail page.


## Sprint 6C.1 — Human Validation Workflow

### What did we implement?

Added frontend interaction approval and rejection controls to the paper detail review workflow.

Updated:

frontend/src/api/interactions.ts
frontend/src/pages/PaperDetailPage.tsx

Added frontend API functions:

approveInteraction()
rejectInteraction()
updateInteractionStatus()

Connected frontend controls to:

PATCH /interactions/{id}/status

### What did we observe?

The paper detail page now renders:

AI-extracted interactions
interaction status
interaction evidence
Approve button
Reject button

Pending interactions can now be reviewed directly from the paper detail page.

### Validation

Validated frontend production build:

npm run build

Validated browser workflow:

/papers
→ click paper
→ review AI extraction
→ click Approve

Validated backend interaction update:

curl http://localhost:8080/interactions/paper/3fc40b0c-f877-4ee8-a69c-fafec42309b4

Result:

status: APPROVED

Validated graph evolution:

curl http://localhost:8080/graph/interactions

Response included:

EGFR → GRB2

### What does it imply about the system?

The platform now supports the complete core AI-assisted curation workflow:

paper ingestion
→ AI extraction
→ human validation
→ graph evolution

Neo4j relationships are only created after explicit human approval.

This establishes the platform’s central scientific governance workflow.

### What remains unknown?

automatic graph refresh after approval
frontend graph synchronization
rejected interaction workflows
interaction confidence visualization
paper-specific graph navigation

### What’s next?

Refresh Cytoscape graph after approval
Improve interaction review UI
Add confidence rendering
Add interaction filtering
Improve graph exploration workflow

### Interview Talking Point

“I implemented a human-in-the-loop biological curation workflow where AI-generated interactions remain pending until explicitly approved, at which point the Neo4j knowledge graph updates live.”


## Sprint 6D.1 — Graph Evolution Navigation Workflow

### What did we implement?

Extended the paper detail review workflow with graph evolution navigation after interaction approval.

Updated:

frontend/src/pages/PaperDetailPage.tsx

Added:

graphUpdated frontend state
approval success feedback
navigation link to the graph dashboard

### What did we observe?

After approving a pending interaction from the paper detail page, the frontend now displays:

Interaction approved successfully.
View Updated Graph

This creates a direct workflow transition from:

AI review
→ interaction approval
→ graph exploration

### Validation

Validated frontend production build:

npm run build

Validated browser workflow:

submit paper
→ open paper detail page
→ approve interaction
→ success message displayed
→ navigate to graph dashboard

Validated graph endpoint:

curl http://localhost:8080/graph/interactions

Result included:

EGFR → GRB2

### What does it imply about the system?

The platform now visually connects:

human validation
→ curated biological relationship creation
→ graph exploration

This establishes the complete core product narrative:

paper ingestion
→ AI extraction
→ human approval
→ graph evolution

The frontend now explicitly communicates that graph updates are caused by curator approval decisions.

### What remains unknown?

automatic graph refresh without navigation
interaction filtering
graph highlighting for newly approved relationships
confidence visualization
improved graph styling and controls

### What’s next?

Improve Cytoscape interaction UX
Add graph filtering
Highlight newly approved relationships
Improve graph layouts and styling
Add structured interaction cards

### Interview Talking Point

“I connected the human validation workflow to the graph exploration workflow so approved biological interactions immediately become explorable in the Neo4j-backed visualization layer.”

# Sprint 7A — OpenAI LLM Extraction Foundation

## Objective
Replace the previous mock/rule-based interaction extraction workflow with a real LLM-powered AI extraction service.

---

## Completed Work

### AI Service Infrastructure
- Built standalone FastAPI AI extraction service
- Added `/health` endpoint for service monitoring
- Added `/extract/interactions` endpoint for biological interaction extraction
- Configured environment-based OpenAI API integration

### LLM Extraction Workflow
- Implemented OpenAI-powered extraction pipeline
- Added structured JSON response formatting
- Added confidence scoring to extracted interactions
- Added evidence text preservation from abstracts

### Validation
Successful extraction test:

Input:
```json
{
  "title": "EGFR signaling",
  "abstractText": "EGFR interacts with GRB2 during signaling."
}

Output:

{
  "interactions": [
    {
      "proteinA": "EGFR",
      "proteinB": "GRB2",
      "interactionType": "interacts_with",
      "evidenceText": "EGFR interacts with GRB2 during signaling.",
      "confidence": 0.99
    }
  ]
}
Architectural Evolution

System evolved from:

Mock extraction / rule-based parsing

Into:

Spring Boot orchestration layer
        ↓
FastAPI AI extraction layer
        ↓
OpenAI LLM inference
        ↓
Structured interaction JSON
        ↓
Persistence pipeline
Technical Significance

This milestone establishes the foundation for:

paper-scale automated interaction extraction
multi-model AI support
human review workflows
confidence-based curation
future agentic extraction pipelines
Next Planned Sprint

Sprint 7B:

integrate FastAPI service into Spring Boot backend
persist extracted interactions
add extraction status tracking
implement retry/error handling
build pending-review workflow


## Sprint 7B.2 — Persist LLM Extraction Metadata

### What did we implement?

Upgraded the backend interaction model to persist AI extraction metadata.

Updated:

backend-java/src/main/java/com/samyus/biointeraction/model/Interaction.java
backend-java/src/main/java/com/samyus/biointeraction/service/PaperService.java
backend-java/src/main/java/com/samyus/biointeraction/service/InteractionService.java
backend-java/src/main/java/com/samyus/biointeraction/model/Paper.java

Added interaction fields:

confidence
extractionModel
extractionMethod
extractionTimestamp

Updated paper abstract storage to support realistic scientific abstracts using TEXT instead of VARCHAR(255).

### What did we observe?

A realistic PubMed-style abstract initially failed because the existing paper abstract column was limited to 255 characters.

PostgreSQL returned:

ERROR: value too long for type character varying(255)

The Java entity was updated with:

@Column(columnDefinition = "TEXT")

The existing PostgreSQL column was manually migrated:

ALTER TABLE papers
ALTER COLUMN abstract_text TYPE TEXT;

After migration, the long scientific abstract persisted successfully.

### Validation

Validated backend build:

./mvnw test

Validated realistic paper submission:

POST /papers

Submitted:

EGFR-mediated signaling dynamics in epithelial carcinoma cells

Validated paper-specific interactions:

curl http://localhost:8080/interactions/paper/5bfa1852-091a-4992-bcdb-b18f55b2c611

The LLM extracted multiple pending interactions including:

EGFR → GRB2
interactionType: binds
confidence: 0.99
extractionModel: gpt-5.4-mini
extractionMethod: LLM
status: PENDING

and:

EGFR → GRB2
interactionType: promotes recruitment of
confidence: 0.97
extractionModel: gpt-5.4-mini
extractionMethod: LLM
status: PENDING

### What does it imply about the system?

The platform now supports auditable AI-generated biological extraction.

Each candidate interaction now carries:

biological relationship
evidence text
confidence score
model provenance
extraction method
extraction timestamp
human validation status

This moves the system from a rule-based/mock extraction prototype into a real LLM-powered scientific curation platform.

### What remains unknown?

frontend confidence rendering
frontend model/provenance display
dynamic model metadata propagation from FastAPI
database migrations using Flyway or Liquibase
deduplication of semantically overlapping interactions

### What’s next?

Update the AI curation review surface to display:

confidence
extraction model
extraction method
extraction timestamp
status badges
evidence text

### Interview Talking Point

“I upgraded the backend so LLM-extracted interactions are stored with confidence scores, model provenance, extraction method, timestamps, evidence text, and human validation status, making the AI workflow auditable and scientifically traceable.”


## Sprint 8A.1 — Productionization Baseline

### Goal

Begin containerizing the full AI-assisted biointeraction platform while preserving a clear understanding of the current local runtime architecture.

The goal is not only deployment, but reproducible platform evolution.

Deployment will become the foundation for future work including:

Graph Integrity Semantics
AI reliability hardening
search improvements
authentication
observability
CI/CD
cloud deployment

### Current Runtime Architecture

At the start of Sprint 8A, the platform runs as a hybrid local system.

Docker Compose currently starts infrastructure services only:

PostgreSQL
Elasticsearch
Neo4j

Command:

docker compose up -d

The application services still run outside Docker:

FastAPI AI service:

cd ai-service-python
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

Spring Boot backend:

cd backend-java
./mvnw spring-boot:run

React frontend:

cd frontend
npm run dev

### Current Service Ports

PostgreSQL:

localhost:5432

Elasticsearch:

localhost:9200

Neo4j browser:

localhost:7474

Neo4j bolt:

localhost:7687

FastAPI AI service:

localhost:8000

Spring Boot backend:

localhost:8080

React frontend:

localhost:5173 or dynamic Vite port

### Current Working Platform Flow

React frontend
→ Spring Boot backend
→ PostgreSQL persistence
→ FastAPI AI service
→ OpenAI LLM extraction
→ Interaction persistence
→ Human review UI
→ Neo4j graph update after approval

### What We Validated Before Containerization

Validated infrastructure startup:

docker compose up -d

Validated FastAPI health:

curl http://localhost:8000/health

Result:

status: UP
service: ai-extraction-service
provider: openai

Validated backend endpoints:

curl http://localhost:8080/papers
curl http://localhost:8080/interactions

Validated frontend startup:

npm run dev

Validated browser workflow:

Papers dashboard
Paper detail review
Interactions review queue
LLM provenance rendering

### Why This Matters

The platform is now a multi-service AI scientific system.

Manual startup works, but it is fragile because each service must be started independently.

Containerization is needed to improve:

reproducibility
deployment readiness
onboarding
environment consistency
service networking
future cloud deployment

### Productionization Principle

Deployment is not the end of development.

Deployment should make future work easier and safer.

Future development will continue after deployment, including:

Graph Integrity Semantics
deduplication
evidence aggregation
AI reliability
prompt versioning
search improvements
authentication
observability

Therefore, every deployment change must be documented clearly enough that the platform can be surgically evolved after deployment.

### Next Step

Create a backend Dockerfile for the Spring Boot service and validate that the backend can be built and run as a container.


