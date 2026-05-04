package com.samyus.biointeraction.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateInteractionStatusRequest {

    @NotBlank
    private String status;

    public String getStatus() {
        return status;
    }
}
