package org.example.els_lew_repetitor.repository;

import org.example.els_lew_repetitor.entity.TutorProfile;
import org.example.els_lew_repetitor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TutorProfileRepository extends JpaRepository<TutorProfile, Long>, JpaSpecificationExecutor<TutorProfile> {
    Optional<TutorProfile> findByUser(User user);
    Optional<TutorProfile> findByUserId(Long userId);

    @Query("SELECT COUNT(tp) FROM TutorProfile tp")
    long countAllTutors();
}
