package com.swiftly.server.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record CashOperationDTO(
        @NotNull Integer userId,
        @NotNull @Positive BigDecimal amount) {
}