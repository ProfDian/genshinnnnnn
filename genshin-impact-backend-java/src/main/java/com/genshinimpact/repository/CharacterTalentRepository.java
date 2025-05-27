package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.genshinimpact.model.CharacterTalent;

@Repository
public interface CharacterTalentRepository extends JpaRepository<CharacterTalent, Integer> {
    
    List<CharacterTalent> findByCharacterIdOrderByIdAsc(Integer characterId);
    
    /**
     * Delete all talents for a character
     * 
     * @param characterId The ID of the character
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM CharacterTalent t WHERE t.characterId = :characterId")
    void deleteByCharacterId(@Param("characterId") int characterId);
}