package com.genshinimpact.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(length = 50, unique = true, nullable = false)
    private String username;
    
    @Column(length = 100, unique = true, nullable = false)
    private String email;
    
    @Column(length = 255, nullable = false)
    private String password;
    
    @Column(length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "profile_image", length = 255)
    private String profileImage;
    
    @Column(name = "is_admin")
    private boolean isAdmin = false;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserFavorite> favorites = new ArrayList<>();
}