package com.expense.controller;

import com.expense.dto.ApiResponse;
import com.expense.entity.Expense;
import com.expense.security.UserPrincipal;
import com.expense.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/reports")
@SecurityRequirement(name = "Bearer Token")
@Tag(name = "Reports", description = "Analytics and reporting endpoints")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/monthly/{month}")
    @Operation(summary = "Get monthly spending report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMonthlyReport(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String month) {
        Map<String, Object> response = reportService.getMonthlyReport(userPrincipal.getId(), month);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get spending report by category")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCategoryReport(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Expense.ExpenseCategory category) {
        Map<String, Object> response = reportService.getCategoryReport(userPrincipal.getId(), category);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get spending report for date range")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDateRangeReport(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        Map<String, Object> response = reportService.getDateRangeReport(
            userPrincipal.getId(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
