Sprint 8A — Platform Containerization & Orchestrated Runtime Manual
Sprint Goal

Sprint 8A transformed the biointeraction platform from a locally coordinated development stack into a reproducible multi-service containerized platform orchestrated through Docker Compose.

This sprint established the first true deployable runtime architecture for the system.

1. Starting State Before Sprint 8A

Before this sprint:

Infrastructure Services

The project already used Docker Compose for infrastructure services only:

PostgreSQL
Neo4j
Elasticsearch

via:

docker compose up -d
Application Runtime

However:

Spring Boot backend

was still started manually:

./mvnw spring-boot:run
FastAPI AI service

was also started manually through:

source .venv/bin/activate
uvicorn app.main:app --reload

This created several architectural limitations:

localhost-dependent networking
manual startup ordering
inconsistent runtime environments
non-portable deployment behavior
inability to deploy cleanly to cloud/container platforms

The system was still:

developer-machine coordinated

rather than:

platform orchestrated
2. Sprint 8A Objectives

The sprint aimed to achieve:

Primary Goals
Backend containerization

Convert Spring Boot backend into a reproducible Docker image.

AI service containerization

Convert FastAPI OpenAI extraction service into a portable Docker image.

Service orchestration

Enable backend, AI service, PostgreSQL, Elasticsearch, and Neo4j to communicate entirely through Docker Compose networking.

Environment-driven configuration

Remove hardcoded localhost dependencies.

Productionization foundation

Prepare the system for future:

cloud deployment
CI/CD
scaling
orchestration evolution
3. Spring Boot Backend Containerization
Dockerfile Created

File:

backend-java/Dockerfile

Final structure:

FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY src src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
4. Important Backend Containerization Decisions
Multi-stage build

The backend image uses:

build stage
lightweight runtime stage

This minimizes runtime image size.

Dependency caching optimization

Used:

RUN ./mvnw dependency:go-offline

before copying source files.

This allows:

faster rebuilds
better Docker layer caching
more efficient CI/CD later
Skipping tests during image build

Important decision:

RUN ./mvnw clean package -DskipTests

was intentionally used.

Why?

Spring Boot tests attempted to initialize the application context and connect to PostgreSQL during image build.

This caused failures such as:

Unable to determine Dialect without JDBC metadata

because databases are not guaranteed during Docker build stages.

Architectural conclusion

Docker image builds should focus on:

packaging
reproducibility
runtime assembly

while:

integration testing
orchestration testing
CI validation

will later be handled separately through:

Testcontainers
CI pipelines
dedicated integration test stages
5. Backend .dockerignore Added

File:

backend-java/.dockerignore

Purpose:

reduce build context size
avoid unnecessary files in images
improve build speed
6. FastAPI AI Service Containerization
Dockerfile Created

File:

ai-service-python/Dockerfile

Final structure:

FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
7. AI Service Dependency Stabilization
requirements.txt Expanded

Initial requirements were incomplete.

Final requirements included:

fastapi
uvicorn[standard]
openai
python-dotenv
pydantic
google-generativeai

This ensured:

OpenAI provider support
Gemini provider support
dotenv loading
FastAPI runtime consistency
8. AI Service .dockerignore Added

File:

ai-service-python/.dockerignore

Excluded:

.venv
.env
__pycache__
.git

This was critically important for:

security
image cleanliness
preventing API key leakage
9. AI Service Validation

AI container tested independently:

docker run --rm \
  -p 8000:8000 \
  --env-file .env \
  biointeraction-ai-service

Validation succeeded.

Health endpoint returned:

{
  "status": "UP",
  "service": "ai-extraction-service",
  "provider": "openai"
}

This confirmed:

container runtime integrity
OpenAI environment loading
uvicorn startup
FastAPI application wiring
10. Environment-Driven Backend Configuration
AI Service URL Abstraction

Original backend implementation:

String url = "http://localhost:8000/extract/interactions";

This fails inside containers because:

localhost inside backend container refers to itself
not the AI service container
AiExtractionClient Refactored

New implementation:

@Value("${ai.service.base-url:http://localhost:8000}")
private String aiServiceBaseUrl;

