package org.example.els_lew_repetitor.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.response.*;
import org.example.els_lew_repetitor.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Админ-панель")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        return adminService.getStats();
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tutors")
    public List<TutorResponse> getAllTutors() {
        return adminService.getAllTutors();
    }

    @DeleteMapping("/tutors/{id}")
    public ResponseEntity<Void> deleteTutorProfile(@PathVariable Long id) {
        adminService.deleteTutorProfile(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookings")
    public List<BookingResponse> getAllBookings() {
        return adminService.getAllBookings();
    }

    @GetMapping("/reviews")
    public List<ReviewResponse> getAllReviews() {
        return adminService.getAllReviews();
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        adminService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/cities")
    public CityResponse createCity(@RequestBody Map<String, String> body) {
        return adminService.createCity(body.get("name"));
    }

    @DeleteMapping("/cities/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable Long id) {
        adminService.deleteCity(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/subjects")
    public SubjectResponse createSubject(@RequestBody Map<String, String> body) {
        return adminService.createSubject(body.get("name"), body.getOrDefault("category", "ОГЭ/ЕГЭ"));
    }

    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        adminService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
