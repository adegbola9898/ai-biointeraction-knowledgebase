package com.samyus.biointeraction.graph;

import org.neo4j.driver.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
        name = "graph.enabled",
        havingValue = "true",
        matchIfMissing = true
)
public class Neo4jClient implements AutoCloseable {

    private final Driver driver;

    public Neo4jClient(
            @Value("${neo4j.uri:bolt://localhost:7687}") String uri,
            @Value("${neo4j.username:neo4j}") String username,
            @Value("${neo4j.password:testpassword}") String password
    ) {
        this.driver = GraphDatabase.driver(
                uri,
                AuthTokens.basic(username, password)
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

    public Driver getDriver() {
        return driver;
    }

    @Override
    public void close() {
        driver.close();
    }
}
