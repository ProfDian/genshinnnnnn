package com.genshinimpact.model;

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
@Table(name = "character_talents")
public class CharacterTalent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "character_id")
    private Integer characterId;
    
    @Column(name = "talent_type")
    private String talentType;
    
    @Column(name = "talent_name")
    private String talentName;
    
    @Column(name = "talent_description", columnDefinition = "TEXT")
    private String talentDescription;
    
    @ManyToOne
    @JoinColumn(name = "character_id", insertable = false, updatable = false)
    @JsonBackReference
    private Character character;
}