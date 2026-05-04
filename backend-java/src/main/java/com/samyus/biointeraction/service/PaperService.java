package com.samyus.biointeraction.service;

import com.samyus.biointeraction.model.Paper;
import com.samyus.biointeraction.repository.PaperRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaperService {

    private final PaperRepository paperRepository;

    public PaperService(PaperRepository paperRepository) {
        this.paperRepository = paperRepository;
    }

    public Paper createPaper(String title, String abstractText) {
        Paper paper = new Paper(title, abstractText);
        return paperRepository.save(paper);
    }

    public List<Paper> getAllPapers() {
        return paperRepository.findAll();
    }
}
