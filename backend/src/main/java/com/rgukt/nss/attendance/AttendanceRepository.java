package com.rgukt.nss.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByVolunteerId(Long volunteerId);

    List<Attendance> findByActivityId(Long activityId);

    List<Attendance> findByEventId(Long eventId);

    List<Attendance> findByActivityIdAndAttendanceDate(
            Long activityId, LocalDate attendanceDate);

    List<Attendance> findByEventIdAndAttendanceDate(
            Long eventId, LocalDate attendanceDate);

    boolean existsByVolunteerIdAndActivityIdAndAttendanceDate(
            Long volunteerId, Long activityId, LocalDate attendanceDate);

    boolean existsByVolunteerIdAndEventIdAndAttendanceDate(
            Long volunteerId, Long eventId, LocalDate attendanceDate);

    long countByStatus(Attendance.Status status);
}
