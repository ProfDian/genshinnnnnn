package com.genshinimpact.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.genshinimpact.dto.ApiResponse;
import com.genshinimpact.dto.PaginationResponse;
import com.genshinimpact.model.Weapon;
import com.genshinimpact.model.WeaponPassive;
import com.genshinimpact.model.WeaponRefinement;
import com.genshinimpact.repository.WeaponPassiveRepository;
import com.genshinimpact.repository.WeaponRefinementRepository;
import com.genshinimpact.repository.WeaponRepository;

@RestController
@RequestMapping("/api/weapons")
@CrossOrigin(origins = "*")
public class WeaponController {

    @Autowired
    private WeaponRepository weaponRepository;

    @Autowired
    private WeaponPassiveRepository weaponPassiveRepository;

    @Autowired
    private WeaponRefinementRepository weaponRefinementRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<Weapon>>> getAllWeapons(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer weaponTypeId,
            @RequestParam(required = false) Integer rarityId,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "20") Integer limit
    ) {
        try {
            // Adjust page for 0-based indexing
            int pageIndex = page - 1;
            if (pageIndex < 0) pageIndex = 0;
            
            // Create Sort object
            Sort.Direction direction = sortOrder.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Sort sort = Sort.by(direction, sortBy.equals("baseAtk") ? "id" : "name");
            
            // Create Pageable
            Pageable pageable = PageRequest.of(pageIndex, limit, sort);
            
            // Fetch weapons with filters
            Page<Weapon> weaponPage = weaponRepository.findWithFilters(
                    search, weaponTypeId, rarityId, pageable);
            
            // Clear detailed data from response
            weaponPage.forEach(weapon -> {
                weapon.setPassives(null);
                weapon.setRefinements(null);
                weapon.setWeaponStats(null);
            });
            
            // Create pagination response
            PaginationResponse<Weapon> paginationResponse = PaginationResponse.from(weaponPage);
            
            return ResponseEntity.ok(ApiResponse.success(paginationResponse));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching weapons: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Weapon>> getWeaponById(@PathVariable Integer id) {
        try {
            // Get basic weapon info
            Optional<Weapon> weaponOpt = weaponRepository.findWeaponWithBasicInfoById(id);
            
            if (weaponOpt.isEmpty() || weaponOpt.get().getDeletedAt() != null) {
                return ResponseEntity.notFound().build();
            }
            
            Weapon weapon = weaponOpt.get();
            
            // Get weapon with passives
            Optional<Weapon> weaponWithPassives = weaponRepository.findWeaponWithPassivesById(id);
            if (weaponWithPassives.isPresent()) {
                weapon.setPassives(weaponWithPassives.get().getPassives());
            }
            
            // Get weapon with refinements
            Optional<Weapon> weaponWithRefinements = weaponRepository.findWeaponWithRefinementsById(id);
            if (weaponWithRefinements.isPresent()) {
                weapon.setRefinements(weaponWithRefinements.get().getRefinements());
            }
            
            // Get weapon with stats
            Optional<Weapon> weaponWithStats = weaponRepository.findWeaponWithStatsById(id);
            if (weaponWithStats.isPresent()) {
                weapon.setWeaponStats(weaponWithStats.get().getWeaponStats());
            }
            
            return ResponseEntity.ok(ApiResponse.success(weapon));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching weapon: " + e.getMessage()));
        }
    }
    
    // Weapon Passives endpoints
    
    @GetMapping("/{weaponId}/passives")
    public ResponseEntity<ApiResponse<List<WeaponPassive>>> getWeaponPassives(@PathVariable Integer weaponId) {
        try {
            List<WeaponPassive> passives = weaponPassiveRepository.findByWeaponId(weaponId);
            return ResponseEntity.ok(ApiResponse.success(passives));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching weapon passives: " + e.getMessage()));
        }
    }
    
    // Weapon Refinements endpoints
    
    @GetMapping("/{weaponId}/refinements")
    public ResponseEntity<ApiResponse<List<WeaponRefinement>>> getWeaponRefinements(@PathVariable Integer weaponId) {
        try {
            List<WeaponRefinement> refinements = weaponRefinementRepository.findByWeaponIdOrderByRefinementLevelAsc(weaponId);
            return ResponseEntity.ok(ApiResponse.success(refinements));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching weapon refinements: " + e.getMessage()));
        }
    }
}