package com.genshinimpact.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.genshinimpact.dto.ApiResponse;
import com.genshinimpact.dto.UserFavoriteResponse;
import com.genshinimpact.security.UserDetailsImpl;
import com.genshinimpact.service.UserFavoriteService;

@RestController
@RequestMapping("/api/favorites")
public class UserFavoriteController {
    
    @Autowired
    private UserFavoriteService userFavoriteService;
    
    @GetMapping
    public ResponseEntity<List<UserFavoriteResponse>> getCurrentUserFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<UserFavoriteResponse> favorites = userFavoriteService.getUserFavorites(userDetails.getId());
        return ResponseEntity.ok(favorites);
    }
    
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #userId")
    public ResponseEntity<List<UserFavoriteResponse>> getUserFavorites(@PathVariable Integer userId) {
        List<UserFavoriteResponse> favorites = userFavoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }
    
    @GetMapping("/{userId}/{type}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #userId")
    public ResponseEntity<List<UserFavoriteResponse>> getUserFavoritesByType(
            @PathVariable Integer userId, @PathVariable String type) {
        List<UserFavoriteResponse> favorites = userFavoriteService.getUserFavoritesByType(userId, type);
        return ResponseEntity.ok(favorites);
    }
    
    @PostMapping("/character/{characterId}")
    public ResponseEntity<?> addCharacterFavorite(@PathVariable Integer characterId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            UserFavoriteResponse favorite = userFavoriteService.addCharacterFavorite(userDetails.getId(), characterId);
            return ResponseEntity.ok(favorite);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }
    
    @PostMapping("/weapon/{weaponId}")
    public ResponseEntity<?> addWeaponFavorite(@PathVariable Integer weaponId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            UserFavoriteResponse favorite = userFavoriteService.addWeaponFavorite(userDetails.getId(), weaponId);
            return ResponseEntity.ok(favorite);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/character/{characterId}")
    public ResponseEntity<?> removeCharacterFavorite(@PathVariable Integer characterId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            userFavoriteService.removeCharacterFavorite(userDetails.getId(), characterId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Character removed from favorites successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/weapon/{weaponId}")
    public ResponseEntity<?> removeWeaponFavorite(@PathVariable Integer weaponId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            userFavoriteService.removeWeaponFavorite(userDetails.getId(), weaponId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Weapon removed from favorites successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }
}