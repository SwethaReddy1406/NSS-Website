package com.rgukt.nss.units;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UnitService {

    private final UnitRepository unitRepository;

    public UnitService(UnitRepository unitRepository) {
        this.unitRepository = unitRepository;
    }

    // Create a new unit
    public Unit createUnit(Unit unit) {
        validateUnit(unit);

        if (unitRepository.findByUnitName(unit.getUnitName().trim()).isPresent()) {
            throw new IllegalArgumentException("Unit already exists");
        }

        unit.setUnitName(unit.getUnitName().trim());
        return unitRepository.save(unit);
    }

    // Get all units
    public List<Unit> getAllUnits() {
        return unitRepository.findAll();
    }

    // Get unit by ID
    public Unit getUnitById(Long id) {
        return unitRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Unit not found with ID: " + id)
            );
    }

    // Update an existing unit
    public Unit updateUnit(Long id, Unit updatedUnit) {
        validateUnit(updatedUnit);

        Unit existingUnit = getUnitById(id);
        String newName = updatedUnit.getUnitName().trim();

        unitRepository.findByUnitName(newName).ifPresent(unit -> {
            if (!unit.getId().equals(id)) {
                throw new IllegalArgumentException("Unit name already exists");
            }
        });

        existingUnit.setUnitName(newName);
        existingUnit.setUnitNumber(updatedUnit.getUnitNumber());
        existingUnit.setCoordinatorName(updatedUnit.getCoordinatorName());
        existingUnit.setDescription(updatedUnit.getDescription());

        return unitRepository.save(existingUnit);
    }

    // Delete a unit
    public void deleteUnit(Long id) {
        Unit unit = getUnitById(id);
        unitRepository.delete(unit);
    }

    // Validate unit details
    private void validateUnit(Unit unit) {
        if (unit == null) {
            throw new IllegalArgumentException("Unit data is required");
        }

        if (unit.getUnitName() == null || unit.getUnitName().isBlank()) {
            throw new IllegalArgumentException("Unit name is required");
        }
    }
}
