from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

from app.providers.openai_provider import extract_interactions as openai_extract_interactions


load_dotenv()

app = FastAPI()


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


@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "ai-extraction-service",
        "provider": "openai",
    }


@app.post("/extract/interactions", response_model=ExtractionResponse)
def extract_interactions(request: ExtractionRequest):
    try:
        result = openai_extract_interactions(
            request.title,
            request.abstractText,
        )

        return ExtractionResponse(**result)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"AI extraction failed: {str(error)}"
        )
