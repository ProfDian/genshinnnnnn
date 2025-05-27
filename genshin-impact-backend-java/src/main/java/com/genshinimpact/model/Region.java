package com.genshinimpact.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "regions")
public class Region {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "region_name")
    private String regionName;
    
    @Column(columnDefinition = "TEXT")
    private String overview;
    
    @Column(name = "world_map")
    private String worldMap;
    
    @Column(name = "archon_quest")
    private String archonQuest;
    
    @Column(name = "associated_element")
    private String associatedElement;
    
    private String archon;
    
    private String ideal;
    
    @Column(name = "main_city")
    private String mainCity;
    
    @Column(name = "controlling_entity")
    private String controllingEntity;
    
    @Column(name = "celebrated_festivals")
    private String celebratedFestivals;
    
    @Column(name = "how_to_access")
    private String howToAccess;
    
    @Column(name = "region_icon")
    private String regionIcon;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RegionArea> areas;
    
    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<RegionFeature> features;
    
    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Character> characters;
}