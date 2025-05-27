package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.RegionFeature;

@Repository
public interface RegionFeatureRepository extends JpaRepository<RegionFeature, Integer> {
    
    /**
     * Find all features for a specific region
     */
    List<RegionFeature> findByRegionId(Integer regionId);
}