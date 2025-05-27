package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.CharacterStat;

@Repository
public interface CharacterStatRepository extends JpaRepository<CharacterStat, Integer> {
    List<CharacterStat> findByCharacterIdOrderByAscensionAscLevelAsc(Integer characterId);
}