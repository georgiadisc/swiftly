package com.swiftly.server.controller;

import com.swiftly.server.dto.BalanceResponseDTO;
import com.swiftly.server.dto.SavingsBalanceDTO;
import com.swiftly.server.dto.SavingsOperationDTO;
import com.swiftly.server.service.SavingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/savings")
@RequiredArgsConstructor
public class SavingsController {

    private final SavingsService savingsService;

    @GetMapping
    public ResponseEntity<SavingsBalanceDTO> getSavings(@RequestParam Integer userId) {
        SavingsBalanceDTO savingsBalance = savingsService.getSavingsBalance(userId);
        return ResponseEntity.ok(savingsBalance);
    }

    @PostMapping("/deposit")
    public ResponseEntity<BalanceResponseDTO> createSavingsDeposit(
            @Valid @RequestBody SavingsOperationDTO depositRequest) {
        BalanceResponseDTO response = savingsService.addToSavings(depositRequest.userId(), depositRequest.amount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<BalanceResponseDTO> createSavingsWithdrawal(
            @Valid @RequestBody SavingsOperationDTO withdrawalRequest) {
        BalanceResponseDTO response = savingsService.withdrawFromSavings(withdrawalRequest.userId(),
                withdrawalRequest.amount());
        return ResponseEntity.ok(response);
    }
}