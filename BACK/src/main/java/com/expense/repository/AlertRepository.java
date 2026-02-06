package com.expense.repository;

import com.expense.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUserId(Long userId);
    List<Alert> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Alert> findByBudgetId(Long budgetId);
    List<Alert> findByUserIdAndAcknowledgedAtIsNull(Long userId);
}
