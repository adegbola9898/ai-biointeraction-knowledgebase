package com.samyus.biointeraction.service;

import com.samyus.biointeraction.model.Paper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaperService {

    private final List<Paper> papers = new ArrayList<>();

    public Paper createPaper(String title, String abstractText) {
        Paper paper = new Paper(title, abstractText);
        papers.add(paper);
        return paper;
    }

    public List<Paper> getAllPapers() {
        return papers;
    }
}
