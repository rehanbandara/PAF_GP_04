package com.productivity.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // If allowCredentials=true, you cannot use allowedOrigins="*".
        // Use allowedOriginPatterns instead for dev flexibility.
        configuration.setAllowCredentials(true);
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000"
                // add your deployed frontend URL(s) here later
        ));

        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Allow all request headers (simpler + fewer CORS surprises)
        configuration.setAllowedHeaders(List.of("*"));

        // Expose headers if frontend needs them
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}