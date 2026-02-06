package com.expense.service;

import com.expense.dto.ExpenseResponse;
import com.expense.entity.Expense;
import com.expense.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final ExpenseRepository expenseRepository;

    public ReportService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Map<String, Object> getMonthlyReport(Long userId, String month) {
        LocalDate startDate = YearMonth.parse(month).atDay(1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        List<ExpenseResponse> expenses = expenseRepository.findByUserIdAndExpenseDateBetween(userId, startDate, endDate)
            .stream()
            .map(this::mapToResponse)
            .toList();

        BigDecimal totalSpent = expenses.stream()
            .map(ExpenseResponse::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<Expense.ExpenseCategory, BigDecimal> categoryBreakdown = expenses.stream()
            .collect(Collectors.groupingBy(
                ExpenseResponse::getCategory,
                Collectors.reducing(BigDecimal.ZERO, ExpenseResponse::getAmount, BigDecimal::add)
            ));

        Map<String, Object> report = new HashMap<>();
        report.put("month", month);
        report.put("totalSpent", totalSpent);
        report.put("expenseCount", expenses.size());
        report.put("categoryBreakdown", categoryBreakdown);
        report.put("expenses", expenses);

        return report;
    }

    public Map<String, Object> getCategoryReport(Long userId, Expense.ExpenseCategory category) {
        List<ExpenseResponse> expenses = expenseRepository.findByUserIdAndCategory(userId, category)
            .stream()
            .map(this::mapToResponse)
            .toList();

        BigDecimal totalSpent = expenses.stream()
            .map(ExpenseResponse::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> report = new HashMap<>();
        report.put("category", category);
        report.put("totalSpent", totalSpent);
        report.put("expenseCount", expenses.size());
        report.put("expenses", expenses);

        return report;
    }

    public Map<String, Object> getDateRangeReport(Long userId, LocalDate startDate, LocalDate endDate) {
        List<ExpenseResponse> expenses = expenseRepository.findByUserIdAndExpenseDateBetween(userId, startDate, endDate)
            .stream()
            .map(this::mapToResponse)
            .toList();

        BigDecimal totalSpent = expenses.stream()
            .map(ExpenseResponse::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<Expense.ExpenseCategory, BigDecimal> categoryBreakdown = expenses.stream()
            .collect(Collectors.groupingBy(
                ExpenseResponse::getCategory,
                Collectors.reducing(BigDecimal.ZERO, ExpenseResponse::getAmount, BigDecimal::add)
            ));

        Map<String, Object> report = new HashMap<>();
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalSpent", totalSpent);
        report.put("expenseCount", expenses.size());
        report.put("categoryBreakdown", categoryBreakdown);
        report.put("expenses", expenses);

        return report;
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
            .id(expense.getId())
            .amount(expense.getAmount())
            .category(expense.getCategory())
            .paymentMethod(expense.getPaymentMethod())
            .expenseDate(expense.getExpenseDate())
            .description(expense.getDescription())
            .createdAt(expense.getCreatedAt())
            .updatedAt(expense.getUpdatedAt())
            .build();
    }
}
