package com.swiftly.server.service;

import com.swiftly.server.dto.BalanceResponseDTO;
import com.swiftly.server.dto.SavingsBalanceDTO;
import com.swiftly.server.entity.Transaction;
import com.swiftly.server.entity.User;
import com.swiftly.server.exception.InsufficientFundsException;
import com.swiftly.server.exception.ResourceNotFoundException;
import com.swiftly.server.repository.TransactionRepository;
import com.swiftly.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class SavingsService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public SavingsBalanceDTO getSavingsBalance(Integer userId) {
        log.debug("Fetching savings balance for user ID: {}", userId);
        User user = findUserById(userId);
        return new SavingsBalanceDTO(user.getSavings());
    }

    @Transactional
    public BalanceResponseDTO addToSavings(Integer userId, BigDecimal amount) {
        log.info("Processing add to savings for user ID: {}, Amount: {}", userId, amount);
        User user = findUserById(userId);

        if (user.getBalance().compareTo(amount) < 0) {
            log.warn("Insufficient cash balance to move to savings. User ID: {}, Balance: {}, Amount: {}",
                    userId, user.getBalance(), amount);
            throw new InsufficientFundsException("Insufficient cash balance to transfer to savings.");
        }

        user.setBalance(user.getBalance().subtract(amount));
        user.setSavings(user.getSavings().add(amount));
        User updatedUser = userRepository.save(user);

        logTransaction(updatedUser, "savings_in", amount, "Transfer from cash to savings");

        log.info("Add to savings successful for user ID: {}. New savings balance: {}", userId,
                updatedUser.getSavings());
        return new BalanceResponseDTO("Transfer to savings successful", updatedUser.getSavings());
    }

    @Transactional
    public BalanceResponseDTO withdrawFromSavings(Integer userId, BigDecimal amount) {
        log.info("Processing withdraw from savings for user ID: {}, Amount: {}", userId, amount);
        User user = findUserById(userId);

        if (user.getSavings().compareTo(amount) < 0) {
            log.warn("Insufficient savings balance for withdrawal. User ID: {}, Savings: {}, Amount: {}",
                    userId, user.getSavings(), amount);
            throw new InsufficientFundsException("Insufficient savings balance for withdrawal.");
        }

        user.setSavings(user.getSavings().subtract(amount));
        user.setBalance(user.getBalance().add(amount));
        User updatedUser = userRepository.save(user);

        logTransaction(updatedUser, "savings_out", amount, "Transfer from savings to cash");

        log.info("Withdraw from savings successful for user ID: {}. New cash balance: {}", userId,
                updatedUser.getBalance());
        return new BalanceResponseDTO("Withdrawal from savings successful", updatedUser.getSavings());
    }

    private User findUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });
    }

    private void logTransaction(User user, String type, BigDecimal amount, String description) {
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setType(type);
        tx.setAmount(amount);
        tx.setBalanceAfter(user.getBalance());
        tx.setDescription(description);
        transactionRepository.save(tx);
        log.debug("Transaction logged: User ID: {}, Type: {}, Amount: {}", user.getId(), type, amount);
    }
}
