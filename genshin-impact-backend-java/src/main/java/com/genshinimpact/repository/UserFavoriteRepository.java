package com.genshinimpact.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.UserFavorite;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Integer> {
    
    List<UserFavorite> findByUserId(Integer userId);
    
    List<UserFavorite> findByUserIdAndFavoriteType(Integer userId, String favoriteType);
    
    Optional<UserFavorite> findByUserIdAndCharacterId(Integer userId, Integer characterId);
    
    Optional<UserFavorite> findByUserIdAndWeaponId(Integer userId, Integer weaponId);
    
    void deleteByUserIdAndCharacterId(Integer userId, Integer characterId);
    
    void deleteByUserIdAndWeaponId(Integer userId, Integer weaponId);
}