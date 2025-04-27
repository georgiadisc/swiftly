package com.swiftly.server.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record TransactionDTO(
        Integer id,
        Integer userId,
        String type,
        BigDecimal amount,
        BigDecimal balanceAfter,
        Integer targetUserId,
        String description,
        OffsetDateTime timestamp) {
}