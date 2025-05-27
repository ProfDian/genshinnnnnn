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
@Table(name = "weapon_passives")
public class WeaponPassive {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "weapon_id")
    private Integer weaponId;
    
    @Column(name = "passive_name")
    private String passiveName;
    
    @Column(name = "passive_description", columnDefinition = "TEXT")
    private String passiveDescription;
    
    @ManyToOne
    @JoinColumn(name = "weapon_id", insertable = false, updatable = false)
    @JsonBackReference
    private Weapon weapon;
}