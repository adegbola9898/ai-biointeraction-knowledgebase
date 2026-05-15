package com.samyus.biointeraction.model;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interactions")
public class Interaction {

    @Id
    private String id;

    private String proteinA;

    private String proteinB;

    private String interactionType;

    private String evidenceText;

    private Double confidence;

    private String extractionModel;

    private String extractionMethod;

    private Instant extractionTimestamp;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "paper_id")
    private Paper paper;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    public Interaction() {}

    public Interaction(
            String proteinA,
            String proteinB,
            String interactionType,
            String evidenceText,
            Double confidence,
            String extractionModel,
            String extractionMethod,
            Paper paper
    ) {
        this.id = UUID.randomUUID().toString();

        this.proteinA = proteinA;
        this.proteinB = proteinB;

        this.interactionType = interactionType;

        this.evidenceText = evidenceText;

        this.confidence = confidence;

        this.extractionModel = extractionModel;

        this.extractionMethod = extractionMethod;

        this.extractionTimestamp = Instant.now();

        this.status = Status.PENDING;

        this.paper = paper;
    }

    public String getId() {
        return id;
    }

    public String getProteinA() {
        return proteinA;
    }

    public String getProteinB() {
        return proteinB;
    }

    public String getInteractionType() {
        return interactionType;
    }

    public String getEvidenceText() {
        return evidenceText;
    }

    public Double getConfidence() {
        return confidence;
    }

    public String getExtractionModel() {
        return extractionModel;
    }

    public String getExtractionMethod() {
        return extractionMethod;
    }

    public Instant getExtractionTimestamp() {
        return extractionTimestamp;
    }

    public Status getStatus() {
        return status;
    }

    public Paper getPaper() {
        return paper;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
