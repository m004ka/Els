package org.example.els_lew_repetitor.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class TutorProfileRequest {
    private String bio;
    private String photoUrl;
    private BigDecimal pricePerHour;
    private String telegramContact;
    private String vkContact;
    private String phoneContact;
    private Long cityId;
    private Set<Long> subjectIds;
}
