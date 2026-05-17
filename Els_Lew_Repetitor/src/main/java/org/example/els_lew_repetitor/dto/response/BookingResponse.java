package org.example.els_lew_repetitor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.els_lew_repetitor.enums.BookingStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime slotStart;
    private LocalDateTime slotEnd;
    private String subjectName;
    private String tutorFirstName;
    private String tutorLastName;
    private String studentFirstName;
    private String studentLastName;
    private Long tutorProfileId;
    private Long studentId;
}
