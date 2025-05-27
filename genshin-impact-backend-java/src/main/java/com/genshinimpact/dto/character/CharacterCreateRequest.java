package com.genshinimpact.dto.character;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CharacterCreateRequest {
    private Integer id;
    private String name;
    private String title;
    private String detail;
    private String constellation;
    private Integer elementId;
    private Integer weaponTypeId;
    private Integer regionId;
    private Integer rarityId;
    private String icon;
    private String gachaImg;
    private String birthday;
    private Long releaseDate;
    private String nativeVoice;
    private String cvEn;
    private String cvChs;
    private String cvJp;
    private String cvKr;
}