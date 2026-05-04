package com.samyus.biointeraction.graph;

import org.neo4j.driver.*;
import org.springframework.stereotype.Component;

@Component
public class Neo4jClient implements AutoCloseable {

    private final Driver driver;

    public Neo4jClient() {
        this.driver = GraphDatabase.driver(
                "bolt://localhost:7687",
                AuthTokens.basic("neo4j", "testpassword")
        );
    }

    public void createInteraction(String proteinA, String proteinB) {
        try (Session session = driver.session()) {
            session.executeWrite(tx -> {
                tx.run(
                        "MERGE (a:Protein {name: $a}) " +
                        "MERGE (b:Protein {name: $b}) " +
                        "MERGE (a)-[:INTERACTS_WITH]->(b)",
                        Values.parameters("a", proteinA, "b", proteinB)
                );
                return null;
            });
        }
    }

    @Override
    public void close() {
        driver.close();
    }
}
