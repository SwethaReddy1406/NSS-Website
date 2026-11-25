package com.rgukt.nss.statistics;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping
    public Map<String, Long> getStatistics() {
        return statisticsService.getStatistics();
    }

    @PostMapping("/visit")
    public Map<String, Long> recordVisit() {
        long visits = statisticsService.incrementVisits();

        return Map.of("visits", visits);
    }
}
