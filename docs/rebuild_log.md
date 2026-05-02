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
