package com.samyus.biointeraction.controller;

import com.samyus.biointeraction.model.Paper;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/papers")
public class PaperController {

    private final List<Paper> papers = new ArrayList<>();

    @PostMapping
    public Paper createPaper(@RequestBody Map<String, String> request) {
        Paper paper = new Paper(
                request.get("title"),
                request.get("abstract")
        );
        papers.add(paper);
        return paper;
    }

    @GetMapping
    public List<Paper> getPapers() {
        return papers;
    }
}
