package com.genshinimpact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.WeaponType;

@Repository
public interface WeaponTypeRepository extends JpaRepository<WeaponType, Integer> {
}