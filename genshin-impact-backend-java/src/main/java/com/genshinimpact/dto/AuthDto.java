package com.genshinimpact.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Integer id;
        private String username;
        private String email;
        private boolean isAdmin;
        private List<String> roles;
    }
}