package com.samyus.biointeraction.search;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class SearchController {

    private final SearchClient searchClient;

    public SearchController(SearchClient searchClient) {
        this.searchClient = searchClient;
    }

    @GetMapping("/search")
    public Map search(@RequestParam String q) {
        return searchClient.search(q);
    }
}
