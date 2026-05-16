Sprint 8B — Frontend Containerization & Unified Platform Runtime Manual
Sprint Goal

Sprint 8B completed the platform containerization transition by converting the React frontend into a production-style containerized runtime and integrating it into the unified Docker Compose orchestration architecture.

This sprint established the first fully browser-accessible orchestrated runtime of the biointeraction platform.

1. Starting State Before Sprint 8B

Before Sprint 8B:

Already Containerized

The platform already had:

PostgreSQL container
Elasticsearch container
Neo4j container
Spring Boot backend container
FastAPI AI service container

All orchestrated successfully through:

docker compose up --build
Frontend Runtime Limitation

However, the frontend still relied on:

npm run dev

through the Vite development server.

This created several productionization limitations:

frontend runtime not containerized
frontend startup required local Node.js tooling
inconsistent runtime architecture
non-production serving behavior
no unified platform orchestration
no deployable frontend artifact

The platform was still partially split between:

orchestrated containers
and:
local development runtime
2. Sprint 8B Objectives

Sprint 8B aimed to achieve:

Primary Goals
Frontend Docker image creation
Production frontend runtime
Nginx static asset serving
React browser routing support
Compose integration
Unified platform startup
Browser-accessible orchestrated runtime
3. Why Nginx Was Introduced

A key architectural decision was using:

Nginx

instead of:

Vite dev server

for production runtime.

Reasoning

Vite is optimized primarily for:

local development
hot reload
development tooling

Nginx provides:

lightweight production serving
efficient static asset delivery
proper browser routing support
deployable runtime behavior
reverse proxy compatibility
cloud deployment friendliness
Important React Routing Requirement

The application uses routes such as:

/papers
/interactions
/graph
/search

Without proper Nginx configuration:

browser refreshes on nested routes fail
direct URL access breaks

This was solved through:

try_files $uri /index.html;

which redirects unknown frontend routes back into the React application.

4. Frontend Dockerfile Created

File:

frontend/Dockerfile

Final implementation:

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
5. Frontend Build Architecture

Sprint 8B introduced a:

multi-stage frontend build

architecture.

Stage 1 — React Build

The Node.js build stage:

installs dependencies
compiles TypeScript
runs Vite production build
generates optimized static assets in dist/
Stage 2 — Runtime Image

The Nginx runtime stage:

serves compiled frontend assets
excludes build tooling
minimizes runtime image size

This created a significantly smaller and cleaner production image.

6. nginx.conf Added

File:

frontend/nginx.conf

Final configuration:

server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
7. Frontend .dockerignore Added

File:

frontend/.dockerignore

Excluded:

node_modules
dist
git metadata
environment files
logs

Purpose:

reduce Docker build context
improve build speed
prevent unnecessary files entering images
8. Frontend Image Validation

The frontend image was successfully built through:

docker build -t biointeraction-frontend .
Build Validation Confirmed

Validated successfully:

Node.js dependency installation
TypeScript compilation
Vite production build
Nginx runtime assembly
image export

Important validation output:

naming to docker.io/library/biointeraction-frontend

This confirmed a valid deployable frontend artifact was created.

9. Elasticsearch Runtime Optimization

During Sprint 8B, an important infrastructure issue was addressed.

Problem

Elasticsearch startup behavior was:

extremely heavy
slow to initialize
memory intensive

This created:

long compose startup times
orchestration delays
developer confusion during validation
Root Cause

Elasticsearch automatically allocates memory aggressively when JVM limits are unspecified.

Solution

Compose configuration updated with:

ES_JAVA_OPTS=-Xms1g -Xmx1g

This constrained Elasticsearch heap allocation.

Result

Improved:

startup behavior
memory predictability
orchestration responsiveness

while remaining sufficient for development-scale indexing workloads.

10. Frontend Compose Integration

The frontend was integrated into:

docker-compose.yml

through:

frontend:
  build:
    context: ./frontend
  container_name: biointeraction-frontend
  depends_on:
    - backend
  ports:
    - "3000:80"
11. Unified Platform Runtime Achieved

Sprint 8B completed the transition into:

single-command platform orchestration

through:

docker compose up --build
12. Final Runtime Architecture After Sprint 8B

The platform architecture became:

Browser
→ Frontend container (Nginx)
→ Backend container (Spring Boot)
→ AI service container (FastAPI)
→ OpenAI LLM
→ PostgreSQL
→ Elasticsearch
→ Neo4j

This represented the first complete:

browser-accessible containerized AI scientific platform runtime
13. Frontend Runtime Validation

Validated successfully through browser access:

http://localhost:3000
Successfully Validated
Papers Dashboard
Paper Detail page
Interaction dashboard
AI-driven paper submission
Interaction extraction persistence
Backend API integration
Compose service networking
Browser-accessible runtime
14. Most Important Architectural Transition

Sprint 8B transformed the frontend from:

development server runtime

into:

production-style deployable web runtime
15. Productionization Implications

After Sprint 8B:

The platform became realistically deployable to:

Google Cloud Run
Azure Container Apps
AWS ECS
DigitalOcean Apps
Kubernetes
Docker Swarm

because every major runtime component is now:

containerized
environment-driven
orchestrated
reproducible
16. Major Architectural Outcomes
Achieved
Fully containerized platform
Browser-accessible orchestration runtime
Production-style frontend runtime
Nginx static serving
Unified Docker Compose startup
Runtime service networking
Production-ready frontend routing
Deployable frontend image
Environment-driven orchestration
17. Remaining Future Work

Still pending:

Cloud deployment target selection
Reverse proxy consolidation
HTTPS/TLS
Authentication & authorization
Observability/logging
Health checks
CI/CD
Secret management
Image registry workflows
Kubernetes manifests
Graph semantic integrity work
Biological relationship normalization
Advanced interaction curation workflows
18. Sprint 8B Final Status

Sprint 8B successfully completed the platform’s transition into a:

fully containerized browser-accessible scientific AI platform

The project now operates as:

orchestrated deployable infrastructure

rather than:

locally coordinated development tooling
