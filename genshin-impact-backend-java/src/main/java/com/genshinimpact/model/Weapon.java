package com.genshinimpact.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "weapons")
public class Weapon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "weapon_type_id")
    private Integer weaponTypeId;
    
    @Column(name = "rarity_id")
    private Integer rarityId;
    
    @Column(name = "special_property")
    private String specialProperty;
    
    private String icon;
    
    @Column(columnDefinition = "TEXT")
    private String story;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne
    @JoinColumn(name = "weapon_type_id", insertable = false, updatable = false)
    private WeaponType weaponType;
    
    @ManyToOne
    @JoinColumn(name = "rarity_id", insertable = false, updatable = false)
    private Rarity rarity;
    
    @OneToMany(mappedBy = "weapon")
    @JsonManagedReference
    private List<WeaponPassive> passives;
    
    @OneToMany(mappedBy = "weapon")
    @JsonManagedReference
    private List<WeaponRefinement> refinements;
    
    @OneToMany(mappedBy = "weapon")
    @JsonManagedReference
    private List<WeaponStat> weaponStats;
}