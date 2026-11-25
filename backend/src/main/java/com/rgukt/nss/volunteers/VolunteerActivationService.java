package com.rgukt.nss.volunteers;

import com.rgukt.nss.auth.Role;
import com.rgukt.nss.auth.User;
import com.rgukt.nss.auth.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
public class VolunteerActivationService {

    private final VolunteerRepository volunteerRepository;
    private final VolunteerActivationRepository activationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    public VolunteerActivationService(
            VolunteerRepository volunteerRepository,
            VolunteerActivationRepository activationRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.volunteerRepository = volunteerRepository;
        this.activationRepository = activationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String generateActivationToken(Long volunteerId) {

        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() ->
                        new RuntimeException("Volunteer not found"));

        if (!"ACTIVE".equalsIgnoreCase(volunteer.getStatus())) {
            throw new RuntimeException(
                    "Only approved volunteers can activate accounts");
        }

        if (userRepository.existsByEmail(volunteer.getEmail())) {
            throw new RuntimeException(
                    "This volunteer already has a login account");
        }

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String rawToken = HexFormat.of().formatHex(randomBytes);

        VolunteerActivation activation = new VolunteerActivation();
        activation.setVolunteer(volunteer);
        activation.setTokenHash(hashToken(rawToken));
        activation.setExpiresAt(LocalDateTime.now().plusHours(24));

        activationRepository.save(activation);

        return rawToken;
    }

    @Transactional
    public void activateVolunteer(String rawToken, String password) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new RuntimeException("Activation token is required");
        }

        if (password == null || password.length() < 8) {
            throw new RuntimeException(
                    "Password must contain at least 8 characters");
        }

        VolunteerActivation activation =
                activationRepository.findByTokenHash(hashToken(rawToken))
                        .orElseThrow(() ->
                                new RuntimeException("Invalid activation link"));

        if (activation.getUsedAt() != null) {
            throw new RuntimeException(
                    "This activation link has already been used");
        }

        if (activation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "This activation link has expired");
        }

        Volunteer volunteer = activation.getVolunteer();

        if (!"ACTIVE".equalsIgnoreCase(volunteer.getStatus())) {
            throw new RuntimeException(
                    "Your volunteer registration is not approved");
        }

        if (userRepository.existsByEmail(volunteer.getEmail())) {
            throw new RuntimeException(
                    "An account already exists for this email");
        }

        User user = new User();
        user.setFullName(volunteer.getFullName());
        user.setEmail(volunteer.getEmail());
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(Role.VOLUNTEER);
        user.setEnabled(true);

        userRepository.save(user);

        activation.setUsedAt(LocalDateTime.now());
        activationRepository.save(activation);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Could not process activation token");
        }
    }
}
