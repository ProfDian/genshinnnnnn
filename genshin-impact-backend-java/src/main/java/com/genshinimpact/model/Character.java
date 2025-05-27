package com.genshinimpact.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "characters")
public class Character {
    
    @Id
    private Integer id;
    
    private String name;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String detail;
    
    private String constellation;
    
    @Column(name = "element_id")
    private Integer elementId;
    
    @Column(name = "weapon_type_id")
    private Integer weaponTypeId;
    
    @Column(name = "region_id")
    @JsonIgnore
    private Integer regionId;
    
    @Column(name = "rarity_id")
    private Integer rarityId;
    
    private String icon;
    
    @Column(name = "gacha_img")
    private String gachaImg;
    
    private String birthday;
    
    @Column(name = "release_date")
    private Long releaseDate;
    
    @Column(name = "native")
    private String nativeVoice;
    
    @Column(name = "cv_en")
    private String cvEn;
    
    @Column(name = "cv_chs")
    private String cvChs;
    
    @Column(name = "cv_jp")
    private String cvJp;
    
    @Column(name = "cv_kr")
    private String cvKr;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "element_id", insertable = false, updatable = false)
    private Element element;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "weapon_type_id", insertable = false, updatable = false)
    private WeaponType weaponType;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "region_id", insertable = false, updatable = false)
    private Region region;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rarity_id", insertable = false, updatable = false)
    private Rarity rarity;
    
    @OneToMany(mappedBy = "character")
    @JsonManagedReference
    private List<CharacterTalent> talents;
    
    @OneToMany(mappedBy = "character")
    @JsonManagedReference
    private List<CharacterPassive> passives;
    
    @OneToMany(mappedBy = "character")
    @JsonManagedReference
    private List<CharacterConstellation> constellations;
    
    @OneToMany(mappedBy = "character")
    @JsonManagedReference
    private List<CharacterStat> stats;
}