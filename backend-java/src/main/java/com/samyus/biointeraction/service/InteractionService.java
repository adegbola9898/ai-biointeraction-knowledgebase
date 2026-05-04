package com.samyus.biointeraction.service;

import com.samyus.biointeraction.graph.Neo4jClient;
import com.samyus.biointeraction.model.Interaction;
import com.samyus.biointeraction.model.Paper;
import com.samyus.biointeraction.repository.InteractionRepository;
import com.samyus.biointeraction.repository.PaperRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final PaperRepository paperRepository;
    private final Neo4jClient neo4jClient;

    public InteractionService(
            InteractionRepository interactionRepository,
            PaperRepository paperRepository,
            Neo4jClient neo4jClient
    ) {
        this.interactionRepository = interactionRepository;
        this.paperRepository = paperRepository;
        this.neo4jClient = neo4jClient;
    }

    public Interaction createInteraction(String proteinA, String proteinB,
                                         String type, String evidence, String paperId) {

        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));

        Interaction interaction = new Interaction(
                proteinA, proteinB, type, evidence, paper
        );

        return interactionRepository.save(interaction);
    }

    public List<Interaction> getAll() {
        return interactionRepository.findAll();
    }

    public Interaction updateStatus(String id, String status) {

        Interaction interaction = interactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interaction not found"));

        Interaction.Status newStatus = Interaction.Status.valueOf(status.toUpperCase());

        interaction.setStatus(newStatus);

        Interaction saved = interactionRepository.save(interaction);

        // 🔥 THIS IS THE IMPORTANT PART
        if (newStatus == Interaction.Status.APPROVED) {
            neo4jClient.createInteraction(
                    saved.getProteinA(),
                    saved.getProteinB()
            );
        }

        return saved;
    }
}
