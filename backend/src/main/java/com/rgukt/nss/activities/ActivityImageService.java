package com.rgukt.nss.activities;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ActivityImageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final Path uploadDirectory =
            Paths.get("uploads", "activities").toAbsolutePath().normalize();

    public String uploadImage(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select an image.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Image must be smaller than 5 MB.");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("image/jpeg") ||
                  contentType.equals("image/png") ||
                  contentType.equals("image/webp"))) {
            throw new IllegalArgumentException(
                    "Only JPG, PNG, and WEBP images are allowed.");
        }

        String extension;

        switch (contentType) {
            case "image/jpeg":
                extension = ".jpg";
                break;
            case "image/png":
                extension = ".png";
                break;
            case "image/webp":
                extension = ".webp";
                break;
            default:
                throw new IllegalArgumentException("Unsupported image type.");
        }

        Files.createDirectories(uploadDirectory);

        String filename = UUID.randomUUID() + extension;
        Path destination = uploadDirectory.resolve(filename);

        Files.write(destination, file.getBytes());

        return "/uploads/activities/" + filename;
    }
}
