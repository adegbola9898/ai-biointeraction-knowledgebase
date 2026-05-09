# System Architecture

## Overview

The AI-Assisted Biointeraction Knowledgebase is a modular, cloud-native system designed to support AI-assisted biocuration workflows.

The system separates responsibilities across frontend, backend, AI services, and data storage layers.

---

## High-Level Components

### Frontend
- Framework: React (planned)
- Responsibility:
  - User interaction
  - Display papers and interactions
  - Support curation workflow

---

### Backend API (Java - Spring Boot)
- Handles:
  - Core business logic
  - Data persistence
  - API endpoints
  - Orchestration of AI service

---

### AI Service (Python - FastAPI)
- Handles:
  - Text processing
  - Interaction extraction
  - Returns structured candidate interactions

---

### Data Layer

#### PostgreSQL
- Stores:
  - Papers
  - Interaction candidates
  - Validated interactions
  - Curation tasks

#### (Future) Neo4j
- Stores:
  - Graph representation of interactions

#### (Future) Elasticsearch
- Enables:
  - Full-text and structured search

---

## System Workflow

1. User submits a paper or abstract
2. Backend stores paper in PostgreSQL
3. Backend sends text to AI service
4. AI service extracts candidate interactions
5. Backend stores candidates as "pending"
6. Curator reviews interactions
7. Approved interactions are persisted as validated knowledge
8. Data is exposed via API and UI

---

## Design Principles

- Modular architecture (separation of concerns)
- API-first design
- Human-in-the-loop validation
- Incremental complexity (start simple, extend later)
