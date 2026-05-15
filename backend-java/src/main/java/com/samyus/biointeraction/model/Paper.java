package com.samyus.biointeraction.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "papers")
public class Paper {

    @Id
    private String id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String abstractText;

    public Paper() {
        // JPA requires default constructor
    }

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
