package com.swiftly.server.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record CardDTO(
        Integer id,
        Integer userId,
        String cardType,
        String lastFourDigits,
        LocalDate expirationDate,
        Boolean isLocked,
        Boolean isDefault,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {
}