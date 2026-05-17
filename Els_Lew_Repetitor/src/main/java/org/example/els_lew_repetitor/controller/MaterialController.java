package org.example.els_lew_repetitor.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.els_lew_repetitor.dto.request.MaterialRequest;
import org.example.els_lew_repetitor.dto.response.MaterialResponse;
import org.example.els_lew_repetitor.service.MaterialService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/materials")
@RequiredArgsConstructor
@Tag(name = "Учебные материалы")
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping
    public MaterialResponse createMaterial(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody MaterialRequest request) {
        return materialService.createMaterial(userDetails.getUsername(), request);
    }

    @GetMapping("/my")
    public List<MaterialResponse> getMyMaterials(@AuthenticationPrincipal UserDetails userDetails) {
        return materialService.getStudentMaterials(userDetails.getUsername());
    }

    @GetMapping("/tutor")
    public List<MaterialResponse> getTutorMaterials(@AuthenticationPrincipal UserDetails userDetails) {
        return materialService.getTutorMaterials(userDetails.getUsername());
    }
}
