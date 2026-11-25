package com.rgukt.nss.activities;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;
    private final ActivityImageService activityImageService;

    // Constructor injection
    public ActivityController(
            ActivityService activityService,
            ActivityImageService activityImageService) {

        this.activityService = activityService;
        this.activityImageService = activityImageService;
    }

    // Get all published activities for public display
    @GetMapping
    public List<Activity> getPublishedActivities() {
        return activityService.getPublishedActivities();
    }

    // Get all activities for coordinator/admin
    @GetMapping("/admin")
    public List<Activity> getAllActivities() {
        return activityService.getAllActivities();
    }

    // Get one activity by ID
    @GetMapping("/{id}")
    public Activity getActivityById(@PathVariable Long id) {
        return activityService.getActivityById(id);
    }

    // Upload activity image
    @PostMapping(
        value = "/upload-image",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public String uploadActivityImage(
            @RequestParam("file") MultipartFile file) throws IOException {

        return activityImageService.uploadImage(file);
    }

    // Create a new activity
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Activity createActivity(@RequestBody Activity activity) {
        return activityService.createActivity(activity);
    }

    // Update an existing activity
    @PutMapping("/{id}")
    public Activity updateActivity(
            @PathVariable Long id,
            @RequestBody Activity activity) {

        return activityService.updateActivity(id, activity);
    }

    // Delete an activity
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
    }
}
