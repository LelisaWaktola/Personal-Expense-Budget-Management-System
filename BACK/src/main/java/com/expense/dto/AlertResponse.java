package com.expense.dto;

import com.expense.entity.Alert;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertResponse {
    private Long id;
    private Long budgetId;
    private Alert.AlertType alertType;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime acknowledgedAt;
}
