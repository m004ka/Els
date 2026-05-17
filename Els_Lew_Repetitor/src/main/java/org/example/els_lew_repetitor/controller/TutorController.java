package org.example.els_lew_repetitor.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.SlotRequest;
import org.example.els_lew_repetitor.dto.request.TutorProfileRequest;
import org.example.els_lew_repetitor.dto.response.BookingResponse;
import org.example.els_lew_repetitor.dto.response.SlotResponse;
import org.example.els_lew_repetitor.dto.response.TutorResponse;
import org.example.els_lew_repetitor.service.BookingService;
import org.example.els_lew_repetitor.service.TutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tutors")
@RequiredArgsConstructor
@Tag(name = "Репетиторы")
public class TutorController {

    private final TutorService tutorService;
    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Список репетиторов с фильтрами")
    public List<TutorResponse> getTutors(
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxRating) {
        return tutorService.getTutors(cityId, subjectId, minPrice, maxPrice, minRating, maxRating);
    }

    @GetMapping("/{id}")
    public TutorResponse getTutorById(@PathVariable Long id) {
        return tutorService.getTutorById(id);
    }

    @GetMapping("/{id}/slots")
    public List<SlotResponse> getTutorSlots(@PathVariable Long id) {
        return tutorService.getTutorSlots(id);
    }

    @GetMapping("/me/profile")
    public TutorResponse getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return tutorService.getMyProfile(userDetails.getUsername());
    }

    @PutMapping("/me/profile")
    public TutorResponse updateMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                          @RequestBody TutorProfileRequest request) {
        return tutorService.updateProfile(userDetails.getUsername(), request);
    }

    @PostMapping("/me/slots")
    public SlotResponse addSlot(@AuthenticationPrincipal UserDetails userDetails,
                                 @Valid @RequestBody SlotRequest request) {
        return tutorService.addSlot(userDetails.getUsername(), request);
    }

    @DeleteMapping("/me/slots/{slotId}")
    public ResponseEntity<Void> deleteSlot(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable Long slotId) {
        tutorService.deleteSlot(userDetails.getUsername(), slotId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/slots")
    public List<SlotResponse> getMySlots(@AuthenticationPrincipal UserDetails userDetails) {
        return tutorService.getMySlots(userDetails.getUsername());
    }

    @GetMapping("/me/bookings")
    public List<BookingResponse> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        return bookingService.getTutorBookings(userDetails.getUsername());
    }

    @PutMapping("/me/bookings/{bookingId}/complete")
    public BookingResponse completeBooking(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable Long bookingId) {
        return bookingService.completeBooking(userDetails.getUsername(), bookingId);
    }
}
