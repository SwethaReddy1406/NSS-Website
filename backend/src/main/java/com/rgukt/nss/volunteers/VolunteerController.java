package com.rgukt.nss.volunteers;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "http://localhost:5173")
public class VolunteerController {

    private final VolunteerService volunteerService;

    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    // Get the logged-in volunteer's own profile
    @GetMapping("/my-profile")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Not authenticated"));
        }

        Volunteer v = volunteerService.getVolunteerByEmail(authentication.getName());

        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("fullName", v.getFullName());
        profile.put("studentId", v.getStudentId());
        profile.put("email", v.getEmail());
        profile.put("phone", v.getPhone());
        profile.put("department", v.getDepartment());
        profile.put("academicYear", v.getAcademicYear());
        profile.put("unitName", v.getUnitName());
        profile.put("status", v.getStatus());
        profile.put("createdAt", v.getCreatedAt());

        return ResponseEntity.ok(profile);
    }

    // Get all volunteers
    @GetMapping
    public List<Volunteer> getAllVolunteers() {
        return volunteerService.getAllVolunteers();
    }

    // Get volunteer by ID
    @GetMapping("/{id}")
    public Volunteer getVolunteerById(@PathVariable Long id) {
        return volunteerService.getVolunteerById(id);
    }

    // Register volunteer
    @PostMapping
    public Volunteer createVolunteer(@RequestBody Volunteer volunteer) {
        return volunteerService.createVolunteer(volunteer);
    }

    // Update volunteer
    @PutMapping("/{id}")
    public Volunteer updateVolunteer(
            @PathVariable Long id,
            @RequestBody Volunteer volunteer) {
        return volunteerService.updateVolunteer(id, volunteer);
    }

    // Approve/reject volunteer
    @PatchMapping("/{id}/status")
    public Volunteer updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return volunteerService.updateStatus(id, status);
    }

    // Delete volunteer
    @DeleteMapping("/{id}")
    public void deleteVolunteer(@PathVariable Long id) {
        volunteerService.deleteVolunteer(id);
    }
}
