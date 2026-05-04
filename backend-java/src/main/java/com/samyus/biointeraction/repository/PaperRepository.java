package com.samyus.biointeraction.repository;

import com.samyus.biointeraction.model.Paper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaperRepository extends JpaRepository<Paper, String> {
}
