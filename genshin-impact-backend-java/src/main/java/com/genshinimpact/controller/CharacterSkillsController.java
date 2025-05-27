package com.genshinimpact.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.genshinimpact.model.CharacterConstellation;
import com.genshinimpact.model.CharacterPassive;
import com.genshinimpact.model.CharacterTalent;
import com.genshinimpact.repository.CharacterConstellationRepository;
import com.genshinimpact.repository.CharacterPassiveRepository;
import com.genshinimpact.repository.CharacterTalentRepository;

@RestController
@RequestMapping("/api/character-skills")
@CrossOrigin(origins = "*")
public class CharacterSkillsController {

    @Autowired
    private CharacterTalentRepository characterTalentRepository;
    
    @Autowired
    private CharacterPassiveRepository characterPassiveRepository;
    
    @Autowired
    private CharacterConstellationRepository characterConstellationRepository;
    
    @GetMapping("/talents/{characterId}")
    public ResponseEntity<List<CharacterTalent>> getCharacterTalents(@PathVariable Integer characterId) {
        try {
            List<CharacterTalent> talents = characterTalentRepository.findByCharacterIdOrderByIdAsc(characterId);
            return ResponseEntity.ok(talents);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/passives/{characterId}")
    public ResponseEntity<List<CharacterPassive>> getCharacterPassives(@PathVariable Integer characterId) {
        try {
            List<CharacterPassive> passives = characterPassiveRepository.findByCharacterIdOrderByPassiveOrderAsc(characterId);
            return ResponseEntity.ok(passives);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/constellations/{characterId}")
    public ResponseEntity<List<CharacterConstellation>> getCharacterConstellations(@PathVariable Integer characterId) {
        try {
            List<CharacterConstellation> constellations = 
                characterConstellationRepository.findByCharacterIdOrderByConstellationLevelAsc(characterId);
            return ResponseEntity.ok(constellations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}