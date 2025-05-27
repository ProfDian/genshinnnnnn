package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.CharacterPassive;

@Repository
public interface CharacterPassiveRepository extends JpaRepository<CharacterPassive, Integer> {
    List<CharacterPassive> findByCharacterIdOrderByPassiveOrderAsc(Integer characterId);
}