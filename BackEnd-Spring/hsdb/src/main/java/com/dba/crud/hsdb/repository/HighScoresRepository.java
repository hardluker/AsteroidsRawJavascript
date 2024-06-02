package com.dba.crud.hsdb.repository;

import com.dba.crud.hsdb.entities.HighScore;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HighScoresRepository extends JpaRepository<HighScore, Long> {
}
