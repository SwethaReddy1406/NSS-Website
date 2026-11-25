package com.rgukt.nss.volunteers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/volunteer-activation")
public class VolunteerActivationController {

    private final VolunteerActivationService activationService;

    public VolunteerActivationController(
            VolunteerActivationService activationService) {
        this.activationService = activationService;
    }

    // Coordinator generates an activation link
    @PostMapping("/{volunteerId}/generate")
    public ResponseEntity<?> generateActivationLink(
            @PathVariable Long volunteerId) {

        try {
            String token =
                    activationService.generateActivationToken(volunteerId);

            String activationUrl =
                    "http://localhost:5173/activate?token=" + token;

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Activation link generated successfully",
                    "activationUrl", activationUrl
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // Volunteer activates account by setting password
    @PostMapping("/activate")
    public ResponseEntity<?> activateAccount(
            @RequestBody ActivationRequest request) {

        try {
            activationService.activateVolunteer(
                    request.token(),
                    request.password()
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Account activated successfully! You can now log in."
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    public record ActivationRequest(
            String token,
            String password
    ) {}
}
