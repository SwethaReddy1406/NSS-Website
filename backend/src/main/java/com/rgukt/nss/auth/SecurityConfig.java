package com.rgukt.nss.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .csrf(csrf -> {
                CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
                repository.setCookieCustomizer(cookie -> cookie.sameSite("None").secure(true));
                csrf.csrfTokenRepository(repository);
            })

            .authorizeHttpRequests(auth -> auth

                // Allow preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

                // Authentication endpoints
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/csrf"
                ).permitAll()

                // Health check
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/health"
                ).permitAll()

                // Public homepage statistics
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/statistics"
                ).permitAll()
// Public homepage announcements
.requestMatchers(
    HttpMethod.GET,
    "/api/notifications/public/announcements"
).permitAll()
// Record homepage visits
.requestMatchers(
    HttpMethod.POST,
    "/api/statistics/visit"
).permitAll()
                // Public published activities
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/activities"
                ).permitAll()
// Public activity images
.requestMatchers(
    HttpMethod.GET,
    "/uploads/activities/**"
).permitAll()
                // Coordinator activity administration
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/activities/admin"
                ).hasRole("COORDINATOR")

                // Public units listing
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/units",
                    "/api/units/**"
                ).permitAll()

                // Public contact form submission
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/contact"
                ).permitAll()

                // Public volunteer registration
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/volunteers"
                ).permitAll()

                // Public volunteer account activation
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/volunteer-activation/activate"
                ).permitAll()

                // Volunteers can access their own attendance
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/attendance/my"
                ).hasRole("VOLUNTEER")

                // Volunteers can view their own profile
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/volunteers/my-profile"
                ).hasRole("VOLUNTEER")

                // Coordinator-only management APIs
                .requestMatchers(
                    "/api/activities/**",
                    "/api/events/**",
                    "/api/contact/**",
                    "/api/volunteers/**",
                    "/api/attendance/**",
                    "/api/volunteer-activation/**"
                ).hasRole("COORDINATOR")

                // All remaining endpoints require authentication
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
            new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of("http://localhost:5173","http://localhost:5174","https://nss-website-1-z1sv.onrender.com")
        );

        configuration.setAllowCredentials(true);

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of(
                "Authorization",
                "Content-Type",
                "X-XSRF-TOKEN",
                "X-Requested-With"
            )
        );

        configuration.setExposedHeaders(
            List.of("Authorization")
        );

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }
}
