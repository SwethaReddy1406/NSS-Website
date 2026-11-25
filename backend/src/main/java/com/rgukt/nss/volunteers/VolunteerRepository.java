package com.rgukt.nss.volunteers;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    Optional<Volunteer> findByStudentId(String studentId);

    Optional<Volunteer> findByEmail(String email);

    long countByStatus(String status);

    boolean existsByStudentId(String studentId);

    boolean existsByEmail(String email);
}
