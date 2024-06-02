package com.dba9514.hsbackend.hsbackend.controllers;

import com.dba9514.hsbackend.hsbackend.entities.HighScore;
import com.dba9514.hsbackend.hsbackend.repositories.HighScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/high-score")
public class HighScoreController {

    @Autowired
    private HighScoreRepository highScoreRepository;

    @GetMapping
    public List<HighScore> getAllHighScores() {
        return highScoreRepository.findAll();
    }

    @GetMapping("/{id}")
    public HighScore getHighScoreById(@PathVariable Long id) {
        return highScoreRepository.findById(id).get();
    }

    @PostMapping
    public HighScore createHighScore(@RequestBody HighScore highScore) {
        return highScoreRepository.save(highScore);
    }

    @PutMapping("/{id}")
    public HighScore updateHighScore(@PathVariable Long id, @RequestBody HighScore highScore) {
        HighScore existingHighScore = highScoreRepository.findById(id).get();
        existingHighScore.setInitials(highScore.getInitials());
        existingHighScore.setScore(highScore.getScore());
        return highScoreRepository.save(existingHighScore);
    }

    @DeleteMapping("/{id}")
    public String deleteHighScore(@PathVariable Long id) {
        try {
            highScoreRepository.deleteById(id);
            return "High Score deleted successfully";
        }
        catch (Exception e) {
            return "High Score Not Found.";
        }
    }
}
