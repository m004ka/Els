package org.example.els_lew_repetitor.repository;

import org.example.els_lew_repetitor.entity.StudentProgress;
import org.example.els_lew_repetitor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {
    List<StudentProgress> findByStudentOrderByUpdatedAtDesc(User student);
    Optional<StudentProgress> findByStudentAndSubjectId(User student, Long subjectId);
}
