package com.swiftly.server.config;

import com.swiftly.server.entity.Card;
import com.swiftly.server.entity.User;
import com.swiftly.server.repository.CardRepository;
import com.swiftly.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CardRepository cardRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting data seeding...");
        seedUsers();
        seedCards();
        log.info("Data seeding finished.");
    }

    private void seedUsers() {
        if (userRepository.findByEmail("craig.turner@example.com").isEmpty()) {
            log.info("Seeding user Craig Turner...");
            User user1 = new User();
            user1.setName("Craig Turner");
            user1.setTag("$craig.turner");
            user1.setAddress("123 Main St, Anytown, USA");
            user1.setEmail("craig.turner@example.com");
            user1.setPhone("555-1111");
            user1.setBalance(new BigDecimal("1500.00"));
            user1.setSavings(new BigDecimal("5000.00"));
            user1.setStocks(new BigDecimal("2500.00"));
            user1.setBitcoin(new BigDecimal("0.5"));
            user1.setCards(new ArrayList<>());
            user1.setTransactions(new ArrayList<>());
            userRepository.save(user1);
        }

        if (userRepository.findByEmail("susan.allen@example.com").isEmpty()) {
            log.info("Seeding user Susan Allen...");
            User user2 = new User();
            user2.setName("Susan Allen");
            user2.setTag("$susan.allen");
            user2.setAddress("456 Oak Ave, Anytown, USA");
            user2.setEmail("susan.allen@example.com");
            user2.setPhone("555-2222");
            user2.setBalance(new BigDecimal("2200.75"));
            user2.setSavings(new BigDecimal("10000.00"));
            user2.setStocks(new BigDecimal("0.00"));
            user2.setBitcoin(new BigDecimal("0.00"));
            user2.setCards(new ArrayList<>());
            user2.setTransactions(new ArrayList<>());
            userRepository.save(user2);
        }
    }

    private void seedCards() {
        User user1 = userRepository.findByTag("$craig.turner").orElse(null);
        User user2 = userRepository.findByTag("$susan.allen").orElse(null);

        if (user1 != null && cardRepository.findByLastFourDigits("1111").isEmpty()) {
            log.info("Seeding card 1111 for Craig Turner...");
            Card card1 = new Card();
            card1.setUser(user1);
            card1.setCardType("Visa");
            card1.setLastFourDigits("1111");
            card1.setExpirationDate(LocalDate.of(2027, 12, 31));
            card1.setIsLocked(false);
            card1.setIsDefault(true);
            cardRepository.save(card1);
        }

        if (user2 != null && cardRepository.findByLastFourDigits("2222").isEmpty()) {
            log.info("Seeding card 2222 for Susan Allen...");
            Card card2 = new Card();
            card2.setUser(user2);
            card2.setCardType("Mastercard");
            card2.setLastFourDigits("2222");
            card2.setExpirationDate(LocalDate.of(2028, 6, 30));
            card2.setIsLocked(false);
            card2.setIsDefault(true);
            cardRepository.save(card2);
        }
    }
}