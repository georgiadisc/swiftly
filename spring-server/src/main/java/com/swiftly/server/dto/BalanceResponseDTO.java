package com.swiftly.server.dto;

import java.math.BigDecimal;

public record BalanceResponseDTO(
        String message,
        BigDecimal newBalance) {
}