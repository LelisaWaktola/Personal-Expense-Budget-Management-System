package com.expense.service;

import com.expense.dto.AlertResponse;
import com.expense.entity.Alert;
import com.expense.exception.ResourceNotFoundException;
import com.expense.repository.AlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<AlertResponse> getAllAlerts(Long userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    public List<AlertResponse> getUnacknowledgedAlerts(Long userId) {
        return alertRepository.findByUserIdAndAcknowledgedAtIsNull(userId)
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    public AlertResponse acknowledgeAlert(Long userId, Long alertId) {
        Alert alert = getAlertByIdAndUserId(alertId, userId);
        alert.setAcknowledgedAt(LocalDateTime.now());
        alert = alertRepository.save(alert);
        return mapToResponse(alert);
    }

    public void deleteAlert(Long userId, Long alertId) {
        Alert alert = getAlertByIdAndUserId(alertId, userId);
        alertRepository.delete(alert);
    }

    private Alert getAlertByIdAndUserId(Long alertId, Long userId) {
        Alert alert = alertRepository.findById(alertId)
            .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));

        if (!alert.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Alert not found");
        }

        return alert;
    }

    private AlertResponse mapToResponse(Alert alert) {
        return AlertResponse.builder()
            .id(alert.getId())
            .budgetId(alert.getBudget().getId())
            .alertType(alert.getAlertType())
            .message(alert.getMessage())
            .createdAt(alert.getCreatedAt())
            .acknowledgedAt(alert.getAcknowledgedAt())
            .build();
    }
}
