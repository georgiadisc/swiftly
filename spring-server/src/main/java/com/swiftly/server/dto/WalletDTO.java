package com.swiftly.server.dto;

import java.math.BigDecimal;

public record WalletDTO(
        BigDecimal balance,
        BigDecimal savings,
        BigDecimal stocks,
        BigDecimal bitcoin) {
}