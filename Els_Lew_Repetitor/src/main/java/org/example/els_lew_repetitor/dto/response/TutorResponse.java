package org.example.els_lew_repetitor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TutorResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String username;
    private String photoUrl;
    private String bio;
    private BigDecimal pricePerHour;
    private Double rating;
    private Integer totalLessons;
    private Integer totalReviews;
    private String telegramContact;
    private String vkContact;
    private String phoneContact;
    private String cityName;
    private List<String> subjects;
}
