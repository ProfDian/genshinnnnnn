package com.genshinimpact.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.Weapon;

@Repository
public interface WeaponRepository extends JpaRepository<Weapon, Integer> {
    
    @Query("SELECT DISTINCT w FROM Weapon w " +
           "LEFT JOIN FETCH w.weaponType " +
           "LEFT JOIN FETCH w.rarity " +
           "WHERE w.deletedAt IS NULL " +
           "AND (:weaponTypeId IS NULL OR w.weaponTypeId = :weaponTypeId) " +
           "AND (:rarityId IS NULL OR w.rarityId = :rarityId) " +
           "AND (:search IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Weapon> findWithFilters(
            @Param("search") String search,
            @Param("weaponTypeId") Integer weaponTypeId,
            @Param("rarityId") Integer rarityId,
            Pageable pageable);
    
    // Basic weapon info
    @Query("SELECT w FROM Weapon w " +
           "LEFT JOIN FETCH w.weaponType " +
           "LEFT JOIN FETCH w.rarity " +
           "WHERE w.id = :id AND w.deletedAt IS NULL")
    Optional<Weapon> findWeaponWithBasicInfoById(@Param("id") Integer id);
    
    // Find weapon with passives
    @Query("SELECT DISTINCT w FROM Weapon w " +
           "LEFT JOIN FETCH w.passives " +
           "WHERE w.id = :id AND w.deletedAt IS NULL")
    Optional<Weapon> findWeaponWithPassivesById(@Param("id") Integer id);
    
    // Find weapon with refinements
    @Query("SELECT DISTINCT w FROM Weapon w " +
           "LEFT JOIN FETCH w.refinements " +
           "WHERE w.id = :id AND w.deletedAt IS NULL")
    Optional<Weapon> findWeaponWithRefinementsById(@Param("id") Integer id);
    
    // Find weapon with stats
    @Query("SELECT DISTINCT w FROM Weapon w " +
           "LEFT JOIN FETCH w.weaponStats " +
           "WHERE w.id = :id AND w.deletedAt IS NULL")
    Optional<Weapon> findWeaponWithStatsById(@Param("id") Integer id);
}