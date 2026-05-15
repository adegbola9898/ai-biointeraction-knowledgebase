import json
import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise RuntimeError("Missing OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

SYSTEM_PROMPT = """
You extract biological protein or gene interactions from scientific abstracts.

Return ONLY valid JSON with this schema:

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

If no interaction is present, return:
{
  "interactions": []
}
"""


def extract_interactions(title: str, abstract_text: str):
    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": f"Title:\n{title}\n\nAbstract:\n{abstract_text}",
            },
        ],
    )

    content = response.choices[0].message.content

    return json.loads(content)
