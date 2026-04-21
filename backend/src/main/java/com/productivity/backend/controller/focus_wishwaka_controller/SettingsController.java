package com.productivity.backend.controller.focus_wishwaka_controller;

import com.productivity.backend.DTO.focus_wishwaka_DTO.UserSettingsDTO;
import com.productivity.backend.entity.focus_wishwaka_entity.UserSettings;
import com.productivity.backend.entity.user_entity.User;
import com.productivity.backend.service.focus_wishwaka_service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Arrays;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SettingsController {
    
    private final UserSettingsService userSettingsService;
    
    @GetMapping
    public ResponseEntity<UserSettingsDTO> getUserSettings(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = (User) authentication.getPrincipal();
        UserSettingsDTO settings = userSettingsService.getUserSettings(user);
        return ResponseEntity.ok(settings);
    }
    
    @PutMapping
    public ResponseEntity<UserSettingsDTO> updateSettings(@Valid @RequestBody UserSettingsDTO settingsDTO, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = (User) authentication.getPrincipal();
        UserSettingsDTO updatedSettings = userSettingsService.updateSettings(settingsDTO, user);
        return ResponseEntity.ok(updatedSettings);
    }
    
    @PostMapping("/reset")
    public ResponseEntity<UserSettingsDTO> resetToDefaults(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = (User) authentication.getPrincipal();
        UserSettingsDTO defaultSettings = userSettingsService.resetToDefaults(user);
        return ResponseEntity.ok(defaultSettings);
    }
    
    @GetMapping("/timer")
    public ResponseEntity<UserSettingsDTO> getTimerSettings(Authentication authentication, HttpServletRequest request) {
        if (authentication == null || authentication.getPrincipal() == null) {
            // Use client-generated session ID from header
            String sessionId = request.getHeader("X-Session-ID");
            System.out.println("DEBUG: SettingsController GET - Received sessionId: " + sessionId);
            if (sessionId == null || sessionId.trim().isEmpty()) {
                // Fallback to generated session ID if header is missing
                String userAgent = request.getHeader("User-Agent");
                String clientIp = getClientIpAddress(request);
                sessionId = userSettingsService.generateUserSessionId(userAgent, clientIp);
                System.out.println("DEBUG: SettingsController GET - Generated fallback sessionId: " + sessionId);
            }
            
            UserSettingsDTO settings = userSettingsService.getAnonymousSettings(sessionId);
            System.out.println("DEBUG: SettingsController GET - Retrieved settings for sessionId: " + sessionId);
            return ResponseEntity.ok(settings);
        }
        User user = (User) authentication.getPrincipal();
        UserSettingsDTO settings = userSettingsService.getUserSettings(user);
        return ResponseEntity.ok(settings);
    }
    
    @PutMapping("/timer")
    public ResponseEntity<UserSettingsDTO> updateTimerSettings(@Valid @RequestBody UserSettingsDTO settingsDTO, Authentication authentication, HttpServletRequest request) {
        if (authentication == null || authentication.getPrincipal() == null) {
            // Use client-generated session ID from header
            String sessionId = request.getHeader("X-Session-ID");
            System.out.println("DEBUG: SettingsController PUT - Received sessionId: " + sessionId);
            if (sessionId == null || sessionId.trim().isEmpty()) {
                // Fallback to generated session ID if header is missing
                String userAgent = request.getHeader("User-Agent");
                String clientIp = getClientIpAddress(request);
                sessionId = userSettingsService.generateUserSessionId(userAgent, clientIp);
                System.out.println("DEBUG: SettingsController PUT - Generated fallback sessionId: " + sessionId);
            }
            
            UserSettingsDTO updatedSettings = userSettingsService.updateAnonymousSettings(sessionId, settingsDTO);
            System.out.println("DEBUG: SettingsController PUT - Updated settings for sessionId: " + sessionId);
            return ResponseEntity.ok(updatedSettings);
        }
        // Only update focus settings (timer settings)
        User user = (User) authentication.getPrincipal();
        UserSettingsDTO currentSettings = userSettingsService.getUserSettings(user);
        
        if (settingsDTO.getFocus() != null) {
            currentSettings.setFocus(settingsDTO.getFocus());
        }
        
        UserSettingsDTO updatedSettings = userSettingsService.updateSettings(currentSettings, user);
        return ResponseEntity.ok(updatedSettings);
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    private UserSettingsDTO createDefaultTimerSettings() {
        UserSettingsDTO defaultSettings = new UserSettingsDTO();
        UserSettings.FocusSettings focusSettings = new UserSettings.FocusSettings();
        focusSettings.setWorkDuration(25);
        focusSettings.setShortBreakDuration(5);
        focusSettings.setLongBreakDuration(15);
        focusSettings.setSessionsUntilLongBreak(4);
        focusSettings.setAutoStartBreaks(false);
        focusSettings.setAutoStartWork(false);
        focusSettings.setSoundEnabled(true);
        focusSettings.setVolume(0.5);
        defaultSettings.setFocus(focusSettings);
        return defaultSettings;
    }
}
