package com.samyus.biointeraction.repository;

import com.samyus.biointeraction.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InteractionRepository extends JpaRepository<Interaction, String> {

    List<Interaction> findByPaperId(String paperId);
}
