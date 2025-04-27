package com.swiftly.server.repository;

import com.swiftly.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByTag(String tag);

    Optional<User> findByEmail(String email);
}