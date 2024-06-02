package com.dba.crud.hsdb.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class highScoreDto {

    private Long id;
    private String initial;
    private Integer score;
}
