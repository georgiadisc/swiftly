package com.swiftly.server.controller;

import com.swiftly.server.dto.BalanceResponseDTO;
import com.swiftly.server.dto.CardDTO;
import com.swiftly.server.dto.CashOperationDTO;
import com.swiftly.server.dto.WalletDTO;
import com.swiftly.server.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletDTO> readWallet(@RequestParam Integer userId) {
        WalletDTO wallet = walletService.getWallet(userId);
        return ResponseEntity.ok(wallet);
    }

    @GetMapping("/cards")
    public ResponseEntity<List<CardDTO>> readCards(@RequestParam Integer userId) {
        List<CardDTO> cards = walletService.getCards(userId);
        return ResponseEntity.ok(cards);
    }

    @PostMapping("/cash/deposit")
    public ResponseEntity<BalanceResponseDTO> createCashDeposit(@Valid @RequestBody CashOperationDTO depositRequest) {
        BalanceResponseDTO response = walletService.depositCash(depositRequest.userId(), depositRequest.amount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cash/withdraw")
    public ResponseEntity<BalanceResponseDTO> createCashWithdrawal(
            @Valid @RequestBody CashOperationDTO withdrawalRequest) {
        BalanceResponseDTO response = walletService.withdrawCash(withdrawalRequest.userId(),
                withdrawalRequest.amount());
        return ResponseEntity.ok(response);
    }
}