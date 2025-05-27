package com.genshinimpact.security;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AdminAuthorizationInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, 
                            @NonNull HttpServletResponse response, 
                            @NonNull Object handler) throws Exception {
        // Cek jika user sudah terotentikasi
        if (SecurityContextHolder.getContext().getAuthentication() instanceof UsernamePasswordAuthenticationToken authentication) {
            // Cek jika user memiliki role ADMIN
            boolean isAdmin = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(role -> role.equals("ROLE_ADMIN"));
            
            if (!isAdmin) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Access denied: Admin role required");
                return false;
            }
        }
        
        return true;
    }
}