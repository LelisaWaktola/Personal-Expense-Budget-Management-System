package com.expense.service;

import com.expense.dto.ExpenseRequest;
import com.expense.dto.ExpenseResponse;
import com.expense.entity.Expense;
import com.expense.entity.User;
import com.expense.exception.ResourceNotFoundException;
import com.expense.repository.ExpenseRepository;
import com.expense.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public ExpenseResponse createExpense(Long userId, ExpenseRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Expense expense = new Expense();
        expense.setUser(user);
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    public ExpenseResponse updateExpense(Long userId, Long expenseId, ExpenseRequest request) {
        Expense expense = getExpenseByIdAndUserId(expenseId, userId);

        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    public void deleteExpense(Long userId, Long expenseId) {
        Expense expense = getExpenseByIdAndUserId(expenseId, userId);
        expenseRepository.delete(expense);
    }

    public ExpenseResponse getExpense(Long userId, Long expenseId) {
        Expense expense = getExpenseByIdAndUserId(expenseId, userId);
        return mapToResponse(expense);
    }

    public Page<ExpenseResponse> getExpenses(Long userId, Pageable pageable) {
        return expenseRepository.findByUserId(userId, pageable)
            .map(this::mapToResponse);
    }

    public List<ExpenseResponse> getExpensesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserIdAndExpenseDateBetween(userId, startDate, endDate)
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    public List<ExpenseResponse> getExpensesByCategory(Long userId, Expense.ExpenseCategory category) {
        return expenseRepository.findByUserIdAndCategory(userId, category)
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    private Expense getExpenseByIdAndUserId(Long expenseId, Long userId) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        if (!expense.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Expense not found");
        }

        return expense;
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
