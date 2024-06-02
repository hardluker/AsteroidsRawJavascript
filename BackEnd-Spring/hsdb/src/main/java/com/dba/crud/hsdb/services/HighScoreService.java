package com.dba.crud.hsdb.services;

import com.dba.crud.hsdb.dtos.HighScoreDto;
import com.dba.crud.hsdb.entities.HighScore;
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

    //This method is to query all records from the high score database.
    public List<HighScoreDto> allRecords() {
        return highScoreMapper.toHighScoreDtos(highScoresRepository.findAll());
    }

    //This method is to add an entry into the high score database.
    public HighScoreDto createHighScore(HighScoreDto highScoreDto) {
        HighScore highScore = highScoreMapper.toHighScore(highScoreDto);

        HighScore createdHighScore = highScoresRepository.save(highScore);

        return highScoreMapper.toHighScoreDto(createdHighScore);
    }

    public void deleteHighScore(Long id) {
        highScoresRepository.deleteById(id);
    }
}
