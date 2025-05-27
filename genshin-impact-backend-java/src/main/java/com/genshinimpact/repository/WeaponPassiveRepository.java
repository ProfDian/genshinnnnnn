package com.genshinimpact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.WeaponPassive;

@Repository
public interface WeaponPassiveRepository extends JpaRepository<WeaponPassive, Integer> {
    List<WeaponPassive> findByWeaponId(Integer weaponId);
}