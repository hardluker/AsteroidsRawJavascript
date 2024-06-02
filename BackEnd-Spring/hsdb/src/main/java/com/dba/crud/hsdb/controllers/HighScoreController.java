package com.dba.crud.hsdb.controllers;

import com.dba.crud.hsdb.dtos.HighScoreDto;
import com.dba.crud.hsdb.services.HighScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class HighScoreController {

    private final HighScoreService highScoreService;

    @GetMapping("/api/high-scores")
    public ResponseEntity<List<HighScoreDto>> allRecords() {
        return ResponseEntity.ok(highScoreService.allRecords());
    }

    @PostMapping("/api/high-scores")
    public ResponseEntity<HighScoreDto> createHighScore(@RequestBody HighScoreDto highScoreDto) {
        HighScoreDto createdHighScore = highScoreService.createHighScore(highScoreDto);
        return ResponseEntity.created(URI.create("/api/high-scores" + createdHighScore.getId()))
                .body(createdHighScore);
    }
    @DeleteMapping("/api/high-scores/{id}")
    public ResponseEntity<Void> deleteHighScore(@PathVariable Long id) {
        highScoreService.deleteHighScore(id);
        return ResponseEntity.noContent().build();
    }
}
