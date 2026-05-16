Sprint 7A Manual — FastAPI LLM Extraction Foundation
Goal

Sprint 7A upgraded the AI extraction layer from a simple rule-based/mock extractor into a dedicated FastAPI service capable of calling a real LLM provider and returning structured biological interaction data.

The architectural goal was:

Spring Boot = orchestration/business logic
FastAPI = AI/LLM inference layer
OpenAI = biological interaction extraction engine
1. Starting State

The project already had:

ai-service-python/
  app/
    main.py
  requirements.txt

The original FastAPI service used a simple mock/rule-based extraction endpoint:

@app.post("/extract")
def extract_interactions(request: ExtractionRequest):

Input:

{
  "text": "EGFR interacts with GRB2"
}

Output:

{
  "interactions": [
    {
      "proteinA": "EGFR",
      "proteinB": "GRB2",
      "interactionType": "binding",
      "evidenceText": "EGFR interacts with GRB2"
    }
  ]
}

This worked, but it was not a real LLM workflow.

2. Contract Upgrade

The FastAPI service was upgraded to use a more realistic paper-based input contract.

New Input Contract
{
  "title": "EGFR signaling",
  "abstractText": "EGFR interacts with GRB2 during signaling."
}
New Output Contract
{
  "interactions": [
    {
      "proteinA": "EGFR",
      "proteinB": "GRB2",
      "interactionType": "interacts_with",
      "evidenceText": "EGFR interacts with GRB2 during signaling.",
      "confidence": 0.99
    }
  ]
}

The key addition was:

confidence

This allows the curation UI to show how confident the AI was about each extracted interaction.

3. FastAPI Endpoint Upgrade

The endpoint changed from:

POST /extract

to:

POST /extract/interactions

This made the service more explicit and future-proof.

The new FastAPI service now exposes:

GET /health
POST /extract/interactions
4. Pydantic Schemas Added

Sprint 7A introduced typed request and response models.

class ExtractionRequest(BaseModel):
    title: str
    abstractText: str
class ExtractedInteraction(BaseModel):
    proteinA: str
    proteinB: str
    interactionType: str
    evidenceText: str
    confidence: float
class ExtractionResponse(BaseModel):
    interactions: List[ExtractedInteraction]

This is important because the AI service now has a stable API contract that Spring Boot can depend on.

5. Gemini Provider Attempt

A Gemini provider was created first:

app/providers/gemini_provider.py

Environment variables used:

GEMINI_API_KEY=
GOOGLE_API_KEY=
GEMINI_MODEL=

Several issues were debugged:

Issue 1 — API key not detected

Fix:

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)
Issue 2 — model name mismatch

gemini-1.5-flash was not available for the active API version.

The model was changed to:

GEMINI_MODEL=gemini-2.0-flash
Issue 3 — quota failure

Gemini returned:

429 quota exceeded

So Gemini authentication and provider wiring worked, but quota blocked continued testing.

Decision:

Switch to OpenAI provider
6. OpenAI Provider Integration

The OpenAI SDK was installed inside the Python virtual environment:

pip install openai

An OpenAI provider was created:

app/providers/openai_provider.py

Environment variables:

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
AI_PROVIDER=openai

The OpenAI provider used:

from openai import OpenAI

and called:

client.chat.completions.create(...)

with:

response_format={"type": "json_object"}

This forces the model to return JSON instead of free text.

7. Final FastAPI main.py State

The FastAPI app was updated to import the OpenAI provider:

from app.providers.openai_provider import extract_interactions as openai_extract_interactions

The extraction endpoint now calls OpenAI:

result = openai_extract_interactions(
    request.title,
    request.abstractText,
)

and validates the returned result through:

ExtractionResponse(**result)

This ensures the final API response matches the expected schema.

8. Validation Performed

The health endpoint was tested:

curl http://localhost:8000/health

Successful output:

{
  "status": "UP",
  "service": "ai-extraction-service",
  "provider": "openai"
}

The extraction endpoint was tested:

curl -X POST http://localhost:8000/extract/interactions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "EGFR signaling",
    "abstractText": "EGFR interacts with GRB2 during signaling."
  }'

Successful output:

{
  "interactions": [
    {
      "proteinA": "EGFR",
      "proteinB": "GRB2",
      "interactionType": "interacts_with",
      "evidenceText": "EGFR interacts with GRB2 during signaling.",
      "confidence": 0.99
    }
  ]
}

This confirmed real LLM-powered biological extraction.

9. Security Issue and Recovery

During the first commit, the entire ai-service-python folder was added, including:

.venv/
.env
__pycache__/

This accidentally exposed an OpenAI API key.

GitHub detected the secret, and OpenAI disabled the leaked key.

Recovery steps completed:

Added .gitignore

Ignored:

.venv/
venv/
env/
__pycache__/
*.pyc
.env
*.env
Removed tracked generated/sensitive files

Used:

git rm -r --cached ai-service-python/.venv
git rm --cached ai-service-python/.env
git rm -r --cached ai-service-python/app/__pycache__
git rm -r --cached ai-service-python/app/providers/__pycache__
Confirmed cleanup
git ls-files | grep -E "ai-service-python/(\.env|\.venv|__pycache__)"

Returned no output.

Created new OpenAI key

The leaked key was disabled and replaced locally.

The new key was stored only in:

ai-service-python/.env

and is no longer tracked.

10. Final Sprint 7A Outcome

Sprint 7A successfully transformed the AI service from:

rule-based mock extraction

into:

OpenAI-powered biological interaction extraction

The platform now has:

FastAPI AI service
OpenAI provider
structured JSON output
confidence scoring
provider abstraction foundation
secure local environment handling
validated extraction endpoint
11. Current Architecture After Sprint 7A
React frontend
    ↓
Spring Boot backend
    ↓
FastAPI AI service
    ↓
OpenAI LLM
    ↓
Structured biological interaction JSON

Current FastAPI output is ready for Spring Boot integration.

12. Sprint 7B Starting Point

Your current Spring Boot AI client is still old:

public Map callExtractionService(String text) {
    String url = "http://localhost:8000/extract";

    Map<String, String> request = Map.of("text", text);

    return restTemplate.postForObject(url, request, Map.class);
}

It must now be upgraded to call:

http://localhost:8000/extract/interactions

with:

{
  "title": "...",
  "abstractText": "..."
}

That is the next implementation step.
