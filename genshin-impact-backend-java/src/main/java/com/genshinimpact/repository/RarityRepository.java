package com.genshinimpact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.Rarity;

@Repository
public interface RarityRepository extends JpaRepository<Rarity, Integer> {
}