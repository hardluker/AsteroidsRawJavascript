package com.dba.crud.hsdb.services;

import com.dba.crud.hsdb.dtos.HighScoreDto;
import com.dba.crud.hsdb.mappers.HighScoreMapper;
import com.dba.crud.hsdb.repository.HighScoresRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HighScoreService {

    private final HighScoresRepository highScoresRepository;
    private final HighScoreMapper highScoreMapper;

    public List<HighScoreDto> allRecords() {
        return highScoreMapper.toHighScoreDtos(highScoresRepository.findAll());
    }
}
