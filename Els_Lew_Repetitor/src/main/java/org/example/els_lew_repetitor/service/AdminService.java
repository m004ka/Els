package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.response.*;
import org.example.els_lew_repetitor.entity.*;
import org.example.els_lew_repetitor.enums.BookingStatus;
import org.example.els_lew_repetitor.enums.Role;
import org.example.els_lew_repetitor.exception.NotFoundException;
import org.example.els_lew_repetitor.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final TutorProfileRepository tutorProfileRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final CityRepository cityRepository;
    private final SubjectRepository subjectRepository;

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalTutors = tutorProfileRepository.count();
        long totalBookings = bookingRepository.count();
        long completedLessons = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        long totalReviews = reviewRepository.count();
        Double avgRating = reviewRepository.calculateOverallAvgRating();

        List<Map<String, Object>> bookingsByStatus = Arrays.stream(BookingStatus.values())
                .map(s -> Map.<String, Object>of("status", s.name(), "count", bookingRepository.countByStatus(s)))
                .toList();

        List<Map<String, Object>> tutorsByCity = cityRepository.findAll().stream()
                .map(c -> {
                    long cnt = tutorProfileRepository.findAll().stream()
                            .filter(tp -> tp.getCity() != null && tp.getCity().getId().equals(c.getId()))
                            .count();
                    return Map.<String, Object>of("city", c.getName(), "count", cnt);
                })
                .filter(m -> (long) m.get("count") > 0)
                .sorted((a, b) -> Long.compare((long) b.get("count"), (long) a.get("count")))
                .limit(8)
                .toList();

        List<UserResponse> recentUsers = userRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, 5))
                .stream().map(this::toUserResponse).toList();

        List<BookingResponse> recentBookings = bookingRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::toBookingResponse)
                .toList();

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalStudents(totalStudents)
                .totalTutors(totalTutors)
                .totalBookings(totalBookings)
                .completedLessons(completedLessons)
                .totalReviews(totalReviews)
                .avgRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .bookingsByStatus(bookingsByStatus)
                .tutorsByCity(tutorsByCity)
                .recentUsers(recentUsers)
                .recentBookings(recentBookings)
                .build();
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toUserResponse).toList();
    }

    public List<TutorResponse> getAllTutors() {
        return tutorProfileRepository.findAll().stream().map(this::toTutorResponse).toList();
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toBookingResponse).toList();
    }

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toReviewResponse).toList();
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public void deleteTutorProfile(Long id) {
        tutorProfileRepository.deleteById(id);
    }

    @Transactional
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Отзыв не найден"));
        TutorProfile tp = review.getTutorProfile();
        reviewRepository.delete(review);
        Double avg = reviewRepository.calculateAverageRating(tp);
        long cnt = reviewRepository.findByTutorProfileOrderByCreatedAtDesc(tp).size();
        tp.setRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        tp.setTotalReviews((int) cnt);
        tutorProfileRepository.save(tp);
    }

    @Transactional
    public CityResponse createCity(String name) {
        City city = cityRepository.save(City.builder().name(name).build());
        return CityResponse.builder().id(city.getId()).name(city.getName()).tutorCount(0L).build();
    }

    @Transactional
    public void deleteCity(Long id) {
        cityRepository.deleteById(id);
    }

    @Transactional
    public SubjectResponse createSubject(String name, String category) {
        Subject s = subjectRepository.save(Subject.builder().name(name).category(category).build());
        return SubjectResponse.builder().id(s.getId()).name(s.getName()).category(s.getCategory()).tutorCount(0L).build();
    }

    @Transactional
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }

    private UserResponse toUserResponse(User u) {
        return UserResponse.builder()
                .id(u.getId()).username(u.getUsername())
                .firstName(u.getFirstName()).lastName(u.getLastName())
                .email(u.getEmail()).role(u.getRole())
                .cityName(u.getCity() != null ? u.getCity().getName() : null)
                .createdAt(u.getCreatedAt())
                .build();
    }

    private TutorResponse toTutorResponse(TutorProfile tp) {
        return TutorResponse.builder()
                .id(tp.getId()).userId(tp.getUser().getId())
                .firstName(tp.getUser().getFirstName()).lastName(tp.getUser().getLastName())
                .username(tp.getUser().getUsername())
                .photoUrl(tp.getPhotoUrl()).bio(tp.getBio())
                .pricePerHour(tp.getPricePerHour())
                .rating(tp.getRating()).totalLessons(tp.getTotalLessons()).totalReviews(tp.getTotalReviews())
                .telegramContact(tp.getTelegramContact())
                .cityName(tp.getCity() != null ? tp.getCity().getName() : null)
                .subjects(tp.getSubjects().stream().map(Subject::getName).toList())
                .build();
    }

    private BookingResponse toBookingResponse(Booking b) {
        TutorProfile tp = b.getSlot().getTutorProfile();
        return BookingResponse.builder()
                .id(b.getId()).status(b.getStatus()).createdAt(b.getCreatedAt())
                .slotStart(b.getSlot().getStartTime()).slotEnd(b.getSlot().getEndTime())
                .subjectName(b.getSubject() != null ? b.getSubject().getName() : null)
                .tutorFirstName(tp.getUser().getFirstName()).tutorLastName(tp.getUser().getLastName())
                .studentFirstName(b.getStudent().getFirstName()).studentLastName(b.getStudent().getLastName())
                .tutorProfileId(tp.getId()).studentId(b.getStudent().getId())
                .build();
    }

    private ReviewResponse toReviewResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId()).rating(r.getRating()).comment(r.getComment())
                .studentFirstName(r.getStudent().getFirstName()).studentLastName(r.getStudent().getLastName())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
