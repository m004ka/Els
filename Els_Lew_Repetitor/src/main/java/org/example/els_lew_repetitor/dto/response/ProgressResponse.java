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
public class ProgressResponse {
    private Long id;
    private String subjectName;
    private Integer progressPercent;
    private String notes;
    private LocalDateTime updatedAt;
}
