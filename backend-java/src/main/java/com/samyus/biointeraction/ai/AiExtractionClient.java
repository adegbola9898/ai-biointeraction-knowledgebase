package com.samyus.biointeraction.ai;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AiExtractionClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map callExtractionService(String text) {
        String url = "http://localhost:8000/extract";

        Map<String, String> request = Map.of("text", text);

        return restTemplate.postForObject(url, request, Map.class);
    }
}
