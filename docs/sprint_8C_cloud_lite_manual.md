Sprint 8C — Cloud Lite Deployment Mode Manual
Sprint Goal

Sprint 8C introduced a new deployment architecture strategy called:

Cloud Lite Mode

The purpose of Cloud Lite Mode was to make the platform realistically deployable to cloud infrastructure without requiring expensive or operationally heavy stateful services during the initial deployment phase.

The sprint focused on separating:

core platform functionality

from:

optional infrastructure extensions

such as:

Elasticsearch
Neo4j
1. Problem Being Solved

Before Sprint 8C, the platform architecture assumed all infrastructure services were mandatory:

frontend
backend
ai-service
postgres
elasticsearch
neo4j

This created several deployment challenges:

Elasticsearch startup was memory intensive
Neo4j introduced additional infrastructure complexity
Cloud deployment costs increased significantly
Stateless cloud deployment became difficult
Backend startup depended on graph/search infrastructure availability

This meant:

the entire platform stack had to exist before anything could run
lightweight deployment was impossible
2. Architectural Insight

Sprint 8C recognized an important architectural distinction:

Core Platform Responsibilities

The true core workflow is:

paper submission
→ AI extraction
→ interaction persistence
→ review dashboard

This workflow only fundamentally requires:

frontend
backend
ai-service
postgres
Optional Enhancement Systems

Search and graph capabilities were reclassified as:

optional enhancement infrastructure

rather than:

mandatory runtime dependencies

Specifically:

Elasticsearch

Provides:

full-text search
semantic retrieval
indexed querying

but is not required for:

ingestion
extraction
persistence
Neo4j

Provides:

graph traversal
relationship analytics
network visualization

but is not required for:

paper submission
interaction extraction
interaction review
3. Stateful vs Stateless Architecture

Sprint 8C formalized the distinction between:

Stateless Services

Stateless services do not permanently store critical data internally.

Examples:

frontend
backend
ai-service

These services can:

restart safely
scale horizontally
be redeployed independently

These are suitable for:

Cloud Run deployment
Stateful Services

Stateful services persist critical runtime data.

Examples:

postgres
elasticsearch
neo4j

These services require:

persistence
backup strategy
storage durability
lifecycle management

This distinction drove the Cloud Lite deployment strategy.

4. Runtime Modes Introduced

Sprint 8C established two supported runtime modes.

FULL MODE
Purpose

Local research/development runtime.

Services
frontend
backend
ai-service
postgres
elasticsearch
neo4j
Capabilities
search
graph analytics
interaction network traversal
full local experimentation
CLOUD LITE MODE
Purpose

Minimal deployable production topology.

Services
frontend
backend
ai-service
postgres
Capabilities
paper ingestion
AI extraction
PostgreSQL persistence
interaction review workflows
browser-accessible runtime

WITHOUT:

Elasticsearch
Neo4j
5. Feature Flag Architecture

Sprint 8C introduced runtime feature flags:

search.enabled=${SEARCH_ENABLED:true}
graph.enabled=${GRAPH_ENABLED:true}

These flags allow the same codebase to operate in multiple deployment modes.

FULL MODE
SEARCH_ENABLED=true
GRAPH_ENABLED=true
CLOUD LITE MODE
SEARCH_ENABLED=false
GRAPH_ENABLED=false
6. Neo4j Refactor
Previous Problem

Neo4jClient previously:

hardcoded localhost
initialized immediately at startup
caused backend startup failure if Neo4j was unavailable
Solution

Neo4jClient was converted into an optional Spring component through:

@ConditionalOnProperty

and optional dependency injection using:

ObjectProvider<Neo4jClient>

This allowed:

backend startup without Neo4j
graceful graph disable behavior
deployment flexibility
7. Search Refactor

SearchClient was refactored to:

respect SEARCH_ENABLED
skip indexing operations when disabled
return graceful disabled responses

instead of:

throwing runtime failures
8. Graph API Behavior

When graph functionality is disabled:

{
  "enabled": false,
  "message": "Graph functionality is disabled"
}
9. Search API Behavior

When search functionality is disabled:

{
  "enabled": false,
  "message": "Search functionality is disabled"
}
10. Cloud Lite Compose Runtime

Sprint 8C introduced:

docker-compose.cloud-lite.yml

This compose configuration intentionally excludes:

elasticsearch
neo4j

while preserving:

backend orchestration
AI extraction
PostgreSQL persistence
frontend runtime
11. Validation Results

Cloud Lite Mode was successfully validated.

Backend Health
{"status":"UP","service":"biointeraction-backend"}
Search Disabled Validation
{
  "enabled": false,
  "message": "Search functionality is disabled"
}
Graph Disabled Validation
{
  "enabled": false,
  "message": "Graph functionality is disabled"
}
Paper Submission Validation

Validated successfully:

paper submission
→ backend persistence
→ PostgreSQL storage
→ successful retrieval

WITHOUT:

Elasticsearch
Neo4j
12. Architectural Significance

Sprint 8C transformed the platform from:

all-or-nothing infrastructure coupling

into:

modular deployable platform architecture

This was a major systems-engineering transition.

The platform now supports:

lightweight deployment
staged infrastructure evolution
optional capability expansion
lower-cost production deployment
13. Future Re-Enablement Strategy

Search and graph systems remain fully supported.

They can later be re-enabled through:

SEARCH_ENABLED=true
GRAPH_ENABLED=true

and managed infrastructure such as:

Elastic Cloud
Neo4j Aura

without changing the core application architecture.

14. Next Planned Sprint

Sprint 8D is expected to focus on:

Google Cloud Run deployment

Likely areas:

Artifact Registry
Cloud Run services
managed PostgreSQL
environment variable injection
public deployment URLs
production networking
deployment observability
15. Final Sprint Outcome

Sprint 8C successfully established:

minimal deployable AI scientific platform topology

with:

containerized frontend
containerized backend
containerized AI service
PostgreSQL persistence
optional graph/search infrastructure

This significantly reduced deployment complexity while preserving long-term platform extensibility.
