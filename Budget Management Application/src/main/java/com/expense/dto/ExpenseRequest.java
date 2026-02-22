package com.expense.dto;

import com.expense.entity.Expense;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequest {

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;

    @NotNull
    private Expense.ExpenseCategory category;

    @NotNull
    private Expense.PaymentMethod paymentMethod;

    @NotNull
    private LocalDate expenseDate;

    @NotBlank
    private String description;
}
