package com.dba.crud.hsdb.controllers;

import com.dba.crud.hsdb.dtos.HighScoreDto;
import com.dba.crud.hsdb.services.HighScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HighScoreController {

    private final HighScoreService highScoreService;

    @GetMapping("/api/high-scores")
    public ResponseEntity<List<HighScoreDto>> allRecords() {
        return ResponseEntity.ok(highScoreService.allRecords());
    }
}
