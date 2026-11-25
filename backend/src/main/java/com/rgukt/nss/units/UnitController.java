package com.rgukt.nss.units;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    // Get all units
    @GetMapping
    public List<Unit> getAllUnits() {
        return unitService.getAllUnits();
    }

    // Get unit by ID
    @GetMapping("/{id}")
    public Unit getUnitById(@PathVariable Long id) {
        return unitService.getUnitById(id);
    }

    // Create a new unit
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Unit createUnit(@RequestBody Unit unit) {
        return unitService.createUnit(unit);
    }

    // Update a unit
    @PutMapping("/{id}")
    public Unit updateUnit(
        @PathVariable Long id,
        @RequestBody Unit unit
    ) {
        return unitService.updateUnit(id, unit);
    }

    // Delete a unit
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUnit(@PathVariable Long id) {
        unitService.deleteUnit(id);
    }
}
