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
import com.genshinimpact.model.Element;
import com.genshinimpact.repository.ElementRepository;

@RestController
@RequestMapping("/api/elements")
@CrossOrigin(origins = "*")
public class ElementController {

    @Autowired
    private ElementRepository elementRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Element>>> getAllElements() {
        try {
            List<Element> elements = elementRepository.findAll();
            return ResponseEntity.ok(ApiResponse.success(elements));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching elements: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Element>> getElementById(@PathVariable Integer id) {
        try {
            return elementRepository.findById(id)
                    .map(element -> ResponseEntity.ok(ApiResponse.success(element)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Error fetching element: " + e.getMessage()));
        }
    }
}