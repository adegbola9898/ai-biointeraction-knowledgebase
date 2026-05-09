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
