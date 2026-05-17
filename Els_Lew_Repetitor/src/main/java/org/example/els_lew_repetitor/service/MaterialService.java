package org.example.els_lew_repetitor.service;

import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.MaterialRequest;
import org.example.els_lew_repetitor.dto.response.MaterialResponse;
import org.example.els_lew_repetitor.entity.Material;
import org.example.els_lew_repetitor.entity.Subject;
import org.example.els_lew_repetitor.entity.User;
import org.example.els_lew_repetitor.exception.NotFoundException;
import org.example.els_lew_repetitor.repository.MaterialRepository;
import org.example.els_lew_repetitor.repository.SubjectRepository;
import org.example.els_lew_repetitor.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    @Transactional
    public MaterialResponse createMaterial(String tutorEmail, MaterialRequest request) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new NotFoundException("Репетитор не найден"));

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new NotFoundException("Предмет не найден"));
        }

        User student = null;
        if (request.getStudentId() != null) {
            student = userRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new NotFoundException("Студент не найден"));
        }

        Material material = Material.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .fileUrl(request.getFileUrl())
                .subject(subject)
                .tutor(tutor)
                .student(student)
                .build();

        return toResponse(materialRepository.save(material));
    }

    public List<MaterialResponse> getStudentMaterials(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new NotFoundException("Студент не найден"));
        return materialRepository.findByStudentOrderByCreatedAtDesc(student)
                .stream().map(this::toResponse).toList();
    }

    public List<MaterialResponse> getTutorMaterials(String tutorEmail) {
        User tutor = userRepository.findByEmail(tutorEmail)
                .orElseThrow(() -> new NotFoundException("Репетитор не найден"));
        return materialRepository.findByTutorOrderByCreatedAtDesc(tutor)
                .stream().map(this::toResponse).toList();
    }

    private MaterialResponse toResponse(Material m) {
        return MaterialResponse.builder()
                .id(m.getId())
                .title(m.getTitle())
                .description(m.getDescription())
                .fileUrl(m.getFileUrl())
                .subjectName(m.getSubject() != null ? m.getSubject().getName() : null)
                .tutorFirstName(m.getTutor().getFirstName())
                .tutorLastName(m.getTutor().getLastName())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
