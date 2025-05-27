package com.genshinimpact.dto;

import com.genshinimpact.model.Rarity;
import com.genshinimpact.model.Weapon;
import com.genshinimpact.model.WeaponPassive;
import com.genshinimpact.model.WeaponRefinement;
import com.genshinimpact.model.WeaponStat;
import com.genshinimpact.model.WeaponType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeaponResponse {
    private Integer id;
    private String name;
    private String description;
    private String specialProperty;
    private String icon;
    private String story;
    private WeaponType weaponType;
    private Rarity rarity;
    private List<WeaponPassive> passives;
    private List<WeaponRefinement> refinements;
    private List<WeaponStat> weaponStats;
    
    public static WeaponResponse fromEntity(Weapon weapon) {
        WeaponResponse response = new WeaponResponse();
        response.setId(weapon.getId());
        response.setName(weapon.getName());
        response.setDescription(weapon.getDescription());
        response.setSpecialProperty(weapon.getSpecialProperty());
        response.setIcon(weapon.getIcon());
        response.setStory(weapon.getStory());
        response.setWeaponType(weapon.getWeaponType());
        response.setRarity(weapon.getRarity());
        response.setPassives(weapon.getPassives());
        response.setRefinements(weapon.getRefinements());
        response.setWeaponStats(weapon.getWeaponStats());
        return response;
    }
}