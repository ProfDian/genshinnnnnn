package com.genshinimpact.dto;

import java.time.LocalDateTime;

import com.genshinimpact.model.UserFavorite;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoriteResponse {
    private Integer id;
    private Integer userId;
    private Integer characterId;
    private String characterName;
    private Integer weaponId;
    private String weaponName;
    private String favoriteType;
    private LocalDateTime createdAt;
    
    public static UserFavoriteResponse fromUserFavorite(UserFavorite userFavorite) {
        UserFavoriteResponse response = new UserFavoriteResponse();
        response.setId(userFavorite.getId());
        response.setUserId(userFavorite.getUser().getId());
        response.setFavoriteType(userFavorite.getFavoriteType());
        response.setCreatedAt(userFavorite.getCreatedAt());
        
        if (userFavorite.getCharacter() != null) {
            response.setCharacterId(userFavorite.getCharacter().getId());
            response.setCharacterName(userFavorite.getCharacter().getName());
        }
        
        if (userFavorite.getWeapon() != null) {
            response.setWeaponId(userFavorite.getWeapon().getId());
            response.setWeaponName(userFavorite.getWeapon().getName());
        }
        
        return response;
    }
}