package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.genshinimpact.model.CharacterStat;

@Repository
public interface CharacterStatRepository extends JpaRepository<CharacterStat, Integer> {
    
    List<CharacterStat> findByCharacterIdOrderByAscensionAscLevelAsc(Integer characterId);
    
    /**
     * Delete all stats for a character
     * 
     * @param characterId The ID of the character
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM CharacterStat s WHERE s.characterId = :characterId")
    void deleteByCharacterId(@Param("characterId") int characterId);
}