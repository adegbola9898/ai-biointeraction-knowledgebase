package com.samyus.biointeraction.ai;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AiExtractionClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map callExtractionService(String title, String abstractText) {
        String url = "http://localhost:8000/extract/interactions";

        Map<String, String> request = Map.of(
                "title", title,
                "abstractText", abstractText
        );

        return restTemplate.postForObject(url, request, Map.class);
    }
}
