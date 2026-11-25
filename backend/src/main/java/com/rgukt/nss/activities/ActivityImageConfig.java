package com.rgukt.nss.activities;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class ActivityImageConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String uploadDirectory =
                Paths.get("uploads", "activities")
                        .toAbsolutePath()
                        .normalize()
                        .toUri()
                        .toString();

        registry.addResourceHandler("/uploads/activities/**")
                .addResourceLocations(uploadDirectory);
    }
}
