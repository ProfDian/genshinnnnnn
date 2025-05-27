package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.CharacterTalent;

@Repository
public interface CharacterTalentRepository extends JpaRepository<CharacterTalent, Integer> {
    List<CharacterTalent> findByCharacterIdOrderByIdAsc(Integer characterId);
}