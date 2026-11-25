
package com.rgukt.nss.notifications;

import com.rgukt.nss.auth.User;
import com.rgukt.nss.auth.Role;
import com.rgukt.nss.auth.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            AnnouncementRepository announcementRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.announcementRepository = announcementRepository;
    }

    public Notification createNotification(
            User recipient,
            String title,
            String message,
            String type
    ) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    public int sendAnnouncementToVolunteers(
            String title,
            String message,
            String sentBy
    ) {
        List<User> volunteers =
                userRepository.findByRoleAndEnabledTrue(Role.VOLUNTEER);

        // Save announcement independently of recipient count.
        Announcement announcement = new Announcement();
        announcement.setTitle(title);
        announcement.setMessage(message);
        announcement.setSentBy(sentBy);
        announcement.setRecipientCount(volunteers.size());

        announcementRepository.save(announcement);

        // Create individual notifications for volunteers.
        for (User volunteer : volunteers) {
            createNotification(
                    volunteer,
                    title,
                    message,
                    "ANNOUNCEMENT"
            );
        }

        return volunteers.size();
    }

    public List<Announcement> getSentAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository
                .findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository
                .findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository
                .countByRecipientIdAndReadFalse(userId);
    }

    public boolean markAsRead(Long notificationId, Long userId) {
        return notificationRepository.findById(notificationId)
                .filter(notification ->
                        notification.getRecipient().getId().equals(userId))
                .map(notification -> {
                    notification.setRead(true);
                    notificationRepository.save(notification);
                    return true;
                })
                .orElse(false);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> notifications =
                getUnreadNotifications(userId);

        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}

