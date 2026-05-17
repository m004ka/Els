package org.example.els_lew_repetitor.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MaterialRequest {

    @NotBlank
    private String title;

    private String description;
    private String fileUrl;
    private Long subjectId;
    private Long studentId;
}
