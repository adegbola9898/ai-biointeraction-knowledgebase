package com.samyus.biointeraction.controller;

import com.samyus.biointeraction.dto.CreateInteractionRequest;
import com.samyus.biointeraction.dto.UpdateInteractionStatusRequest;
import com.samyus.biointeraction.model.Interaction;
import com.samyus.biointeraction.service.InteractionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interactions")
public class InteractionController {

    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }

    @PostMapping
    public Interaction create(@Valid @RequestBody CreateInteractionRequest req) {
        return interactionService.createInteraction(
                req.getProteinA(),
                req.getProteinB(),
                req.getInteractionType(),
                req.getEvidenceText(),
                req.getPaperId()
        );
    }

    @GetMapping
    public List<Interaction> getAll() {
        return interactionService.getAll();
    }

    @PatchMapping("/{id}/status")
    public Interaction updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateInteractionStatusRequest request
    ) {
        return interactionService.updateStatus(id, request.getStatus());
    }
}
