package com.swiftly.server.dto;

import com.swiftly.server.entity.Payment;
import java.math.BigDecimal;

public record PaymentResponseDTO(
        BigDecimal balance,
        Payment payment) {
}