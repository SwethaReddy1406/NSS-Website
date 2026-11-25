
package com.rgukt.nss.activities;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    // Constructor injection
    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    // Create a new activity
    public Activity createActivity(Activity activity) {

        validateActivity(activity);

        if (activity.getImages() == null) {
            activity.setImages(List.of());
        }

        return activityRepository.save(activity);
    }

    // Get all activities (for administration)
    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    // Get only published activities (for public display)
    public List<Activity> getPublishedActivities() {
        return activityRepository.findByStatusOrderByActivityDateDesc(
            Activity.Status.PUBLISHED
        );
    }

    // Get one activity by ID
    public Activity getActivityById(Long id) {
        return activityRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Activity not found with ID: " + id)
            );
    }

    // Update an existing activity
    public Activity updateActivity(Long id, Activity updatedActivity) {

        Activity existingActivity = getActivityById(id);

        validateActivity(updatedActivity);

        existingActivity.setTitle(updatedActivity.getTitle());
        existingActivity.setDescription(updatedActivity.getDescription());
        existingActivity.setActivityDate(updatedActivity.getActivityDate());
        existingActivity.setLocation(updatedActivity.getLocation());

        if (updatedActivity.getImages() != null) {
            existingActivity.setImages(updatedActivity.getImages());
        }

        if (updatedActivity.getStatus() != null) {
            existingActivity.setStatus(updatedActivity.getStatus());
        }

        return activityRepository.save(existingActivity);
    }

    // Delete an activity
    public void deleteActivity(Long id) {
        Activity activity = getActivityById(id);
        activityRepository.delete(activity);
    }

    // Validate activity information
    private void validateActivity(Activity activity) {

        if (activity == null) {
            throw new IllegalArgumentException("Activity data is required");
        }

        if (activity.getTitle() == null ||
            activity.getTitle().isBlank()) {
            throw new IllegalArgumentException("Activity title is required");
        }

        if (activity.getDescription() == null ||
            activity.getDescription().isBlank()) {
            throw new IllegalArgumentException("Activity description is required");
        }
    }
}
