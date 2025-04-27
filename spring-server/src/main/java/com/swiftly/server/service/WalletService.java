package com.swiftly.server.service;

import com.swiftly.server.dto.BalanceResponseDTO;
import com.swiftly.server.dto.CardDTO;
import com.swiftly.server.dto.WalletDTO;
import com.swiftly.server.entity.Card;
import com.swiftly.server.entity.Transaction;
import com.swiftly.server.entity.User;
import com.swiftly.server.exception.InsufficientFundsException;
import com.swiftly.server.exception.ResourceNotFoundException;
import com.swiftly.server.repository.TransactionRepository;
import com.swiftly.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class WalletService {

    private static final Logger log = LoggerFactory.getLogger(WalletService.class);

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public WalletDTO getWallet(Integer userId) {
        log.debug("Fetching wallet for user ID: {}", userId);
        User user = findUserById(userId);
        return new WalletDTO(user.getBalance(), user.getSavings(), user.getStocks(), user.getBitcoin());
    }

    public List<CardDTO> getCards(Integer userId) {
        log.debug("Fetching cards for user ID: {}", userId);
        User user = findUserById(userId);
        List<Card> cards = user.getCards();
        return cards.stream()
                .map(this::mapCardToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BalanceResponseDTO depositCash(Integer userId, BigDecimal amount) {
        log.info("Processing cash deposit for user ID: {}, Amount: {}", userId, amount);
        User user = findUserById(userId);

        user.setBalance(user.getBalance().add(amount));
        User updatedUser = userRepository.save(user);

        logTransaction(updatedUser, "cash_in", amount, "Deposit to cash");

        log.info("Cash deposit successful for user ID: {}. New balance: {}", userId, updatedUser.getBalance());
        return new BalanceResponseDTO("Deposit successful", updatedUser.getBalance());
    }

    @Transactional
    public BalanceResponseDTO withdrawCash(Integer userId, BigDecimal amount) {
        log.info("Processing cash withdrawal for user ID: {}, Amount: {}", userId, amount);
        User user = findUserById(userId);

        if (user.getBalance().compareTo(amount) < 0) {
            log.warn("Insufficient funds for withdrawal. User ID: {}, Balance: {}, Amount: {}",
                    userId, user.getBalance(), amount);
            throw new InsufficientFundsException("Insufficient funds for withdrawal.");
        }

        user.setBalance(user.getBalance().subtract(amount));
        User updatedUser = userRepository.save(user);

        logTransaction(updatedUser, "cash_out", amount, "Withdraw from cash");

        log.info("Cash withdrawal successful for user ID: {}. New balance: {}", userId, updatedUser.getBalance());
        return new BalanceResponseDTO("Withdrawal successful", updatedUser.getBalance());
    }

    private User findUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });
    }

    private CardDTO mapCardToDTO(Card card) {
        Integer userId = Objects.requireNonNull(card.getUser(), "Card user cannot be null").getId();

        return new CardDTO(
                card.getId(),
                userId,
                card.getCardType(),
                card.getLastFourDigits(),
                card.getExpirationDate(),
                card.getIsLocked(),
                card.getIsDefault(),
                card.getCreatedAt(),
                card.getUpdatedAt());
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