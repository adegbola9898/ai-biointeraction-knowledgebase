# AI-Assisted Biointeraction Knowledgebase

## Cloud-Native Scientific AI Platform for Molecular Interaction Extraction and Curation

A production-grade bioinformatics platform for AI-assisted extraction, review, persistence, search, and exploration of biological interaction knowledge from scientific literature.

The platform combines:

* cloud-native infrastructure
* distributed backend services
* LLM-powered scientific extraction
* relational persistence
* graph-oriented biological modeling
* scientific review workflows
* modern frontend engineering

into a unified scientific AI system.

---

# Live Platform

## Public Frontend

[https://biointeraction-frontend-289872008588.us-central1.run.app](https://biointeraction-frontend-289872008588.us-central1.run.app)

## Public Backend API

[https://biointeraction-backend-289872008588.us-central1.run.app](https://biointeraction-backend-289872008588.us-central1.run.app)

## AI Extraction Service

[https://biointeraction-ai-service-289872008588.us-central1.run.app](https://biointeraction-ai-service-289872008588.us-central1.run.app)

---

# Platform Overview

The AI-Assisted Biointeraction Knowledgebase simulates a modern scientific knowledge infrastructure platform.

The system enables:

1. ingestion of scientific literature
2. AI-assisted extraction of molecular interactions
3. persistence of extracted evidence-backed relationships
4. human review and curation workflows
5. graph-oriented biological relationship modeling
6. searchable interaction retrieval
7. cloud-native deployment and orchestration

The project was intentionally designed to evolve beyond a traditional bioinformatics pipeline into a distributed scientific software platform.

---

# Core Scientific Workflow

```text
Scientific abstract submission
                ↓
Backend persistence in PostgreSQL
                ↓
Backend orchestration of AI extraction service
                ↓
LLM extraction of candidate molecular interactions
                ↓
Confidence scoring and evidence generation
                ↓
Persistence of candidate interactions as PENDING
                ↓
Human review and scientific validation workflow
                ↓
Approved interactions available for graph integration
```

---

# Cloud Architecture

```text
Frontend (React + Vite + Nginx)
                ↓
Backend API (Spring Boot)
                ↓
AI Extraction Service (FastAPI + OpenAI)
                ↓
Cloud SQL PostgreSQL
```

Infrastructure components:

* Google Cloud Run
* Google Artifact Registry
* Google Cloud SQL
* Google Secret Manager
* Docker
* Docker Compose

The platform currently operates in a Cloud Lite deployment mode:

Enabled:

* frontend
* backend
* AI extraction service
* PostgreSQL persistence
* scientific review workflow
* LLM extraction

Temporarily disabled in cloud mode:

* Elasticsearch
* Neo4j graph persistence

These services remain available locally.

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Axios
* Cytoscape.js
* Nginx

## Backend

* Java 21
* Spring Boot
* Spring Web MVC
* Spring Data JPA
* PostgreSQL
* HikariCP

## AI Service

* Python 3.12
* FastAPI
* Uvicorn
* OpenAI API

## Databases

### PostgreSQL

Transactional persistence for:

* papers
* interactions
* review workflow state

### Neo4j (local mode)

Graph-oriented persistence for approved interactions.

### Elasticsearch (local mode)

Search indexing for papers and interactions.

## Infrastructure

* Docker
* Docker Compose
* Google Cloud Run
* Google Artifact Registry
* Google Cloud SQL
* Google Secret Manager
* GitHub

---

# Current Platform Features

## Scientific Paper Ingestion

Users can submit PubMed-style scientific abstracts through the frontend dashboard or backend API.

## AI-Assisted Molecular Interaction Extraction

The backend orchestrates extraction requests through a dedicated FastAPI AI service.

The AI service:

* analyzes scientific text
* identifies candidate molecular interactions
* extracts evidence text
* assigns confidence scores
* returns structured interaction data

## Review Workflow

Extracted interactions are persisted as:

```text
PENDING
```

before scientific review.

This models real-world curation pipelines used in biological databases.

## Interaction Persistence

Validated interactions are stored in PostgreSQL.

## Search Infrastructure

Local mode supports Elasticsearch indexing and retrieval.

## Graph Infrastructure

Local mode supports Neo4j graph persistence and graph retrieval APIs.

## Cloud-Native Deployment

The full platform is publicly deployed on Google Cloud Run.

---

# Example Scientific Extraction

## Input Abstract

```text
Activated EGFR recruited GRB2 and promoted downstream MAPK signaling in epithelial carcinoma cells.
```

## Example Extracted Interactions

```text
EGFR recruits GRB2
EGFR promotes MAPK signaling
```

## Example Persisted Interaction

```json
{
  "proteinA": "EGFR",
  "proteinB": "GRB2",
  "interactionType": "recruits",
  "confidence": 0.99,
  "extractionMethod": "LLM",
  "status": "PENDING"
}
```

---

# API Overview

## Health

```http
GET /health
```

## Papers

```http
POST /papers
GET /papers
```

## Interactions

```http
GET /interactions
POST /interactions
PATCH /interactions/{id}/status
GET /interactions/paper/{paperId}
```

## Search

```http
GET /search?q=EGFR
```

## Graph

```http
GET /graph/interactions
```

---

# Local Development

## Clone Repository

```bash
git clone https://github.com/adegbola9898/ai-biointeraction-knowledgebase.git
cd ai-biointeraction-knowledgebase
```

---

## Start Infrastructure

```bash
docker compose up -d
```

This starts:

* PostgreSQL
* Neo4j
* Elasticsearch

---

## Start AI Service

```bash
cd ai-service-python
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

---

## Start Backend

```bash
cd backend-java
./mvnw spring-boot:run
```

---

## Start Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Cloud Deployment

The production platform is deployed on Google Cloud Run.

Deployment includes:

* containerized frontend
* containerized backend
* containerized AI extraction service
* managed PostgreSQL persistence
* cloud secret management
* artifact registry image hosting

Key engineering challenges solved:

* Cloud SQL connectivity from Spring Boot
* Cloud Run port configuration
* build-time frontend environment configuration
* CORS handling across distributed services
* serverless database connection management
* secret injection through Secret Manager

---

# Repository Structure

```text
ai-biointeraction-knowledgebase/
├── ai-service-python/      # FastAPI AI extraction service
├── backend-java/           # Spring Boot backend API
├── deployment/             # Cloud deployment configuration
├── docs/                   # Sprint manuals and architecture docs
├── frontend/               # React frontend dashboard
├── infra/                  # Future infrastructure configuration
├── docker-compose.yml
├── docker-compose.cloud-lite.yml
└── README.md
```

---

# Scientific Goals

The platform aims to evolve toward:

* biological knowledge graph construction
* automated literature mining
* evidence-backed molecular interaction curation
* ontology-aware biological normalization
* reviewer-assisted scientific validation workflows
* scalable biological relationship exploration

Potential future domains include:

* oncology signaling networks
* transcriptomic biomarker discovery
* pathogen-host interactions
* One Health genomic surveillance
* metagenomic knowledge integration

---

# Engineering Roadmap

## Platform Infrastructure

* CI/CD pipelines
* Infrastructure as Code
* autoscaling policy tuning
* observability stack
* cost monitoring
* automated backups

## Security

* authentication and authorization
* reviewer role management
* audit logging
* custom domains and HTTPS hardening

## AI Workflow Evolution

* async extraction queues
* batch paper ingestion
* PubMed integration
* evidence ranking
* citation tracing
* ontology normalization
* biological entity disambiguation

## Search and Graph Expansion

* managed Elasticsearch/OpenSearch
* managed Neo4j deployment
* graph visualization enhancements
* semantic search
* embedding-based retrieval

---

# Lessons Learned

The project evolved from a local prototype into a distributed cloud-native scientific AI platform.

Major engineering lessons included:

* distributed service orchestration
* cloud-native deployment strategy
* Docker multi-stage builds
* Cloud Run deployment architecture
* frontend build-time environment injection
* serverless database scaling behavior
* production CORS configuration
* AI service decomposition
* scientific workflow modeling
* production-grade infrastructure debugging

---

# Final Status

The platform is now capable of:

* real-time scientific abstract ingestion
* live LLM-driven molecular interaction extraction
* persistent cloud-hosted storage
* frontend interaction review workflows
* distributed service orchestration
* public cloud deployment

This project demonstrates the intersection of:

* bioinformatics
* scientific software engineering
* cloud infrastructure
* AI systems engineering
* distributed backend architecture
* knowledgebase platform design

---

# License

MIT License
