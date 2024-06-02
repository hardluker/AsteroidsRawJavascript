package com.dba.crud.hsdb.services;

import com.dba.crud.hsdb.dtos.highScoreDto;
import com.dba.crud.hsdb.repository.HighScoresRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HighScoreService {

    private final HighScoresRepository highScoresRepository;

    public List<highScoreDto> allRecords() {
        return highScoresRepository.findAll();

    }
}
