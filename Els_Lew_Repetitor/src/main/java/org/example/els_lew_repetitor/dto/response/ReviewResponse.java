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
public class ReviewResponse {
    private Long id;
    private Double rating;
    private String comment;
    private String studentFirstName;
    private String studentLastName;
    private LocalDateTime createdAt;
}
