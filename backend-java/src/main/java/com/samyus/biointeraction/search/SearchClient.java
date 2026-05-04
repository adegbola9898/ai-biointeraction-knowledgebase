package com.samyus.biointeraction.search;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class SearchClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "http://localhost:9200";

    public void indexPaper(String id, String title, String abstractText) {
        Map<String, Object> document = Map.of(
                "type", "paper",
                "id", id,
                "title", title,
                "abstractText", abstractText
        );

        restTemplate.put(baseUrl + "/biointeraction-docs/_doc/paper-" + id, document);
    }

    public void indexInteraction(String id, String proteinA, String proteinB, String interactionType, String evidenceText, String status) {
        Map<String, Object> document = Map.of(
                "type", "interaction",
                "id", id,
                "proteinA", proteinA,
                "proteinB", proteinB,
                "interactionType", interactionType,
                "evidenceText", evidenceText,
                "status", status
        );

        restTemplate.put(baseUrl + "/biointeraction-docs/_doc/interaction-" + id, document);
    }

    public Map search(String query) {
        Map<String, Object> request = Map.of(
                "query", Map.of(
                        "multi_match", Map.of(
                                "query", query,
                                "fields", new String[]{
                                        "title",
                                        "abstractText",
                                        "proteinA",
                                        "proteinB",
                                        "interactionType",
                                        "evidenceText",
                                        "status"
                                }
                        )
                )
        );

        return restTemplate.postForObject(baseUrl + "/biointeraction-docs/_search", request, Map.class);
    }
}
