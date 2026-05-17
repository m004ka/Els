package org.example.els_lew_repetitor.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.response.SubjectResponse;
import org.example.els_lew_repetitor.service.SubjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
@Tag(name = "Предметы")
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public List<SubjectResponse> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/by-city/{cityId}")
    public List<SubjectResponse> getSubjectsByCity(@PathVariable Long cityId) {
        return subjectService.getSubjectsByCity(cityId);
    }
}
