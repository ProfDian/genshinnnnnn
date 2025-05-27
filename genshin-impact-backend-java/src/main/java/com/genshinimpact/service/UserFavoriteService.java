package com.genshinimpact.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.genshinimpact.dto.UserFavoriteResponse;
import com.genshinimpact.model.Character;
import com.genshinimpact.model.User;
import com.genshinimpact.model.UserFavorite;
import com.genshinimpact.model.Weapon;
import com.genshinimpact.repository.CharacterRepository;
import com.genshinimpact.repository.UserFavoriteRepository;
import com.genshinimpact.repository.UserRepository;
import com.genshinimpact.repository.WeaponRepository;

@Service
public class UserFavoriteService {

    @Autowired
    private UserFavoriteRepository userFavoriteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CharacterRepository characterRepository;
    
    @Autowired
    private WeaponRepository weaponRepository;
    
    public List<UserFavoriteResponse> getUserFavorites(Integer userId) {
        return userFavoriteRepository.findByUserId(userId).stream()
                .map(UserFavoriteResponse::fromUserFavorite)
                .collect(Collectors.toList());
    }
    
    public List<UserFavoriteResponse> getUserFavoritesByType(Integer userId, String favoriteType) {
        return userFavoriteRepository.findByUserIdAndFavoriteType(userId, favoriteType).stream()
                .map(UserFavoriteResponse::fromUserFavorite)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public UserFavoriteResponse addCharacterFavorite(Integer userId, Integer characterId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Character character = characterRepository.findById(characterId)
                .orElseThrow(() -> new RuntimeException("Character not found with id: " + characterId));
        
        // Check if already favorited
        if (userFavoriteRepository.findByUserIdAndCharacterId(userId, characterId).isPresent()) {
            throw new RuntimeException("Character already in favorites");
        }
        
        UserFavorite userFavorite = new UserFavorite();
        userFavorite.setUser(user);
        userFavorite.setCharacter(character);
        userFavorite.setFavoriteType("character");
        
        UserFavorite savedFavorite = userFavoriteRepository.save(userFavorite);
        return UserFavoriteResponse.fromUserFavorite(savedFavorite);
    }
    
    @Transactional
    public UserFavoriteResponse addWeaponFavorite(Integer userId, Integer weaponId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Weapon weapon = weaponRepository.findById(weaponId)
                .orElseThrow(() -> new RuntimeException("Weapon not found with id: " + weaponId));
        
        // Check if already favorited
        if (userFavoriteRepository.findByUserIdAndWeaponId(userId, weaponId).isPresent()) {
            throw new RuntimeException("Weapon already in favorites");
        }
        
        UserFavorite userFavorite = new UserFavorite();
        userFavorite.setUser(user);
        userFavorite.setWeapon(weapon);
        userFavorite.setFavoriteType("weapon");
        
        UserFavorite savedFavorite = userFavoriteRepository.save(userFavorite);
        return UserFavoriteResponse.fromUserFavorite(savedFavorite);
    }
    
    @Transactional
    public void removeCharacterFavorite(Integer userId, Integer characterId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        if (!characterRepository.existsById(characterId)) {
            throw new RuntimeException("Character not found with id: " + characterId);
        }
        
        UserFavorite favorite = userFavoriteRepository.findByUserIdAndCharacterId(userId, characterId)
                .orElseThrow(() -> new RuntimeException("Character favorite not found"));
        
        userFavoriteRepository.delete(favorite);
    }
    
    @Transactional
    public void removeWeaponFavorite(Integer userId, Integer weaponId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        if (!weaponRepository.existsById(weaponId)) {
            throw new RuntimeException("Weapon not found with id: " + weaponId);
        }
        
        UserFavorite favorite = userFavoriteRepository.findByUserIdAndWeaponId(userId, weaponId)
                .orElseThrow(() -> new RuntimeException("Weapon favorite not found"));
        
        userFavoriteRepository.delete(favorite);
    }
}