package com.productivity.backend.config;

import com.productivity.backend.entity.user_entity.User;
import com.productivity.backend.repository.user_repository.UserRepository;
import com.productivity.backend.service.user_service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        try {
            String jwt = getJwtFromRequest(request);

            // No token -> continue; protected endpoints will return 401 automatically
            if (jwt == null) {
                chain.doFilter(request, response);
                return;
            }

            // Already authenticated -> continue
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                chain.doFilter(request, response);
                return;
            }

            // Invalid token -> continue unauthenticated (avoid 500)
            if (!jwtService.isTokenValid(jwt)) {
                chain.doFilter(request, response);
                return;
            }

            String username = jwtService.extractUsername(jwt);
            if (username == null || username.isBlank()) {
                chain.doFilter(request, response);
                return;
            }

            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                // Do NOT throw -> avoid 500. Let Spring treat as unauthenticated.
                chain.doFilter(request, response);
                return;
            }

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            chain.doFilter(request, response);
        } catch (Exception e) {
            // Absolutely do not let this filter crash the request into a 500.
            SecurityContextHolder.clearContext();
            chain.doFilter(request, response);
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (path == null) return true;

        // Let CORS preflight through without JWT processing
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;

        // Skip auth endpoints
        return path.startsWith("/api/auth/");
    }
}