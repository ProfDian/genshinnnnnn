package com.genshinimpact.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.genshinimpact.dto.ApiResponse;
import com.genshinimpact.model.Rarity;
import com.genshinimpact.repository.RarityRepository;

@RestController
@RequestMapping("/api/rarities")
@CrossOrigin(origins = "*")
public class RarityController {

    @Autowired
    private RarityRepository rarityRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Rarity>>> getAllRarities() {
        try {
            List<Rarity> rarities = rarityRepository.findAll();
            return ResponseEntity.ok(ApiResponse.success(rarities));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching rarities: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Rarity>> getRarityById(@PathVariable Integer id) {
        try {
            return rarityRepository.findById(id)
                    .map(rarity -> ResponseEntity.ok(ApiResponse.success(rarity)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching rarity: " + e.getMessage()));
        }
    }
}