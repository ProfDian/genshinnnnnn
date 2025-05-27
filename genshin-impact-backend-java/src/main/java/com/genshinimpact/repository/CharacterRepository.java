package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.Character;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Integer> {
    
    // Find characters with deleted_at is null
    Page<Character> findByDeletedAtIsNull(Pageable pageable);
    
    // Find characters with filters
    @Query("SELECT c FROM Character c WHERE c.deletedAt IS NULL " +
           "AND (:elementId IS NULL OR c.elementId = :elementId) " +
           "AND (:weaponTypeId IS NULL OR c.weaponTypeId = :weaponTypeId) " +
           "AND (:regionId IS NULL OR c.regionId = :regionId) " +
           "AND (:rarityId IS NULL OR c.rarityId = :rarityId) " +
           "AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Character> findWithFilters(
            @Param("search") String search,
            @Param("elementId") Integer elementId,
            @Param("weaponTypeId") Integer weaponTypeId,
            @Param("regionId") Integer regionId,
            @Param("rarityId") Integer rarityId,
            Pageable pageable);
    
    /**
     * Find all characters belonging to a specific region
     * 
     * @param regionId The ID of the region
     * @return List of characters from the specified region
     */
    List<Character> findByRegionId(Integer regionId);
    
    /**
     * Find all non-deleted characters belonging to a specific region
     * 
     * @param regionId The ID of the region
     * @return List of active characters from the specified region
     */
    @Query("SELECT c FROM Character c WHERE c.regionId = :regionId AND c.deletedAt IS NULL")
    List<Character> findActiveCharactersByRegionId(@Param("regionId") Integer regionId);
}