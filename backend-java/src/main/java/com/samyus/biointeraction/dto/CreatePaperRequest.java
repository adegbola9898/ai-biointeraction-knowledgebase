package com.samyus.biointeraction.dto;

import jakarta.validation.constraints.NotBlank;

public class CreatePaperRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Abstract text is required")
    private String abstractText;

    public String getTitle() {
        return title;
    }

    public String getAbstractText() {
        return abstractText;
    }
}
