package com.genshinimpact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.genshinimpact.model.Element;

@Repository
public interface ElementRepository extends JpaRepository<Element, Integer> {
}