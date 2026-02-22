package com.expense.controller;

import com.expense.dto.ApiResponse;
import com.expense.dto.BudgetRequest;
import com.expense.dto.BudgetResponse;
import com.expense.security.UserPrincipal;
import com.expense.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
@SecurityRequirement(name = "Bearer Token")
@Tag(name = "Budgets", description = "Budget management endpoints")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    @Operation(summary = "Create a new budget")
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.createBudget(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Budget created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all budgets for user")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getAllBudgets(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<BudgetResponse> response = budgetService.getAllBudgets(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get budget by ID")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudget(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        BudgetResponse response = budgetService.getBudget(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a budget")
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.updateBudget(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Budget updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a budget")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        budgetService.deleteBudget(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Budget deleted successfully", null));
    }

    @GetMapping("/month/{month}")
    @Operation(summary = "Get budgets by month")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgetsByMonth(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String month) {
        List<BudgetResponse> response = budgetService.getBudgetsByMonth(userPrincipal.getId(), month);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/check-alerts")
    @Operation(summary = "Check and generate alerts for budget")
    public ResponseEntity<ApiResponse<Void>> checkAndGenerateAlerts(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        budgetService.checkAndGenerateAlerts(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Alerts checked and generated", null));
    }
}
