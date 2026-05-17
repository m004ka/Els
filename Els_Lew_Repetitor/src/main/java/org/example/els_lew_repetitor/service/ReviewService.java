package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.ReviewRequest;
import org.example.els_lew_repetitor.dto.response.ReviewResponse;
import org.example.els_lew_repetitor.entity.Review;
import org.example.els_lew_repetitor.entity.TutorProfile;
import org.example.els_lew_repetitor.entity.User;
import org.example.els_lew_repetitor.exception.BadRequestException;
import org.example.els_lew_repetitor.exception.NotFoundException;
import org.example.els_lew_repetitor.repository.ReviewRepository;
import org.example.els_lew_repetitor.repository.TutorProfileRepository;
import org.example.els_lew_repetitor.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse addReview(String studentEmail, ReviewRequest request) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new NotFoundException("Студент не найден"));

        TutorProfile tutorProfile = tutorProfileRepository.findById(request.getTutorProfileId())
                .orElseThrow(() -> new NotFoundException("Профиль репетитора не найден"));

        if (reviewRepository.existsByTutorProfileAndStudentId(tutorProfile, student.getId())) {
            throw new BadRequestException("Вы уже оставляли отзыв этому репетитору");
        }

        Review review = Review.builder()
                .tutorProfile(tutorProfile)
                .student(student)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        reviewRepository.save(review);
        recalculateRating(tutorProfile);

        return toResponse(review);
    }

    public List<ReviewResponse> getTutorReviews(Long tutorProfileId) {
        TutorProfile tutorProfile = tutorProfileRepository.findById(tutorProfileId)
                .orElseThrow(() -> new NotFoundException("Репетитор не найден"));
        return reviewRepository.findByTutorProfileOrderByCreatedAtDesc(tutorProfile)
                .stream().map(this::toResponse).toList();
    }

    private void recalculateRating(TutorProfile tutorProfile) {
        Double avg = reviewRepository.calculateAverageRating(tutorProfile);
        long count = reviewRepository.findByTutorProfileOrderByCreatedAtDesc(tutorProfile).size();
        tutorProfile.setRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        tutorProfile.setTotalReviews((int) count);
        tutorProfileRepository.save(tutorProfile);
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .rating(r.getRating())
                .comment(r.getComment())
                .studentFirstName(r.getStudent().getFirstName())
                .studentLastName(r.getStudent().getLastName())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
