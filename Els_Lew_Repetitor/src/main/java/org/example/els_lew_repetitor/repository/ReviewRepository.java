package org.example.els_lew_repetitor.repository;

import org.example.els_lew_repetitor.entity.Review;
import org.example.els_lew_repetitor.entity.TutorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTutorProfileOrderByCreatedAtDesc(TutorProfile tutorProfile);
    boolean existsByTutorProfileAndStudentId(TutorProfile tutorProfile, Long studentId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.tutorProfile = :tutorProfile")
    Double calculateAverageRating(@Param("tutorProfile") TutorProfile tutorProfile);

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double calculateOverallAvgRating();

    List<Review> findAllByOrderByCreatedAtDesc();
}
