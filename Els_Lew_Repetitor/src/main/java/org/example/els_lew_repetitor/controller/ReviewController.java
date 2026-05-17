package org.example.els_lew_repetitor.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.ReviewRequest;
import org.example.els_lew_repetitor.dto.response.ReviewResponse;
import org.example.els_lew_repetitor.service.ReviewService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Отзывы")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ReviewResponse addReview(@AuthenticationPrincipal UserDetails userDetails,
                                     @Valid @RequestBody ReviewRequest request) {
        return reviewService.addReview(userDetails.getUsername(), request);
    }

    @GetMapping("/tutor/{tutorProfileId}")
    public List<ReviewResponse> getTutorReviews(@PathVariable Long tutorProfileId) {
        return reviewService.getTutorReviews(tutorProfileId);
    }
}
