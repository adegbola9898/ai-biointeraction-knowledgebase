package com.samyus.biointeraction.service;

import com.samyus.biointeraction.graph.Neo4jClient;
import com.samyus.biointeraction.model.Interaction;
import com.samyus.biointeraction.model.Paper;
import com.samyus.biointeraction.repository.InteractionRepository;
import com.samyus.biointeraction.repository.PaperRepository;
import com.samyus.biointeraction.search.SearchClient;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final PaperRepository paperRepository;
    private final ObjectProvider<Neo4jClient> neo4jClientProvider;
    private final SearchClient searchClient;

    @Value("${graph.enabled:true}")
    private boolean graphEnabled;

    public InteractionService(
            InteractionRepository interactionRepository,
            PaperRepository paperRepository,
            ObjectProvider<Neo4jClient> neo4jClientProvider,
            SearchClient searchClient
    ) {
        this.interactionRepository = interactionRepository;
        this.paperRepository = paperRepository;
        this.neo4jClientProvider = neo4jClientProvider;
        this.searchClient = searchClient;
    }

    public Interaction createInteraction(String proteinA, String proteinB,
                                         String type, String evidence, String paperId) {

        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));

        Interaction interaction = new Interaction(
                proteinA,
                proteinB,
                type,
                evidence,
                1.0,
                "manual",
                "MANUAL",
                paper
        );

        Interaction saved = interactionRepository.save(interaction);

        searchClient.indexInteraction(
                saved.getId(),
                saved.getProteinA(),
                saved.getProteinB(),
                saved.getInteractionType(),
                saved.getEvidenceText(),
                saved.getStatus().name()
        );

        return saved;
    }

    public List<Interaction> getAll() {
        return interactionRepository.findAll();
    }

    public List<Interaction> getByPaperId(String paperId) {
        return interactionRepository.findByPaperId(paperId);
    }

    public Interaction updateStatus(String id, String status) {

        Interaction interaction = interactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interaction not found"));

        Interaction.Status newStatus =
                Interaction.Status.valueOf(status.toUpperCase());

        interaction.setStatus(newStatus);

        Interaction saved = interactionRepository.save(interaction);

        searchClient.indexInteraction(
                saved.getId(),
                saved.getProteinA(),
                saved.getProteinB(),
                saved.getInteractionType(),
                saved.getEvidenceText(),
                saved.getStatus().name()
        );

        Neo4jClient neo4jClient = neo4jClientProvider.getIfAvailable();

        if (
                graphEnabled &&
                neo4jClient != null &&
                newStatus == Interaction.Status.APPROVED
        ) {
            neo4jClient.createInteraction(
                    saved.getProteinA(),
                    saved.getProteinB()
            );
        }

        return saved;
    }
}
