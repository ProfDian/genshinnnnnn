package com.genshinimpact.dto;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationResponse<T> {
    private List<T> content;
    private PaginationMetadata pagination;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaginationMetadata {
        private long totalItems;
        private int totalPages;
        private int currentPage;
        private int itemsPerPage;
    }
    
    public static <T> PaginationResponse<T> from(Page<T> page) {
        PaginationMetadata metadata = new PaginationMetadata(
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber() + 1,  // Spring Page is 0-based
                page.getSize()
        );
        
        return new PaginationResponse<>(page.getContent(), metadata);
    }
}