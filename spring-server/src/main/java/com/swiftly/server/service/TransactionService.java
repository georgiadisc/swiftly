package com.swiftly.server.service;

import com.swiftly.server.dto.TransactionDTO;
import com.swiftly.server.entity.Transaction;
import com.swiftly.server.exception.ResourceNotFoundException;
import com.swiftly.server.repository.TransactionRepository;
import com.swiftly.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<TransactionDTO> getTransactionsByUserId(Integer userId) {
        log.debug("Fetching transactions for user ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            log.warn("Attempted to fetch transactions for non-existent user ID: {}", userId);
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        List<Transaction> transactions = transactionRepository.findByUserId(userId,
                Sort.by(Sort.Direction.DESC, "timestamp"));

        log.info("Found {} transactions for user ID: {}", transactions.size(), userId);
        return transactions.stream()
                .map(this::mapTransactionToDTO)
                .collect(Collectors.toList());
    }

    private TransactionDTO mapTransactionToDTO(Transaction transaction) {
        Integer userId = Objects.requireNonNull(transaction.getUser(), "Transaction user cannot be null").getId();
        Integer targetUserId = (transaction.getTargetUser() != null) ? transaction.getTargetUser().getId() : null;

        return new TransactionDTO(
                transaction.getId(),
                userId,
                transaction.getType(),
                transaction.getAmount(),
                transaction.getBalanceAfter(),
                targetUserId,
                transaction.getDescription(),
                transaction.getTimestamp());
    }
}
