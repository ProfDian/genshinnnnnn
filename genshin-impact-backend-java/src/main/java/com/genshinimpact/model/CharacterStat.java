package com.genshinimpact.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "character_stats")
public class CharacterStat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "character_id")
    private Integer characterId;
    
    private Integer ascension;
    
    private Integer level;
    
    @Column(name = "base_atk")
    private Float baseAtk;
    
    @Column(name = "stat_type")
    private String statType;
    
    @Column(name = "stat_value")
    private Float statValue;
    
    private Float hp;
    
    private Float def;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne
    @JoinColumn(name = "character_id", insertable = false, updatable = false)
    @JsonBackReference
    private Character character;
}