# Cloud Deployment Foundation Manual

## Current Deployment Decision

The platform will target Google Cloud Run for stateless application services and managed/external services for stateful dependencies.

## Local Runtime

Local development uses Docker Compose.

Services:

- frontend
- backend
- ai-service
- PostgreSQL
- Elasticsearch
- Neo4j

Command:

docker compose up --build

## Proposed Cloud Runtime

Stateless services:

- frontend → Cloud Run
- backend → Cloud Run
- ai-service → Cloud Run

Stateful services:

- PostgreSQL → Cloud SQL
- Elasticsearch → Elastic Cloud or managed equivalent
- Neo4j → Neo4j Aura or managed equivalent

## Why Not Deploy Local Compose Directly As Production?

Docker Compose is useful for local orchestration, but production cloud deployment needs:

- managed databases
- managed secrets
- stable public/private networking
- health checks
- observability
- repeatable image registry deployment

## Image Registry Strategy

Container images will be built locally or by CI and pushed to Google Artifact Registry.

Images:

- biointeraction-frontend
- biointeraction-backend
- biointeraction-ai-service

## Environment Variable Strategy

Environment variables are defined through templates under:

deployment/cloud-run/

Files:

- backend.env.example
- ai-service.env.example
- frontend.env.example

No real secrets should be committed to Git.

## Backend Runtime Variables

Required:

SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
AI_SERVICE_BASE_URL
ELASTICSEARCH_BASE_URL

Optional:

SPRING_JPA_HIBERNATE_DDL_AUTO
SPRING_JPA_SHOW_SQL

## AI Service Runtime Variables

Required:

AI_PROVIDER
OPENAI_API_KEY
OPENAI_MODEL

Optional:

GEMINI_API_KEY
GOOGLE_API_KEY
GEMINI_MODEL

## Frontend Runtime Variables

Required:

VITE_API_BASE_URL

Note:

The frontend currently uses build-time Vite configuration. Production runtime configuration may require either:

- build-time API URL injection
- or Nginx runtime config injection later

## Deployment Order

Recommended order:

1. Provision stateful services
2. Deploy ai-service
3. Deploy backend
4. Deploy frontend
5. Validate browser workflow

## Validation Checklist

Backend:

curl /papers

AI service:

curl /health

Frontend:

open browser and validate dashboard

End-to-end:

submit realistic abstract
confirm LLM interactions created
confirm interactions visible in frontend

## Known Limitations

- No authentication yet
- No managed secrets integration yet
- No CI/CD yet
- No production health endpoints on backend yet
- Elasticsearch and Neo4j are still local-compose first
- Graph semantic integrity work remains pending

## Next Steps

- Add backend health endpoint
- Confirm frontend API base URL strategy
- Prepare Artifact Registry commands
- Prepare Cloud Run deploy commands
- Decide managed database/search/graph services
