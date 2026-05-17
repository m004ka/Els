package org.example.els_lew_repetitor.repository;

import org.example.els_lew_repetitor.entity.TutorProfile;
import org.example.els_lew_repetitor.entity.TutorSlot;
import org.example.els_lew_repetitor.enums.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TutorSlotRepository extends JpaRepository<TutorSlot, Long> {
    List<TutorSlot> findByTutorProfileAndStatusOrderByStartTimeAsc(TutorProfile tutorProfile, SlotStatus status);
    List<TutorSlot> findByTutorProfileOrderByStartTimeAsc(TutorProfile tutorProfile);
    List<TutorSlot> findByTutorProfileAndStartTimeAfterOrderByStartTimeAsc(TutorProfile tutorProfile, LocalDateTime after);
}
