package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.WeaponRefinement;

@Repository
public interface WeaponRefinementRepository extends JpaRepository<WeaponRefinement, Integer> {
    List<WeaponRefinement> findByWeaponIdOrderByRefinementLevelAsc(Integer weaponId);
    boolean existsByWeaponIdAndRefinementLevelAndIdNot(Integer weaponId, Integer refinementLevel, Integer id);
}