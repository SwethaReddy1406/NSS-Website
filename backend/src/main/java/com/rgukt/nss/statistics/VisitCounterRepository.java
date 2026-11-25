package com.rgukt.nss.statistics;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitCounterRepository
        extends JpaRepository<VisitCounter, Long> {
}
