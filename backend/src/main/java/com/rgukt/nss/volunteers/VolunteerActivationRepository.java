package com.rgukt.nss.volunteers;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VolunteerActivationRepository
        extends JpaRepository<VolunteerActivation, Long> {

    Optional<VolunteerActivation> findByTokenHash(String tokenHash);
}
