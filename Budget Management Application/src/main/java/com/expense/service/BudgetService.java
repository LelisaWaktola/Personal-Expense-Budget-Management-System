package com.expense.service;

import com.expense.dto.BudgetRequest;
import com.expense.dto.BudgetResponse;
import com.expense.entity.Alert;
import com.expense.entity.Budget;
import com.expense.entity.Expense;
import com.expense.entity.User;
import com.expense.exception.BadRequestException;
import com.expense.exception.ResourceNotFoundException;
import com.expense.repository.AlertRepository;
import com.expense.repository.BudgetRepository;
import com.expense.repository.ExpenseRepository;
import com.expense.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.YearMonth;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@Transactional
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final AlertRepository alertRepository;

    public BudgetService(BudgetRepository budgetRepository,
                         UserRepository userRepository,
                         ExpenseRepository expenseRepository,
                         AlertRepository alertRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.alertRepository = alertRepository;
    }

    public BudgetResponse createBudget(Long userId, BudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (budgetRepository.findByUserIdAndCategoryAndMonth(userId, request.getCategory(), request.getMonth()).isPresent()) {
            throw new BadRequestException("Budget already exists for this category and month");
        }

        Budget budget = new Budget();
        budget.setUser(user);
        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());

        budget = budgetRepository.save(budget);
        return mapToResponse(budget, userId);
    }

    public BudgetResponse updateBudget(Long userId, Long budgetId, BudgetRequest request) {
        Budget budget = getBudgetByIdAndUserId(budgetId, userId);

        budget.setLimitAmount(request.getLimitAmount());

        budget = budgetRepository.save(budget);
        return mapToResponse(budget, userId);
    }

    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = getBudgetByIdAndUserId(budgetId, userId);
        budgetRepository.delete(budget);
    }

    public BudgetResponse getBudget(Long userId, Long budgetId) {
        Budget budget = getBudgetByIdAndUserId(budgetId, userId);
        return mapToResponse(budget, userId);
    }

    public List<BudgetResponse> getBudgetsByMonth(Long userId, String month) {
        return budgetRepository.findByUserIdAndMonth(userId, month)
                .stream()
                .map(b -> mapToResponse(b, userId))
                .toList();
    }

    public List<BudgetResponse> getAllBudgets(Long userId) {
        return budgetRepository.findByUserIdOrderByMonthDesc(userId)
                .stream()
                .map(b -> mapToResponse(b, userId))
                .toList();
    }

    public void checkAndGenerateAlerts(Long userId, Long budgetId) {
        Budget budget = getBudgetByIdAndUserId(budgetId, userId);

        YearMonth ym = YearMonth.parse(budget.getMonth());

        LocalDate start = ym.atDay(1);
        LocalDate end = ym.plusMonths(1).atDay(1);

        BigDecimal spentAmount =
                expenseRepository.findMonthlySpentByCategory(
                        userId,
                        budget.getCategory(),
                        start,
                        end
                );
        if (spentAmount == null) {
            spentAmount = BigDecimal.ZERO;
        }

        BigDecimal percentageUsed = spentAmount.divide(budget.getLimitAmount(), 2, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        checkAndCreateAlert(budget, spentAmount, percentageUsed);
    }

    private void checkAndCreateAlert(Budget budget, BigDecimal spentAmount, BigDecimal percentageUsed) {
        List<Alert> existingAlerts = alertRepository.findByBudgetId(budget.getId());

        if (percentageUsed.compareTo(BigDecimal.valueOf(80)) >= 0 &&
                percentageUsed.compareTo(BigDecimal.valueOf(100)) < 0) {
            if (existingAlerts.stream()
                    .noneMatch(a -> a.getAlertType() == Alert.AlertType.BUDGET_80_PERCENT)) {
                createAlert(budget, Alert.AlertType.BUDGET_80_PERCENT,
                        String.format("You have spent %.2f%% of your %s budget for %s",
                                percentageUsed, budget.getCategory(), budget.getMonth()));
            }
        } else if (percentageUsed.compareTo(BigDecimal.valueOf(100)) >= 0) {
            boolean hasExceededAlert = existingAlerts.stream()
                    .anyMatch(a -> a.getAlertType() == Alert.AlertType.BUDGET_EXCEEDED);

            if (!hasExceededAlert) {
                createAlert(budget, Alert.AlertType.BUDGET_EXCEEDED,
                        String.format("You have exceeded your %s budget for %s by %.2f",
                                budget.getCategory(), budget.getMonth(),
                                spentAmount.subtract(budget.getLimitAmount())));
            }
        }
    }

    private void createAlert(Budget budget, Alert.AlertType alertType, String message) {
        Alert alert = new Alert();
        alert.setUser(budget.getUser());
        alert.setBudget(budget);
        alert.setAlertType(alertType);
        alert.setMessage(message);
        alertRepository.save(alert);
    }

    private Budget getBudgetByIdAndUserId(Long budgetId, Long userId) {
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        if (!budget.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Budget not found");
        }

        return budget;
    }

    private BudgetResponse mapToResponse(Budget budget, Long userId) {
        YearMonth ym = YearMonth.parse(budget.getMonth());

        LocalDate start = ym.atDay(1);
        LocalDate end = ym.plusMonths(1).atDay(1);

        BigDecimal spentAmount =
                expenseRepository.findMonthlySpentByCategory(
                        userId,
                        budget.getCategory(),
                        start,
                        end
                );
        if (spentAmount == null) {
            spentAmount = BigDecimal.ZERO;
        }

        BigDecimal remainingAmount = budget.getLimitAmount().subtract(spentAmount);

        return BudgetResponse.builder()
                .id(budget.getId())
                .category(budget.getCategory())
                .limitAmount(budget.getLimitAmount())
                .spentAmount(spentAmount)
                .remainingAmount(remainingAmount)
                .month(budget.getMonth())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }
}
