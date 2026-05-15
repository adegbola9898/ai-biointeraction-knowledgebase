import json
import os

from dotenv import load_dotenv
import google.generativeai as genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise RuntimeError("Missing GEMINI_API_KEY or GOOGLE_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel(
    os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
)


SYSTEM_PROMPT = """
You extract biological interactions from scientific abstracts.

Return ONLY valid JSON.

Schema:

{
  "interactions": [
    {
      "proteinA": "...",
      "proteinB": "...",
      "interactionType": "...",
      "evidenceText": "...",
      "confidence": 0.95
    }
  ]
}
"""


def extract_interactions(title: str, abstract_text: str):
    prompt = f"""
{SYSTEM_PROMPT}

Title:
{title}

Abstract:
{abstract_text}
"""

    response = model.generate_content(prompt)

    content = response.text.strip()
    content = content.replace("```json", "").replace("```", "").strip()

    return json.loads(content)
