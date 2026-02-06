package com.expense.controller;

import com.expense.dto.AlertResponse;
import com.expense.dto.ApiResponse;
import com.expense.security.UserPrincipal;
import com.expense.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
@SecurityRequirement(name = "Bearer Token")
@Tag(name = "Alerts", description = "Budget alert endpoints")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    @Operation(summary = "Get all alerts for user")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAllAlerts(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<AlertResponse> response = alertService.getAllAlerts(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/unacknowledged")
    @Operation(summary = "Get unacknowledged alerts")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getUnacknowledgedAlerts(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<AlertResponse> response = alertService.getUnacknowledgedAlerts(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/acknowledge")
    @Operation(summary = "Acknowledge an alert")
    public ResponseEntity<ApiResponse<AlertResponse>> acknowledgeAlert(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        AlertResponse response = alertService.acknowledgeAlert(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Alert acknowledged", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an alert")
    public ResponseEntity<ApiResponse<Void>> deleteAlert(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        alertService.deleteAlert(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Alert deleted", null));
    }
}
