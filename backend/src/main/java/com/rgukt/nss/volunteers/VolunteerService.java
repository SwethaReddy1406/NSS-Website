package com.rgukt.nss.volunteers;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    public VolunteerService(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    public Volunteer getVolunteerByEmail(String email) {
        return volunteerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Volunteer profile not found"));
    }

    public List<Volunteer> getAllVolunteers() {
        return volunteerRepository.findAll();
    }

    public Volunteer getVolunteerById(Long id) {
        return volunteerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
    }

    public Volunteer createVolunteer(Volunteer volunteer) {

        if (volunteerRepository.existsByStudentId(volunteer.getStudentId())) {
            throw new RuntimeException("Student ID already registered");
        }

        if (volunteerRepository.existsByEmail(volunteer.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        volunteer.setStatus("PENDING");

        return volunteerRepository.save(volunteer);
    }

    public Volunteer updateVolunteer(Long id, Volunteer updatedVolunteer) {

        Volunteer existing = getVolunteerById(id);

        existing.setFullName(updatedVolunteer.getFullName());
        existing.setEmail(updatedVolunteer.getEmail());
        existing.setPhone(updatedVolunteer.getPhone());
        existing.setDepartment(updatedVolunteer.getDepartment());
        existing.setAcademicYear(updatedVolunteer.getAcademicYear());
        existing.setUnitName(updatedVolunteer.getUnitName());

        return volunteerRepository.save(existing);
    }

    public Volunteer updateStatus(Long id, String status) {

        Volunteer volunteer = getVolunteerById(id);

        volunteer.setStatus(status);

        return volunteerRepository.save(volunteer);
    }

    public void deleteVolunteer(Long id) {
        volunteerRepository.delete(getVolunteerById(id));
    }
}
