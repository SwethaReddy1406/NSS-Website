package com.rgukt.nss.attendance;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // ================= MY ATTENDANCE =================

    @GetMapping("/my")
    public ResponseEntity<?> getMyAttendance(
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Not authenticated"));
        }

        try {
            return ResponseEntity.ok(
                    attendanceService.getMyAttendance(
                            authentication.getName()
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ================= GET ALL =================

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    // ================= BY VOLUNTEER =================

    @GetMapping("/volunteer/{volunteerId}")
    public List<Attendance> getByVolunteer(
            @PathVariable Long volunteerId) {

        return attendanceService.getByVolunteer(volunteerId);
    }

    // ================= BY ACTIVITY =================

    @GetMapping("/activity/{activityId}")
    public List<Attendance> getByActivity(
            @PathVariable Long activityId,
            @RequestParam(required = false) LocalDate date) {

        if (date != null) {
            return attendanceService.getByActivityAndDate(
                    activityId, date
            );
        }

        return attendanceService.getByActivity(activityId);
    }

    // ================= BY EVENT =================

    @GetMapping("/event/{eventId}")
    public List<Attendance> getByEvent(
            @PathVariable Long eventId,
            @RequestParam(required = false) LocalDate date) {

        if (date != null) {
            return attendanceService.getByEventAndDate(
                    eventId, date
            );
        }

        return attendanceService.getByEvent(eventId);
    }

    // ================= MARK ATTENDANCE =================

    @PostMapping
    public ResponseEntity<?> markAttendance(
            @RequestBody AttendanceRequest request) {

        try {
            Attendance saved = attendanceService.markAttendance(
                    request.volunteerId,
                    request.activityId,
                    request.eventId,
                    request.status,
                    request.attendanceDate,
                    request.remarks
            );

            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ================= UPDATE ATTENDANCE =================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(
            @PathVariable Long id,
            @RequestBody UpdateAttendanceRequest request) {

        try {
            Attendance updated =
                    attendanceService.updateAttendanceStatus(
                            id,
                            request.status,
                            request.remarks
                    );

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ================= DELETE ATTENDANCE =================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(
            @PathVariable Long id) {

        try {
            attendanceService.deleteAttendance(id);

            return ResponseEntity.ok(
                    Map.of("message",
                            "Attendance deleted successfully")
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ================= STATISTICS =================

    @GetMapping("/stats")
    public Map<String, Long> getAttendanceStats() {

        long present = attendanceService.getPresentCount();
        long absent = attendanceService.getAbsentCount();
        long late = attendanceService.getLateCount();

        return Map.of(
                "present", present,
                "absent", absent,
                "late", late,
                "total", present + absent + late
        );
    }

    // ================= REQUEST DTOs =================

    public static class AttendanceRequest {

        public Long volunteerId;
        public Long activityId;
        public Long eventId;
        public Attendance.Status status;
        public LocalDate attendanceDate;
        public String remarks;
    }

    public static class UpdateAttendanceRequest {

        public Attendance.Status status;
        public String remarks;
    }
}
