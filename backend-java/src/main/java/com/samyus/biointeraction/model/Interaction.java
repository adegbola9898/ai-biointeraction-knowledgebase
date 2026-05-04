package com.samyus.biointeraction.model;

import jakarta.persistence.*;

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

    public Interaction(String proteinA, String proteinB, String interactionType, String evidenceText, Paper paper) {
        this.id = UUID.randomUUID().toString();
        this.proteinA = proteinA;
        this.proteinB = proteinB;
        this.interactionType = interactionType;
        this.evidenceText = evidenceText;
        this.status = Status.PENDING;
        this.paper = paper;
    }

    public String getId() { return id; }
    public String getProteinA() { return proteinA; }
    public String getProteinB() { return proteinB; }
    public String getInteractionType() { return interactionType; }
    public String getEvidenceText() { return evidenceText; }
    public Status getStatus() { return status; }
    public Paper getPaper() { return paper; }
}
