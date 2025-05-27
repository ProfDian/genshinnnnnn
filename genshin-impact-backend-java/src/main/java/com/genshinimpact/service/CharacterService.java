package com.genshinimpact.service;

import com.genshinimpact.dto.character.CharacterCreateRequest;
import com.genshinimpact.dto.character.CharacterUpdateRequest;
import com.genshinimpact.model.Character;
import com.genshinimpact.repository.CharacterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class CharacterService {

    @Autowired
    private CharacterRepository characterRepository;
    
    /**
     * Get all characters with filtering and pagination
     */
    public Page<Character> getAllCharacters(String search, Integer elementId, Integer weaponTypeId, 
                                          Integer regionId, Integer rarityId, String sortBy, 
                                          String sortOrder, int page, int limit) {
        
        // Build sort options
        Sort sort;
        if ("releaseDate".equals(sortBy)) {
            sort = Sort.by("releaseDate");
        } else {
            sort = Sort.by("name");
        }
        
        if ("desc".equals(sortOrder)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }
        
        Pageable pageable = PageRequest.of(page - 1, limit, sort);
        
        // Use the existing method from your repository
        return characterRepository.findWithFilters(search, elementId, weaponTypeId, regionId, rarityId, pageable);
    }
    
    /**
     * Get character by ID
     */
    public Character getCharacterById(int id) {
        return characterRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Character not found with id: " + id));
    }
    
    /**
     * Create new character
     */
    @Transactional
    public Character createCharacter(CharacterCreateRequest request) {
        // Check if character ID already exists
        if (request.getId() != null && characterRepository.existsById(request.getId())) {
            throw new RuntimeException("Character with ID " + request.getId() + " already exists");
        }
        
        Character character = new Character();
        
        // Set all fields from request
        if (request.getId() != null) {
            character.setId(request.getId());
        }
        character.setName(request.getName());
        character.setTitle(request.getTitle());
        character.setDetail(request.getDetail());
        character.setConstellation(request.getConstellation());
        character.setElementId(request.getElementId());
        character.setWeaponTypeId(request.getWeaponTypeId());
        character.setRegionId(request.getRegionId());
        character.setRarityId(request.getRarityId());
        character.setIcon(request.getIcon());
        character.setGachaImg(request.getGachaImg());
        character.setBirthday(request.getBirthday());
        character.setReleaseDate(request.getReleaseDate());
        character.setNativeVoice(request.getNativeVoice()); // Gunakan setNativeVoice dan getNativeVoice
        character.setCvEn(request.getCvEn());
        character.setCvChs(request.getCvChs());
        character.setCvJp(request.getCvJp());
        character.setCvKr(request.getCvKr());
        character.setCreatedAt(LocalDateTime.now());
        character.setUpdatedAt(LocalDateTime.now());
        
        return characterRepository.save(character);
    }
    
    /**
     * Update character
     */
    @Transactional
    public Character updateCharacter(int id, CharacterUpdateRequest request) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Character not found with id: " + id));
        
        // Update fields if provided
        if (request.getName() != null) {
            character.setName(request.getName());
        }
        if (request.getTitle() != null) {
            character.setTitle(request.getTitle());
        }
        if (request.getDetail() != null) {
            character.setDetail(request.getDetail());
        }
        if (request.getConstellation() != null) {
            character.setConstellation(request.getConstellation());
        }
        if (request.getElementId() != null) {
            character.setElementId(request.getElementId());
        }
        if (request.getWeaponTypeId() != null) {
            character.setWeaponTypeId(request.getWeaponTypeId());
        }
        if (request.getRegionId() != null) {
            character.setRegionId(request.getRegionId());
        }
        if (request.getRarityId() != null) {
            character.setRarityId(request.getRarityId());
        }
        if (request.getIcon() != null) {
            character.setIcon(request.getIcon());
        }
        if (request.getGachaImg() != null) {
            character.setGachaImg(request.getGachaImg());
        }
        if (request.getBirthday() != null) {
            character.setBirthday(request.getBirthday());
        }
        if (request.getReleaseDate() != null) {
            character.setReleaseDate(request.getReleaseDate());
        }
        if (request.getNativeVoice() != null) {
            character.setNativeVoice(request.getNativeVoice()); // Gunakan setNativeVoice dan getNativeVoice
        }
        if (request.getCvEn() != null) {
            character.setCvEn(request.getCvEn());
        }
        if (request.getCvChs() != null) {
            character.setCvChs(request.getCvChs());
        }
        if (request.getCvJp() != null) {
            character.setCvJp(request.getCvJp());
        }
        if (request.getCvKr() != null) {
            character.setCvKr(request.getCvKr());
        }
        
        character.setUpdatedAt(LocalDateTime.now());
        
        return characterRepository.save(character);
    }
    
    /**
     * Soft delete character
     */
    @Transactional
    public void softDeleteCharacter(int id) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Character not found with id: " + id));
        
        character.setDeletedAt(LocalDateTime.now());
        characterRepository.save(character);
    }
    
    /**
     * Permanent delete character
     */
    @Transactional
    public void permanentDeleteCharacter(int id) {
        if (!characterRepository.existsById(id)) {
            throw new RuntimeException("Character not found with id: " + id);
        }
        
        characterRepository.deleteById(id);
    }
}