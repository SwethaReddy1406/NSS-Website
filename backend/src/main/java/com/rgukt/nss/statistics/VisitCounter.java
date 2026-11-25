package com.rgukt.nss.statistics;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "visit_counter")
public class VisitCounter {

    @Id
    private Long id;

    private long totalVisits;

    public VisitCounter() {
    }

    public VisitCounter(Long id, long totalVisits) {
        this.id = id;
        this.totalVisits = totalVisits;
    }

    public Long getId() {
        return id;
    }

    public long getTotalVisits() {
        return totalVisits;
    }

    public void setTotalVisits(long totalVisits) {
        this.totalVisits = totalVisits;
    }
}
