package com.swiftly.server.service;

import com.swiftly.server.dto.PaymentRequestDTO;
import com.swiftly.server.dto.PaymentResponseDTO;
import com.swiftly.server.entity.Payment;
import com.swiftly.server.entity.Transaction;
import com.swiftly.server.entity.User;
import com.swiftly.server.exception.InsufficientFundsException;
import com.swiftly.server.exception.ResourceNotFoundException;
import com.swiftly.server.repository.PaymentRepository;
import com.swiftly.server.repository.TransactionRepository;
import com.swiftly.server.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO request) {
        log.info("Processing payment request from {} to {} for amount {}",
                request.senderUserTag(), request.receiverUserTag(), request.amount());

        validatePaymentRequest(request);

        User sender = findUserByTag(request.senderUserTag(), "Sender");
        User receiver = findUserByTag(request.receiverUserTag(), "Receiver");

        User debitUser = "pay".equals(request.action()) ? sender : receiver;
        User creditUser = "pay".equals(request.action()) ? receiver : sender;
        BigDecimal amount = request.amount();

        checkSufficientFunds(debitUser, amount);

        updateBalances(debitUser, creditUser, amount);
        Payment savedPayment = savePaymentRecord(request, amount);
        logTransactions(sender, receiver, amount, debitUser.getBalance(), creditUser.getBalance(), request.action());

        User finalSender = userRepository.findById(sender.getId())
                .orElseThrow(() -> new IllegalStateException("Sender disappeared during transaction"));

        log.info("Payment successful. Payment ID: {}, Sender: {}, Receiver: {}",
                savedPayment.getId(), sender.getTag(), receiver.getTag());
        return new PaymentResponseDTO(finalSender.getBalance(), savedPayment);
    }

    private void validatePaymentRequest(PaymentRequestDTO request) {
        if (request.senderUserTag().equals(request.receiverUserTag())) {
            log.warn("Validation failed: Sender and receiver cannot be the same (Tag: {})", request.senderUserTag());
            throw new IllegalArgumentException("Sender and receiver cannot be the same.");
        }
    }

    private User findUserByTag(String tag, String role) {
        return userRepository.findByTag(tag)
                .orElseThrow(() -> {
                    log.warn("{} not found with tag: {}", role, tag);
                    return new ResourceNotFoundException(role + " not found with tag: " + tag);
                });
    }

    private void checkSufficientFunds(User debitUser, BigDecimal amount) {
        if (debitUser.getBalance().compareTo(amount) < 0) {
            log.warn("Insufficient funds for user: {} (Balance: {}, Amount: {})",
                    debitUser.getTag(), debitUser.getBalance(), amount);
            throw new InsufficientFundsException("Insufficient funds for user: " + debitUser.getTag());
        }
    }

    private void updateBalances(User debitUser, User creditUser, BigDecimal amount) {
        debitUser.setBalance(debitUser.getBalance().subtract(amount));
        creditUser.setBalance(creditUser.getBalance().add(amount));
        userRepository.save(debitUser);
        userRepository.save(creditUser);
        log.debug("Balances updated. Debit User: {} ({}), Credit User: {} ({})",
                debitUser.getTag(), debitUser.getBalance(), creditUser.getTag(), creditUser.getBalance());
    }

    private Payment savePaymentRecord(PaymentRequestDTO request, BigDecimal amount) {
        Payment payment = new Payment();
        payment.setSenderUserTag(request.senderUserTag());
        payment.setReceiverUserTag(request.receiverUserTag());
        payment.setNote(request.note());
        payment.setAmount(amount);
        Payment saved = paymentRepository.save(payment);
        log.debug("Payment record saved. ID: {}", saved.getId());
        return saved;
    }

    private void logTransactions(User sender, User receiver, BigDecimal amount, BigDecimal debitBalanceAfter,
            BigDecimal creditBalanceAfter, String action) {
        Transaction senderTx = createTransaction(
                sender,
                "pay".equals(action) ? "transfer_out" : "transfer_in",
                amount,
                "pay".equals(action) ? debitBalanceAfter : creditBalanceAfter,
                receiver,
                "pay".equals(action) ? "Transfer to " + receiver.getTag() : "Charge from " + receiver.getTag());

        Transaction receiverTx = createTransaction(
                receiver,
                "pay".equals(action) ? "transfer_in" : "transfer_out",
                amount,
                "pay".equals(action) ? creditBalanceAfter : debitBalanceAfter,
                sender,
                "pay".equals(action) ? "Received from " + sender.getTag() : "Charged by " + sender.getTag());

        transactionRepository.saveAll(List.of(senderTx, receiverTx));
        log.debug("Transactions logged for payment between {} and {}", sender.getTag(), receiver.getTag());
    }

    private Transaction createTransaction(User user, String type, BigDecimal amount, BigDecimal balanceAfter,
            User targetUser, String description) {
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setType(type);
        tx.setAmount(amount);
        tx.setBalanceAfter(balanceAfter);
        tx.setTargetUser(targetUser);
        tx.setDescription(description);
        return tx;
    }
}
