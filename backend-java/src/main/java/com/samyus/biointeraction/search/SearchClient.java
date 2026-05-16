package com.samyus.biointeraction.search;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class SearchClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${elasticsearch.base-url:http://localhost:9200}")
    private String baseUrl;

    public void indexPaper(String id, String title, String abstractText) {
        String url = baseUrl + "/biointeraction-docs/_doc/paper-" + id;

        Map<String, Object> body = Map.of(
                "type", "paper",
                "paperId", id,
                "title", title,
                "abstractText", abstractText
        );

        sendDocument(url, body);
    }

    public void indexInteraction(
            String id,
            String proteinA,
            String proteinB,
            String interactionType,
            String evidenceText,
            String status
    ) {
        String url = baseUrl + "/biointeraction-docs/_doc/interaction-" + id;

        Map<String, Object> body = Map.of(
                "type", "interaction",
                "interactionId", id,
                "proteinA", proteinA,
                "proteinB", proteinB,
                "interactionType", interactionType,
                "evidenceText", evidenceText,
                "status", status
        );

        sendDocument(url, body);
    }

    public Map search(String query) {
        String url = baseUrl + "/biointeraction-docs/_search";

        Map<String, Object> body = Map.of(
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

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        return restTemplate.postForObject(url, request, Map.class);
    }

    private void sendDocument(String url, Map<String, Object> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.put(url, request);
    }
}
