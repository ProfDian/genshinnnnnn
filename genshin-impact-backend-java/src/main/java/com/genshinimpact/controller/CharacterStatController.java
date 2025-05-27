package com.genshinimpact.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.genshinimpact.model.CharacterStat;
import com.genshinimpact.repository.CharacterStatRepository;

@RestController
@RequestMapping("/api/character-stats")
@CrossOrigin(origins = "*")
public class CharacterStatController {

    @Autowired
    private CharacterStatRepository characterStatRepository;
    
    @GetMapping("/character/{characterId}")
    public ResponseEntity<List<CharacterStat>> getCharacterStats(@PathVariable Integer characterId) {
        try {
            List<CharacterStat> stats = characterStatRepository.findByCharacterIdOrderByAscensionAscLevelAsc(characterId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}