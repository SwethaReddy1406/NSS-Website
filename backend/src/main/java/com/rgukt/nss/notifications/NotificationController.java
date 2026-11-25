
package com.rgukt.nss.notifications;

import com.rgukt.nss.auth.User;
import com.rgukt.nss.auth.Role;
import com.rgukt.nss.auth.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // Get received notifications for the logged-in user
    @GetMapping
    public ResponseEntity<?> getNotifications(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        if (user == null) {
            return unauthorized();
        }

        List<NotificationResponse> notifications =
                notificationService.getUserNotifications(user.getId())
                        .stream()
                        .map(NotificationResponse::from)
                        .toList();

        return ResponseEntity.ok(notifications);
    }

    // Get unread notifications
    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        if (user == null) {
            return unauthorized();
        }

        List<NotificationResponse> notifications =
                notificationService.getUnreadNotifications(user.getId())
                        .stream()
                        .map(NotificationResponse::from)
                        .toList();

        return ResponseEntity.ok(notifications);
    }

    // Get unread notification count
    @GetMapping("/count")
    public ResponseEntity<?> getUnreadCount(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        if (user == null) {
            return unauthorized();
        }

        return ResponseEntity.ok(
                Map.of(
                        "unreadCount",
                        notificationService.getUnreadCount(user.getId())
                )
        );
    }
    // Public: display announcements on the homepage
@GetMapping("/public/announcements")
public ResponseEntity<?> getPublicAnnouncements() {

    List<PublicAnnouncementResponse> announcements =
            notificationService.getSentAnnouncements()
                    .stream()
                    .map(PublicAnnouncementResponse::from)
                    .toList();

    return ResponseEntity.ok(announcements);
}
    // Coordinator: send announcement to all enabled volunteer accounts
    @PostMapping("/announce")
    public ResponseEntity<?> sendAnnouncement(
            @RequestBody AnnouncementRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        if (user == null) {
            return unauthorized();
        }

        if (user.getRole() != Role.COORDINATOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Only coordinators can send announcements"
                    ));
        }

        if (request == null
                || request.title() == null
                || request.title().isBlank()
                || request.message() == null
                || request.message().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Title and message are required"
                    ));
        }

        String title = request.title().trim();
        String message = request.message().trim();

        if (title.length() > 150 || message.length() > 1000) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Title or message is too long"
                    ));
        }

        int count = notificationService.sendAnnouncementToVolunteers(
                title,
                message,
                user.getEmail()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message", "Announcement sent successfully",
                        "recipients", count
                )
        );
    }

    // Coordinator: view sent announcement history
    @GetMapping("/sent")
    public ResponseEntity<?> getSentAnnouncements(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        if (user == null) {
            return unauthorized();
        }

        if (user.getRole() != Role.COORDINATOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "Coordinator access required"
                    ));
        }

        return ResponseEntity.ok(
                notificationService.getSentAnnouncements()
                        .stream()
                        .map(AnnouncementResponse::from)
                        .toList()
        );
    }

    // Mark one notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        if (user == null) {
            return unauthorized();
        }

        boolean updated =
                notificationService.markAsRead(id, user.getId());

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Notification not found"
                    ));
        }

        return ResponseEntity.ok(
                Map.of("message", "Notification marked as read")
        );
    }

    // Mark all notifications as read
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        if (user == null) {
            return unauthorized();
        }

        notificationService.markAllAsRead(user.getId());

        return ResponseEntity.ok(
                Map.of("message", "All notifications marked as read")
        );
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()) {
            return null;
        }

        return userRepository.findByEmail(authentication.getName())
                .orElse(null);
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "User not authenticated"));
    }

    public record AnnouncementRequest(
            String title,
            String message
    ) {}

    public record NotificationResponse(
            Long id,
            String title,
            String message,
            String type,
            boolean read,
            LocalDateTime createdAt
    ) {
        public static NotificationResponse from(
                Notification notification
        ) {
            return new NotificationResponse(
                    notification.getId(),
                    notification.getTitle(),
                    notification.getMessage(),
                    notification.getType(),
                    notification.isRead(),
                    notification.getCreatedAt()
            );
        }
    }

    public record AnnouncementResponse(
            Long id,
            String title,
            String message,
            int recipientCount,
            String sentBy,
            LocalDateTime createdAt
    ) {
        public static AnnouncementResponse from(
                Announcement announcement
        ) {
            return new AnnouncementResponse(
                    announcement.getId(),
                    announcement.getTitle(),
                    announcement.getMessage(),
                    announcement.getRecipientCount(),
                    announcement.getSentBy(),
                    announcement.getCreatedAt()
            );
        }
    }
    public record PublicAnnouncementResponse(
        Long id,
        String title,
        String message,
        LocalDateTime createdAt
) {
    public static PublicAnnouncementResponse from(
            Announcement announcement
    ) {
        return new PublicAnnouncementResponse(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getMessage(),
                announcement.getCreatedAt()
        );
    }
}}

