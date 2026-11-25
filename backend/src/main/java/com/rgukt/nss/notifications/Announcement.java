package com.rgukt.nss.notifications;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private int recipientCount;

    @Column(name = "sent_by", nullable = false)
    private String sentBy;

    private LocalDateTime createdAt;

    public Announcement() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public int getRecipientCount() { return recipientCount; }
    public String getSentBy() { return sentBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
    public void setRecipientCount(int recipientCount) {
        this.recipientCount = recipientCount;
    }
    public void setSentBy(String sentBy) { this.sentBy = sentBy; }
}
