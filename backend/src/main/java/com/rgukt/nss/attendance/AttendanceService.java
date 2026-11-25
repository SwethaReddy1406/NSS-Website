package com.rgukt.nss.attendance;

import com.rgukt.nss.volunteers.Volunteer;
import com.rgukt.nss.volunteers.VolunteerRepository;
import com.rgukt.nss.activities.Activity;
import com.rgukt.nss.activities.ActivityRepository;
import com.rgukt.nss.events.Event;
import com.rgukt.nss.events.EventRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final VolunteerRepository volunteerRepository;
    private final ActivityRepository activityRepository;
    private final EventRepository eventRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            VolunteerRepository volunteerRepository,
            ActivityRepository activityRepository,
            EventRepository eventRepository) {

        this.attendanceRepository = attendanceRepository;
        this.volunteerRepository = volunteerRepository;
        this.activityRepository = activityRepository;
        this.eventRepository = eventRepository;
    }

    // Get all attendance records
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // Get attendance by volunteer
    public List<Attendance> getByVolunteer(Long volunteerId) {
        return attendanceRepository.findByVolunteerId(volunteerId);
    }

    // Get attendance for the currently logged-in volunteer
    public List<Attendance> getMyAttendance(String email) {
        Volunteer volunteer = volunteerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Volunteer profile not found."));

        return attendanceRepository.findByVolunteerId(volunteer.getId());
    }

    // Get attendance by activity
    public List<Attendance> getByActivity(Long activityId) {
        return attendanceRepository.findByActivityId(activityId);
    }

    // Get attendance by event
    public List<Attendance> getByEvent(Long eventId) {
        return attendanceRepository.findByEventId(eventId);
    }

    // Get attendance for a specific activity and date
    public List<Attendance> getByActivityAndDate(
            Long activityId, LocalDate attendanceDate) {

        return attendanceRepository.findByActivityIdAndAttendanceDate(
                activityId, attendanceDate);
    }

    // Get attendance for a specific event and date
    public List<Attendance> getByEventAndDate(
            Long eventId, LocalDate attendanceDate) {

        return attendanceRepository.findByEventIdAndAttendanceDate(
                eventId, attendanceDate);
    }

    // Mark attendance
    public Attendance markAttendance(
            Long volunteerId,
            Long activityId,
            Long eventId,
            Attendance.Status status,
            LocalDate attendanceDate,
            String remarks) {

        // Exactly one activity or event must be selected
        if ((activityId == null && eventId == null)
                || (activityId != null && eventId != null)) {

            throw new RuntimeException(
                    "Select either an activity or an event.");
        }

        if (status == null) {
            throw new RuntimeException("Attendance status is required.");
        }

        if (attendanceDate == null) {
            throw new RuntimeException("Attendance date is required.");
        }

        // Check volunteer
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() ->
                        new RuntimeException("Volunteer not found."));

       if (!"ACTIVE".equalsIgnoreCase(volunteer.getStatus()))  {
            throw new RuntimeException(
                    "Only active volunteers can have attendance marked.");
        }

        Attendance attendance = new Attendance();

        attendance.setVolunteer(volunteer);
        attendance.setStatus(status);
        attendance.setAttendanceDate(attendanceDate);
        attendance.setRemarks(remarks);

        // Activity attendance
        if (activityId != null) {

            Activity activity = activityRepository.findById(activityId)
                    .orElseThrow(() ->
                            new RuntimeException("Activity not found."));

            boolean alreadyExists =
                    attendanceRepository
                    .existsByVolunteerIdAndActivityIdAndAttendanceDate(
                            volunteerId, activityId, attendanceDate);

            if (alreadyExists) {
                throw new RuntimeException(
                        "Attendance already exists for this volunteer, activity and date.");
            }

            attendance.setActivity(activity);
        }

        // Event attendance
        if (eventId != null) {

            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() ->
                            new RuntimeException("Event not found."));

            boolean alreadyExists =
                    attendanceRepository
                    .existsByVolunteerIdAndEventIdAndAttendanceDate(
                            volunteerId, eventId, attendanceDate);

            if (alreadyExists) {
                throw new RuntimeException(
                        "Attendance already exists for this volunteer, event and date.");
            }

            attendance.setEvent(event);
        }

        return attendanceRepository.save(attendance);
    }

    // Update attendance status and remarks
    public Attendance updateAttendanceStatus(
            Long attendanceId,
            Attendance.Status status,
            String remarks) {

        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() ->
                        new RuntimeException("Attendance record not found."));

        if (status == null) {
            throw new RuntimeException("Attendance status is required.");
        }

        attendance.setStatus(status);
        attendance.setRemarks(remarks);

        return attendanceRepository.save(attendance);
    }

    // Delete attendance
    public void deleteAttendance(Long attendanceId) {

        if (!attendanceRepository.existsById(attendanceId)) {
            throw new RuntimeException("Attendance record not found.");
        }

        attendanceRepository.deleteById(attendanceId);
    }

    // Statistics
    public long getPresentCount() {
        return attendanceRepository.countByStatus(
                Attendance.Status.PRESENT);
    }

    public long getAbsentCount() {
        return attendanceRepository.countByStatus(
                Attendance.Status.ABSENT);
    }

    public long getLateCount() {
        return attendanceRepository.countByStatus(
                Attendance.Status.LATE);
    }
}
