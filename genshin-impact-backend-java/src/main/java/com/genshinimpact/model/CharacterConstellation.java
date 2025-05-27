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
@Table(name = "character_constellations")
public class CharacterConstellation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "character_id")
    private Integer characterId;
    
    @Column(name = "constellation_level")
    private Integer constellationLevel;
    
    @Column(name = "constellation_name")
    private String constellationName;
    
    @Column(name = "constellation_description", columnDefinition = "TEXT")
    private String constellationDescription;
    
    @Column(name = "constellation_icon")
    private String constellationIcon;
    
    @ManyToOne
    @JoinColumn(name = "character_id", insertable = false, updatable = false)
    @JsonBackReference
    private Character character;
}