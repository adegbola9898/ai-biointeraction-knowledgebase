package com.samyus.biointeraction.graph;

import org.neo4j.driver.Record;
import org.neo4j.driver.Session;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
public class GraphController {

    private final ObjectProvider<Neo4jClient> neo4jClientProvider;

    @Value("${graph.enabled:true}")
    private boolean graphEnabled;

    public GraphController(ObjectProvider<Neo4jClient> neo4jClientProvider) {
        this.neo4jClientProvider = neo4jClientProvider;
    }

    @GetMapping("/graph/interactions")
    public Map<String, Object> getInteractionGraph() {

        if (!graphEnabled) {
            return Map.of(
                    "enabled", false,
                    "message", "Graph functionality is disabled"
            );
        }

        Neo4jClient neo4jClient = neo4jClientProvider.getIfAvailable();

        if (neo4jClient == null) {
            return Map.of(
                    "enabled", false,
                    "message", "Neo4j client unavailable"
            );
        }

        Set<String> nodeNames = new HashSet<>();
        List<Map<String, String>> edges = new ArrayList<>();

        try (Session session = neo4jClient.getDriver().session()) {

            List<Record> records = session.readTransaction(tx ->
                    tx.run("""
                        MATCH (a:Protein)-[:INTERACTS_WITH]->(b:Protein)
                        RETURN a.name AS source, b.name AS target
                    """).list()
            );

            for (Record record : records) {

                String source = record.get("source").asString();
                String target = record.get("target").asString();

                nodeNames.add(source);
                nodeNames.add(target);

                edges.add(Map.of(
                        "source", source,
                        "target", target,
                        "type", "INTERACTS_WITH"
                ));
            }
        }

        List<Map<String, String>> nodes = nodeNames.stream()
                .map(name -> Map.of(
                        "id", name,
                        "label", name
                ))
                .toList();

        return Map.of(
                "enabled", true,
                "nodes", nodes,
                "edges", edges
        );
    }
}
