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
import com.genshinimpact.model.WeaponType;
import com.genshinimpact.repository.WeaponTypeRepository;

@RestController
@RequestMapping("/api/weapon-types")
@CrossOrigin(origins = "*")
public class WeaponTypeController {

    @Autowired
    private WeaponTypeRepository weaponTypeRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<WeaponType>>> getAllWeaponTypes() {
        try {
            List<WeaponType> weaponTypes = weaponTypeRepository.findAll();
            return ResponseEntity.ok(ApiResponse.success(weaponTypes));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching weapon types: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WeaponType>> getWeaponTypeById(@PathVariable Integer id) {
        try {
            return weaponTypeRepository.findById(id)
                    .map(weaponType -> ResponseEntity.ok(ApiResponse.success(weaponType)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching weapon type: " + e.getMessage()));
        }
    }
}