package com.swiftly.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;

public record PaymentRequestDTO(
        @NotBlank @Pattern(regexp = "pay|charge", message = "Action must be 'pay' or 'charge'") String action,
        @NotBlank String senderUserTag,
        @NotBlank String receiverUserTag,
        @NotBlank String note,
        @NotNull @Positive BigDecimal amount) {
}