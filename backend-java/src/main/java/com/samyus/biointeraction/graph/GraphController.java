package com.samyus.biointeraction.graph;

import org.neo4j.driver.Record;
import org.neo4j.driver.Session;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
public class GraphController {

    private final org.neo4j.driver.Driver driver;

    public GraphController(Neo4jClient neo4jClient) {
        this.driver = neo4jClient.getDriver();
    }

    @GetMapping("/graph/interactions")
    public Map<String, Object> getInteractionGraph() {
        Set<String> nodeNames = new HashSet<>();
        List<Map<String, String>> edges = new ArrayList<>();

        try (Session session = driver.session()) {
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
                .map(name -> Map.of("id", name, "label", name))
                .toList();

        return Map.of(
                "nodes", nodes,
                "edges", edges
        );
    }
}
