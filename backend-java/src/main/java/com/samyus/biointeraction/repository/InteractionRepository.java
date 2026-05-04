package com.samyus.biointeraction.repository;

import com.samyus.biointeraction.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InteractionRepository extends JpaRepository<Interaction, String> {
}
