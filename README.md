# AI-Assisted Biointeraction Knowledgebase

A cloud-native bioinformatics web application for AI-assisted extraction, curation, storage, search, and exploration of molecular interaction knowledge from scientific literature.

## Overview

This project simulates a modern biological knowledgebase platform. It supports a workflow where scientific literature is ingested, processed by an AI extraction service, stored in structured databases, reviewed through a curation workflow, and exposed through search and graph APIs.

The goal is to demonstrate full-stack bioinformatics engineering using Java, Python, APIs, AI services, relational databases, graph databases, search infrastructure, and cloud-ready architecture.

## Core Workflow

```text
Paper ingestion
        ↓
AI-assisted interaction extraction
        ↓
Candidate interaction stored as PENDING
        ↓
Human curation: APPROVED / REJECTED
        ↓
Approved interaction synced to Neo4j graph
        ↓
Papers and interactions indexed in Elasticsearch
Tech Stack
Backend
Java
Spring Boot
Spring Web MVC
Spring Data JPA
PostgreSQL
AI Service
Python
FastAPI
Uvicorn
Databases
PostgreSQL — transactional storage
Neo4j — approved interaction graph
Elasticsearch — search index
Infrastructure
Docker
Docker Compose
GitHub
Current Features
POST /papers — ingest paper metadata and abstract text
GET /papers — list stored papers
AI extraction service: POST /extract
Automatic extraction of EGFR-GRB2 candidate interactions
POST /interactions — manually create interaction candidates
GET /interactions — list interactions
PATCH /interactions/{id}/status — approve or reject interactions
Approved interactions synced to Neo4j
GET /graph/interactions — graph-ready nodes and edges
GET /search?q=... — search papers and interactions via Elasticsearch
AI service failure handling so paper ingestion still succeeds if AI is unavailable
Repository Structure
ai-biointeraction-knowledgebase/
├── ai-service-python/      # FastAPI AI extraction service
├── backend-java/           # Spring Boot backend API
├── docs/                   # Architecture notes and rebuild log
├── frontend/               # Future frontend application
├── infra/                  # Future infrastructure configuration
├── docker-compose.yml      # Local database services
└── README.md
Local Setup
1. Start infrastructure services

From the repository root:

docker-compose up -d

This starts:

PostgreSQL on port 5432
Neo4j on port 7474 and 7687
Elasticsearch on port 9200

Verify Elasticsearch:

curl http://localhost:9200

Verify Neo4j in browser:

http://localhost:7474

Neo4j credentials:

username: neo4j
password: testpassword
2. Run AI extraction service
cd ai-service-python
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

Test:

curl -X POST http://localhost:8000/extract \
-H "Content-Type: application/json" \
-d '{"text": "EGFR interacts with GRB2"}'
3. Run Java backend

Open another terminal:

cd backend-java
./mvnw spring-boot:run

Health check:

curl http://localhost:8080/health
Example API Usage
Create a paper
curl -X POST http://localhost:8080/papers \
-H "Content-Type: application/json" \
-d '{"title": "EGFR signaling", "abstractText": "EGFR interacts with GRB2 in signaling"}'

This stores the paper, calls the AI service, creates a pending interaction, and indexes documents in Elasticsearch.

List interactions
curl http://localhost:8080/interactions
Approve an interaction
curl -X PATCH http://localhost:8080/interactions/INTERACTION_ID/status \
-H "Content-Type: application/json" \
-d '{"status": "APPROVED"}'

Approving an interaction updates PostgreSQL and writes the protein relationship to Neo4j.

Get graph data
curl http://localhost:8080/graph/interactions

Example response:

{
  "nodes": [
    {"id": "EGFR", "label": "EGFR"},
    {"id": "GRB2", "label": "GRB2"}
  ],
  "edges": [
    {"source": "EGFR", "target": "GRB2", "type": "INTERACTS_WITH"}
  ]
}
Search
curl "http://localhost:8080/search?q=EGFR"

Returns matching papers and interactions from Elasticsearch.

Architecture Summary

The system uses Spring Boot as the central orchestration layer. Paper ingestion is handled by the backend, which calls the FastAPI AI service for candidate interaction extraction. PostgreSQL stores core transactional records. Approved interactions are synced to Neo4j for graph representation, while papers and interactions are indexed in Elasticsearch for search.

Current Limitations
AI extraction is currently rule-based and mocked
Search responses return raw Elasticsearch output
Error handling needs structured API responses
No frontend dashboard yet
No authentication yet
Redis caching not yet implemented
Next Steps
Add Redis caching for frequent queries
Build frontend curation dashboard
Add cleaner response DTOs
Add custom exception handling
Add OpenAPI/Swagger documentation
Containerise backend and AI service
Deploy to Google Cloud
