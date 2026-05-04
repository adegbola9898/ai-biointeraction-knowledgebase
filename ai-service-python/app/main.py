from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ExtractionRequest(BaseModel):
    text: str

@app.post("/extract")
def extract_interactions(request: ExtractionRequest):
    text = request.text

    # Simple mock extraction logic
    interactions = []

    if "EGFR" in text and "GRB2" in text:
        interactions.append({
            "proteinA": "EGFR",
            "proteinB": "GRB2",
            "interactionType": "binding",
            "evidenceText": text
        })

    return {
        "interactions": interactions
    }
