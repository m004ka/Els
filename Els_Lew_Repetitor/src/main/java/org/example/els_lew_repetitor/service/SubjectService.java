package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.response.SubjectResponse;
import org.example.els_lew_repetitor.repository.SubjectRepository;
import org.example.els_lew_repetitor.repository.TutorProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TutorProfileRepository tutorProfileRepository;

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(subject -> {
                    long count = tutorProfileRepository.findAll().stream()
                            .filter(tp -> tp.getSubjects().stream()
                                    .anyMatch(s -> s.getId().equals(subject.getId())))
                            .count();
                    return SubjectResponse.builder()
                            .id(subject.getId())
                            .name(subject.getName())
                            .category(subject.getCategory())
                            .tutorCount(count)
                            .build();
                })
                .toList();
    }

    public List<SubjectResponse> getSubjectsByCity(Long cityId) {
        return subjectRepository.findAll().stream()
                .map(subject -> {
                    long count = tutorProfileRepository.findAll().stream()
                            .filter(tp -> tp.getCity() != null && tp.getCity().getId().equals(cityId)
                                    && tp.getSubjects().stream().anyMatch(s -> s.getId().equals(subject.getId())))
                            .count();
                    return SubjectResponse.builder()
                            .id(subject.getId())
                            .name(subject.getName())
                            .category(subject.getCategory())
                            .tutorCount(count)
                            .build();
                })
                .filter(s -> s.getTutorCount() > 0)
                .toList();
    }
}
