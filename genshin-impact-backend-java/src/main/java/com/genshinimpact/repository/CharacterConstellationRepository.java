package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.genshinimpact.model.CharacterConstellation;

@Repository
public interface CharacterConstellationRepository extends JpaRepository<CharacterConstellation, Integer> {
    
    List<CharacterConstellation> findByCharacterIdOrderByConstellationLevelAsc(Integer characterId);
    
    /**
     * Delete all constellations for a character
     * 
     * @param characterId The ID of the character
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM CharacterConstellation c WHERE c.characterId = :characterId")
    void deleteByCharacterId(@Param("characterId") int characterId);
}