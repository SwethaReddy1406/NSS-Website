package com.rgukt.nss.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class CoordinatorInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CoordinatorInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        String email = System.getenv("NSS_COORDINATOR_EMAIL");
        String password = System.getenv("NSS_COORDINATOR_PASSWORD");
        String name = System.getenv("NSS_COORDINATOR_NAME");

        if (email == null || password == null || name == null) {
            System.out.println(
                    "Coordinator setup skipped: environment variables not configured.");
            return;
        }

        email = email.trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            System.out.println(
                    "Coordinator already exists. No changes made.");
            return;
        }

        User coordinator = new User();

        coordinator.setFullName(name);
        coordinator.setEmail(email);
        coordinator.setPasswordHash(passwordEncoder.encode(password));
        coordinator.setRole(Role.COORDINATOR);
        coordinator.setEnabled(true);

        userRepository.save(coordinator);

        System.out.println("Initial coordinator account created successfully.");
    }
}
