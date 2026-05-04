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


