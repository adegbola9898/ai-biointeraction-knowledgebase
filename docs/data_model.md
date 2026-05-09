# Data Model

## Overview

The system is designed around a clear separation between extracted data and curated, validated biological knowledge.

---

## Entities

### Paper

Represents a scientific article or abstract.

Fields:
- id (UUID)
- title (string)
- abstract (text)
- source (string)
- created_at (timestamp)

---

### Interaction

Represents a molecular interaction extracted from text.

Fields:
- id (UUID)
- protein_a (string)
- protein_b (string)
- interaction_type (string)
- evidence_text (text)
- status (enum: pending, approved, rejected)
- paper_id (foreign key)

---

### CurationTask

Represents a curator decision on an interaction.

Fields:
- id (UUID)
- interaction_id (foreign key)
- status (enum: pending, approved, rejected)
- curator_id (string)
- decision_timestamp (timestamp)

---

### (Optional) Complex

Represents a molecular complex.

Fields:
- id (UUID)
- name (string)
- description (text)

---

## Key Design Idea

The system explicitly separates:

- **Extracted interactions (unvalidated)**
- **Curated interactions (validated)**

This reflects real-world biocuration systems where human validation is required to ensure data quality.
