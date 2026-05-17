package org.example.els_lew_repetitor.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.BookingRequest;
import org.example.els_lew_repetitor.dto.response.BookingResponse;
import org.example.els_lew_repetitor.service.BookingService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "Записи на уроки")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponse createBooking(@AuthenticationPrincipal UserDetails userDetails,
                                          @Valid @RequestBody BookingRequest request) {
        return bookingService.createBooking(userDetails.getUsername(), request);
    }

    @GetMapping
    public List<BookingResponse> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        return bookingService.getStudentBookings(userDetails.getUsername());
    }

    @PutMapping("/{id}/cancel")
    public BookingResponse cancelBooking(@AuthenticationPrincipal UserDetails userDetails,
                                          @PathVariable Long id) {
        return bookingService.cancelBooking(userDetails.getUsername(), id);
    }
}
