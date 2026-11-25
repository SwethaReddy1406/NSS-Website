package com.rgukt.nss.attendance;

import com.rgukt.nss.volunteers.Volunteer;
import com.rgukt.nss.activities.Activity;
import com.rgukt.nss.events.Event;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "attendance",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "unique_activity_attendance",
            columnNames = {"volunteer_id", "activity_id"}
        ),
        @UniqueConstraint(
            name = "unique_event_attendance",
            columnNames = {"volunteer_id", "event_id"}
        )
    }
)
public class Attendance {

    public enum Status {
        PRESENT,
        ABSENT,
        LATE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private Volunteer volunteer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    private Activity activity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ABSENT;

    @Column(nullable = false)
    private LocalDate attendanceDate;

    @Column(length = 500)
    private String remarks;

    private LocalDateTime markedAt;

    public Attendance() {
    }

    @PrePersist
    protected void onCreate() {
        markedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        markedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Volunteer getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getMarkedAt() {
        return markedAt;
    }
}
