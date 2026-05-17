package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.response.ProgressResponse;
import org.example.els_lew_repetitor.entity.StudentProgress;
import org.example.els_lew_repetitor.entity.Subject;
import org.example.els_lew_repetitor.entity.User;
import org.example.els_lew_repetitor.exception.NotFoundException;
import org.example.els_lew_repetitor.repository.StudentProgressRepository;
import org.example.els_lew_repetitor.repository.SubjectRepository;
import org.example.els_lew_repetitor.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

    private final StudentProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public List<ProgressResponse> getProgress(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Студент не найден"));
        return progressRepository.findByStudentOrderByUpdatedAtDesc(student)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public ProgressResponse updateProgress(String email, Long subjectId, Integer percent, String notes) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Студент не найден"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new NotFoundException("Предмет не найден"));

        StudentProgress progress = progressRepository.findByStudentAndSubjectId(student, subjectId)
                .orElse(StudentProgress.builder().student(student).subject(subject).build());

        if (percent != null) progress.setProgressPercent(Math.min(100, Math.max(0, percent)));
        if (notes != null) progress.setNotes(notes);

        return toResponse(progressRepository.save(progress));
    }

    private ProgressResponse toResponse(StudentProgress p) {
        return ProgressResponse.builder()
                .id(p.getId())
                .subjectName(p.getSubject().getName())
                .progressPercent(p.getProgressPercent())
                .notes(p.getNotes())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
