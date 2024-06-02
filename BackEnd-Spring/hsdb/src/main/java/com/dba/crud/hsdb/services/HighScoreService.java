package com.dba.crud.hsdb.services;

import com.dba.crud.hsdb.dtos.HighScoreDto;
import com.dba.crud.hsdb.entities.HighScore;
import com.dba.crud.hsdb.mappers.HighScoreMapper;
import com.dba.crud.hsdb.repository.HighScoresRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public HighScoreDto updateHighScore(Long id, HighScoreDto highScoreDto) {
        Optional<HighScore> existingHighScore = highScoresRepository.findById(id);
        if (existingHighScore.isPresent()) {
            HighScore highScore = existingHighScore.get();
            highScore.setInitial(highScoreDto.getInitial());
            highScore.setScore(highScoreDto.getScore());
            HighScore updatedHighScore = highScoresRepository.save(highScore);
            return highScoreMapper.toHighScoreDto(updatedHighScore);
        } else {
            // Handle the case where the high score with the given id does not exist
            throw new RuntimeException("HighScore not found with id " + id);
        }
    }
}
