package com.dba.crud.hsdb.mappers;

import com.dba.crud.hsdb.dtos.HighScoreDto;
import com.dba.crud.hsdb.entities.HighScore;
import org.mapstruct.Mapper;

import java.util.List;

//This mapper is used for mapping DTOs to Entities and vice versa.
@Mapper(componentModel = "spring")
public interface HighScoreMapper {

    HighScore toHighScore(HighScoreDto dto);

    HighScoreDto toHighScoreDto(HighScore highScore);

    List<HighScoreDto> toHighScoreDtos(List<HighScore> highScores);

}
