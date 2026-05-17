package org.example.els_lew_repetitor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalStudents;
    private long totalTutors;
    private long totalBookings;
    private long completedLessons;
    private long totalReviews;
    private Double avgRating;
    private List<Map<String, Object>> bookingsByStatus;
    private List<Map<String, Object>> tutorsByCity;
    private List<UserResponse> recentUsers;
    private List<BookingResponse> recentBookings;
}
