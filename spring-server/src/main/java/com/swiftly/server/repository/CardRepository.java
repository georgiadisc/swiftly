package com.swiftly.server.repository;

import com.swiftly.server.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Integer> {
    List<Card> findByUserId(Integer userId);

    Optional<Card> findByLastFourDigits(String lastFourDigits);
}