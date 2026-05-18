# Sprint 8D — Final Platform Status

## Platform Overview

The AI Biointeraction Knowledgebase is now deployed as a live cloud-native scientific AI platform on Google Cloud.

The system supports:

- scientific abstract submission
- LLM-driven biological interaction extraction
- persistent storage of papers and interactions
- interaction review workflows
- frontend visualization and dashboard access
- cloud-hosted API infrastructure

## Final Cloud Architecture

Frontend (React + Vite + Nginx)
↓
Backend API (Spring Boot)
↓
AI Extraction Service (FastAPI + OpenAI)
↓
Cloud SQL PostgreSQL

## Public Service URLs

Frontend:

https://biointeraction-frontend-289872008588.us-central1.run.app

Backend:

https://biointeraction-backend-289872008588.us-central1.run.app

AI Service:

https://biointeraction-ai-service-289872008588.us-central1.run.app

## Infrastructure Components

### Google Cloud Run

Used for stateless container deployment of:

- frontend
- backend
- ai-service

### Google Artifact Registry

Stores container images for all deployed services.

Repository:

bio-platform-registry

### Google Cloud SQL

PostgreSQL persistence layer for:

- papers
- extracted interactions
- review workflow data

Instance:

biointeraction-postgres

### Google Secret Manager

Stores sensitive credentials including:

- OPENAI_API_KEY

## Production Features Successfully Validated

### Frontend

Validated:

- dashboard loading
- paper submission
- API communication
- cloud-hosted workflow execution

### Backend

Validated:

- health endpoints
- paper persistence
- interaction persistence
- backend orchestration logic
- Cloud SQL connectivity

### AI Extraction Service

Validated:

- OpenAI API integration
- structured extraction workflow
- interaction confidence scoring
- cloud-hosted inference requests

### End-to-End Workflow

Validated:

1. User submits scientific abstract
2. Frontend calls backend API
3. Backend persists paper
4. Backend calls AI extraction service
5. AI service performs LLM extraction
6. Extracted interactions returned to backend
7. Backend persists interactions
8. Frontend retrieves interactions for review

## Example Validated Biological Interactions

The deployed platform successfully extracted interactions including:

- EGFR recruits GRB2
- EGFR promotes MAPK signaling
- ERK1/2 interacts with ELK1

## Important Engineering Lessons

### Build-Time vs Runtime Environment Variables

The frontend required Docker build-time ARG configuration for:

VITE_API_BASE_URL

### Cloud SQL Java Connectivity

Spring Boot required:

com.google.cloud.sql:postgres-socket-factory

for Cloud Run to Cloud SQL connectivity.

### Serverless Database Connection Management

Cloud SQL connection exhaustion occurred due to default Hikari pool sizing.

Resolution:

spring.datasource.hikari.maximum-pool-size=2

### CORS Configuration

Backend CORS policy required explicit Cloud Run frontend origin allow-listing.

## Current Deployment Mode

The system currently runs in Cloud Lite mode.

Enabled:

- frontend
- backend
- ai-service
- PostgreSQL persistence
- LLM extraction
- review workflow

Disabled:

- Elasticsearch
- Neo4j graph persistence

## Remaining Productionization Goals

### Infrastructure

- CI/CD pipeline
- Terraform/IaC
- autoscaling policy tuning
- cost monitoring
- backup strategy
- observability stack

### Security

- authentication
- role-based review workflow
- secret hardening
- HTTPS custom domain
- audit logging

### Scientific Workflow

- ontology normalization
- gene/protein disambiguation
- PubMed integration
- reviewer approval system
- evidence ranking
- citation tracing

### Platform Expansion

- managed search reintroduction
- managed graph reintroduction
- async extraction queues
- batch ingestion
- paper upload support

## Final Outcome

Sprint 8D successfully transitioned the project from a local development prototype into a publicly deployed cloud-native scientific AI platform capable of real-time biological interaction extraction and persistence.

The platform now demonstrates:

- distributed systems engineering
- AI service orchestration
- cloud-native deployment
- production containerization
- managed database integration
- scientific workflow automation
- real-world LLM integration