Endpoint construction became:

String url = aiServiceBaseUrl + "/extract/interactions";
application.properties Updated

Added:

ai.service.base-url=${AI_SERVICE_BASE_URL:http://localhost:8000}

This enabled:

local development compatibility
Docker Compose service networking
future cloud deployment flexibility
11. Elasticsearch Containerization Bug Discovery
Initial Failure

After Compose orchestration, POST /papers returned:

500 Internal Server Error

while GET /papers still worked.

This proved:

PostgreSQL persistence worked
backend startup worked
orchestration partially worked
Root Cause

Backend logs revealed:

Connection refused
http://localhost:9200

Inside containers:

localhost

refers to:

the backend container itself

not:

the Elasticsearch container
12. SearchClient Refactor

SearchClient was upgraded to use environment-driven Elasticsearch URLs.

Added:

@Value("${elasticsearch.base-url:http://localhost:9200}")
private String baseUrl;

All indexing/search endpoints were converted to:

baseUrl + "/biointeraction-docs/..."
13. Hidden Architecture Bug Exposed

During clean Docker builds:

SearchController
→ expected searchClient.search(...)

but the rewritten SearchClient accidentally removed:

the search() method

This caused:

cannot find symbol
method search(java.lang.String)

Important architectural lesson:

clean containerized builds expose hidden inconsistencies

Local stale compiled classes had previously masked this issue.

The missing method was restored successfully.

14. Docker Compose Architecture Upgrade
docker-compose.yml Expanded

Compose evolved from infrastructure-only orchestration into full application orchestration.

New services added:

ai-service:
backend:
Final Orchestrated Runtime

Compose now manages:

postgres
neo4j
elasticsearch
ai-service
backend
15. Service Discovery Architecture

Compose networking now uses service names:

postgres
elasticsearch
ai-service

instead of localhost.

Examples:

jdbc:postgresql://postgres:5432/biointeraction_db
http://ai-service:8000
http://elasticsearch:9200

This is the foundational deployment architecture required for:

Kubernetes
cloud runtimes
scalable orchestration
16. Full Orchestrated Runtime Validation
Compose Startup

Validated successfully:

docker compose up --build
Successful Workflow Validation

Validated end-to-end runtime through:

curl -X POST http://localhost:8080/papers

with realistic PubMed-style abstracts.

17. Final Validated Orchestration Flow

The following workflow successfully executed:

API request
→ backend container
→ AI service container
→ OpenAI LLM
→ extracted interactions
→ PostgreSQL persistence
→ Elasticsearch indexing
→ API response

This represented the first true:

fully orchestrated deployable AI scientific platform runtime
18. Final Interaction Validation

Validated interaction extraction:

{
  "proteinA": "EGFR",
  "proteinB": "GRB2",
  "interactionType": "complex formation",
  "confidence": 0.99,
  "extractionModel": "gpt-5.4-mini",
  "extractionMethod": "LLM"
}

This confirmed:

containerized AI extraction
metadata persistence
OpenAI inference orchestration
cross-service runtime stability
19. Architectural Evolution Achieved

Sprint 8A transformed the system from:

manual localhost development stack

into:

environment-driven orchestrated multi-service platform
20. Most Important Architectural Outcomes
Achieved
Reproducible deployment runtime
Multi-container orchestration
Service discovery architecture
Environment-driven configuration
Containerized AI inference
Deployable backend image
Deployable AI service image
Compose-based orchestration
Elimination of localhost assumptions
Productionization foundation
21. Remaining Future Productionization Work

Still pending:

Frontend containerization
Unified frontend orchestration
Cloud deployment targets
Reverse proxy / ingress
Authentication & authorization
Observability & structured logging
CI/CD pipelines
Health probes & readiness checks
Testcontainers integration
Kubernetes readiness
Secret management
Graph semantic integrity work
Advanced biological validation
22. Sprint 8A Final Status

Sprint 8A successfully established the platform’s first true deployable orchestrated runtime architecture.

The system now operates as:

containerized scientific AI platform

rather than:

manually coordinated development application
