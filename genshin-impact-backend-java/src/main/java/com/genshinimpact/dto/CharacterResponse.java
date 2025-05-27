package com.genshinimpact.dto;

import java.util.List;

import com.genshinimpact.model.Character;
import com.genshinimpact.model.CharacterConstellation;
import com.genshinimpact.model.CharacterPassive;
import com.genshinimpact.model.CharacterStat;
import com.genshinimpact.model.CharacterTalent;
import com.genshinimpact.model.Element;
import com.genshinimpact.model.Rarity;
import com.genshinimpact.model.Region;
import com.genshinimpact.model.WeaponType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CharacterResponse {
    private Integer id;
    private String name;
    private String title;
    private String detail;
    private String constellation;
    private String icon;
    private String gachaImg;
    private String birthday;
    private Long releaseDate;
    private Element element;
    private WeaponType weaponType;
    private Region region;
    private Rarity rarity;
    private List<CharacterStat> stats;
    private List<CharacterTalent> talents;
    private List<CharacterPassive> passives;
    private List<CharacterConstellation> constellations;
    
    public static CharacterResponse fromEntity(Character character) {
        CharacterResponse response = new CharacterResponse();
        response.setId(character.getId());
        response.setName(character.getName());
        response.setTitle(character.getTitle());
        response.setDetail(character.getDetail());
        response.setConstellation(character.getConstellation());
        response.setIcon(character.getIcon());
        response.setGachaImg(character.getGachaImg());
        response.setBirthday(character.getBirthday());
        response.setReleaseDate(character.getReleaseDate());
        response.setElement(character.getElement());
        response.setWeaponType(character.getWeaponType());
        response.setRegion(character.getRegion());
        response.setRarity(character.getRarity());
        return response;
    }
    
}