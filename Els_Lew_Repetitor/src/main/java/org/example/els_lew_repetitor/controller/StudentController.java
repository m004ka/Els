package org.example.els_lew_repetitor.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.response.ProgressResponse;
import org.example.els_lew_repetitor.service.StudentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
@Tag(name = "Кабинет студента")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/progress")
    public List<ProgressResponse> getProgress(@AuthenticationPrincipal UserDetails userDetails) {
        return studentService.getProgress(userDetails.getUsername());
    }

    @PutMapping("/progress/{subjectId}")
    public ProgressResponse updateProgress(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable Long subjectId,
                                            @RequestBody Map<String, Object> body) {
        Integer percent = body.get("progressPercent") != null
                ? ((Number) body.get("progressPercent")).intValue() : null;
        String notes = (String) body.get("notes");
        return studentService.updateProgress(userDetails.getUsername(), subjectId, percent, notes);
    }
}
