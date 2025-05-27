package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.RegionArea;

@Repository
public interface RegionAreaRepository extends JpaRepository<RegionArea, Integer> {
    
    /**
     * Find all non-deleted areas for a specific region
     */
    List<RegionArea> findByRegionIdAndDeletedAtIsNull(Integer regionId);
    
    /**
     * Find all areas for a specific region (including deleted ones)
     */
    List<RegionArea> findByRegionId(Integer regionId);
}