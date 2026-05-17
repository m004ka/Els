package org.example.els_lew_repetitor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MaterialResponse {
    private Long id;
    private String title;
    private String description;
    private String fileUrl;
    private String subjectName;
    private String tutorFirstName;
    private String tutorLastName;
    private LocalDateTime createdAt;
}
