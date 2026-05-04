package com.samyus.biointeraction.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateInteractionRequest {

    @NotBlank
    private String proteinA;

    @NotBlank
    private String proteinB;

    @NotBlank
    private String interactionType;

    @NotBlank
    private String evidenceText;

    @NotBlank
    private String paperId;

    public String getProteinA() { return proteinA; }
    public String getProteinB() { return proteinB; }
    public String getInteractionType() { return interactionType; }
    public String getEvidenceText() { return evidenceText; }
    public String getPaperId() { return paperId; }
}
