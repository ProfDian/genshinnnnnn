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
import com.genshinimpact.dto.CharacterResponse;
import com.genshinimpact.dto.PaginationResponse;
import com.genshinimpact.model.Character;
import com.genshinimpact.model.CharacterConstellation;
import com.genshinimpact.model.CharacterPassive;
import com.genshinimpact.model.CharacterStat;
import com.genshinimpact.model.CharacterTalent;
import com.genshinimpact.repository.CharacterConstellationRepository;
import com.genshinimpact.repository.CharacterPassiveRepository;
import com.genshinimpact.repository.CharacterRepository;
import com.genshinimpact.repository.CharacterStatRepository;
import com.genshinimpact.repository.CharacterTalentRepository;


@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "*")
public class CharacterController {

    @Autowired
    private CharacterRepository characterRepository;
    
    @Autowired
    private CharacterStatRepository characterStatRepository;
    
    @Autowired
    private CharacterTalentRepository characterTalentRepository;
    
    @Autowired
    private CharacterPassiveRepository characterPassiveRepository;
    
    @Autowired
    private CharacterConstellationRepository characterConstellationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<CharacterResponse>>> getAllCharacters(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer elementId,
            @RequestParam(required = false) Integer weaponTypeId,
            @RequestParam(required = false) Integer regionId,
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
            Sort sort;
            
            // Handle different sort fields
            if (sortBy.equals("releaseDate")) {
                sort = Sort.by(direction, "releaseDate");
            } else {
                sort = Sort.by(direction, "name");
            }
            
            // Create Pageable
            Pageable pageable = PageRequest.of(pageIndex, limit, sort);
            
            // Fetch characters with filters
            Page<Character> characterPage = characterRepository.findWithFilters(
                    search, elementId, weaponTypeId, regionId, rarityId, pageable);
            
            // Map entities to DTOs
            Page<CharacterResponse> responsePage = characterPage.map(CharacterResponse::fromEntity);
            
            // Create pagination response
            PaginationResponse<CharacterResponse> paginationResponse = PaginationResponse.from(responsePage);
            
            return ResponseEntity.ok(ApiResponse.success(paginationResponse));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching characters: " + e.getMessage()));
        }
    }
@GetMapping("/{id}")
public ResponseEntity<ApiResponse<CharacterResponse>> getCharacterById(@PathVariable Integer id) {
    try {
        Optional<Character> characterOpt = characterRepository.findById(id);
        
        if (characterOpt.isEmpty() || characterOpt.get().getDeletedAt() != null) {
            return ResponseEntity.notFound().build();
        }
        
        Character character = characterOpt.get();
        
        // Konversi ke DTO dasar
        CharacterResponse response = CharacterResponse.fromEntity(character);
        
        // Secara manual tambahkan data tambahan
        
        // 1. Ambil stats
        List<CharacterStat> stats = characterStatRepository.findByCharacterIdOrderByAscensionAscLevelAsc(id);
        response.setStats(stats);
        
        // 2. Ambil talents
        List<CharacterTalent> talents = characterTalentRepository.findByCharacterIdOrderByIdAsc(id);
        response.setTalents(talents);
        
        // 3. Ambil passives
        List<CharacterPassive> passives = characterPassiveRepository.findByCharacterIdOrderByPassiveOrderAsc(id);
        response.setPassives(passives);
        
        // 4. Ambil constellations
        List<CharacterConstellation> constellations = 
            characterConstellationRepository.findByCharacterIdOrderByConstellationLevelAsc(id);
        response.setConstellations(constellations);
        
        return ResponseEntity.ok(ApiResponse.success(response));
        
    } catch (Exception e) {
        return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error fetching character: " + e.getMessage()));
    }
}
}