package org.example.els_lew_repetitor.repository;

import org.example.els_lew_repetitor.entity.Booking;
import org.example.els_lew_repetitor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.example.els_lew_repetitor.enums.BookingStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    long countByStatus(BookingStatus status);
    List<Booking> findByStudentOrderByCreatedAtDesc(User student);

    @Query("SELECT b FROM Booking b WHERE b.slot.tutorProfile.user = :tutor ORDER BY b.createdAt DESC")
    List<Booking> findByTutor(@Param("tutor") User tutor);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.slot.tutorProfile.user = :tutor AND b.status = 'COMPLETED'")
    long countCompletedByTutor(@Param("tutor") User tutor);
}
