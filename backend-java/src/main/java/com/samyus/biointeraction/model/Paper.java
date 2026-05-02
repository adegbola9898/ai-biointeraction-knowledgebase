package com.samyus.biointeraction.model;

import java.util.UUID;

public class Paper {

    private String id;
    private String title;
    private String abstractText;

    public Paper(String title, String abstractText) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.abstractText = abstractText;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAbstractText() {
        return abstractText;
    }
}
