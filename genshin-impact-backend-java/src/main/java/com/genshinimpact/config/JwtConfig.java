package com.genshinimpact.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "app.jwt")
@Data
public class JwtConfig {
    private String secret = "genshinImpactSecretKeyForJwtAuthenticationVerySecureAndLongKey";
    private long expirationMs = 86400000; // 24 jam dalam milidetik
}