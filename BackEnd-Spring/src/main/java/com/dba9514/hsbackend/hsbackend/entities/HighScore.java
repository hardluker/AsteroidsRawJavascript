package com.dba9514.hsbackend.hsbackend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "high-scores2")
public class HighScore {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "initials")
    private String initials;

    @Column(name = "score")
    private Integer score;

    //Getters and Setters

    public void setId(Long id) {
        this.id = id;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }




}
