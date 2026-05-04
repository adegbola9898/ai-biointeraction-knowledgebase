package com.samyus.biointeraction.service;

import com.samyus.biointeraction.ai.AiExtractionClient;
import com.samyus.biointeraction.model.Interaction;
import com.samyus.biointeraction.model.Paper;
import com.samyus.biointeraction.repository.InteractionRepository;
import com.samyus.biointeraction.repository.PaperRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PaperService {

    private final PaperRepository paperRepository;
    private final AiExtractionClient aiClient;
    private final InteractionRepository interactionRepository;

    public PaperService(
            PaperRepository paperRepository,
            AiExtractionClient aiClient,
            InteractionRepository interactionRepository
    ) {
        this.paperRepository = paperRepository;
        this.aiClient = aiClient;
        this.interactionRepository = interactionRepository;
    }

    public Paper createPaper(String title, String abstractText) {
        Paper paper = new Paper(title, abstractText);
        Paper savedPaper = paperRepository.save(paper);

        Map response = aiClient.callExtractionService(abstractText);
        List<Map> interactions = (List<Map>) response.get("interactions");

        for (Map interactionData : interactions) {
            Interaction interaction = new Interaction(
                    (String) interactionData.get("proteinA"),
                    (String) interactionData.get("proteinB"),
                    (String) interactionData.get("interactionType"),
                    (String) interactionData.get("evidenceText"),
                    savedPaper
            );

            interactionRepository.save(interaction);
        }

        return savedPaper;
    }

    public List<Paper> getAllPapers() {
        return paperRepository.findAll();
    }
}
