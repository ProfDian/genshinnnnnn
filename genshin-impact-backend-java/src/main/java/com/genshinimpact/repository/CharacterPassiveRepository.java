package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.genshinimpact.model.CharacterPassive;

@Repository
public interface CharacterPassiveRepository extends JpaRepository<CharacterPassive, Integer> {
    
    List<CharacterPassive> findByCharacterIdOrderByPassiveOrderAsc(Integer characterId);
    
    /**
     * Delete all passives for a character
     * 
     * @param characterId The ID of the character
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM CharacterPassive p WHERE p.characterId = :characterId")
    void deleteByCharacterId(@Param("characterId") int characterId);
}