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
@Table(name = "character_passives")
public class CharacterPassive {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "character_id")
    private Integer characterId;
    
    @Column(name = "passive_order")
    private Integer passiveOrder;
    
    @Column(name = "passive_name")
    private String passiveName;
    
    @Column(name = "passive_description", columnDefinition = "TEXT")
    private String passiveDescription;
    
    @Column(name = "unlock_level")
    private Integer unlockLevel;
    
    @ManyToOne
    @JoinColumn(name = "character_id", insertable = false, updatable = false)
    @JsonBackReference
    private Character character;
}