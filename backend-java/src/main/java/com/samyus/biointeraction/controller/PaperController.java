package com.samyus.biointeraction.controller;

import com.samyus.biointeraction.dto.CreatePaperRequest;
import com.samyus.biointeraction.model.Paper;
import com.samyus.biointeraction.service.PaperService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/papers")
public class PaperController {

    private final PaperService paperService;

    public PaperController(PaperService paperService) {
        this.paperService = paperService;
    }

    @PostMapping
    public Paper createPaper(@Valid @RequestBody CreatePaperRequest request) {
        return paperService.createPaper(
                request.getTitle(),
                request.getAbstractText()
        );
    }

    @GetMapping
    public List<Paper> getPapers() {
        return paperService.getAllPapers();
    }

    @GetMapping("/{id}")
    public Paper getPaperById(@PathVariable String id) {
        return paperService.getPaperById(id);
    }
}
