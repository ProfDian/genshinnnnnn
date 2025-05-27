package com.genshinimpact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.Region;

@Repository
public interface RegionRepository extends JpaRepository<Region, Integer> {
}