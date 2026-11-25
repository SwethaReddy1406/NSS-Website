package com.rgukt.nss.statistics;

import com.rgukt.nss.volunteers.VolunteerRepository;
import com.rgukt.nss.activities.ActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class StatisticsService {

    private final VolunteerRepository volunteerRepository;
    private final ActivityRepository activityRepository;
    private final VisitCounterRepository visitCounterRepository;

    public StatisticsService(
            VolunteerRepository volunteerRepository,
            ActivityRepository activityRepository,
            VisitCounterRepository visitCounterRepository) {
        this.volunteerRepository = volunteerRepository;
        this.activityRepository = activityRepository;
        this.visitCounterRepository = visitCounterRepository;
    }

    public Map<String, Long> getStatistics() {
        Map<String, Long> statistics = new LinkedHashMap<>();

        VisitCounter counter = visitCounterRepository.findById(1L)
                .orElse(new VisitCounter(1L, 0L));

        statistics.put("visits", counter.getTotalVisits());
        statistics.put("volunteers", volunteerRepository.countByStatus("ACTIVE"));
        statistics.put("activities", activityRepository.count());

        return statistics;
    }

    @Transactional
    public long incrementVisits() {
        VisitCounter counter = visitCounterRepository.findById(1L)
                .orElse(new VisitCounter(1L, 0L));

        counter.setTotalVisits(counter.getTotalVisits() + 1);

        visitCounterRepository.save(counter);

        return counter.getTotalVisits();
    }
}
