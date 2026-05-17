package org.example.els_lew_repetitor.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

    @NotNull
    private Long slotId;

    private Long subjectId;
}
