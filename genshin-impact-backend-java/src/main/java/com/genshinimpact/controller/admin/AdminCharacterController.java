package com.genshinimpact.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.genshinimpact.dto.ApiResponse;
import com.genshinimpact.dto.character.CharacterCreateRequest;
import com.genshinimpact.dto.character.CharacterUpdateRequest;
import com.genshinimpact.model.Character;
import com.genshinimpact.service.CharacterService;

@RestController
@RequestMapping("/api/admin/character")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCharacterController {

    @Autowired
    private CharacterService characterService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<Character>> createCharacter(@RequestBody CharacterCreateRequest request) {
        try {
            Character character = characterService.createCharacter(request);
            return ResponseEntity.ok(ApiResponse.success("Character created successfully", character));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Character>> updateCharacter(
            @PathVariable int id, @RequestBody CharacterUpdateRequest request) {
        try {
            Character character = characterService.updateCharacter(id, request);
            return ResponseEntity.ok(ApiResponse.success("Character updated successfully", character));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCharacter(
            @PathVariable int id, @RequestParam(required = false) boolean permanent) {
        try {
            if (permanent) {
                characterService.permanentDeleteCharacter(id);
                return ResponseEntity.ok(ApiResponse.success("Character permanently deleted", null));
            } else {
                characterService.softDeleteCharacter(id);
                return ResponseEntity.ok(ApiResponse.success("Character soft deleted", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}