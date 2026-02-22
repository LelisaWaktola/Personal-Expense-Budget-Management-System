package com.expense.repository;

import com.expense.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    Page<Expense> findByUserId(Long userId, Pageable pageable);

    List<Expense> findByUserIdAndExpenseDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<Expense> findByUserIdAndCategory(Long userId, Expense.ExpenseCategory category);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.category = :category AND FUNCTION('DATE_TRUNC', 'month', e.expenseDate) = FUNCTION('DATE_TRUNC', 'month', :date)")
    BigDecimal findMonthlySpentByCategory(@Param("userId") Long userId,
                                          @Param("category") Expense.ExpenseCategory category,
                                          @Param("date") LocalDate date);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND FUNCTION('DATE_TRUNC', 'month', e.expenseDate) = FUNCTION('DATE_TRUNC', 'month', :date)")
    BigDecimal findMonthlySpentTotal(@Param("userId") Long userId, @Param("date") LocalDate date);
}
