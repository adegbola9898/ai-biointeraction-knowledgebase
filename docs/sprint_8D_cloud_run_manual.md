# Sprint 8D — Google Cloud Run Deployment Manual

## Sprint Goal

Sprint 8D moved the Cloud Lite platform from local Docker Compose into a public Google Cloud deployment.

The deployed topology is:

Frontend → Backend → AI Service → Cloud SQL PostgreSQL

Elasticsearch and Neo4j remain disabled in cloud mode.

## Cloud Project

Project:

bio-platform-rebuild

Region:

us-central1

## Cloud Services Used

- Google Cloud Run
- Google Artifact Registry
- Google Cloud SQL for PostgreSQL
- Google Secret Manager

## Artifact Registry

Repository:

bio-platform-registry

Location:

us-central1

Images pushed:

- biointeraction-ai-service
- biointeraction-backend
- biointeraction-frontend

## Cloud SQL

Instance:

biointeraction-postgres

Database:

biointeraction_db

User:

bio_user

Purpose:

Cloud SQL acts as the persistent state layer for papers and interactions.

## Cloud Run Services

AI service:

https://biointeraction-ai-service-289872008588.us-central1.run.app

Backend:

https://biointeraction-backend-289872008588.us-central1.run.app

Frontend:

https://biointeraction-frontend-289872008588.us-central1.run.app

## Environment Strategy

Backend uses:

- SPRING_DATASOURCE_URL
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- AI_SERVICE_BASE_URL
- SEARCH_ENABLED=false
- GRAPH_ENABLED=false

AI service uses:

- AI_PROVIDER=openai
- OPENAI_MODEL=gpt-5.4-mini
- OPENAI_API_KEY from Secret Manager

Frontend uses:

- VITE_API_BASE_URL baked into production build

Important:

The frontend API URL is currently build-time configured. Changing backend URLs requires rebuilding and redeploying the frontend image.

## Important Fixes During Deployment

The AI service initially failed because Cloud Run expected port 8080, while FastAPI was listening on port 8000.

Resolution:

Cloud Run AI service was deployed with:

--port 8000

The backend initially failed to connect to Cloud SQL because the PostgreSQL Cloud SQL socket factory dependency was missing.

Resolution:

Added dependency:

com.google.cloud.sql:postgres-socket-factory:1.19.1

## Validation Results

AI service health:

/health returned service UP.

Backend health:

/health returned service UP.

Backend persistence:

POST /papers created a paper in Cloud SQL.

Paper retrieval:

GET /papers returned persisted cloud data.

AI extraction:

POST /papers triggered backend-to-AI-service extraction.

Interaction retrieval:

GET /interactions/paper/{paperId} returned LLM-extracted interactions.

Validated cloud interactions included:

- EGFR recruits GRB2
- EGFR promotes MAPK signaling

## Current Cloud Mode

Cloud deployment is running in Cloud Lite mode.

Enabled:

- frontend
- backend
- ai-service
- PostgreSQL persistence
- LLM extraction
- interaction review data model

Disabled:

- Elasticsearch search
- Neo4j graph persistence

## Production Hardening Still Needed

- Move database password into Secret Manager
- Add CI/CD
- Add authentication
- Add structured logging
- Add monitoring and alerting
- Add custom domain
- Add HTTPS/domain configuration
- Add frontend runtime config strategy
- Add Cloud Run minimum/maximum instance policy
- Add cost-control checklist
- Add backup strategy for Cloud SQL
- Reintroduce Elasticsearch via managed search later
- Reintroduce Neo4j via managed graph service later

## Cost Notes

Cloud Run can scale down when idle.

Cloud SQL does not scale to zero and may continue costing money while running.

Artifact Registry stores images and may also incur storage cost.

## Final Sprint Outcome

Sprint 8D successfully established a live public cloud deployment of the AI Biointeraction Knowledgebase platform.

The system is now no longer only a local development prototype. It is a cloud-deployed scientific AI platform with persistent data storage and live LLM extraction.
