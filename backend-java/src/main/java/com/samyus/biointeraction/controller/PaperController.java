package com.samyus.biointeraction.controller;

import com.samyus.biointeraction.dto.CreatePaperRequest;
import com.samyus.biointeraction.model.Paper;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/papers")
public class PaperController {

    private final List<Paper> papers = new ArrayList<>();

    @PostMapping
    public Paper createPaper(@Valid @RequestBody CreatePaperRequest request) {
        Paper paper = new Paper(
                request.getTitle(),
                request.getAbstractText()
        );
        papers.add(paper);
        return paper;
    }

    @GetMapping
    public List<Paper> getPapers() {
        return papers;
    }
}
