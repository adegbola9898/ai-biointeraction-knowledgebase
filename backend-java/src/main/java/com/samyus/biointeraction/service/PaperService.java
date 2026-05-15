package com.samyus.biointeraction.service;

import com.samyus.biointeraction.ai.AiExtractionClient;
import com.samyus.biointeraction.model.Interaction;
import com.samyus.biointeraction.model.Paper;
import com.samyus.biointeraction.repository.InteractionRepository;
import com.samyus.biointeraction.repository.PaperRepository;
import com.samyus.biointeraction.search.SearchClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PaperService {

    private final PaperRepository paperRepository;
    private final AiExtractionClient aiClient;
    private final InteractionRepository interactionRepository;
    private final SearchClient searchClient;

    public PaperService(
            PaperRepository paperRepository,
            AiExtractionClient aiClient,
            InteractionRepository interactionRepository,
            SearchClient searchClient
    ) {
        this.paperRepository = paperRepository;
        this.aiClient = aiClient;
        this.interactionRepository = interactionRepository;
        this.searchClient = searchClient;
    }

    public Paper createPaper(String title, String abstractText) {
        Paper paper = new Paper(title, abstractText);
        Paper savedPaper = paperRepository.save(paper);

        searchClient.indexPaper(
                savedPaper.getId(),
                savedPaper.getTitle(),
                savedPaper.getAbstractText()
        );

        try {
            Map response = aiClient.callExtractionService(title, abstractText);
            List<Map> interactions = (List<Map>) response.get("interactions");

            for (Map interactionData : interactions) {
                Interaction interaction = new Interaction(
                        (String) interactionData.get("proteinA"),
                        (String) interactionData.get("proteinB"),
                        (String) interactionData.get("interactionType"),
                        (String) interactionData.get("evidenceText"),
                        ((Number) interactionData.get("confidence")).doubleValue(),
                        "gpt-5.4-mini",
                        "LLM",
                        savedPaper
                );

                Interaction savedInteraction = interactionRepository.save(interaction);

                searchClient.indexInteraction(
                        savedInteraction.getId(),
                        savedInteraction.getProteinA(),
                        savedInteraction.getProteinB(),
                        savedInteraction.getInteractionType(),
                        savedInteraction.getEvidenceText(),
                        savedInteraction.getStatus().name()
                );
            }

        } catch (Exception e) {
            System.out.println("AI extraction failed: " + e.getMessage());
        }

        return savedPaper;
    }

    public List<Paper> getAllPapers() {
        return paperRepository.findAll();
    }

    public Paper getPaperById(String id) {
        return paperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found"));
    }
}
