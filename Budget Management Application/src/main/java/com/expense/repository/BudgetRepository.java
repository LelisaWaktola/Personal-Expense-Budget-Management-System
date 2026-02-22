package com.expense.repository;

import com.expense.entity.Budget;
import com.expense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserId(Long userId);
    List<Budget> findByUserIdAndMonth(Long userId, String month);
    Optional<Budget> findByUserIdAndCategoryAndMonth(Long userId, Expense.ExpenseCategory category, String month);
    List<Budget> findByUserIdOrderByMonthDesc(Long userId);
}
