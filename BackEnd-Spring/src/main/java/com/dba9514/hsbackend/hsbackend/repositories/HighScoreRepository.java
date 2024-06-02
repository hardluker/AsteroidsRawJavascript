package com.dba9514.hsbackend.hsbackend.repositories;

import com.dba9514.hsbackend.hsbackend.entities.HighScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HighScoreRepository extends JpaRepository<HighScore, Long> {


}
